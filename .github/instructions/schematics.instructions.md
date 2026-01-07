---
applyTo: "**"
---

# Monster Hunter Game - Wiring Guide 🎮🖥️

Complete wiring reference for the Monster Hunter game with OLED display, joystick, and buzzer. 

---

## 🛠️ Components Required

| Component | Quantity | Description |
|-----------|----------|-------------|
| Arduino UNO | 1 | Main controller board |
| OLED I2C Display | 1 | 0.96-inch, 128×64 pixels, 4 pins (VCC, GND, SCL, SDA) |
| Joystick Module | 1 | 2-axis analog with push button, 5 pins (GND, +5V, VRx, VRy, SW) |
| Passive Buzzer | 1 | For sound effects, 2 pins (+, -) |
| Jumper Wires | ~10 | Various colors |
| Breadboard | 1 | 830-tie-point |

---

## 📐 Breadboard Diagram

**⚠️ CRITICAL:** Components with pins in a row must be placed **vertically** across different rows to keep each pin electrically separate! 

| Row | A | B | C | D | E | ❌ | F | G | H | I | J | ➕ | ➖ |
|-----|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5   |VCC|🟥2|   |   |   |   |   |   |   |   |   |🟥1|   |
| 6   |GND|⬛2|   |   |   |   |   |   |   |   |   |   |⬛1|
| 7   |SCL|🟢 |   |   |   |   |   |   |   |   |   |   |   |
| 8   |SDA|🔵 |   |   |   |   |   |   |   |   |   |   |   |
| 15  |GND|⬛2|   |   |   |   |   |   |   |   |   |   |   |
| 16  |+5V|🟥2|   |   |   |   |   |   |   |   |   |   |   |
| 17  |VRx|🟡 |   |   |   |   |   |   |   |   |   |   |   |
| 18  |VRy|🟠 |   |   |   |   |   |   |   |   |   |   |   |
| 19  |SW |🟣 |   |   |   |   |   |   |   |   |   |   |   |
| 25  |BUZ+|🟨|   |   |   |   |   |   |   |   |   |   |   |
| 26  |BUZ-|⬛2|   |   |   |   |   |   |   |   |   |   |   |

### Wire Color Legend

| Symbol | Color | Type | Purpose |
|--------|-------|------|---------|
| 🟥1 | Red | Power | From Arduino 5V to Power Rail ➕ |
| 🟥2 | Red | Power | From Power Rail to component |
| ⬛1 | Black | Ground | From Arduino GND to Ground Rail ➖ |
| ⬛2 | Black | Ground | From Ground Rail to component |
| 🟢 | Green | Analog | SCL clock signal |
| 🔵 | Blue | Analog | SDA data signal |
| 🟡 | Yellow | Analog | Joystick X-axis |
| 🟠 | Orange | Analog | Joystick Y-axis |
| 🟣 | Purple | Digital | Joystick button |
| 🟨 | Yellow Square | Digital | Buzzer signal |

---

## 🔌 Arduino Pin Connections

### Power Connections
```
Arduino 5V ─────────────🟥── Common Power Rail ➕
Arduino GND ────────────⬛── Common Ground Rail ➖
```

### OLED Display (I2C)
```
Component Pin    Breadboard    Wire     Arduino Pin
─────────────────────────────────────────────────────
VCC (row 5)  →   B5       →   🟥2   →  Power Rail ➕
GND (row 6)  →   B6       →   ⬛2   →  Ground Rail ➖
SCL (row 7)  →   B7       →   🟢    →  A5 (SCL)
SDA (row 8)  →   B8       →   🔵    →  A4 (SDA)
```

### Joystick Module
```
Component Pin    Breadboard    Wire     Arduino Pin
─────────────────────────────────────────────────────
GND (row 15) →   B15      →   ⬛2   →  Ground Rail ➖
+5V (row 16) →   B16      →   🟥2   →  Power Rail ➕
VRx (row 17) →   B17      →   🟠    →  A0
VRy (row 18) →   B18      →   🟢   →  A1
SW  (row 19) →   B19      →   🟣    →  Digital Pin 7
```

