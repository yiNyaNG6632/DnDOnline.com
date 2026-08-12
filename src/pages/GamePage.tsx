import { useCallback, useState } from 'react';
import { Link } from 'wouter';
import { GameCanvas } from '../components/GameCanvas';
import { levels } from '../game/levels';
import type { GameMode } from '../game/types';

type Props = { mode?: GameMode };

export function GamePage({ mode = 'normal' }: Props) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [enemiesLeft, setEnemiesLeft] = useState(levels[0].enemies.length);
  const [wave, setWave] = useState(1);
  const [wavesComplete, setWavesComplete] = useState(false);
  const [finished, setFinished] = useState(false);
  const level = levels[levelIndex];

  const handleProgress = useCallback((count: number) => setStars(count), []);
  const handleCombatChange = useCallback((currentWave: number, count: number, complete: boolean) => {
    setWave(currentWave);
    setEnemiesLeft(count);
    setWavesComplete(complete);
  }, []);
  const handleWin = useCallback(() => {
    if (levelIndex === levels.length - 1) setFinished(true);
    else {
      setStars(0);
      setEnemiesLeft(levels[levelIndex + 1].enemies.length);
      setWave(1);
      setWavesComplete(false);
      setLevelIndex((current) => current + 1);
    }
  }, [levelIndex]);

  const restart = () => {
    setStars(0);
    setEnemiesLeft(levels[0].enemies.length);
    setWave(1);
    setWavesComplete(false);
    setFinished(false);
    setLevelIndex(0);
  };
  const hint = getHint(mode, stars, enemiesLeft, wavesComplete, level.hint, level.gimmick);

  return (
    <main className="game-page" style={{ '--level-accent': level.accent } as React.CSSProperties}>
      <header className="game-header">
        <Link href="/" className="game-brand"><i /> TELECINE</Link>
        <div className="room-title">
          <small>{level.chapter}{mode !== 'normal' && <b>{mode === 'pve' ? 'PvE mode' : 'Hard mode'}</b>}</small>
          <strong>{level.name}</strong>
        </div>
        <div className="memory-count" aria-label={`${stars} of 3 memories`}>
          {[0, 1, 2].map((item) => <i className={item < stars ? 'found' : ''} key={item}>✦</i>)}
          <span>MEMORIES</span>
        </div>
      </header>
      <section className="game-frame">
        <GameCanvas
          level={level}
          levelIndex={levelIndex}
          mode={mode}
          onProgress={handleProgress}
          onCombatChange={handleCombatChange}
          onWin={handleWin}
        />
        <div className="hint-card">
          <b>{mode === 'pve' ? `WAVE ${wave}/3 · ${enemiesLeft} LEFT` : mode === 'hard' ? 'HARD MODE' : 'WHISPER'}</b>
          <span>{hint}</span>
        </div>
      </section>
      <div className="game-help">
        <span><kbd>W</kbd> JUMP</span><span><kbd>Q</kbd> SPLIT ×3</span>
        <span><kbd>W</kbd> BOUNCE &amp; REPEAT</span>
        <span><kbd>E</kbd> {mode === 'pve' ? 'PICK UP / THROW' : mode === 'hard' ? 'PUSH CREATURES' : '+ WASD MOVE PLATFORM'}</span>
      </div>
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

function getHint(
  mode: GameMode,
  stars: number,
  enemiesLeft: number,
  wavesComplete: boolean,
  levelHint: string,
  gimmick: string,
) {
  if (mode === 'pve' && enemiesLeft === 0 && !wavesComplete) return 'Wave cleared. Brace for the next attack!';
  if (mode === 'pve' && enemiesLeft > 0) return gimmick;
  if (stars === 3) return 'The door is awake. Find it.';
  if (mode === 'pve' && wavesComplete) return 'All waves cleared. Collect the remaining memories.';
  if (mode === 'hard') return 'Platforms are locked. Trust your split jump.';
  return levelHint;
}
