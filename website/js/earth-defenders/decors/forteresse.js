// ==========================================================
// 🏰 FORTERESSE — Décor de la forteresse (Fortress decor)
// Murs de pierre, torches, drapeaux, pont-levis
// ==========================================================

import { GAME_W, GAME_H } from '../config.js';
import { drawSky } from './decor-base.js';

let torches = [];

export function initForteresse(levelWidth) {
  torches = [];
  const count = Math.ceil(levelWidth / 400);
  for (let i = 0; i < count; i++) {
    torches.push({
      x: i * 400 + 150 + Math.random() * 100,
      flicker: Math.random() * Math.PI * 2,
    });
  }
}

export function drawForteresse(ctx, cameraX, frameCount) {
  drawSky(ctx, '#1A1A2E', '#16213E', '#0F3460');

  // Étoiles sombres (Dark stars)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 30; i++) {
    const sx = (i * 127 + 50) % GAME_W;
    const sy = (i * 89 + 20) % (GAME_H * 0.4);
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }

  // Mur de fond (Background wall)
  ctx.fillStyle = '#3D3D3D';
  ctx.fillRect(0, GAME_H - 32 - 200, GAME_W, 200);
  // Briques (Bricks)
  ctx.strokeStyle = '#2C2C2C';
  ctx.lineWidth = 1;
  for (let row = 0; row < 8; row++) {
    const y = GAME_H - 32 - 200 + row * 25;
    const offset = row % 2 === 0 ? 0 : 25;
    for (let col = -1; col < 18; col++) {
      ctx.strokeRect(col * 50 + offset - (cameraX * 0.2) % 50, y, 50, 25);
    }
  }

  // Tours (Towers)
  for (let i = 0; i < 3; i++) {
    const tx = i * 1500 + 400 - cameraX * 0.3;
    if (tx < -80 || tx > GAME_W + 80) continue;
    drawTower(ctx, tx, frameCount);
  }

  // Torches avec flammes (Torches with flames)
  for (const t of torches) {
    const tx = t.x - cameraX * 0.5;
    if (tx < -20 || tx > GAME_W + 20) continue;

    // Support
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(tx - 2, GAME_H - 32 - 60, 4, 30);
    ctx.fillRect(tx - 6, GAME_H - 32 - 62, 12, 5);

    // Flamme (Flame)
    const flicker = Math.sin(frameCount * 0.15 + t.flicker) * 3;
    const fh = 12 + Math.sin(frameCount * 0.2 + t.flicker) * 4;
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.moveTo(tx - 5, GAME_H - 32 - 62);
    ctx.quadraticCurveTo(tx + flicker, GAME_H - 32 - 62 - fh, tx + 5, GAME_H - 32 - 62);
    ctx.fill();
    ctx.fillStyle = '#FFBE0B';
    ctx.beginPath();
    ctx.moveTo(tx - 3, GAME_H - 32 - 62);
    ctx.quadraticCurveTo(tx + flicker * 0.5, GAME_H - 32 - 62 - fh * 0.6, tx + 3, GAME_H - 32 - 62);
    ctx.fill();

    // Lueur (Glow)
    const glow = ctx.createRadialGradient(tx, GAME_H - 32 - 65, 3, tx, GAME_H - 32 - 65, 35);
    glow.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
    glow.addColorStop(1, 'rgba(255, 107, 53, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(tx, GAME_H - 32 - 65, 35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Drapeaux (Flags)
  for (let i = 0; i < 4; i++) {
    const fx = i * 1000 + 500 - cameraX * 0.4;
    if (fx < -30 || fx > GAME_W + 30) continue;
    ctx.fillStyle = '#555';
    ctx.fillRect(fx, GAME_H - 32 - 130, 3, 100);
    // Drapeau qui flotte (Waving flag)
    const wave = Math.sin(frameCount * 0.06 + i) * 5;
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.moveTo(fx + 3, GAME_H - 32 - 130);
    ctx.lineTo(fx + 30 + wave, GAME_H - 32 - 122);
    ctx.lineTo(fx + 28 + wave, GAME_H - 32 - 110);
    ctx.lineTo(fx + 3, GAME_H - 32 - 105);
    ctx.closePath();
    ctx.fill();
    // Crâne sur le drapeau (Skull on flag)
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(fx + 16 + wave * 0.5, GAME_H - 32 - 118, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chaînes pendantes (Hanging chains)
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const cx = i * 1200 + 300 - cameraX * 0.3;
    if (cx < -20 || cx > GAME_W + 20) continue;
    const swing = Math.sin(frameCount * 0.02 + i) * 8;
    ctx.beginPath();
    ctx.moveTo(cx, GAME_H - 32 - 180);
    ctx.quadraticCurveTo(cx + swing, GAME_H - 32 - 140, cx + swing * 0.5, GAME_H - 32 - 100);
    ctx.stroke();
  }
}

function drawTower(ctx, x, frameCount) {
  // Corps de la tour (Tower body)
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x - 30, GAME_H - 32 - 180, 60, 180);

  // Créneaux (Battlements)
  ctx.fillStyle = '#555';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x - 30 + i * 18, GAME_H - 32 - 195, 12, 15);
  }

  // Fenêtre de la tour (Tower window)
  ctx.fillStyle = '#1A1A2E';
  ctx.beginPath();
  ctx.arc(x, GAME_H - 32 - 130, 8, Math.PI, 0);
  ctx.fillRect(x - 8, GAME_H - 32 - 130, 16, 15);
  ctx.fill();

  // Lueur dans la fenêtre (Light in window)
  const glow = Math.sin(frameCount * 0.03) > 0;
  if (glow) {
    ctx.fillStyle = 'rgba(255, 190, 11, 0.4)';
    ctx.beginPath();
    ctx.arc(x, GAME_H - 32 - 125, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}
