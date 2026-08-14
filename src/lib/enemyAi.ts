import { clampStrategy, DEFAULT_ENEMY_STRATEGY } from '../game/enemyStrategy';
import type { EnemyStrategy, Level } from '../game/types';
import { isSupabaseConfigured, supabase } from './supabase';

type AiResponse = { text?: unknown };
export type EnemyPlan = { strategy: EnemyStrategy; generatedByAi: boolean };

export async function loadEnemyStrategy(level: Level): Promise<EnemyPlan> {
  const fallback = { strategy: DEFAULT_ENEMY_STRATEGY, generatedByAi: false };
  if (!isSupabaseConfigured) return fallback;

  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: {
      system: 'You design fair but dangerous enemy tactics for a teen platform game. Return only valid JSON.',
      prompt: `Create one enemy tactic for "${level.name}". Theme: ${level.enemyTheme}.
JSON shape: {"name":string,"taunt":string,"speed":number,"aggression":number,"attackInterval":number,"jumpForce":number}.
Limits: speed 1.4-3.8, aggression 0.06-0.25, attackInterval 45-150, jumpForce 6-12. Keep taunt under 80 characters.`,
    },
  });

  if (error || typeof data?.text !== 'string') return fallback;

  try {
    const json = data.text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return fallback;
    return {
      strategy: clampStrategy(JSON.parse(json) as Partial<EnemyStrategy>),
      generatedByAi: true,
    };
  } catch {
    return fallback;
  }
}
