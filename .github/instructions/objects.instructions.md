---
applyTo: "Game/**"
---

# 📦 Objects.h - Object Pools

## Overview

Object pools for managing multiple game objects (collectibles, enemies, projectiles). **No dynamic memory allocation.**

---

## When to Use

✅ **Use when:**
- 3+ collectibles (coins, gems)
- Multiple enemies (waves, swarms)
- Multiple projectiles (bullets)
- Objects spawn/despawn frequently

❌ **Don't use when:**
- Only 1-2 objects
- Fixed objects (platforms)
- Simple manual management works

---

## Memory Cost

| Structure | Per Object | Pool of 6 |
|-----------|------------|-----------|
| `ObjetSimple` | 5 bytes | 30 bytes |
| `ObjetMobile` | 7 bytes | 42 bytes |

**Maximum:** 6 objects per pool on Arduino Uno.

---

## Quick Reference

### ObjetSimple (Static)

For coins, power-ups, checkpoints.

| Function | Description |
|----------|-------------|
| `obj_initialiser(pool, size)` | Set all inactive |
| `obj_creer(pool, size, x, y, type)` | Create at position |
| `obj_creerProc(pool, size, seed, idx, type, margin)` | Create at random position |
| `obj_supprimer(pool, idx)` | Remove one |
| `obj_supprimerTous(pool, size)` | Remove all |
| `obj_touchePoint(pool, size, x, y, dist)` | Check collision (-1 if none) |
| `obj_compterActifs(pool, size)` | Count active |

### ObjetMobile (Moving)

For bullets, enemies with velocity.

| Function | Description |
|----------|-------------|
| `objm_initialiser(pool, size)` | Set all inactive |
| `objm_creer(pool, size, x, y, vx, vy, type)` | Create with velocity |
| `objm_supprimer(pool, idx)` | Remove one |
| `objm_bougerTous(pool, size, margin)` | Move all, remove off-screen |
| `objm_bougerVersCible(pool, size, tx, ty)` | All chase target |
| `objm_touchePoint(pool, size, x, y, dist)` | Check collision |

### Macros

| Macro | Description |
|-------|-------------|
| `POUR_CHAQUE_OBJET(pool, size, var)` | Loop active ObjetSimple |
| `POUR_CHAQUE_MOBILE(pool, size, var)` | Loop active ObjetMobile |

---

## Structures

```cpp
struct ObjetSimple {
  int8_t x, y;     // Position (0-127, 0-63)
  int8_t type;     // 0 = inactive, 1+ = type
  bool actif;
};

struct ObjetMobile {
  int8_t x, y;     // Position
  int8_t vx, vy;   // Velocity
  int8_t type;     // 0 = inactive
  bool actif;
};
```

---

## Example: Coin Collection

```cpp
#define MAX_COINS 5
ObjetSimple coins[MAX_COINS];
int spawnCounter = 0;

void setupJeu() {
  obj_initialiser(coins, MAX_COINS);
  for (int i = 0; i < 3; i++) {
    obj_creerProc(coins, MAX_COINS, niveau * 10, i, 1, 15);
  }
}

void loopJeu() {
  // Collision
  int touched = obj_touchePoint(coins, MAX_COINS, joueurX, joueurY, 6);
  if (touched >= 0) {
    score += 10;
    obj_supprimer(coins, touched);
    obj_creerProc(coins, MAX_COINS, niveau * 10, spawnCounter++, 1, 15);
  }
  
  // Draw
  DESSINER_ECRAN {
    POUR_CHAQUE_OBJET(coins, MAX_COINS, coin) {
      dessinerCercle(coin.x, coin.y, 3);
    }
  }
}
```

---

## Example: Shooter

```cpp
#define MAX_BULLETS 4
#define MAX_ENEMIES 3

ObjetMobile bullets[MAX_BULLETS];
ObjetMobile enemies[MAX_ENEMIES];

void setupJeu() {
  objm_initialiser(bullets, MAX_BULLETS);
  objm_initialiser(enemies, MAX_ENEMIES);
}

void tirer() {
  objm_creer(bullets, MAX_BULLETS,
             joueurX, joueurY,
             dirX * 5, dirY * 5, 1);
}

void loopJeu() {
  // Move bullets
  objm_bougerTous(bullets, MAX_BULLETS, 0);
  
  // Enemies chase player
  objm_bougerVersCible(enemies, MAX_ENEMIES, joueurX, joueurY);
  
  // Check bullet-enemy collision
  for (int b = 0; b < MAX_BULLETS; b++) {
    if (bullets[b].actif) {
      int hit = objm_touchePoint(enemies, MAX_ENEMIES,
                                  bullets[b].x, bullets[b].y, 6);
      if (hit >= 0) {
        objm_supprimer(bullets, b);
        objm_supprimer(enemies, hit);
        score += 25;
      }
    }
  }
}
```

---

## Tips

1. **Max 6 objects per pool**
2. **Type 0 = inactive** - use 1, 2, 3 for variants
3. **Combine with Procedural.h** for random spawning
4. **Combine with Physics.h** for collision
