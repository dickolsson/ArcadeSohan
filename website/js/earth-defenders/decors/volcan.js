// ==========================================================
// 🌋 VOLCAN — Décor du volcan (Volcano decor)
// Lave, fumée, rochers sombres, cendres, cratère
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky } from './decor-base.js';

let embers = [];
let lavaBubbles = [];

export function initVolcan(levelWidth) {
  embers = [];
  for (let i = 0; i < 40; i++) {
    embers.push({
      x: Math.random() * GAME_W,
      y: Math.random() * GAME_H,
      size: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 0.8,
      alpha: 0.5 + Math.random() * 0.5,
    });
  }
  lavaBubbles = [];
  for (let i = 0; i < 8; i++) {
    lavaBubbles.push({
      x: Math.random() * GAME_W,
      timer: Math.random() * 100,
      size: 4 + Math.random() * 6,
    });
  }
}

export function drawVolcan(ctx, cameraX, frameCount) {
  drawSky(ctx, '#1A0A00', '#3D0C02', '#8B2500');

  // Lueur rouge dans le ciel (Red glow in sky)
  const glowGrad = ctx.createRadialGradient(GAME_W / 2, GAME_H, 50, GAME_W / 2, GAME_H, 300);
  glowGrad.addColorStop(0, 'rgba(255, 69, 0, 0.3)');
  glowGrad.addColorStop(1, 'rgba(255, 69, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Volcan en arrière-plan (Volcano in background)
  ctx.fillStyle = '#2C1810';
  ctx.beginPath();
  ctx.moveTo(GAME_W * 0.3 - cameraX * 0.1, GAME_H - 32);
  ctx.lineTo(GAME_W * 0.45 - cameraX * 0.1, GAME_H - 32 - 200);
  ctx.lineTo(GAME_W * 0.55 - cameraX * 0.1, GAME_H - 32 - 200);
  ctx.lineTo(GAME_W * 0.7 - cameraX * 0.1, GAME_H - 32);
  ctx.closePath();
  ctx.fill();

  // Lave dans le cratère (Lava in crater)
  const lavaY = GAME_H - 32 - 195 + Math.sin(frameCount * 0.03) * 5;
  ctx.fillStyle = '#FF4500';
  ctx.fillRect(GAME_W * 0.46 - cameraX * 0.1, lavaY, GAME_W * 0.08, 10);
  ctx.fillStyle = '#FF6347';
  ctx.fillRect(GAME_W * 0.47 - cameraX * 0.1, lavaY + 2, GAME_W * 0.06, 5);

  // Fumée du volcan (Volcano smoke)
  for (let i = 0; i < 5; i++) {
    const sx = GAME_W * 0.5 - cameraX * 0.1 + Math.sin(frameCount * 0.02 + i) * 20;
    const sy = GAME_H - 32 - 210 - i * 30 - Math.sin(frameCount * 0.01) * 10;
    const sr = 15 + i * 8;
    ctx.fillStyle = `rgba(80, 80, 80, ${0.3 - i * 0.05})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rivières de lave au sol (Lava rivers on ground)
  ctx.fillStyle = '#FF4500';
  for (let i = 0; i < 4; i++) {
    const lx = i * 1000 + 200 - cameraX * 0.5;
    if (lx < -100 || lx > GAME_W + 100) continue;
    const wave = Math.sin(frameCount * 0.04 + i) * 3;
    ctx.fillRect(lx, GAME_H - 30 + wave, 80, 4);
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(lx + 10, GAME_H - 28 + wave, 60, 2);
    ctx.fillStyle = '#FF4500';
  }

  // Rochers sombres (Dark rocks)
  ctx.fillStyle = '#3E2723';
  for (let i = 0; i < 6; i++) {
    const rx = i * 700 + 150 - cameraX * 0.4;
    if (rx < -30 || rx > GAME_W + 30) continue;
    ctx.beginPath();
    ctx.moveTo(rx, GAME_H - 32);
    ctx.lineTo(rx + 10, GAME_H - 32 - 25);
    ctx.lineTo(rx + 25, GAME_H - 32 - 20);
    ctx.lineTo(rx + 30, GAME_H - 32);
    ctx.closePath();
    ctx.fill();
  }

  // Braises volantes (Flying embers)
  for (const e of embers) {
    const ex = (e.x + frameCount * e.drift) % GAME_W;
    const ey = (e.y - frameCount * e.speed * 0.3 + GAME_H) % GAME_H;
    ctx.fillStyle = Math.random() > 0.5 ? '#FF4500' : '#FF8C00';
    ctx.globalAlpha = e.alpha * (0.5 + Math.sin(frameCount * 0.1 + e.x) * 0.5);
    ctx.beginPath();
    ctx.arc(ex, ey, e.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Bulles de lave (Lava bubbles)
  for (const b of lavaBubbles) {
    const phase = (frameCount + b.timer) % 80;
    if (phase < 40) {
      const by = GAME_H - 28 - phase * 0.5;
      const bx = (b.x - cameraX * 0.3 + GAME_W) % GAME_W;
      ctx.fillStyle = '#FF6347';
      ctx.globalAlpha = 1 - phase / 40;
      ctx.beginPath();
      ctx.arc(bx, by, b.size * (1 - phase / 80), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
