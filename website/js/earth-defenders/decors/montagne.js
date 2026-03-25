// ==========================================================
// ⛰️ MONTAGNE — Décor de la montagne (Mountain decor)
// Neige, sapins, aigles, rochers, vent
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky, generateMountains, drawMountains } from './decor-base.js';

let snowflakes = [];

export function initMontagne(levelWidth) {
  generateMountains(10, levelWidth);
  snowflakes = [];
  for (let i = 0; i < 60; i++) {
    snowflakes.push({
      x: Math.random() * GAME_W,
      y: Math.random() * GAME_H,
      size: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      sway: Math.random() * Math.PI * 2,
    });
  }
}

export function drawMontagne(ctx, cameraX, frameCount) {
  drawSky(ctx, '#457B9D', '#1D3557', '#A8DADC');
  drawMountains(ctx, cameraX, 'rgba(69, 123, 157, 0.4)');

  // Pics enneigés (Snowy peaks)
  ctx.fillStyle = 'rgba(248, 249, 250, 0.3)';
  for (let i = 0; i < 5; i++) {
    const px = i * 800 + 200 - cameraX * 0.25;
    ctx.beginPath();
    ctx.moveTo(px, GAME_H - 32);
    ctx.lineTo(px + 60, GAME_H - 32 - 150);
    ctx.lineTo(px + 120, GAME_H - 32);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(px + 40, GAME_H - 32 - 120);
    ctx.lineTo(px + 60, GAME_H - 32 - 150);
    ctx.lineTo(px + 80, GAME_H - 32 - 120);
    ctx.fill();
    ctx.fillStyle = 'rgba(248, 249, 250, 0.3)';
  }

  // Sapins (Fir trees)
  for (let i = 0; i < 8; i++) {
    const tx = i * 550 + 100 - cameraX * 0.5;
    if (tx < -40 || tx > GAME_W + 40) continue;
    drawFirTree(ctx, tx, GAME_H - 32 - 60);
  }

  // Neige qui tombe (Falling snow)
  ctx.fillStyle = '#FFF';
  for (const s of snowflakes) {
    const sx = (s.x + Math.sin(frameCount * 0.01 + s.sway) * 30) % GAME_W;
    const sy = (s.y + frameCount * s.speed * 0.5) % GAME_H;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Lignes de vent (Wind lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const wy = 100 + i * 80;
    const wx = (frameCount * 3 + i * 200) % (GAME_W + 200) - 100;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + 60, wy - 5);
    ctx.stroke();
  }
}

function drawFirTree(ctx, x, y) {
  ctx.fillStyle = '#6B4226';
  ctx.fillRect(x - 3, y, 6, 60);
  ctx.fillStyle = '#1B4332';
  for (let i = 0; i < 3; i++) {
    const ty = y - 10 - i * 18;
    const tw = 24 - i * 5;
    ctx.beginPath();
    ctx.moveTo(x, ty - 20);
    ctx.lineTo(x - tw, ty);
    ctx.lineTo(x + tw, ty);
    ctx.closePath();
    ctx.fill();
  }
  // Neige sur les branches (Snow on branches)
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x - 15, y - 12, 10, 3);
  ctx.fillRect(x + 5, y - 28, 8, 3);
}
