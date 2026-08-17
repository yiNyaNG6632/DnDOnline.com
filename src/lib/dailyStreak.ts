import { supabase } from './supabase';

export type DailyStreak = {
  current: number;
  longest: number;
  lastPlayedOn: string;
};

export async function loadDailyStreak() {
  const { data, error } = await supabase
    .from('player_streaks')
    .select('current_streak, longest_streak, last_played_on')
    .maybeSingle();
  if (error) throw error;
  return parseStreak(data);
}

export async function recordDailyPlay() {
  const { data, error } = await supabase.rpc('record_daily_play');
  if (error) throw error;
  return parseStreak(data);
}

function parseStreak(value: unknown): DailyStreak | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if (typeof row.current_streak !== 'number'
    || typeof row.longest_streak !== 'number'
    || typeof row.last_played_on !== 'string') return null;
  return {
    current: row.current_streak,
    longest: row.longest_streak,
    lastPlayedOn: row.last_played_on,
  };
}
