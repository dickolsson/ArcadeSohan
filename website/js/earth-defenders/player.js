// ==========================================================
// 🏃 PLAYER — Le joueur (The player character)
// Déplacement, saut, animation, évolution visuelle
// ==========================================================

import { GAME_W, GAME_H, PLAYER_SPEED, JUMP_FORCE, LEVEL_WIDTH, EVOLUTION, COLORS } from './config.js';
import { isLeft, isRight, isJump, isDash, isKeyDown } from '../shared/input.js';
import { applyGravity, resolvePlatformCollisions, clampToLevel, hasFallenOff } from '../shared/physics.js';
import { spawnDust, spawnParticles } from '../shared/particles.js';
import { roundRect } from '../shared/utils.js';

// === ÉTAT DU JOUEUR (Player state) ===
export const player = {
  x: 100,
  y: 300,
  w: 28,
  h: 32,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: 1,        // 1 = droite, -1 = gauche
  walkFrame: 0,
  walkTimer: 0,
  jumping: false,
  invincible: 0,
  squash: 1,
  evolutionLevel: 0, // Index dans EVOLUTION
  dashTimer: 0,
  dashCooldown: 0,
  shieldTimer: 0,
  doubleJumpUsed: false,
  hasCompanion: false, // Débloqué au niveau 3
};

// Réinitialiser le joueur (Reset player)
export function resetPlayer() {
  player.x = 100;
  player.y = GAME_H - 40 - player.h;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.facing = 1;
  player.invincible = 0;
  player.squash = 1;
  player.dashTimer = 0;
  player.dashCooldown = 0;
  player.shieldTimer = 0;
  player.doubleJumpUsed = false;
}

// Obtenir l'évolution actuelle (Get current evolution)
export function getEvolution() {
  return EVOLUTION[player.evolutionLevel] || EVOLUTION[0];
}

// Évoluer le joueur (Evolve the player)
export function evolvePlayer() {
  if (player.evolutionLevel < EVOLUTION.length - 1) {
    const before = EVOLUTION[player.evolutionLevel];
    player.evolutionLevel++;
    const after = EVOLUTION[player.evolutionLevel];
    return { before, after };
  }
  return null;
}

// Mettre à jour le joueur — mode à pied (Update player — on foot mode)
export function updatePlayer(platforms, levelWidth) {
  const evo = getEvolution();
  const speed = PLAYER_SPEED * evo.vitesse;

  // Mouvement horizontal (Horizontal movement)
  player.vx = 0;
  if (isLeft()) {
    player.vx = -speed;
    player.facing = -1;
  }
  if (isRight()) {
    player.vx = speed;
    player.facing = 1;
  }

  // Dash (si le pouvoir est débloqué)
  if (player.dashCooldown > 0) player.dashCooldown--;
  if (player.dashTimer > 0) {
    player.dashTimer--;
    player.vx = player.facing * speed * 3;
  } else if (isDash() && evo.pouvoirs.includes('dash') && player.dashCooldown <= 0) {
    player.dashTimer = 16;
    player.dashCooldown = 80;
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, evo.couleur, 8);
  }

  // Bouclier (Shield)
  if (player.shieldTimer > 0) player.shieldTimer--;

  // Saut (Jump)
  if (isJump()) {
    if (player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
      player.jumping = true;
      player.squash = 0.6;
      player.doubleJumpUsed = false;
      spawnDust(player.x + player.w / 2, player.y + player.h);
    } else if (evo.pouvoirs.includes('double_jump') && !player.doubleJumpUsed) {
      // Double saut! (Double jump!)
      player.vy = JUMP_FORCE * 0.8;
      player.doubleJumpUsed = true;
      spawnParticles(player.x + player.w / 2, player.y + player.h, COLORS.cyan, 6);
    }
  }

  // Gravité (Gravity)
  applyGravity(player);

  // Position
  player.x += player.vx;
  player.y += player.vy;

  // Effet d'écrasement (Squash effect)
  player.squash += (1 - player.squash) * 0.1;

  // Animation de marche (Walk animation)
  if (Math.abs(player.vx) > 0 && player.onGround) {
    player.walkTimer++;
    if (player.walkTimer > 9) {
      player.walkTimer = 0;
      player.walkFrame = (player.walkFrame + 1) % 4;
    }
  } else {
    player.walkFrame = 0;
  }

  // Collision avec les plateformes (Platform collision)
  resolvePlatformCollisions(player, platforms);

  // Limites du niveau (Level boundaries)
  clampToLevel(player, levelWidth, GAME_H);

  // Invincibilité (Invincibility)
  if (player.invincible > 0) player.invincible--;

  // Tombé dans le vide (Fell off)
  return hasFallenOff(player, GAME_H);
}

