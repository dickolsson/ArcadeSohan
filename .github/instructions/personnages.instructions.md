---
applyTo: "Game/**"
---

# 👤 Personnages.h - Character System

## Overview

Unlockable character system with support for **platform view** (side) and **top-down view**. Characters unlock as players earn stars.

---

## Characters

| Constant | Name | Stars Required | Description |
|----------|------|----------------|-------------|
| `PERSO_BLOB` | Blob | 0 (free) | Simple circle |
| `PERSO_BONHOMME` | Bonhomme | 99 | Head and body |
| `PERSO_HEROS` | Héros | 300 | With arms and legs |
| `PERSO_CHAMPION` | Champion | 600 | With a sword! |

---

## Directions

| Constant | Value | Use |
|----------|-------|-----|
| `DIR_HAUT` | 0 | Top-view: facing up |
| `DIR_DROITE` | 1 | Both: facing right |
| `DIR_BAS` | 2 | Top-view: facing down |
| `DIR_GAUCHE` | 3 | Both: facing left |

---

## Quick Reference

### Drawing Functions

| Function | View | Description |
|----------|------|-------------|
| `pers_dessinerPlateforme(x, y, perso, dir, frame)` | Platform (side) | Draw character with animation |
| `pers_dessinerVueHaut(x, y, taille, perso, dir)` | Top-down | Draw character with direction indicator |

### Character Management

| Function | Description |
|----------|-------------|
| `personnageDebloque(perso)` | Check if character is unlocked |
| `pers_etoilesRequises(perso)` | Get stars needed to unlock |
| `ajouterEtoiles(nombre)` | Add stars, returns `true` if new unlock |
| `nombrePersonnagesDebloques()` | Count unlocked characters |

### Global Variables

| Variable | Description |
|----------|-------------|
| `personnageActuel` | Currently selected character |
| `etoilesTotales` | Player's total stars |

---

## Platform View (Side-Scrolling Games)

For games like Aventurier:

```cpp
// In your game variables
int av_direction = DIR_DROITE;
int av_frame = 0;
bool av_bouge = false;

// In controls
void av_controles() {
  lireJoystick();
  av_bouge = false;
  
  if (joystickGauche()) {
    av_joueurX -= 2;
    av_bouge = true;
    av_frame = 1 - av_frame;  // Toggle 0/1
    av_direction = DIR_GAUCHE;
  }
  if (joystickDroite()) {
    av_joueurX += 2;
    av_bouge = true;
    av_frame = 1 - av_frame;
    av_direction = DIR_DROITE;
  }
}

// In drawing
void av_dessinerContenu() {
  pers_dessinerPlateforme(av_joueurX, av_joueurY, personnageActuel,
                          av_direction, av_bouge ? av_frame : 0);
}
```

---

## Top-Down View (Overhead Games)

For games like Monster Hunter:

```cpp
// In your game variables
int mh_direction = DIR_DROITE;

// In controls
void mh_controles() {
  lireJoystick();
  
  if (joystickGauche())  { mh_joueurX--; mh_direction = DIR_GAUCHE; }
  if (joystickDroite())  { mh_joueurX++; mh_direction = DIR_DROITE; }
  if (joystickHaut())    { mh_joueurY--; mh_direction = DIR_HAUT; }
  if (joystickBas())     { mh_joueurY++; mh_direction = DIR_BAS; }
}

// In drawing
void mh_dessinerContenu() {
  pers_dessinerVueHaut(mh_joueurX, mh_joueurY, mh_tailleJoueur,
                       personnageActuel, mh_direction);
}
```

---

## Unlock System

### Adding Stars

```cpp
void niveauTermine() {
  int etoilesGagnees = 10;
  
  if (ajouterEtoiles(etoilesGagnees)) {
    // New character unlocked!
    DESSINER_ECRAN {
      ecrireTexte(10, 20, "NOUVEAU PERSO!", 2);
    }
    delay(2000);
  }
}
```

### Checking Unlock Status

```cpp
if (personnageDebloque(PERSO_CHAMPION)) {
  // Champion is available
}

int stars = pers_etoilesRequises(PERSO_HEROS);  // Returns 300
```

---

## Selection Screen

```cpp
void afficherSelectionPersonnage();  // Built-in selection UI
```

Shows all characters with lock icons for unavailable ones.

---

## Backward Compatibility

Old single-argument functions still work:

```cpp
dessinerBlob(x, y);      // Same as dessinerBlobPlateforme
dessinerBonhomme(x, y);  // Platform view, facing right
dessinerHeros(x, y);     // Platform view, facing right
dessinerChampion(x, y);  // Platform view, facing right
dessinerPersonnage(x, y, perso);  // Platform view, facing right
```

---

## Memory Note

Character data uses PROGMEM:
- Unlock thresholds stored in Flash (not RAM)
- Names stored in Flash via `TEXTE_PROGMEM`
- Drawing functions are inline (code space, not RAM)

---

## Visual Appearance

### Platform View

```
  BLOB      BONHOMME     HEROS      CHAMPION
   ○          ○           ○           ○
             ▐▌          ▐▌          ▐▌  ═══
             ╱╲         ╱│╲         ╱│╲
                        ╱ ╲         ╱ ╲
```

### Top-Down View

```
  BLOB      OTHERS      CHAMPION
   ○        ○           ○
            ▲           ▲═══
  (circle)  (circle     (circle + sword
            + pointer)   + pointer)
```
