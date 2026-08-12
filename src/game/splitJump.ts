import type { GameState } from './types';

const SPLIT_LIFETIME_FRAMES = 240;
const MAX_SPLITS_PER_JUMP = 3;

export function updateSplitJump(state: GameState, splitPressed: boolean) {
  if (splitPressed) splitBody(state);
  const part = state.splitPart;
  if (!part) return;
  part.age += 1;
  part.x += part.vx;
  part.vx *= 0.995;
  if (part.age > SPLIT_LIFETIME_FRAMES) state.splitPart = null;
}

export function tryJumpFromSplit(state: GameState) {
  const part = state.splitPart;
  const player = state.player;
  if (!part || !player.canDoubleJump || part.age < 4 || player.vy < -1.5) return false;
  const horizontalDistance = Math.abs(player.x + player.w / 2 - part.x);
  const verticalDistance = part.y - (player.y + player.h);
  if (horizontalDistance >= 78 || verticalDistance <= -28 || verticalDistance >= 72) return false;
  state.splitPart = null;
  player.splitUsed = false;
  player.canDoubleJump = player.splitCount < MAX_SPLITS_PER_JUMP;
  return true;
}

function splitBody(state: GameState) {
  const player = state.player;
  if (player.grounded || !player.canDoubleJump || player.splitUsed || player.splitCount >= MAX_SPLITS_PER_JUMP) return;
  state.splitPart = {
    x: player.x + player.w / 2,
    y: player.y + player.h + 10,
    vx: player.vx * 0.35,
    age: 0,
  };
  player.splitUsed = true;
  player.splitCount += 1;
  player.pulse = 18;
}
