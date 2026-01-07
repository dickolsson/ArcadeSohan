---
applyTo: "Game/**"
---

# 💾 Memory Management & ProgMem.h

## Overview

Arduino Uno has **very limited memory**. This guide covers constraints and how to use `ProgMem.h` to store data in Flash instead of RAM.

---

## Memory Budget

| Memory | Total | Safe | Danger |
|--------|-------|------|--------|
| **Flash** | 32 KB | < 85% | > 90% |
| **RAM** | 2048 bytes | < 60% | > 65% |

**Hidden RAM usage not shown by compiler:**
- OLED buffer: ~128 bytes
- Stack space: ~200-400 bytes

---

## Memory Rules

### 1. Limit Array Sizes

```cpp
// ❌ TOO MANY
int plat[12][3];
int enemies[10][4];

// ✅ SAFE
int plat[5][3];
int enemies[3][4];
```

### 2. Use Small Types

```cpp
// ❌ Wastes RAM (2 bytes each)
int niveau = 1;
int vies = 3;

// ✅ Saves RAM (1 byte each)
int8_t niveau = 1;
int8_t vies = 3;
```

### 3. Simple Level Transitions

```cpp
// ❌ TOO COMPLEX
void niveauTermine() {
  DESSINER_ECRAN {
    ecrireTexte(10, 0, "BRAVO!", 2);
    ecrireTexte(10, 20, "Niveau termine!", 1);
    ecrireTexte(10, 30, "Score bonus: +100", 1);
  }
  melodieVictoire();
  delay(3000);
}

// ✅ SAFE
void niveauTermine() {
  DESSINER_ECRAN { ecrireTexte(20, 20, "BRAVO!", 2); }
  delay(1500);
  niveau++;
  creerNiveau();
}
```

### 4. One Function for All Levels

```cpp
// ❌ Each function uses stack
void niveau1() { }
void niveau2() { }
void niveau3() { }

// ✅ One function with if/else
void creerNiveau() {
  if (niveau == 1) { /* ... */ }
  else if (niveau == 2) { /* ... */ }
}
```

---

## ProgMem.h - Store in Flash

Store data in Flash (32KB) instead of RAM (2KB).

### Include

```cpp
#include "ProgMem.h"
```

### Define Data

```cpp
// Level layouts (x, y, width per platform)
NIVEAU_PROGMEM(gn_niv1, { 0,56,40, 45,46,30, 80,38,25 });
NIVEAU_PROGMEM(gn_niv2, { 0,56,40, 35,44,25, 70,32,30 });

// Configuration arrays
CONFIG_PROGMEM(gn_vitesse, { 1, 2, 3, 4, 5 });
CONFIG_PROGMEM(gn_bossHP, { 3, 4, 5, 6, 7 });

// Text strings
TEXTE_PROGMEM(gn_txtBravo, "BRAVO!");
TEXTE_PROGMEM(gn_txtGameOver, "GAME OVER");
```

### Read Data

```cpp
// Single config value
int vitesse = pm_lireConfig(gn_vitesse, niveau - 1);

// With default if out of bounds
int hp = pm_lireConfigOuDefaut(gn_bossHP, niveau - 1, 5, 10);
//                             array      index     size default

// Load array to RAM
int gn_plat[3][3];
pm_charger3Colonnes(gn_niv1, gn_plat, 3);

// Read text
ecrireTexte(20, 20, pm_lireTexte(gn_txtBravo), 2);
```

---

## ProgMem.h Quick Reference

### Macros for Defining Data

| Macro | Purpose |
|-------|---------|
| `CONFIG_PROGMEM(name, {...})` | Byte array (0-255) |
| `NIVEAU_PROGMEM(name, {...})` | Level layout data |
| `TEXTE_PROGMEM(name, "text")` | Text string |

### Functions for Reading

| Function | Purpose |
|----------|---------|
| `pm_lireConfig(arr, idx)` | Read byte at index |
| `pm_lireConfigOuDefaut(arr, idx, size, def)` | Read with fallback |
| `pm_charger2Colonnes(src, dest, n)` | Load [n][2] array |
| `pm_charger3Colonnes(src, dest, n)` | Load [n][3] array |
| `pm_charger4Colonnes(src, dest, n)` | Load [n][4] array |
| `pm_chargerPaire(src, &a, &b)` | Load two values |
| `pm_lireTexte(txt)` | Read text to buffer |

---

## Complete Pattern

```cpp
#include "ProgMem.h"

// === FLASH DATA ===
NIVEAU_PROGMEM(gn_niv1, { 0,56,40, 45,46,30, 80,38,25 });
NIVEAU_PROGMEM(gn_niv2, { 0,56,40, 35,44,25, 70,32,30 });
TEXTE_PROGMEM(gn_txtBravo, "BRAVO!");

// === RAM (only active data) ===
int gn_plat[3][3];
int8_t gn_niveau = 1;

// === LOAD FROM FLASH ===
void gn_creerNiveau() {
  if (gn_niveau == 1) pm_charger3Colonnes(gn_niv1, gn_plat, 3);
  else if (gn_niveau == 2) pm_charger3Colonnes(gn_niv2, gn_plat, 3);
}

void gn_afficherVictoire() {
  DESSINER_ECRAN { ecrireTexte(20, 20, pm_lireTexte(gn_txtBravo), 2); }
  delay(1500);
}
```

---

## Debugging Crashes

When screen goes black = crash (usually out of memory).

### Test Incrementally

| Step | Test | Validates |
|------|------|-----------|
| 1 | Disable new game | Menu works? |
| 2 | Add to menu only | Globals OK? |
| 3 | Simple loop only | Setup OK? |
| 4 | Add drawing | Drawing OK? |
| 5 | Add controls | Logic OK? |
| 6 | Add transitions | **Usually crashes here** |

### Common Causes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Crash on level change | Too much RAM in transition | Simplify message |
| Crash after few levels | Arrays too large | Reduce object count |
| Random crashes | Stack overflow | Fewer nested functions |
