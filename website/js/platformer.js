// ==========================================================
// 🦁 SUPER ANIMAL RUN - Jeu de plateforme (Platformer Game)
// Un jeu style Super Mario avec des animaux qui attaquent!
// ==========================================================

(function () {
  'use strict';

  // === CANVAS & CONTEXT (Toile et contexte) ===
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return; // Pas sur la bonne page (Not on the right page)
  const ctx = canvas.getContext('2d');

  // === CONSTANTES DU JEU (Game constants) ===
  const GAME_W = 800;            // Largeur du canvas (Canvas width)
  const GAME_H = 450;            // Hauteur du canvas (Canvas height)
  const TILE = 32;               // Taille d'une tuile (Tile size)
  const GRAVITY = 0.6;           // Gravité (Gravity)
  const JUMP_FORCE = -12;        // Force du saut (Jump force)
  const PLAYER_SPEED = 5;        // Vitesse du joueur (Player speed)
  const LEVEL_WIDTH = 3200;      // Largeur du niveau (Level width)

  // === COULEURS (Colors) ===
  const COLORS = {
    sky: '#1a0a2e',
    skyGrad1: '#1a0a2e',
    skyGrad2: '#2d1b69',
    skyGrad3: '#0f3460',
    ground: '#2d5a27',
    groundDark: '#1e3d1a',
    dirt: '#8B4513',
    dirtDark: '#654321',
    platform: '#4a9e3f',
    platformEdge: '#3a7e2f',
    platformTop: '#5cb850',
    coin: '#FFE66D',
    coinShine: '#FFF9C4',
    player: '#FF6F91',
    playerDark: '#cc4466',
    playerEye: '#FFFFFF',
    playerPupil: '#1A1A2E',
    flagPole: '#888888',
    flagColor: '#FF6F91',
    textWhite: '#FFFFFF',
    textCyan: '#00D4FF',
    textPink: '#FF6F91',
    textYellow: '#FFE66D',
    textGreen: '#4ECDC4',
    overlay: 'rgba(26, 10, 46, 0.85)',
    // Couleurs des animaux (Animal colors)
    snake: '#4CAF50',
    snakeDark: '#2E7D32',
    snakeEye: '#FFEB3B',
    eagle: '#795548',
    eagleDark: '#5D4037',
    eagleBeak: '#FF9800',
    boar: '#8D6E63',
    boarDark: '#6D4C41',
    boarTusk: '#ECEFF1',
    bat: '#6A1B9A',
    batDark: '#4A148C',
    batEye: '#FF1744',
    // Couleurs des boss (Boss colors)
    lion: '#D4A017',
    lionDark: '#B8860B',
    lionMane: '#8B6914',
    tiger: '#FF8C00',
    tigerDark: '#CC5500',
    tigerStripe: '#1A1A2E',
    bossHealthBar: '#FF1744',
    bossHealthBg: '#333333',
  };

  // === ÉTAT DU JEU (Game state) ===
  const STATE = {
    MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAMEOVER: 3,
    LEVELWIN: 4,
  };

  let gameState = STATE.MENU;
  let score = 0;
  let coins = 0;
  let lives = 3;
  let level = 1;
  let cameraX = 0;
  let frameCount = 0;
  let shakeTimer = 0;
  let particles = [];
  let bestScore = 0;  // Meilleur score sauvegardé (Best saved score)
  let notification = '';    // Message temporaire sur le canvas (Temporary canvas message)
  let notificationTimer = 0;

  // === BOSS ===
  let boss = null;      // Le boss du niveau (Level boss)

  // === ENTRÉES CLAVIER (Keyboard inputs) ===
  const keys = {};
  document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    console.log('Touche pressée:', e.key, 'état du jeu:', gameState);
    // Empêcher le scroll de la page (Prevent page scroll)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    // Commencer/relancer le jeu (Start/restart game)
    if (e.key === ' ') {
      if (gameState === STATE.MENU) startGame();
      else if (gameState === STATE.GAMEOVER) restartGame();
      else if (gameState === STATE.LEVELWIN) nextLevel();
    }
    // Charger la sauvegarde depuis le menu (Load save from menu)
    if (e.key === 'c' || e.key === 'C') {
      if (gameState === STATE.MENU && hasSaveGame()) {
        console.log('Touche C: chargement...');
        continueGame();
      } else if (gameState === STATE.MENU && !hasSaveGame()) {
        showNotification('❌ Pas de sauvegarde!');
        console.log('Touche C: pas de sauvegarde');
      }
    }
    // Sauvegarder pendant le jeu (Save during game)
    if (e.key === 's' || e.key === 'S') {
      if (gameState === STATE.PLAYING || gameState === STATE.PAUSED) {
        console.log('Touche S: sauvegarde...');
        saveGame();
      } else {
        console.log('Touche S: pas en jeu, state=', gameState);
      }
    }
    // Pause
    if (e.key === 'p' || e.key === 'P') {
      if (gameState === STATE.PLAYING) gameState = STATE.PAUSED;
      else if (gameState === STATE.PAUSED) gameState = STATE.PLAYING;
    }
  });
  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  // === JOUEUR (Player) ===
  let player = {
    x: 100, y: 300,
    w: 28, h: 32,
    vx: 0, vy: 0,
    onGround: false,
    facing: 1,         // 1 = droite, -1 = gauche (1 = right, -1 = left)
    walkFrame: 0,
    walkTimer: 0,
    jumping: false,
    invincible: 0,     // Frames d'invincibilité (Invincibility frames)
    squash: 1,         // Effet d'écrasement pour le saut (Squash effect for jump)
  };

  // === PLATEFORMES (Platforms) ===
  let platforms = [];
  // === PIÈCES (Coins) ===
  let coinList = [];
  // === ENNEMIS (Enemies) ===
  let enemies = [];
  // === DRAPEAU DE FIN (End flag) ===
  let flag = { x: 0, y: 0 };
  // === NUAGES DÉCORATIFS (Decorative clouds) ===
  let clouds = [];
  // === MONTAGNES D'ARRIÈRE-PLAN (Background mountains) ===
  let mountains = [];
  // === ÉTOILES (Stars) ===
  let stars = [];

  // === GÉNÉRATION D'ÉTOILES (Star generation) ===
  function generateStars() {
    stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * LEVEL_WIDTH,
        y: Math.random() * GAME_H * 0.6,
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  // === GÉNÉRATION DE NUAGES (Cloud generation) ===
  function generateClouds() {
    clouds = [];
    for (let i = 0; i < 12; i++) {
      clouds.push({
        x: Math.random() * LEVEL_WIDTH,
        y: 30 + Math.random() * 100,
        w: 60 + Math.random() * 80,
        h: 20 + Math.random() * 20,
        speed: 0.1 + Math.random() * 0.3,
      });
    }
  }

  // === GÉNÉRATION DE MONTAGNES (Mountain generation) ===
  function generateMountains() {
    mountains = [];
    for (let i = 0; i < 8; i++) {
      mountains.push({
        x: i * 450 + Math.random() * 100,
        w: 200 + Math.random() * 150,
        h: 80 + Math.random() * 100,
      });
    }
  }

  // === GÉNÉRATION DE NIVEAU (Level generation) ===
  function generateLevel(lvl) {
    platforms = [];
    coinList = [];
    enemies = [];

    // Sol de base (Ground floor)
    // Créer des segments de sol avec des trous (Create ground segments with gaps)
    let groundX = 0;
    while (groundX < LEVEL_WIDTH) {
      const segLen = 150 + Math.random() * 300;
      platforms.push({
        x: groundX, y: GAME_H - TILE,
        w: segLen, h: TILE,
        type: 'ground',
      });
      groundX += segLen;
      // Trou dans le sol (Gap in ground) - plus fréquent aux niveaux élevés
      if (groundX > 300 && groundX < LEVEL_WIDTH - 400 && Math.random() < 0.3 + lvl * 0.05) {
        groundX += 80 + Math.random() * 60;
      }
    }

    // Plateformes flottantes (Floating platforms)
    const numPlatforms = 12 + lvl * 3;
    for (let i = 0; i < numPlatforms; i++) {
      const px = 200 + Math.random() * (LEVEL_WIDTH - 400);
      const py = 120 + Math.random() * (GAME_H - 200);
      const pw = 64 + Math.random() * 96;
      platforms.push({
        x: px, y: py,
        w: pw, h: 16,
        type: 'float',
      });

      // Mettre une pièce au-dessus de certaines plateformes (Put coin above some platforms)
      if (Math.random() < 0.6) {
        coinList.push({
          x: px + pw / 2 - 8,
          y: py - 30,
          w: 16, h: 16,
          collected: false,
          bobOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Pièces au sol (Ground coins)
    for (let i = 0; i < 8 + lvl * 2; i++) {
      coinList.push({
        x: 200 + Math.random() * (LEVEL_WIDTH - 400),
        y: GAME_H - TILE - 30,
        w: 16, h: 16,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // Ennemis animaux (Animal enemies)
    const enemyCount = 3 + lvl * 2;
    const animalTypes = ['snake', 'eagle', 'boar', 'bat'];
    for (let i = 0; i < enemyCount; i++) {
      const type = animalTypes[Math.floor(Math.random() * Math.min(animalTypes.length, 2 + lvl))];
      let ex = 400 + Math.random() * (LEVEL_WIDTH - 600);
      let ey;

      if (type === 'eagle' || type === 'bat') {
        ey = 60 + Math.random() * 150;
      } else {
        ey = GAME_H - TILE - 28;
      }

      enemies.push({
        x: ex, y: ey,
        w: 30, h: 26,
        vx: (type === 'boar' ? 2.5 : 1.2) * (Math.random() < 0.5 ? 1 : -1),
        vy: 0,
        type: type,
        alive: true,
        onGround: false,    // Au sol? (On ground?)
        startX: ex,
        startY: ey,
        patrolRange: 100 + Math.random() * 150,
        animTimer: Math.random() * Math.PI * 2,
        // Propriétés spéciales pour l'aigle (Special eagle properties)
        diving: false,
        diveTimer: 0,
      });
    }

    // === BOSS DE FIN DE NIVEAU (End of level boss) ===
    const bossTypes = ['lion', 'tiger'];
    const bossType = bossTypes[(lvl - 1) % bossTypes.length];
    const bossHP = 3 + lvl;  // Plus de vie à chaque niveau (More HP each level)
    boss = {
      x: LEVEL_WIDTH - 350,
      y: GAME_H - TILE - 56,
      w: 56, h: 52,
      vx: 1.5 + lvl * 0.3,
      vy: 0,
      type: bossType,
      alive: true,
      hp: bossHP,
      maxHp: bossHP,
      onGround: false,
      startX: LEVEL_WIDTH - 350,
      patrolRange: 120,
      animTimer: 0,
      hitTimer: 0,        // Flash rouge quand touché (Red flash when hit)
      chargeTimer: 0,     // Timer pour la charge (Charge timer)
      charging: false,    // En train de charger? (Is charging?)
      roarTimer: 0,       // Timer du rugissement (Roar timer)
    };

    // Drapeau de fin (End flag) — derrière le boss
    flag = { x: LEVEL_WIDTH - 150, y: GAME_H - TILE - 64 };

    // Décor (Decorations)
    generateStars();
    generateClouds();
    generateMountains();
  }

  // === SAUVEGARDE (Save system) ===
  function saveGame() {
    const saveData = {
      score: score,
      coins: coins,
      lives: lives,
      level: level,
      bestScore: Math.max(bestScore, score),
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem('superAnimalRun_save', JSON.stringify(saveData));
      localStorage.setItem('superAnimalRun_best', String(Math.max(bestScore, score)));
      showNotification('💾 Sauvegardé!');
      updateMessage('💾 Partie sauvegardée!');
      console.log('Sauvegarde OK:', saveData);
    } catch (err) {
      showNotification('❌ Erreur sauvegarde');
      console.warn('Erreur de sauvegarde:', err);
    }
  }

  function loadGame() {
    try {
      const data = localStorage.getItem('superAnimalRun_save');
      const best = localStorage.getItem('superAnimalRun_best');
      if (best) bestScore = parseInt(best, 10) || 0;
      if (!data) return false;
      const save = JSON.parse(data);
      score = save.score || 0;
      coins = save.coins || 0;
      lives = save.lives || 3;
      level = save.level || 1;
      bestScore = Math.max(bestScore, save.bestScore || 0);
      return true;
    } catch (err) {
      console.warn('Erreur de chargement:', err);
      return false;
    }
  }

  function hasSaveGame() {
    return localStorage.getItem('superAnimalRun_save') !== null;
  }

  function deleteSave() {
    localStorage.removeItem('superAnimalRun_save');
  }

  // Charger le meilleur score au démarrage (Load best score at start)
  (function() {
    const best = localStorage.getItem('superAnimalRun_best');
    if (best) bestScore = parseInt(best, 10) || 0;
  })();

  // === DÉMARRER LE JEU (Start game) ===
  function startGame() {
    gameState = STATE.PLAYING;
    score = 0;
    coins = 0;
    lives = 3;
    level = 1;
    resetPlayer();
    generateLevel(level);
    updateHUD();
  }

  function continueGame() {
    if (loadGame()) {
      gameState = STATE.PLAYING;
      resetPlayer();
      generateLevel(level);
      updateHUD();
      showNotification('📂 Partie chargée!');
      updateMessage('📂 Partie chargée! Niveau ' + level);
      console.log('Chargement OK: niveau', level, 'score', score);
    }
  }

  function restartGame() {
    startGame();
  }

  function nextLevel() {
    level++;
    resetPlayer();
    generateLevel(level);
    gameState = STATE.PLAYING;
    saveGame();  // Sauvegarder automatiquement entre les niveaux (Auto-save between levels)
    updateHUD();
  }

  function resetPlayer() {
    player.x = 100;
    player.y = GAME_H - TILE - player.h - 10;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.facing = 1;
    player.invincible = 0;
    player.squash = 1;
    cameraX = 0;
  }

  // === PARTICULES (Particles) ===
  function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * -5 - 2,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: color,
        size: 2 + Math.random() * 4,
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - cameraX, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  // === MISE À JOUR DU JOUEUR (Player update) ===
  function updatePlayer() {
    // Mouvement horizontal (Horizontal movement)
    player.vx = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      player.vx = -PLAYER_SPEED;
      player.facing = -1;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      player.vx = PLAYER_SPEED;
      player.facing = 1;
    }

    // Saut (Jump)
    if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
      player.jumping = true;
      player.squash = 0.6;
    }

    // Gravité (Gravity)
    player.vy += GRAVITY;
    if (player.vy > 12) player.vy = 12;

    // Position
    player.x += player.vx;
    player.y += player.vy;

    // Effet d'écrasement au saut (Squash effect)
    player.squash += (1 - player.squash) * 0.15;

    // Animation de marche (Walk animation)
    if (Math.abs(player.vx) > 0 && player.onGround) {
      player.walkTimer++;
      if (player.walkTimer > 6) {
        player.walkTimer = 0;
        player.walkFrame = (player.walkFrame + 1) % 4;
      }
    } else {
      player.walkFrame = 0;
    }

    // Collision avec plateformes (Platform collision)
    player.onGround = false;
    platforms.forEach((plat) => {
      if (
        player.x + player.w > plat.x &&
        player.x < plat.x + plat.w &&
        player.y + player.h > plat.y &&
        player.y + player.h < plat.y + plat.h + 10 &&
        player.vy >= 0
      ) {
        player.y = plat.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.jumping = false;
        if (player.squash < 0.8) {
          player.squash = 1.2; // Rebond à l'atterrissage (Bounce on landing)
        }
      }
      // Collision par le bas (Bottom collision)
      if (
        player.x + player.w > plat.x &&
        player.x < plat.x + plat.w &&
        player.y < plat.y + plat.h &&
        player.y > plat.y &&
        player.vy < 0
      ) {
        player.y = plat.y + plat.h;
        player.vy = 1;
      }
      // Collision latérale (Side collision)
      if (
        player.y + player.h > plat.y + 4 &&
        player.y < plat.y + plat.h - 4
      ) {
        if (
          player.x + player.w > plat.x &&
          player.x + player.w < plat.x + 8 &&
          player.vx > 0
        ) {
          player.x = plat.x - player.w;
        }
        if (
          player.x < plat.x + plat.w &&
          player.x > plat.x + plat.w - 8 &&
          player.vx < 0
        ) {
          player.x = plat.x + plat.w;
        }
      }
    });

    // Limites du niveau (Level boundaries)
    if (player.x < 0) player.x = 0;
    if (player.x > LEVEL_WIDTH - player.w) player.x = LEVEL_WIDTH - player.w;

    // Tombé dans le vide (Fell off the map)
    if (player.y > GAME_H + 50) {
      loseLife();
    }

    // Invincibilité (Invincibility)
    if (player.invincible > 0) player.invincible--;

    // Caméra (Camera)
    const targetCam = player.x - GAME_W / 3;
    cameraX += (targetCam - cameraX) * 0.1;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > LEVEL_WIDTH - GAME_W) cameraX = LEVEL_WIDTH - GAME_W;
  }

  // === COLLISION PIÈCES (Coin collision) ===
  function checkCoins() {
    coinList.forEach((c) => {
      if (c.collected) return;
      if (
        player.x + player.w > c.x &&
        player.x < c.x + c.w &&
        player.y + player.h > c.y &&
        player.y < c.y + c.h
      ) {
        c.collected = true;
        coins++;
        score += 10;
        spawnParticles(c.x + 8, c.y + 8, COLORS.coin, 8);
        updateHUD();
      }
    });
  }

  // === MISE À JOUR DES ENNEMIS (Enemy update) ===
  function updateEnemies() {
    enemies.forEach((e) => {
      if (!e.alive) return;
      e.animTimer += 0.05;

      switch (e.type) {
        case 'snake':
        case 'boar':
          // Gravité pour les animaux au sol (Gravity for ground animals)
          e.vy += GRAVITY;
          if (e.vy > 10) e.vy = 10;
          e.y += e.vy;

          // Collision avec les plateformes (Platform collision)
          e.onGround = false;
          for (let pi = 0; pi < platforms.length; pi++) {
            const plat = platforms[pi];
            if (
              e.x + e.w > plat.x &&
              e.x < plat.x + plat.w &&
              e.y + e.h > plat.y &&
              e.y + e.h < plat.y + plat.h + 10 &&
              e.vy >= 0
            ) {
              e.y = plat.y - e.h;
              e.vy = 0;
              e.onGround = true;
            }
          }

          // Mouvement horizontal (Horizontal movement)
          e.x += e.vx;

          // Demi-tour aux murs des plateformes (Turn at platform walls only)
          // Pas de détection de bord → ils tombent dans les trous!
          // (No edge detection → they fall into holes!)
          for (let pi = 0; pi < platforms.length; pi++) {
            const plat = platforms[pi];
            if (
              e.y + e.h > plat.y + 4 &&
              e.y < plat.y + plat.h - 4
            ) {
              // Mur à droite (Wall on right)
              if (e.vx > 0 && e.x + e.w > plat.x && e.x + e.w < plat.x + 10) {
                e.x = plat.x - e.w;
                e.vx *= -1;
              }
              // Mur à gauche (Wall on left)
              if (e.vx < 0 && e.x < plat.x + plat.w && e.x > plat.x + plat.w - 10) {
                e.x = plat.x + plat.w;
                e.vx *= -1;
              }
            }
          }

          // Demi-tour aux limites du niveau (Turn at level edges)
          if (e.x < 0) { e.x = 0; e.vx = Math.abs(e.vx); }
          if (e.x > LEVEL_WIDTH - e.w) { e.x = LEVEL_WIDTH - e.w; e.vx = -Math.abs(e.vx); }

          // Tombé dans le vide → mort (Fell off → dead)
          if (e.y > GAME_H + 100) {
            e.alive = false;
          }
          break;

        case 'eagle':
          // Vol et plongeon (Fly and dive)
          if (!e.diving) {
            e.x += e.vx;
            e.y = e.startY + Math.sin(e.animTimer * 2) * 20;
            if (Math.abs(e.x - e.startX) > e.patrolRange) {
              e.vx *= -1;
            }
            // Plonge si le joueur est en dessous (Dive if player is below)
            const dx = Math.abs(player.x - e.x);
            if (dx < 100 && player.y > e.y) {
              e.diving = true;
              e.diveTimer = 0;
            }
          } else {
            e.vy += 0.3;
            e.y += e.vy;
            e.diveTimer++;
            if (e.diveTimer > 60 || e.y > GAME_H - TILE - 30) {
              e.diving = false;
              e.vy = 0;
              e.y = e.startY;
              e.diveTimer = 0;
            }
          }
          break;

        case 'bat':
          // Vol en zigzag + attaque en plongée (Zigzag flight + dive attack)
          if (!e.diving) {
            // Patrouille en zigzag (Zigzag patrol)
            e.x += e.vx;
            e.y = e.startY + Math.sin(e.animTimer * 3) * 40;
            if (Math.abs(e.x - e.startX) > e.patrolRange) {
              e.vx *= -1;
            }
            // Attaque si le joueur est proche! (Attack if player is close!)
            const dxBat = Math.abs(player.x - e.x);
            const dyBat = player.y - e.y;
            if (dxBat < 120 && dyBat > 0 && dyBat < 200) {
              e.diving = true;
              e.diveTimer = 0;
              // Viser le joueur (Aim at player)
              const angle = Math.atan2(player.y - e.y, player.x - e.x);
              e.vx = Math.cos(angle) * 3;
              e.vy = Math.sin(angle) * 3;
            }
          } else {
            // Plongée vers le joueur! (Diving at player!)
            e.x += e.vx;
            e.y += e.vy;
            e.diveTimer++;
            // Remonter après 50 frames ou si trop bas (Go back up after 50 frames or if too low)
            if (e.diveTimer > 50 || e.y > GAME_H - TILE - 10) {
              e.diving = false;
              e.diveTimer = 0;
              e.vy = 0;
              // Remonter doucement à la position de départ (Slowly return to start position)
              e.y = e.startY;
              e.vx = (Math.random() < 0.5 ? 1 : -1) * 1.2;
            }
          }
          break;
      }

      // Collision joueur-ennemi (Player-enemy collision)
      if (player.invincible <= 0) {
        if (
          player.x + player.w > e.x + 4 &&
          player.x < e.x + e.w - 4 &&
          player.y + player.h > e.y + 4 &&
          player.y < e.y + e.h
        ) {
          // Sauter sur l'ennemi? (Jumping on enemy?)
          if (player.vy > 0 && player.y + player.h < e.y + e.h / 2 + 8) {
            // Ennemi éliminé! (Enemy eliminated!)
            e.alive = false;
            player.vy = JUMP_FORCE * 0.6;
            score += 50;
            spawnParticles(e.x + e.w / 2, e.y + e.h / 2, getEnemyColor(e.type), 12);
            shakeTimer = 8;
            updateHUD();
          } else {
            // Le joueur est touché! (Player is hit!)
            loseLife();
          }
        }
      }
    });
  }

  function getEnemyColor(type) {
    switch (type) {
      case 'snake': return COLORS.snake;
      case 'eagle': return COLORS.eagle;
      case 'boar': return COLORS.boar;
      case 'bat': return COLORS.bat;
      case 'lion': return COLORS.lion;
      case 'tiger': return COLORS.tiger;
      default: return '#FFFFFF';
    }
  }

  // === MISE À JOUR DU BOSS (Boss update) ===
  function updateBoss() {
    if (!boss || !boss.alive) return;
    boss.animTimer += 0.05;
    if (boss.hitTimer > 0) boss.hitTimer--;
    if (boss.roarTimer > 0) boss.roarTimer--;

    // Gravité (Gravity)
    boss.vy += GRAVITY;
    if (boss.vy > 10) boss.vy = 10;
    boss.y += boss.vy;

    // Collision plateformes (Platform collision)
    boss.onGround = false;
    for (let pi = 0; pi < platforms.length; pi++) {
      const plat = platforms[pi];
      if (
        boss.x + boss.w > plat.x &&
        boss.x < plat.x + plat.w &&
        boss.y + boss.h > plat.y &&
        boss.y + boss.h < plat.y + plat.h + 10 &&
        boss.vy >= 0
      ) {
        boss.y = plat.y - boss.h;
        boss.vy = 0;
        boss.onGround = true;
      }
    }

    // Comportement du boss (Boss behavior)
    boss.chargeTimer++;

    // Charge vers le joueur quand il est proche (Charge at player when close)
    const distToPlayer = Math.abs(player.x - boss.x);
    if (!boss.charging && distToPlayer < 300 && boss.chargeTimer > 90) {
      boss.charging = true;
      boss.chargeTimer = 0;
      boss.roarTimer = 30;
      const dir = player.x > boss.x ? 1 : -1;
      boss.vx = dir * (3 + level * 0.5);
      // Le boss saute parfois en chargeant! (Boss sometimes jumps while charging!)
      if (boss.onGround && Math.random() < 0.4) {
        boss.vy = JUMP_FORCE * 0.8;
      }
    }

    // Mouvement (Movement)
    boss.x += boss.vx;

    // Fin de charge (End charge)
    if (boss.charging) {
      boss.chargeTimer++;
      if (boss.chargeTimer > 60) {
        boss.charging = false;
        boss.chargeTimer = 0;
        // Retourner patrouiller (Resume patrol)
        boss.vx = (boss.x > boss.startX ? -1 : 1) * 1.5;
      }
    } else {
      // Patrouille normale (Normal patrol)
      if (Math.abs(boss.x - boss.startX) > boss.patrolRange) {
        boss.vx *= -1;
      }
    }

    // Limites (Boundaries)
    if (boss.x < 0) { boss.x = 0; boss.vx = Math.abs(boss.vx); }
    if (boss.x > LEVEL_WIDTH - boss.w) { boss.x = LEVEL_WIDTH - boss.w; boss.vx = -Math.abs(boss.vx); }

    // Tombé = mort (Fell = dead)
    if (boss.y > GAME_H + 100) {
      boss.alive = false;
      score += 200;
      updateHUD();
    }

    // Collision joueur-boss (Player-boss collision)
    if (player.invincible <= 0) {
      if (
        player.x + player.w > boss.x + 6 &&
        player.x < boss.x + boss.w - 6 &&
        player.y + player.h > boss.y + 6 &&
        player.y < boss.y + boss.h
      ) {
        // Sauter sur le boss? (Jumping on boss?)
        if (player.vy > 0 && player.y + player.h < boss.y + boss.h / 2 + 10) {
          boss.hp--;
          boss.hitTimer = 15;
          player.vy = JUMP_FORCE * 0.7;
          shakeTimer = 12;
          spawnParticles(boss.x + boss.w / 2, boss.y, COLORS.textPink, 10);
          score += 25;

          if (boss.hp <= 0) {
            // Boss vaincu! (Boss defeated!)
            boss.alive = false;
            score += 200;
            shakeTimer = 20;
            spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, getEnemyColor(boss.type), 30);
            spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, COLORS.textYellow, 20);
            updateMessage('👑 Boss vaincu! Vers le drapeau!');
          }
          updateHUD();
        } else {
          // Touché par le boss! (Hit by boss!)
          loseLife();
        }
      }
    }
  }

  // === VÉRIFIER LE DRAPEAU (Check flag) ===
  function checkFlag() {
    // Le boss doit être vaincu avant de toucher le drapeau!
    // (Boss must be defeated before reaching the flag!)
    if (boss && boss.alive) return;

    if (
      player.x + player.w > flag.x &&
      player.x < flag.x + 32 &&
      player.y + player.h > flag.y &&
      player.y < flag.y + 64
    ) {
      score += 100;
      gameState = STATE.LEVELWIN;
      spawnParticles(flag.x + 16, flag.y + 32, COLORS.textYellow, 30);
      updateHUD();
      updateMessage('🎉 Niveau ' + level + ' terminé! ESPACE pour continuer');
    }
  }

  // === PERDRE UNE VIE (Lose a life) ===
  function loseLife() {
    if (player.invincible > 0) return;
    lives--;
    updateHUD();
    if (lives <= 0) {
      gameState = STATE.GAMEOVER;
      updateMessage('💀 Game Over! Score: ' + score + ' — ESPACE pour recommencer');
    } else {
      player.invincible = 90; // 1.5 secondes d'invincibilité
      player.vy = JUMP_FORCE * 0.5;
      shakeTimer = 15;
      spawnParticles(player.x + player.w / 2, player.y + player.h / 2, COLORS.textPink, 15);
    }
  }

  // === MISE À JOUR HUD (HUD update) ===
  function updateHUD() {
    const elScore = document.getElementById('hud-score');
    const elLevel = document.getElementById('hud-level');
    const elCoins = document.getElementById('hud-coins');
    const elLives = document.getElementById('hud-lives');
    if (elScore) elScore.textContent = score;
    if (elLevel) elLevel.textContent = level;
    if (elCoins) elCoins.textContent = coins;
    if (elLives) elLives.textContent = '❤️'.repeat(Math.max(0, lives));
  }

  function updateMessage(text) {
    const el = document.getElementById('game-message');
    if (el) el.textContent = text;
  }

  // Notification temporaire affichée sur le canvas (Temporary on-canvas notification)
  function showNotification(text) {
    notification = text;
    notificationTimer = 120; // 2 secondes à 60fps (2 seconds at 60fps)
  }

  function drawNotification() {
    if (notificationTimer > 0 && notification) {
      notificationTimer--;
      const alpha = notificationTimer > 30 ? 1 : notificationTimer / 30;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      const tw = ctx.measureText(notification).width + 40;
      ctx.fillRect(GAME_W / 2 - tw / 2, 60, tw, 40);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(GAME_W / 2 - tw / 2, 60, tw, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(notification, GAME_W / 2, 86);
      ctx.restore();
    }
  }

  // ================================================================
  // ===                    DESSIN (DRAWING)                       ===
  // ================================================================

  // === DESSIN DU CIEL (Sky drawing) ===
  function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
    grad.addColorStop(0, COLORS.skyGrad1);
    grad.addColorStop(0.5, COLORS.skyGrad2);
    grad.addColorStop(1, COLORS.skyGrad3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_W, GAME_H);
  }

  // === DESSIN DES ÉTOILES (Star drawing) ===
  function drawStars() {
    stars.forEach((s) => {
      const sx = s.x - cameraX * 0.2;
      if (sx < -10 || sx > GAME_W + 10) return;
      const twinkle = (Math.sin(s.twinkle + frameCount * 0.03) + 1) / 2;
      ctx.globalAlpha = 0.3 + twinkle * 0.7;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(sx, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;
  }

  // === DESSIN DES MONTAGNES (Mountain drawing) ===
  function drawMountains() {
    ctx.fillStyle = 'rgba(30, 20, 60, 0.6)';
    mountains.forEach((m) => {
      const mx = m.x - cameraX * 0.3;
      ctx.beginPath();
      ctx.moveTo(mx, GAME_H - TILE);
      ctx.lineTo(mx + m.w / 2, GAME_H - TILE - m.h);
      ctx.lineTo(mx + m.w, GAME_H - TILE);
      ctx.closePath();
      ctx.fill();
    });
  }

  // === DESSIN DES NUAGES (Cloud drawing) ===
  function drawClouds() {
    ctx.fillStyle = 'rgba(200, 200, 255, 0.15)';
    clouds.forEach((c) => {
      const cx = (c.x + frameCount * c.speed) % (LEVEL_WIDTH + c.w) - c.w;
      const sx = cx - cameraX * 0.4;
      if (sx < -c.w || sx > GAME_W + c.w) return;
      // Dessiner un nuage avec des cercles (Draw cloud with circles)
      ctx.beginPath();
      ctx.arc(sx, c.y, c.h, 0, Math.PI * 2);
      ctx.arc(sx + c.w * 0.3, c.y - c.h * 0.3, c.h * 0.8, 0, Math.PI * 2);
      ctx.arc(sx + c.w * 0.6, c.y, c.h * 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // === DESSIN DES PLATEFORMES (Platform drawing) ===
  function drawPlatforms() {
    platforms.forEach((p) => {
      const px = p.x - cameraX;
      if (px + p.w < -10 || px > GAME_W + 10) return;

      if (p.type === 'ground') {
        // Sol avec herbe (Ground with grass)
        // Terre (Dirt)
        ctx.fillStyle = COLORS.dirt;
        ctx.fillRect(px, p.y, p.w, p.h);
        ctx.fillStyle = COLORS.dirtDark;
        ctx.fillRect(px, p.y + 6, p.w, p.h - 6);
        // Herbe sur le dessus (Grass on top)
        ctx.fillStyle = COLORS.ground;
        ctx.fillRect(px, p.y, p.w, 8);
        ctx.fillStyle = COLORS.platformTop;
        ctx.fillRect(px, p.y, p.w, 4);
        // Brins d'herbe (Grass blades)
        ctx.fillStyle = COLORS.platformTop;
        for (let gx = px; gx < px + p.w; gx += 8) {
          const gh = 3 + Math.sin(gx * 0.3) * 2;
          ctx.fillRect(gx, p.y - gh, 2, gh);
        }
      } else {
        // Plateforme flottante (Floating platform)
        // Dessous (Bottom)
        ctx.fillStyle = COLORS.platformEdge;
        ctx.fillRect(px + 2, p.y + 4, p.w - 4, p.h - 4);
        // Dessus (Top)
        ctx.fillStyle = COLORS.platform;
        ctx.fillRect(px, p.y, p.w, p.h - 4);
        // Herbe (Grass)
        ctx.fillStyle = COLORS.platformTop;
        ctx.fillRect(px, p.y, p.w, 4);
      }
    });
  }

  // === DESSIN DES PIÈCES (Coin drawing) ===
  function drawCoins() {
    coinList.forEach((c) => {
      if (c.collected) return;
      const cx = c.x - cameraX;
      if (cx < -20 || cx > GAME_W + 20) return;

      const bobY = c.y + Math.sin(frameCount * 0.06 + c.bobOffset) * 4;

      // Pièce avec effet rotatif (Coin with rotation effect)
      const scaleX = Math.abs(Math.cos(frameCount * 0.05 + c.bobOffset));
      const coinW = c.w * scaleX;
      const coinX = cx + (c.w - coinW) / 2;

      // Lueur (Glow)
      ctx.fillStyle = 'rgba(255, 230, 109, 0.3)';
      ctx.beginPath();
      ctx.arc(cx + c.w / 2, bobY + c.h / 2, 12, 0, Math.PI * 2);
      ctx.fill();

      // Pièce (Coin)
      ctx.fillStyle = COLORS.coin;
      ctx.fillRect(coinX, bobY, coinW, c.h);
      // Reflet (Shine)
      ctx.fillStyle = COLORS.coinShine;
      ctx.fillRect(coinX + 2, bobY + 2, coinW * 0.3, c.h * 0.4);
    });
  }

  // === DESSIN DU JOUEUR (Player drawing) ===
  function drawPlayer() {
    // Clignoter si invincible (Blink when invincible)
    if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

    const px = player.x - cameraX;
    const py = player.y;

    ctx.save();
    ctx.translate(px + player.w / 2, py + player.h);

    // Effet d'écrasement (Squash effect)
    const sx = 2 - player.squash;
    ctx.scale(player.facing * sx, player.squash);
    ctx.translate(-player.w / 2, -player.h);

    // Corps (Body)
    ctx.fillStyle = COLORS.player;
    roundRect(ctx, 2, 6, player.w - 4, player.h - 8, 6);
    ctx.fill();

    // Ventre plus clair (Lighter belly)
    ctx.fillStyle = '#FF99B1';
    roundRect(ctx, 6, 12, player.w - 12, player.h - 18, 4);
    ctx.fill();

    // Yeux (Eyes)
    ctx.fillStyle = COLORS.playerEye;
    ctx.fillRect(8, 10, 7, 7);
    ctx.fillRect(17, 10, 7, 7);
    // Pupilles (Pupils)
    ctx.fillStyle = COLORS.playerPupil;
    const pupilOffset = player.vx > 0 ? 3 : player.vx < 0 ? 0 : 1.5;
    ctx.fillRect(8 + pupilOffset, 12, 3, 4);
    ctx.fillRect(17 + pupilOffset, 12, 3, 4);

    // Petites oreilles (Small ears)
    ctx.fillStyle = COLORS.playerDark;
    ctx.fillRect(4, 2, 6, 6);
    ctx.fillRect(18, 2, 6, 6);

    // Legs animation (Animation des jambes)
    ctx.fillStyle = COLORS.playerDark;
    if (player.onGround && Math.abs(player.vx) > 0) {
      const legOffset = Math.sin(player.walkFrame * Math.PI / 2) * 3;
      ctx.fillRect(6, player.h - 6 + legOffset, 6, 4);
      ctx.fillRect(16, player.h - 6 - legOffset, 6, 4);
    } else {
      ctx.fillRect(6, player.h - 6, 6, 4);
      ctx.fillRect(16, player.h - 6, 6, 4);
    }

    ctx.restore();
  }

  // === DESSIN DES ENNEMIS (Enemy drawing) ===
  function drawEnemies() {
    enemies.forEach((e) => {
      if (!e.alive) return;
      const ex = e.x - cameraX;
      if (ex < -40 || ex > GAME_W + 40) return;

      ctx.save();
      ctx.translate(ex + e.w / 2, e.y + e.h / 2);
      const facing = e.vx >= 0 ? -1 : 1;
      ctx.scale(facing, 1);
      ctx.translate(-e.w / 2, -e.h / 2);

      switch (e.type) {
        case 'snake':
          drawSnake(e);
          break;
        case 'eagle':
          drawEagle(e);
          break;
        case 'boar':
          drawBoar(e);
          break;
        case 'bat':
          drawBat(e);
          break;
      }

      ctx.restore();
    });
  }

  function drawSnake(e) {
    // Corps ondulé du serpent (Wavy snake body)
    ctx.fillStyle = COLORS.snake;
    for (let i = 0; i < 5; i++) {
      const sx = 4 + i * 5;
      const sy = 10 + Math.sin(e.animTimer + i * 0.8) * 4;
      ctx.fillRect(sx, sy, 6, 8);
    }
    // Tête (Head)
    ctx.fillStyle = COLORS.snakeDark;
    ctx.fillRect(0, 8, 8, 10);
    // Yeux (Eyes)
    ctx.fillStyle = COLORS.snakeEye;
    ctx.fillRect(2, 10, 3, 3);
    // Langue (Tongue)
    ctx.fillStyle = '#FF1744';
    if (Math.sin(e.animTimer * 3) > 0.5) {
      ctx.fillRect(-3, 13, 4, 2);
    }
  }

  function drawEagle(e) {
    // Corps (Body)
    ctx.fillStyle = COLORS.eagle;
    ctx.fillRect(8, 10, 14, 10);
    // Tête (Head)
    ctx.fillStyle = COLORS.eagleDark;
    ctx.fillRect(2, 8, 10, 10);
    // Bec (Beak)
    ctx.fillStyle = COLORS.eagleBeak;
    ctx.fillRect(-2, 12, 5, 4);
    // Oeil (Eye)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(4, 10, 4, 4);
    ctx.fillStyle = '#000000';
    ctx.fillRect(5, 11, 2, 2);
    // Ailes qui battent (Flapping wings)
    const wingY = Math.sin(e.animTimer * 4) * 6;
    ctx.fillStyle = COLORS.eagle;
    ctx.fillRect(8, 4 + wingY, 18, 6);
    ctx.fillRect(8, 4 - wingY, 18, 6);
    // Plongeon? (Diving?)
    if (e.diving) {
      // Indicateur de danger (Danger indicator)
      ctx.fillStyle = '#FF1744';
      ctx.fillRect(-2, 6, 4, 4);
    }
  }

  function drawBoar(e) {
    // Corps massif (Bulky body)
    ctx.fillStyle = COLORS.boar;
    roundRect(ctx, 4, 6, 22, 16, 4);
    ctx.fill();
    // Tête (Head)
    ctx.fillStyle = COLORS.boarDark;
    ctx.fillRect(0, 8, 10, 12);
    // Défenses (Tusks)
    ctx.fillStyle = COLORS.boarTusk;
    ctx.fillRect(-2, 16, 4, 6);
    // Oeil (Eye)
    ctx.fillStyle = '#FF1744';
    ctx.fillRect(2, 10, 4, 4);
    // Pattes (Legs)
    ctx.fillStyle = COLORS.boarDark;
    const legRun = Math.sin(e.animTimer * 5) * 2;
    ctx.fillRect(6, 20 + legRun, 4, 6);
    ctx.fillRect(18, 20 - legRun, 4, 6);
  }

  function drawBat(e) {
    // Corps (Body)
    ctx.fillStyle = COLORS.bat;
    ctx.fillRect(10, 8, 10, 12);
    // Tête (Head)
    ctx.fillStyle = COLORS.batDark;
    ctx.fillRect(11, 4, 8, 8);
    // Oreilles (Ears)
    ctx.fillRect(11, 0, 3, 5);
    ctx.fillRect(17, 0, 3, 5);
    // Yeux (Eyes)
    ctx.fillStyle = COLORS.batEye;
    ctx.fillRect(12, 6, 3, 3);
    ctx.fillRect(17, 6, 3, 3);
    // Ailes qui battent (Flapping wings)
    const wingAngle = Math.sin(e.animTimer * 5) * 8;
    ctx.fillStyle = COLORS.bat;
    ctx.fillRect(-2, 8 + wingAngle, 12, 4);
    ctx.fillRect(20, 8 - wingAngle, 12, 4);
    // Membrane des ailes (Wing membrane)
    ctx.fillStyle = COLORS.batDark;
    ctx.fillRect(0, 10 + wingAngle, 10, 2);
    ctx.fillRect(20, 10 - wingAngle, 10, 2);
  }

  // === DESSIN DU LION (Lion drawing) ===
  function drawLion(b) {
    const scale = b.w / 30;
    ctx.save();
    ctx.scale(scale, scale);

    // Crinière (Mane)
    ctx.fillStyle = COLORS.lionMane;
    ctx.beginPath();
    ctx.arc(12, 10, 14, 0, Math.PI * 2);
    ctx.fill();

    // Corps (Body)
    ctx.fillStyle = COLORS.lion;
    roundRect(ctx, 4, 6, 22, 18, 5);
    ctx.fill();

    // Ventre (Belly)
    ctx.fillStyle = COLORS.lionDark;
    roundRect(ctx, 8, 12, 14, 10, 3);
    ctx.fill();

    // Yeux féroces (Fierce eyes)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(6, 8, 6, 5);
    ctx.fillRect(16, 8, 6, 5);
    ctx.fillStyle = '#FF1744';
    ctx.fillRect(8, 9, 3, 3);
    ctx.fillRect(18, 9, 3, 3);

    // Museau (Muzzle)
    ctx.fillStyle = '#D4A017';
    ctx.fillRect(9, 14, 10, 5);
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(12, 14, 4, 3);

    // Rugissement (Roar mouth)
    if (b.roarTimer > 0 || b.charging) {
      ctx.fillStyle = '#FF1744';
      ctx.fillRect(10, 18, 8, 5);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(11, 18, 2, 3);
      ctx.fillRect(15, 18, 2, 3);
    }

    // Pattes (Legs)
    ctx.fillStyle = COLORS.lionDark;
    const legRun = Math.sin(b.animTimer * 5) * 3;
    ctx.fillRect(6, 22 + legRun, 5, 6);
    ctx.fillRect(18, 22 - legRun, 5, 6);

    // Queue (Tail)
    ctx.fillStyle = COLORS.lionMane;
    ctx.fillRect(24, 10, 6, 3);
    ctx.fillRect(28, 8, 3, 3);

    ctx.restore();
  }

  // === DESSIN DU TIGRE (Tiger drawing) ===
  function drawTiger(b) {
    const scale = b.w / 30;
    ctx.save();
    ctx.scale(scale, scale);

    // Corps (Body)
    ctx.fillStyle = COLORS.tiger;
    roundRect(ctx, 2, 4, 26, 18, 5);
    ctx.fill();

    // Rayures (Stripes)
    ctx.fillStyle = COLORS.tigerStripe;
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(6 + i * 5, 6, 3, 14);
    }

    // Ventre blanc (White belly)
    ctx.fillStyle = '#FFF3E0';
    roundRect(ctx, 6, 10, 16, 10, 3);
    ctx.fill();

    // Tête (Head)
    ctx.fillStyle = COLORS.tiger;
    ctx.fillRect(0, 4, 12, 14);
    ctx.fillStyle = COLORS.tigerStripe;
    ctx.fillRect(2, 4, 2, 10);
    ctx.fillRect(8, 4, 2, 10);

    // Oreilles (Ears)
    ctx.fillStyle = COLORS.tigerDark;
    ctx.fillRect(0, 0, 5, 5);
    ctx.fillRect(7, 0, 5, 5);

    // Yeux féroces (Fierce eyes)
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(2, 8, 5, 4);
    ctx.fillRect(8, 8, 5, 4);
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(3, 9, 2, 2);
    ctx.fillRect(9, 9, 2, 2);

    // Museau (Muzzle)
    ctx.fillStyle = '#FFF3E0';
    ctx.fillRect(3, 13, 8, 4);
    ctx.fillStyle = '#FF6F91';
    ctx.fillRect(5, 13, 4, 2);

    // Gueule ouverte (Open jaw)
    if (b.roarTimer > 0 || b.charging) {
      ctx.fillStyle = '#FF1744';
      ctx.fillRect(3, 16, 8, 5);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(4, 16, 2, 3);
      ctx.fillRect(8, 16, 2, 3);
    }

    // Pattes (Legs)
    ctx.fillStyle = COLORS.tigerDark;
    const legRun = Math.sin(b.animTimer * 5) * 3;
    ctx.fillRect(4, 20 + legRun, 5, 6);
    ctx.fillRect(20, 20 - legRun, 5, 6);

    // Queue rayée (Striped tail)
    ctx.fillStyle = COLORS.tiger;
    ctx.fillRect(26, 8, 5, 3);
    ctx.fillStyle = COLORS.tigerStripe;
    ctx.fillRect(28, 8, 2, 3);

    ctx.restore();
  }

  // === DESSIN DU BOSS (Boss drawing) ===
  function drawBoss() {
    if (!boss || !boss.alive) return;
    const bx = boss.x - cameraX;
    if (bx < -80 || bx > GAME_W + 80) return;

    // Flash rouge quand touché (Red flash when hit)
    if (boss.hitTimer > 0 && Math.floor(boss.hitTimer / 3) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    ctx.save();
    ctx.translate(bx + boss.w / 2, boss.y + boss.h / 2);
    const facing = boss.vx >= 0 ? -1 : 1;
    ctx.scale(facing, 1);
    ctx.translate(-boss.w / 2, -boss.h / 2);

    if (boss.type === 'lion') drawLion(boss);
    else drawTiger(boss);

    ctx.restore();
    ctx.globalAlpha = 1;

    // Barre de vie du boss (Boss health bar)
    const barW = 60;
    const barH = 6;
    const barX = bx + boss.w / 2 - barW / 2;
    const barY = boss.y - 14;

    ctx.fillStyle = COLORS.bossHealthBg;
    ctx.fillRect(barX, barY, barW, barH);
    const hpRatio = boss.hp / boss.maxHp;
    ctx.fillStyle = hpRatio > 0.5 ? COLORS.textGreen : hpRatio > 0.25 ? COLORS.textYellow : COLORS.bossHealthBar;
    ctx.fillRect(barX, barY, barW * hpRatio, barH);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Nom du boss (Boss name)
    ctx.fillStyle = COLORS.textPink;
    ctx.font = '8px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    const bossLabel = boss.type === 'lion' ? '\uD83E\uDD81 LION' : '\uD83D\uDC2F TIGRE';
    ctx.fillText(bossLabel, bx + boss.w / 2, barY - 4);
    ctx.textAlign = 'left';

    // Indicateur de charge (Charge indicator)
    if (boss.charging) {
      ctx.fillStyle = '#FF1744';
      ctx.font = '10px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.fillText('!!', bx + boss.w / 2, boss.y - 24);
      ctx.textAlign = 'left';
    }
  }

  // === DESSIN DU DRAPEAU (Flag drawing) ===
  function drawFlag() {
    const fx = flag.x - cameraX;
    if (fx < -40 || fx > GAME_W + 40) return;

    // Poteau (Pole)
    ctx.fillStyle = COLORS.flagPole;
    ctx.fillRect(fx + 14, flag.y, 4, 64);

    // Drapeau qui flotte (Waving flag)
    ctx.fillStyle = COLORS.flagColor;
    ctx.beginPath();
    ctx.moveTo(fx + 18, flag.y);
    ctx.lineTo(fx + 18 + 24 + Math.sin(frameCount * 0.08) * 4, flag.y + 8);
    ctx.lineTo(fx + 18 + 20 + Math.sin(frameCount * 0.08 + 1) * 3, flag.y + 20);
    ctx.lineTo(fx + 18, flag.y + 20);
    ctx.closePath();
    ctx.fill();

    // Étoile sur le drapeau (Star on flag)
    ctx.fillStyle = COLORS.textYellow;
    ctx.font = '12px serif';
    ctx.fillText('⭐', fx + 22, flag.y + 16);

    // Lueur du drapeau (Flag glow)
    ctx.fillStyle = 'rgba(255, 111, 145, 0.2)';
    ctx.beginPath();
    ctx.arc(fx + 16, flag.y + 32, 30 + Math.sin(frameCount * 0.05) * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // === DESSIN D'ÉCRAN TITRE (Title screen drawing) ===
  function drawTitleScreen() {
    drawSky();
    drawStars();

    // Titre (Title)
    ctx.fillStyle = COLORS.textCyan;
    ctx.font = '28px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.shadowColor = COLORS.textCyan;
    ctx.shadowBlur = 20;
    ctx.fillText('🦁 SUPER', GAME_W / 2, 120);
    ctx.fillText('ANIMAL RUN', GAME_W / 2, 165);
    ctx.shadowBlur = 0;

    // Sous-titre (Subtitle)
    ctx.fillStyle = COLORS.textYellow;
    ctx.font = '12px "Press Start 2P", cursive';
    ctx.fillText('Saute, cours et évite les animaux!', GAME_W / 2, 210);

    // Animaux qui défilent (Scrolling animals)
    const animals = ['🐍', '🦅', '🐗', '🦇'];
    animals.forEach((a, i) => {
      const ax = GAME_W / 2 - 100 + i * 60 + Math.sin(frameCount * 0.03 + i) * 10;
      const ay = 260 + Math.cos(frameCount * 0.04 + i * 0.8) * 10;
      ctx.font = '28px serif';
      ctx.fillText(a, ax, ay);
    });

    // Bouton démarrer (Start button)
    const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
    ctx.save();
    ctx.translate(GAME_W / 2, 330);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = COLORS.textPink;
    ctx.font = '14px "Press Start 2P", cursive';
    ctx.fillText('ESPACE pour jouer!', 0, 0);
    ctx.restore();

    // Option continuer si sauvegarde existe (Continue option if save exists)
    if (hasSaveGame()) {
      ctx.fillStyle = COLORS.textGreen;
      ctx.font = '10px "Press Start 2P", cursive';
      ctx.fillText('C = Continuer la partie', GAME_W / 2, 365);
    }

    // Meilleur score (Best score)
    if (bestScore > 0) {
      ctx.fillStyle = COLORS.textYellow;
      ctx.font = '9px "Press Start 2P", cursive';
      ctx.fillText('⭐ Meilleur score: ' + bestScore, GAME_W / 2, 385);
    }

    // Crédits (Credits)
    ctx.fillStyle = COLORS.textGreen;
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.fillText('🎮 Arcade Sohan', GAME_W / 2, 420);

    ctx.textAlign = 'left';
  }

  // === DESSIN GAME OVER (Game over drawing) ===
  function drawGameOver() {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.textPink;
    ctx.font = '32px "Press Start 2P", cursive';
    ctx.shadowColor = COLORS.textPink;
    ctx.shadowBlur = 15;
    ctx.fillText('GAME OVER', GAME_W / 2, 160);
    ctx.shadowBlur = 0;

    ctx.fillStyle = COLORS.textYellow;
    ctx.font = '16px "Press Start 2P", cursive';
    ctx.fillText('Score: ' + score, GAME_W / 2, 220);
    ctx.fillText('Niveau: ' + level, GAME_W / 2, 250);
    ctx.fillText('Pièces: ' + coins, GAME_W / 2, 280);

    if (score > bestScore) {
      bestScore = score;
      try { localStorage.setItem('superAnimalRun_best', String(bestScore)); } catch(e) {}
    }
    if (bestScore > 0) {
      ctx.fillStyle = COLORS.textGreen;
      ctx.font = '10px "Press Start 2P", cursive';
      ctx.fillText('⭐ Meilleur: ' + bestScore, GAME_W / 2, 306);
    }

    const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
    ctx.save();
    ctx.translate(GAME_W / 2, 340);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = COLORS.textCyan;
    ctx.font = '12px "Press Start 2P", cursive';
    ctx.fillText('ESPACE pour recommencer', 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
  }

  // === DESSIN NIVEAU GAGNÉ (Level win drawing) ===
  function drawLevelWin() {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.textGreen;
    ctx.font = '28px "Press Start 2P", cursive';
    ctx.shadowColor = COLORS.textGreen;
    ctx.shadowBlur = 15;
    ctx.fillText('🎉 NIVEAU ' + level, GAME_W / 2, 150);
    ctx.fillText('TERMINÉ!', GAME_W / 2, 190);
    ctx.shadowBlur = 0;

    ctx.fillStyle = COLORS.textYellow;
    ctx.font = '14px "Press Start 2P", cursive';
    ctx.fillText('Score: ' + score, GAME_W / 2, 240);
    ctx.fillText('Pièces: ' + coins, GAME_W / 2, 270);

    const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
    ctx.save();
    ctx.translate(GAME_W / 2, 340);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = COLORS.textCyan;
    ctx.font = '12px "Press Start 2P", cursive';
    ctx.fillText('ESPACE pour le niveau ' + (level + 1), 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
  }

  // === DESSIN PAUSE (Pause drawing) ===
  function drawPause() {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.textCyan;
    ctx.font = '28px "Press Start 2P", cursive';
    ctx.fillText('⏸️ PAUSE', GAME_W / 2, GAME_H / 2 - 20);

    ctx.fillStyle = COLORS.textYellow;
    ctx.font = '12px "Press Start 2P", cursive';
    ctx.fillText('Appuie sur P pour reprendre', GAME_W / 2, GAME_H / 2 + 30);

    ctx.fillStyle = COLORS.textGreen;
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.fillText('S = Sauvegarder', GAME_W / 2, GAME_H / 2 + 60);

    ctx.textAlign = 'left';
  }

  // === UTILITAIRE: RECTANGLE ARRONDI (Utility: rounded rectangle) ===
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ================================================================
  // ===               BOUCLE PRINCIPALE (MAIN LOOP)               ===
  // ================================================================

  function gameLoop() {
    frameCount++;

    // Tremblement d'écran (Screen shake)
    let shakeX = 0, shakeY = 0;
    if (shakeTimer > 0) {
      shakeTimer--;
      shakeX = (Math.random() - 0.5) * shakeTimer;
      shakeY = (Math.random() - 0.5) * shakeTimer;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    switch (gameState) {
      case STATE.MENU:
        drawTitleScreen();
        break;

      case STATE.PLAYING:
        updatePlayer();
        checkCoins();
        updateEnemies();
        updateBoss();
        checkFlag();
        updateParticles();

        // Dessin (Drawing)
        drawSky();
        drawStars();
        drawMountains();
        drawClouds();
        drawPlatforms();
        drawCoins();
        drawFlag();
        drawEnemies();
        drawBoss();
        drawPlayer();
        drawParticles();
        break;

      case STATE.PAUSED:
        drawSky();
        drawStars();
        drawMountains();
        drawClouds();
        drawPlatforms();
        drawCoins();
        drawFlag();
        drawEnemies();
        drawBoss();
        drawPlayer();
        drawPause();
        break;

      case STATE.GAMEOVER:
        drawSky();
        drawStars();
        drawMountains();
        drawClouds();
        drawPlatforms();
        drawCoins();
        drawFlag();
        drawEnemies();
        drawBoss();
        drawPlayer();
        drawParticles();
        drawGameOver();
        break;

      case STATE.LEVELWIN:
        drawSky();
        drawStars();
        drawMountains();
        drawClouds();
        drawPlatforms();
        drawCoins();
        drawFlag();
        drawEnemies();
        drawBoss();
        drawPlayer();
        drawParticles();
        drawLevelWin();
        break;
    }

    // Notification par-dessus tout (Notification on top of everything)
    drawNotification();

    ctx.restore();
    requestAnimationFrame(gameLoop);
  }

  // === INITIALISATION (Initialization) ===
  generateStars();
  generateClouds();
  generateMountains();
  updateHUD();
  gameLoop();

  console.log('%c🦁 SUPER ANIMAL RUN 🦁', 'font-size: 20px; color: #FF6F91; font-weight: bold;');
  console.log('%cJeu de plateforme avec des animaux!', 'font-size: 14px; color: #00D4FF;');

})();
