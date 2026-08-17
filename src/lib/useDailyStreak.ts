import { useEffect, useState } from 'react';
import { loadDailyStreak, recordDailyPlay, type DailyStreak } from './dailyStreak';

export function useDailyStreak(userId: string | undefined, shouldRecord = false) {
  const [streak, setStreak] = useState<DailyStreak | null>(null);

  useEffect(() => {
    if (!userId) {
      setStreak(null);
      return;
    }

    let active = true;
    const request = shouldRecord ? recordDailyPlay() : loadDailyStreak();
    void request.then((nextStreak) => {
      if (active) setStreak(nextStreak);
    }).catch(() => {
      if (active) setStreak(null);
    });

    return () => { active = false; };
  }, [shouldRecord, userId]);

  return streak;
}
