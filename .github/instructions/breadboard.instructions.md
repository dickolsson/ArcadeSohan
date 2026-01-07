---
applyTo: "**"
---

# 🔌 Breadboard & Hardware Instructions

These instructions explain how to render breadboard diagrams and place components.

---

## The Breadboard Table

The breadboard diagram is a **top-view table** showing component and wire placement.

### Table Structure

| Columns A-E | Gap | Columns F-J | Power | Ground |
|-------------|-----|-------------|-------|--------|
| Connected horizontally | ❌ | Connected horizontally | ➕ | ➖ |

**Rules:**
- Horizontal rows are **connected** from A to E
- Horizontal rows are **connected** from F to J  
- Rows are **NOT connected** across the center gap (E to F)
- ➕ rail connects to 5V
- ➖ rail connects to GND

### Table Orientation

- Upper left: A1
- Upper right: J1
- Lower left: A63
- Lower right: J63

---

## Wire Color Coding

**CRITICAL:** Always use these colored emojis:

| Wire Type | Emoji | Example |
|-----------|-------|---------|
| Power (5V) | 🟥1, 🟥2 | 🟥1 on ➕ rail, 🟥2 on breadboard |
| Ground | ⬛️1, ⬛️2 | ⬛️1 on ➖ rail, ⬛️2 on breadboard |
| Analog pins | 🟡, 🟢, 🔵, 🟣 | Circles for analog |
| Digital pins | 🟨, 🟩, 🟦, 🟪 | Squares for digital |

---

## Component Rendering

**CRITICAL:** Use these ASCII codes for components:

| Component | Code | Example |
|-----------|------|---------|
| LED anode (+) | `LED+` | Long leg (positive) |
| LED cathode (-) | `LED-` | Short leg (negative) |
| 220Ω resistor | `220` | Both ends |
| 10KΩ resistor | `10K` | Both ends |
| Button pins | `BUT1`, `BUT2`, `BUT3`, `BUT4` | 4 pins total |

---

## Button Placement

Buttons have **4 pins** and MUST span the center gap:

```
     E    ❌    F
1  [BUT1]    [BUT2]
2    |         |
3  [BUT3]    [BUT4]
```

**Connection logic:**
- Unpressed: BUT1↔BUT2 connected, BUT3↔BUT4 connected
- Pressed: BUT1↔BUT3 connected, BUT2↔BUT4 connected

---

## Current Arcade Console Hardware

### Pin Configuration

| Component | Pin | Type |
|-----------|-----|------|
| OLED SDA | A4 | I2C Data |
| OLED SCL | A5 | I2C Clock |
| Joystick X | A0 | Analog |
| Joystick Y | A1 | Analog |
| Joystick Button | D2 | Digital |
| Buzzer | D8 | Digital PWM |

### OLED Display

- **Type:** 0.96" OLED, 128×64 pixels, I2C
- **Voltage:** 3.3V (has onboard regulator for 5V input)
- **Address:** 0x3C
- **Library:** Adafruit_SSD1306, Adafruit_GFX

### Joystick Module

- **X axis:** Analog output 0-1023
- **Y axis:** Analog output 0-1023
- **Button:** Active LOW (pressed = 0)
- Center position: ~512 for both axes

---

## Available Components

See the full component list in `components.instructions.md` for:
- All available resistor values
- LED colors
- Sensors and actuators
- Power supply options
