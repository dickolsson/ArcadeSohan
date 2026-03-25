// ==========================================================
// 📋 UI — Menus et écrans (Menus and screens)
// Écran titre, pause, game over, choix de mode, victoire
// ==========================================================

import { GAME_W, GAME_H, COLORS, STATE, MODE } from './config.js';
import { roundRect } from '../shared/utils.js';

// === ÉCRAN TITRE (Title screen) ===
export function drawTitleScreen(ctx, frameCount) {
  // Fond étoilé (Starry background)
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
  grad.addColorStop(0, '#0D1B2A');
  grad.addColorStop(0.5, '#1A0A2E');
  grad.addColorStop(1, '#0F3460');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Étoiles (Stars)
  for (let i = 0; i < 50; i++) {
    const sx = (i * 97 + frameCount * 0.1) % GAME_W;
    const sy = (i * 53) % (GAME_H * 0.7);
    const tw = (Math.sin(i + frameCount * 0.03) + 1) / 2;
    ctx.globalAlpha = 0.3 + tw * 0.7;
    ctx.fillStyle = '#FFF';
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Terre animée (Animated Earth)
  const earthY = 100 + Math.sin(frameCount * 0.02) * 8;
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌍', GAME_W / 2, earthY);

  // Titre — EARTH DEFENDERS (Title)
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '24px "Press Start 2P", cursive';
  ctx.shadowColor = COLORS.cyan;
  ctx.shadowBlur = 20;
  ctx.fillText('EARTH DEFENDERS', GAME_W / 2, 160);
  ctx.shadowBlur = 0;

  // Sous-titre (Subtitle)
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('🦹 Le Dr. Destructo menace la Terre...', GAME_W / 2, 195);

  // Dr. Destructo animé (Animated Dr. Destructo)
  const villainX = GAME_W / 2 + Math.sin(frameCount * 0.04) * 30;
  ctx.font = '32px serif';
  ctx.fillText('🦹', villainX, 240);

  // Bouton jouer (Play button)
  const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
  ctx.save();
  ctx.translate(GAME_W / 2, 310);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = COLORS.pink;
  ctx.font = '12px "Press Start 2P", cursive';
  ctx.fillText('ESPACE pour commencer!', 0, 0);
  ctx.restore();

  // Modes de jeu (Game modes)
  ctx.fillStyle = COLORS.green;
  ctx.font = '9px "Press Start 2P", cursive';
  ctx.fillText('🏃 Mode à Pied    🚗 Mode Voiture', GAME_W / 2, 355);

  // Crédits (Credits)
  ctx.fillStyle = '#B8B8D1';
  ctx.font = '8px "Press Start 2P", cursive';
  ctx.fillText('🎮 Arcade Sohan', GAME_W / 2, 420);

  ctx.textAlign = 'left';
}

// === ÉCRAN CHOIX DE MODE (Mode selection screen) ===
export function drawModeSelect(ctx, frameCount, selectedMode) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  ctx.textAlign = 'center';

  // Titre (Title)
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '20px "Press Start 2P", cursive';
  ctx.fillText('🎮 CHOISIS TON MODE', GAME_W / 2, 80);

  // Mode à pied (On foot mode)
  const piedSelected = selectedMode === MODE.PIED;
  const piedY = 150;
  ctx.fillStyle = piedSelected ? 'rgba(0, 212, 255, 0.2)' : 'rgba(22, 33, 62, 0.8)';
  roundRect(ctx, GAME_W / 2 - 200, piedY, 400, 80, 12);
  ctx.fill();
  ctx.strokeStyle = piedSelected ? COLORS.cyan : COLORS.purple;
  ctx.lineWidth = 3;
  roundRect(ctx, GAME_W / 2 - 200, piedY, 400, 80, 12);
  ctx.stroke();
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '14px "Press Start 2P", cursive';
  ctx.fillText('🏃 MODE À PIED', GAME_W / 2, piedY + 35);
  ctx.fillStyle = '#B8B8D1';
  ctx.font = '8px "Press Start 2P", cursive';
  ctx.fillText('Courir, sauter, plateforme!', GAME_W / 2, piedY + 60);

  // Mode voiture (Car mode)
  const voitureSelected = selectedMode === MODE.VOITURE;
  const voitY = 260;
  ctx.fillStyle = voitureSelected ? 'rgba(0, 212, 255, 0.2)' : 'rgba(22, 33, 62, 0.8)';
  roundRect(ctx, GAME_W / 2 - 200, voitY, 400, 80, 12);
  ctx.fill();
  ctx.strokeStyle = voitureSelected ? COLORS.cyan : COLORS.purple;
  ctx.lineWidth = 3;
  roundRect(ctx, GAME_W / 2 - 200, voitY, 400, 80, 12);
  ctx.stroke();
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '14px "Press Start 2P", cursive';
  ctx.fillText('🚗 MODE VOITURE', GAME_W / 2, voitY + 35);
  ctx.fillStyle = '#B8B8D1';
  ctx.font = '8px "Press Start 2P", cursive';
  ctx.fillText('Course, combat, turbo!', GAME_W / 2, voitY + 60);

  // Instructions (Instructions)
  ctx.fillStyle = COLORS.green;
  ctx.font = '9px "Press Start 2P", cursive';
  ctx.fillText('⬆️⬇️ pour choisir — ESPACE pour valider', GAME_W / 2, 390);

  ctx.textAlign = 'left';
}

