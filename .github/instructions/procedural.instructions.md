---
applyTo: "Game/**"
---

# 🎲 Procedural.h - Level Generation

## Overview

Procedural generation for game elements. **Same seed = same result.** Infinite levels without using RAM!

---

## How Seeds Work

```cpp
// Level 5 always generates the same platforms
proc_genererPlateformes(5, plat, 5, 1);

// Same seed + index = same position
proc_genererPosition(niveau, 0, &x, &y, 10);
```

**Tip:** Use level number as seed. Add counters for multiple spawns.

---

## Quick Reference

### Position Generation

| Function | Description |
|----------|-------------|
| `proc_genererPosition(seed, idx, &x, &y, margin)` | Random position |
| `proc_genererPositions(seed, arr, n, margin)` | Multiple positions |
| `proc_genererLoinDe(seed, idx, &x, &y, avoidX, avoidY, minDist, margin)` | Far from point |
| `proc_genererDansCoin(seed, idx, &x, &y, margin)` | In a corner |

### Platform Generation

| Function | Description |
|----------|-------------|
| `proc_genererPlateformes(level, plat, n, diff)` | Generate jumpable platforms |
| `proc_genererPorte(plat, n, &x, &y)` | Place door on last platform |
| `proc_genererSurPlateforme(seed, idx, plat, n, &x, &y, height)` | Position on platform |

### Utilities

| Function | Description |
|----------|-------------|
| `proc_calculerDifficulte(level)` | Returns 1-3 based on level |
| `proc_init(seed)` | Initialize random generator |
| `proc_random(min, max)` | Get random number |

---

## Examples

### Top-View Game (Monster Hunter style)

```cpp
int spawnCounter = 0;

void placerMonstre() {
  spawnCounter++;
  proc_genererLoinDe(niveau * 100 + spawnCounter, 0,
                     &monstreX, &monstreY,
                     joueurX, joueurY, 40, 10);
}

void placerNourriture() {
  spawnCounter++;
  proc_genererPosition(niveau * 100 + spawnCounter, 0,
                       &nourritureX, &nourritureY, 10);
}
```

### Platform Game (Aventurier style)

```cpp
void creerNiveau() {
  if (niveau <= 4) {
    // Hand-crafted from PROGMEM
    pm_charger3Colonnes(niveaux[niveau], plat, 5);
  } else {
    // Procedural for level 5+
    int diff = proc_calculerDifficulte(niveau);
    proc_genererPlateformes(niveau, plat, 5, diff);
    proc_genererPorte(plat, 5, &porteX, &porteY);
  }
}
```

### Spawning on Platforms

```cpp
// Spawn collectible on a platform
int starX, starY;
proc_genererSurPlateforme(niveau, 0, plat, 5, &starX, &starY, 15);
```

---

## Difficulty Levels

```cpp
int diff = proc_calculerDifficulte(niveau);
// Levels 1-3: returns 1 (easy)
// Levels 4-7: returns 2 (medium)
// Levels 8+:  returns 3 (hard)
```

---

## Tips

1. **Use spawn counters** for different positions with same level seed
2. **Adjust for score bar:** `if (y < 12) y = 12;`
3. **Combine with PROGMEM:** Hand-craft early levels, generate later ones
4. **Same seed = replay:** Players can retry the same level
