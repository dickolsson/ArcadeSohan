# Monster Hunter - Arduino Game

A Pac-Man style game for Arduino with an OLED display, joystick, and buzzer.

## Hardware Requirements

- Arduino Uno (or compatible board)
- SSD1306 OLED Display (128x64, I2C)
- Analog Joystick module
- Buzzer
- Connecting wires

### Pin Connections

| Component       | Arduino Pin |
|-----------------|-------------|
| Joystick X      | A0          |
| Joystick Y      | A1          |
| Joystick Button | 7           |
| Buzzer          | 8           |
| OLED SDA        | A4 (I2C)    |
| OLED SCL        | A5 (I2C)    |

## Software Requirements

- [arduino-cli](https://arduino.github.io/arduino-cli/) - Command-line interface for Arduino

### Installing arduino-cli

**macOS (Homebrew):**
```bash
brew install arduino-cli
```

**Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
```

**Windows:**
Download from [Arduino CLI releases](https://github.com/arduino/arduino-cli/releases)

## Quick Start

1. **Setup** (first time only):
   ```bash
   make setup
   ```
   This installs the Arduino AVR core and required libraries.

2. **Build** the sketch:
   ```bash
   make build
   ```

3. **Upload** to your Arduino:
   ```bash
   make upload
   ```

4. **Monitor** serial output:
   ```bash
   make monitor
   ```

## Makefile Targets

| Target         | Description                                      |
|----------------|--------------------------------------------------|
| `make build`   | Compile the sketch                               |
| `make upload`  | Compile and upload to Arduino                    |
| `make clean`   | Remove build artifacts                           |
| `make monitor` | Open serial monitor (9600 baud)                  |
| `make setup`   | Install core and libraries                       |
| `make info`    | Show current configuration                       |
| `make help`    | Show all available targets                       |

## Configuration

You can override default settings:

```bash
# Use a different board
make build BOARD_FQBN=arduino:avr:nano

# Specify serial port manually
make upload PORT=/dev/cu.usbmodem14101

# Use Arduino Mega
make upload BOARD_FQBN=arduino:avr:mega PORT=/dev/ttyACM0
```

## Game Instructions

- **Move**: Use the joystick to move your character (square)
- **Shoot**: Press the joystick button to fire
- **Collect food**: Eat the circles to reload ammo
- **Avoid/Kill monsters**: Triangle monsters chase you - shoot them!
- **Boss battles**: Every level up spawns a boss that requires 5 hits

## Libraries Used

- [Adafruit GFX Library](https://github.com/adafruit/Adafruit-GFX-Library)
- [Adafruit SSD1306](https://github.com/adafruit/Adafruit_SSD1306)
- [Adafruit BusIO](https://github.com/adafruit/Adafruit_BusIO)

## Project Structure

```
.
├── Game/
│   └── Game.ino      # Main Arduino sketch
├── Makefile          # Build automation
├── README.md         # This file
└── build/            # Compiled output (generated)
```

## License

This project is provided as-is for educational purposes.
