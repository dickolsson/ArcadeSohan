# 🎮 Arcade Console Sohan

**A multi-game retro arcade console running on Arduino Uno!** Built to teach a 10-year-old about electronics and programming. 🚀

## 🕹️ What is this?

A complete **game console system** with:
- 🎯 **Multiple games** - Monster Hunter, Aventurier, Breakout, and more!
- 👤 **Unlockable characters** - Earn stars to unlock Blob, Bonhomme, Héros, Champion
- 📺 **OLED display** - Crisp 128×64 pixel graphics
- 🎵 **Sound effects** - Buzzer melodies for every action
- 🔧 **Modular architecture** - Easy to add new games!

## 🎪 Current Games

| Game | Type | Description |
|------|------|-------------|
| 🏹 **Monster Hunter** | Top-view shooter | Chase monsters, collect food, fight bosses! |
| 🏃 **Aventurier** | Platformer | Jump, run, reach the door! |
| 🧱 **Breakout** | Classic arcade | Bounce the ball, break bricks! |

## 🛠️ Hardware Setup

| Component | Pin | 
|-----------|-----|
| 📺 OLED SDA | A4 |
| 📺 OLED SCL | A5 |
| 🕹️ Joystick X | A0 |
| 🕹️ Joystick Y | A1 |
| 🕹️ Joystick Button | D7 |
| 🔊 Buzzer | D8 |

## ⚡ Quick Start

```bash
# 1️⃣ Setup (first time)
make setup

# 2️⃣ Build and upload
make upload

# 3️⃣ Play! 🎮
```

## 🎯 System Features

- ✨ **Character unlock system** - Earn stars to unlock new heroes
- 🎨 **Smart rendering** - Page buffer mode (saves RAM!)
- 🔧 **Game templates** - Quick-start structure for new games
- 💾 **Memory optimized** - Works within Arduino Uno's 2KB RAM
- 📦 **Object pools** - Efficient management of bullets, coins, enemies
- 🎲 **Procedural generation** - Infinite levels without using RAM
- 🔊 **Sound library** - Pre-made melodies for every action

## 📚 Documentation

Full docs in `.github/instructions/` covering:
- Display, Input, Physics, Objects, Characters
- Memory management & optimization
- Creating new games step-by-step

**Website:** 🌐 [https://dickolsson.github.io/ArcadeSohan/](https://dickolsson.github.io/ArcadeSohan/)

*Local preview:* `make serve-website` or check out `website/` folder

## 🎓 Educational Project

This project teaches:
- 🔌 Electronics & circuit design
- 💻 C/C++ programming
- 🎮 Game development fundamentals
- 🧠 Memory optimization techniques
- 🏗️ Software architecture

Perfect for beginners aged 10+ learning Arduino! 🚀
