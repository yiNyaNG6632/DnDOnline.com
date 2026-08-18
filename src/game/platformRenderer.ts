import type { GameState, Level, Platform } from './types';

export function drawPlatforms(ctx: CanvasRenderingContext2D, state: GameState, level: Level) {
  state.platforms.forEach((platform, index) => {
    if (isInsideInactiveSecret(state, level, platform)) return;
    drawPlatform(ctx, platform, level.accent, state.selectedPlatform === index);
  });
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  platform: Platform,
  accent: string,
  selected: boolean,
) {
  ctx.save();
  if (platform.movable || platform.visible) drawSolidPlatform(ctx, platform, accent, selected);
  ctx.restore();
}

function drawSolidPlatform(
  ctx: CanvasRenderingContext2D,
  platform: Platform,
  accent: string,
  selected: boolean,
) {
  ctx.fillStyle = selected ? accent : `${accent}b8`;
  ctx.shadowColor = accent;
  ctx.shadowBlur = selected ? 18 : 10;
  ctx.beginPath();
  ctx.roundRect(platform.x, platform.y, platform.w, platform.h, 7);
  ctx.fill();
  ctx.strokeStyle = '#fff8e988';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function isInsideInactiveSecret(state: GameState, level: Level, platform: Platform) {
  const centerX = platform.x + platform.w / 2;
  return level.secrets.some((secret, index) => state.activeSecret !== index
    && centerX >= secret.room.x && centerX <= secret.room.x + secret.room.w
    && platform.y > secret.room.y + 40 && platform.y <= secret.room.y + secret.room.h);
}
