import type { ControlScheme, GameState, Level } from './types';
import { tryJumpFromSplit, updateSplitJump } from './splitJump';
import { stretchForJump, updateSlimePhysics } from './slimePhysics';
import { updatePlatformTelekinesis } from './telekinesis';
import { pushEnemies, updateEnemies } from './enemyPhysics';
import { DEFAULT_ENEMY_STRATEGY } from './enemyStrategy';
import {
  hasEnergy, MAX_ENERGY, PUSH_ENERGY_COST, recoverEnergy, spendEnergy, TELEKINESIS_DRAIN,
} from './playerEnergy';
import { updateSecretAreas } from './secretAreas';
import { updateDropThrough } from './platformDrop';
import { movePlayerWithCollisions } from './playerCollisions';

export type GameActions = { jump: boolean; split: boolean; power: boolean };

export function createState(level: Level): GameState {
  return {
    player: {
      x: level.spawn.x, y: level.spawn.y, w: 48, h: 62, vx: 0, vy: 0, grounded: false,
      canDoubleJump: false, splitUsed: false, splitCount: 0, facing: 1, pulse: 0,
      slimeSquash: 0, slimeSquashSpeed: 0, slimeTilt: 0,
      health: 3, invulnerableFrames: 0, energy: MAX_ENERGY, energyRegenDelay: 0,
    },
    platforms: level.platforms.map((platform) => ({ ...platform })),
    selectedPlatform: null,
    splitPart: null,
    stars: level.stars.map(() => false),
    discoveredSecrets: level.secrets.map(() => false),
    activeSecret: null,
    secretNoticeFrames: 0,
    dropThroughFrames: 0,
    dropInputReleased: true,
    enemies: level.enemies.map((enemy, index) => ({
      ...enemy, vx: 0, vy: 0, theme: level.enemyTheme, phase: index * 37,
      health: 2, attackTimer: 30 + index * 18,
    })),
    enemyStrategy: DEFAULT_ENEMY_STRATEGY,
    won: false,
    lost: false,
  };
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
  controls: ControlScheme,
) {
  const player = state.player;
  recoverEnergy(player, keys.has('e'));
  if (actions.power && hasEnergy(player, PUSH_ENERGY_COST) && pushEnemies(state)) {
    spendEnergy(player, PUSH_ENERGY_COST);
  }
  const canMovePlatform = hasEnergy(player, TELEKINESIS_DRAIN);
  const usingTelekinesis = updatePlatformTelekinesis(state, keys, canMovePlatform, controls);
  if (usingTelekinesis) spendEnergy(player, TELEKINESIS_DRAIN);
  updateSplitJump(state, actions.split);
  if (usingTelekinesis) player.vx *= 0.7;
  else movePlayer(state, keys, actions.jump, controls);
  updateDropThrough(state, level, keys, controls);
  movePlayerWithCollisions(state, level);
  updateSecretAreas(state, level);
  updateSlimePhysics(player);
  if (player.y > level.height + 120) resetPlayer(state, level);
  collectStars(state, level);
  updateEnemies(state, level);
  player.pulse = Math.max(0, player.pulse - 1);
  player.invulnerableFrames = Math.max(0, player.invulnerableFrames - 1);
  const objectivesComplete = state.stars.every(Boolean);
  if (objectivesComplete && Math.hypot(player.x - level.exit.x, player.y - level.exit.y) < 100) state.won = true;
}

function movePlayer(state: GameState, keys: Set<string>, jumpPressed: boolean, controls: ControlScheme) {
  const player = state.player;
  const direction = controls === 'wasd'
    ? inputAxis(keys, ['a'], ['d']) : inputAxis(keys, ['arrowleft'], ['arrowright']);
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

function resetPlayer(state: GameState, level: Level) {
  const health = state.player.health;
  const energy = state.player.energy;
  const energyRegenDelay = state.player.energyRegenDelay;
  const fresh = createState(level);
  Object.assign(state.player, fresh.player);
  state.player.health = health;
  state.player.energy = energy;
  state.player.energyRegenDelay = energyRegenDelay;
  state.player.invulnerableFrames = 60;
  state.splitPart = null;
  state.selectedPlatform = null;
  state.activeSecret = null;
  state.dropThroughFrames = 0;
  state.dropInputReleased = false;
}

function collectStars(state: GameState, level: Level) {
  level.stars.forEach((star, index) => {
    if (Math.hypot(state.player.x + 24 - star.x, state.player.y + 30 - star.y) < 52) state.stars[index] = true;
  });
}
