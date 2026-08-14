import type { GameState, Level } from './types';
import { drawPlasticineHero } from './plasticineCharacters';
import { drawSplitPart } from './splitCharacter';
import { drawThemedEnemy } from './themedEnemies';
import { drawSecretAreas, drawSecretNotice } from './secretAreas';

const WIDTH = 1000;
const HEIGHT = 650;

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  level: Level,
  image: HTMLImageElement,
) {
  const cameraX = clamp(state.player.x - 430, 0, level.width - WIDTH);
  const cameraY = clamp(state.player.y - 330, 0, level.height - HEIGHT);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#17101e'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.translate(-cameraX, -cameraY);
  if (image.complete && image.naturalWidth > 0) ctx.drawImage(image, 0, 0, 3000, 2000);
  drawSecretAreas(ctx, state, level);
  level.stars.forEach((star, index) => {
    if (!state.stars[index]) drawStar(ctx, star.x, star.y, level.accent);
  });
  state.enemies.forEach((enemy) => drawThemedEnemy(ctx, enemy, level.accent));
  const exitOpen = state.stars.every(Boolean);
  drawExit(ctx, level.exit.x, level.exit.y, exitOpen, level.accent);
  if (state.splitPart) drawSplitPart(ctx, state.splitPart, level.accent);
  drawPlasticineHero(ctx, state.player, level.accent);
  ctx.restore();
  drawRoomMap(ctx, state, level, cameraX, cameraY);
  drawSecretNotice(ctx, state, level);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function drawRoomMap(ctx: CanvasRenderingContext2D, state: GameState, level: Level, cameraX: number, cameraY: number) {
  const x = WIDTH - 174; const y = 185; const w = 148; const h = 70;
  const bounds = state.activeSecret === null
    ? { x: 0, y: 0, w: 3000, h: level.height }
    : level.secrets[state.activeSecret].room;
  ctx.fillStyle = '#100b18cc'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  ctx.strokeStyle = '#8f7b9844'; ctx.stroke();
  ctx.save(); ctx.translate(x + 10, y + 10);
  const scaleX = (w - 20) / bounds.w; const scaleY = (h - 20) / bounds.h;
  ctx.strokeStyle = '#8c789666'; ctx.lineWidth = 2;
  state.platforms.filter((platform) => platform.w > 175
    && platform.x < bounds.x + bounds.w && platform.x + platform.w > bounds.x
    && platform.y >= bounds.y && platform.y <= bounds.y + bounds.h).forEach((platform) => {
    ctx.beginPath(); ctx.moveTo((platform.x - bounds.x) * scaleX, (platform.y - bounds.y) * scaleY);
    ctx.lineTo((platform.x + platform.w - bounds.x) * scaleX, (platform.y - bounds.y) * scaleY); ctx.stroke();
  });
  level.secrets.forEach((secret, index) => {
    if (!state.discoveredSecrets[index] || state.activeSecret !== null) return;
    ctx.fillStyle = level.accent;
    ctx.fillRect((secret.entrance.x - bounds.x) * scaleX - 2, (secret.entrance.y - bounds.y) * scaleY - 2, 5, 5);
  });
  ctx.strokeStyle = '#ffffff22';
  ctx.strokeRect((cameraX - bounds.x) * scaleX, (cameraY - bounds.y) * scaleY, WIDTH * scaleX, HEIGHT * scaleY);
  ctx.fillStyle = level.accent; ctx.shadowColor = level.accent; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc((state.player.x + 24 - bounds.x) * scaleX, (state.player.y + 31 - bounds.y) * scaleY, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore(); ctx.shadowBlur = 0;
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Date.now() / 900);
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 ? 7 : 17; const angle = i * Math.PI / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawExit(ctx: CanvasRenderingContext2D, x: number, y: number, open: boolean, color: string) {
  ctx.fillStyle = open ? color : '#3e3546'; ctx.shadowColor = open ? color : 'transparent'; ctx.shadowBlur = open ? 30 : 0;
  ctx.beginPath(); ctx.roundRect(x, y - 5, 80, 125, [40, 40, 8, 8]); ctx.fill();
  ctx.fillStyle = '#25192e'; ctx.beginPath(); ctx.roundRect(x + 12, y + 12, 56, 108, [28, 28, 4, 4]); ctx.fill();
  ctx.fillStyle = open ? color : '#766a7d'; ctx.beginPath(); ctx.arc(x + 56, y + 70, 4, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}
