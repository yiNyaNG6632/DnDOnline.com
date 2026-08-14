import { useCallback, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { GameCanvas } from '../components/GameCanvas';
import { StatusBar } from '../components/StatusBar';
import { levels } from '../game/levels';
import type { ControlScheme } from '../game/types';

const LOADING_ENEMY_PLAN = {
  name: 'Enemy AI loading…', taunt: 'The shadows are choosing how to hunt you.', ai: false,
};

export function GamePage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [health, setHealth] = useState(3);
  const [energy, setEnergy] = useState(100);
  const [controls, setControls] = useState<ControlScheme>('arrows');
  const [paused, setPaused] = useState(false);
  const [defeated, setDefeated] = useState(false);
  const [runId, setRunId] = useState(0);
  const [enemyPlan, setEnemyPlan] = useState(LOADING_ENEMY_PLAN);
  const [finished, setFinished] = useState(false);
  const level = levels[levelIndex];

  const handleProgress = useCallback((count: number) => setStars(count), []);
  const handleStrategy = useCallback((name: string, taunt: string, ai: boolean) => {
    setEnemyPlan({ name, taunt, ai });
  }, []);
  const handleLose = useCallback(() => { setPaused(false); setDefeated(true); }, []);
  const handleWin = useCallback(() => {
    if (levelIndex === levels.length - 1) { setPaused(false); setFinished(true); }
    else {
      setStars(0);
      setHealth(3);
      setEnergy(100);
      setEnemyPlan(LOADING_ENEMY_PLAN);
      setLevelIndex((current) => current + 1);
    }
  }, [levelIndex]);

  useEffect(() => {
    const togglePause = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !defeated && !finished) setPaused((current) => !current);
    };
    window.addEventListener('keydown', togglePause);
    return () => window.removeEventListener('keydown', togglePause);
  }, [defeated, finished]);

  const restart = () => {
    setStars(0);
    setHealth(3);
    setEnergy(100);
    setDefeated(false);
    setPaused(false);
    setFinished(false);
    setEnemyPlan(LOADING_ENEMY_PLAN);
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
  const hint = stars === 3 ? 'The door is awake. Find it.' : enemyPlan.taunt;

  return (
    <main className="game-page" style={{ '--level-accent': level.accent } as React.CSSProperties}>
      <section className="game-frame">
        <GameCanvas
          key={`${levelIndex}-${runId}`}
          level={level}
          levelIndex={levelIndex}
          controls={controls}
          paused={paused}
          onProgress={handleProgress}
          onHealthChange={setHealth}
          onEnergyChange={setEnergy}
          onStrategyChange={handleStrategy}
          onLose={handleLose}
          onWin={handleWin}
        />
        <div className="game-hud">
          <div className="game-player-status">
            <div className="game-brand-row">
              <Link href="/" className="game-brand"><i /> TELECINE</Link>
              <button className="pause-button" onClick={() => setPaused(true)}>Pause</button>
            </div>
            <StatusBar label="Health" value={health} max={3} tone="health" />
            <StatusBar label="Energy" value={energy} max={100} tone="energy" />
          </div>
          <div className="room-title">
            <small>{level.chapter}</small>
            <strong>{level.name}</strong>
          </div>
          <div className="memory-count" aria-label={`${stars} of 3 memories`}>
            {[0, 1, 2].map((item) => <i className={item < stars ? 'found' : ''} key={item}>✦</i>)}
            <span>MEMORIES</span>
          </div>
        </div>
        <div className="hint-card">
          <b>{enemyPlan.ai ? 'GEMINI TACTIC' : 'ENEMY TACTIC'} · {enemyPlan.name}</b>
          <span>{hint}</span>
        </div>
        {paused && (
          <div className="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
            <div className="pause-card">
              <small>GAME PAUSED</small>
              <h2 id="pause-title">Controls</h2>
              <div className="control-switch">
                <button className={controls === 'arrows' ? 'active' : ''} onClick={() => setControls('arrows')}>Arrow keys</button>
                <button className={controls === 'wasd' ? 'active' : ''} onClick={() => setControls('wasd')}>WASD</button>
              </div>
              <p>Movement and <kbd>E</kbd> platform control use this layout.</p>
              <button className="resume-button" onClick={() => setPaused(false)}>Resume</button>
            </div>
          </div>
        )}
      </section>
      <div className="game-help">
        <span><kbd>{controls === 'wasd' ? 'W' : '↑'}</kbd> JUMP</span><span><kbd>Q</kbd> SPLIT ×3</span>
        <span><kbd>E</kbd> PUSH ENEMIES</span>
        <span><kbd>E</kbd> + {controls === 'wasd' ? 'WASD' : 'ARROWS'} MOVE PLATFORM</span>
      </div>
      {defeated && (
        <div className="ending">
          <div className="ending__card">
            <span className="ending__star">☾</span><p>THE SHADOWS CAUGHT PIP</p>
            <h1>Try a different path<br />or push them <em>away.</em></h1>
            <button onClick={retry}>Try again <b>↻</b></button>
            <Link href="/">Back to the title</Link>
          </div>
        </div>
      )}
      {finished && (
        <div className="ending">
          <div className="ending__card">
            <span className="ending__star">✦</span><p>THE END... FOR NOW</p>
            <h1>Every little thought<br />can move a <em>big world.</em></h1>
            <button onClick={restart}>Play again <b>↻</b></button>
            <Link href="/">Back to the title</Link>
          </div>
        </div>
      )}
    </main>
  );
}
