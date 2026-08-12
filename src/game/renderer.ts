import type { GameState, Level } from './types';
import { drawPlasticineEnemy, drawPlasticineHero } from './plasticineCharacters';

const WIDTH = 1000;
const HEIGHT = 650;

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState, level: Level, image: HTMLImageElement) {
  const camera = Math.max(0, Math.min(1200, state.player.x - 420));
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  if (image.complete) ctx.drawImage(image, -camera * 0.12, 0, 1200, HEIGHT);
  ctx.fillStyle = 'rgba(20,12,32,.18)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.translate(-camera, 0);
  state.platforms.filter((platform) => platform.y < HEIGHT - 30).forEach((platform) => {
    drawPlatform(ctx, platform);
  });
  level.stars.forEach((star, index) => {
    if (!state.stars[index]) drawStar(ctx, star.x, star.y, level.accent);
  });
  state.enemies.forEach((enemy) => drawPlasticineEnemy(ctx, enemy.x, enemy.y, enemy.vx, enemy.vy));
  drawExit(ctx, level.exit.x, level.exit.y, state.stars.every(Boolean), level.accent);
  drawPlasticineHero(ctx, state.player, level.accent);
  ctx.restore();
}

function drawPlatform(ctx: CanvasRenderingContext2D, platform: GameState['platforms'][number]) {
  ctx.save();
  ctx.fillStyle = '#49344f';
  roundedRect(ctx, platform.x, platform.y, platform.w, platform.h, 12);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#8d668f';
  ctx.fillRect(platform.x + 8, platform.y + 4, platform.w - 16, 5);
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Date.now() / 900);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 ? 7 : 17;
    const angle = i * Math.PI / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawExit(ctx: CanvasRenderingContext2D, x: number, y: number, open: boolean, color: string) {
  ctx.fillStyle = open ? color : '#3e3546';
  ctx.shadowColor = open ? color : 'transparent';
  ctx.shadowBlur = open ? 30 : 0;
  ctx.beginPath();
  ctx.roundRect(x, y - 5, 80, 125, [40, 40, 8, 8]);
  ctx.fill();
  ctx.fillStyle = '#25192e';
  ctx.beginPath();
  ctx.roundRect(x + 12, y + 12, 56, 108, [28, 28, 4, 4]);
  ctx.fill();
  ctx.fillStyle = open ? color : '#766a7d';
  ctx.beginPath();
  ctx.arc(x + 56, y + 70, 4, 0, 7);
  ctx.fill();
  ctx.shadowBlur = 0;
}
