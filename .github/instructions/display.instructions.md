---
applyTo: "Game/**"
---

# 📺 Display.h API Instructions

This module provides OLED display functions using **U8g2 page buffer mode**, which uses only **128 bytes of RAM** instead of 1024 bytes.

---

## ⚠️ CRITICAL: Use DESSINER_ECRAN Macro

**Never use the old pattern:**
```cpp
// ❌ WRONG - This does nothing!
effacerEcran();
dessinerRectangle(10, 10, 20, 20);
afficherEcran();
```

**Always use DESSINER_ECRAN:**
```cpp
// ✅ CORRECT - Page buffer rendering
DESSINER_ECRAN {
  dessinerRectangle(10, 10, 20, 20);
  ecrireTexte(0, 0, "Score:", 1);
}
```

### Why?

U8g2 page buffer mode draws the screen in 8 horizontal strips ("pages"). The `DESSINER_ECRAN` macro runs your drawing code 8 times, once for each page. This is why all drawing must be inside the block.

---

## 🎮 Game Rendering Pattern

For games, create a separate drawing function and call it from DESSINER_ECRAN:

```cpp
// Content drawing function (called 8 times per frame)
void gn_dessinerContenu() {
  // HUD
  ecrireTexteNombre(0, 0, "Score: ", gn_score, 1);
  dessinerLigne(0, 9, 127, 9);
  
  // Game objects
  dessinerRectangle(gn_joueurX, gn_joueurY, 8, 8);
  dessinerCercle(gn_ennemiX, gn_ennemiY, 4);
}

// Main draw function
void gn_dessiner() {
  DESSINER_ECRAN {
    gn_dessinerContenu();
  }
}
```

---

## 📝 Text Functions

| Function | Description | Example |
|----------|-------------|---------|
| `ecrireTexte(x, y, text, size)` | Draw text | `ecrireTexte(0, 0, "Hello", 1)` |
| `ecrireNombre(x, y, num, size)` | Draw number | `ecrireNombre(50, 0, score, 1)` |
| `ecrireTexteNombre(x, y, text, num, size)` | Draw text + number | `ecrireTexteNombre(0, 0, "Niv ", 3, 1)` |
| `centrerX(text, size)` | Get X for centered text | `int x = centrerX("BRAVO!", 2)` |

### Text Sizes

| Size | Font | Char Width | Use For |
|------|------|------------|---------|
| 1 | 6x10 | 6 pixels | Normal text, HUD, menus |
| 2 | 7x14 | 7 pixels | Titles, "GAME OVER", "BRAVO!" |
| 3 | 7x14 | 7 pixels | Same as 2 (no larger font) |

**Example - Centered title:**
```cpp
DESSINER_ECRAN {
  int x = centrerX("GAME OVER", 2);
  ecrireTexte(x, 20, "GAME OVER", 2);
}
```

---

## 🎨 Drawing Functions

| Function | Description |
|----------|-------------|
| `dessinerRectangle(x, y, w, h)` | Filled rectangle |
| `dessinerContour(x, y, w, h)` | Rectangle outline |
| `dessinerCercle(x, y, radius)` | Filled circle |
| `dessinerLigne(x1, y1, x2, y2)` | Line |
| `dessinerTriangle(x1,y1, x2,y2, x3,y3)` | Filled triangle |
| `dessinerPixel(x, y)` | Single pixel |

### Screen Coordinates

```
(0,0) ────────────────────────► X (127,0)
  │
  │     LARGEUR_ECRAN = 128
  │     HAUTEUR_ECRAN = 64
  │
  ▼
Y (0,63)                        (127,63)
```

---

## 🏆 Helper Functions

### afficherTitre()

For simple title screens (handles DESSINER_ECRAN internally):

```cpp
// Shows centered title with optional subtitle
afficherTitre("ARCADE SOHAN", "Console de jeux");
delay(2000);
```

### afficherAppuieContinuer()

Draw "Appuie pour jouer!" at bottom (use inside DESSINER_ECRAN):

