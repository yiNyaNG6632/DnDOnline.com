import type { SplitPart } from './types';
import { addClaySurface, clayGradient, drawClayShine, drawGroundShadow } from './clayTexture';

export function drawSplitPart(ctx: CanvasRenderingContext2D, part: SplitPart, accent: string) {
  const ready = part.age >= 8;
  ctx.save();
  ctx.translate(part.x, part.y);
  drawGroundShadow(ctx, 8, 24, 0.38);
  ctx.rotate(Math.sin(part.age / 8) * 0.08);
  ctx.shadowColor = accent;
  ctx.shadowBlur = ready ? 22 : 10;
  const body = new Path2D();
  body.ellipse(0, 0, 28, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = clayGradient(ctx, '#ff9f74', '#b93845', 25);
  ctx.fill(body);
  ctx.shadowBlur = 0;
  addClaySurface(ctx, body, 18, 29);
  drawClayShine(ctx, -8, -4, 9, 2.4);
  if (ready) {
    ctx.globalAlpha = 0.7 + Math.sin(Date.now() / 90) * 0.2;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