### Passive Buzzer
```
Component Pin    Breadboard    Wire     Arduino Pin
─────────────────────────────────────────────────────
BUZ+ (row 25) →  B25      →   🟨    →  Digital Pin 8
BUZ- (row 26) →  B26      →   ⬛2   →  Ground Rail ➖
```

---

## 📍 Visual Component Placement

### OLED Display (Rows 5-8)
```
                    OLED Display
                    ┌─────────┐
                    │  ┌───┐  │
                    │  │   │  │
                    │  └───┘  │
                    │ VCC GND │
                    │ SCL SDA │
                    └──┬─┬─┬─┬┘
                       │ │ │ │
    Row 5 ─────────────┘ │ │ │ ← VCC → 🟥2 to Power Rail
    Row 6 ───────────────┘ │ │ ← GND → ⬛2 to Ground Rail
    Row 7 ─────────────────┘ │ ← SCL → 🟢 to Arduino A5
    Row 8 ───────────────────┘ ← SDA → 🔵 to Arduino A4
```

### Joystick Module (Rows 15-19)
```
                    Joystick
                    ┌─────────┐
                    │    ○    │
                    │  (   )  │
                    │    ○    │
                    └┬─┬─┬─┬─┬┘
                     │ │ │ │ │
    Row 15 ──────────┘ │ │ │ │ ← GND → ⬛2 to Ground Rail
    Row 16 ────────────┘ │ │ │ ← +5V → 🟥2 to Power Rail
    Row 17 ──────────────┘ │ │ ← VRx → 🟡 to Arduino A0
    Row 18 ────────────────┘ │ ← VRy → 🟠 to Arduino A1
    Row 19 ──────────────────┘ ← SW  → 🟣 to Arduino Pin 7
```

### Passive Buzzer (Rows 25-26)
```
                    Buzzer
                    ┌─────┐
                    │  ◉  │
                    │     │
                    └──┬─┬┘
                       │ │
    Row 25 ────────────┘ │ ← BUZ+ → 🟨 to Arduino Pin 8
    Row 26 ──────────────┘ ← BUZ- → ⬛2 to Ground Rail
```

---

## 📋 Pin Summary Table

| Arduino Pin | Type | Connected To | Function |
|-------------|------|--------------|----------|
| 5V | Power | Power Rail ➕ | Supplies power to components |
| GND | Ground | Ground Rail ➖ | Common ground for all components |
| A0 | Analog Input | Joystick VRx | X-axis position (0-1023) |
| A1 | Analog Input | Joystick VRy | Y-axis position (0-1023) |
| A4 (SDA) | I2C Data | OLED SDA | Screen data communication |
| A5 (SCL) | I2C Clock | OLED SCL | Screen clock signal |
| Digital 7 | Digital Input | Joystick SW | Fire button (LOW when pressed) |
| Digital 8 | Digital Output | Buzzer + | Sound effects |

---

## ⚠️ Important Notes

### Component Orientation
- **OLED & Joystick:** Place pins **vertically** across rows (not horizontally!)
- Horizontal placement would short-circuit all pins together

### OLED Power
- The OLED module has a built-in voltage regulator
- Safe to connect to 5V through the module ✅

### Joystick Button
- Uses `INPUT_PULLUP` mode in code
- Button reads `LOW` when pressed, `HIGH` when released

### Buzzer Polarity
- Passive buzzer has + and - markings
- + pin connects to Arduino, - pin to ground

---

## 🎮 Game Controls Summary

| Control | Action |
|---------|--------|
| Joystick Left/Right | Move player horizontally |
| Joystick Up/Down | Move player vertically |
| Joystick Button | Fire projectile in last movement direction |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Screen blank | Check I2C address (try 0x3D instead of 0x3C) |
| No joystick response | Verify A0/A1 connections |
| Player moves wrong direction | Swap X/Y readings in code |
| No sound | Check buzzer polarity and pin 8 |
| Shooting doesn't work | Ensure button connected to pin 7 with INPUT_PULLUP |
| All pins shorted | Component placed horizontally - must be vertical!  |
