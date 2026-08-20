import type { GameState, Level, Platform } from './types';

export function isPlatformActive(state: GameState, level: Level, platform: Platform) {
  const centerX = platform.x + platform.w / 2;
  return !level.secrets.some((secret, index) => state.activeSecret !== index
    && centerX >= secret.room.x && centerX <= secret.room.x + secret.room.w
    && platform.y > secret.room.y + 40
    && platform.y <= secret.room.y + secret.room.h);
}
