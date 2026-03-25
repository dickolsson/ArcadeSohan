// ==========================================================
// 👑 BOSSES — Les 4 boss du Dr. Destructo (The 4 bosses)
// Mini Destructo, Général Méca, Robo-Destructo, Dr. Destructo
// ==========================================================

import { GAME_W, GAME_H, TILE, COLORS } from './config.js';
import { clamp, random } from '../shared/utils.js';
import { checkCollision } from '../shared/physics.js';
import { spawnExplosion, spawnParticles } from '../shared/particles.js';

// === DONNÉES DES BOSS (Boss data) ===
const BOSS_DATA = {
  mini_destructo: {
    nom: 'Mini Destructo',
    emoji: '👦',
    desc: 'Le fils du Dr. Destructo!',
    hp: 8,
    w: 40, h: 44,
    color: '#E74C3C',
    speed: 1.4,
    phases: 1,
    attacks: ['jump_arc', 'charge', 'throw', 'ground_stomp'],
  },
  general_meca: {
    nom: 'Général Méca',
    emoji: '🎖️',
    desc: 'Son armure est très résistante!',
    hp: 14,
    w: 48, h: 50,
    color: '#3498DB',
    speed: 1.1,
    phases: 2,
    attacks: ['shield_bash', 'missiles', 'stomp'],
  },
  robo_destructo: {
    nom: 'Robo-Destructo',
    emoji: '🤖',
    desc: 'Il copie tous tes mouvements!',
    hp: 18,
    w: 44, h: 48,
    color: '#9B59B6',
    speed: 1.6,
    phases: 2,
    attacks: ['copy', 'laser', 'dash'],
  },
  dr_destructo: {
    nom: 'Dr. Destructo',
    emoji: '🦹',
    desc: 'Le boss final! Sauve la Terre!',
    hp: 25,
    w: 50, h: 54,
    color: '#1A1A2E',
    speed: 1.8,
    phases: 3,
    attacks: ['bomb_rain', 'charge', 'laser', 'summon'],
  },
};

// === ÉTAT DU BOSS ACTIF (Active boss state) ===
let boss = null;
let bossProjectiles = [];
let bossPhase = 0;
let attackTimer = 0;
let attackCooldown = 90;
let currentAttack = '';
let chargeDir = 0;
let bossDefeated = false;

export function getBoss() { return boss; }
export function isBossAlive() { return boss !== null && boss.hp > 0; }
export function isBossDefeated() { return bossDefeated; }

// Obtenir les infos du boss pour l'écran d'intro (Get boss info for intro screen)
export function getBossInfo(bossId) {
  return BOSS_DATA[bossId] || { nom: 'Boss', emoji: '👑', desc: 'Un boss mystérieux!' };
}

// === INITIALISER UN BOSS (Initialize a boss) ===
export function initBoss(bossId, levelWidth) {
  const data = BOSS_DATA[bossId];
  if (!data) {
    boss = null;
    return;
  }

  boss = {
    id: bossId,
    nom: data.nom,
    emoji: data.emoji,
    x: levelWidth - 300,
    y: GAME_H - TILE - data.h,
    w: data.w,
    h: data.h,
    hp: data.hp,
    maxHp: data.hp,
    color: data.color,
    speed: data.speed,
    phases: data.phases,
    attacks: data.attacks,
    facing: -1,
    animFrame: 0,
    animTimer: 0,
    hitTimer: 0,
    shieldUp: false,
    chargeTimer: 0,
    vy: 0,
    groundY: GAME_H - TILE - data.h,
    patrolDir: -1,
    patrolTimer: 0,
  };

  bossProjectiles = [];
  bossPhase = 0;
  attackTimer = 150;  // Attendre un peu avant d'attaquer (Wait before attacking)
  attackCooldown = 120;
  currentAttack = '';
  chargeDir = 0;
  bossDefeated = false;
}

