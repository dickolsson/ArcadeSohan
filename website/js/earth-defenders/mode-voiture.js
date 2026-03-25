// ==========================================================
// 🚗 MODE-VOITURE — Course + Combat (Car race + Combat)
// Voies, rival IA, projectiles, turbo, bonus
// ==========================================================

import { GAME_W, GAME_H, CAR_LANES, CAR_LANE_HEIGHT, CAR_SPEED, CAR_TURBO_MULT, CAR_TURBO_DURATION, CAR_EVOLUTION, COLORS } from './config.js';
import { random, randomInt, clamp, roundRect } from '../shared/utils.js';
import { isUp, isDown, isRight, isLeft, isAction } from '../shared/input.js';
import { spawnParticles, spawnExplosion } from '../shared/particles.js';

// === ÉTAT DU MODE VOITURE (Car mode state) ===
const car = {
  lane: 1,         // Voie actuelle 0-2 (Current lane)
  x: 150,
  y: 0,
  w: 50,
  h: 30,
  speed: 3,
  turboTimer: 0,
  shieldActive: false,
  evolutionLevel: 0,
  targetY: 0,
};

const rival = {
  lane: 1,
  x: 600,
  y: 0,
  w: 50,
  h: 30,
  speed: 2.8,
  stunTimer: 0,
  hp: 5,
  maxHp: 5,
};

let projectiles = [];    // Nos projectiles (Our projectiles)
let rivalProjectiles = []; // Projectiles du rival (Rival projectiles)
let bonuses = [];        // Bonus sur la route (Road bonuses)
let roadOffset = 0;      // Défilement de la route (Road scrolling)
let raceDistance = 0;
let raceGoal = 3000;     // Distance pour finir le niveau (Distance to finish)

// Positions Y des voies (Lane Y positions)
function laneY(lane) {
  const roadTop = 120;
  return roadTop + lane * CAR_LANE_HEIGHT + CAR_LANE_HEIGHT / 2 - 15;
}

// === INITIALISER LE MODE VOITURE (Initialize car mode) ===
export function initCarMode(levelNum) {
  car.lane = 1;
  car.x = 150;
  car.speed = CAR_SPEED + levelNum * 0.2;
  car.turboTimer = 0;
  car.shieldActive = false;
  car.y = laneY(car.lane);
  car.targetY = car.y;

  rival.lane = 1;
  rival.x = 600;
  rival.speed = car.speed - 0.3;
  rival.stunTimer = 0;
  rival.hp = 4 + levelNum;
  rival.maxHp = rival.hp;
  rival.y = laneY(rival.lane);

  projectiles = [];
  rivalProjectiles = [];
  bonuses = [];
  roadOffset = 0;
  raceDistance = 0;
  raceGoal = 2500 + levelNum * 500;

  // Générer des bonus initiaux (Generate initial bonuses)
  for (let i = 0; i < 8; i++) {
    spawnBonus(400 + i * 300);
  }
}

function spawnBonus(x) {
  const types = ['coin', 'coin', 'coin', 'turbo', 'shield', 'heart'];
  bonuses.push({
    x: x || GAME_W + random(100, 400),
    y: laneY(randomInt(0, CAR_LANES - 1)) + 5,
    w: 20, h: 20,
    type: types[randomInt(0, types.length - 1)],
    collected: false,
  });
}

