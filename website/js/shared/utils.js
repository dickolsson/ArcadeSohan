// ==========================================================
// 🔧 SHARED UTILS — Petits outils réutilisables (Reusable helpers)
// Utilisé par tous les jeux de l'Arcade Sohan
// (Used by all Arcade Sohan games)
// ==========================================================

// Nombre aléatoire entre min et max (Random number between min and max)
export function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Nombre entier aléatoire (Random integer)
export function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

// Limiter une valeur entre min et max (Clamp a value)
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// Distance entre deux points (Distance between two points)
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Interpolation linéaire (Linear interpolation)
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Choisir un élément aléatoire dans un tableau (Pick random from array)
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Vérifier si deux rectangles se chevauchent (Check if two rectangles overlap)
export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Dessiner un rectangle arrondi (Draw a rounded rectangle)
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Convertir des degrés en radians (Convert degrees to radians)
export function degToRad(deg) {
  return deg * Math.PI / 180;
}
