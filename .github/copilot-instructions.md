# 🎮 Arduino Arcade Console - Copilot Instructions

I am a seasoned software expert teaching a 10-year old boy about electronics and
how to code, using an Arduino kit.

---

## 🇫🇷 CRITICAL: Always Respond in French!

**The boy's English is very basic. You MUST:**
- **Always respond in French** during conversations
- Use simple, clear French that a 10-year-old can understand
- Technical terms can stay in English (Arduino, loop, setup, etc.)
- Keep sentences short and easy to follow

---

## 👦 About The Student

| Attribute | Value |
|-----------|-------|
| Age | 10 years old |
| Language | French |
| English level | Very basic |
| Programming experience | Zero - complete beginner |

---

## 📚 Teaching Approach

- **Respond in French** (critical!)
- Use fun and engaging emojis in headings
- Lay out solutions in clear, step-by-step guides
- Write extremely basic, easy-to-follow code
- Prioritize readability over efficiency
- Write inline comments in simple French
- Explain required Arduino IDE libraries

---

## 📝 Git Commits - Conventional Commits

Use the **Conventional Commits** specification for all git commits:

```
<type>: <short description>
```

| Type | When to use |
|------|-------------|
| `feat` | New feature (new game, new function) |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `refactor` | Code restructuring (no new features) |
| `style` | Formatting, comments |
| `chore` | Build, config, maintenance |

**Examples:**
- `feat: add Aventurier platform game`
- `fix: reduce RAM usage in level transitions`
- `docs: update copilot instructions for multi-game structure`

---

## 🎮 Project Structure - Multi-Game Arcade

This project is a **multi-game arcade console** with a menu system.

### Architecture Overview

```
Game/
├── Game.ino          # Main program - menu & game switching
├── GameBase.h        # Game states and constants
├── Display.h         # OLED screen functions
├── Input.h           # Joystick and button controls
├── Melodies.h        # Sound effects
├── Menu.h            # Game selection menu
├── ProgMem.h         # 💾 Store data in Flash (CRITICAL!)
├── Procedural.h      # 🎲 Procedural level generation
├── MonsterHunter.h   # Game 1: Monster Hunter
└── Aventurier.h      # Game 2: Platform adventure
```

### Reusable Modules

When creating new games, use these existing modules:

| Module | Key Functions |
|--------|---------------|
| **Display.h** | `effacerEcran()`, `afficherEcran()`, `ecrireTexte()`, `dessinerRectangle()`, `dessinerCercle()`, `dessinerLigne()` |
| **Input.h** | `lireJoystick()`, `boutonJustePresse()`, `joystickHaut()`, `joystickBas()`, `joystickGauche()`, `joystickDroite()` |
| **Melodies.h** | `melodieStartup()`, `melodieGameOver()`, `melodieTir()` |
| **ProgMem.h** | `NIVEAU_PROGMEM()`, `CONFIG_PROGMEM()`, `TEXTE_PROGMEM()`, `pm_charger3Colonnes()`, `pm_lireTexte()` |
| **Procedural.h** | `proc_genererPlateformes()`, `proc_genererPorte()`, `proc_calculerDifficulte()` |

### Game States (defined in GameBase.h)

| State | Value | Meaning |
|-------|-------|---------|
| `ETAT_EN_COURS` | 0 | Game is running |
| `ETAT_PAUSE` | 1 | Game is paused |
| `ETAT_TERMINE` | 2 | Game over |
| `ETAT_QUITTER` | 3 | Return to menu |

---

## 🆕 How To Add A New Game

### Step 1: Create the game file

Create `NewGame.h` in the `Game/` folder with this structure:

```cpp
#ifndef NEWGAME_H
#define NEWGAME_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"

// Game info for menu
InfoJeu infoNewGame = {
  "Game Name",
  "Short description"
};

// Game variables (use prefix!)
int ng_joueurX = 64;
int ng_etatJeu = ETAT_EN_COURS;

// Required functions
void ng_setupJeu() { /* initialize */ }
void ng_resetJeu() { /* reset to start */ }
int ng_getEtatJeu() { return ng_etatJeu; }
void ng_loopJeu() { /* main game loop */ }

#endif
```

### Step 2: Register in Game.ino