// === METTRE À JOUR LE BOSS (Update boss) ===
export function updateBoss(player) {
  if (!boss || boss.hp <= 0) return;

  // Animation
  boss.animTimer++;
  if (boss.animTimer > 16) {
    boss.animTimer = 0;
    boss.animFrame = (boss.animFrame + 1) % 4;
  }

  // Hit flash
  if (boss.hitTimer > 0) boss.hitTimer--;

  // Déterminer la phase (Determine phase)
  const hpRatio = boss.hp / boss.maxHp;
  if (boss.phases >= 3 && hpRatio < 0.33) {
    bossPhase = 2;
    attackCooldown = 70;
  } else if (boss.phases >= 2 && hpRatio < 0.6) {
    bossPhase = 1;
    attackCooldown = 95;
  } else {
    bossPhase = 0;
  }

  // Direction vers le joueur (Face player)
  boss.facing = player.x < boss.x ? -1 : 1;

  // Timer d'attaque (Attack timer)
  attackTimer--;
  if (attackTimer <= 0) {
    // Choisir une attaque (Choose attack)
    const available = boss.attacks;
    currentAttack = available[Math.floor(Math.random() * available.length)];
    performAttack(currentAttack, player);
    attackTimer = attackCooldown + Math.random() * 40;
  }

  // Mouvement de charge (Charge movement)
  if (boss.chargeTimer > 0) {
    boss.chargeTimer--;
    boss.x += chargeDir * (boss.speed * 2.5);
    boss.x = clamp(boss.x, 50, GAME_W + 3000);
  } else {
    // Patrouiller entre les attaques (Patrol between attacks)
    boss.patrolTimer--;
    if (boss.patrolTimer <= 0) {
      boss.patrolDir = -boss.patrolDir;
      boss.patrolTimer = 60 + Math.random() * 80;
    }
    const dx = player.x - boss.x;
    // Aller vers le joueur si loin, sinon patrouiller (Go to player if far, otherwise patrol)
    if (Math.abs(dx) > 200) {
      boss.x += clamp(dx * 0.02, -boss.speed, boss.speed);
    } else {
      boss.x += boss.patrolDir * boss.speed * 0.6;
    }
    boss.x = clamp(boss.x, 50, GAME_W + 3000);
  }

  // Gravité et sol (Gravity and ground)
  boss.vy += 0.5;
  boss.y += boss.vy;
  boss.groundY = GAME_H - TILE - boss.h;
  if (boss.y >= boss.groundY) {
    // Onde de choc au sol si ground_stomp (Shockwave on landing)
    if (boss.vy > 8 && currentAttack === 'ground_stomp') {
      for (let i = 0; i < 4; i++) {
        bossProjectiles.push({
          x: boss.x + boss.w / 2,
          y: GAME_H - TILE - 8,
          vx: (i < 2 ? -1 : 1) * (2 + i * 0.8),
          vy: 0,
          w: 16, h: 8,
          type: 'wave',
          life: 50,
        });
      }
      spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h, ['#795548', '#FFE66D'], 12);
    }
    boss.y = boss.groundY;
    boss.vy = 0;
  }

  // Mettre à jour les projectiles du boss (Update boss projectiles)
  for (let i = bossProjectiles.length - 1; i >= 0; i--) {
    const p = bossProjectiles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.gravity) p.vy += p.gravity;
    p.life--;
    if (p.life <= 0 || p.y > GAME_H + 50 || p.x < -100 || p.x > GAME_W + 4000) {
      bossProjectiles.splice(i, 1);
    }
  }
}

