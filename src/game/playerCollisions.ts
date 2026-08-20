import { squashOnLanding } from './slimePhysics';
import { isPlatformActive } from './platformVisibility';
import type { GameState, Level, Platform, Player, Rect } from './types';

const EDGE_TOLERANCE = 8;

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x
    && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function movePlayerWithCollisions(state: GameState, level: Level) {
  const player = state.player;
  const platforms = state.platforms.filter((platform) => isPlatformActive(state, level, platform));
  player.vy = Math.min(player.vy + 0.7, 16);
  moveHorizontally(player, platforms, level.width);
  moveVertically(state, platforms);
}

function moveHorizontally(player: Player, platforms: Platform[], worldWidth: number) {
  const previousX = player.x;
  player.x = Math.max(0, Math.min(worldWidth - player.w, player.x + player.vx));

  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;
    const cameFromLeft = previousX + player.w <= platform.x + EDGE_TOLERANCE;
    const cameFromRight = previousX >= platform.x + platform.w - EDGE_TOLERANCE;
    if (player.vx > 0 && cameFromLeft) {
      player.x = platform.x - player.w;
      player.vx = 0;
    } else if (player.vx < 0 && cameFromRight) {
      player.x = platform.x + platform.w;
      player.vx = 0;
    }
  }
}

function moveVertically(state: GameState, platforms: Platform[]) {
  const player = state.player;
  const previousY = player.y;
  player.y += player.vy;
  player.grounded = false;
  state.dropThroughFrames = Math.max(0, state.dropThroughFrames - 1);

  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;
    const oneWay = platform.dropThrough !== false;
    const crossedTop = previousY + player.h <= platform.y + EDGE_TOLERANCE;
    if (oneWay && (state.dropThroughFrames > 0 || player.vy < 0 || !crossedTop)) continue;

    if (player.vy >= 0 && crossedTop) {
      landOnPlatform(state, platform);
      continue;
    }
    if (!oneWay && player.vy < 0 && previousY >= platform.y + platform.h - EDGE_TOLERANCE) {
      player.y = platform.y + platform.h;
      player.vy = 0;
    }
  }
}

function landOnPlatform(state: GameState, platform: Platform) {
  const player = state.player;
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
