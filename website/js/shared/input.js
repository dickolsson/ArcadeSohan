// ==========================================================
// 🕹️ SHARED INPUT — Clavier, tactile et contrôles
// (Keyboard, touch and controls — used by all Arcade Sohan games)
// ==========================================================

// Touches actuellement pressées (Currently pressed keys)
const keys = {};

// Touches pressées cette frame seulement — pour éviter de répéter (Just pressed this frame)
const justPressed = {};

// État tactile (Touch state) — zones: left, middle, right
const touchState = { left: false, middle: false, right: false };
const touchJustPressed = { left: false, middle: false, right: false };

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

  // === Contrôles tactiles (Touch controls) ===
  initTouchControls();
}

// Initialiser les boutons tactiles (Initialize touch buttons)
function initTouchControls() {
  const overlay = document.getElementById('touch-controls');
  if (!overlay) return;

  // Activer les contrôles sur mobile (Enable controls on mobile)
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    overlay.classList.add('touch-enabled');
  }

  overlay.addEventListener('contextmenu', (e) => e.preventDefault());

  // 2 zones: gauche = aller à gauche, droite = aller à droite
  // 2ème doigt = sauter (2nd finger = jump)
  function updateFromTouches(e) {
    e.preventDefault();
    const wasMiddle = touchState.middle;

    touchState.left = false;
    touchState.middle = false;
    touchState.right = false;

    const midX = overlay.getBoundingClientRect().width / 2;
    const numTouches = e.touches.length;

    // 2+ doigts = sauter (2+ fingers = jump)
    if (numTouches >= 2) {
      touchState.middle = true;
    }

    // Direction = premier doigt (Direction = first finger)
    for (let i = 0; i < numTouches; i++) {
      const tx = e.touches[i].clientX - overlay.getBoundingClientRect().left;
      if (tx < midX) {
        touchState.left = true;
      } else {
        touchState.right = true;
      }
    }

    if (touchState.middle && !wasMiddle) touchJustPressed.middle = true;

    // 1 doigt = action pour les menus (1 finger tap = action for menus)
    if (numTouches >= 1 && e.type === 'touchstart') {
      touchJustPressed.middle = true;
    }
  }

  overlay.addEventListener('touchstart', updateFromTouches, { passive: false });
  overlay.addEventListener('touchmove', updateFromTouches, { passive: false });
  overlay.addEventListener('touchend', updateFromTouches, { passive: false });
  overlay.addEventListener('touchcancel', updateFromTouches, { passive: false });
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
  // Réinitialiser les touches tactiles "just pressed" (Reset touch just pressed)
  touchJustPressed.left = false;
  touchJustPressed.middle = false;
  touchJustPressed.right = false;
}

// === Raccourcis pratiques (Convenient shortcuts) ===
export function isLeft() {
  return isKeyDown('ArrowLeft') || isKeyDown('a') || isKeyDown('A') || touchState.left;
}

export function isRight() {
  return isKeyDown('ArrowRight') || isKeyDown('d') || isKeyDown('D') || touchState.right;
}

export function isUp() {
  return isKeyDown('ArrowUp') || isKeyDown('w') || isKeyDown('W') || touchState.middle;
}

export function isDown() {
  return isKeyDown('ArrowDown') || isKeyDown('s') || isKeyDown('S');
}

export function isJump() {
  return isKeyJustPressed('ArrowUp') || isKeyJustPressed('w') || isKeyJustPressed('W') || isKeyJustPressed(' ') || touchJustPressed.middle;
}

export function isAction() {
  return isKeyJustPressed(' ') || touchJustPressed.middle;
}

export function isPause() {
  return isKeyJustPressed('p') || isKeyJustPressed('P');
}

export function isDash() {
  return isKeyJustPressed('x') || isKeyJustPressed('X');
}
