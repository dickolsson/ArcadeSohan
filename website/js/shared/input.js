// ==========================================================
// 🕹️ SHARED INPUT — Clavier et contrôles (Keyboard and controls)
// Écoute les touches pressées — utilisé par tous les jeux
// (Used by all Arcade Sohan games)
// ==========================================================

// Touches actuellement pressées (Currently pressed keys)
const keys = {};

// Touches pressées cette frame seulement — pour éviter de répéter (Just pressed this frame)
const justPressed = {};

// Initialiser les écouteurs (Initialize listeners)
export function initInput() {
  document.addEventListener('keydown', (e) => {
    // Empêcher le scroll de la page (Prevent page scroll)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (!keys[e.key]) {
      justPressed[e.key] = true;
    }
    keys[e.key] = true;
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
}

// Vérifier si une touche est enfoncée (Check if key is held)
export function isKeyDown(key) {
  return !!keys[key];
}

// Vérifier si une touche vient d'être pressée (Check if key was just pressed)
export function isKeyJustPressed(key) {
  return !!justPressed[key];
}

// Réinitialiser les "justPressed" à chaque frame (Reset justPressed each frame)
export function clearJustPressed() {
  for (const k in justPressed) {
    delete justPressed[k];
  }
}

// === Raccourcis pratiques (Convenient shortcuts) ===
export function isLeft() {
  return isKeyDown('ArrowLeft') || isKeyDown('a') || isKeyDown('A');
}

export function isRight() {
  return isKeyDown('ArrowRight') || isKeyDown('d') || isKeyDown('D');
}

export function isUp() {
  return isKeyDown('ArrowUp') || isKeyDown('w') || isKeyDown('W');
}

export function isDown() {
  return isKeyDown('ArrowDown') || isKeyDown('s') || isKeyDown('S');
}

export function isJump() {
  return isKeyJustPressed('ArrowUp') || isKeyJustPressed('w') || isKeyJustPressed('W') || isKeyJustPressed(' ');
}

export function isAction() {
  return isKeyJustPressed(' ');
}

export function isPause() {
  return isKeyJustPressed('p') || isKeyJustPressed('P');
}

export function isDash() {
  return isKeyJustPressed('x') || isKeyJustPressed('X');
}
