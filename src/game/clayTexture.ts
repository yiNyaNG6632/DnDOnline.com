export function clayGradient(
  ctx: CanvasRenderingContext2D,
  highlight: string,
  shadow: string,
  radius: number,
) {
  const gradient = ctx.createRadialGradient(
    -radius * 0.42,
    -radius * 0.55,
    radius * 0.08,
    0,
    0,
    radius * 1.45,
  );
  gradient.addColorStop(0, highlight);
  gradient.addColorStop(0.55, shadow);
  gradient.addColorStop(1, '#241628');
  return gradient;
}

export function drawGroundShadow(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  alpha: number,
) {
  ctx.save();
  ctx.filter = 'blur(4px)';
  ctx.fillStyle = `rgba(18, 10, 24, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(2, y, width, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function addClaySurface(
  ctx: CanvasRenderingContext2D,
  body: Path2D,
  radius: number,
  seed: number,
) {
  ctx.save();
  ctx.clip(body);
  let value = seed;
  for (let index = 0; index < 18; index += 1) {
    value = (value * 9301 + 49297) % 233280;
    const x = (value / 233280 - 0.5) * radius * 1.7;
    value = (value * 9301 + 49297) % 233280;
    const y = (value / 233280 - 0.5) * radius * 1.9;
    ctx.globalAlpha = index % 3 === 0 ? 0.07 : 0.035;
    ctx.fillStyle = index % 2 === 0 ? '#fff2d5' : '#3b1830';
    ctx.beginPath();
    ctx.ellipse(x, y, 1.2 + index % 3, 0.7 + index % 2, index * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.23;
  ctx.strokeStyle = '#ffe8c5';
  ctx.lineWidth = 1.2;
  ctx.stroke(body);
  ctx.restore();
}

export function drawClayShine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#fff4df';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, -0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
