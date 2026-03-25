// ==========================================================
// 📷 SHARED CAMERA — Caméra et tremblement d'écran
// (Camera and screen shake — used by all Arcade Sohan games)
// ==========================================================

let cameraX = 0;
let shakeTimer = 0;
let _gameW = 800; // Largeur d'écran par défaut (Default screen width)

// Configurer la largeur de l'écran (Configure screen width)
export function configureCamera(gameWidth) {
  _gameW = gameWidth;
}

// Position actuelle de la caméra (Current camera position)
export function getCameraX() {
  return cameraX;
}

// Mettre à jour la caméra pour suivre le joueur (Update camera to follow player)
export function updateCamera(playerX, levelWidth) {
  const targetCam = playerX - _gameW / 3;
  cameraX += (targetCam - cameraX) * 0.07;
  if (cameraX < 0) cameraX = 0;
  if (cameraX > levelWidth - _gameW) cameraX = levelWidth - _gameW;
}

// Réinitialiser la caméra à la position 0 (Reset camera to position 0)
export function resetCamera() {
  cameraX = 0;
}

// Déclencher un tremblement d'écran (Trigger screen shake)
export function shake(duration) {
  shakeTimer = duration;
}

// Obtenir le décalage de tremblement actuel (Get current shake offset)
// Appeler une fois par frame (Call once per frame)
export function getShake() {
  if (shakeTimer > 0) {
    shakeTimer--;
    return {
      x: (Math.random() - 0.5) * shakeTimer,
      y: (Math.random() - 0.5) * shakeTimer,
    };
  }
  return { x: 0, y: 0 };
}
