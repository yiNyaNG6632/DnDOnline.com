import type { GameMode, GameState } from './types';
import { applyEnemyGimmick } from './enemyGimmicks';
import { updatePveEnemy } from './pveCombat';

const WORLD_END = 2200;

export function updateEnemies(state: GameState, mode: GameMode) {
  state.enemies.forEach((enemy) => {
    if (mode === 'pve') {
      applyEnemyGimmick(state, enemy);
      updatePveEnemy(state, enemy);
    }
    const previousY = enemy.y;
    enemy.vy = Math.min(enemy.vy + 0.55, 14);
    enemy.x = Math.max(22, Math.min(WORLD_END - 22, enemy.x + enemy.vx));
    enemy.y += enemy.vy;
    enemy.vx *= 0.96;
    const landingY = state.platforms
      .filter((platform) => enemy.x >= platform.x && enemy.x <= platform.x + platform.w)
      .map((platform) => platform.y - 40)
      .filter((y) => y >= previousY - 2 && enemy.y >= y)
      .sort((a, b) => a - b)[0];
    if (landingY === undefined || enemy.vy < 0) return;
    enemy.y = landingY;
    enemy.vy = 0;
    if (Math.abs(enemy.vx) < 0.08) enemy.vx = 0;
  });
}
