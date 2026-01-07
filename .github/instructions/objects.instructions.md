---
applyTo: "Game/**"
---

# 📦 Objects.h API Instructions

This module provides **object pools** for managing multiple game objects like collectibles, enemies, and projectiles.

**Key benefit:** Reusable object management without dynamic memory allocation!

---

## 🎯 When to Use Objects.h

✅ **USE when:**
- Game has 3+ collectibles (coins, gems, power-ups)
- Game has multiple enemies (waves, swarms)
- Game has multiple projectiles (bullets, missiles)
- Objects need to spawn and despawn frequently

❌ **DON'T USE when:**
- Game has only 1-2 objects (like current Monster Hunter)
- Objects are fixed (like platforms in Aventurier)
- Simpler manual management is sufficient

---

## 📊 Memory Cost

| Structure | Size per object | Pool of 6 |
|-----------|-----------------|-----------|
| `ObjetSimple` | 5 bytes | 30 bytes |
| `ObjetMobile` | 7 bytes | 42 bytes |

**Recommendation:** Maximum 6 objects per pool on Arduino Uno!

---

## 🔷 Section 1: ObjetSimple (Static Objects)

For objects that don't move on their own: coins, power-ups, checkpoints.

### Structure

```cpp
struct ObjetSimple {
  int8_t x;      // Position X (0-127)
  int8_t y;      // Position Y (0-63)
  int8_t type;   // Object type (0 = inactive, 1+ = type)
  bool actif;    // Is active/visible?
};
```

### Creating a Pool

```cpp
// Declare pool in your game file
#define MAX_COINS 5
ObjetSimple coins[MAX_COINS];

// Initialize at game start
void setupJeu() {
  obj_initialiser(coins, MAX_COINS);
}
```

### Spawning Objects

```cpp
// Manual position
obj_creer(coins, MAX_COINS, 50, 30, 1);  // x=50, y=30, type=1

// Procedural position (uses Procedural.h)
obj_creerProc(coins, MAX_COINS, niveau, spawnCounter, 1, 10);
```

### Collision Detection

```cpp
// Check if player touches any coin
int touchedIndex = obj_touchePoint(coins, MAX_COINS, joueurX, joueurY, 8);
if (touchedIndex >= 0) {
  score += 10;
  obj_supprimer(coins, touchedIndex);
}
```

### Drawing Objects

```cpp
// Method 1: Manual loop
for (int i = 0; i < MAX_COINS; i++) {
  if (coins[i].actif) {
    dessinerCercle(coins[i].x, coins[i].y, 3);
  }
}

// Method 2: Using POUR_CHAQUE_OBJET macro
POUR_CHAQUE_OBJET(coins, MAX_COINS, coin) {
  dessinerCercle(coin.x, coin.y, 3);
}
```

---

## 🔶 Section 2: ObjetMobile (Moving Objects)

For objects that move: bullets, enemies, particles.

### Structure

```cpp
struct ObjetMobile {
  int8_t x;      // Position X
  int8_t y;      // Position Y
  int8_t vx;     // Velocity X
  int8_t vy;     // Velocity Y
  int8_t type;   // Object type (0 = inactive)
  bool actif;    // Is active?
};
```

### Creating a Pool

```cpp
#define MAX_BULLETS 4
ObjetMobile bullets[MAX_BULLETS];

void setupJeu() {
  objm_initialiser(bullets, MAX_BULLETS);
}
```

### Shooting Bullets

```cpp
void tirer() {
  // Create bullet at player position, moving in direction
  objm_creer(bullets, MAX_BULLETS,
             joueurX, joueurY,    // Start position
             directionX * 4, directionY * 4,  // Velocity
             1);  // Type
}
```

### Moving All Bullets

```cpp
void updateBullets() {
  // Move all bullets by their velocity
  // Removes bullets that go off screen
  objm_bougerTous(bullets, MAX_BULLETS, 0);
}
```

### Enemy Chasing

```cpp
#define MAX_ENEMIES 3
ObjetMobile enemies[MAX_ENEMIES];

void updateEnemies() {
  // All enemies move toward player
  objm_bougerVersCible(enemies, MAX_ENEMIES, joueurX, joueurY);
}
```

### Collision Between Pools

```cpp
// Check if any bullet hits any enemy
int hitEnemy;
int hitBullet = obj_touchePool(
  (ObjetSimple*)bullets, MAX_BULLETS,  // Pool 1
  (ObjetSimple*)enemies, MAX_ENEMIES,  // Pool 2
  6,                                   // Distance threshold
  &hitEnemy                            // Returns enemy index
);

if (hitBullet >= 0) {
  objm_supprimer(bullets, hitBullet);
  objm_supprimer(enemies, hitEnemy);
  score += 25;
}
```

---

## 🎮 Complete Example: Coin Collection Game