// Effectuer une attaque (Perform an attack)
function performAttack(attack, player) {
  switch (attack) {
    case 'jump_arc':
      // Sauter en arc vers le joueur (Jump arc toward player)
      boss.vy = -10;
      boss.chargeTimer = 25;
      chargeDir = boss.facing;
      spawnParticles(boss.x + boss.w / 2, boss.y + boss.h, boss.color, 8);
      break;

    case 'charge':
      boss.chargeTimer = 35;
      chargeDir = boss.facing;
      spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#FF4444', 8);
      break;

    case 'throw':
      // Lancer un projectile vers le joueur (Throw projectile at player)
      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      bossProjectiles.push({
        x: boss.x + boss.w / 2,
        y: boss.y + boss.h / 2,
        vx: (dx / dist) * 3.5,
        vy: (dy / dist) * 3.5 - 1,
        gravity: 0.08,
        w: 10, h: 10,
        type: 'missile',
        life: 120,
      });
      break;

    case 'ground_stomp':
      // Sauter haut puis écraser le sol (Jump high then slam ground)
      boss.vy = -13;
      // L'onde de choc sera créée à l'atterrissage
      spawnParticles(boss.x + boss.w / 2, boss.y + boss.h, '#795548', 6);
      break;

    case 'shield_bash':
      boss.shieldUp = true;
      boss.chargeTimer = 25;
      chargeDir = boss.facing;
      setTimeout(() => { if (boss) boss.shieldUp = false; }, 1500);
      break;

    case 'missiles':
      for (let i = 0; i < 3 + bossPhase; i++) {
        bossProjectiles.push({
          x: boss.x + boss.w / 2,
          y: boss.y + 10,
          vx: (Math.random() - 0.5) * 3,
          vy: -3.5 - Math.random() * 2,
          gravity: 0.15,
          w: 10, h: 10,
          type: 'missile',
          life: 120,
        });
      }
      break;

    case 'stomp':
      // Onde de choc au sol (Ground shockwave)
      for (let i = 0; i < 4; i++) {
        bossProjectiles.push({
          x: boss.x + boss.w / 2,
          y: GAME_H - TILE - 8,
          vx: (i < 2 ? -1 : 1) * (2.2 + i * 0.7),
          vy: 0,
          w: 16, h: 8,
          type: 'wave',
          life: 60,
        });
      }
      spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h, ['#795548', '#FFE66D'], 10);
      break;

    case 'copy':
      // Copier la position du joueur et charger (Copy player position and charge)
      boss.x = clamp(player.x + 200 * boss.facing, 50, GAME_W + 3000);
      boss.chargeTimer = 15;
      chargeDir = -boss.facing;
      break;

    case 'laser':
      // Rayon laser horizontal (Horizontal laser beam)
      bossProjectiles.push({
        x: boss.x + (boss.facing > 0 ? boss.w : -200),
        y: boss.y + boss.h / 2 - 4,
        vx: boss.facing * 4.5,
        vy: 0,
        w: 200, h: 8,
        type: 'laser',
        life: 40,
      });
      break;

    case 'dash':
      boss.chargeTimer = 20;
      chargeDir = boss.facing;
      spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#9B59B6', 10);
      break;

    case 'bomb_rain':
      // Pluie de bombes (Bomb rain)
      for (let i = 0; i < 5 + bossPhase * 2; i++) {
        bossProjectiles.push({
          x: player.x - 100 + Math.random() * 200,
          y: -20 - Math.random() * 60,
          vx: 0,
          vy: 1.5 + Math.random() * 1.5,
          w: 12, h: 12,
          type: 'bomb',
          life: 180,
        });
      }
      break;

    case 'summon':
      // Invoquer des mini projectiles (Summon mini projectiles)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        bossProjectiles.push({
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h / 2,
          vx: Math.cos(angle) * 2.2,
          vy: Math.sin(angle) * 2.2,
          w: 8, h: 8,
          type: 'orb',
          life: 90,
        });
      }
      break;
  }
}

// === VÉRIFIER LES COLLISIONS JOUEUR-BOSS (Check player-boss collisions) ===
export function checkBossCollisions(player) {
  if (!boss || boss.hp <= 0) return null;

  // Le joueur touche le boss
  if (checkCollision(player, boss)) {
    // Atterrir sur le boss = le frapper (Land on boss = hit it)
    if (player.vy > 0 && player.y + player.h - 10 < boss.y + boss.h / 2 && !boss.shieldUp) {
      boss.hp--;
      boss.hitTimer = 15;
      spawnExplosion(boss.x + boss.w / 2, boss.y, [boss.color, '#FFF'], 10);
      
      if (boss.hp <= 0) {
        bossDefeated = true;
        spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, [boss.color, '#FFE66D', '#FF6F91'], 25);
        return { type: 'boss_killed', score: 200 };
      }
      return { type: 'boss_hit', score: 25 };
    } else {
      // Touché par le boss (Hit by boss)
      return { type: 'hit' };
    }
  }

  // Vérifier les projectiles du boss (Check boss projectiles)
  for (let i = bossProjectiles.length - 1; i >= 0; i--) {
    const p = bossProjectiles[i];
    if (checkCollision(player, p)) {
      spawnExplosion(p.x, p.y, ['#FF4444', '#FFE66D'], 8);
      bossProjectiles.splice(i, 1);
      return { type: 'hit' };
    }
  }

  return null;
}

