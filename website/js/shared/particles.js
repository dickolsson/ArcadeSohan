// ==========================================================
// ✨ SHARED PARTICLES — Système de particules (Particle system)
// Étincelles, poussière, explosions — utilisé par tous les jeux
// (Used by all Arcade Sohan games)
// ==========================================================

// Liste de toutes les particules actives (All active particles)
const particles = [];

// Créer des particules (Create particles)
export function spawnParticles(x, y, color, count, options = {}) {
  const {
    speedX = 6,
    speedY = 5,
    gravity = 0.15,
    life = 40,
    sizeMin = 2,
    sizeMax = 6,
  } = options;

  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * speedX,
      vy: -Math.random() * speedY - 1,
      life: life + Math.random() * 20,
      maxLife: life + 20,
      color,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      gravity,
    });
  }
}

// Créer une explosion de particules (Create particle explosion)
export function spawnExplosion(x, y, colors, count) {
  colors.forEach(color => {
    spawnParticles(x, y, color, Math.floor(count / colors.length), {
      speedX: 10,
      speedY: 8,
      life: 50,
    });
  });
}

// Créer des particules de poussière au sol (Create dust particles)
export function spawnDust(x, y, color) {
  spawnParticles(x, y, color || '#C4A882', 5, {
    speedX: 3,
    speedY: 2,
    gravity: 0.05,
    life: 25,
    sizeMin: 1,
    sizeMax: 3,
  });
}

// Mettre à jour les particules (Update particles)
export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Dessiner les particules (Draw particles)
export function drawParticles(ctx, cameraX) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - cameraX, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// Vider toutes les particules (Clear all particles)
export function clearParticles() {
  particles.length = 0;
}
