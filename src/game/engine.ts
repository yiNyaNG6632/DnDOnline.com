import type { GameMode, GameState, Level, Rect } from './types';
import { tryJumpFromSplit, updateSplitJump } from './splitJump';
import { squashOnLanding, stretchForJump, updateSlimePhysics } from './slimePhysics';
import { updatePlatformTelekinesis } from './telekinesis';
import { createWaveEnemies, createWeapons, TOTAL_WAVES, updatePveCombat } from './pveCombat';
import { updateEnemies } from './enemyPhysics';

const WORLD_END = 2200;
export type GameActions = { jump: boolean; split: boolean; power: boolean };

export function createState(level: Level, mode: GameMode = 'normal'): GameState {
  return {
    player: {
      x: 70, y: 540, w: 48, h: 62, vx: 0, vy: 0, grounded: false,
      canDoubleJump: false, splitUsed: false, splitCount: 0, facing: 1, pulse: 0,
      slimeSquash: 0, slimeSquashSpeed: 0, slimeTilt: 0,
    },
    platforms: level.platforms.map((platform) => ({
      ...platform,
      movable: mode === 'hard' ? false : platform.movable,
    })),
    selectedPlatform: null,
    splitPart: null,
    weapons: mode === 'pve' ? createWeapons(level) : [],
    pve: mode === 'pve' ? { wave: 1, totalWaves: TOTAL_WAVES, nextWaveIn: 0, complete: false } : null,
    stars: level.stars.map(() => false),
    enemies: mode === 'pve'
      ? createWaveEnemies(level, 1)
      : level.enemies.map((enemy, index) => ({
        ...enemy, vx: 0, vy: 0, theme: level.enemyTheme, phase: index * 37,
      })),
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

export function updateGame(
  state: GameState,
  level: Level,
  keys: Set<string>,
  actions: GameActions,
  mode: GameMode = 'normal',
) {
  const player = state.player;
  const usingTelekinesis = updatePlatformTelekinesis(state, keys);
  if (mode === 'pve') updatePveCombat(state, level, actions.power);
  else if (actions.power) pushEnemies(state);
  updateSplitJump(state, actions.split);
  if (usingTelekinesis) player.vx *= 0.7;
  else movePlayer(state, keys, actions.jump);
  applyGravityAndCollisions(state);
  updateSlimePhysics(player);
  if (player.y > 720) resetPlayer(state, level);
  collectStars(state, level);
  updateEnemies(state, mode);
  player.pulse = Math.max(0, player.pulse - 1);
  const objectivesComplete = state.stars.every(Boolean) && (mode !== 'pve' || state.pve?.complete);
  if (objectivesComplete && Math.hypot(player.x - level.exit.x, player.y - level.exit.y) < 100) state.won = true;
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

function movePlayer(state: GameState, keys: Set<string>, jumpPressed: boolean) {
  const player = state.player;
  const direction = inputAxis(keys, ['a', 'arrowleft'], ['d', 'arrowright']);
  player.vx += direction === 0 ? -player.vx * 0.13 : direction * 0.62;
  player.vx = Math.max(-6, Math.min(6, player.vx));
  if (direction) player.facing = direction;
  if (jumpPressed && player.grounded) {
    player.vy = -13.5;
    player.grounded = false;
    player.canDoubleJump = true;
    player.splitUsed = false;
    player.splitCount = 0;
    stretchForJump(player);
  } else if (jumpPressed && tryJumpFromSplit(state)) {
    player.vy = -12.5;
    player.pulse = 18;
    stretchForJump(player);
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
      const impactSpeed = player.vy;
      player.y = platform.y - player.h;
      player.vy = 0;
      player.grounded = true;
      player.canDoubleJump = false;
      player.splitUsed = false;
      player.splitCount = 0;
      state.splitPart = null;
      if (impactSpeed > 3) squashOnLanding(player, impactSpeed);
      if (impactSpeed > 11.5) {
        player.vy = -Math.min(2.2, (impactSpeed - 9) * 0.45);
        player.grounded = false;
      }
    }
  }
}

function resetPlayer(state: GameState, level: Level) {
  const fresh = createState(level);
  Object.assign(state.player, fresh.player);
  state.splitPart = null;
  state.selectedPlatform = null;
}

function collectStars(state: GameState, level: Level) {
  level.stars.forEach((star, index) => {
    if (Math.hypot(state.player.x + 24 - star.x, state.player.y + 30 - star.y) < 52) state.stars[index] = true;
  });
}
