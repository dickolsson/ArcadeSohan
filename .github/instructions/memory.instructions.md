---
applyTo: "Game/**"
---

# 💾 Memory Management Instructions

Arduino Uno has **very limited memory**. This guide covers constraints and how to use `ProgMem.h` to save RAM.

---

## ⚠️ CRITICAL: Memory Budget

| Memory Type | Total | Safe Usage | Why |
|-------------|-------|------------|-----|
| **Program (Flash)** | 32 KB | < 85% | Leave room for new features |
| **RAM** | 2048 bytes | < 60% | Display buffer + stack + locals |

### Why Compiler RAM % Is Misleading

The compiler reports RAM usage but **does NOT count**:
- OLED display buffer: **128 bytes** (U8g2 page mode)
- Stack space for function calls: **~200-400 bytes**
- Local variables inside functions

**🚨 RULE: If compiler says 65%+ RAM, the game MAY crash!**

---

## 📏 Memory-Safe Coding Rules

### 1. Maximum 5-6 Game Objects

```cpp
// ❌ TOO MANY - will crash
int plat[12][3];
int enemies[10][4];

// ✅ SAFE
int plat[5][3];
int enemies[3][4];
```

### 2. One Combined Function Instead of Many

```cpp
// ❌ BAD - Each function uses stack space
void niveau1() { /* setup level 1 */ }
void niveau2() { /* setup level 2 */ }
void niveau3() { /* setup level 3 */ }

// ✅ GOOD - One function with if/else
void creerNiveau() {
  if (niveau == 1) {
    // setup level 1
  } else if (niveau == 2) {
    // setup level 2
  }
  // etc.
}
```

### 3. Avoid Melody Functions During Gameplay

```cpp
// ❌ RISKY - melody functions use RAM for note arrays
melodieVictoireBoss();

// ✅ SAFE - simple tone
tone(PIN_BUZZER, 1000, 100);
```

### 4. Keep Level Transitions Simple

```cpp
// ❌ TOO COMPLEX
void niveauTermine() {
  DESSINER_ECRAN {
    ecrireTexte(10, 0, "BRAVO!", 2);
    ecrireTexte(10, 20, "Niveau termine!", 1);
    ecrireTexte(10, 30, "Score bonus: +100", 1);
    ecrireTexte(10, 40, "Pret pour le prochain?", 1);
  }
  melodieVictoire();
  delay(3000);
}

// ✅ SIMPLE AND SAFE
void niveauTermine() {
  DESSINER_ECRAN {
    ecrireTexte(20, 20, "BRAVO!", 2);
  }
  delay(1500);
  niveau++;
  creerNiveau();
}
```

### 5. Use `int8_t` or `byte` for Small Values

```cpp
// ❌ Wastes RAM - int is 2 bytes each
int niveau = 1;
int vies = 3;
int direction = 0;

// ✅ Saves RAM - 1 byte each
int8_t niveau = 1;
int8_t vies = 3;
int8_t direction = 0;
```

---

## 💾 ProgMem.h - Store Data in Flash

The `ProgMem.h` module stores data in **Flash memory (32KB)** instead of **RAM (2KB)**. Essential for games with multiple levels!

```cpp
#include "ProgMem.h"
```

### When to Use PROGMEM

| Data Type | Use PROGMEM? | RAM Saved |
|-----------|--------------|-----------|
| Level layouts (platforms, enemies) | ✅ YES | ~15-20 bytes per level |
| Per-level configuration (speed, HP) | ✅ YES | ~10-30 bytes |
| Text strings (messages, titles) | ✅ YES | ~10 bytes per string |
| Player position, score | ❌ NO | Changes during gameplay |
| Current level data (active copy) | ❌ NO | Needs to be in RAM |

---

## 📝 Defining Data in PROGMEM

### Configuration Arrays (byte values 0-255)

```cpp
// Enemy speeds per level
CONFIG_PROGMEM(gn_vitesses, { 1, 2, 3, 4, 5 });

// Boss HP per level
CONFIG_PROGMEM(gn_bossHP, { 3, 4, 5, 6, 7 });

// Alias - same as CONFIG_PROGMEM
DONNEES_BYTE(gn_scores, { 10, 20, 30, 40, 50 });
```

### Level Data (x, y, width, etc.)

```cpp
// Platform levels: x, y, width per platform
NIVEAU_PROGMEM(gn_niveau1, {
  0, 56, 40,    // Platform 1: x=0, y=56, width=40
  45, 46, 30,   // Platform 2
  80, 38, 25    // Platform 3
});

NIVEAU_PROGMEM(gn_niveau2, {
  0, 56, 40,
  35, 44, 25,
  70, 32, 30
});
```

### Text Strings

```cpp
TEXTE_PROGMEM(gn_txtGameOver, "GAME OVER");
TEXTE_PROGMEM(gn_txtBravo, "BRAVO!");
TEXTE_PROGMEM(gn_txtNiveau, "Niveau ");
```

---

## 📖 Reading PROGMEM Data

### Single Configuration Values

```cpp
// Read config at index (0-based)
int vitesse = pm_lireConfig(gn_vitesses, niveau - 1);

// Read with default if index out of bounds
int bossHP = pm_lireConfigOuDefaut(gn_bossHP, niveau - 1, 5, 10);
//                                  array      index     size default
```

### Loading Arrays into RAM

```cpp
// Destination array in RAM (only current level!)
int gn_plat[5][3];

// Load platforms from PROGMEM
pm_charger3Colonnes(gn_niveau1, gn_plat, 3);  // 3 platforms

// For [n][2] arrays (x, y positions)
int gn_pos[4][2];
pm_charger2Colonnes(gn_positions, gn_pos, 4);

// For [n][4] arrays (x, y, width, height)
int gn_rects[3][4];
pm_charger4Colonnes(gn_rectangles, gn_rects, 3);

// Load a pair of values (door position)
int porteX, porteY;
pm_chargerPaire(gn_porte1, &porteX, &porteY);
```

