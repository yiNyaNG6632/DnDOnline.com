import { useEffect } from 'react';
import type { AchievementId } from '../game/achievements';
import { unlockAchievement } from './playerAchievements';

type AchievementProgress = {
  userId?: string;
  stars: number;
  foundSecret: boolean;
  levelIndex: number;
  finished: boolean;
  streakCurrent?: number;
};

export function useAchievementUnlocks(progress: AchievementProgress) {
  const { userId, stars, foundSecret, levelIndex, finished, streakCurrent } = progress;

  useEffect(() => {
    if (!userId) return;
    const earned: AchievementId[] = ['first_play'];
    if (stars >= 1) earned.push('first_memory');
    if (stars >= 3) earned.push('memory_master');
    if (foundSecret) earned.push('secret_finder');
    if (levelIndex > 0 || finished) earned.push('room_clear');
    if ((streakCurrent ?? 0) >= 3) earned.push('streak_keeper');
    if (finished) earned.push('dream_complete');
    earned.forEach((id) => { void unlockAchievement(id).catch(() => undefined); });
  }, [finished, foundSecret, levelIndex, stars, streakCurrent, userId]);
}
