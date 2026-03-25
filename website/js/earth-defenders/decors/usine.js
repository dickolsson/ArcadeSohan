// ==========================================================
// 🏭 USINE — Décor de l'usine finale (Final factory decor)
// Métal, tuyaux, fumée, engrenages, écrans, câbles
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky } from './decor-base.js';

let sparks = [];

export function initUsine(levelWidth) {
  sparks = [];
  for (let i = 0; i < 20; i++) {
    sparks.push({
      x: Math.random() * GAME_W,
      y: GAME_H * 0.3 + Math.random() * GAME_H * 0.5,
      timer: Math.random() * 120,
      duration: 20 + Math.random() * 40,
    });
  }
}

export function drawUsine(ctx, cameraX, frameCount) {
  drawSky(ctx, '#0D0D0D', '#1A1A1A', '#2D2D2D');

  // Murs métalliques (Metal walls)
  ctx.fillStyle = '#383838';
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Plaques de métal (Metal plates)
  ctx.strokeStyle = '#4A4A4A';
  ctx.lineWidth = 1;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 10; col++) {
      const px = col * 90 - (cameraX * 0.1) % 90;
      const py = row * 80 + 10;
      ctx.strokeRect(px, py, 85, 75);
      // Rivets (Bolts)
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.arc(px + 5, py + 5, 2, 0, Math.PI * 2);
      ctx.arc(px + 80, py + 5, 2, 0, Math.PI * 2);
      ctx.arc(px + 5, py + 70, 2, 0, Math.PI * 2);
      ctx.arc(px + 80, py + 70, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Tuyaux (Pipes)
  ctx.fillStyle = '#555';
  ctx.fillRect(0, 40, GAME_W, 12);
  ctx.fillRect(0, 90, GAME_W, 8);
  ctx.fillStyle = '#666';
  ctx.fillRect(0, 42, GAME_W, 3);
  ctx.fillRect(0, 92, GAME_W, 2);
  // Joints de tuyaux (Pipe joints)
  for (let i = 0; i < 8; i++) {
    const jx = i * 120 + 50 - (cameraX * 0.15) % 120;
    ctx.fillStyle = '#777';
    ctx.fillRect(jx - 3, 38, 16, 16);
    ctx.fillRect(jx, 86, 12, 14);
  }

  // Tuyaux verticaux avec vapeur (Vertical pipes with steam)
  for (let i = 0; i < 4; i++) {
    const px = i * 1000 + 300 - cameraX * 0.3;
    if (px < -15 || px > GAME_W + 15) continue;
    ctx.fillStyle = '#555';
    ctx.fillRect(px - 6, 50, 12, GAME_H - 82);
    // Vapeur (Steam)
    if (Math.sin(frameCount * 0.04 + i * 2) > 0.3) {
      for (let s = 0; s < 3; s++) {
        const sy = 50 - s * 15 - (frameCount % 30);
        ctx.fillStyle = `rgba(200, 200, 200, ${0.3 - s * 0.1})`;
        ctx.beginPath();
        ctx.arc(px + Math.sin(frameCount * 0.05 + s) * 5, sy, 6 + s * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Engrenages (Gears)
  for (let i = 0; i < 3; i++) {
    const gx = i * 1300 + 200 - cameraX * 0.2;
    if (gx < -40 || gx > GAME_W + 40) continue;
    drawGear(ctx, gx, 140, 25, frameCount * 0.02 + i);
    drawGear(ctx, gx + 38, 140, 18, -(frameCount * 0.02 + i));
  }

  // Écrans avec données (Screens with data)
  for (let i = 0; i < 3; i++) {
    const sx = i * 1400 + 600 - cameraX * 0.4;
    if (sx < -60 || sx > GAME_W + 60) continue;
    drawScreen(ctx, sx, 180, frameCount);
  }

  // Câbles pendants (Hanging cables)
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const cx = i * 800 + 100 - cameraX * 0.25;
    if (cx < -50 || cx > GAME_W + 50) continue;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.bezierCurveTo(cx + 20, 60, cx - 20, 120, cx + 10, 160);
    ctx.stroke();
    // Étincelle au bout (Spark at end)
    if ((frameCount + i * 30) % 60 < 10) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(cx + 10, 160, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Étincelles (Sparks)
  for (const s of sparks) {
    const phase = (frameCount + s.timer) % (s.duration + 60);
    if (phase < s.duration) {
      const sx = (s.x - cameraX * 0.3 + GAME_W) % GAME_W;
      ctx.fillStyle = '#FFD700';
      ctx.globalAlpha = 1 - phase / s.duration;
      ctx.beginPath();
      ctx.arc(sx, s.y + phase * 0.5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Lumières d'alerte (Warning lights)
  for (let i = 0; i < 4; i++) {
    const lx = i * 900 + 100 - cameraX * 0.2;
    if (lx < -10 || lx > GAME_W + 10) continue;
    const on = Math.sin(frameCount * 0.06 + i) > 0;
    ctx.fillStyle = on ? '#E74C3C' : '#4A1A1A';
    ctx.beginPath();
    ctx.arc(lx, 20, 6, 0, Math.PI * 2);
    ctx.fill();
    if (on) {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
      ctx.beginPath();
      ctx.arc(lx, 20, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawGear(ctx, x, y, r, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const teeth = 8;
  ctx.fillStyle = '#666';
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.8) / teeth) * Math.PI * 2;
    ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    ctx.lineTo(Math.cos(a2) * (r + 6), Math.sin(a2) * (r + 6));
    ctx.lineTo(Math.cos(a3) * (r + 6), Math.sin(a3) * (r + 6));
    ctx.lineTo(Math.cos(a4) * r, Math.sin(a4) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawScreen(ctx, x, y, frameCount) {
  // Cadre (Frame)
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 25, y - 18, 50, 36);
  // Écran (Screen)
  ctx.fillStyle = '#0B3D0B';
  ctx.fillRect(x - 22, y - 15, 44, 30);
  // Lignes de données (Data lines)
  ctx.fillStyle = '#0F0';
  ctx.font = '6px monospace';
  const data = ['SYS OK', 'PWR 98%', 'TEMP 42', 'ERR: 0'];
  const line = data[Math.floor(frameCount / 40) % data.length];
  ctx.fillText(line, x - 18, y + 2);
  // Curseur clignotant (Blinking cursor)
  if (frameCount % 40 < 20) {
    ctx.fillRect(x - 18, y + 8, 6, 1);
  }
}
