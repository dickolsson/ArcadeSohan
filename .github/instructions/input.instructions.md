---
applyTo: "Game/**"
---

# 🕹️ Input.h - Joystick & Button Controls

## Overview

Input handling for joystick (2-axis analog + button). Call `lireJoystick()` first each frame!

**Hardware:** Analog joystick module on pins A0, A1, D7

---

## ⚠️ Critical Rule

**Always call `lireJoystick()` before checking directions:**

```cpp
// ✅ CORRECT
void loopJeu() {
  lireJoystick();  // Update state FIRST!
  if (joystickHaut()) { /* ... */ }
}

// ❌ WRONG - stale data!
void loopJeu() {
  if (joystickHaut()) { /* uses old values */ }
}
```

---

## Quick Reference

### Setup

| Function | Description |
|----------|-------------|
| `setupInput()` | Configure joystick pins (call in setup) |

### Reading Input

| Function | Description |
|----------|-------------|
| `lireJoystick()` | **Call first!** Updates all joystick state |
| `joystickHaut()` | Returns `true` if pushing up |
| `joystickBas()` | Returns `true` if pushing down |
| `joystickGauche()` | Returns `true` if pushing left |
| `joystickDroite()` | Returns `true` if pushing right |
| `boutonJustePresse()` | Returns `true` once per button press (edge detection) |

### Direct Access

```cpp
// The joystick struct (after calling lireJoystick)
joystick.valeurX      // Raw X (0-1023), center ~512
joystick.valeurY      // Raw Y (0-1023), center ~512
joystick.directionX   // -1 = left, 0 = center, 1 = right
joystick.directionY   // -1 = up, 0 = center, 1 = down
joystick.boutonPresse // true if button held down
```

---

## Button Edge Detection

`boutonJustePresse()` returns `true` **only once** per press:

```cpp
void loopJeu() {
  lireJoystick();
  
  // ✅ Fires once when pressed
  if (boutonJustePresse()) {
    tirer();  // Only fires once per press!
  }
  
  // ❌ Fires every frame while held
  if (joystick.boutonPresse) {
    tirer();  // Fires 30+ times per second!
  }
}
```

---

## Movement Patterns

### 4-Direction Movement (Top-View)

```cpp
void gn_controles() {
  lireJoystick();
  
  if (joystickGauche()) joueurX -= vitesse;
  if (joystickDroite()) joueurX += vitesse;
  if (joystickHaut())   joueurY -= vitesse;
  if (joystickBas())    joueurY += vitesse;
}
```

### 2-Direction Movement (Platform)

```cpp
void gn_controles() {
  lireJoystick();
  
  if (joystickGauche()) joueurX -= 2;
  if (joystickDroite()) joueurX += 2;
  
  if (boutonJustePresse() && auSol) {
    vitesseY = -FORCE_SAUT;
  }
}
```

### Direction Tracking (for shooting/facing)

```cpp
int direction = DIR_DROITE;

void gn_controles() {
  lireJoystick();
  
  if (joystickGauche()) { joueurX--; direction = DIR_GAUCHE; }
  if (joystickDroite()) { joueurX++; direction = DIR_DROITE; }
  if (joystickHaut())   { joueurY--; direction = DIR_HAUT; }
  if (joystickBas())    { joueurY++; direction = DIR_BAS; }
}
```

---

## Hardware Configuration

| Component | Pin | Type |
|-----------|-----|------|
| Joystick X | A0 | Analog input |
| Joystick Y | A1 | Analog input |
| Joystick Button | D7 | Digital input (INPUT_PULLUP) |

### Thresholds

| Constant | Value | Meaning |
|----------|-------|---------|
| `SEUIL_BAS` | 400 | Below = negative direction |
| `SEUIL_HAUT` | 600 | Above = positive direction |
| Center | 400-600 | Dead zone (no movement) |

---

## EtatJoystick Structure

```cpp
struct EtatJoystick {
  int valeurX;       // Raw analog X (0-1023)
  int valeurY;       // Raw analog Y (0-1023)
  int directionX;    // -1, 0, or 1
  int directionY;    // -1, 0, or 1
  bool boutonPresse; // Button state
};

// Global instance
EtatJoystick joystick;
```

---

## Common Mistakes

### ❌ Forgetting to read joystick

```cpp
// WRONG - joystick state never updates
void loopJeu() {
  if (joystickDroite()) joueurX++;
}
```

### ❌ Using boutonPresse for actions

```cpp
// WRONG - fires every frame (30+ times!)
if (joystick.boutonPresse) tirer();

// CORRECT - fires once per press
if (boutonJustePresse()) tirer();
```

### ❌ Checking input after drawing

```cpp
// WRONG - input feels laggy
DESSINER_ECRAN { dessiner(); }
lireJoystick();

// CORRECT - responsive input
lireJoystick();
// ... game logic ...
DESSINER_ECRAN { dessiner(); }
```
