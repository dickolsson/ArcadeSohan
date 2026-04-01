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

  // Multi-touch: lire TOUS les doigts actifs (read ALL active fingers)
  function updateZonesFromTouches(e) {
    e.preventDefault();
    const wasLeft = touchState.left;
    const wasMiddle = touchState.middle;
    const wasRight = touchState.right;

    // Réinitialiser (Reset all)
    touchState.left = false;
    touchState.middle = false;
    touchState.right = false;

    // Vérifier chaque doigt actif (Check each active finger)
    const overlayRect = overlay.getBoundingClientRect();
    const zoneWidth = overlayRect.width / 3;

    for (let i = 0; i < e.touches.length; i++) {
      const tx = e.touches[i].clientX - overlayRect.left;
      if (tx < zoneWidth) {
        touchState.left = true;
      } else if (tx < zoneWidth * 2) {
        touchState.middle = true;
      } else {
        touchState.right = true;
      }
    }

    // Détecter les "just pressed" (Detect just pressed)
    if (touchState.left && !wasLeft) touchJustPressed.left = true;
    if (touchState.middle && !wasMiddle) touchJustPressed.middle = true;
    if (touchState.right && !wasRight) touchJustPressed.right = true;
  }

  overlay.addEventListener('touchstart', updateZonesFromTouches, { passive: false });
  overlay.addEventListener('touchmove', updateZonesFromTouches, { passive: false });
  overlay.addEventListener('touchend', updateZonesFromTouches, { passive: false });
  overlay.addEventListener('touchcancel', updateZonesFromTouches, { passive: false });
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
