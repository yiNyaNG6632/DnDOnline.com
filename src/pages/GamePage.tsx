import { useCallback, useEffect, useRef, useState } from 'react';
import { ControlChoice } from '../components/ControlChoice';
import { GameCanvas } from '../components/GameCanvas';
import { GameEnding } from '../components/GameEnding';
import { GameHud } from '../components/GameHud';
import { GamePause } from '../components/GamePause';
import { StoryCutscene } from '../components/StoryCutscene';
import type { CutsceneId } from '../components/StoryCutscene';
import { levels } from '../game/levels';
import type { ControlScheme, InputMode } from '../game/types';
import { useAchievementUnlocks } from '../lib/useAchievementUnlocks';
import { useDailyStreak } from '../lib/useDailyStreak';
import { usePlayerSession } from '../lib/usePlayerSession';

const LOADING_ENEMY_PLAN = {
  name: 'Enemy AI loading…', taunt: 'The shadows are choosing how to hunt you.', ai: false,
};

export function GamePage() {
  const gameFrameRef = useRef<HTMLElement>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [health, setHealth] = useState(3);
  const [energy, setEnergy] = useState(100);
  const [controls, setControls] = useState<ControlScheme>('arrows');
  const [inputMode, setInputMode] = useState<InputMode | null>(null);
  const [paused, setPaused] = useState(false);
  const [defeated, setDefeated] = useState(false);
  const [runId, setRunId] = useState(0);
  const [enemyPlan, setEnemyPlan] = useState(LOADING_ENEMY_PLAN);
  const [finished, setFinished] = useState(false);
  const [foundSecret, setFoundSecret] = useState(false);
  const [cutscene, setCutscene] = useState<CutsceneId | null>(null);
  const { user } = usePlayerSession();
  const streak = useDailyStreak(user?.id, true);
  const level = levels[levelIndex];

  const handleProgress = useCallback((count: number) => setStars(count), []);
  const handleSecretFound = useCallback(() => setFoundSecret(true), []);
  const handleStrategy = useCallback((name: string, taunt: string, ai: boolean) => {
    setEnemyPlan({ name, taunt, ai });
  }, []);
  const handleLose = useCallback(() => { setPaused(false); setDefeated(true); }, []);
  const handleWin = useCallback(() => {
    if (levelIndex === levels.length - 1) {
      setPaused(false);
      setFinished(true);
      setCutscene('origin');
    }
    else {
      setStars(0);
      setHealth(3);
      setEnergy(100);
      setEnemyPlan(LOADING_ENEMY_PLAN);
      setLevelIndex((current) => current + 1);
      if (levelIndex === 2) setCutscene('clue');
      if (levelIndex === 5) setCutscene('maker');
    }
  }, [levelIndex]);

  useEffect(() => {
    const togglePause = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement) return;
      if (event.key === 'Escape' && inputMode && !cutscene && !defeated && !finished) {
        setPaused((current) => !current);
      }
    };
    window.addEventListener('keydown', togglePause);
    return () => window.removeEventListener('keydown', togglePause);
  }, [cutscene, defeated, finished, inputMode]);

  const restart = () => {
    setStars(0);
    setHealth(3);
    setEnergy(100);
    setDefeated(false);
    setPaused(false);
    setFinished(false);
    setEnemyPlan(LOADING_ENEMY_PLAN);
    setCutscene('awakening');
    setRunId((current) => current + 1);
    setLevelIndex(0);
  };
  const retry = () => {
    setHealth(3);
    setEnergy(100);
    setDefeated(false);
    setPaused(false);
    setEnemyPlan(LOADING_ENEMY_PLAN);
    setRunId((current) => current + 1);
  };
  const chooseInputMode = (mode: InputMode) => {
    const frame = gameFrameRef.current;
    if (!document.fullscreenElement && frame?.requestFullscreen) {
      void frame.requestFullscreen().catch(() => undefined);
    }
    setInputMode(mode);
    setCutscene('awakening');
  };
  const hint = stars === 3 ? 'The door is awake. Find it.' : enemyPlan.taunt;
  useAchievementUnlocks({
    userId: user?.id, stars, foundSecret, levelIndex, finished, streakCurrent: streak?.current,
  });

  return (
    <main className="game-page" style={{ '--level-accent': level.accent } as React.CSSProperties}>
      <section className="game-frame" ref={gameFrameRef}>
        <GameCanvas
          key={`${levelIndex}-${runId}`}
          level={level}
          levelIndex={levelIndex}
          controls={controls}
          inputMode={inputMode ?? 'pc'}
          paused={paused || cutscene !== null || inputMode === null}
          onProgress={handleProgress}
          onHealthChange={setHealth}
          onEnergyChange={setEnergy}
          onSecretFound={handleSecretFound}
          onStrategyChange={handleStrategy}
          onLose={handleLose}
          onWin={handleWin}
        />
        <GameHud
          frameRef={gameFrameRef}
          level={level}
          health={health}
          energy={energy}
          stars={stars}
          streak={streak?.current}
          onStory={() => setCutscene('awakening')}
          onPause={() => setPaused(true)}
        />
        <div className="hint-card">
          <b>{enemyPlan.ai ? 'GEMINI TACTIC' : 'ENEMY TACTIC'} · {enemyPlan.name}</b>
          <span>{hint}</span>
        </div>
        {paused && inputMode && <GamePause
          controls={controls}
          inputMode={inputMode}
          onControlsChange={setControls}
          onInputModeChange={setInputMode}
          onResume={() => setPaused(false)}
        />}
        {!inputMode && <ControlChoice onChoose={chooseInputMode} />}
      </section>
      {inputMode === 'pc' && <div className="game-help">
        <span><kbd>{controls === 'wasd' ? 'W' : '↑'}</kbd> JUMP</span><span><kbd>Q</kbd> SPLIT ×3</span>
        <span><kbd>{controls === 'wasd' ? 'S' : '↓'}</kbd> DROP / ENTER</span>
        <span><kbd>E</kbd> PUSH ENEMIES</span>
        <span><kbd>E</kbd> + {controls === 'wasd' ? 'WASD' : 'ARROWS'} MOVE PLATFORM</span>
      </div>}
      {defeated && <GameEnding kind="defeat" onAction={retry} />}
      {finished && <GameEnding kind="finished" onAction={restart} />}
      {cutscene && <StoryCutscene id={cutscene} onComplete={() => setCutscene(null)} />}
    </main>
  );
}
