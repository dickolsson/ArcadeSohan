// ==========================================================
// 🐕 COMPANION — Compagnon IA (AI Companion)
// Débloqué au niveau 3, suit le joueur, lance des pierres
// ==========================================================

import { GAME_W, GAME_H, TILE, COLORS } from './config.js';
import { clamp } from '../shared/utils.js';
import { checkCollision } from '../shared/physics.js';
import { spawnParticles } from '../shared/particles.js';

// === ÉTAT DU COMPAGNON (Companion state) ===
const companion = {
  active: false,
  x: 0,
  y: 0,
  w: 20,
  h: 20,
  targetX: 0,
  targetY: 0,
  animFrame: 0,
  animTimer: 0,
  throwTimer: 0,
  throwCooldown: 90,  // 1.5 secondes (1.5 seconds)
  facing: 1,
};

let stones = [];

export function getCompanion() { return companion; }
export function getStones() { return stones; }

// === ACTIVER LE COMPAGNON (Activate companion) ===
export function activateCompanion() {
  companion.active = true;
}

export function isCompanionActive() {
  return companion.active;
}

// === RÉINITIALISER LE COMPAGNON (Reset companion) ===
export function resetCompanion(playerX, playerY) {
  companion.x = playerX - 40;
  companion.y = playerY;
  companion.targetX = companion.x;
  companion.targetY = companion.y;
  stones = [];
  companion.throwTimer = 0;
}

// === METTRE À JOUR LE COMPAGNON (Update companion) ===
export function updateCompanion(player, enemies) {
  if (!companion.active) return;

  // Animation
  companion.animTimer++;
  if (companion.animTimer > 12) {
    companion.animTimer = 0;
    companion.animFrame = (companion.animFrame + 1) % 4;
  }

  // Suivre le joueur — rester un peu derrière (Follow player — stay behind)
  companion.targetX = player.x - player.facing * 35;
  companion.targetY = player.y + 5;

  // Mouvement fluide (Smooth movement)
  companion.x += (companion.targetX - companion.x) * 0.08;
  companion.y += (companion.targetY - companion.y) * 0.1;

  // Direction
  companion.facing = player.facing;

  // Lancer des pierres automatiquement (Auto-throw stones)
  companion.throwTimer--;
  if (companion.throwTimer <= 0 && enemies.length > 0) {
    // Trouver l'ennemi le plus proche (Find closest enemy)
    let closest = null;
    let closestDist = Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      const dx = e.x - companion.x;
      const dy = e.y - companion.y;
      const dist = Math.abs(dx) + Math.abs(dy);
      if (dist < closestDist && Math.abs(dx) < 300) {
        closestDist = dist;
        closest = e;
      }
    }

    if (closest) {
      const dx = closest.x - companion.x;
      const dy = closest.y - companion.y;
      const angle = Math.atan2(dy, dx);
      stones.push({
        x: companion.x + companion.w / 2,
        y: companion.y + companion.h / 2,
        vx: Math.cos(angle) * 3.5,
        vy: Math.sin(angle) * 3.5,
        w: 6, h: 6,
        life: 60,
      });
      companion.throwTimer = companion.throwCooldown;
      spawnParticles(companion.x + companion.w / 2, companion.y + companion.h / 2, '#A0A0A0', 3);
    }
  }

  // Mettre à jour les pierres (Update stones)
  for (let i = stones.length - 1; i >= 0; i--) {
    const s = stones[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.05; // Petite gravité (Slight gravity)
    s.life--;
    if (s.life <= 0 || s.y > GAME_H) {
      stones.splice(i, 1);
      continue;
    }

    // Collision avec les ennemis (Collision with enemies)
    for (const e of enemies) {
      if (!e.alive) continue;
      if (checkCollision(s, e)) {
        e.hp--;
        if (e.hp <= 0) {
          e.alive = false;
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color, 10);
        } else {
          e.hitTimer = 10;
        }
        stones.splice(i, 1);
        spawnParticles(s.x, s.y, '#A0A0A0', 4);
        break;
      }
    }
  }
}

// === DESSIN DU COMPAGNON (Draw companion) ===
export function drawCompanion(ctx, cameraX, frameCount) {
  if (!companion.active) return;

  const cx = companion.x - cameraX;
  const cy = companion.y;
  if (cx + companion.w < -20 || cx > GAME_W + 20) return;

  // Flottement (Floating effect)
  const floatY = cy + Math.sin(frameCount * 0.08) * 3;

  ctx.save();
  ctx.translate(cx + companion.w / 2, floatY + companion.h / 2);
  ctx.scale(companion.facing, 1);
  ctx.translate(-companion.w / 2, -companion.h / 2);

  // Corps — petit robot ami (Body — friendly little robot)
  ctx.fillStyle = '#74B9FF';
  ctx.fillRect(2, 4, companion.w - 4, companion.h - 6);

  // Casque (Helmet)
  ctx.fillStyle = '#0984E3';
  ctx.fillRect(0, 0, companion.w, 6);

  // Yeux contents (Happy eyes)
  ctx.fillStyle = '#FFF';
  ctx.fillRect(4, 6, 5, 5);
  ctx.fillRect(companion.w - 9, 6, 5, 5);
  ctx.fillStyle = '#2D3436';
  ctx.fillRect(5, 7, 3, 3);
  ctx.fillRect(companion.w - 8, 7, 3, 3);

  // Sourire (Smile)
  ctx.fillStyle = '#2D3436';
  ctx.fillRect(6, 14, companion.w - 12, 2);

  // Hélice qui tourne (Spinning propeller)
  const propAngle = frameCount * 0.3;
  ctx.fillStyle = '#DFE6E9';
  ctx.save();
  ctx.translate(companion.w / 2, -2);
  ctx.rotate(propAngle);
  ctx.fillRect(-8, -1, 16, 2);
  ctx.restore();

  ctx.restore();

  // Lueur (Glow)
  ctx.fillStyle = 'rgba(116, 185, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(cx + companion.w / 2, floatY + companion.h / 2, 16, 0, Math.PI * 2);
  ctx.fill();

  // Dessiner les pierres (Draw stones)
  for (const s of stones) {
    const sx = s.x - cameraX;
    if (sx < -10 || sx > GAME_W + 10) continue;
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(sx, s.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#A0A0A0';
    ctx.beginPath();
    ctx.arc(sx - 1, s.y - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
