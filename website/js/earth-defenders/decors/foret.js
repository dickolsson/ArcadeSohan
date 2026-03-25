// ==========================================================
// 🌲 FORÊT — Décor de la forêt (Forest decor)
// Arbres, feuilles, champignons, papillons, brume
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky, drawClouds, generateClouds } from './decor-base.js';

let leaves = [];
let butterflies = [];

export function initForet(levelWidth) {
  generateClouds(6, levelWidth);
  // Feuilles qui tombent (Falling leaves)
  leaves = [];
  for (let i = 0; i < 30; i++) {
    leaves.push({
      x: Math.random() * levelWidth,
      y: Math.random() * GAME_H,
      size: 3 + Math.random() * 4,
      speed: 0.3 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      color: ['#95D5B2', '#2D6A4F', '#E9C46A'][Math.floor(Math.random() * 3)],
    });
  }
  // Papillons (Butterflies)
  butterflies = [];
  for (let i = 0; i < 8; i++) {
    butterflies.push({
      x: Math.random() * levelWidth,
      y: 50 + Math.random() * 200,
      color: ['#48BFE3', '#FF6FB7', '#FFE66D'][Math.floor(Math.random() * 3)],
      phase: Math.random() * Math.PI * 2,
    });
  }
}

export function drawForet(ctx, cameraX, frameCount) {
  // Ciel vert sombre (Dark green sky)
  drawSky(ctx, '#1B4332', '#2D6A4F', '#40916C');

  // Brume (Mist)
  for (let i = 0; i < 5; i++) {
    const mx = (i * 300 + frameCount * 0.2) % (GAME_W + 200) - 100 - cameraX * 0.1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(mx, 200 + i * 30, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nuages sombres (Dark clouds)
  drawClouds(ctx, cameraX, frameCount, 'rgba(27, 67, 50, 0.3)');

  // Arbres arrière-plan (Background trees)
  for (let i = 0; i < 10; i++) {
    const tx = i * 500 + 100 - cameraX * 0.4;
    if (tx < -80 || tx > GAME_W + 80) continue;
    drawTree(ctx, tx, GAME_H - 32 - 100 - Math.random() * 40, frameCount);
  }

  // Champignons (Mushrooms)
  for (let i = 0; i < 6; i++) {
    const mx = i * 600 + 300 - cameraX * 0.6;
    if (mx < -20 || mx > GAME_W + 20) continue;
    drawMushroom(ctx, mx, GAME_H - 32 - 12, frameCount + i * 100);
  }

  // Feuilles qui tombent (Falling leaves)
  for (const leaf of leaves) {
    const lx = leaf.x - cameraX * 0.8;
    if (lx < -20 || lx > GAME_W + 20) continue;
    const ly = (leaf.y + frameCount * leaf.speed) % GAME_H;
    const sway = Math.sin(frameCount * 0.02 + leaf.sway) * 15;
    ctx.fillStyle = leaf.color;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(lx + sway, ly, leaf.size, leaf.size * 0.6);
    ctx.globalAlpha = 1;
  }

  // Papillons (Butterflies)
  for (const b of butterflies) {
    const bx = b.x + Math.sin(frameCount * 0.02 + b.phase) * 40 - cameraX * 0.5;
    if (bx < -20 || bx > GAME_W + 20) continue;
    const by = b.y + Math.cos(frameCount * 0.03 + b.phase) * 20;
    const wingSize = 4 + Math.sin(frameCount * 0.15 + b.phase) * 3;
    ctx.fillStyle = b.color;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(bx - wingSize, by, wingSize, 0, Math.PI * 2);
    ctx.arc(bx + wingSize, by, wingSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillRect(bx - 1, by - 2, 2, 4);
    ctx.globalAlpha = 1;
  }

  // Fleurs au sol (Flowers on ground)
  for (let i = 0; i < 8; i++) {
    const fx = i * 500 + 150 - cameraX * 0.7;
    if (fx < -10 || fx > GAME_W + 10) continue;
    const sway = Math.sin(frameCount * 0.04 + i) * 2;
    ctx.fillStyle = ['#FF99C8', '#C77DFF', '#FFD60A'][i % 3];
    ctx.beginPath();
    ctx.arc(fx + sway, GAME_H - 32 - 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#52B788';
    ctx.fillRect(fx - 1, GAME_H - 32 - 8, 2, 8);
  }
}

function drawTree(ctx, x, y, frame) {
  // Tronc (Trunk)
  ctx.fillStyle = '#6B4226';
  ctx.fillRect(x - 6, y, 12, 100);

  // Feuillage (Foliage)
  const wave = Math.sin(frame * 0.02) * 2;
  ctx.fillStyle = '#2D6A4F';
  ctx.beginPath();
  ctx.arc(x + wave, y - 10, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#40916C';
  ctx.beginPath();
  ctx.arc(x - 15 + wave, y + 5, 25, 0, Math.PI * 2);
  ctx.arc(x + 15 + wave, y + 5, 25, 0, Math.PI * 2);
  ctx.fill();
}

function drawMushroom(ctx, x, y, frame) {
  const bounce = Math.sin(frame * 0.04) * 1.5;
  // Pied (Stem)
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x - 3, y - bounce, 6, 12);
  // Chapeau (Cap)
  ctx.fillStyle = '#E63946';
  ctx.beginPath();
  ctx.arc(x, y - 4 - bounce, 10, Math.PI, 0);
  ctx.fill();
  // Points blancs (White dots)
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(x - 4, y - 8 - bounce, 2, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 10 - bounce, 2, 0, Math.PI * 2);
  ctx.fill();
}
