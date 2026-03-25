// ==========================================================
// 👾 ENEMIES — Ennemis du Dr. Destructo (Enemies)
// 5 types : soldat, bouclier, lanceur, motard, robot
// ==========================================================

import { GAME_W, GAME_H, TILE, COLORS } from './config.js';
import { random, randomInt, clamp } from '../shared/utils.js';
import { checkCollision } from '../shared/physics.js';
import { spawnExplosion, spawnParticles } from '../shared/particles.js';

// === TABLEAU DES ENNEMIS (Enemy array) ===
let enemies = [];
let enemyProjectiles = [];

export function getEnemies() { return enemies; }
export function getEnemyProjectiles() { return enemyProjectiles; }

// === TYPES D'ENNEMIS (Enemy types) ===
const ENEMY_TYPES = {
  // Soldat basique — marche de gauche à droite (Basic soldier — walks left to right)
  soldat: {
    w: 24, h: 28, hp: 1, speed: 0.7, score: 50,
    color: '#E74C3C', emoji: '🔴',
    behavior: 'patrol',
  },
  // Soldat avec bouclier — ne peut être touché que par derrière (Shield soldier)
  bouclier: {
    w: 26, h: 30, hp: 2, speed: 0.55, score: 80,
    color: '#3498DB', emoji: '🛡️',
    behavior: 'patrol',
  },
  // Lanceur de bombes — lance des projectiles (Bomb thrower)
  lanceur: {
    w: 24, h: 28, hp: 1, speed: 0.4, score: 100,
    color: '#F39C12', emoji: '💣',
    behavior: 'throw',
    throwInterval: 150,
  },
  // Motard rival — rapide, en mode voiture (Fast biker)
  motard: {
    w: 30, h: 24, hp: 2, speed: 1.8, score: 120,
    color: '#9B59B6', emoji: '🏍️',
    behavior: 'rush',
  },
  // Robot — copie les mouvements du joueur (Robot — copies player)
  robot: {
    w: 26, h: 30, hp: 3, speed: 0.85, score: 150,
    color: '#7F8C8D', emoji: '🤖',
    behavior: 'follow',
  },
};

// === GÉNÉRER LES ENNEMIS D'UN NIVEAU (Generate enemies for a level) ===
export function generateEnemies(enemyTypes, count, levelWidth) {
  enemies = [];
  enemyProjectiles = [];
  const groundY = GAME_H - TILE;

  for (let i = 0; i < count; i++) {
    const type = enemyTypes[i % enemyTypes.length];
    const def = ENEMY_TYPES[type];
    if (!def) continue;

    const ex = 400 + Math.random() * (levelWidth - 600);
    enemies.push({
      type,
      x: ex,
      y: groundY - def.h,
      w: def.w,
      h: def.h,
      hp: def.hp,
      maxHp: def.hp,
      speed: def.speed,
      score: def.score,
      color: def.color,
      emoji: def.emoji,
      behavior: def.behavior,
      facing: -1,
      // Patrol range (Zone de patrouille)
      patrolLeft: ex - 100,
      patrolRight: ex + 100,
      // Throwing timer (Minuterie de lancer)
      throwTimer: def.throwInterval || 0,
      throwInterval: def.throwInterval || 120,
      // Animation
      animFrame: 0,
      animTimer: 0,
      hitTimer: 0,
      alive: true,
    });
  }
}

// === METTRE À JOUR LES ENNEMIS (Update enemies) ===
export function updateEnemies(player) {
  for (const e of enemies) {
    if (!e.alive) continue;
    if (e.hitTimer > 0) e.hitTimer--;

    // Animation
    e.animTimer++;
    if (e.animTimer > 14) {
      e.animTimer = 0;
      e.animFrame = (e.animFrame + 1) % 4;
    }

    switch (e.behavior) {
      case 'patrol':
        // Marcher de gauche à droite (Walk left to right)
        e.x += e.speed * e.facing;
        if (e.x <= e.patrolLeft) e.facing = 1;
        if (e.x >= e.patrolRight) e.facing = -1;
        break;

      case 'throw':
        // Patrouiller et lancer des bombes (Patrol and throw bombs)
        e.x += e.speed * e.facing;
        if (e.x <= e.patrolLeft) e.facing = 1;
        if (e.x >= e.patrolRight) e.facing = -1;
        e.throwTimer--;
        if (e.throwTimer <= 0) {
          e.throwTimer = e.throwInterval;
          const dx = player.x - e.x;
          const dir = dx > 0 ? 1 : -1;
          enemyProjectiles.push({
            x: e.x + e.w / 2,
            y: e.y,
            vx: dir * 3,
            vy: -4,
            w: 10, h: 10,
            gravity: 0.15,
            alive: true,
          });
        }
        break;

      case 'rush':
        // Foncer vers le joueur (Rush toward player)
        const dx = player.x - e.x;
        e.facing = dx > 0 ? 1 : -1;
        if (Math.abs(dx) < 400) {
          e.x += e.speed * e.facing;
        }
        break;

      case 'follow':
        // Suivre le joueur (Follow player)
        const fdx = player.x - e.x;
        const fdy = player.y - e.y;
        e.facing = fdx > 0 ? 1 : -1;
        if (Math.abs(fdx) > 30) {
          e.x += clamp(fdx * 0.02, -e.speed, e.speed);
        }
        if (Math.abs(fdy) > 20) {
          e.y += clamp(fdy * 0.015, -e.speed * 0.5, e.speed * 0.5);
        }
        // Limiter au sol (Keep on ground)
        e.y = clamp(e.y, 50, GAME_H - TILE - e.h);
        break;
    }
  }

  // Mettre à jour les projectiles ennemis (Update enemy projectiles)
  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const p = enemyProjectiles[i];
    p.x += p.vx;
    p.vy += p.gravity || 0;
    p.y += p.vy;
    if (p.y > GAME_H || p.x < -50 || p.x > GAME_W + 1000) {
      enemyProjectiles.splice(i, 1);
    }
  }
}

