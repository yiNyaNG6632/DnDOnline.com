import type { GameState, TelekineticObject } from './types';

export function applyEnemyGimmick(state: GameState, enemy: TelekineticObject) {
  enemy.phase += 1;
  const grounded = enemy.vy === 0;
  const dx = state.player.x - enemy.x;

  switch (enemy.theme) {
    case 'bedroom':
      if (enemy.phase % 180 < 48) enemy.vx *= 0.72;
      break;
    case 'workshop':
      if (grounded && enemy.phase % 145 === 0) enemy.vy = -8.5;
      break;
    case 'attic':
      enemy.vy = Math.sin(enemy.phase * 0.055) * 1.1 - 0.55;
      break;
    case 'clockwork':
      if (grounded && enemy.phase % 130 === 0) enemy.vx = Math.sign(dx || 1) * 7;
      break;
    case 'studio':
      if (grounded && enemy.phase % 75 === 0) enemy.vx = Math.sign(dx || 1) * (enemy.phase % 150 ? 4 : -4);
      break;
    case 'dream':
      if (enemy.phase % 230 === 0) enemy.x = clamp(state.player.x - Math.sign(dx || 1) * 170, 30, 2150);
      break;
    case 'greenhouse':
      if (grounded && enemy.phase % 105 === 0) enemy.vy = -11;
      break;
    case 'theatre':
      if (grounded && Math.abs(dx) < 360) enemy.vx += Math.sign(dx || 1) * 0.16;
      break;
    case 'storm':
      if (enemy.phase % 180 === 0 && Math.abs(dx) < 270) gustPlayer(state, enemy);
      break;
  }
}

function gustPlayer(state: GameState, enemy: TelekineticObject) {
  const direction = Math.sign(state.player.x - enemy.x || 1);
  state.player.vx = direction * 11;
  state.player.vy = -6;
  state.player.pulse = 26;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