// === DESSIN DU BOSS (Draw boss) ===
export function drawBoss(ctx, cameraX, frameCount) {
  if (!boss || boss.hp <= 0) return;
  const bx = boss.x - cameraX;
  if (bx + boss.w < -50 || bx > GAME_W + 50) return;

  // Clignoter si touché (Blink if hit)
  if (boss.hitTimer > 0 && Math.floor(boss.hitTimer / 3) % 2 === 0) return;

  ctx.save();
  ctx.translate(bx + boss.w / 2, boss.y + boss.h);
  ctx.scale(boss.facing, 1);
  ctx.translate(-boss.w / 2, -boss.h);

  // Ombre (Shadow)
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(boss.w / 2, boss.h + 2, boss.w / 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corps (Body)
  ctx.fillStyle = boss.color;
  ctx.fillRect(4, 8, boss.w - 8, boss.h - 12);

  // Visage plus clair (Lighter face)
  ctx.fillStyle = '#F5DEB3';
  ctx.fillRect(8, 10, boss.w - 16, boss.h * 0.4);

  // Yeux méchants (Evil eyes)
  ctx.fillStyle = '#FFF';
  ctx.fillRect(12, 14, 8, 8);
  ctx.fillRect(boss.w - 20, 14, 8, 8);
  ctx.fillStyle = '#E74C3C';
  ctx.fillRect(14, 16, 5, 5);
  ctx.fillRect(boss.w - 18, 16, 5, 5);

  // Bouche méchante (Evil mouth)
  ctx.fillStyle = '#333';
  ctx.fillRect(14, 28, boss.w - 28, 4);

  // Détails par boss (Boss-specific details)
  if (boss.id === 'mini_destructo') {
    // Cheveux hérissés (Spiky hair)
    ctx.fillStyle = '#C0392B';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(8 + i * 6, 2, 4, 8);
    }
  } else if (boss.id === 'general_meca') {
    // Armure (Armor)
    ctx.fillStyle = '#2980B9';
    ctx.fillRect(0, boss.h * 0.4, boss.w, boss.h * 0.3);
    // Étoile (Star)
    ctx.fillStyle = '#F1C40F';
    ctx.font = '12px serif';
    ctx.fillText('⭐', boss.w / 2 - 6, boss.h * 0.6);
    if (boss.shieldUp) {
      ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
      ctx.fillRect(-8, 0, 12, boss.h);
    }
  } else if (boss.id === 'robo_destructo') {
    // Corps métallique (Metallic body)
    ctx.fillStyle = '#95A5A6';
    ctx.fillRect(6, boss.h * 0.35, boss.w - 12, boss.h * 0.35);
    // Antenne
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(boss.w / 2 - 2, -6, 4, 10);
    ctx.beginPath();
    ctx.arc(boss.w / 2, -6, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (boss.id === 'dr_destructo') {
    // Cape (Cape)
    ctx.fillStyle = '#4A0E4E';
    const capeWave = Math.sin(frameCount * 0.08) * 5;
    ctx.fillRect(boss.w - 4, 10, 12 + capeWave, boss.h - 20);
    // Couronne (Crown)
    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(6, 0, boss.w - 12, 8);
    ctx.fillRect(8, -4, 4, 6);
    ctx.fillRect(boss.w / 2 - 2, -6, 4, 8);
    ctx.fillRect(boss.w - 12, -4, 4, 6);
  }

  // Pattes (Legs)
  ctx.fillStyle = boss.color;
  const legOffset = Math.sin(boss.animFrame * Math.PI / 2) * 4;
  ctx.fillRect(8, boss.h - 6 + legOffset, 10, 6);
  ctx.fillRect(boss.w - 18, boss.h - 6 - legOffset, 10, 6);

  ctx.restore();

  // Barre de vie du boss (Boss health bar)
  const barW = 200;
  const barX = GAME_W / 2 - barW / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(barX - 4, 48, barW + 8, 20);
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, 52, barW, 12);
  const hpRatio = boss.hp / boss.maxHp;
  ctx.fillStyle = hpRatio > 0.5 ? COLORS.green : hpRatio > 0.25 ? COLORS.yellow : COLORS.red;
  ctx.fillRect(barX, 52, barW * hpRatio, 12);
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, 52, barW, 12);
  // Nom du boss (Boss name)
  ctx.fillStyle = COLORS.pink;
  ctx.font = '8px "Press Start 2P", cursive';
  ctx.textAlign = 'center';
  ctx.fillText(boss.nom, GAME_W / 2, 46);
  ctx.textAlign = 'left';

  // Dessiner les projectiles du boss (Draw boss projectiles)
  for (const p of bossProjectiles) {
    const px = p.x - cameraX;
    if (px < -220 || px > GAME_W + 50) continue;

    switch (p.type) {
      case 'missile':
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.arc(px, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF6F00';
        ctx.beginPath();
        ctx.arc(px, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'wave':
        ctx.fillStyle = 'rgba(121, 85, 72, 0.7)';
        ctx.fillRect(px, p.y, p.w, p.h);
        break;
      case 'laser':
        ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.fillRect(px, p.y, p.w, p.h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(px, p.y + 2, p.w, p.h - 4);
        break;
      case 'bomb':
        ctx.font = '12px serif';
        ctx.fillText('💣', px, p.y + 6);
        break;
      case 'orb':
        ctx.fillStyle = '#9B59B6';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(px, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
    }
  }
}

// Réinitialiser le boss (Reset boss)
export function clearBoss() {
  boss = null;
  bossProjectiles = [];
  bossDefeated = false;
}
