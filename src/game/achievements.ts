export const achievements = [
  { id: 'first_play', icon: '🚀', name: 'Tiny First Step', description: 'Start your first adventure.' },
  { id: 'first_memory', icon: '✦', name: 'Memory Spark', description: 'Collect your first memory.' },
  { id: 'memory_master', icon: '🌟', name: 'Room Remembered', description: 'Collect all 3 memories in one room.' },
  { id: 'secret_finder', icon: '🔎', name: 'Behind the Scenery', description: 'Discover a secret room.' },
  { id: 'room_clear', icon: '🚪', name: 'Door Opener', description: 'Complete your first room.' },
  { id: 'streak_keeper', icon: '🔥', name: 'Dream Habit', description: 'Reach a 3-day play streak.' },
  { id: 'dream_complete', icon: '🌙', name: 'Wake Up, Pip', description: 'Complete all 9 rooms.' },
] as const;

export type AchievementId = typeof achievements[number]['id'];
