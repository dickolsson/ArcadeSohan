---
applyTo: "Game/**"
---

# 🎮 GameBase.h - Game Structure

## Overview

Defines the structure all games must follow: states, info, and required functions.

---

## Game States

| Constant | Value | Meaning |
|----------|-------|---------|
| `ETAT_EN_COURS` | 0 | Game is running |
| `ETAT_PAUSE` | 1 | Game is paused |
| `ETAT_TERMINE` | 2 | Game over (show score, wait for restart) |
| `ETAT_QUITTER` | 3 | Return to main menu |

### State Flow

```
                    ┌────────────────┐
                    │  ETAT_EN_COURS │◄─────────┐
                    └───────┬────────┘          │
                            │                   │
              ┌─────────────┼─────────────┐     │
              ▼             ▼             ▼     │
        ┌──────────┐  ┌───────────┐  ┌─────────┴─┐
        │ETAT_PAUSE│  │ETAT_TERMINE│  │ETAT_QUITTER│
        └────┬─────┘  └─────┬─────┘  └───────────┘
             │              │              │
             │              │              ▼
             └──────────────┴────────► Menu
```

---

## InfoJeu Structure

```cpp
struct InfoJeu {
  const char* nom;         // Game name (shown in menu)
  const char* description; // Short description
};
```

### Example

```cpp
InfoJeu infoNewGame = {
  "Mon Jeu",           // Name
  "Super description!" // Description
};
```

---

## Required Functions

Every game **MUST** implement these 4 functions:

| Function | Purpose |
|----------|---------|
| `xx_setupJeu()` | Initialize game (called once when game starts) |
| `xx_resetJeu()` | Reset to initial state (for restart) |
| `xx_loopJeu()` | Main game loop (called every frame) |
| `xx_getEtatJeu()` | Return current game state |

### Template

```cpp
// === REQUIRED FUNCTIONS ===

void gn_setupJeu() {
  // Called once when game launches
  gn_creerNiveau();
}

void gn_resetJeu() {
  // Reset all variables to starting values
  gn_joueurX = 64;
  gn_joueurY = 32;
  gn_score = 0;
  gn_niveau = 1;
  gn_etatJeu = ETAT_EN_COURS;
  gn_creerNiveau();
}

int gn_getEtatJeu() {
  return gn_etatJeu;
}

void gn_loopJeu() {
  // Called every frame
  if (gn_etatJeu == ETAT_TERMINE) {
    // Handle game over state
    lireJoystick();
    if (boutonJustePresse()) {
      gn_resetJeu();
    }
    return;
  }
  
  gn_controles();
  gn_physique();
  gn_dessiner();
  delay(30);
}
```

---

## Game File Template

```cpp
#ifndef NEWGAME_H
#define NEWGAME_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Physics.h"
#include "Melodies.h"

// ==========================================================
// INFORMATIONS DU JEU (Game information)
// ==========================================================

InfoJeu infoNewGame = { "Game Name", "Description" };

// ==========================================================
// VARIABLES (use prefix!)
// ==========================================================

int gn_joueurX = 64;
int gn_joueurY = 32;
int gn_score = 0;
int gn_etatJeu = ETAT_EN_COURS;

// ==========================================================
// GAME LOGIC
// ==========================================================

void gn_controles() {
  lireJoystick();
  if (joystickGauche()) gn_joueurX -= 2;
  if (joystickDroite()) gn_joueurX += 2;
}

void gn_dessinerContenu() {
  ecrireTexteNombre(0, 0, "Score: ", gn_score, 1);
  dessinerRectangle(gn_joueurX - 4, gn_joueurY - 4, 8, 8);
}

void gn_dessiner() {
  DESSINER_ECRAN {
    gn_dessinerContenu();
  }
}

// ==========================================================
// REQUIRED FUNCTIONS
// ==========================================================

void gn_setupJeu() {
  // Initialize
}

void gn_resetJeu() {
  gn_joueurX = 64;
  gn_joueurY = 32;
  gn_score = 0;
  gn_etatJeu = ETAT_EN_COURS;
}

int gn_getEtatJeu() {
  return gn_etatJeu;
}

void gn_loopJeu() {
  if (gn_etatJeu == ETAT_TERMINE) {
    lireJoystick();
    if (boutonJustePresse()) gn_resetJeu();
    return;
  }
  
  gn_controles();
  gn_dessiner();
  delay(30);
}

#endif
```

---

## Registering in Game.ino

```cpp
#include "NewGame.h"

void setup() {
  // ...
  menu_ajouterJeu(infoNewGame.nom);  // Add to menu
}

void lancerJeu(int numero) {
  if (numero == X) { gn_resetJeu(); gn_setupJeu(); }
}

void executerJeu(int numero) {
  if (numero == X) { gn_loopJeu(); }
}

int getEtatJeu(int numero) {
  if (numero == X) { return gn_getEtatJeu(); }
  return ETAT_EN_COURS;
}
```

---

## Naming Convention

**All variables and functions MUST use a unique 2-3 letter prefix:**

| Game | Prefix | Examples |
|------|--------|----------|
| Monster Hunter | `mh_` | `mh_joueurX`, `mh_loopJeu()` |
| Aventurier | `av_` | `av_niveau`, `av_dessiner()` |
| New Game | `gn_` | `gn_score`, `gn_update()` |

**Why?** Arduino IDE compiles all `.h` files together. Without prefixes, variable names collide!

---

## Limits

| Constant | Value |
|----------|-------|
| `MAX_JEUX` | 10 |

Keep total games reasonable to save RAM (each game adds global variables).
