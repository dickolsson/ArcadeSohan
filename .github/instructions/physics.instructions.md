---
applyTo: "Game/**"
---

# 🔬 Physics.h API Instructions

This module provides **collision detection, distance calculation, and movement helpers** for all games. 

**Key benefit:** Zero RAM cost (all inline functions). Removes duplicate code across games!

---

## 📏 Section 1: Distance Functions

Calculate distance between two points. Useful for AI, collision thresholds, and proximity checks.

### phys_distance()

Approximate Euclidean distance. More accurate than Manhattan, still fast (no square root!).

```cpp
// Formula: max(dx,dy) + min(dx,dy)/2
int dist = phys_distance(playerX, playerY, enemyX, enemyY);

if (dist < 30) {
  // Enemy is close!
}
```

### phys_distanceManhattan()

Manhattan distance (dx + dy). Fastest, good for simple checks.

```cpp
int dist = phys_distanceManhattan(x1, y1, x2, y2);
```

---

## 💥 Section 2: Collision Functions

### phys_touchePoint()

**Most common!** Check if two points are within distance of each other.

```cpp
// Parameters:
//   x1, y1     - First point (e.g., player)
//   x2, y2     - Second point (e.g., food)
//   distance   - Collision threshold (in pixels)

// Example: Player eats food?
int seuil = (tailleJoueur + tailleNourriture) / 2;
if (phys_touchePoint(joueurX, joueurY, nourritureX, nourritureY, seuil)) {
  score += 10;
  placerNourriture();
}

// Example: Bullet hits enemy?
if (phys_touchePoint(bulletX, bulletY, enemyX, enemyY, 8)) {
  killEnemy();
}
```

### phys_toucheBoite()

Rectangle collision (AABB). Perfect for platforms, walls, doors.

```cpp
// Parameters:
//   x1, y1, w1, h1  - First rectangle
//   x2, y2, w2, h2  - Second rectangle

// Example: Player touches platform?
if (phys_toucheBoite(joueurX, joueurY, 6, 8,
                     platX, platY, platLargeur, 4)) {
  // On platform!
}
```

### phys_pointDansBoite()

Check if a point is inside a rectangle.

```cpp
// Example: Is player in danger zone?
if (phys_pointDansBoite(joueurX, joueurY, zoneX, zoneY, 50, 30)) {
  // Player in zone!
}
```

### phys_toucheCercle()

Circle collision. Good for round objects like balls, bubbles.

```cpp
// Parameters:
//   x1, y1, r1  - First circle center and radius
//   x2, y2, r2  - Second circle center and radius

if (phys_toucheCercle(ballX, ballY, 5, targetX, targetY, 10)) {
  // Collision!
}
```

---

## 🏃 Section 3: Movement Functions

### phys_clamp()

Limit a value between min and max. Simple but essential!

```cpp
// Keep speed between 1 and 10
vitesse = phys_clamp(vitesse, 1, 10);

// Keep X on screen
joueurX = phys_clamp(joueurX, 0, 127);
```

### phys_bougerVers()

Move toward a target. **Perfect for AI that chases the player!**

```cpp
// Parameters:
//   x, y      - Pointers to position (will be modified)
//   cibleX    - Target X
//   cibleY    - Target Y  
//   vitesse   - Speed (pixels per call)

// Example: Enemy chases player
phys_bougerVers(&enemyX, &enemyY, playerX, playerY, 1);

// Example: Slow homing missile
phys_bougerVers(&missileX, &missileY, targetX, targetY, 2);
```

### phys_fuirDe()

Move away from a threat. Perfect for flee AI!

```cpp
// Example: Scared enemy runs from player
phys_fuirDe(&enemyX, &enemyY, playerX, playerY, 2);
```

### phys_clampEcran()

Keep position within screen bounds with configurable margins.

```cpp
// Parameters:
//   x, y       - Pointers to position
//   marge      - Margin from left/right/bottom
//   margeHaut  - Margin from top (for score bar)

// Example: Keep player on screen, 10px from top (score bar)
phys_clampEcran(&joueurX, &joueurY, 5, 10);
```

### phys_clampEcranSimple()

Same margins on all sides.

```cpp
phys_clampEcranSimple(&x, &y, 5);  // 5px from all edges
```

---

## 🎯 Before/After Examples

### Collision Detection (14 lines → 3 lines)

```cpp
// ❌ BEFORE: Lots of duplicate code!
bool verifierCollision() {
  int distanceX = joueurX - nourritureX;
  int distanceY = joueurY - nourritureY;
  if (distanceX < 0) distanceX = -distanceX;
  if (distanceY < 0) distanceY = -distanceY;
  if (distanceX < (tailleJoueur + tailleNourriture) / 2 + 3) {
    if (distanceY < (tailleJoueur + tailleNourriture) / 2 + 3) {
      return true;
    }
  }
  return false;
}

// ✅ AFTER: Clean and simple!
bool verifierCollision() {
  int seuil = (tailleJoueur + tailleNourriture) / 2 + 3;
  return phys_touchePoint(joueurX, joueurY, nourritureX, nourritureY, seuil);
}
```

### Enemy AI Movement (4 lines → 1 line)

```cpp
// ❌ BEFORE
if (monstreX < joueurX) monstreX++;
if (monstreX > joueurX) monstreX--;
if (monstreY < joueurY) monstreY++;
if (monstreY > joueurY) monstreY--;

// ✅ AFTER
phys_bougerVers(&monstreX, &monstreY, joueurX, joueurY, 1);
```

---

## 💾 Memory Impact

| Aspect | Cost |
|--------|------|
| RAM | 0 bytes (all inline functions) |
| Flash | ~50 bytes for the functions |
| Savings | ~200 bytes by removing duplicate code |

---

## ⚠️ Tips

1. **Use `phys_touchePoint()` for most collisions** - it's the fastest and simplest
2. **Remember the order:** `phys_touchePoint(x1, y1, x2, y2, distance)`
3. **For AI movement:** `phys_bougerVers()` modifies the position pointers directly
4. **Score bar space:** Use `phys_clampEcran(x, y, margin, 10)` to keep Y below score display