// === METTRE À JOUR LE MODE VOITURE (Update car mode) ===
export function updateCarMode(game) {
  const evo = CAR_EVOLUTION[car.evolutionLevel] || CAR_EVOLUTION[0];
  const speed = car.speed * evo.vitesse;
  const turboActive = car.turboTimer > 0;
  const effectiveSpeed = turboActive ? speed * CAR_TURBO_MULT : speed;

  // Changement de voie (Lane change)
  if (isUp() && car.lane > 0) {
    car.lane--;
    car.targetY = laneY(car.lane);
  }
  if (isDown() && car.lane < CAR_LANES - 1) {
    car.lane++;
    car.targetY = laneY(car.lane);
  }

  // Mouvement doux vers la voie (Smooth lane movement)
  car.y += (car.targetY - car.y) * 0.1;

  // Accélérer / ralentir
  if (isRight()) car.x = clamp(car.x + 2, 50, GAME_W / 2 - 50);
  if (isLeft()) car.x = clamp(car.x - 2, 50, GAME_W / 2 - 50);

  // Turbo
  if (car.turboTimer > 0) car.turboTimer--;

  // Lancer un projectile (Fire projectile)
  if (isAction() && projectiles.length < 3) {
    const availableObjects = evo.objets;
    const type = availableObjects[randomInt(0, availableObjects.length - 1)];
    projectiles.push({
      x: car.x + car.w,
      y: car.y + car.h / 2 - 5,
      w: 12, h: 10,
      vx: 6,
      type,
    });
  }

  // Avancer la course (Advance race)
  raceDistance += effectiveSpeed;
  roadOffset = (roadOffset + effectiveSpeed) % 40;

  // Décaler les bonus et le rival (Scroll bonuses and rival)
  for (const b of bonuses) {
    b.x -= effectiveSpeed - CAR_SPEED;
  }

  // IA du rival (Rival AI)
  if (rival.stunTimer > 0) {
    rival.stunTimer--;
  } else {
    // Changement de voie aléatoire (Random lane change)
    if (Math.random() < 0.01) {
      rival.lane = clamp(rival.lane + (Math.random() < 0.5 ? -1 : 1), 0, CAR_LANES - 1);
    }
    rival.y += (laneY(rival.lane) - rival.y) * 0.07;

    // Le rival lance des projectiles (Rival fires projectiles)
    if (Math.random() < 0.008 && rivalProjectiles.length < 2) {
      rivalProjectiles.push({
        x: rival.x - 10,
        y: rival.y + rival.h / 2 - 5,
        w: 12, h: 10,
        vx: -4.5,
        type: 'bomb',
      });
    }
  }

  // Mettre à jour les projectiles (Update projectiles)
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].x += projectiles[i].vx;
    if (projectiles[i].x > GAME_W + 50) {
      projectiles.splice(i, 1);
      continue;
    }
    // Collision avec le rival (Collision with rival)
    if (rival.stunTimer <= 0 && hitTest(projectiles[i], rival)) {
      rival.hp--;
      rival.stunTimer = applyProjectileEffect(projectiles[i].type);
      spawnExplosion(rival.x + rival.w / 2, rival.y + rival.h / 2, ['#FF6F91', '#FFE66D'], 12);
      projectiles.splice(i, 1);
      game.score += 25;
    }
  }

  // Mettre à jour projectiles du rival (Update rival projectiles)
  for (let i = rivalProjectiles.length - 1; i >= 0; i--) {
    rivalProjectiles[i].x += rivalProjectiles[i].vx;
    if (rivalProjectiles[i].x < -50) {
      rivalProjectiles.splice(i, 1);
      continue;
    }
    // Collision avec nous (Collision with player car)
    if (hitTest(rivalProjectiles[i], { x: car.x, y: car.y, w: car.w, h: car.h })) {
      rivalProjectiles.splice(i, 1);
      if (car.shieldActive) {
        car.shieldActive = false;
        spawnParticles(car.x + car.w / 2, car.y, COLORS.cyan, 10);
      } else {
        return 'hit'; // Le joueur est touché (Player is hit)
      }
    }
  }

  // Vérifier les bonus (Check bonuses)
  for (let i = bonuses.length - 1; i >= 0; i--) {
    const b = bonuses[i];
    if (b.x < -50) {
      bonuses.splice(i, 1);
      continue;
    }
    if (!b.collected && hitTest({ x: car.x, y: car.y, w: car.w, h: car.h }, b)) {
      b.collected = true;
      switch (b.type) {
        case 'coin': game.score += 10; game.coins++; break;
        case 'turbo': car.turboTimer = CAR_TURBO_DURATION; break;
        case 'shield': car.shieldActive = true; break;
        case 'heart': return 'heart'; // Vie gagnée (Life gained)
      }
      spawnParticles(b.x + 10, b.y + 10, '#FFE66D', 6);
      bonuses.splice(i, 1);
    }
  }

  // Générer de nouveaux bonus (Spawn new bonuses)
  if (Math.random() < 0.02) spawnBonus();

  // Vérifier fin de course (Check race end)
  if (raceDistance >= raceGoal) return 'win';
  if (rival.hp <= 0) return 'win';

  return null;
}

