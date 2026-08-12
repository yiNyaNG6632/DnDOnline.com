import type { GameState, Level, Rect } from './types';

const WORLD_END = 2200;
export type GameActions = { jump: boolean; power: boolean };

export function createState(level: Level): GameState {
  return {
    player: { x: 70, y: 540, w: 48, h: 62, vx: 0, vy: 0, grounded: false, canDoubleJump: false, facing: 1, pulse: 0 },
    platforms: level.platforms.map((platform) => ({ ...platform })),
    stars: level.stars.map(() => false),
    enemies: [],
    won: false,
  };
}

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function inputAxis(keys: Set<string>, negative: string[], positive: string[]) {
  const low = negative.some((key) => keys.has(key));
  const high = positive.some((key) => keys.has(key));
  return Number(high) - Number(low);
}

export function updateGame(state: GameState, level: Level, keys: Set<string>, actions: GameActions) {
  const player = state.player;
  if (actions.power) pushEnemies(state);
  movePlayer(player, keys, actions.jump);
  applyGravityAndCollisions(state);
  if (player.y > 720) resetPlayer(state, level);
  collectStars(state, level);
  updateEnemies(state);
  player.pulse = Math.max(0, player.pulse - 1);
  if (state.stars.every(Boolean) && Math.hypot(player.x - level.exit.x, player.y - level.exit.y) < 100) state.won = true;
}

function pushEnemies(state: GameState) {
  const player = state.player;
  player.pulse = 26;
  state.enemies.forEach((enemy) => {
    const dx = enemy.x - player.x;
    if (Math.abs(dx) < 210 && Math.abs(enemy.y - player.y) < 140 && dx * player.facing > -30) {
      enemy.vx = player.facing * 13;
      enemy.vy = -7;
    }
  });
}

function movePlayer(player: GameState['player'], keys: Set<string>, jumpPressed: boolean) {
  const direction = inputAxis(keys, ['a', 'arrowleft'], ['d', 'arrowright']);
  player.vx += direction === 0 ? -player.vx * 0.18 : direction * 0.75;
  player.vx = Math.max(-6, Math.min(6, player.vx));
  if (direction) player.facing = direction;
  if (jumpPressed && player.grounded) {
    player.vy = -13.5;
    player.grounded = false;
    player.canDoubleJump = true;
  } else if (jumpPressed && player.canDoubleJump) {
    player.vy = -12.5;
    player.canDoubleJump = false;
    player.pulse = 18;
  }
}

function applyGravityAndCollisions(state: GameState) {
  const player = state.player;
  player.vy = Math.min(player.vy + 0.7, 16);
  player.x = Math.max(0, Math.min(WORLD_END - player.w, player.x + player.vx));
  player.y += player.vy;
  player.grounded = false;
  for (const platform of state.platforms) {
    if (overlaps(player, platform) && player.vy >= 0 && player.y + player.h - player.vy <= platform.y + 8) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.grounded = true;
      player.canDoubleJump = false;
    }
  }
}

function resetPlayer(state: GameState, level: Level) {
  const fresh = createState(level);
  Object.assign(state.player, fresh.player);
}

function collectStars(state: GameState, level: Level) {
  level.stars.forEach((star, index) => {
    if (Math.hypot(state.player.x + 24 - star.x, state.player.y + 30 - star.y) < 52) state.stars[index] = true;
  });
}

function updateEnemies(state: GameState) {
  state.enemies.forEach((enemy) => {
    const previousY = enemy.y;
    enemy.vy = Math.min(enemy.vy + 0.55, 14);
    enemy.x = Math.max(22, Math.min(WORLD_END - 22, enemy.x + enemy.vx));
    enemy.y += enemy.vy;
    enemy.vx *= 0.96;
    const landingY = state.platforms
      .filter((platform) => enemy.x >= platform.x && enemy.x <= platform.x + platform.w)
      .map((platform) => platform.y - 40)
      .filter((y) => y >= previousY - 2 && enemy.y >= y)
      .sort((a, b) => a - b)[0];
    if (landingY !== undefined && enemy.vy >= 0) {
      enemy.y = landingY;
      enemy.vy = 0;
      if (Math.abs(enemy.vx) < 0.08) enemy.vx = 0;
    }
  });
}