### Reading Text Strings

```cpp
// pm_lireTexte() copies PROGMEM text to internal buffer
ecrireTexte(10, 10, pm_lireTexte(gn_txtGameOver), 2);
ecrireTexte(20, 30, pm_lireTexte(gn_txtBravo), 1);

// Can use in DESSINER_ECRAN
DESSINER_ECRAN {
  ecrireTexte(10, 0, pm_lireTexte(gn_txtGameOver), 2);
}
```

---

## 🎮 Complete PROGMEM Game Pattern

```cpp
#include "ProgMem.h"

// ===== PROGMEM DATA (stored in Flash) =====
NIVEAU_PROGMEM(gn_niv1, { 0,56,40, 45,46,30, 80,38,25 });
NIVEAU_PROGMEM(gn_niv2, { 0,56,40, 35,44,25, 70,32,30 });
NIVEAU_PROGMEM(gn_niv3, { 10,50,30, 50,40,25, 90,30,20 });

CONFIG_PROGMEM(gn_vitesse, { 1, 2, 3, 4, 5 });
CONFIG_PROGMEM(gn_ennemis, { 1, 2, 2, 3, 3 });

TEXTE_PROGMEM(gn_txtVictoire, "BRAVO!");
TEXTE_PROGMEM(gn_txtDefaite, "PERDU!");

// ===== RAM VARIABLES (only active data) =====
int gn_plat[3][3];     // Current level platforms only
int8_t gn_niveau = 1;
int gn_score = 0;

// ===== LOAD LEVEL FROM PROGMEM =====
void gn_creerNiveau() {
  if (gn_niveau == 1) {
    pm_charger3Colonnes(gn_niv1, gn_plat, 3);
  } else if (gn_niveau == 2) {
    pm_charger3Colonnes(gn_niv2, gn_plat, 3);
  } else if (gn_niveau == 3) {
    pm_charger3Colonnes(gn_niv3, gn_plat, 3);
  }
}

// ===== USE CONFIG FROM PROGMEM =====
void gn_updateVitesse() {
  int v = pm_lireConfigOuDefaut(gn_vitesse, gn_niveau - 1, 5, 3);
  // Use v for enemy speed...
}

// ===== DISPLAY TEXT FROM PROGMEM =====
void gn_afficherVictoire() {
  DESSINER_ECRAN {
    ecrireTexte(20, 20, pm_lireTexte(gn_txtVictoire), 2);
  }
  delay(1500);
}
```

---

## 📋 ProgMem.h Quick Reference

### Defining Data

| Macro | Purpose | Example |
|-------|---------|---------|
| `CONFIG_PROGMEM(name, {...})` | Byte array for config | `CONFIG_PROGMEM(speeds, {1,2,3})` |
| `DONNEES_BYTE(name, {...})` | Alias for CONFIG_PROGMEM | Same as above |
| `NIVEAU_PROGMEM(name, {...})` | Level layout data | `NIVEAU_PROGMEM(lv1, {0,56,40})` |
| `TEXTE_PROGMEM(name, "text")` | Text string | `TEXTE_PROGMEM(txt, "BRAVO!")` |

### Reading Data

| Function | Purpose | Returns |
|----------|---------|---------|
| `pm_lireConfig(arr, idx)` | Read byte at index | `byte` |
| `pm_lireConfigOuDefaut(arr, idx, size, def)` | Read with fallback | `byte` |
| `pm_charger2Colonnes(src, dest, n)` | Load [n][2] array | void |
| `pm_charger3Colonnes(src, dest, n)` | Load [n][3] array | void |
| `pm_charger4Colonnes(src, dest, n)` | Load [n][4] array | void |
| `pm_chargerPaire(src, &a, &b)` | Load two values | void |
| `pm_lireTexte(txtProgmem)` | Read text to buffer | `char*` |

---

## 🎲 Procedural Generation (Infinite Levels)

For levels beyond hand-crafted ones, use `Procedural.h`:

```cpp
#include "Procedural.h"

void gn_creerNiveau() {
  if (gn_niveau <= 3) {
    // Hand-crafted levels from PROGMEM
    // ...load from PROGMEM...
  } else {
    // Procedural generation for level 4+
    int diff = proc_calculerDifficulte(gn_niveau);
    proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
    proc_genererPorte(gn_plat, 5, &porteX, &porteY);
  }
}
```

**Benefit:** Same seed = same level every time! No memory cost for infinite levels.

---

## 🔧 Debugging Memory Crashes

When the screen goes black, the program crashed (usually out of memory).

### Test Incrementally

| Step | What to Test | What It Validates |
|------|--------------|-------------------|
| 1 | Disable new game completely | Menu works? (tests #include) |
| 2 | Enable include but not in menu | Global variables OK? |
| 3 | Add to menu with simple loop only | Setup functions OK? |
| 4 | Add drawing function | Drawing OK? |
| 5 | Add controls + physics | Game logic OK? |
| 6 | Add level transitions | **Usually crashes here!** |

### Common Crash Causes

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Crash on level change | Too much RAM in transition | Simplify message |
| Crash after few levels | Arrays too large | Reduce object count |
| Random crashes | Stack overflow | Fewer nested functions |
| Crash on game start | Too many globals | Use PROGMEM |

### Quick Memory Check

Before adding features, note the RAM usage:
```
Global variables use XXX bytes (YY%) of dynamic memory
```

If YY% > 60%, optimize before adding more!
