---
applyTo: "Game/**"
---

# 🔬 Physics.h - Collision & Movement

## Overview

Collision detection, distance calculation, and movement helpers. **Zero RAM cost** (all inline functions).

---

## Quick Reference

### Distance Functions

| Function | Description |
|----------|-------------|
| `phys_distance(x1, y1, x2, y2)` | Approximate Euclidean |
| `phys_distanceManhattan(x1, y1, x2, y2)` | Manhattan (fastest) |

### Collision Functions

| Function | Description |
|----------|-------------|
| `phys_touchePoint(x1, y1, x2, y2, dist)` | Two points within distance |
| `phys_toucheBoite(x1, y1, w1, h1, x2, y2, w2, h2)` | Rectangle overlap |
| `phys_pointDansBoite(px, py, bx, by, bw, bh)` | Point inside rectangle |
| `phys_toucheCercle(x1, y1, r1, x2, y2, r2)` | Circle collision |

### Movement Functions

| Function | Description |
|----------|-------------|
| `phys_clamp(val, min, max)` | Limit value to range |
| `phys_bougerVers(&x, &y, targetX, targetY, speed)` | Move toward target |
| `phys_fuirDe(&x, &y, threatX, threatY, speed)` | Move away from threat |
| `phys_clampEcran(&x, &y, margin, topMargin)` | Keep on screen |
| `phys_clampEcranSimple(&x, &y, margin)` | Same margin all sides |

---

## Examples

### Point Collision

```cpp
// Player touches food?
int seuil = (tailleJoueur + tailleNourriture) / 2;
if (phys_touchePoint(joueurX, joueurY, nourritureX, nourritureY, seuil)) {
  score += 10;
  placerNourriture();
}

// Bullet hits enemy?
if (phys_touchePoint(bulletX, bulletY, enemyX, enemyY, 8)) {
  killEnemy();
}
```

### Rectangle Collision

```cpp
// Player touches platform?
if (phys_toucheBoite(joueurX, joueurY, 6, 8,
                     platX, platY, platLargeur, 4)) {
  auSol = true;
}
```

### AI Movement

```cpp
// Enemy chases player
phys_bougerVers(&enemyX, &enemyY, playerX, playerY, 1);

// Enemy flees from player
phys_fuirDe(&enemyX, &enemyY, playerX, playerY, 2);
```

### Screen Bounds

```cpp
// Keep player on screen (10px from top for score bar)
phys_clampEcran(&joueurX, &joueurY, 5, 10);

// Simple clamping
vitesse = phys_clamp(vitesse, 1, 10);
```

---

## Before/After

### Collision (14 lines → 3 lines)

```cpp
// ❌ BEFORE
bool verifierCollision() {
  int distanceX = joueurX - nourritureX;
  int distanceY = joueurY - nourritureY;
  if (distanceX < 0) distanceX = -distanceX;
  if (distanceY < 0) distanceY = -distanceY;
  if (distanceX < seuil && distanceY < seuil) return true;
  return false;
}

// ✅ AFTER
bool verifierCollision() {
  return phys_touchePoint(joueurX, joueurY, nourritureX, nourritureY, seuil);
}
```

### AI Movement (4 lines → 1 line)

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

## Memory Impact

| Aspect | Cost |
|--------|------|
| RAM | 0 bytes (inline) |
| Flash | ~50 bytes |
| Savings | ~200 bytes from removed duplicates |
