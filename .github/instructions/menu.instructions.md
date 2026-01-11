---
applyTo: "Game/**"
---

# 📋 Menu.h - Game Selection Menu

## Overview

Main menu system for selecting games. Handles startup screen, game list, and navigation.

---

## System Flow

```
┌─────────────┐    ┌──────────┐    ┌──────────┐
│   Startup   │───►│   Menu   │───►│   Game   │
│   Screen    │    │  Select  │    │  Loop    │
└─────────────┘    └──────────┘    └──────────┘
      │                 ▲                │
      │                 │                │
      │                 └────────────────┘
      │                  ETAT_QUITTER
      ▼
  Press button
```

---

## Quick Reference

### Setup Functions

| Function | Description |
|----------|-------------|
| `menu_ajouterJeu(nom)` | Register a game in the menu |
| `menu_afficherDemarrage()` | Show startup splash screen |
| `menu_attendreBouton()` | Wait for button press |

### Runtime Functions

| Function | Description |
|----------|-------------|
| `menu_update()` | Handle menu navigation, returns game number or -1 |
| `menu_dessiner()` | Draw the menu (called by menu_update) |

---

## Adding a Game to Menu

In `Game.ino` setup:

```cpp
void setup() {
  // ... initialization ...
  
  // Register all games
  menu_ajouterJeu(infoMonsterHunter.nom);  // Game 0
  menu_ajouterJeu(infoAventurier.nom);     // Game 1
  menu_ajouterJeu(infoNewGame.nom);        // Game 2
}
```

---

## Main Loop Pattern

```cpp
int jeuActuel = -1;  // -1 = menu, 0+ = game number

void loop() {
  if (jeuActuel == -1) {
    // Show menu
    int selection = menu_update();
    if (selection >= 0) {
      jeuActuel = selection;
      lancerJeu(jeuActuel);
    }
  } else {
    // Run game
    executerJeu(jeuActuel);
    
    // Check if game wants to quit
    if (getEtatJeu(jeuActuel) == ETAT_QUITTER) {
      jeuActuel = -1;
    }
  }
}
```

---

## Menu Variables

| Variable | Type | Description |
|----------|------|-------------|
| `menu_jeuSelectionne` | int | Currently highlighted game (0-based) |
| `menu_nombreJeux` | int | Total games registered |
| `menu_nomsJeux[]` | const char* | Array of game names |
| `menu_delaiMouvement` | int | Delay between menu moves (200ms) |

---

## Startup Sequence

```cpp
void setup() {
  setupDisplay();
  setupInput();
  setupBuzzer();
  
  // Register games
  menu_ajouterJeu(infoMonsterHunter.nom);
  menu_ajouterJeu(infoAventurier.nom);
  
  // Show startup screen
  menu_afficherDemarrage();
  menu_attendreBouton();
}
```

---

## Menu Navigation

| Input | Action |
|-------|--------|
| Joystick Up | Previous game |
| Joystick Down | Next game |
| Button Press | Select game |

**Note:** Menu has built-in delay (`menu_delaiMouvement = 200ms`) to prevent too-fast scrolling.

---

## Customizing Menu

### Change Menu Title

In `menu_dessinerContenu()`:
```cpp
ecrireTexte(15, 0, "ARCADE SOHAN", 1);  // Change title here
```

### Change Selection Style

In `menu_dessinerContenu()`:
```cpp
if (i == menu_jeuSelectionne) {
  ecrireTexte(5, y, ">", 1);              // Arrow indicator
  dessinerContour(15, y - 2, 110, 12);    // Box around selection
}
```

---

## Return to Menu from Game

In your game, set state to `ETAT_QUITTER`:

```cpp
void gn_loopJeu() {
  lireJoystick();
  
  // Long press to quit (example)
  if (joystick.boutonPresse && /* held for 2 seconds */) {
    gn_etatJeu = ETAT_QUITTER;
  }
}
```

Then in `Game.ino`:
```cpp
if (getEtatJeu(jeuActuel) == ETAT_QUITTER) {
  jeuActuel = -1;  // Return to menu
}
```

---

## Limits

| Constant | Value | Description |
|----------|-------|-------------|
| `MAX_JEUX` | 10 | Maximum games in menu |

**Note:** Each game name pointer uses 2 bytes RAM. Keep game count reasonable.
