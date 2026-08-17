import { useEffect, useState } from 'react';
import { achievements, type AchievementId } from '../game/achievements';
import { loadAchievements } from '../lib/playerAchievements';

type AchievementsProps = {
  userId?: string;
};

export function Achievements({ userId }: AchievementsProps) {
  const [unlocked, setUnlocked] = useState(new Set<AchievementId>());

  useEffect(() => {
    if (!userId) return;
    let active = true;
    void loadAchievements().then((items) => {
      if (active) setUnlocked(items);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [userId]);

  return (
    <section className="achievements-panel">
      <p className="menu-modal__label">Pip's milestones</p>
      <h2 id="menu-modal-title">Achievements</h2>
      {!userId && <p className="achievements-panel__note">Sign in to unlock and save achievements.</p>}
      {userId && <p className="achievements-panel__note">{unlocked.size} of {achievements.length} unlocked</p>}
      <div className="achievement-list">
        {achievements.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id);
          return (
            <article className={isUnlocked ? 'achievement unlocked' : 'achievement'} key={achievement.id}>
              <span aria-hidden="true">{isUnlocked ? achievement.icon : '◌'}</span>
              <div><strong>{achievement.name}</strong><p>{achievement.description}</p></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