```cpp
DESSINER_ECRAN {
  ecrireTexte(20, 20, "MON JEU", 2);
  afficherAppuieContinuer();
}
```

---

## ⚡ Performance Tips

### 1. Keep Drawing Code Fast

The drawing code runs 8 times per frame. Avoid:
- Complex calculations inside DESSINER_ECRAN
- String manipulation inside DESSINER_ECRAN
- Function calls with side effects

```cpp
// ❌ BAD - calculations inside drawing loop
DESSINER_ECRAN {
  int distance = sqrt(dx*dx + dy*dy);  // Slow!
  ecrireNombre(0, 0, distance, 1);
}

// ✅ GOOD - calculate before drawing
int distance = sqrt(dx*dx + dy*dy);
DESSINER_ECRAN {
  ecrireNombre(0, 0, distance, 1);
}
```

### 2. Use sprintf() Before Drawing

For complex status bars, build the string first:

```cpp
char buffer[24];
sprintf(buffer, "Nv:%d %dp Tir:%d", niveau, score, munitions);

DESSINER_ECRAN {
  ecrireTexte(0, 0, buffer, 1);
  // ... rest of drawing
}
```

### 3. Avoid Changing Font Size Frequently

Font changes are cached, but mixing sizes in tight loops wastes cycles:

```cpp
// ❌ Avoid mixing sizes in loops
for (int i = 0; i < 10; i++) {
  ecrireNombre(0, i*8, values[i], 1);
  ecrireTexte(50, i*8, "pts", 2);  // Size change each iteration!
}

// ✅ Group by size
for (int i = 0; i < 10; i++) {
  ecrireNombre(0, i*8, values[i], 1);
}
for (int i = 0; i < 10; i++) {
  ecrireTexte(50, i*8, "pts", 2);
}
```

---

## 🚫 Common Mistakes

### Mistake 1: Drawing Outside DESSINER_ECRAN

```cpp
// ❌ WRONG - nothing will appear!
ecrireTexte(0, 0, "Hello", 1);
dessinerRectangle(10, 10, 20, 20);

// ✅ CORRECT
DESSINER_ECRAN {
  ecrireTexte(0, 0, "Hello", 1);
  dessinerRectangle(10, 10, 20, 20);
}
```

### Mistake 2: Multiple DESSINER_ECRAN in One Frame

```cpp
// ❌ WRONG - screen flickers, wastes time
DESSINER_ECRAN {
  dessinerRectangle(10, 10, 20, 20);
}
DESSINER_ECRAN {
  ecrireTexte(0, 0, "Text", 1);  // Rectangle disappears!
}

// ✅ CORRECT - one DESSINER_ECRAN per frame
DESSINER_ECRAN {
  dessinerRectangle(10, 10, 20, 20);
  ecrireTexte(0, 0, "Text", 1);
}
```

### Mistake 3: Modifying Game State Inside DESSINER_ECRAN

```cpp
// ❌ WRONG - score increases 8x per frame!
DESSINER_ECRAN {
  score++;  // BAD! Runs 8 times!
  ecrireNombre(0, 0, score, 1);
}

// ✅ CORRECT - modify state before drawing
score++;
DESSINER_ECRAN {
  ecrireNombre(0, 0, score, 1);
}
```

---

## 📐 Quick Reference

```cpp
// Setup (in main setup())
setupDisplay();

// Drawing pattern
DESSINER_ECRAN {
  // Text
  ecrireTexte(x, y, "text", size);
  ecrireNombre(x, y, number, size);
  ecrireTexteNombre(x, y, "prefix", number, size);
  
  // Shapes
  dessinerRectangle(x, y, width, height);  // Filled
  dessinerContour(x, y, width, height);    // Outline
  dessinerCercle(x, y, radius);            // Filled circle
  dessinerLigne(x1, y1, x2, y2);           // Line
  dessinerTriangle(x1,y1, x2,y2, x3,y3);   // Filled triangle
  dessinerPixel(x, y);                     // Pixel
}

// Centering
int x = centrerX("TEXT", size);

// Title screen (self-contained)
afficherTitre("Title", "Subtitle");
```
