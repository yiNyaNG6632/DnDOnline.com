import type { TelekineticObject } from './types';
import { drawPlasticineEnemy } from './plasticineCharacters';

export function drawThemedEnemy(ctx: CanvasRenderingContext2D, enemy: TelekineticObject, accent: string) {
  drawPlasticineEnemy(ctx, enemy.x, enemy.y, enemy.vx, enemy.vy);
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  switch (enemy.theme) {
    case 'bedroom': drawNightcap(ctx, accent); break;
    case 'workshop': drawGoggles(ctx); break;
    case 'attic': drawGhostDust(ctx, accent); break;
    case 'clockwork': drawClockKey(ctx, accent); break;
    case 'studio': drawPaintBeret(ctx, accent); break;
    case 'dream': drawDreamCrescent(ctx, accent); break;
    case 'greenhouse': drawLeaves(ctx, accent); break;
    case 'theatre': drawMask(ctx, accent); break;
    case 'storm': drawLightning(ctx, accent); break;
  }
  ctx.restore();
}

function drawNightcap(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-18, -19); ctx.quadraticCurveTo(2, -43, 25, -24); ctx.lineTo(13, -18); ctx.fill();
  ctx.beginPath(); ctx.arc(25, -24, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff4d6'; ctx.fillRect(-17, -21, 31, 5);
}

function drawGoggles(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#d7efb7'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(-7, -2, 7, 0, Math.PI * 2); ctx.arc(8, -1, 7, 0, Math.PI * 2); ctx.moveTo(0, -2); ctx.lineTo(2, -2); ctx.stroke();
  ctx.fillStyle = '#9e6b3e'; ctx.fillRect(-25, -20, 13, 5); ctx.fillRect(12, -20, 13, 5);
}

function drawGhostDust(ctx: CanvasRenderingContext2D, color: string) {
  ctx.globalAlpha = 0.55; ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 3, 31, 0.15, Math.PI - 0.15); ctx.stroke();
  ctx.globalAlpha = 0.8; ctx.fillStyle = '#e8e1ff';
  ctx.beginPath(); ctx.arc(-20, -25, 3, 0, 7); ctx.arc(17, -31, 2, 0, 7); ctx.fill();
}

function drawClockKey(ctx: CanvasRenderingContext2D, color: string) {
  ctx.strokeStyle = color; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, -23); ctx.lineTo(0, -37); ctx.moveTo(-8, -38); ctx.lineTo(8, -38); ctx.stroke();
  ctx.beginPath(); ctx.arc(-25, 1, 8, 0, Math.PI * 2); ctx.stroke();
}

function drawPaintBeret(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(-3, -23, 22, 7, -0.12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffca68'; ctx.beginPath(); ctx.arc(17, 13, 4, 0, 7); ctx.arc(20, 20, 2, 0, 7); ctx.fill();
}

function drawDreamCrescent(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, -29, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#37203f'; ctx.beginPath(); ctx.arc(5, -33, 10, 0, Math.PI * 2); ctx.fill();
}

function drawLeaves(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(-9, -29, 7, 14, -0.7, 0, Math.PI * 2); ctx.ellipse(9, -30, 7, 15, 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#4d7b42'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -21); ctx.lineTo(0, -38); ctx.stroke();
}

function drawMask(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(-17, -12, 35, 18, 8); ctx.fill();
  ctx.fillStyle = '#33203c'; ctx.beginPath(); ctx.ellipse(-7, -4, 4, 2, 0, 0, 7); ctx.ellipse(8, -4, 4, 2, 0, 0, 7); ctx.fill();
}

function drawLightning(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(-4, -34); ctx.lineTo(8, -34); ctx.lineTo(2, -23); ctx.lineTo(12, -23); ctx.lineTo(-3, -7); ctx.lineTo(1, -20); ctx.lineTo(-9, -20); ctx.closePath(); ctx.fill();
}
