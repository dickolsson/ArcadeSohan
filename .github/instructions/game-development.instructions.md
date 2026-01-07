---
applyTo: "Game/**"
---

# 🎮 Game Development Instructions

These instructions apply specifically to game files in the `Game/` folder.

## File Naming

- All game files are `.h` header files (not `.cpp`)
- Use descriptive French or English names: `MonsterHunter.h`, `Aventurier.h`

## Required Structure for Every Game

Every game file MUST have:

```cpp
#ifndef GAMENAME_H
#define GAMENAME_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Melodies.h"

// 1. Game Info (for menu)
InfoJeu infoGameName = {
  "Display Name",
  "Short description"
};

// 2. Game Variables (ALL with prefix!)
int gn_variable1 = 0;
int gn_etatJeu = ETAT_EN_COURS;

// 3. Required Functions
void gn_setupJeu() { }    // Called once when game starts
void gn_resetJeu() { }    // Reset all variables to initial state
int gn_getEtatJeu() { }   // Return current game state
void gn_loopJeu() { }     // Called every frame

#endif
```

## Variable Naming Rules

**CRITICAL: Use a 2-3 letter prefix for EVERYTHING!**

| Game | Prefix | Example Variables |
|------|--------|-------------------|
| Monster Hunter | `mh_` | `mh_joueurX`, `mh_score`, `mh_loopJeu()` |
| Aventurier | `av_` | `av_niveau`, `av_vitesseY`, `av_dessiner()` |

Why? Without prefixes, variables from different games will conflict and cause bugs!

## Memory Rules for Games

### Array Size Limits

| Object Type | Maximum Count | Why |
|-------------|---------------|-----|
| Platforms | 5-6 | More causes RAM overflow |
| Enemies | 3-4 | Each uses ~6 bytes |
| Projectiles | 2-3 | Keep minimal |

### ❌ DO NOT:
- Create arrays larger than 6 elements
- Use separate functions for each level (`niveau1()`, `niveau2()`, etc.)
- Call melody functions during gameplay
- Use `String` objects (use `const char*` instead)
- Create deep function call chains

### ✅ DO:
- Use one combined function with `if/else` for levels
- Keep transitions simple (one message, short delay)
- Reset variables in `resetJeu()` before `setupJeu()` runs
- Use `PROGMEM` for large constant data if needed

## Level System Pattern

Use this pattern for games with multiple levels:

```cpp
int niveau = 1;

void creerNiveau() {
  // Always reset count first
  nbObjets = 0;
  
  // Base objects (always present)
  objets[0][0] = 0; objets[0][1] = 56; nbObjets++;
  
  // Level-specific objects
  if (niveau == 1) {
    objets[1][0] = 45; objets[1][1] = 40; nbObjets++;
    // ... more objects for level 1
  }
  else if (niveau == 2) {
    objets[1][0] = 30; objets[1][1] = 35; nbObjets++;
    // ... more objects for level 2
  }
  // etc.
}

void niveauTermine() {
  // Simple message only!
  effacerEcran();
  ecrireTexte(20, 20, "BRAVO!", 2);
  afficherEcran();
  delay(1500);
  
  // Next level
  niveau++;
  if (niveau > 4) niveau = 1;  // Loop back
  
  // Reset player
  joueurX = startX;
  joueurY = startY;
  creerNiveau();
}
```

## Game Loop Pattern

Standard game loop structure:

```cpp
void gn_loopJeu() {
  // 1. Read input
  gn_controles();
  
  // 2. Update physics/logic
  gn_physique();
  
  // 3. Check win/lose conditions
  if (gn_conditionVictoire()) {
    gn_niveauTermine();
    return;  // Skip drawing this frame
  }
  
  // 4. Draw everything
  gn_dessiner();
  
  // 5. Frame delay
  delay(30);  // ~33 FPS
}
```

## Display Functions Available

From `Display.h`:

| Function | Purpose |
|----------|---------|
| `effacerEcran()` | Clear screen buffer |
| `afficherEcran()` | Show buffer on OLED |
| `ecrireTexte(x, y, "text", size)` | Draw text (size 1-3) |
| `ecrireTexteNombre(x, y, "text", num, size)` | Text + number |
| `dessinerRectangle(x, y, w, h)` | Filled rectangle |
| `dessinerContour(x, y, w, h)` | Rectangle outline |
| `dessinerCercle(x, y, radius)` | Filled circle |
| `dessinerLigne(x1, y1, x2, y2)` | Line |
| `dessinerPixel(x, y)` | Single pixel |

