// ==========================================================
// 🏃 MODE-PIED — Mode plateforme (Platform mode)
// Courir, sauter, plateformes, pièces, drapeau de fin
// ==========================================================

import { GAME_W, GAME_H, TILE, LEVEL_WIDTH, COIN_SCORE, LEVEL_COLORS } from './config.js';
import { random, randomInt } from '../shared/utils.js';
import { checkCollision } from '../shared/physics.js';
import { spawnParticles } from '../shared/particles.js';

// === DONNÉES DU NIVEAU (Level data) ===
let platforms = [];
let coinList = [];
let flag = { x: 0, y: 0 };

export function getPlatforms() { return platforms; }
export function getCoins() { return coinList; }
export function getFlag() { return flag; }

// === GÉNÉRER UN NIVEAU À PIED (Generate on-foot level) ===
export function generatePiedLevel(levelNum, theme) {
  platforms = [];
  coinList = [];

  const levelWidth = LEVEL_WIDTH + levelNum * 200;

  // Sol de base avec trous (Ground with gaps)
  let groundX = 0;
  while (groundX < levelWidth) {
    const segLen = 150 + Math.random() * 300;
    platforms.push({
      x: groundX, y: GAME_H - TILE,
      w: segLen, h: TILE,
      type: 'ground',
    });
    groundX += segLen;
    // Trous — plus fréquents aux niveaux élevés (Gaps)
    if (groundX > 300 && groundX < levelWidth - 400 && Math.random() < 0.25 + levelNum * 0.03) {
      groundX += 80 + Math.random() * 60;
    }
  }

  // Plateformes flottantes (Floating platforms)
  const numPlatforms = 14 + levelNum * 3;
  for (let i = 0; i < numPlatforms; i++) {
    const px = 200 + Math.random() * (levelWidth - 400);
    const py = 100 + Math.random() * (GAME_H - 200);
    const pw = 64 + Math.random() * 96;
    platforms.push({
      x: px, y: py,
      w: pw, h: 16,
      type: 'float',
    });

    // Pièce au-dessus (Coin above)
    if (Math.random() < 0.6) {
      coinList.push({
        x: px + pw / 2 - 8, y: py - 30,
        w: 16, h: 16,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  // Pièces au sol (Ground coins)
  for (let i = 0; i < 8 + levelNum * 2; i++) {
    coinList.push({
      x: 200 + Math.random() * (levelWidth - 400),
      y: GAME_H - TILE - 30,
      w: 16, h: 16,
      collected: false,
      bobOffset: Math.random() * Math.PI * 2,
    });
  }

  // Drapeau de fin (End flag)
  flag = { x: levelWidth - 150, y: GAME_H - TILE - 64 };

  return { levelWidth, platforms, coinList, flag };
}

// === VÉRIFIER LES PIÈCES (Check coins) ===
export function checkCoinCollection(player) {
  let collected = 0;
  for (const c of coinList) {
    if (c.collected) continue;
    if (checkCollision(player, c)) {
      c.collected = true;
      collected++;
      spawnParticles(c.x + 8, c.y + 8, '#FFE66D', 8);
    }
  }
  return collected;
}

// === VÉRIFIER LE DRAPEAU (Check flag) ===
export function checkFlagReached(player, bossAlive) {
  if (bossAlive) return false;
  return (
    player.x + player.w > flag.x &&
    player.x < flag.x + 32 &&
    player.y + player.h > flag.y &&
    player.y < flag.y + 64
  );
}

// === DESSIN DES PLATEFORMES (Draw platforms) ===
export function drawPlatforms(ctx, cameraX, themeColors) {
  const colors = themeColors || LEVEL_COLORS.plage;

  for (const p of platforms) {
    const px = p.x - cameraX;
    if (px + p.w < -10 || px > GAME_W + 10) continue;

    if (p.type === 'ground') {
      // Sol (Ground)
      ctx.fillStyle = colors.ground;
      ctx.fillRect(px, p.y, p.w, p.h);
      // Herbe sur le dessus (Grass on top)
      const darker = colors.accent || '#3a7e2f';
      ctx.fillStyle = darker;
      ctx.fillRect(px, p.y, p.w, 6);
      // Brins d'herbe (Grass blades)
      for (let gx = px; gx < px + p.w; gx += 8) {
        const gh = 2 + Math.sin(gx * 0.3) * 2;
        ctx.fillRect(gx, p.y - gh, 2, gh);
      }
    } else {
      // Plateforme flottante (Floating platform)
      ctx.fillStyle = colors.platform || '#4a9e3f';
      ctx.fillRect(px + 2, p.y + 4, p.w - 4, p.h - 4);
      ctx.fillStyle = colors.accent || '#5cb850';
      ctx.fillRect(px, p.y, p.w, p.h - 4);
      // Ligne du dessus (Top line)
      ctx.fillStyle = '#FFFFFF22';
      ctx.fillRect(px, p.y, p.w, 3);
    }
  }
}

// === DESSIN DES PIÈCES (Draw coins) ===
export function drawCoins(ctx, cameraX, frameCount) {
  for (const c of coinList) {
    if (c.collected) continue;
    const cx = c.x - cameraX;
    if (cx < -20 || cx > GAME_W + 20) continue;

    const bobY = c.y + Math.sin(frameCount * 0.06 + c.bobOffset) * 4;
    const scaleX = Math.abs(Math.cos(frameCount * 0.05 + c.bobOffset));
    const coinW = c.w * scaleX;
    const coinX = cx + (c.w - coinW) / 2;

    // Lueur (Glow)
    ctx.fillStyle = 'rgba(255, 230, 109, 0.25)';
    ctx.beginPath();
    ctx.arc(cx + c.w / 2, bobY + c.h / 2, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pièce (Coin)
    ctx.fillStyle = '#FFE66D';
    ctx.fillRect(coinX, bobY, coinW, c.h);
    ctx.fillStyle = '#FFF9C4';
    ctx.fillRect(coinX + 2, bobY + 2, coinW * 0.3, c.h * 0.4);
  }
}

// === DESSIN DU DRAPEAU (Draw flag) ===
export function drawFlag(ctx, cameraX, frameCount) {
  const fx = flag.x - cameraX;
  if (fx < -40 || fx > GAME_W + 40) return;

  // Poteau (Pole)
  ctx.fillStyle = '#888888';
  ctx.fillRect(fx + 14, flag.y, 4, 64);

  // Drapeau (Flag)
  ctx.fillStyle = '#FF6F91';
  ctx.beginPath();
  ctx.moveTo(fx + 18, flag.y);
  ctx.lineTo(fx + 42 + Math.sin(frameCount * 0.08) * 4, flag.y + 8);
  ctx.lineTo(fx + 38 + Math.sin(frameCount * 0.08 + 1) * 3, flag.y + 20);
  ctx.lineTo(fx + 18, flag.y + 20);
  ctx.closePath();
  ctx.fill();

  // Étoile (Star)
  ctx.fillStyle = '#FFE66D';
  ctx.font = '12px serif';
  ctx.fillText('⭐', fx + 22, flag.y + 16);

  // Lueur (Glow)
  ctx.fillStyle = 'rgba(255, 111, 145, 0.15)';
  ctx.beginPath();
  ctx.arc(fx + 16, flag.y + 32, 30 + Math.sin(frameCount * 0.05) * 5, 0, Math.PI * 2);
  ctx.fill();
}
