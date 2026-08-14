import type { GameState, Level, TelekineticObject } from './types';

export function updateEnemies(state: GameState, level: Level) {
  state.enemies.forEach((enemy) => {
    chooseAttack(state, enemy);
    const previousY = enemy.y;
    enemy.vy = Math.min(enemy.vy + 0.55, 14);
    enemy.x = Math.max(22, Math.min(level.width - 22, enemy.x + enemy.vx));
    enemy.y += enemy.vy;
    enemy.vx *= 0.94;
    damagePlayer(state, enemy);
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
  state.enemies = state.enemies.filter((enemy) => enemy.y < level.height + 100);
}

export function pushEnemies(state: GameState) {
  const player = state.player;
  let hitEnemy = false;
  player.pulse = 26;
  state.enemies.forEach((enemy) => {
    const dx = enemy.x - player.x;
    if (Math.abs(dx) < 210 && Math.abs(enemy.y - player.y) < 140 && dx * player.facing > -30) {
      enemy.vx = player.facing * 13;
      enemy.vy = -7;
      enemy.health -= 1;
      hitEnemy = true;
    }
  });
  state.enemies = state.enemies.filter((enemy) => enemy.health > 0);
  return hitEnemy;
}

function chooseAttack(state: GameState, enemy: TelekineticObject) {
  const strategy = state.enemyStrategy;
  const dx = state.player.x + state.player.w / 2 - enemy.x;
  const dy = state.player.y + state.player.h / 2 - enemy.y;
  enemy.attackTimer -= 1;
  if (Math.abs(dx) > 620 || Math.abs(dy) > 260) return;

  const direction = Math.sign(dx || 1);
  enemy.vx = clamp(enemy.vx + direction * strategy.aggression, -strategy.speed, strategy.speed);
  if (enemy.attackTimer > 0 || enemy.vy !== 0) return;

  enemy.vx = direction * strategy.speed * 2.1;
  enemy.vy = -strategy.jumpForce;
  enemy.attackTimer = strategy.attackInterval + Math.round(enemy.phase % 25);
}

function damagePlayer(state: GameState, enemy: TelekineticObject) {
  const player = state.player;
  const touching = Math.abs(player.x + player.w / 2 - enemy.x) < 42
    && Math.abs(player.y + player.h / 2 - enemy.y) < 52;
  if (!touching || player.invulnerableFrames > 0) return;

  player.health -= 1;
  player.invulnerableFrames = 90;
  player.pulse = 30;
  player.vx = Math.sign(player.x + player.w / 2 - enemy.x || 1) * 11;
  player.vy = -9;
  if (player.health <= 0) state.lost = true;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