function hitTest(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function applyProjectileEffect(type) {
  switch (type) {
    case 'stone': return 30;     // Ralenti 0.5s (Slow 0.5s)
    case 'oil': return 45;       // Glisse 0.75s (Slip 0.75s)
    case 'bomb': return 120;     // Arrêt 2s (Stop 2s)
    case 'lightning': return 90; // Confus 1.5s (Confused 1.5s)
    default: return 30;
  }
}

// === DESSIN DU MODE VOITURE (Draw car mode) ===
export function drawCarMode(ctx, frameCount, themeColors) {
  const roadTop = 120;
  const roadHeight = CAR_LANES * CAR_LANE_HEIGHT;

  // Route (Road)
  ctx.fillStyle = '#333';
  ctx.fillRect(0, roadTop, GAME_W, roadHeight);

  // Lignes de la route (Road lines)
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 20]);
  for (let l = 1; l < CAR_LANES; l++) {
    const ly = roadTop + l * CAR_LANE_HEIGHT;
    ctx.beginPath();
    ctx.moveTo(-roadOffset, ly);
    for (let x = -roadOffset; x < GAME_W + 40; x += 40) {
      ctx.moveTo(x, ly);
      ctx.lineTo(x + 20, ly);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Bordures de route (Road borders)
  ctx.fillStyle = '#FF6F91';
  ctx.fillRect(0, roadTop - 4, GAME_W, 4);
  ctx.fillRect(0, roadTop + roadHeight, GAME_W, 4);

  // Barre de progression de la course (Race progress bar)
  const progressW = GAME_W - 100;
  ctx.fillStyle = '#222';
  ctx.fillRect(50, 20, progressW, 16);
  const ratio = clamp(raceDistance / raceGoal, 0, 1);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(50, 20, progressW * ratio, 16);
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(50, 20, progressW, 16);

  // Icônes sur la barre (Icons on progress bar)
  ctx.font = '14px serif';
  ctx.fillText('🚗', 50 + progressW * ratio - 10, 35);
  ctx.fillText('🏁', 50 + progressW - 12, 35);

  // Turbo indicator
  if (car.turboTimer > 0) {
    ctx.fillStyle = COLORS.yellow;
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ TURBO! ⚡', GAME_W / 2, 55);
    ctx.textAlign = 'left';
  }

  // Bonus (Bonuses)
  for (const b of bonuses) {
    if (b.collected || b.x < -30 || b.x > GAME_W + 30) continue;
    const emoji = { coin: '💰', turbo: '⚡', shield: '🛡️', heart: '❤️' }[b.type] || '💎';
    ctx.font = '18px serif';
    ctx.fillText(emoji, b.x, b.y + 16);
  }

  // Notre voiture (Our car)
  drawCar(ctx, car.x, car.y, car.w, car.h, CAR_EVOLUTION[car.evolutionLevel].couleur || '#4FC3F7', frameCount, car.turboTimer > 0, car.shieldActive);

  // Rival
  if (rival.stunTimer > 0 && Math.floor(rival.stunTimer / 4) % 2 === 0) {
    ctx.globalAlpha = 0.5;
  }
  drawRivalCar(ctx, rival.x, rival.y, rival.w, rival.h, frameCount);
  ctx.globalAlpha = 1;

  // Barre de vie du rival (Rival health bar)
  if (rival.hp > 0) {
    const barW = 50;
    ctx.fillStyle = '#333';
    ctx.fillRect(rival.x, rival.y - 12, barW, 6);
    ctx.fillStyle = rival.hp / rival.maxHp > 0.5 ? COLORS.green : COLORS.red;
    ctx.fillRect(rival.x, rival.y - 12, barW * (rival.hp / rival.maxHp), 6);
  }

  // Projectiles
  for (const p of projectiles) {
    const emoji = { stone: '🪨', oil: '🛢️', bomb: '💣', lightning: '⚡' }[p.type] || '💥';
    ctx.font = '14px serif';
    ctx.fillText(emoji, p.x, p.y + 12);
  }
  for (const p of rivalProjectiles) {
    ctx.font = '14px serif';
    ctx.fillText('💣', p.x, p.y + 12);
  }

  // Info en bas (Bottom info)
  ctx.fillStyle = '#888';
  ctx.font = '8px "Press Start 2P", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('⬆️⬇️ Voie | ESPACE Lancer | ➡️ Accélérer', GAME_W / 2, GAME_H - 15);
  ctx.textAlign = 'left';
}

function drawCar(ctx, x, y, w, h, color, frame, turbo, shield) {
  // Corps de la voiture (Car body)
  ctx.fillStyle = color || '#4FC3F7';
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();

  // Toit (Roof)
  ctx.fillStyle = '#FFFFFF33';
  ctx.fillRect(x + 12, y + 2, w - 24, h / 2);

  // Roues (Wheels)
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 4, y + h - 4, 10, 6);
  ctx.fillRect(x + w - 14, y + h - 4, 10, 6);

  // Phares (Headlights)
  ctx.fillStyle = '#FFE66D';
  ctx.fillRect(x + w - 2, y + 4, 4, 6);
  ctx.fillRect(x + w - 2, y + h - 10, 4, 6);

  // Flammes du turbo (Turbo flames)
  if (turbo) {
    const flameLen = 10 + Math.sin(frame * 0.3) * 5;
    ctx.fillStyle = '#FF6F00';
    ctx.fillRect(x - flameLen, y + h / 2 - 5, flameLen, 10);
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(x - flameLen / 2, y + h / 2 - 3, flameLen / 2, 6);
  }

  // Bouclier (Shield)
  if (shield) {
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.1) * 0.3;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w / 2 + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawRivalCar(ctx, x, y, w, h, frame) {
  // Rival : voiture noire avec flammes (Rival: black car with flames)
  ctx.fillStyle = '#333';
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();

  // Flammes décoratives (Decorative flames)
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(x + 5, y + 3, 8, 4);
  ctx.fillRect(x + 5, y + h - 7, 8, 4);

  // Toit sombre (Dark roof)
  ctx.fillStyle = '#1A1A2E';
  ctx.fillRect(x + 12, y + 2, w - 24, h / 2);

  // Roues (Wheels)
  ctx.fillStyle = '#222';
  ctx.fillRect(x + 4, y + h - 4, 10, 6);
  ctx.fillRect(x + w - 14, y + h - 4, 10, 6);

  // Yeux rouges (Red eyes / lights)
  ctx.fillStyle = '#FF1744';
  ctx.fillRect(x + w - 2, y + 4, 4, 4);
  ctx.fillRect(x + w - 2, y + h - 8, 4, 4);

  // Crâne (Skull emoji)
  ctx.font = '12px serif';
  ctx.fillText('💀', x + w / 2 - 6, y - 4);
}

// Obtenir l'état du mode voiture pour le main.js
export function getCarState() {
  return { car, rival, raceDistance, raceGoal };
}

export function evolveCarMode() {
  if (car.evolutionLevel < CAR_EVOLUTION.length - 1) {
    car.evolutionLevel++;
  }
}
