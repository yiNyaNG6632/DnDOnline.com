import type { GameState, Level, Rect } from './types';
import { drawThemedSecretRoom } from './secretRoomThemes';

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
    if (state.activeSecret === index) {
      drawThemedSecretRoom(ctx, secret, level.enemyTheme, index);
    }
  });
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
