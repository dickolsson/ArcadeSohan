// ==========================================================
// 📖 STORY — Cinématiques d'histoire (Story cinematics)
// Dialogues du Dr. Destructo et transitions entre niveaux
// ==========================================================

import { GAME_W, GAME_H, COLORS } from './config.js';
import { roundRect } from '../shared/utils.js';

// === DIALOGUES DE L'HISTOIRE (Story dialogues) ===
const STORY_SCENES = [
  // Intro — avant le niveau 1
  {
    id: 'intro',
    lines: [
      { speaker: '🦹', name: 'Dr. Destructo', text: 'Ha ha ha! Ma machine va détruire la Terre!' },
      { speaker: '🦹', name: 'Dr. Destructo', text: 'Je vais téléporter tout le monde dans mes mondes!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'Pas si vite! On va t\'arrêter!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'En route vers la plage! C\'est parti!' },
    ],
  },
  // Après niveau 2 — avant Boss 1
  {
    id: 'boss1_intro',
    lines: [
      { speaker: '👦', name: 'Mini Destructo', text: 'C\'est moi, le fils du Dr. Destructo!' },
      { speaker: '👦', name: 'Mini Destructo', text: 'Mon papa dit que je dois vous arrêter!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'Un petit? On va être gentils... ou pas!' },
    ],
  },
  // Après niveau 4 — avant Boss 2
  {
    id: 'boss2_intro',
    lines: [
      { speaker: '🎖️', name: 'Général Méca', text: 'Halte! Vous n\'irez pas plus loin!' },
      { speaker: '🎖️', name: 'Général Méca', text: 'Mon armure est indestructible!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'On va voir ça!' },
    ],
  },
  // Après niveau 6 — avant Boss 3
  {
    id: 'boss3_intro',
    lines: [
      { speaker: '🤖', name: 'Robo-Destructo', text: 'BZZZT. Je suis la copie parfaite du Dr.!' },
      { speaker: '🤖', name: 'Robo-Destructo', text: 'Je copie tous vos mouvements. BZZZT.' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'Un robot? Ça va être intéressant...' },
    ],
  },
  // Après niveau 7 — avant Boss Final
  {
    id: 'boss_final_intro',
    lines: [
      { speaker: '🦹', name: 'Dr. Destructo', text: 'Vous êtes arrivés jusqu\'ici?!' },
      { speaker: '🦹', name: 'Dr. Destructo', text: 'Ma machine est prête! C\'est la fin!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'C\'est TA fin, Dr. Destructo!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'On va sauver la Terre!' },
    ],
  },
  // Transition — nouveau monde
  {
    id: 'new_world',
    lines: [
      { speaker: '🛡️', name: 'Earth Defenders', text: 'Bravo! Un monde de terminé!' },
      { speaker: '🛡️', name: 'Earth Defenders', text: 'En avant vers le prochain!' },
    ],
  },
];

// État de la cinématique (Cinematic state)
let currentScene = null;
let currentLineIndex = 0;
let charIndex = 0;
let charTimer = 0;
let sceneComplete = false;

// Démarrer une scène (Start a scene)
export function startScene(sceneId) {
  currentScene = STORY_SCENES.find(s => s.id === sceneId) || null;
  currentLineIndex = 0;
  charIndex = 0;
  charTimer = 0;
  sceneComplete = false;
}

// Avancer la scène (Advance the scene)
export function advanceScene() {
  if (!currentScene) return true;

  const line = currentScene.lines[currentLineIndex];
  if (charIndex < line.text.length) {
    // Montrer tout le texte d'un coup (Show all text at once)
    charIndex = line.text.length;
    return false;
  }

  currentLineIndex++;
  charIndex = 0;
  charTimer = 0;

  if (currentLineIndex >= currentScene.lines.length) {
    sceneComplete = true;
    currentScene = null;
    return true; // Scène terminée (Scene complete)
  }
  return false;
}

// Vérifier si la scène est active (Check if scene is active)
export function isSceneActive() {
  return currentScene !== null;
}

// Mettre à jour la scène (Update scene)
export function updateScene() {
  if (!currentScene) return;
  const line = currentScene.lines[currentLineIndex];
  charTimer++;
  if (charTimer % 2 === 0 && charIndex < line.text.length) {
    charIndex++;
  }
}

// Dessiner la scène (Draw scene)
export function drawScene(ctx, frameCount) {
  if (!currentScene) return;

  // Fond sombre (Dark background)
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
  grad.addColorStop(0, '#0D1B2A');
  grad.addColorStop(1, '#1A0A2E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Étoiles (Stars)
  for (let i = 0; i < 30; i++) {
    const sx = (i * 97) % GAME_W;
    const sy = (i * 53) % (GAME_H * 0.4);
    ctx.fillStyle = '#FFF';
    ctx.globalAlpha = (Math.sin(i + frameCount * 0.03) + 1) / 2 * 0.5;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;

  const line = currentScene.lines[currentLineIndex];

  // Personnage qui parle (Speaking character)
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  const speakerY = 180 + Math.sin(frameCount * 0.04) * 5;
  ctx.fillText(line.speaker, GAME_W / 2, speakerY);

  // Boîte de dialogue (Dialogue box)
  ctx.fillStyle = 'rgba(22, 33, 62, 0.9)';
  roundRect(ctx, 80, 280, GAME_W - 160, 120, 16);
  ctx.fill();
  ctx.strokeStyle = COLORS.cyan;
  ctx.lineWidth = 3;
  roundRect(ctx, 80, 280, GAME_W - 160, 120, 16);
  ctx.stroke();

  // Nom du personnage (Character name)
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '10px "Press Start 2P", cursive';
  ctx.textAlign = 'left';
  ctx.fillText(line.name, 110, 310);

  // Texte qui s'écrit (Typewriter text)
  ctx.fillStyle = COLORS.white;
  ctx.font = '9px "Press Start 2P", cursive';
  const displayText = line.text.substring(0, charIndex);
  // Word wrap simple (Simple word wrap)
  const maxWidth = GAME_W - 220;
  const words = displayText.split(' ');
  let currentLine = '';
  let y = 340;
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(currentLine, 110, y);
      currentLine = word;
      y += 22;
    } else {
      currentLine = testLine;
    }
  }
  ctx.fillText(currentLine, 110, y);

  // Indicateur "suivant" (Next indicator)
  if (charIndex >= line.text.length) {
    const nextAlpha = (Math.sin(frameCount * 0.08) + 1) / 2;
    ctx.globalAlpha = nextAlpha;
    ctx.fillStyle = COLORS.green;
    ctx.font = '8px "Press Start 2P", cursive';
    ctx.textAlign = 'right';
    ctx.fillText('ESPACE ▶', GAME_W - 100, 385);
    ctx.globalAlpha = 1;
  }

  // Compteur de lignes (Line counter)
  ctx.fillStyle = '#666';
  ctx.font = '7px "Press Start 2P", cursive';
  ctx.textAlign = 'right';
  ctx.fillText((currentLineIndex + 1) + '/' + currentScene.lines.length, GAME_W - 100, 290);

  ctx.textAlign = 'left';
}
