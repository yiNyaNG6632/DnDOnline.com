import type { GameState, Level, Rect, SecretArea } from './types';

function contains(area: Rect, x: number, y: number) {
  return x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h;
}

export function updateSecretAreas(state: GameState, level: Level) {
  state.secretNoticeFrames = Math.max(0, state.secretNoticeFrames - 1);
  const centerX = state.player.x + state.player.w / 2;
  const centerY = state.player.y + state.player.h / 2;
  const secretIndex = level.secrets.findIndex((secret) => contains(secret.trigger, centerX, centerY));
  const nextSecret = secretIndex < 0 ? null : secretIndex;
  if (nextSecret === state.activeSecret) return;
  state.activeSecret = nextSecret;
  state.secretNoticeFrames = 140;
  if (nextSecret !== null) state.discoveredSecrets[nextSecret] = true;
}

export function drawSecretAreas(ctx: CanvasRenderingContext2D, state: GameState, level: Level) {
  level.secrets.forEach((secret, index) => {
    drawRoom(ctx, secret, state.activeSecret === index);
    drawEntrance(ctx, secret, state.discoveredSecrets[index]);
  });
}

function drawEntrance(ctx: CanvasRenderingContext2D, secret: SecretArea, discovered: boolean) {
  const { x, y, w } = secret.entrance;
  ctx.save();
  ctx.fillStyle = '#0d0913bb';
  ctx.fillRect(x, y, w, 18);
  ctx.strokeStyle = discovered ? '#ffbd7255' : '#76657d25';
  ctx.setLineDash([8, 12]);
  ctx.beginPath(); ctx.moveTo(x + 6, y + 3); ctx.lineTo(x + w - 6, y + 3); ctx.stroke();
  ctx.restore();
}

function drawRoom(ctx: CanvasRenderingContext2D, secret: SecretArea, active: boolean) {
  const { x, y, w, h } = secret.room;
  const gradient = ctx.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, '#17101e');
  gradient.addColorStop(1, secret.kind === 'drawer' ? '#3c253b' : '#24202e');
  ctx.fillStyle = gradient; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#9e879733'; ctx.lineWidth = 8; ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  ctx.fillStyle = '#ffffff0a';
  for (let offset = 90; offset < w; offset += 135) ctx.fillRect(x + offset, y + 60, 3, h - 100);
  if (!active) return;
  ctx.fillStyle = '#e9d8e7aa'; ctx.font = '11px DM Mono'; ctx.textAlign = 'center';
  ctx.fillText(secret.name.toUpperCase(), x + w / 2, y + 105);
}

export function drawSecretNotice(ctx: CanvasRenderingContext2D, state: GameState, level: Level) {
  if (state.secretNoticeFrames <= 0 || state.activeSecret === null) return;
  const name = level.secrets[state.activeSecret].name;
  ctx.save(); ctx.textAlign = 'center';
  ctx.fillStyle = '#100b18dd'; ctx.beginPath(); ctx.roundRect(350, 112, 300, 50, 12); ctx.fill();
  ctx.fillStyle = '#ffbd72'; ctx.font = '500 9px DM Mono'; ctx.fillText('FOUND BELOW', 500, 132);
  ctx.fillStyle = '#f8f0e3'; ctx.font = '700 17px Fraunces'; ctx.fillText(name, 500, 152);
  ctx.restore();
}