Screen size: **128 x 64 pixels**

## Input Functions Available

From `Input.h`:

| Function | Returns | Purpose |
|----------|---------|---------|
| `lireJoystick()` | void | Update joystick state (call first!) |
| `joystickHaut()` | bool | Joystick pushed up |
| `joystickBas()` | bool | Joystick pushed down |
| `joystickGauche()` | bool | Joystick pushed left |
| `joystickDroite()` | bool | Joystick pushed right |
| `boutonJustePresse()` | bool | Button just pressed (edge detection) |

## Comments Style

Write comments in simple French with English translation:

```cpp
// Gravité du joueur (Player gravity)
int gravite = 1;

// Vérifier collision (Check collision)
if (touchePlateforme()) {
  // Le joueur est sur le sol (Player is on ground)
  auSol = true;
}
```

## PROGMEM - Store Data in Flash Memory

For games with multiple levels, use `ProgMem.h` to store level data in Flash (32KB) instead of RAM (2KB). This can save ~100 bytes of RAM!

### Include the module

```cpp
#include "ProgMem.h"
```

### Define levels in PROGMEM

```cpp
// Format: x, y, width for each platform
NIVEAU_PROGMEM(gn_niveau1_plat, {
  0, 56, 40,    // Platform 1
  45, 46, 30,   // Platform 2
  80, 38, 30    // Platform 3
});

// Door/objective position
const uint8_t gn_niveau1_porte[] PROGMEM = { 110, 15 };
```

### Load into RAM when needed

```cpp
void gn_creerNiveau() {
  if (niveau == 1) {
    pm_chargerNiveau(gn_niveau1_plat, gn_plat, 3);  // 3 platforms
    pm_chargerPorte(gn_niveau1_porte, &porteX, &porteY);
  }
}
```

### Available PROGMEM functions

| Function | Purpose |
|----------|---------|
| `NIVEAU_PROGMEM(name, {...})` | Define level data in Flash |
| `pm_chargerNiveau(src, dest, n)` | Load n platforms to RAM array |
| `pm_chargerPorte(src, &x, &y)` | Load door position |
| `TEXTE_PROGMEM(name, "text")` | Store text in Flash |
| `pm_lireTexte(textProgmem)` | Read text to temp buffer |

## Procedural Generation - Infinite Levels

For games with unlimited levels, use `Procedural.h` to generate levels from a seed. Same seed = same level!

### Include the module

```cpp
#include "Procedural.h"
```

### Generate platforms automatically

```cpp
void gn_creerNiveau() {
  // Calculate difficulty (1=easy, 2=medium, 3=hard)
  int diff = proc_calculerDifficulte(gn_niveau);
  
  // Generate 5 platforms
  proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
  
  // Place door on last platform
  proc_genererPorte(gn_plat, 5, &gn_porteX, &gn_porteY);
}
```

### Available procedural functions

| Function | Purpose |
|----------|---------|
| `proc_init(seed)` | Initialize random generator |
| `proc_random(min, max)` | Get random number in range |
| `proc_genererPlateformes(level, dest, n, diff)` | Generate n playable platforms |
| `proc_genererPorte(plat, n, &x, &y)` | Place door on last platform |
| `proc_genererEnnemis(level, plat, n, dest, count)` | Generate enemies on platforms |
| `proc_genererCollectibles(level, plat, n, dest, count)` | Generate collectible items |
| `proc_calculerDifficulte(level)` | Returns 1-3 based on level number |

### Combining PROGMEM + Procedural

Best practice: hand-craft early levels, generate later ones:

```cpp
void gn_creerNiveau() {
  if (gn_niveau <= 4) {
    // Levels 1-4: hand-crafted from PROGMEM
    pm_chargerNiveau(gn_niveauData[gn_niveau], gn_plat, 5);
  } else {
    // Levels 5+: procedurally generated
    int diff = proc_calculerDifficulte(gn_niveau);
    proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
  }
}
```