// === ÉCRAN DE PAUSE (Pause screen) ===
export function drawPauseScreen(ctx) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '28px "Press Start 2P", cursive';
  ctx.fillText('⏸️ PAUSE', GAME_W / 2, GAME_H / 2 - 20);

  ctx.fillStyle = COLORS.yellow;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('P pour reprendre', GAME_W / 2, GAME_H / 2 + 20);

  ctx.fillStyle = COLORS.green;
  ctx.font = '9px "Press Start 2P", cursive';
  ctx.fillText('S = Sauvegarder', GAME_W / 2, GAME_H / 2 + 50);

  ctx.textAlign = 'left';
}

// === ÉCRAN GAME OVER (Game over screen) ===
export function drawGameOverScreen(ctx, frameCount, game) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  ctx.textAlign = 'center';

  // Titre (Title)
  ctx.fillStyle = COLORS.pink;
  ctx.font = '32px "Press Start 2P", cursive';
  ctx.shadowColor = COLORS.pink;
  ctx.shadowBlur = 15;
  ctx.fillText('GAME OVER', GAME_W / 2, 150);
  ctx.shadowBlur = 0;

  // Dr Destructo content (Dr. Destructo happy)
  ctx.font = '40px serif';
  ctx.fillText('🦹', GAME_W / 2, 200);

  // Stats
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '12px "Press Start 2P", cursive';
  ctx.fillText('Score: ' + game.score, GAME_W / 2, 245);
  ctx.fillText('Niveau: ' + game.level, GAME_W / 2, 270);
  ctx.fillText('Pièces: ' + game.coins, GAME_W / 2, 295);

  // Bouton recommencer (Restart button)
  const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
  ctx.save();
  ctx.translate(GAME_W / 2, 350);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('ESPACE pour recommencer', 0, 0);
  ctx.restore();

  ctx.textAlign = 'left';
}

// === ÉCRAN NIVEAU GAGNÉ (Level win screen) ===
export function drawLevelWinScreen(ctx, frameCount, game) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  ctx.textAlign = 'center';

  ctx.fillStyle = COLORS.green;
  ctx.font = '24px "Press Start 2P", cursive';
  ctx.shadowColor = COLORS.green;
  ctx.shadowBlur = 15;
  ctx.fillText('🎉 NIVEAU ' + game.level, GAME_W / 2, 140);
  ctx.fillText('TERMINÉ!', GAME_W / 2, 180);
  ctx.shadowBlur = 0;

  ctx.fillStyle = COLORS.yellow;
  ctx.font = '12px "Press Start 2P", cursive';
  ctx.fillText('Score: ' + game.score, GAME_W / 2, 230);
  ctx.fillText('Pièces: ' + game.coins, GAME_W / 2, 255);

  const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
  ctx.save();
  ctx.translate(GAME_W / 2, 340);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('ESPACE pour continuer', 0, 0);
  ctx.restore();

  ctx.textAlign = 'left';
}

