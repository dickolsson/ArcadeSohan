// ==========================================================
// 🏗️ SHARED PHYSICS — Gravité, collisions, mouvement
// Utilisé par tous les jeux de l'Arcade Sohan
// (Used by all Arcade Sohan games)
// ==========================================================

// Appliquer la gravité à un objet (Apply gravity to an object)
// gravity par défaut = 0.6 (default gravity = 0.6)
export function applyGravity(obj, gravity = 0.42, maxFall = 10) {
  obj.vy += gravity;
  if (obj.vy > maxFall) obj.vy = maxFall;
}

// Vérifier la collision entre deux rectangles (Check rectangle collision)
export function checkCollision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Vérifier si un objet atterrit sur un autre — par dessus (Check if landing on top)
export function isLandingOn(jumper, target) {
  return (
    jumper.vy > 0 &&
    jumper.x + jumper.w > target.x + 4 &&
    jumper.x < target.x + target.w - 4 &&
    jumper.y + jumper.h > target.y &&
    jumper.y + jumper.h < target.y + target.h / 2 + 10
  );
}

// Résoudre les collisions avec les plateformes (Resolve platform collisions)
export function resolvePlatformCollisions(obj, platforms) {
  obj.onGround = false;

  for (const plat of platforms) {
    // Collision par le dessus — atterrir (Top collision — landing)
    if (
      obj.x + obj.w > plat.x &&
      obj.x < plat.x + plat.w &&
      obj.y + obj.h > plat.y &&
      obj.y + obj.h < plat.y + plat.h + 10 &&
      obj.vy >= 0
    ) {
      obj.y = plat.y - obj.h;
      obj.vy = 0;
      obj.onGround = true;
    }

    // Collision par le dessous — cogner la tête (Bottom collision — head bump)
    if (
      obj.x + obj.w > plat.x &&
      obj.x < plat.x + plat.w &&
      obj.y < plat.y + plat.h &&
      obj.y > plat.y &&
      obj.vy < 0
    ) {
      obj.y = plat.y + plat.h;
      obj.vy = 1;
    }

    // Collision latérale (Side collision)
    if (
      obj.y + obj.h > plat.y + 4 &&
      obj.y < plat.y + plat.h - 4
    ) {
      // Mur à droite (Right wall)
      if (
        obj.x + obj.w > plat.x &&
        obj.x + obj.w < plat.x + 10 &&
        obj.vx > 0
      ) {
        obj.x = plat.x - obj.w;
      }
      // Mur à gauche (Left wall)
      if (
        obj.x < plat.x + plat.w &&
        obj.x > plat.x + plat.w - 10 &&
        obj.vx < 0
      ) {
        obj.x = plat.x + plat.w;
      }
    }
  }
}

// Garder un objet dans les limites du niveau (Keep object in level bounds)
export function clampToLevel(obj, levelWidth) {
  if (obj.x < 0) obj.x = 0;
  if (obj.x > levelWidth - obj.w) obj.x = levelWidth - obj.w;
}

// Vérifier si un objet est tombé dans le vide (Check if fell off map)
export function hasFallenOff(obj, gameHeight) {
  return obj.y > gameHeight + 50;
}
