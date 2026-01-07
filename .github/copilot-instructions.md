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
| **Display.h** | `DESSINER_ECRAN`, `ecrireTexte()`, `dessinerRectangle()`, `dessinerCercle()`, `dessinerLigne()` - See `.github/instructions/display.instructions.md` |
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

**See `.github/instructions/memory.instructions.md` for full details!**

The Arduino Uno has **very limited memory**:

| Memory Type | Total | Safe Usage |
|-------------|-------|------------|
| Program (Flash) | 32 KB | < 85% |
| RAM | 2048 bytes | < 60% |

### Key Rules

1. **Maximum 5-6 game objects** - `int plat[5][3]` not `int plat[12][3]`
2. **Use ProgMem.h** for level data, config, and text strings
3. **Keep level transitions simple** - one message, short delay
4. **Use `int8_t`** for small values (niveau, vies, direction)

### Safe Game Template

```cpp
#define MAX_OBJETS 5
int objets[MAX_OBJETS][3];

void niveauTermine() {
  DESSINER_ECRAN {
    ecrireTexte(20, 20, "BRAVO!", 2);
  }
  delay(1500);
  niveau++;
  creerNiveau();
}
```

---

## 💾 ProgMem.h - Store Data in Flash

**See `.github/instructions/memory.instructions.md` for full API reference!**

Store level data and text in Flash (32KB) instead of RAM (2KB):

```cpp
#include "ProgMem.h"

// Define in PROGMEM (Flash)
NIVEAU_PROGMEM(gn_niv1, { 0,56,40, 45,46,30, 80,38,25 });
CONFIG_PROGMEM(gn_vitesse, { 1, 2, 3, 4, 5 });
TEXTE_PROGMEM(gn_txtBravo, "BRAVO!");

// RAM: only current level
int gn_plat[3][3];

// Load from PROGMEM when needed
void gn_creerNiveau() {
  pm_charger3Colonnes(gn_niv1, gn_plat, 3);
}

// Read text
ecrireTexte(10, 10, pm_lireTexte(gn_txtBravo), 2);
```

---

## 🎲 Procedural Generation with Procedural.h

For **infinite levels** without memory cost - see `.github/instructions/memory.instructions.md` for details.

```cpp
#include "Procedural.h"

void gn_creerNiveau() {
  if (gn_niveau <= 3) {
    pm_charger3Colonnes(gn_niveaux[gn_niveau], gn_plat, 5);
  } else {
    // Procedural for level 4+
    int diff = proc_calculerDifficulte(gn_niveau);
    proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
    proc_genererPorte(gn_plat, 5, &porteX, &porteY);
  }
}
```

---

## 🔧 Debugging Black Screen Crashes

**See `.github/instructions/memory.instructions.md` for full debugging guide!**

When the screen goes black, the program crashed. Test incrementally:

1. Disable new game → Does menu work?
2. Add to menu with simple loop → Setup OK?
3. Add drawing → Drawing OK?
4. Add controls + physics → Logic OK?
5. Add level transitions → **Usually crashes here!**

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
