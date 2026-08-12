import type { Player } from './types';

export function clayGradient(
  ctx: CanvasRenderingContext2D,
  top: string,
  bottom: string,
  radius: number,
) {
  const gradient = ctx.createRadialGradient(-radius * 0.35, -radius * 0.45, 2, 0, 0, radius * 1.4);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  return gradient;
}

export function clayShine(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#fff4df';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function fingerprint(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#5b1832';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(x, y, radius - i * 2.6, Math.PI * 0.1, Math.PI * 1.55);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPlasticineHero(ctx: CanvasRenderingContext2D, player: Player, accent: string) {
  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
  ctx.scale(player.facing, 1);
  const squash = player.grounded ? 1.03 : 0.94;
  ctx.scale(1 / squash, squash);
  ctx.shadowColor = 'rgba(32, 8, 34, 0.5)';
  ctx.shadowBlur = 13;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = clayGradient(ctx, '#ff9a70', '#c9434c', 32);
  ctx.beginPath();
  ctx.moveTo(-20, 27);
  ctx.bezierCurveTo(-28, 14, -25, -15, -15, -25);
  ctx.bezierCurveTo(-7, -34, 12, -31, 19, -21);
  ctx.bezierCurveTo(29, -8, 25, 17, 18, 28);
  ctx.bezierCurveTo(8, 31, -8, 30, -20, 27);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  clayShine(ctx, -11, -17, 7, 12);
  fingerprint(ctx, 8, 16, 9);
  ctx.fillStyle = '#392036';
  ctx.beginPath();
  ctx.ellipse(-7, -7, 3.8, 4.4, -0.1, 0, Math.PI * 2);
  ctx.ellipse(9, -5, 3.6, 4.1, 0.1, 0, Math.PI * 2);
  ctx.fill();
  clayShine(ctx, -8, -8, 1.2, 1.5);
  clayShine(ctx, 8, -6, 1.2, 1.5);
  ctx.strokeStyle = '#8e2f43';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(2, 4, 7, 0.2, Math.PI - 0.15);
  ctx.stroke();

  if (player.pulse > 0) {
    ctx.globalAlpha = player.pulse / 26;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(10, 0, 54 + (26 - player.pulse) * 5, -0.8, 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPlasticineEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, vx: number, vy: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.max(-0.35, Math.min(0.35, vx * 0.025)));
  ctx.scale(1, vy === 0 ? 1 : 0.9);
  ctx.shadowColor = 'rgba(20, 8, 29, 0.58)';
  ctx.shadowBlur = 11;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = clayGradient(ctx, '#765381', '#281631', 24);
  ctx.beginPath();
  ctx.moveTo(-22, 3);
  ctx.bezierCurveTo(-24, -13, -14, -24, -1, -23);
  ctx.bezierCurveTo(13, -25, 24, -12, 22, 3);
  ctx.bezierCurveTo(27, 16, 14, 23, 5, 19);
  ctx.bezierCurveTo(-3, 27, -27, 18, -22, 3);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  clayShine(ctx, -10, -13, 6, 8);
  fingerprint(ctx, 7, 11, 7);

  ctx.fillStyle = '#f4c96b';
  ctx.beginPath();
  ctx.ellipse(-7, -2, 3.2, 4.3, -0.12, 0, Math.PI * 2);
  ctx.ellipse(8, -1, 3.2, 4.3, 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2039';
  ctx.beginPath();
  ctx.arc(-6.5, -1, 1.3, 0, Math.PI * 2);
  ctx.arc(8.5, 0, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1d1026';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.quadraticCurveTo(0, 11, 7, 7);
  ctx.stroke();
  ctx.restore();
}
