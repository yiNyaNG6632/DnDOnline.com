import type { EnemyStrategy } from './types';

export const DEFAULT_ENEMY_STRATEGY: EnemyStrategy = {
  name: 'Hunter pack',
  taunt: 'The shadows have noticed you.',
  speed: 2.4,
  aggression: 0.14,
  attackInterval: 85,
  jumpForce: 8.5,
};

export function clampStrategy(strategy: Partial<EnemyStrategy>): EnemyStrategy {
  return {
    name: shortText(strategy.name, DEFAULT_ENEMY_STRATEGY.name, 28),
    taunt: shortText(strategy.taunt, DEFAULT_ENEMY_STRATEGY.taunt, 80),
    speed: clampNumber(strategy.speed, 1.4, 3.8, DEFAULT_ENEMY_STRATEGY.speed),
    aggression: clampNumber(strategy.aggression, 0.06, 0.25, DEFAULT_ENEMY_STRATEGY.aggression),
    attackInterval: Math.round(clampNumber(
      strategy.attackInterval,
      45,
      150,
      DEFAULT_ENEMY_STRATEGY.attackInterval,
    )),
    jumpForce: clampNumber(strategy.jumpForce, 6, 12, DEFAULT_ENEMY_STRATEGY.jumpForce),
  };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(min, Math.min(max, value))
    : fallback;
}

function shortText(value: unknown, fallback: string, maxLength: number) {
  return typeof value === 'string' && value.trim()
    ? value.trim().slice(0, maxLength)
    : fallback;
}
