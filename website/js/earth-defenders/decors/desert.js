// ==========================================================
// 🏜️ DESERT — Décor du désert (Desert decor)
// Dunes, cactus, soleil brûlant, mirage, vautours
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky } from './decor-base.js';

let cacti = [];
let tumbleweeds = [];

export function initDesert(levelWidth) {
  cacti = [];
  const count = Math.ceil(levelWidth / 500);
  for (let i = 0; i < count; i++) {
    cacti.push({
      x: i * 500 + 100 + Math.random() * 300,
      h: 40 + Math.random() * 30,
      arms: Math.random() > 0.4,
    });
  }
  tumbleweeds = [];
  for (let i = 0; i < 3; i++) {
    tumbleweeds.push({
      x: Math.random() * GAME_W,
      y: GAME_H - 32 - 12,
      speed: 1 + Math.random() * 2,
      rotation: 0,
    });
  }
}

export function drawDesert(ctx, cameraX, frameCount) {
  drawSky(ctx, '#F39C12', '#E67E22', '#FAD390');

  // Soleil brûlant (Burning sun)
  const sunX = GAME_W - 120;
  const sunY = 70;
  // Halo
  const halo = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 80);
  halo.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
  halo.addColorStop(1, 'rgba(255, 200, 50, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
  ctx.fill();
  // Soleil (Sun disc)
  ctx.fillStyle = '#FFF176';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
  ctx.fill();

  // Dunes arrière-plan (Background dunes)
  ctx.fillStyle = 'rgba(230, 176, 100, 0.5)';
  ctx.beginPath();
  ctx.moveTo(0, GAME_H - 32);
  for (let x = 0; x <= GAME_W; x += 10) {
    const y = GAME_H - 32 - 30 - Math.sin((x + cameraX * 0.1) * 0.008) * 25;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(GAME_W, GAME_H);
  ctx.lineTo(0, GAME_H);
  ctx.closePath();
  ctx.fill();

  // Dunes premier plan (Foreground dunes)
  ctx.fillStyle = 'rgba(210, 160, 80, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, GAME_H - 32);
  for (let x = 0; x <= GAME_W; x += 10) {
    const y = GAME_H - 32 - 15 - Math.sin((x + cameraX * 0.3) * 0.012) * 15;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(GAME_W, GAME_H);
  ctx.lineTo(0, GAME_H);
  ctx.closePath();
  ctx.fill();

  // Cactus
  for (const c of cacti) {
    const cx = c.x - cameraX * 0.5;
    if (cx < -30 || cx > GAME_W + 30) continue;
    drawCactus(ctx, cx, GAME_H - 32, c.h, c.arms);
  }

  // Buissons roulants (Tumbleweeds)
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1;
  for (const tw of tumbleweeds) {
    const twx = (tw.x + frameCount * tw.speed) % (GAME_W + 60) - 30;
    const rot = frameCount * 0.05 * tw.speed;
    ctx.save();
    ctx.translate(twx, tw.y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Mirage (heat shimmer)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let x = 0; x < GAME_W; x += 40) {
    const shimmer = Math.sin(frameCount * 0.03 + x * 0.05) * 3;
    ctx.fillRect(x, GAME_H - 34 + shimmer, 30, 2);
  }

  // Vautour qui vole (Flying vulture)
  const vx = (GAME_W + 100 - (frameCount * 0.8) % (GAME_W + 200));
  const vy = 80 + Math.sin(frameCount * 0.02) * 20;
  const wingUp = Math.sin(frameCount * 0.08) > 0;
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(vx, vy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(vx - 15, wingUp ? vy - 8 : vy - 2);
  ctx.lineTo(vx, vy);
  ctx.lineTo(vx + 15, wingUp ? vy - 8 : vy - 2);
  ctx.stroke();
}

function drawCactus(ctx, x, groundY, h, hasArms) {
  // Tronc (Trunk)
  ctx.fillStyle = '#2D6A4F';
  ctx.fillRect(x - 5, groundY - h, 10, h);

  // Bras (Arms)
  if (hasArms) {
    ctx.fillRect(x - 18, groundY - h * 0.7, 13, 6);
    ctx.fillRect(x - 18, groundY - h * 0.7, 6, -20);
    ctx.fillRect(x + 5, groundY - h * 0.5, 13, 6);
    ctx.fillRect(x + 12, groundY - h * 0.5, 6, -15);
  }

  // Lignes de détail (Detail lines)
  ctx.strokeStyle = '#1B4332';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, groundY - h);
  ctx.lineTo(x, groundY);
  ctx.stroke();
}
