import type { EnemyTheme, Rect, SecretArea } from './types';

type RoomPalette = { top: string; bottom: string; line: string; glow: string };

const palettes: Record<EnemyTheme, RoomPalette> = {
  bedroom: { top: '#2d2038', bottom: '#17101e', line: '#b895aa', glow: '#ffbd72' },
  greenhouse: { top: '#17352d', bottom: '#091c1b', line: '#75b981', glow: '#8ee59b' },
  clockwork: { top: '#382819', bottom: '#17110d', line: '#bd8847', glow: '#f3b562' },
  studio: { top: '#39212d', bottom: '#18121b', line: '#c46d7f', glow: '#ff829b' },
  theatre: { top: '#351a38', bottom: '#160d1b', line: '#a471b0', glow: '#d7a0ff' },
  storm: { top: '#152c3c', bottom: '#09131d', line: '#5489aa', glow: '#76d7ff' },
  workshop: { top: '#32301c', bottom: '#15150d', line: '#a89b50', glow: '#e8d477' },
  attic: { top: '#29243b', bottom: '#11101a', line: '#8179a8', glow: '#b6adff' },
  dream: { top: '#39234c', bottom: '#151027', line: '#b278c2', glow: '#ff9fd6' },
};

export function drawThemedSecretRoom(
  ctx: CanvasRenderingContext2D,
  secret: SecretArea,
  theme: EnemyTheme,
  roomIndex: number,
) {
  const palette = palettes[theme];
  drawShell(ctx, secret.room, palette);
  ctx.save();
  ctx.beginPath();
  ctx.rect(secret.room.x + 10, secret.room.y + 10, secret.room.w - 20, secret.room.h - 20);
  ctx.clip();
  drawTheme(ctx, secret.room, theme, palette, roomIndex);
  ctx.restore();
  drawTitle(ctx, secret);
}

function drawShell(ctx: CanvasRenderingContext2D, room: Rect, palette: RoomPalette) {
  const gradient = ctx.createLinearGradient(room.x, room.y, room.x, room.y + room.h);
  gradient.addColorStop(0, palette.top); gradient.addColorStop(1, palette.bottom);
  ctx.fillStyle = gradient; ctx.fillRect(room.x, room.y, room.w, room.h);
  ctx.strokeStyle = `${palette.line}88`; ctx.lineWidth = 8;
  ctx.strokeRect(room.x + 4, room.y + 4, room.w - 8, room.h - 8);
  ctx.strokeStyle = `${palette.glow}55`; ctx.lineWidth = 2;
  ctx.strokeRect(room.x + 15, room.y + 15, room.w - 30, room.h - 30);
}

function drawTheme(
  ctx: CanvasRenderingContext2D, room: Rect, theme: EnemyTheme,
  palette: RoomPalette, roomIndex: number,
) {
  const motifDrawers: Record<EnemyTheme, (x: number, y: number, size: number) => void> = {
    bedroom: (x, y, size) => drawDrawer(ctx, x, y, size, palette, roomIndex),
    greenhouse: (x, y, size) => drawPlant(ctx, x, y, size, palette, roomIndex),
    clockwork: (x, y, size) => drawGear(ctx, x, y, size, palette),
    studio: (x, y, size) => drawCanvas(ctx, x, y, size, palette, roomIndex),
    theatre: (x, y, size) => drawCurtain(ctx, x, y, size, palette, roomIndex),
    storm: (x, y, size) => drawChart(ctx, x, y, size, palette, roomIndex),
    workshop: (x, y, size) => drawToolboard(ctx, x, y, size, palette, roomIndex),
    attic: (x, y, size) => drawTrunk(ctx, x, y, size, palette, roomIndex),
    dream: (x, y, size) => drawDream(ctx, x, y, size, palette, roomIndex),
  };
  const motifCount = Math.max(2, Math.floor((room.w - 40) / 210));
  for (let column = 0; column < motifCount; column += 1) {
    const x = room.x + room.w * (column + 1) / (motifCount + 1);
    motifDrawers[theme](x, room.y + 280, 90 + (column % 2) * 12);
  }
}

function drawDrawer(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = '#523725'; ctx.fillRect(x - size, y, size * 2, 150);
  ctx.strokeStyle = p.line; ctx.lineWidth = 4;
  for (let row = 1; row < 4; row += 1) { ctx.strokeRect(x - size + 8, y + row * 35 - 27, size * 2 - 16, 29); }
  ctx.fillStyle = p.glow; ctx.beginPath(); ctx.arc(x + (variant ? 20 : -20), y + 55, 6, 0, Math.PI * 2); ctx.fill();
}

