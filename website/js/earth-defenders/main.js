// ==========================================================
// 🎮 MAIN — Boucle de jeu principale (Main game loop)
// Point d'entrée — orchestre tous les modules
// ==========================================================

import { GAME_W, GAME_H, STATE, COIN_SCORE, ENEMY_SCORE, BOSS_SCORE, LEVEL_SCORE,
         START_LIVES, LEVEL_COLORS, COLORS, EVOLUTION } from './config.js';
import { initInput, isKeyJustPressed, clearJustPressed, isJump, isPause, isUp, isDown, isAction } from '../shared/input.js';
import { updateParticles, drawParticles, clearParticles } from '../shared/particles.js';
import { updateCamera, getCameraX, resetCamera, shake, getShake, updateHUD,
         updateMessage, showNotification, drawNotification } from './renderer.js';
import { drawTitleScreen, drawPauseScreen, drawGameOverScreen,
         drawLevelWinScreen, drawEvolutionScreen, drawBossIntro, drawVictoryScreen } from './ui.js';
import { startScene, advanceScene, isSceneActive, updateScene, drawScene } from './story.js';
import { player, resetPlayer, updatePlayer, drawPlayer, evolvePlayer, getEvolution } from './player.js';
import { generatePiedLevel, getPlatforms, checkCoinCollection, checkFlagReached,
         drawPlatforms, drawCoins, drawFlag } from './mode-pied.js';

import { generateEnemies, updateEnemies, checkEnemyCollisions, drawEnemies, getEnemies } from './enemies.js';
import { initBoss, updateBoss, checkBossCollisions, drawBoss, getBoss, isBossAlive,
         isBossDefeated, getBossInfo, clearBoss } from './bosses.js';
import { activateCompanion, isCompanionActive, resetCompanion,
         updateCompanion, drawCompanion, getCompanion } from './companion.js';
import { getLevel, TOTAL_LEVELS } from './levels.js';
import { initAudio, sfxJump, sfxCoin, sfxHit, sfxEnemyKill, sfxBossHit,
         sfxLevelWin, sfxGameOver, sfxEvolution, sfxDash, sfxBossDefeat, sfxVictory, sfxClick } from './audio.js';
import { saveGame, loadGame, hasSave } from './save.js';

// Decor imports
import { initPlage, drawPlage } from './decors/plage.js';
import { initForet, drawForet } from './decors/foret.js';
import { initMontagne, drawMontagne } from './decors/montagne.js';
import { initVille, drawVille } from './decors/ville.js';
import { initVolcan, drawVolcan } from './decors/volcan.js';
import { initDesert, drawDesert } from './decors/desert.js';
import { initForteresse, drawForteresse } from './decors/forteresse.js';
import { initUsine, drawUsine } from './decors/usine.js';

// === CANVAS ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = GAME_W;
canvas.height = GAME_H;

// === MISE À L'ÉCHELLE AUTOMATIQUE (Auto-scaling) ===
let scaleX = 1;
let scaleY = 1;

function resizeCanvas() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isMobile && isLandscape) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaleX = canvas.width / GAME_W;
    scaleY = canvas.height / GAME_H;
  } else {
    canvas.width = GAME_W;
    canvas.height = GAME_H;
    scaleX = 1;
    scaleY = 1;
  }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// === ÉTAT DU JEU (Game state) ===
const game = {
  state: STATE.TITLE,
  level: 1,
  score: 0,
  coins: 0,
  lives: START_LIVES,
  themeName: '',
  levelWidth: 4000,
};

let frameCount = 0;
let lastEvolution = null;
let currentLevelData = null;

// === MAP DÉCORS (Decor map) ===
const DECOR_INIT = {
  plage: initPlage,
  foret: initForet,
  montagne: initMontagne,
  ville: initVille,
  volcan: initVolcan,
  desert: initDesert,
  forteresse: initForteresse,
  usine: initUsine,
};

const DECOR_DRAW = {
  plage: drawPlage,
  foret: drawForet,
  montagne: drawMontagne,
  ville: drawVille,
  volcan: drawVolcan,
  desert: drawDesert,
  forteresse: drawForteresse,
  usine: drawUsine,
};

// =============================================
// INITIALISATION (Initialization)
// =============================================
function init() {
  initInput();
  initAudio();

  // Vérifier s'il y a une sauvegarde (Check for save)
  if (hasSave()) {
    showNotification('💾 Sauvegarde trouvée! (P pour charger)');
  }

  // Lancer la boucle (Start loop)
  requestAnimationFrame(gameLoop);
}

