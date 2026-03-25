// ==========================================================
// 🏗️ DECOR-BASE — Classe de base des décors (Base decor class)
// Ciel, sol, étoiles, parallaxe — partagé par tous les décors
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';

// Étoiles de fond (Background stars)
let stars = [];

export function generateStars(count = 60, width = 4000) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * GAME_H * 0.6,
      size: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
}

export function drawStars(ctx, cameraX, frameCount) {
  for (const s of stars) {
    const sx = s.x - cameraX * 0.2;
    if (sx < -10 || sx > GAME_W + 10) continue;
    const twinkle = (Math.sin(s.twinkle + frameCount * 0.03) + 1) / 2;
    ctx.globalAlpha = 0.3 + twinkle * 0.7;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(sx, s.y, s.size, s.size);
  }
  ctx.globalAlpha = 1;
}

// Nuages (Clouds)
let clouds = [];

export function generateClouds(count = 10, width = 4000) {
  clouds = [];
  for (let i = 0; i < count; i++) {
    clouds.push({
      x: Math.random() * width,
      y: 30 + Math.random() * 100,
      w: 60 + Math.random() * 80,
      h: 20 + Math.random() * 20,
      speed: 0.1 + Math.random() * 0.3,
    });
  }
}

export function drawClouds(ctx, cameraX, frameCount, color = 'rgba(200, 200, 255, 0.15)', width = 4000) {
  ctx.fillStyle = color;
  for (const c of clouds) {
    const cx = (c.x + frameCount * c.speed) % (width + c.w) - c.w;
    const sx = cx - cameraX * 0.4;
    if (sx < -c.w || sx > GAME_W + c.w) continue;
    ctx.beginPath();
    ctx.arc(sx, c.y, c.h, 0, Math.PI * 2);
    ctx.arc(sx + c.w * 0.3, c.y - c.h * 0.3, c.h * 0.8, 0, Math.PI * 2);
    ctx.arc(sx + c.w * 0.6, c.y, c.h * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Montagnes de fond (Background mountains)
let mountains = [];

export function generateMountains(count = 8, width = 4000) {
  mountains = [];
  for (let i = 0; i < count; i++) {
    mountains.push({
      x: i * (width / count) + Math.random() * 100,
      w: 200 + Math.random() * 150,
      h: 80 + Math.random() * 100,
    });
  }
}

export function drawMountains(ctx, cameraX, color = 'rgba(30, 20, 60, 0.6)') {
  ctx.fillStyle = color;
  for (const m of mountains) {
    const mx = m.x - cameraX * 0.3;
    ctx.beginPath();
    ctx.moveTo(mx, GAME_H - 32);
    ctx.lineTo(mx + m.w / 2, GAME_H - 32 - m.h);
    ctx.lineTo(mx + m.w, GAME_H - 32);
    ctx.closePath();
    ctx.fill();
  }
}

// Dégradé du ciel (Sky gradient)
export function drawSky(ctx, color1, color2, color3) {
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
  grad.addColorStop(0, color1);
  grad.addColorStop(0.6, color2 || color1);
  grad.addColorStop(1, color3 || color2 || color1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_W, GAME_H);
}
