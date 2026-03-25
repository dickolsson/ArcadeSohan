// ==========================================================
// 📋 LEVELS — Données de chaque niveau (Level data)
// Quel thème, quels ennemis, quel boss, quel mode
// ==========================================================

import { THEMES } from './config.js';

// === TABLEAU DES NIVEAUX (Level table) ===
// 8 niveaux — chacun a un thème, un mode, des ennemis, et peut-être un boss

export const LEVELS = [
  // --- Monde 1 : Plage (Beach) ---
  {
    num: 1,
    nom: 'La Plage Mystérieuse',  // Mysterious Beach
    theme: THEMES.PLAGE,
    enemies: ['soldat'],
    enemyCount: 4,
    boss: null,
    storyBefore: 'intro',
    storyAfter: 'new_world',
    evolutionAfter: false,
  },
  // --- Monde 2 : Forêt (Forest) ---
  {
    num: 2,
    nom: 'La Forêt Enchantée',  // Enchanted Forest
    theme: THEMES.FORET,
    enemies: ['soldat', 'bouclier'],
    enemyCount: 5,
    boss: null,
    storyBefore: null,
    storyAfter: null,
    evolutionAfter: true,
  },
  // --- Boss 1 : Mini Destructo ---
  {
    num: 3,
    nom: 'Montagne du Boss!',  // Boss Mountain!
    theme: THEMES.MONTAGNE,
    enemies: ['soldat', 'bouclier'],
    enemyCount: 3,
    boss: 'mini_destructo',
    storyBefore: 'boss1_intro',
    storyAfter: 'new_world',
    evolutionAfter: false,
    unlockCompanion: true,  // Compagnon débloqué! (Companion unlocked!)
  },
  // --- Monde 4 : Ville (City) ---
  {
    num: 4,
    nom: 'La Ville en Danger',  // City in Danger
    theme: THEMES.VILLE,
    enemies: ['soldat', 'lanceur', 'motard'],
    enemyCount: 6,
    boss: null,
    storyBefore: null,
    storyAfter: null,
    evolutionAfter: true,
  },
  // --- Boss 2 : Général Méca ---
  {
    num: 5,
    nom: 'Le Volcan Infernal',  // Infernal Volcano
    theme: THEMES.VOLCAN,
    enemies: ['soldat', 'lanceur', 'robot'],
    enemyCount: 4,
    boss: 'general_meca',
    storyBefore: 'boss2_intro',
    storyAfter: 'new_world',
    evolutionAfter: true,
  },
  // --- Monde 6 : Désert ---
  {
    num: 6,
    nom: 'Le Désert Brûlant',  // Burning Desert
    theme: THEMES.DESERT,
    enemies: ['bouclier', 'lanceur', 'robot'],
    enemyCount: 6,
    boss: null,
    storyBefore: null,
    storyAfter: null,
    evolutionAfter: false,
  },
  // --- Boss 3 : Robo-Destructo ---
  {
    num: 7,
    nom: 'La Forteresse Sombre',  // Dark Fortress
    theme: THEMES.FORTERESSE,
    enemies: ['soldat', 'bouclier', 'lanceur', 'robot'],
    enemyCount: 5,
    boss: 'robo_destructo',
    storyBefore: 'boss3_intro',
    storyAfter: null,
    evolutionAfter: true,
  },
  // --- Boss Final : Dr. Destructo ---
  {
    num: 8,
    nom: 'L\'Usine du Dr. Destructo',  // Dr. Destructo's Factory
    theme: THEMES.USINE,
    enemies: ['soldat', 'bouclier', 'lanceur', 'motard', 'robot'],
    enemyCount: 6,
    boss: 'dr_destructo',
    storyBefore: 'boss_final_intro',
    storyAfter: null,
    evolutionAfter: false,
  },
];

// Obtenir un niveau par numéro (Get level by number)
export function getLevel(num) {
  return LEVELS.find(l => l.num === num) || LEVELS[0];
}

// Nombre total de niveaux (Total number of levels)
export const TOTAL_LEVELS = LEVELS.length;
