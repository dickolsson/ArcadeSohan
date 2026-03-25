// ==========================================================
// 🔊 AUDIO — Système sonore (Sound system)
// Web Audio API — sons et ambiances par niveau
// ==========================================================

// Contexte audio (Audio context)
let audioCtx = null;
let masterVolume = null;
let initialized = false;
let muted = false;

// Initialiser l'audio (Initialize audio)
export function initAudio() {
  if (initialized) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterVolume = audioCtx.createGain();
    masterVolume.gain.value = 0.3;
    masterVolume.connect(audioCtx.destination);
    initialized = true;
  } catch (e) {
    console.warn('Audio non disponible (Audio not available):', e);
  }
}

// Couper/remettre le son (Mute/unmute)
export function toggleMute() {
  muted = !muted;
  if (masterVolume) {
    masterVolume.gain.value = muted ? 0 : 0.3;
  }
  return muted;
}

export function isMuted() { return muted; }

// === SONS SIMPLES (Simple sounds) ===

// Jouer une note (Play a note)
function playTone(freq, duration, type = 'square', vol = 0.2) {
  if (!initialized || muted) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(masterVolume);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignorer les erreurs audio (Ignore audio errors)
  }
}

// Bruit (Noise)
function playNoise(duration, vol = 0.1) {
  if (!initialized || muted) return;
  try {
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * vol;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    source.connect(gain);
    gain.connect(masterVolume);
    source.start();
  } catch (e) {
    // Ignorer
  }
}

// === EFFETS SONORES (Sound effects) ===

export function sfxJump() {
  playTone(400, 0.1, 'square', 0.15);
  setTimeout(() => playTone(600, 0.1, 'square', 0.1), 50);
}

export function sfxCoin() {
  playTone(800, 0.08, 'square', 0.15);
  setTimeout(() => playTone(1200, 0.12, 'square', 0.12), 60);
}

export function sfxHit() {
  playNoise(0.15, 0.2);
  playTone(150, 0.2, 'sawtooth', 0.15);
}

export function sfxEnemyKill() {
  playTone(300, 0.08, 'square', 0.12);
  setTimeout(() => playTone(500, 0.08, 'square', 0.12), 50);
  setTimeout(() => playTone(700, 0.12, 'square', 0.1), 100);
}

export function sfxBossHit() {
  playTone(200, 0.15, 'sawtooth', 0.2);
  playNoise(0.1, 0.15);
}

export function sfxLevelWin() {
  const notes = [523, 659, 784, 1047]; // Do Mi Sol Do
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.2, 'square', 0.15), i * 120);
  });
}

export function sfxGameOver() {
  const notes = [400, 350, 300, 200];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.25, 'sawtooth', 0.12), i * 200);
  });
}

export function sfxEvolution() {
  const notes = [400, 500, 600, 700, 800, 1000];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.15, 'square', 0.12), i * 80);
  });
}

export function sfxDash() {
  playTone(300, 0.08, 'sawtooth', 0.1);
  playTone(600, 0.1, 'sawtooth', 0.08);
}

export function sfxShield() {
  playTone(1000, 0.15, 'sine', 0.1);
  playTone(1200, 0.2, 'sine', 0.08);
}

export function sfxProjectile() {
  playTone(250, 0.1, 'square', 0.1);
}

export function sfxTurbo() {
  playTone(200, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playTone(400, 0.3, 'sawtooth', 0.12), 100);
}

export function sfxClick() {
  playTone(800, 0.05, 'square', 0.1);
}

export function sfxBossDefeat() {
  const notes = [300, 400, 500, 600, 700, 800, 900, 1100];
  notes.forEach((n, i) => {
    setTimeout(() => {
      playTone(n, 0.2, 'square', 0.15);
      if (i > 4) playNoise(0.1, 0.1);
    }, i * 100);
  });
}

export function sfxVictory() {
  const melody = [523, 523, 523, 659, 784, 784, 659, 784, 1047];
  melody.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.25, 'square', 0.15), i * 150);
  });
}