// =============================================
// BOUCLE DE JEU (Game loop)
// =============================================
function gameLoop(timestamp) {
  frameCount++;

  // Effacer l'écran (Clear screen)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scaleX, scaleY);

  // Screen shake
  const shk = getShake();
  if (shk.x !== 0 || shk.y !== 0) {
    ctx.save();
    ctx.translate(shk.x, shk.y);
  }

  // Machine à états (State machine)
  switch (game.state) {
    case STATE.TITLE:    updateTitle(); break;
    case STATE.STORY:    updateStory(); break;
    case STATE.PLAYING:  updatePlaying(); break;
    case STATE.PAUSED:   updatePaused(); break;
    case STATE.GAME_OVER: updateGameOver(); break;
    case STATE.LEVEL_WIN: updateLevelWin(); break;
    case STATE.EVOLUTION: updateEvolutionScreen(); break;
    case STATE.BOSS_INTRO: updateBossIntroScreen(); break;
    case STATE.VICTORY:  updateVictory(); break;
  }

  // Restore from shake
  if (shk.x !== 0 || shk.y !== 0) {
    ctx.restore();
  }

  // Notifications
  drawNotification(ctx);

  // Clear input state
  clearJustPressed();

  requestAnimationFrame(gameLoop);
}

// =============================================
// ÉTAT : TITRE (State: Title)
// =============================================
function updateTitle() {
  drawTitleScreen(ctx, frameCount);

  if (isAction()) {
    sfxClick();
    game.state = STATE.STORY;
    startScene('intro');
  }

  // Charger une sauvegarde avec L (Load save with L)
  if (isKeyJustPressed('l') && hasSave()) {
    const save = loadGame();
    if (save) {
      game.level = save.level;
      game.score = save.score;
      game.coins = save.coins;
      game.lives = save.lives;
      player.evolutionLevel = save.evolutionLevel;
      if (save.hasCompanion) activateCompanion();
      showNotification('💾 Partie chargée!');
      sfxClick();
      startLevel();
    }
  }
}

// =============================================
// ÉTAT : CINÉMATIQUE (State: Story)
// =============================================
function updateStory() {
  updateScene();
  drawScene(ctx, frameCount);

  if (isAction()) {
    sfxClick();
    const done = advanceScene();
    if (done) {
      // Après l'intro, lancer le niveau (After intro, start level)
      startLevel();
    }
  }
}

// =============================================
// DÉMARRER UN NIVEAU (Start a level)
// =============================================
function startLevel() {
  currentLevelData = getLevel(game.level);
  game.themeName = currentLevelData.nom;

  // Initialiser le décor (Initialize decor)
  const initDecor = DECOR_INIT[currentLevelData.theme];
  if (initDecor) initDecor(game.levelWidth);

  // Vérifier la cinématique (Check story)
  if (currentLevelData.storyBefore && game.state !== STATE.PLAYING) {
    // La cinématique est déjà jouée avant le mode select
  }

  // Générer le niveau à pied (Generate on-foot level)
  const levelData = generatePiedLevel(game.level, currentLevelData.theme);
  game.levelWidth = levelData.levelWidth;

  // Réinitialiser le joueur (Reset player)
  resetPlayer();
  resetCamera();
  clearParticles();
  clearBoss();

  // Générer les ennemis (Generate enemies)
  generateEnemies(currentLevelData.enemies, currentLevelData.enemyCount, game.levelWidth);

  // Initialiser le boss si nécessaire (Initialize boss if needed)
  if (currentLevelData.boss) {
    initBoss(currentLevelData.boss, game.levelWidth);
  }

  // Compagnon
  if (isCompanionActive()) {
    resetCompanion(player.x, player.y);
  }

  // Boss intro?
  if (currentLevelData.boss && currentLevelData.storyBefore) {
    // La story contient déjà l'intro du boss
  }

  game.state = STATE.PLAYING;
  updateHUD(game);
  updateMessage('Niveau ' + game.level + ' — ' + currentLevelData.nom);
}

// =============================================
// ÉTAT : JEU EN COURS (State: Playing)
// =============================================
function updatePlaying() {
  // Pause
  if (isKeyJustPressed('p') || isKeyJustPressed('Escape')) {
    sfxClick();
    game.state = STATE.PAUSED;
    return;
  }

  updatePlayingPied();
}

