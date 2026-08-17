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
  else drawSurfaceEdge(ctx, platform, accent);
  ctx.restore();
}

function drawSurfaceEdge(ctx: CanvasRenderingContext2D, platform: Platform, accent: string) {
  const edge = ctx.createLinearGradient(platform.x, 0, platform.x + platform.w, 0);
  edge.addColorStop(0, `${accent}00`);
  edge.addColorStop(0.08, `${accent}70`);
  edge.addColorStop(0.92, `${accent}70`);
  edge.addColorStop(1, `${accent}00`);
  ctx.strokeStyle = '#120c1899';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(platform.x + 3, platform.y + 4);
  ctx.lineTo(platform.x + platform.w - 3, platform.y + 4);
  ctx.stroke();

  ctx.strokeStyle = edge;
  ctx.lineWidth = 2;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.moveTo(platform.x + 3, platform.y);
  ctx.lineTo(platform.x + platform.w - 3, platform.y);
  ctx.stroke();
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
