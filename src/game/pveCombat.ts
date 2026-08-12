import type { GameState, Level, TelekineticObject, Weapon } from './types';

const PICKUP_RANGE = 145;
const THROW_SPEED = 18;
const WAVE_DELAY_FRAMES = 120;
export const TOTAL_WAVES = 3;

export function createWaveEnemies(level: Level, wave: number) {
  const count = level.enemies.length + wave - 1;
  return Array.from({ length: count }, (_, index) => {
    const spawn = level.enemies[index % level.enemies.length];
    const group = Math.floor(index / level.enemies.length);
    const direction = index % 2 === 0 ? -1 : 1;
    return {
      x: spawn.x + group * direction * 55,
      y: spawn.y,
      vx: 0,
      vy: 0,
      theme: level.enemyTheme,
      phase: index * 37,
    };
  });
}
export function createWeapons(level: Level): Weapon[] {
  return level.enemies.map((enemy, id) => {
    const platform = level.platforms.find((item) => (
      enemy.x >= item.x && enemy.x <= item.x + item.w && enemy.y <= item.y
    ));
    const x = platform
      ? Math.max(platform.x + 24, Math.min(enemy.x - 70, platform.x + platform.w - 24))
      : Math.max(210, enemy.x - 80);
    const y = platform ? platform.y - 16 : enemy.y;
    return {
      id, x, y, homeX: x, homeY: y, vx: 0, vy: 0, rotation: id * 0.7,
      kind: id % 2 === 0 ? 'mallet' : 'spear', status: 'ready',
    };
  });
}
export function updatePveCombat(state: GameState, level: Level, usePower: boolean) {
  if (usePower) useWeapon(state);
  state.weapons.forEach((weapon) => updateWeapon(state, weapon));
  updateWaves(state, level);
}
export function updatePveEnemy(state: GameState, enemy: TelekineticObject) {
  if (enemy.vy === 0) {
    const direction = Math.sign(state.player.x - enemy.x);
    enemy.vx = Math.max(-2.2, Math.min(2.2, enemy.vx + direction * 0.08));
  }
  const touchingPlayer = Math.hypot(
    enemy.x - (state.player.x + state.player.w / 2),
    enemy.y - (state.player.y + state.player.h / 2),
  ) < 48;
  if (!touchingPlayer || state.player.pulse > 0) return;
  state.player.vx = Math.sign(state.player.x - enemy.x || 1) * 9;
  state.player.vy = -9;
  state.player.pulse = 26;
}
function updateWaves(state: GameState, level: Level) {
  const progress = state.pve;
  if (!progress || state.enemies.length > 0 || progress.complete) return;
  if (progress.wave === progress.totalWaves) {
    progress.complete = true;
    return;
  }
  if (progress.nextWaveIn === 0) progress.nextWaveIn = WAVE_DELAY_FRAMES;
  progress.nextWaveIn -= 1;
  if (progress.nextWaveIn > 0) return;
  progress.wave += 1;
  state.enemies = createWaveEnemies(level, progress.wave);
  state.weapons.forEach(resetWeapon);
}
function useWeapon(state: GameState) {
  const held = state.weapons.find((weapon) => weapon.status === 'held');
  if (held) {
    throwWeapon(state, held);
    return;
  }

  const centerX = state.player.x + state.player.w / 2;
  const centerY = state.player.y + state.player.h / 2;
  const nearest = state.weapons
    .filter((weapon) => weapon.status === 'ready')
    .map((weapon) => ({ weapon, distance: Math.hypot(weapon.x - centerX, weapon.y - centerY) }))
    .filter(({ distance }) => distance < PICKUP_RANGE)
    .sort((a, b) => a.distance - b.distance)[0]?.weapon;
  if (!nearest) return;
  nearest.status = 'held';
  nearest.vx = 0;
  nearest.vy = 0;
  state.player.pulse = 26;
}

function throwWeapon(state: GameState, weapon: Weapon) {
  const target = [...state.enemies].sort((a, b) => (
    Math.hypot(a.x - weapon.x, a.y - weapon.y) - Math.hypot(b.x - weapon.x, b.y - weapon.y)
  ))[0];
  const targetX = target?.x ?? weapon.x + state.player.facing * 300;
  const targetY = target?.y ?? weapon.y;
  const distance = Math.max(1, Math.hypot(targetX - weapon.x, targetY - weapon.y));
  weapon.vx = (targetX - weapon.x) / distance * THROW_SPEED;
  weapon.vy = (targetY - weapon.y) / distance * THROW_SPEED;
  weapon.status = 'thrown';
  state.player.pulse = 26;
}

function updateWeapon(state: GameState, weapon: Weapon) {
  if (weapon.status === 'held') {
    weapon.x = state.player.x + state.player.w / 2 + state.player.facing * 52;
    weapon.y = state.player.y + 18;
    weapon.rotation = state.player.facing > 0 ? -0.35 : Math.PI + 0.35;
    return;
  }
  if (weapon.status !== 'thrown') return;

  const previousY = weapon.y;
  weapon.x += weapon.vx;
  weapon.y += weapon.vy;
  weapon.vy += 0.25;
  weapon.rotation += weapon.vx * 0.035;
  const enemyIndex = state.enemies.findIndex((enemy) => (
    Math.hypot(enemy.x - weapon.x, enemy.y - weapon.y) < 42
  ));
  if (enemyIndex >= 0) {
    state.enemies.splice(enemyIndex, 1);
    resetWeapon(weapon);
    return;
  }

  const landing = state.platforms.find((platform) => (
    weapon.x >= platform.x && weapon.x <= platform.x + platform.w
    && previousY <= platform.y && weapon.y >= platform.y - 12 && weapon.vy >= 0
  ));
  if (landing) {
    weapon.y = landing.y - 14;
    weapon.vx = 0;
    weapon.vy = 0;
    weapon.status = 'ready';
  } else if (weapon.y > 680 || weapon.x < 0 || weapon.x > 2200) {
    resetWeapon(weapon);
  }
}

function resetWeapon(weapon: Weapon) {
  weapon.x = weapon.homeX;
  weapon.y = weapon.homeY;
  weapon.vx = 0;
  weapon.vy = 0;
  weapon.status = 'ready';
}