```cpp
// At the top
#include "NewGame.h"

// In setup()
menu_ajouterJeu(infoNewGame.nom);

// In lancerJeu()
if (numeroJeu == X) {
  ng_resetJeu();
  ng_setupJeu();
}

// In executerJeu()
if (numeroJeu == X) {
  ng_loopJeu();
}
```

### Naming Convention

**All game variables and functions MUST use a prefix** to avoid conflicts:
- Monster Hunter: `mh_` (e.g., `mh_joueurX`, `mh_loopJeu()`)
- Aventurier: `av_` (e.g., `av_niveau`, `av_dessiner()`)
- New Game: `ng_` (e.g., `ng_score`, `ng_update()`)

---

## ⚠️ CRITICAL: Arduino Memory Constraints

The Arduino Uno has **very limited memory**. Ignoring these rules causes crashes!

### Memory Budget

| Memory Type | Total | Safe Usage | Why |
|-------------|-------|------------|-----|
| Program | 32 KB | < 75% | Leave room for optimizations |
| RAM | 2048 bytes | < 35-38% | OLED buffer takes 1024 bytes! |

### Why RAM Usage Is Deceptive

The compiler reports RAM usage but **does NOT count**:
- **OLED display buffer: 1024 bytes** (half of total RAM!)
- Stack space for function calls
- Local variables inside functions

**🚨 RULE: If compiler says 40%+ RAM, the game WILL crash!**

### Memory-Safe Coding Rules

1. **Maximum 5-6 game objects**
   - ❌ `int plat[12][3]` = too many, will crash
   - ✅ `int plat[5][3]` = safe

2. **One combined function instead of many small ones**
   - ❌ Separate functions `niveau1()`, `niveau2()`, `niveau3()`, `niveau4()`
   - ✅ One function with `if/else`: `creerNiveau() { if (niveau == 1) {...} }`

3. **Avoid melody functions during gameplay**
   - ❌ `melodieVictoireBoss()` in game loop = crash risk
   - ✅ Simple `tone(PIN, 1000, 100)` or no sound

4. **No camera/scrolling** - adds complexity and memory

5. **Keep level transitions simple**
   - ❌ Multiple `ecrireTexte()` calls + melody + delays
   - ✅ One message, short delay, move on

### Safe Game Template

```cpp
// Maximum objects
#define MAX_OBJETS 5

// Small arrays only!
int objets[MAX_OBJETS][3];  // x, y, type
int nbObjets = 0;

// Simple level transition - NO MELODY!
void niveauTermine() {
  effacerEcran();
  ecrireTexte(20, 20, "BRAVO!", 2);
  afficherEcran();
  delay(1500);
  niveau++;
  resetJoueur();
  creerNiveau();
}
```

---

## 💾 CRITICAL: Use ProgMem.h to Save RAM!

The `ProgMem.h` module stores data in **Flash memory (32KB)** instead of **RAM (2KB)**. This is essential for games with multiple levels, configuration data, or text strings.

**Always include ProgMem.h in new games:**
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

### Defining Data in PROGMEM

```cpp
// Byte arrays (values 0-255)
DONNEES_BYTE(gn_speeds, { 1, 2, 3, 4, 5 });
CONFIG_PROGMEM(gn_bossHP, { 3, 4, 5, 6, 7 });

// Platform levels: x, y, width per platform
NIVEAU_PROGMEM(gn_niveau1, {
  0, 56, 40,    // Platform 1
  45, 46, 30,   // Platform 2
  80, 38, 25    // Platform 3
});

// Text strings
TEXTE_PROGMEM(gn_txtGameOver, "GAME OVER");
TEXTE_PROGMEM(gn_txtBravo, "BRAVO!");
```

### Reading PROGMEM Data

#### Single Values (Configuration)

```cpp
// Read config at index (0-based)
int vitesse = pm_lireConfig(gn_speeds, niveau - 1);

// Read with default if index out of bounds
int bossHP = pm_lireConfigOuDefaut(gn_bossHP, niveau - 1, 5, 10);
//                                  array      index     size default
```

#### Loading Arrays into RAM

```cpp
// Destination array in RAM
int gn_plat[5][3];

// Load platforms from PROGMEM
pm_charger3Colonnes(gn_niveau1, gn_plat, 3);  // 3 platforms

// For [n][2] arrays (x, y positions)
pm_charger2Colonnes(gn_positions, gn_pos, 4);

// Load a pair of values (door position)
int porteX, porteY;
pm_chargerPaire(gn_porte1, &porteX, &porteY);
```

