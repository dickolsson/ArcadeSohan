// ==========================================================
// ⚙️ CONFIG — Constantes du jeu (Game constants)
// Toutes les valeurs réglables au même endroit!
// ==========================================================

// === TAILLE DU CANVAS (Canvas size) ===
export const GAME_W = 800;
export const GAME_H = 450;
export const TILE = 32;

// === PHYSIQUE (Physics) ===
export const GRAVITY = 0.42;
export const FRICTION = 0.85;
export const JUMP_FORCE = -8;
export const PLAYER_SPEED = 2;
export const LEVEL_WIDTH = 4000;

// === VOITURE (Car mode) ===
export const CAR_LANES = 3;
export const CAR_LANE_HEIGHT = 80;
export const CAR_SPEED = 2.2;
export const CAR_TURBO_MULT = 1.8;
export const CAR_TURBO_DURATION = 180; // 3 secondes à 60fps (3 seconds at 60fps)

// === VIES & SCORE (Lives & Score) ===
export const START_LIVES = 3;
export const COIN_SCORE = 10;
export const ENEMY_SCORE = 50;
export const BOSS_SCORE = 200;
export const LEVEL_SCORE = 100;

// === ÉTATS DU JEU (Game states) ===
export const STATE = {
  TITLE: 'title',
  STORY: 'story',
  MODE_SELECT: 'mode_select',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_WIN: 'level_win',
  EVOLUTION: 'evolution',
  BOSS_INTRO: 'boss_intro',
  VICTORY: 'victory',
};

// === MODES DE JEU (Game modes) ===
export const MODE = {
  PIED: 'pied',       // À pied — plateforme (On foot — platformer)
  VOITURE: 'voiture',  // En voiture — course (Car — race)
};

// === NIVEAUX — DÉCORS (Levels — Themes) ===
export const THEMES = {
  PLAGE: 'plage',
  FORET: 'foret',
  MONTAGNE: 'montagne',
  VILLE: 'ville',
  VOLCAN: 'volcan',
  DESERT: 'desert',
  FORTERESSE: 'forteresse',
  USINE: 'usine',
};

// === COULEURS PAR NIVEAU (Colors per level) ===
export const LEVEL_COLORS = {
  plage: {
    sky1: '#87CEEB', sky2: '#00B4D8', ground: '#F4D35E',
    accent: '#00B4D8', platform: '#C2B280',
  },
  foret: {
    sky1: '#2D6A4F', sky2: '#1B4332', ground: '#52B788',
    accent: '#95D5B2', platform: '#6B4226',
  },
  montagne: {
    sky1: '#457B9D', sky2: '#1D3557', ground: '#F8F9FA',
    accent: '#A2D2FF', platform: '#6C757D',
  },
  ville: {
    sky1: '#0D1B2A', sky2: '#1B2838', ground: '#343A40',
    accent: '#00D4FF', platform: '#495057',
  },
  volcan: {
    sky1: '#1A1A2E', sky2: '#3D0000', ground: '#2D2D2D',
    accent: '#DC2F02', platform: '#495057',
  },
  desert: {
    sky1: '#1A1A2E', sky2: '#2D1B69', ground: '#2D2D2D',
    accent: '#9B5DE5', platform: '#3D3D3D',
  },
  forteresse: {
    sky1: '#212529', sky2: '#343A40', ground: '#495057',
    accent: '#F48C06', platform: '#6C757D',
  },
  usine: {
    sky1: '#0D1B2A', sky2: '#1A0A2E', ground: '#2D2D2D',
    accent: '#7B2FF7', platform: '#495057',
  },
};

// === COULEURS COMMUNES (Common colors) ===
export const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  pink: '#FF6F91',
  cyan: '#00D4FF',
  yellow: '#FFE66D',
  green: '#4ECDC4',
  purple: '#6B5B95',
  red: '#FF1744',
  orange: '#FF9F1C',
  overlay: 'rgba(26, 10, 46, 0.85)',
  hud: 'rgba(22, 33, 62, 0.8)',
};

// === ÉVOLUTION DU JOUEUR (Player evolution) ===
export const EVOLUTION = [
  { nom: 'Coureur',      emoji: '🏃', couleur: '#4FC3F7', vitesse: 1.0, pouvoirs: [] },
  { nom: 'Sprinter',     emoji: '🏃‍♂️', couleur: '#E53935', vitesse: 1.2, pouvoirs: ['speed'] },
  { nom: 'Héros',        emoji: '🦸', couleur: '#43A047', vitesse: 1.3, pouvoirs: ['speed', 'dash'] },
  { nom: 'Super Héros',  emoji: '🦸‍♂️', couleur: '#FFD600', vitesse: 1.4, pouvoirs: ['speed', 'dash', 'shield'] },
  { nom: 'Champion',     emoji: '⚡', couleur: '#FF6F91', vitesse: 1.5, pouvoirs: ['speed', 'dash', 'shield', 'double_jump'] },
];

// === ÉVOLUTION VOITURE (Car evolution) ===
export const CAR_EVOLUTION = [
  { nom: 'Petite voiture', emoji: '🚗', couleur: '#4FC3F7', vitesse: 1.0, objets: ['stone'] },
  { nom: '4x4',            emoji: '🚙', couleur: '#66BB6A', vitesse: 1.1, objets: ['stone', 'oil'] },
  { nom: 'Voiture de course', emoji: '🏎️', couleur: '#EF5350', vitesse: 1.3, objets: ['stone', 'oil', 'bomb'] },
  { nom: 'Véhicule blindé',   emoji: '🚀', couleur: '#FFD600', vitesse: 1.5, objets: ['stone', 'oil', 'bomb', 'lightning'] },
];