// --- Mode à pied (On-foot mode) ---
function updatePlayingPied() {
  const platforms = getPlatforms();
  const cameraX = getCameraX();
  const themeColors = LEVEL_COLORS[currentLevelData.theme] || LEVEL_COLORS.plage;

  // Dessiner le décor (Draw decor)
  const drawDecor = DECOR_DRAW[currentLevelData.theme];
  if (drawDecor) drawDecor(ctx, cameraX, frameCount);

  // Dessiner les plateformes (Draw platforms)
  drawPlatforms(ctx, cameraX, themeColors);

  // Dessiner les pièces (Draw coins)
  drawCoins(ctx, cameraX, frameCount);

  // Dessiner le drapeau (Draw flag)
  drawFlag(ctx, cameraX, frameCount);

  // Mettre à jour le joueur (Update player)
  const fell = updatePlayer(platforms, game.levelWidth);
  if (fell) {
    loseLife();
    return;
  }

  // Caméra
  updateCamera(player.x, game.levelWidth);

  // Pièces (Coins)
  const collected = checkCoinCollection(player);
  if (collected > 0) {
    game.coins += collected;
    game.score += collected * COIN_SCORE;
    sfxCoin();
    updateHUD(game);
  }

  // Ennemis (Enemies)
  updateEnemies(player);
  const enemyResult = checkEnemyCollisions(player);
  if (enemyResult) {
    if (enemyResult.type === 'kill') {
      game.score += enemyResult.score;
      player.vy = -8; // Rebondir (Bounce)
      sfxEnemyKill();
      updateHUD(game);
    } else if (enemyResult.type === 'bounce') {
      player.vy = -8;
    } else if (enemyResult.type === 'hit') {
      if (player.invincible <= 0 && player.shieldTimer <= 0) {
        loseLife();
        return;
      }
    }
  }

  // Boss
  if (isBossAlive()) {
    updateBoss(player);
    const bossResult = checkBossCollisions(player);
    if (bossResult) {
      if (bossResult.type === 'boss_killed') {
        game.score += BOSS_SCORE;
        sfxBossDefeat();
        shake(20);
        showNotification('🎉 Boss vaincu!');
        updateHUD(game);
      } else if (bossResult.type === 'boss_hit') {
        game.score += bossResult.score;
        player.vy = -10;
        sfxBossHit();
        shake(8);
        updateHUD(game);
      } else if (bossResult.type === 'hit') {
        if (player.invincible <= 0 && player.shieldTimer <= 0) {
          loseLife();
          return;
        }
      }
    }
  }

  // Compagnon (Companion)
  if (isCompanionActive()) {
    updateCompanion(player, getEnemies());
  }

  // Vérifier le drapeau (Check flag)
  if (checkFlagReached(player, isBossAlive())) {
    winLevel();
    return;
  }

  // Particules (Particles)
  updateParticles();

  // Dessiner les ennemis (Draw enemies)
  drawEnemies(ctx, getCameraX(), frameCount);

  // Dessiner le boss (Draw boss)
  if (isBossAlive()) {
    drawBoss(ctx, getCameraX(), frameCount);
  }

  // Dessiner le compagnon (Draw companion)
  if (isCompanionActive()) {
    drawCompanion(ctx, getCameraX(), frameCount);
  }

  // Dessiner le joueur (Draw player)
  drawPlayer(ctx, getCameraX(), frameCount);

  // Dessiner les particules (Draw particles)
  drawParticles(ctx, getCameraX());

  // HUD
  updateHUD(game);
}

// =============================================
// PERDRE UNE VIE (Lose a life)
// =============================================
function loseLife() {
  game.lives--;
  sfxHit();
  shake(12);
  updateHUD(game);

  if (game.lives <= 0) {
    game.state = STATE.GAME_OVER;
    sfxGameOver();
    updateMessage('Game Over!');
  } else {
    // Réapparaître (Respawn)
    player.invincible = 90; // 1.5 secondes (1.5 seconds)
    resetPlayer();
    resetCamera();
    showNotification('💔 -1 Vie! (' + game.lives + ' restantes)');
  }
}

