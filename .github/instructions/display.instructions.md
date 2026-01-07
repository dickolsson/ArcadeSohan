---
applyTo: "Game/**"
---

# 📺 Display.h - OLED Screen Rendering

## Overview

Display module using **U8g2 page buffer mode** (128 bytes RAM instead of 1024).

**Screen size:** 128 × 64 pixels

---

## ⚠️ Critical Rule

**All drawing MUST be inside `DESSINER_ECRAN`:**

```cpp
// ✅ CORRECT
DESSINER_ECRAN {
  ecrireTexte(0, 0, "Hello", 1);
  dessinerRectangle(10, 10, 20, 20);
}

// ❌ WRONG - Nothing appears!
ecrireTexte(0, 0, "Hello", 1);
dessinerRectangle(10, 10, 20, 20);
```

**Why?** Page buffer mode renders in 8 strips. The macro runs your code 8 times, once per strip.

---

## Quick Reference

### Text Functions

| Function | Description |
|----------|-------------|
| `ecrireTexte(x, y, "text", size)` | Draw text |
| `ecrireNombre(x, y, num, size)` | Draw number |
| `ecrireTexteNombre(x, y, "text", num, size)` | Draw text + number |
| `centrerX("text", size)` | Get X for centered text |

**Sizes:** 1 = small (6×10), 2 = large (7×14)

### Shape Functions

| Function | Description |
|----------|-------------|
| `dessinerRectangle(x, y, w, h)` | Filled rectangle |
| `dessinerContour(x, y, w, h)` | Rectangle outline |
| `dessinerCercle(x, y, r)` | Filled circle |
| `dessinerLigne(x1, y1, x2, y2)` | Line |
| `dessinerTriangle(x1, y1, x2, y2, x3, y3)` | Filled triangle |
| `dessinerPixel(x, y)` | Single pixel |

### Helper Functions

| Function | Description |
|----------|-------------|
| `afficherTitre("Title", "Subtitle")` | Centered title screen |
| `afficherAppuieContinuer()` | "Press to play" message |

---

## Game Pattern

```cpp
void gn_dessinerContenu() {
  // HUD
  ecrireTexteNombre(0, 0, "Score: ", gn_score, 1);
  dessinerLigne(0, 9, 127, 9);
  
  // Game objects
  dessinerRectangle(gn_joueurX, gn_joueurY, 8, 8);
}

void gn_dessiner() {
  DESSINER_ECRAN {
    gn_dessinerContenu();
  }
}
```

---

## Common Mistakes

### ❌ Multiple DESSINER_ECRAN per frame

```cpp
// WRONG - second call erases first
DESSINER_ECRAN { dessinerRectangle(10, 10, 20, 20); }
DESSINER_ECRAN { ecrireTexte(0, 0, "Text", 1); }

// CORRECT - one call per frame
DESSINER_ECRAN {
  dessinerRectangle(10, 10, 20, 20);
  ecrireTexte(0, 0, "Text", 1);
}
```

### ❌ Modifying state inside DESSINER_ECRAN

```cpp
// WRONG - score increases 8× per frame!
DESSINER_ECRAN { score++; ecrireNombre(0, 0, score, 1); }

// CORRECT - modify before drawing
score++;
DESSINER_ECRAN { ecrireNombre(0, 0, score, 1); }
```

### ❌ Heavy calculations inside DESSINER_ECRAN

```cpp
// WRONG - runs 8 times!
DESSINER_ECRAN { int dist = sqrt(dx*dx + dy*dy); }

// CORRECT - calculate before
int dist = sqrt(dx*dx + dy*dy);
DESSINER_ECRAN { ecrireNombre(0, 0, dist, 1); }
```

---

## Screen Coordinates

```
(0,0) ─────────────────────► X (127,0)
  │
  │    Screen: 128 × 64 pixels
  │
  ▼
(0,63)                      (127,63)
```

| Constant | Value |
|----------|-------|
| `LARGEUR_ECRAN` | 128 |
| `HAUTEUR_ECRAN` | 64 |