// === DESSIN DU JOUEUR (Draw player) ===
export function drawPlayer(ctx, cameraX, frameCount) {
  // Clignoter si invincible (Blink if invincible)
  if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

  const px = player.x - cameraX;
  const py = player.y;
  const evo = getEvolution();

  ctx.save();
  ctx.translate(px + player.w / 2, py + player.h);

  // Squash effect
  const sx = 2 - player.squash;
  ctx.scale(player.facing * sx, player.squash);
  ctx.translate(-player.w / 2, -player.h);

  // Corps — couleur selon l'évolution (Body — color based on evolution)
  ctx.fillStyle = evo.couleur;
  roundRect(ctx, 2, 6, player.w - 4, player.h - 8, 6);
  ctx.fill();

  // Ventre plus clair (Lighter belly)
  ctx.fillStyle = '#FFFFFF44';
  roundRect(ctx, 6, 12, player.w - 12, player.h - 18, 4);
  ctx.fill();

  // Yeux (Eyes)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(8, 10, 7, 7);
  ctx.fillRect(17, 10, 7, 7);
  ctx.fillStyle = '#1A1A2E';
  const pupilOffset = player.vx > 0 ? 3 : player.vx < 0 ? 0 : 1.5;
  ctx.fillRect(8 + pupilOffset, 12, 3, 4);
  ctx.fillRect(17 + pupilOffset, 12, 3, 4);

  // Oreilles (Ears)
  ctx.fillStyle = evo.couleur;
  ctx.fillRect(4, 2, 6, 6);
  ctx.fillRect(18, 2, 6, 6);

  // Cape si héros ou plus (Cape if hero or higher)
  if (player.evolutionLevel >= 2) {
    ctx.fillStyle = evo.couleur + '88';
    const capeWave = Math.sin(frameCount * 0.1) * 3;
    ctx.fillRect(player.w - 4, 8, 8 + capeWave, 20);
  }

  // Pattes (Legs)
  ctx.fillStyle = evo.couleur;
  if (player.onGround && Math.abs(player.vx) > 0) {
    const legOffset = Math.sin(player.walkFrame * Math.PI / 2) * 3;
    ctx.fillRect(6, player.h - 6 + legOffset, 6, 4);
    ctx.fillRect(16, player.h - 6 - legOffset, 6, 4);
  } else {
    ctx.fillRect(6, player.h - 6, 6, 4);
    ctx.fillRect(16, player.h - 6, 6, 4);
  }

  ctx.restore();

  // Bouclier actif (Active shield)
  if (player.shieldTimer > 0) {
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + Math.sin(frameCount * 0.1) * 0.3;
    ctx.beginPath();
    ctx.arc(px + player.w / 2, py + player.h / 2, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Dash trail (Trainée de dash)
  if (player.dashTimer > 0) {
    ctx.fillStyle = evo.couleur + '44';
    ctx.fillRect(px - player.facing * 10, py + 4, player.w, player.h - 8);
    ctx.fillRect(px - player.facing * 20, py + 8, player.w - 4, player.h - 16);
  }
}