// =============================================
// GAGNER UN NIVEAU (Win a level)
// =============================================
function winLevel() {
  sfxLevelWin();
  game.score += LEVEL_SCORE;
  updateHUD(game);

  // Vérifier le compagnon (Check for companion unlock)
  if (currentLevelData.unlockCompanion && !isCompanionActive()) {
    activateCompanion();
    player.hasCompanion = true;
    showNotification('🐕 Compagnon débloqué!');
  }

  // Vérifier l'évolution (Check evolution)
  if (currentLevelData.evolutionAfter) {
    lastEvolution = evolvePlayer();
    if (lastEvolution) {
      game.state = STATE.EVOLUTION;
      sfxEvolution();
      return;
    }
  }

  // Vérifier si c'est le dernier niveau (Check if last level)
  if (game.level >= TOTAL_LEVELS) {
    game.state = STATE.VICTORY;
    sfxVictory();
    return;
  }

  // Cinématique après le niveau (Story after level)
  if (currentLevelData.storyAfter) {
    // Passer au niveau suivant puis montrer la cinématique
    game.state = STATE.LEVEL_WIN;
  } else {
    game.state = STATE.LEVEL_WIN;
  }
}

// =============================================
// ÉTAT : PAUSE (State: Paused)
// =============================================
function updatePaused() {
  // Dessiner le jeu en arrière-plan (Draw game in background)
  const drawDecor = DECOR_DRAW[currentLevelData.theme];
  if (drawDecor) drawDecor(ctx, getCameraX(), frameCount);
  const themeColors = LEVEL_COLORS[currentLevelData.theme] || LEVEL_COLORS.plage;
  drawPlatforms(ctx, getCameraX(), themeColors);
  drawPlayer(ctx, getCameraX(), frameCount);

  drawPauseScreen(ctx);

  if (isKeyJustPressed('p') || isKeyJustPressed('Escape')) {
    sfxClick();
    game.state = STATE.PLAYING;
  }

  // Sauvegarder avec S (Save with S)
  if (isKeyJustPressed('s')) {
    const success = saveGame(game, player);
    showNotification(success ? '💾 Partie sauvegardée!' : '❌ Erreur de sauvegarde');
    sfxClick();
  }
}

// =============================================
// ÉTAT : GAME OVER (State: Game over)
// =============================================
function updateGameOver() {
  drawGameOverScreen(ctx, frameCount, game);

  if (isAction()) {
    sfxClick();
    resetGame();
  }
}

// =============================================
// ÉTAT : NIVEAU GAGNÉ (State: Level win)
// =============================================
function updateLevelWin() {
  drawLevelWinScreen(ctx, frameCount, game);

  if (isAction()) {
    sfxClick();
    game.level++;

    if (game.level > TOTAL_LEVELS) {
      game.state = STATE.VICTORY;
      sfxVictory();
      return;
    }

    // Cinématique avant le prochain niveau? (Story before next level?)
    const nextLevel = getLevel(game.level);
    if (nextLevel.storyBefore) {
      startScene(nextLevel.storyBefore);
      game.state = STATE.STORY;
    } else {
      startLevel();
    }
  }
}

// =============================================
// ÉTAT : ÉVOLUTION (State: Evolution)
// =============================================
function updateEvolutionScreen() {
  drawEvolutionScreen(ctx, frameCount, lastEvolution);

  if (isAction()) {
    sfxClick();

    // Vérifier si c'est le dernier niveau (Check if last level)
    if (game.level >= TOTAL_LEVELS) {
      game.state = STATE.VICTORY;
      sfxVictory();
      return;
    }

    game.state = STATE.LEVEL_WIN;
  }
}

// =============================================
// ÉTAT : INTRO DU BOSS (State: Boss intro)
// =============================================
function updateBossIntroScreen() {
  const bossId = currentLevelData ? currentLevelData.boss : null;
  const bossInfo = bossId ? getBossInfo(bossId) : { nom: 'Boss', emoji: '👑', desc: '' };
  drawBossIntro(ctx, frameCount, bossInfo);

  if (isAction()) {
    sfxClick();
    game.state = STATE.PLAYING;
  }
}

// =============================================
// ÉTAT : VICTOIRE (State: Victory)
// =============================================
function updateVictory() {
  drawVictoryScreen(ctx, frameCount, game);

  if (isAction()) {
    sfxClick();
    resetGame();
  }
}

// =============================================
// RÉINITIALISER LE JEU (Reset game)
// =============================================
function resetGame() {
  game.state = STATE.TITLE;
  game.level = 1;
  game.score = 0;
  game.coins = 0;
  game.lives = START_LIVES;
  game.themeName = '';
  player.evolutionLevel = 0;
  player.hasCompanion = false;
  lastEvolution = null;
  currentLevelData = null;
  resetPlayer();
  resetCamera();
  clearParticles();
  clearBoss();
  updateHUD(game);
  updateMessage('');
}

// =============================================
// DÉMARRAGE! (Start!)
// =============================================
init();
