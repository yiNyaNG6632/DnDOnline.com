import { isPlatformActive } from './platformVisibility';
import type { ControlScheme, GameState, Level } from './types';

export function updateDropThrough(
  state: GameState,
  level: Level,
  keys: Set<string>,
  controls: ControlScheme,
) {
  const down = keys.has(controls === 'wasd' ? 's' : 'arrowdown');
  if (!down) {
    state.dropInputReleased = true;
    return;
  }
  if (!state.dropInputReleased || !state.player.grounded) return;
  const player = state.player;
  const support = state.platforms.find((platform) => isPlatformActive(state, level, platform)
    && platform.dropThrough !== false
    && player.x + player.w > platform.x && player.x < platform.x + platform.w
    && Math.abs(player.y + player.h - platform.y) < 4);
  if (!support) return;
  state.dropInputReleased = false;
  state.dropThroughFrames = 12;
  player.grounded = false;
  player.y += 8;
}
