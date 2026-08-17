import type { AchievementId } from '../game/achievements';
import { supabase } from './supabase';

export async function loadAchievements() {
  const { data, error } = await supabase
    .from('player_achievements')
    .select('achievement_id');
  if (error) throw error;
  if (!Array.isArray(data)) return new Set<AchievementId>();
  return new Set(data.flatMap((row: { achievement_id?: unknown }) => (
    typeof row.achievement_id === 'string' ? [row.achievement_id as AchievementId] : []
  )));
}

export async function unlockAchievement(id: AchievementId) {
  const { error } = await supabase.rpc('unlock_achievement', { target_id: id });
  if (error) throw error;
}
