// ==========================================================
// 🎨 RENDERER — HUD, notifications, utilitaires de dessin
// (HUD, notifications, drawing utilities)
// La caméra est dans shared/camera.js
// ==========================================================

import { GAME_W, GAME_H, COLORS } from './config.js';
import { roundRect } from '../shared/utils.js';

// Ré-exporter la caméra depuis le module partagé pour rétrocompatibilité
// (Re-export camera from shared module for backward compatibility)
export { getCameraX, updateCamera, resetCamera, shake, getShake } from '../shared/camera.js';

// === HUD — Affichage tête haute (Head-up display) ===
export function updateHUD(game) {
  const el = (id) => document.getElementById(id);
  const elScore = el('hud-score');
  const elLevel = el('hud-level');
  const elCoins = el('hud-coins');
  const elLives = el('hud-lives');
  const elTheme = el('hud-theme');

  if (elScore) elScore.textContent = game.score;
  if (elLevel) elLevel.textContent = game.level;
  if (elCoins) elCoins.textContent = game.coins;
  if (elLives) elLives.textContent = '❤️'.repeat(Math.max(0, game.lives));
  if (elTheme) elTheme.textContent = game.themeName || '';
}

export function updateMessage(text) {
  const el = document.getElementById('game-message');
  if (el) el.textContent = text;
}

// === NOTIFICATION SUR LE CANVAS (Canvas notification) ===
let notification = '';
let notificationTimer = 0;

export function showNotification(text) {
  notification = text;
  notificationTimer = 120;
}

export function drawNotification(ctx) {
  if (notificationTimer > 0 && notification) {
    notificationTimer--;
    const alpha = notificationTimer > 30 ? 1 : notificationTimer / 30;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '14px "Press Start 2P", monospace';
    const tw = ctx.measureText(notification).width + 40;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(GAME_W / 2 - tw / 2, 60, tw, 40);
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.strokeRect(GAME_W / 2 - tw / 2, 60, tw, 40);
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = 'center';
    ctx.fillText(notification, GAME_W / 2, 86);
    ctx.textAlign = 'left';
    ctx.restore();
  }
}

// === UTILITAIRES DE DESSIN (Drawing utilities) ===

// Dessiner un dégradé de ciel (Draw a sky gradient)
export function drawSkyGradient(ctx, color1, color2, color3) {
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
  grad.addColorStop(0, color1);
  grad.addColorStop(0.5, color2 || color1);
  grad.addColorStop(1, color3 || color2 || color1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_W, GAME_H);
}

// Dessiner une barre de vie (Draw a health bar)
export function drawHealthBar(ctx, x, y, w, h, ratio, label) {
  ctx.fillStyle = '#333333';
  ctx.fillRect(x, y, w, h);
  const color = ratio > 0.5 ? COLORS.green : ratio > 0.25 ? COLORS.yellow : COLORS.red;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * ratio, h);
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
  if (label) {
    ctx.fillStyle = COLORS.pink;
    ctx.font = '8px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y - 4);
    ctx.textAlign = 'left';
  }
}
