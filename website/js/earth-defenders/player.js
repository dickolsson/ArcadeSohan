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

// === DESSIN DU JOUEUR — Humain (Draw player — Human character) ===
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

  // === ANIMATION — calcul des angles (Calculate animation angles) ===
  const isRunning = player.onGround && Math.abs(player.vx) > 0;
  const isJumping = !player.onGround;

  // Angle de balancement pour bras/jambes (Swing angle for arms/legs)
  // walkFrame va de 0 à 3, on fait un sinus continu
  let swing = 0;
  if (isRunning) {
    swing = Math.sin(player.walkFrame * Math.PI / 2) * 0.6;
  }

  // Respiration quand immobile (Breathing when idle)
  const breathe = (!isRunning && !isJumping) ? Math.sin(frameCount * 0.05) * 1 : 0;

  // === CAPE si héros ou plus (Cape if hero or higher) ===
  if (player.evolutionLevel >= 2) {
    ctx.fillStyle = evo.couleur + '88';
    const capeWave = Math.sin(frameCount * 0.1) * 3;
    const capeLen = 16 + capeWave;
    ctx.beginPath();
    ctx.moveTo(player.w / 2 - 4, 10);
    ctx.lineTo(player.w / 2 + 4, 10);
    ctx.lineTo(player.w / 2 + 2, 10 + capeLen);
    ctx.lineTo(player.w / 2 - 2, 10 + capeLen);
    ctx.closePath();
    ctx.fill();
  }

  // === JAMBES (Legs) ===
  const legLength = 10;
  const legWidth = 4;
  const legTopY = player.h - legLength;
  const hipX1 = 8;   // Jambe gauche (left leg)
  const hipX2 = 16;  // Jambe droite (right leg)

  if (isJumping) {
    // Saut: jambes repliées (Jump: legs tucked)
    // Jambe gauche — pliée en avant
    ctx.fillStyle = '#3B3B5C';
    ctx.save();
    ctx.translate(hipX1 + legWidth / 2, legTopY);
    ctx.rotate(-0.4);
    ctx.fillRect(-legWidth / 2, 0, legWidth, legLength - 2);
    ctx.restore();
    // Jambe droite — pliée en arrière
    ctx.save();
    ctx.translate(hipX2 + legWidth / 2, legTopY);
    ctx.rotate(0.4);
    ctx.fillRect(-legWidth / 2, 0, legWidth, legLength - 2);
    ctx.restore();
  } else if (isRunning) {
    // Course: jambes alternées (Running: alternating legs)
    ctx.fillStyle = '#3B3B5C';
    // Jambe gauche
    ctx.save();
    ctx.translate(hipX1 + legWidth / 2, legTopY);
    ctx.rotate(swing * 0.7);
    ctx.fillRect(-legWidth / 2, 0, legWidth, legLength);
    ctx.restore();
    // Jambe droite — opposé (opposite)
    ctx.save();
    ctx.translate(hipX2 + legWidth / 2, legTopY);
    ctx.rotate(-swing * 0.7);
    ctx.fillRect(-legWidth / 2, 0, legWidth, legLength);
    ctx.restore();
  } else {
    // Immobile (Idle)
    ctx.fillStyle = '#3B3B5C';
    ctx.fillRect(hipX1, legTopY, legWidth, legLength);
    ctx.fillRect(hipX2, legTopY, legWidth, legLength);
  }

  // Chaussures (Shoes)
  ctx.fillStyle = '#222222';
  if (isJumping) {
    // Petites chaussures repliées
    ctx.save();
    ctx.translate(hipX1 + legWidth / 2, legTopY);
    ctx.rotate(-0.4);
    ctx.fillRect(-legWidth / 2 - 1, legLength - 4, legWidth + 2, 3);
    ctx.restore();
    ctx.save();
    ctx.translate(hipX2 + legWidth / 2, legTopY);
    ctx.rotate(0.4);
    ctx.fillRect(-legWidth / 2 - 1, legLength - 4, legWidth + 2, 3);
    ctx.restore();
  } else if (isRunning) {
    ctx.save();
    ctx.translate(hipX1 + legWidth / 2, legTopY);
    ctx.rotate(swing * 0.7);
    ctx.fillRect(-legWidth / 2 - 1, legLength - 2, legWidth + 2, 3);
    ctx.restore();
    ctx.save();
    ctx.translate(hipX2 + legWidth / 2, legTopY);
    ctx.rotate(-swing * 0.7);
    ctx.fillRect(-legWidth / 2 - 1, legLength - 2, legWidth + 2, 3);
    ctx.restore();
  } else {
    ctx.fillRect(hipX1 - 1, player.h - 2, legWidth + 2, 3);
    ctx.fillRect(hipX2 - 1, player.h - 2, legWidth + 2, 3);
  }

  // === CORPS / T-SHIRT (Body / T-shirt) ===
  const bodyTop = 8 + breathe * 0.5;
  const bodyH = 14;
  ctx.fillStyle = evo.couleur;
  roundRect(ctx, 4, bodyTop, player.w - 8, bodyH, 3);
  ctx.fill();

  // Col du t-shirt (T-shirt collar)
  ctx.fillStyle = evo.couleur;
  ctx.fillRect(10, bodyTop - 1, 8, 3);

  // Détail du t-shirt — ligne plus claire (Lighter stripe)
  ctx.fillStyle = '#FFFFFF33';
  ctx.fillRect(6, bodyTop + 4, player.w - 12, 2);

  // === BRAS (Arms) ===
  const armLength = 10;
  const armWidth = 3;
  const shoulderY = bodyTop + 2;
  const shoulderL = 4;               // Épaule gauche (left shoulder)
  const shoulderR = player.w - 4;    // Épaule droite (right shoulder)

  // Couleur peau (Skin color)
  const skinColor = '#FFCC99';

  if (isJumping) {
    // Saut: bras en l'air ! (Jump: arms up!)
    ctx.fillStyle = skinColor;
    // Bras gauche — en haut à gauche
    ctx.save();
    ctx.translate(shoulderL, shoulderY);
    ctx.rotate(-1.2);
    ctx.fillRect(-armWidth / 2, -armLength, armWidth, armLength);
    ctx.restore();
    // Bras droit — en haut à droite
    ctx.save();
    ctx.translate(shoulderR, shoulderY);
    ctx.rotate(1.2);
    ctx.fillRect(-armWidth / 2, -armLength, armWidth, armLength);
    ctx.restore();
  } else if (isRunning) {
    // Course: bras alternés (opposé aux jambes)
    // Running: arms alternate (opposite to legs)
    ctx.fillStyle = skinColor;
    // Bras gauche
    ctx.save();
    ctx.translate(shoulderL, shoulderY);
    ctx.rotate(-swing * 0.8);
    ctx.fillRect(-armWidth / 2, 0, armWidth, armLength);
    ctx.restore();
    // Bras droit — opposé
    ctx.save();
    ctx.translate(shoulderR, shoulderY);
    ctx.rotate(swing * 0.8);
    ctx.fillRect(-armWidth / 2, 0, armWidth, armLength);
    ctx.restore();
  } else {
    // Immobile: bras le long du corps avec respiration
    // Idle: arms along body with breathing
    ctx.fillStyle = skinColor;
    ctx.fillRect(shoulderL - armWidth / 2, shoulderY, armWidth, armLength + breathe);
    ctx.fillRect(shoulderR - armWidth / 2, shoulderY, armWidth, armLength + breathe);
  }

  // === TÊTE (Head) ===
  const headW = 14;
  const headH = 10;
  const headX = (player.w - headW) / 2;
  const headY = 0 + breathe * 0.5;

  // Tête — couleur peau (Head — skin color)
  ctx.fillStyle = skinColor;
  roundRect(ctx, headX, headY, headW, headH, 4);
  ctx.fill();

  // Cheveux (Hair)
  ctx.fillStyle = '#4A2800';
  roundRect(ctx, headX - 1, headY - 1, headW + 2, 5, 3);
  ctx.fill();

  // Yeux (Eyes)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(headX + 2, headY + 4, 4, 4);
  ctx.fillRect(headX + headW - 6, headY + 4, 4, 4);
  // Pupilles (Pupils)
  ctx.fillStyle = '#1A1A2E';
  const pupilOffset = player.vx > 0 ? 2 : player.vx < 0 ? 0 : 1;
  ctx.fillRect(headX + 2 + pupilOffset, headY + 5, 2, 2);
  ctx.fillRect(headX + headW - 6 + pupilOffset, headY + 5, 2, 2);

  // Bouche — sourire (Mouth — smile)
  ctx.fillStyle = '#CC6644';
  ctx.fillRect(headX + 4, headY + headH - 3, 6, 1);

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