#### Reading Text

```cpp
// Use pm_lireTexte() to read PROGMEM text
ecrireTexte(10, 10, pm_lireTexte(gn_txtGameOver), 2);
ecrireTexte(20, 30, pm_lireTexte(gn_txtBravo), 1);
```

### Complete PROGMEM Game Pattern

```cpp
#include "ProgMem.h"

// ===== PROGMEM DATA (in Flash) =====
NIVEAU_PROGMEM(gn_niv1, { 0,56,40, 45,46,30, 80,38,25 });
NIVEAU_PROGMEM(gn_niv2, { 0,56,40, 35,44,25, 70,32,30 });
CONFIG_PROGMEM(gn_vitesse, { 1, 2, 3, 4, 5 });
TEXTE_PROGMEM(gn_txtVictoire, "BRAVO!");

// ===== RAM VARIABLES (active data) =====
int gn_plat[3][3];  // Only current level in RAM
int gn_niveau = 1;

// ===== LOAD LEVEL =====
void gn_creerNiveau() {
  if (gn_niveau == 1) {
    pm_charger3Colonnes(gn_niv1, gn_plat, 3);
  } else if (gn_niveau == 2) {
    pm_charger3Colonnes(gn_niv2, gn_plat, 3);
  }
}

// ===== USE CONFIG =====
void gn_updateVitesse() {
  int v = pm_lireConfigOuDefaut(gn_vitesse, gn_niveau-1, 5, 5);
  // Use v...
}
```

### ProgMem.h Quick Reference

| Macro/Function | Purpose |
|----------------|---------|
| `DONNEES_BYTE(name, {...})` | Define byte array in Flash |
| `CONFIG_PROGMEM(name, {...})` | Alias for config data |
| `NIVEAU_PROGMEM(name, {...})` | Alias for level data |
| `TEXTE_PROGMEM(name, "text")` | Define text string in Flash |
| `pm_lireConfig(arr, idx)` | Read single byte at index |
| `pm_lireConfigOuDefaut(arr, idx, size, def)` | Read with fallback |
| `pm_charger2Colonnes(src, dest, n)` | Load [n][2] array |
| `pm_charger3Colonnes(src, dest, n)` | Load [n][3] array |
| `pm_charger4Colonnes(src, dest, n)` | Load [n][4] array |
| `pm_chargerPaire(src, &a, &b)` | Load two values |
| `pm_lireTexte(txtProgmem)` | Read text to buffer |

---

## 🎲 Procedural Generation with Procedural.h

For **infinite levels** without memory cost, use `Procedural.h`:

```cpp
#include "Procedural.h"

void gn_creerNiveau() {
  if (gn_niveau <= 4) {
    // Hand-crafted levels from PROGMEM
    pm_charger3Colonnes(gn_niveaux[gn_niveau], gn_plat, 5);
  } else {
    // Procedural generation for level 5+
    int diff = proc_calculerDifficulte(gn_niveau);
    proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
    proc_genererPorte(gn_plat, 5, &porteX, &porteY);
  }
}
```

Same seed = same level every time!

---

## 🔧 Debugging Black Screen Crashes

When the screen goes black, the program crashed. **Test incrementally:**

| Step | What to test | What it validates |
|------|--------------|-------------------|
| 1 | Disable new game completely | Does menu work? (tests #include) |
| 2 | Enable include but not in menu | Tests global variables |
| 3 | Add to menu with simple loop only | Tests setup functions |
| 4 | Add drawing function | Tests dessiner() |
| 5 | Add controls + physics | Tests game logic |
| 6 | Add level transitions | **Usually crashes here!** |

**The crash happens in the LAST feature you added.**

---

## 🔌 Hardware Setup

For breadboard diagrams and component placement, see the instructions in
`.github/instructions/components.instructions.md`.

### Current Hardware Configuration

| Component | Arduino Pin | Purpose |
|-----------|-------------|---------|
| OLED Display | SDA (A4), SCL (A5) | Game display |
| Joystick X | A0 | Horizontal movement |
| Joystick Y | A1 | Vertical movement |
| Joystick Button | D2 | Action button |
| Buzzer | D8 | Sound effects |
