// ==========================================================
// 🏙️ VILLE — Décor de la ville (City decor)
// Immeubles, lampadaires, graffiti, voitures garées, néons
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky } from './decor-base.js';

let buildings = [];
let windows = [];

export function initVille(levelWidth) {
  buildings = [];
  windows = [];
  const count = Math.ceil(levelWidth / 120);
  for (let i = 0; i < count; i++) {
    const w = 60 + Math.random() * 80;
    const h = 80 + Math.random() * 150;
    buildings.push({
      x: i * 120 + Math.random() * 40,
      w: w,
      h: h,
      color: ['#2D3436', '#636E72', '#4A4A4A', '#555'][Math.floor(Math.random() * 4)],
    });
    // Fenêtres (Windows)
    const cols = Math.floor(w / 18);
    const rows = Math.floor(h / 22);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.3) {
          windows.push({
            bIdx: i,
            cx: c * 18 + 8,
            cy: r * 22 + 12,
            lit: Math.random() > 0.4,
            color: Math.random() > 0.5 ? '#FFEAA7' : '#74B9FF',
          });
        }
      }
    }
  }
}

export function drawVille(ctx, cameraX, frameCount) {
  drawSky(ctx, '#2C3E50', '#1A1A2E', '#34495E');

  // Lune (Moon)
  ctx.fillStyle = '#F1C40F';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(GAME_W - 100, 60, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Immeubles arrière-plan (Background buildings)
  ctx.fillStyle = 'rgba(30, 30, 50, 0.6)';
  for (let i = 0; i < 12; i++) {
    const bx = i * 100 - (cameraX * 0.15) % 100;
    const bh = 60 + Math.sin(i * 1.7) * 40;
    ctx.fillRect(bx, GAME_H - 32 - bh, 80, bh);
  }

  // Immeubles principaux (Main buildings)
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    const bx = b.x - cameraX * 0.5;
    if (bx < -b.w || bx > GAME_W + b.w) continue;

    ctx.fillStyle = b.color;
    ctx.fillRect(bx, GAME_H - 32 - b.h, b.w, b.h);

    // Toit (Roof)
    ctx.fillStyle = '#222';
    ctx.fillRect(bx - 2, GAME_H - 32 - b.h, b.w + 4, 5);

    // Fenêtres allumées (Lit windows)
    for (const win of windows) {
      if (win.bIdx !== i) continue;
      const flicker = win.lit && Math.sin(frameCount * 0.05 + win.cx) > -0.8;
      ctx.fillStyle = flicker ? win.color : '#1A1A2E';
      ctx.globalAlpha = flicker ? 0.9 : 0.5;
      ctx.fillRect(bx + win.cx, GAME_H - 32 - b.h + win.cy, 10, 14);
    }
    ctx.globalAlpha = 1;
  }

  // Lampadaires (Street lamps)
  for (let i = 0; i < 6; i++) {
    const lx = i * 700 + 300 - cameraX * 0.5;
    if (lx < -20 || lx > GAME_W + 20) continue;
    ctx.fillStyle = '#555';
    ctx.fillRect(lx, GAME_H - 32 - 80, 4, 80);
    ctx.fillStyle = '#888';
    ctx.fillRect(lx - 8, GAME_H - 32 - 82, 20, 6);
    // Lumière (Light glow)
    const grad = ctx.createRadialGradient(lx + 2, GAME_H - 32 - 76, 2, lx + 2, GAME_H - 32 - 76, 40);
    grad.addColorStop(0, 'rgba(255, 235, 150, 0.5)');
    grad.addColorStop(1, 'rgba(255, 235, 150, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx + 2, GAME_H - 32 - 76, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // Néons clignotants (Blinking neons)
  const neonColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12'];
  for (let i = 0; i < 3; i++) {
    const nx = i * 1300 + 500 - cameraX * 0.5;
    if (nx < -50 || nx > GAME_W + 50) continue;
    const blink = Math.sin(frameCount * 0.08 + i * 2) > 0;
    if (blink) {
      ctx.fillStyle = neonColors[i % neonColors.length];
      ctx.globalAlpha = 0.7;
      ctx.fillRect(nx, GAME_H - 32 - 120, 40, 12);
      ctx.globalAlpha = 1;
    }
  }
}