// === ÉCRAN D'ÉVOLUTION (Evolution screen) ===
export function drawEvolutionScreen(ctx, frameCount, evolution) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  ctx.textAlign = 'center';

  // Étoiles qui brillent (Shining stars)
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '20px "Press Start 2P", cursive';
  ctx.shadowColor = COLORS.yellow;
  ctx.shadowBlur = 20;
  ctx.fillText('⭐ ÉVOLUTION! ⭐', GAME_W / 2, 100);
  ctx.shadowBlur = 0;

  // Avant → Après (Before → After)
  if (evolution.before && evolution.after) {
    ctx.font = '40px serif';
    ctx.fillText(evolution.before.emoji, GAME_W / 2 - 100, 190);
    ctx.fillStyle = COLORS.cyan;
    ctx.font = '20px "Press Start 2P", cursive';
    ctx.fillText('→', GAME_W / 2, 185);
    ctx.font = '40px serif';
    ctx.fillStyle = COLORS.white;
    ctx.fillText(evolution.after.emoji, GAME_W / 2 + 100, 190);

    ctx.fillStyle = '#B8B8D1';
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.fillText(evolution.before.nom, GAME_W / 2 - 100, 220);
    ctx.fillStyle = COLORS.yellow;
    ctx.fillText(evolution.after.nom, GAME_W / 2 + 100, 220);

    // Nouveaux pouvoirs (New powers)
    ctx.fillStyle = COLORS.green;
    ctx.font = '10px "Press Start 2P", cursive';
    let y = 270;
    for (const p of evolution.after.pouvoirs) {
      const powerName = {
        speed: '+ Vitesse augmentée!',
        dash: '+ Nouveau pouvoir: Dash!',
        shield: '+ Bouclier temporaire!',
        double_jump: '+ Double saut!',
      }[p] || '+ ' + p;
      ctx.fillText(powerName, GAME_W / 2, y);
      y += 25;
    }
  }

  const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
  ctx.save();
  ctx.translate(GAME_W / 2, 390);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('ESPACE pour continuer', 0, 0);
  ctx.restore();

  ctx.textAlign = 'left';
}

// === ÉCRAN BOSS INTRO (Boss intro screen) ===
export function drawBossIntro(ctx, frameCount, bossInfo) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  ctx.textAlign = 'center';

  // Alerte (Alert)
  const flash = Math.sin(frameCount * 0.1) > 0;
  ctx.fillStyle = flash ? COLORS.red : COLORS.pink;
  ctx.font = '18px "Press Start 2P", cursive';
  ctx.fillText('⚠️ ALERTE BOSS! ⚠️', GAME_W / 2, 100);

  // Boss emoji
  ctx.font = '60px serif';
  const bossY = 190 + Math.sin(frameCount * 0.05) * 10;
  ctx.fillText(bossInfo.emoji || '👑', GAME_W / 2, bossY);

  // Nom du boss (Boss name)
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '16px "Press Start 2P", cursive';
  ctx.fillText(bossInfo.nom || 'BOSS', GAME_W / 2, 250);

  // Description
  ctx.fillStyle = '#B8B8D1';
  ctx.font = '8px "Press Start 2P", cursive';
  ctx.fillText(bossInfo.desc || 'Prépare-toi au combat!', GAME_W / 2, 280);

  const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
  ctx.save();
  ctx.translate(GAME_W / 2, 360);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('ESPACE pour combattre!', 0, 0);
  ctx.restore();

  ctx.textAlign = 'left';
}

// === ÉCRAN VICTOIRE FINALE (Victory screen) ===
export function drawVictoryScreen(ctx, frameCount, game) {
  // Fond avec feux d'artifice (Background with fireworks)
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
  grad.addColorStop(0, '#0D1B2A');
  grad.addColorStop(1, '#1A0A2E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Feux d'artifice (Fireworks)
  const colors = [COLORS.pink, COLORS.cyan, COLORS.yellow, COLORS.green];
  for (let i = 0; i < 8; i++) {
    const fx = (i * 107 + frameCount * 2) % GAME_W;
    const fy = 50 + (i * 73 + Math.sin(frameCount * 0.05 + i) * 30) % 200;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = (Math.sin(frameCount * 0.1 + i) + 1) / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';

  ctx.fillStyle = COLORS.yellow;
  ctx.font = '24px "Press Start 2P", cursive';
  ctx.shadowColor = COLORS.yellow;
  ctx.shadowBlur = 20;
  ctx.fillText('🎉 VICTOIRE! 🎉', GAME_W / 2, 100);
  ctx.shadowBlur = 0;

  ctx.font = '48px serif';
  ctx.fillText('🌍🛡️', GAME_W / 2, 170);

  ctx.fillStyle = COLORS.green;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.fillText('La Terre est sauvée!', GAME_W / 2, 220);
  ctx.fillText('Le Dr. Destructo est vaincu!', GAME_W / 2, 245);

  ctx.fillStyle = COLORS.yellow;
  ctx.font = '12px "Press Start 2P", cursive';
  ctx.fillText('Score final: ' + game.score, GAME_W / 2, 290);

  ctx.fillStyle = COLORS.cyan;
  ctx.font = '9px "Press Start 2P", cursive';
  ctx.fillText('Merci d\'avoir joué! 🎮', GAME_W / 2, 340);

  const pulse = 0.9 + Math.sin(frameCount * 0.06) * 0.1;
  ctx.save();
  ctx.translate(GAME_W / 2, 400);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = COLORS.pink;
  ctx.font = '9px "Press Start 2P", cursive';
  ctx.fillText('ESPACE pour rejouer', 0, 0);
  ctx.restore();

  ctx.textAlign = 'left';
}