// === VÉRIFIER LES COLLISIONS JOUEUR-ENNEMI (Check player-enemy collisions) ===
export function checkEnemyCollisions(player) {
  // Vérifier si le joueur saute sur un ennemi (Check if player lands on enemy)
  for (const e of enemies) {
    if (!e.alive || e.hitTimer > 0) continue;

    if (checkCollision(player, e)) {
      // Atterrir sur l'ennemi = le tuer (Land on enemy = kill)
      if (player.vy > 0 && player.y + player.h - 10 < e.y + e.h / 2) {
        e.hp--;
        if (e.hp <= 0) {
          e.alive = false;
          spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, [e.color, '#FFF'], 12);
          return { type: 'kill', score: e.score };
        } else {
          e.hitTimer = 20;
          spawnParticles(e.x + e.w / 2, e.y, '#FFF', 4);
          return { type: 'bounce', score: 0 };
        }
      } else {
        // Touché par l'ennemi (Hit by enemy)
        return { type: 'hit', score: 0 };
      }
    }
  }

  // Vérifier les projectiles ennemis (Check enemy projectiles)
  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const p = enemyProjectiles[i];
    if (checkCollision(player, p)) {
      spawnExplosion(p.x, p.y, ['#FF6F00', '#FFE66D'], 8);
      enemyProjectiles.splice(i, 1);
      return { type: 'hit', score: 0 };
    }
  }

  return null;
}

// === VÉRIFIER SI TOUS LES ENNEMIS SONT MORTS (Check if all enemies dead) ===
export function allEnemiesDead() {
  return enemies.every(e => !e.alive);
}

// === DESSIN DES ENNEMIS (Draw enemies) ===
export function drawEnemies(ctx, cameraX, frameCount) {
  for (const e of enemies) {
    if (!e.alive) continue;
    const ex = e.x - cameraX;
    if (ex + e.w < -20 || ex > GAME_W + 20) continue;

    // Clignoter si touché (Blink if hit)
    if (e.hitTimer > 0 && Math.floor(e.hitTimer / 3) % 2 === 0) continue;

    ctx.save();
    ctx.translate(ex + e.w / 2, e.y + e.h);
    ctx.scale(e.facing, 1);
    ctx.translate(-e.w / 2, -e.h);

    // Corps (Body)
    ctx.fillStyle = e.color;
    ctx.fillRect(2, 4, e.w - 4, e.h - 6);

    // Yeux (Eyes)
    ctx.fillStyle = '#FFF';
    ctx.fillRect(5, 6, 6, 6);
    ctx.fillRect(e.w - 11, 6, 6, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(7, 8, 3, 3);
    ctx.fillRect(e.w - 9, 8, 3, 3);

    // Détails par type (Type-specific details)
    if (e.type === 'bouclier') {
      // Bouclier devant (Shield in front)
      ctx.fillStyle = '#2980B9';
      ctx.fillRect(-4, 6, 6, e.h - 10);
      ctx.fillStyle = '#85C1E9';
      ctx.fillRect(-2, 10, 2, e.h - 18);
    } else if (e.type === 'lanceur') {
      // Sac de bombes (Bomb bag)
      ctx.fillStyle = '#D35400';
      ctx.fillRect(e.w - 6, 2, 8, 10);
    } else if (e.type === 'robot') {
      // Antenne (Antenna)
      ctx.fillStyle = '#BDC3C7';
      ctx.fillRect(e.w / 2 - 1, -4, 2, 6);
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.arc(e.w / 2, -4, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.type === 'motard') {
      // Casque (Helmet)
      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(0, 0, e.w, 8);
    }

    // Pattes qui bougent (Moving legs)
    ctx.fillStyle = e.color;
    const legOffset = Math.sin(e.animFrame * Math.PI / 2) * 3;
    ctx.fillRect(4, e.h - 4 + legOffset, 6, 4);
    ctx.fillRect(e.w - 10, e.h - 4 - legOffset, 6, 4);

    ctx.restore();

    // Barre de vie si plus de 1 HP (Health bar if more than 1 HP)
    if (e.maxHp > 1) {
      ctx.fillStyle = '#333';
      ctx.fillRect(ex, e.y - 8, e.w, 4);
      ctx.fillStyle = e.hp / e.maxHp > 0.5 ? COLORS.green : COLORS.red;
      ctx.fillRect(ex, e.y - 8, e.w * (e.hp / e.maxHp), 4);
    }
  }

  // Dessiner les projectiles ennemis (Draw enemy projectiles)
  for (const p of enemyProjectiles) {
    const px = p.x - cameraX;
    if (px < -20 || px > GAME_W + 20) continue;
    ctx.fillStyle = '#FF6F00';
    ctx.beginPath();
    ctx.arc(px, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFE66D';
    ctx.beginPath();
    ctx.arc(px, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