function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.strokeStyle = p.line; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y + 150); ctx.quadraticCurveTo(x + 50, y + 20, x - 15, y - 80); ctx.stroke();
  ctx.fillStyle = p.glow;
  for (let leaf = 0; leaf < 5; leaf += 1) { ctx.beginPath(); ctx.ellipse(x + (leaf % 2 ? 35 : -35), y + 90 - leaf * 38, size / 3, 14 + variant * 3, leaf % 2 ? .5 : -.5, 0, Math.PI * 2); ctx.fill(); }
}

function drawGear(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette) {
  ctx.strokeStyle = p.line; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(x, y + 60, size * .55, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 7; for (let spoke = 0; spoke < 8; spoke += 1) { const a = spoke * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x + Math.cos(a) * size * .52, y + 60 + Math.sin(a) * size * .52); ctx.stroke(); }
  ctx.fillStyle = p.glow; ctx.beginPath(); ctx.arc(x, y + 60, 12, 0, Math.PI * 2); ctx.fill();
}

function drawCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = '#d3b692'; ctx.fillRect(x - size * .65, y - 30, size * 1.3, 175);
  ctx.strokeStyle = p.line; ctx.lineWidth = 9; ctx.strokeRect(x - size * .65, y - 30, size * 1.3, 175);
  ctx.fillStyle = p.glow; for (let dot = 0; dot < 6; dot += 1) { ctx.beginPath(); ctx.arc(x - 40 + dot * 17, y + 40 + ((dot + variant) % 3) * 25, 10 + dot % 3, 0, Math.PI * 2); ctx.fill(); }
}

function drawCurtain(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = variant ? '#47245b' : '#662437'; ctx.beginPath(); ctx.moveTo(x - size, y - 70); ctx.lineTo(x + size, y - 70); ctx.lineTo(x + size * .65, y + 150); ctx.lineTo(x - size * .65, y + 150); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = p.glow; ctx.lineWidth = 5; for (let fold = -1; fold <= 1; fold += 1) { ctx.beginPath(); ctx.moveTo(x + fold * size * .45, y - 60); ctx.lineTo(x + fold * size * .3, y + 140); ctx.stroke(); }
}

function drawChart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = '#bca77f'; ctx.fillRect(x - size * .75, y - 30, size * 1.5, 175);
  ctx.strokeStyle = p.line; ctx.lineWidth = 3; for (let line = -1; line <= 1; line += 1) { ctx.beginPath(); ctx.arc(x + line * 25, y + 55, 35 + variant * 8, 0, Math.PI * 2); ctx.stroke(); }
  ctx.strokeStyle = p.glow; ctx.beginPath(); ctx.moveTo(x - 60, y + 110); ctx.lineTo(x - 10, y + 50); ctx.lineTo(x + 25, y + 85); ctx.lineTo(x + 65, y + 10); ctx.stroke();
}

function drawToolboard(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = '#4b4328'; ctx.fillRect(x - size * .8, y - 40, size * 1.6, 190);
  ctx.strokeStyle = p.glow; ctx.lineWidth = 8; for (let tool = -1; tool <= 1; tool += 1) { ctx.beginPath(); ctx.moveTo(x + tool * 45, y + 5); ctx.lineTo(x + tool * 35 + variant * 8, y + 115); ctx.stroke(); ctx.beginPath(); ctx.arc(x + tool * 45, y, 12, 0, Math.PI * 2); ctx.stroke(); }
}

function drawTrunk(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = '#3b2c25'; ctx.beginPath(); ctx.roundRect(x - size, y + 25, size * 2, 125, [35, 35, 8, 8]); ctx.fill();
  ctx.strokeStyle = p.line; ctx.lineWidth = 8; ctx.stroke(); ctx.fillStyle = p.glow; ctx.fillRect(x - 10 + variant * 12, y + 75, 20, 32);
  ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - size, y - 40); ctx.lineTo(x + size, y + 20); ctx.moveTo(x + size, y - 40); ctx.lineTo(x - size, y + 20); ctx.stroke();
}

function drawDream(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, p: RoomPalette, variant: number) {
  ctx.fillStyle = `${p.glow}55`; for (let cloud = -1; cloud <= 1; cloud += 1) { ctx.beginPath(); ctx.arc(x + cloud * 45, y + 95 + Math.abs(cloud) * 12, size * .42, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = p.glow; ctx.save(); ctx.translate(x + (variant ? 20 : -20), y); ctx.beginPath(); for (let point = 0; point < 10; point += 1) { const radius = point % 2 ? 15 : 38; const angle = point * Math.PI / 5; ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius); } ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawTitle(ctx: CanvasRenderingContext2D, secret: SecretArea) {
  ctx.fillStyle = '#f8f0e3cc'; ctx.font = '11px DM Mono'; ctx.textAlign = 'center';
  ctx.fillText(secret.name.toUpperCase(), secret.room.x + secret.room.w / 2, secret.room.y + 105);
}
