import type { Player } from './types';

export const MAX_ENERGY = 100;
export const PUSH_ENERGY_COST = 20;
export const TELEKINESIS_DRAIN = 0.45;

const REGEN_PER_FRAME = 0.35;
const REGEN_DELAY_FRAMES = 45;

export function recoverEnergy(player: Player, powerHeld: boolean) {
  if (powerHeld) return;
  if (player.energyRegenDelay > 0) {
    player.energyRegenDelay -= 1;
    return;
  }
  player.energy = Math.min(MAX_ENERGY, player.energy + REGEN_PER_FRAME);
}

export function hasEnergy(player: Player, amount: number) {
  return player.energy >= amount;
}

export function spendEnergy(player: Player, amount: number) {
  player.energy = Math.max(0, player.energy - amount);
  player.energyRegenDelay = REGEN_DELAY_FRAMES;
}
