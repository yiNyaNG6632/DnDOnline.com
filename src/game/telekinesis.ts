import type { ControlScheme, GameState, Platform } from './types';

const PLATFORM_SPEED = 3.5;
const POWER_RANGE = 520;

function inputAxis(keys: Set<string>, negative: string[], positive: string[]) {
  const low = negative.some((key) => keys.has(key));
  const high = positive.some((key) => keys.has(key));
  return Number(high) - Number(low);
}

export function updatePlatformTelekinesis(
  state: GameState,
  keys: Set<string>,
  canUsePower: boolean,
  controls: ControlScheme,
) {
  if (!keys.has('e') || !canUsePower) {
    state.selectedPlatform = null;
    return false;
  }

  state.selectedPlatform = nearestMovablePlatform(state);
  if (state.selectedPlatform === null) return false;
  movePlatform(state, state.platforms[state.selectedPlatform], keys, controls);
  return true;
}

function nearestMovablePlatform(state: GameState) {
  const playerX = state.player.x + state.player.w / 2;
  const playerY = state.player.y + state.player.h / 2;
  let nearestIndex: number | null = null;
  let nearestDistance = Infinity;

  state.platforms.forEach((platform, index) => {
    if (!platform.movable) return;
    const distance = Math.hypot(platform.x + platform.w / 2 - playerX, platform.y - playerY);
    if (distance < POWER_RANGE && distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  });
  return nearestIndex;
}

function movePlatform(state: GameState, platform: Platform, keys: Set<string>, controls: ControlScheme) {
  const area = platform.moveArea;
  if (!area) return;
  const oldX = platform.x;
  const oldY = platform.y;
  const horizontal = controls === 'wasd'
    ? inputAxis(keys, ['a'], ['d']) : inputAxis(keys, ['arrowleft'], ['arrowright']);
  const vertical = controls === 'wasd'
    ? inputAxis(keys, ['w'], ['s']) : inputAxis(keys, ['arrowup'], ['arrowdown']);
  platform.x = Math.max(area.minX, Math.min(area.maxX, platform.x + horizontal * PLATFORM_SPEED));
  platform.y = Math.max(area.minY, Math.min(area.maxY, platform.y + vertical * PLATFORM_SPEED));
  carryRider(state, platform, platform.x - oldX, platform.y - oldY, oldX, oldY);
}

function carryRider(state: GameState, platform: Platform, dx: number, dy: number, oldX: number, oldY: number) {
  const player = state.player;
  const wasStanding = Math.abs(player.y + player.h - oldY) < 5
    && player.x + player.w > oldX && player.x < oldX + platform.w;
  if (!wasStanding) return;
  player.x += dx;
  player.y += dy;
  player.grounded = true;
}