```cpp
#include "Objects.h"
#include "Physics.h"

#define MAX_COINS 5
ObjetSimple coins[MAX_COINS];
int spawnCounter = 0;

void setupJeu() {
  obj_initialiser(coins, MAX_COINS);
  
  // Spawn initial coins
  for (int i = 0; i < 3; i++) {
    obj_creerProc(coins, MAX_COINS, niveau * 10, i, 1, 15);
    spawnCounter++;
  }
}

void loopJeu() {
  // Player collision with coins
  int touched = obj_touchePoint(coins, MAX_COINS, joueurX, joueurY, 6);
  if (touched >= 0) {
    score += 10;
    obj_supprimer(coins, touched);
    
    // Spawn new coin
    obj_creerProc(coins, MAX_COINS, niveau * 10, spawnCounter, 1, 15);
    spawnCounter++;
  }
  
  // Draw coins
  DESSINER_ECRAN {
    POUR_CHAQUE_OBJET(coins, MAX_COINS, coin) {
      dessinerCercle(coin.x, coin.y, 3);
    }
    // Draw player...
  }
}
```

---

## 🎮 Complete Example: Shooter Game

```cpp
#include "Objects.h"
#include "Physics.h"

#define MAX_BULLETS 4
#define MAX_ENEMIES 3

ObjetMobile bullets[MAX_BULLETS];
ObjetMobile enemies[MAX_ENEMIES];

void setupJeu() {
  objm_initialiser(bullets, MAX_BULLETS);
  objm_initialiser(enemies, MAX_ENEMIES);
  
  // Spawn enemies in corners
  for (int i = 0; i < 3; i++) {
    int ex, ey;
    proc_genererDansCoin(niveau, i, &ex, &ey, 20);
    objm_creer(enemies, MAX_ENEMIES, ex, ey, 0, 0, 1);
  }
}

void tirer() {
  if (munitions > 0) {
    objm_creer(bullets, MAX_BULLETS,
               joueurX, joueurY,
               dirX * 5, dirY * 5, 1);
    munitions--;
  }
}

void loopJeu() {
  // Move bullets
  objm_bougerTous(bullets, MAX_BULLETS, 0);
  
  // Enemies chase player
  objm_bougerVersCible(enemies, MAX_ENEMIES, joueurX, joueurY);
  
  // Bullet-enemy collision
  int hitEnemy;
  int hitBullet = objm_touchePoint(bullets, MAX_BULLETS, 
                                    /* for each enemy... */);
  // Handle collision...
  
  // Player-enemy collision
  int touched = objm_touchePoint(enemies, MAX_ENEMIES, 
                                  joueurX, joueurY, 8);
  if (touched >= 0) {
    gameOver();
  }
}
```

---

## 📋 API Reference

### ObjetSimple Functions

| Function | Description |
|----------|-------------|
| `obj_initialiser(pool, size)` | Set all objects to inactive |
| `obj_compterActifs(pool, size)` | Count active objects |
| `obj_trouverLibre(pool, size)` | Find first free slot (-1 if full) |
| `obj_creer(pool, size, x, y, type)` | Create at position |
| `obj_creerProc(pool, size, seed, index, type, margin)` | Create at procedural position |
| `obj_supprimer(pool, index)` | Remove one object |
| `obj_supprimerTous(pool, size)` | Remove all objects |
| `obj_touchePoint(pool, size, x, y, dist)` | Check collision with point |
| `obj_touchePool(p1, s1, p2, s2, dist, *idx)` | Check collision between pools |

### ObjetMobile Functions

| Function | Description |
|----------|-------------|
| `objm_initialiser(pool, size)` | Set all objects to inactive |
| `objm_trouverLibre(pool, size)` | Find first free slot |
| `objm_creer(pool, size, x, y, vx, vy, type)` | Create with velocity |
| `objm_supprimer(pool, index)` | Remove one object |
| `objm_supprimerTous(pool, size)` | Remove all objects |
| `objm_bougerTous(pool, size, margin)` | Move all by velocity |
| `objm_bougerVersCible(pool, size, tx, ty)` | All chase target |
| `objm_touchePoint(pool, size, x, y, dist)` | Check collision with point |

### Macros

| Macro | Description |
|-------|-------------|
| `POUR_CHAQUE_OBJET(pool, size, var)` | Loop over active ObjetSimple |
| `POUR_CHAQUE_MOBILE(pool, size, var)` | Loop over active ObjetMobile |

---

## ⚠️ Tips

1. **Keep pools small!** Max 6 objects per pool on Arduino
2. **Use `int8_t` types** - positions 0-127 fit perfectly
3. **Type 0 = inactive** - use types 1, 2, 3... for object variants
4. **Combine with Procedural.h** - use `obj_creerProc()` for random spawning
5. **Combine with Physics.h** - collision functions are built on `phys_touchePoint()`
