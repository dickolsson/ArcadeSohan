---
applyTo: "Game/**"
---

# 🎲 Procedural.h API Instructions

This module provides **procedural generation** for game elements. It works for both **platform games** (like Aventurier) and **top-view games** (like Monster Hunter).

**Key benefit:** Same seed = same result. Infinite levels without using RAM!

---

## 🌱 How Seeds Work

The procedural generator uses a **seed** (graine) to create "random" numbers that are always the same for the same seed:

```cpp
// Level 5 will ALWAYS generate the same platforms
proc_genererPlateformes(5, plat, 5, 1);

// Same level, same spawn = same position
proc_genererPosition(niveau, 0, &x, &y, 10);
```

**Tip:** Use the level number as seed. Add counters for multiple spawns per level.

---

## 📦 Section 1: Generic Functions (All Game Types)

These functions work for **any type of game** - platform, top-view, puzzle, etc.

### proc_genererPosition()

Generate ONE random position on screen.

```cpp
// Parameters:
//   seed  - Generation seed (use level number)
//   index - Element number (0, 1, 2...)
//   x, y  - Pointers to store result
//   marge - Minimum distance from screen edges

int foodX, foodY;
proc_genererPosition(niveau, 0, &foodX, &foodY, 10);
```

### proc_genererPositions()

Generate MULTIPLE positions at once.

```cpp
// Parameters:
//   seed      - Generation seed
//   positions - Array [n][2] for x,y pairs
//   nb        - Number of positions to generate
//   marge     - Minimum distance from edges

int items[5][2];  // 5 items, each with x,y
proc_genererPositions(niveau, items, 5, 10);

// Access: items[0][0] = x, items[0][1] = y
```

### proc_genererLoinDe()

Generate position FAR from a given point. **Perfect for spawning enemies!**

```cpp
// Parameters:
//   seed     - Generation seed
//   index    - Element number
//   x, y     - Pointers to store result
//   eviterX  - X position to avoid (player)
//   eviterY  - Y position to avoid (player)
//   distMin  - Minimum distance required
//   marge    - Distance from screen edges

int monstreX, monstreY;
proc_genererLoinDe(niveau, spawnCounter, &monstreX, &monstreY,
                   joueurX, joueurY, 40, 10);
```

### proc_genererDansCoin()

Generate position in a random corner of the screen.

```cpp
// Parameters:
//   seed  - Generation seed
//   index - Element number
//   x, y  - Pointers to store result
//   marge - Spawn zone size from corner

int enemyX, enemyY;
proc_genererDansCoin(niveau, 0, &enemyX, &enemyY, 25);
```

---

## 🏃 Section 2: Platform Game Functions

These functions are specific to **platform games** with jumping mechanics.

### proc_genererPlateformes()

Generate playable, jumpable platforms.

```cpp
// Parameters:
//   niveau     - Level number (used as seed)
//   plat       - Array [n][3] for x, y, width
//   nbPlat     - Number of platforms to generate
//   difficulte - 1=easy, 2=medium, 3=hard

// Returns: Y position of last platform

int plat[5][3];
int lastY = proc_genererPlateformes(niveau, plat, 5, 1);
```

**The first platform is always at (0, 56) for player spawn.**

### proc_genererPorte()

Place the door/goal on the last platform.

```cpp
// Parameters:
//   plat    - Platform array
//   nbPlat  - Number of platforms
//   porteX  - Pointer to store door X
//   porteY  - Pointer to store door Y

int porteX, porteY;
proc_genererPorte(plat, 5, &porteX, &porteY);
```

### proc_genererSurPlateforme()

Generate a position ON a platform (for items or enemies).

```cpp
// Parameters:
//   seed     - Generation seed
//   index    - Element number
//   plat     - Platform array
//   nbPlat   - Number of platforms
//   x, y     - Pointers to store result
//   hauteur  - Height above platform

int starX, starY;
proc_genererSurPlateforme(niveau, 0, plat, 5, &starX, &starY, 15);
```

**Note:** Avoids the first platform (spawn point).

---

## 🛠️ Section 3: Utilities

### proc_calculerDifficulte()

Calculate difficulty based on level number.

```cpp
// Returns: 1 (easy), 2 (medium), 3 (hard)

int diff = proc_calculerDifficulte(niveau);
// Levels 1-3: returns 1
// Levels 4-7: returns 2
// Levels 8+:  returns 3
```

### proc_random()

Get a random number (after initializing with proc_init).

```cpp
proc_init(seed);
int value = proc_random(minVal, maxVal);
```

---

## 🎮 Complete Examples

### Platform Game (Aventurier style)

```cpp
#include "Procedural.h"

int gn_plat[5][3];
int gn_porteX, gn_porteY;

void gn_creerNiveau() {
  if (gn_niveau <= 4) {
    // Hand-crafted levels from PROGMEM
    pm_chargerNiveau(gn_niveaux[gn_niveau], gn_plat, 5);
  } else {
    // Procedural levels 5+
    int diff = proc_calculerDifficulte(gn_niveau);
    proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
    proc_genererPorte(gn_plat, 5, &gn_porteX, &gn_porteY);
  }
}
```

### Top-View Game (Monster Hunter style)

```cpp
#include "Procedural.h"

int mh_spawnCounter = 0;

void mh_placerMonstre() {
  mh_spawnCounter++;
  proc_genererLoinDe(mh_niveau * 100 + mh_spawnCounter, 0,
                     &mh_monstreX, &mh_monstreY,
                     mh_joueurX, mh_joueurY, 40, 10);
}

void mh_placerNourriture() {
  mh_spawnCounter++;
  proc_genererPosition(mh_niveau * 100 + mh_spawnCounter, 0,
                       &mh_nourritureX, &mh_nourritureY, 10);
}

void mh_resetJeu() {
  mh_spawnCounter = 0;  // Reset for new game
  // ... other resets
}
```

---

## 📏 Screen Coordinates Reference

| Constant | Value | Meaning |
|----------|-------|---------|
| `PROC_ECRAN_LARGEUR` | 128 | Screen width in pixels |
| `PROC_ECRAN_HAUTEUR` | 64 | Screen height in pixels |

**Note:** Y=0 is at the TOP of the screen. Y increases downward.

---

## 💡 Tips

1. **Use spawn counters** - Increment a counter each time you spawn something to get different positions with the same level seed.

2. **Adjust for status bars** - If you have a score bar at the top, check that Y is not too small:
   ```cpp
   if (monstreY < 12) monstreY = 12;
   ```

3. **Combine with PROGMEM** - Use hand-crafted PROGMEM levels for early game, procedural for infinite mode:
   ```cpp
   if (niveau <= 4) {
     pm_chargerNiveau(niveaux[niveau], plat, 5);
   } else {
     proc_genererPlateformes(niveau, plat, 5, diff);
   }
   ```

4. **Same seed = same level** - Players can replay the same level by using the same seed!
