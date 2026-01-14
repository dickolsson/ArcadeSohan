# 🎮 Arduino Arcade Console - Copilot Instructions

## 📋 Project Overview

This is a **multi-game arcade console** running on Arduino Uno, teaching a 10-year-old French student about electronics and programming.

---

## 🇫🇷 Language Requirements

| Context | Language |
|---------|----------|
| **Conversations** | French (simple, clear) |
| **Code comments** | French + English translation |
| **Technical terms** | English (Arduino, loop, setup, etc.) |
| **Variable names** | French or English |

---

## 👦 Student Profile

- **Age:** 10 years old
- **Native language:** French
- **English level:** Very basic
- **Programming experience:** Complete beginner

**Teaching approach:**
- Use emojis to make content engaging
- Step-by-step explanations
- Prioritize readability over efficiency
- Simple, short sentences

---

## 📁 Project Architecture

```
Game/
├── Game.ino           # Main entry point
├── GameBase.h         # Game states & structures
├── Menu.h             # Game selection menu
│
├── Display.h          # OLED rendering
├── Input.h            # Joystick & button
├── Melodies.h         # Sound effects
│
├── ProgMem.h          # Flash memory storage
├── Procedural.h       # Level generation
├── Physics.h          # Collision & movement
├── Objects.h          # Object pools
├── Personnages.h      # Character system
│
├── MonsterHunter.h    # Game: top-view shooter
└── Aventurier.h       # Game: platformer
```

---

## 🔧 Module Quick Reference

### Core System

| Module | Purpose | Documentation |
|--------|---------|---------------|
| **GameBase.h** | Game states & structure | [gamebase.instructions.md](instructions/gamebase.instructions.md) |
| **Menu.h** | Game selection menu | [menu.instructions.md](instructions/menu.instructions.md) |

### Hardware Interface

| Module | Purpose | Documentation |
|--------|---------|---------------|
| **Display.h** | OLED screen rendering | [display.instructions.md](instructions/display.instructions.md) |
| **Input.h** | Joystick and button | [input.instructions.md](instructions/input.instructions.md) |
| **Melodies.h** | Sound effects | [melodies.instructions.md](instructions/melodies.instructions.md) |

### Game Utilities

| Module | Purpose | Documentation |
|--------|---------|---------------|
| **ProgMem.h** | Store data in Flash | [memory.instructions.md](instructions/memory.instructions.md) |
| **Procedural.h** | Generate levels/positions | [procedural.instructions.md](instructions/procedural.instructions.md) |
| **Physics.h** | Collision and movement | [physics.instructions.md](instructions/physics.instructions.md) |
| **Objects.h** | Object pool management | [objects.instructions.md](instructions/objects.instructions.md) |
| **Personnages.h** | Character system | [personnages.instructions.md](instructions/personnages.instructions.md) |

---

## 🎮 Game States

Defined in `GameBase.h`:

| Constant | Value | Meaning |
|----------|-------|---------|
| `ETAT_EN_COURS` | 0 | Game running |
| `ETAT_PAUSE` | 1 | Game paused |
| `ETAT_TERMINE` | 2 | Game over |
| `ETAT_QUITTER` | 3 | Return to menu |

---

## 🆕 Creating a New Game

### Step 1: Create Game File

Create `NewGame.h` with this template:

```cpp
#ifndef NEWGAME_H
#define NEWGAME_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Physics.h"

// === GAME INFO ===
InfoJeu infoNewGame = { "Game Name", "Description" };

// === VARIABLES (use prefix!) ===
int ng_joueurX = 64;
int ng_joueurY = 32;
int ng_etatJeu = ETAT_EN_COURS;

// === REQUIRED FUNCTIONS ===
void ng_setupJeu() { /* Initialize */ }
void ng_resetJeu() { /* Reset to start */ }
int ng_getEtatJeu() { return ng_etatJeu; }
void ng_loopJeu() { /* Main game loop */ }

#endif
```

### Step 2: Register in Game.ino

```cpp
#include "NewGame.h"

// In setup():
menu_ajouterJeu(infoNewGame.nom);

// In lancerJeu():
if (numeroJeu == X) { ng_resetJeu(); ng_setupJeu(); }

// In executerJeu():
if (numeroJeu == X) { ng_loopJeu(); }
```

### Naming Convention

**All variables and functions MUST use a unique prefix:**

| Game | Prefix | Examples |
|------|--------|----------|
| Monster Hunter | `mh_` | `mh_joueurX`, `mh_loopJeu()` |
| Aventurier | `av_` | `av_niveau`, `av_dessiner()` |
| New Game | `ng_` | `ng_score`, `ng_update()` |

---

## ⚠️ Memory Constraints

**Arduino Uno limits:**

| Memory | Total | Safe Limit | Danger Zone |
|--------|-------|------------|-------------|
| Flash | 32 KB | < 85% | > 90% |
| RAM | 2 KB | < 60% | > 65% |

**Key rules:**
1. Maximum **5-6 objects** per array
2. Use **`int8_t`** for small values
3. Store constants in **PROGMEM** (Flash)
4. Keep level transitions **simple**

See [memory.instructions.md](instructions/memory.instructions.md) for details.

---

## 📝 Git Commits

Use **Conventional Commits**:

```
<type>: <description>
```

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code restructuring |
| `chore` | Maintenance |

**Examples:**
- `feat: add Space Invaders game`
- `fix: reduce RAM in level transitions`

**Important:** Always push code to the remote repository after committing:
```bash
git push origin main
```

---

## 🌐 Website Development

**Location:** `website/` directory

### Serving the Website Locally

To view the documentation website:

```bash
make serve-website
```

This starts a local web server at **http://localhost:8080**

Open your browser to:
- http://localhost:8080/index.html
- http://localhost:8080/games.html
- http://localhost:8080/about.html

**Manual command:**
```bash
cd website && python3 -m http.server 8080
```

**Guidelines:** Follow [website.instructions.md](.github/instructions/website.instructions.md) for styling and structure rules.

---

## 🔌 Hardware Configuration

| Component | Pin | Purpose |
|-----------|--------|
| OLED SDA | A4 | I2C Data |
| OLED SCL | A5 | I2C Clock |
| Joystick X | A0 | Horizontal |
| Joystick Y | A1 | Vertical |
| Joystick Button | D7 | Action |
| Buzzer | D8 | Sound |
