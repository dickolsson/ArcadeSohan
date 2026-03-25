// ==========================================================
// 🏖️ PLAGE — Décor de la plage (Beach decor)
// Vagues, palmiers, sable, soleil, coquillages
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky, drawStars, drawClouds, generateStars, generateClouds } from './decor-base.js';

export function initPlage(levelWidth) {
  generateStars(40, levelWidth);
  generateClouds(8, levelWidth);
}

export function drawPlage(ctx, cameraX, frameCount) {
  // Ciel — dégradé bleu clair (Sky — light blue gradient)
  drawSky(ctx, '#87CEEB', '#00B4D8', '#CAF0F8');

  // Soleil (Sun)
  const sunX = GAME_W - 100;
  const sunY = 60;
  ctx.fillStyle = 'rgba(255, 230, 109, 0.3)';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 50 + Math.sin(frameCount * 0.02) * 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFE66D';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
  ctx.fill();
  // Rayons (Rays)
  ctx.strokeStyle = 'rgba(255, 230, 109, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + frameCount * 0.005;
    ctx.beginPath();
    ctx.moveTo(sunX + Math.cos(angle) * 35, sunY + Math.sin(angle) * 35);
    ctx.lineTo(sunX + Math.cos(angle) * 55, sunY + Math.sin(angle) * 55);
    ctx.stroke();
  }

  // Nuages (Clouds)
  drawClouds(ctx, cameraX, frameCount, 'rgba(255, 255, 255, 0.3)');

  // Palmiers en arrière-plan (Background palm trees)
  for (let i = 0; i < 6; i++) {
    const px = i * 700 + 200 - cameraX * 0.5;
    if (px < -100 || px > GAME_W + 100) continue;
    drawPalmTree(ctx, px, GAME_H - 32 - 80, frameCount);
  }

  // Vagues en fond (Background waves)
  drawWaves(ctx, cameraX, frameCount);
}

function drawPalmTree(ctx, x, y, frame) {
  // Tronc (Trunk)
  ctx.fillStyle = '#8B5E3C';
  ctx.fillRect(x - 4, y, 8, 80);
  ctx.fillStyle = '#A0724A';
  ctx.fillRect(x - 3, y, 3, 80);

  // Feuilles (Leaves)
  ctx.fillStyle = '#2D6A4F';
  const tilt = Math.sin(frame * 0.01) * 0.2;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + tilt;
    const lx = Math.cos(angle) * 30;
    const ly = Math.sin(angle) * 15 - 10;
    ctx.beginPath();
    ctx.ellipse(x + lx, y + ly, 25, 8, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Noix de coco (Coconuts)
  ctx.fillStyle = '#8B5E3C';
  ctx.beginPath();
  ctx.arc(x - 6, y + 5, 4, 0, Math.PI * 2);
  ctx.arc(x + 6, y + 3, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawWaves(ctx, cameraX, frame) {
  // Vagues du bas (Bottom waves)
  const waveY = GAME_H - 10;
  ctx.fillStyle = '#0077B6';
  ctx.beginPath();
  ctx.moveTo(0, waveY);
  for (let x = 0; x <= GAME_W; x += 5) {
    const wy = waveY + Math.sin((x + cameraX * 0.3 + frame * 0.8) * 0.03) * 4;
    ctx.lineTo(x, wy);
  }
  ctx.lineTo(GAME_W, GAME_H);
  ctx.lineTo(0, GAME_H);
  ctx.closePath();
  ctx.fill();

  // Mousse (Foam)
  ctx.fillStyle = 'rgba(202, 240, 248, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, waveY + 2);
  for (let x = 0; x <= GAME_W; x += 5) {
    const wy = waveY + 2 + Math.sin((x + cameraX * 0.3 + frame * 0.8) * 0.03) * 3;
    ctx.lineTo(x, wy);
  }
  ctx.lineTo(GAME_W, waveY + 6);
  ctx.lineTo(0, waveY + 6);
  ctx.closePath();
  ctx.fill();
}
