// ==========================================================
// 💾 SAVE — Système de sauvegarde (Save system)
// localStorage — score, niveau, évolution, vies
// ==========================================================

const SAVE_KEY = 'earth_defenders_save';

// Données par défaut (Default data)
function defaultSave() {
  return {
    level: 1,
    score: 0,
    coins: 0,
    lives: 3,
    evolutionLevel: 0,
    hasCompanion: false,
    bestScore: 0,
    totalCoins: 0,
    version: 1,
  };
}

// === SAUVEGARDER (Save) ===
export function saveGame(game, player) {
  try {
    const data = {
      level: game.level,
      score: game.score,
      coins: game.coins,
      lives: game.lives,
      evolutionLevel: player.evolutionLevel || 0,
      hasCompanion: player.hasCompanion || false,
      bestScore: Math.max(game.score, loadBestScore()),
      totalCoins: (loadTotalCoins() || 0) + game.coins,
      version: 1,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Sauvegarde impossible (Cannot save):', e);
    return false;
  }
}

// === CHARGER (Load) ===
export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return null;
    return data;
  } catch (e) {
    console.warn('Chargement impossible (Cannot load):', e);
    return null;
  }
}

// === VÉRIFIER S'IL Y A UNE SAUVEGARDE (Check if save exists) ===
export function hasSave() {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch (e) {
    return false;
  }
}

// === SUPPRIMER LA SAUVEGARDE (Delete save) ===
export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn('Suppression impossible (Cannot delete):', e);
  }
}

// === MEILLEUR SCORE (Best score) ===
export function loadBestScore() {
  const data = loadGame();
  return data ? data.bestScore || 0 : 0;
}

// === PIÈCES TOTALES (Total coins) ===
export function loadTotalCoins() {
  const data = loadGame();
  return data ? data.totalCoins || 0 : 0;
}
