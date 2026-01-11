---
applyTo: "Game/**"
---

# 🎵 Melodies.h - Sound Effects

## Overview

Pre-made sound effects using the passive buzzer. All melodies are blocking (use `delay()`).

**Hardware:** Passive buzzer on pin D8

---

## Setup

```cpp
void setup() {
  setupBuzzer();  // Configure buzzer pin
}
```

---

## Quick Reference

### Menu Sounds

| Function | When to Use |
|----------|-------------|
| `melodieStartup()` | Game console startup |
| `melodieMenuSelect()` | Navigate menu up/down |
| `melodieConfirm()` | Select/confirm choice |

### Action Sounds

| Function | When to Use |
|----------|-------------|
| `melodieTir()` | Player shoots/jumps |
| `melodiePasDeMunitions()` | No ammo, can't shoot |
| `melodieRecharge()` | Ammo refilled, pickup collected |

### Combat Sounds

| Function | When to Use |
|----------|-------------|
| `melodieMonstreTouche()` | Regular enemy hit/killed |
| `melodieBossTouche()` | Boss takes damage |
| `melodieAlerteBoss()` | Boss appears/spawns |
| `melodieVictoireBoss()` | Boss defeated |

### Progression Sounds

| Function | When to Use |
|----------|-------------|
| `melodieNiveauSup()` | Level up/next level |
| `melodieGameOver()` | Player dies/game over |
| `melodieRestart()` | Game restarts |

---

## Usage Examples

### Shooting with Ammo Check

```cpp
if (boutonJustePresse()) {
  if (munitions > 0) {
    munitions--;
    creerBalle();
    melodieTir();
  } else {
    melodiePasDeMunitions();
  }
}
```

### Collecting Items

```cpp
if (toucheNourriture()) {
  score += 10;
  munitions = munitionsMax;
  melodieRecharge();
  placerNourriture();
}
```

### Boss Battle

```cpp
void activerBoss() {
  estBoss = true;
  vieBoss = 5;
  melodieAlerteBoss();
}

void bossDetruit() {
  score += 100;
  estBoss = false;
  melodieVictoireBoss();
}
```

### Level Transitions

```cpp
void niveauTermine() {
  melodieNiveauSup();
  niveau++;
  creerNiveau();
}

void joueurMort() {
  melodieGameOver();
  etatJeu = ETAT_TERMINE;
}
```

---

## Sound Design

### Melody Patterns

| Type | Pattern | Example |
|------|---------|---------|
| **Positive** | Rising notes | Startup, Level up |
| **Negative** | Falling notes | Game over |
| **Alert** | Repeated notes | Boss alert |
| **Quick** | Short beep | Shoot, select |

### Timing

| Melody | Duration |
|--------|----------|
| `melodieTir()` | ~30ms |
| `melodieMenuSelect()` | ~50ms |
| `melodieRecharge()` | ~150ms |
| `melodieConfirm()` | ~200ms |
| `melodieNiveauSup()` | ~400ms |
| `melodieGameOver()` | ~1000ms |
| `melodieStartup()` | ~600ms |
| `melodieAlerteBoss()` | ~1000ms |

---

## Hardware Configuration

| Component | Pin |
|-----------|-----|
| Passive Buzzer | D8 |

**Note:** Uses `tone()` function. Passive buzzer requires PWM signal (we provide frequency).

---

## Creating Custom Melodies

```cpp
// Basic tone: tone(pin, frequency, duration)
void maNouvelleMelodie() {
  tone(BUZZER_PIN, 523, 100);  // Do (C5)
  delay(150);
  tone(BUZZER_PIN, 659, 100);  // Mi (E5)
  delay(150);
  tone(BUZZER_PIN, 784, 200);  // Sol (G5)
  delay(250);
  noTone(BUZZER_PIN);          // Always stop!
}
```

### Common Frequencies

| Note | Frequency |
|------|-----------|
| C4 (Do) | 262 Hz |
| E4 (Mi) | 330 Hz |
| G4 (Sol) | 392 Hz |
| C5 (Do) | 523 Hz |
| E5 (Mi) | 659 Hz |
| G5 (Sol) | 784 Hz |
| C6 (Do) | 1047 Hz |

---

## Memory Note

Melodies use Flash (code space), not RAM. Adding new melodies is safe for memory as long as total Flash stays under 85%.
