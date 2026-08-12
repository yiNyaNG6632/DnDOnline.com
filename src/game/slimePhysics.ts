import type { Player } from './types';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function stretchForJump(player: Player) {
  player.slimeSquash = -0.12;
  player.slimeSquashSpeed = -0.025;
}

export function squashOnLanding(player: Player, impactSpeed: number) {
  player.slimeSquash = clamp(impactSpeed * 0.016, 0.08, 0.24);
  player.slimeSquashSpeed = -0.018;
}

export function updateSlimePhysics(player: Player) {
  const airStretch = clamp(-Math.abs(player.vy) * 0.008, -0.11, 0);
  const movingSquash = clamp(Math.abs(player.vx) * 0.007, 0, 0.045);
  const targetSquash = player.grounded ? movingSquash : airStretch;

  player.slimeSquashSpeed += (targetSquash - player.slimeSquash) * 0.2;
  player.slimeSquashSpeed *= 0.7;
  player.slimeSquash = clamp(player.slimeSquash + player.slimeSquashSpeed, -0.15, 0.25);

  const targetTilt = player.grounded ? player.vx * 0.012 : player.vx * 0.025;
  player.slimeTilt += (targetTilt - player.slimeTilt) * 0.16;
}
