import type { Weapon } from './types';

export function drawWeapon(ctx: CanvasRenderingContext2D, weapon: Weapon, accent: string) {
  ctx.save();
  ctx.translate(weapon.x, weapon.y);
  ctx.rotate(weapon.rotation);
  ctx.shadowColor = accent;
  ctx.shadowBlur = weapon.status === 'held' ? 22 : 10;
  if (weapon.kind === 'mallet') drawMallet(ctx);
  else drawSpear(ctx);
  ctx.restore();
}

function drawMallet(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#794c35';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-16, 16);
  ctx.lineTo(13, -13);
  ctx.stroke();
  ctx.fillStyle = '#e8b754';
  ctx.beginPath();
  ctx.roundRect(2, -24, 29, 18, 6);
  ctx.fill();
  ctx.fillStyle = '#ffe19a';
  ctx.fillRect(6, -21, 20, 4);
}

function drawSpear(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#90603f';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(19, 0);
  ctx.stroke();
  ctx.fillStyle = '#d9d4df';
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(16, -9);
  ctx.lineTo(16, 9);
  ctx.closePath();
  ctx.fill();
}
