import { useCallback, useState } from 'react';
import { Link } from 'wouter';
import { GameCanvas } from '../components/GameCanvas';
import { levels } from '../game/levels';

export function GamePage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [finished, setFinished] = useState(false);
  const level = levels[levelIndex];

  const handleProgress = useCallback((count: number) => setStars(count), []);
  const handleWin = useCallback(() => {
    if (levelIndex === levels.length - 1) setFinished(true);
    else { setStars(0); setLevelIndex((current) => current + 1); }
  }, [levelIndex]);

  const restart = () => { setStars(0); setFinished(false); setLevelIndex(0); };

  return (
    <main className="game-page" style={{ '--level-accent': level.accent } as React.CSSProperties}>
      <header className="game-header">
        <Link href="/" className="game-brand"><i /> TELECINE</Link>
        <div className="room-title"><small>{level.chapter}</small><strong>{level.name}</strong></div>
        <div className="memory-count" aria-label={`${stars} of 3 memories`}>
          {[0, 1, 2].map((item) => <i className={item < stars ? 'found' : ''} key={item}>✦</i>)}
          <span>MEMORIES</span>
        </div>
      </header>
      <section className="game-frame">
        <GameCanvas level={level} levelIndex={levelIndex} onProgress={handleProgress} onWin={handleWin} />
      </section>
      <div className="game-help"><span><kbd>A</kbd><kbd>D</kbd> WALK</span><span><kbd>W</kbd> JUMP</span><span><kbd>Q</kbd> SPLIT</span><span><kbd>WASD</kbd> STEER HALF</span><span><kbd>E</kbd> REUNITE</span></div>
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
