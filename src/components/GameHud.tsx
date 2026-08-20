import type { RefObject } from 'react';
import { Link } from 'wouter';
import type { Level } from '../game/types';
import { FullscreenButton } from './FullscreenButton';
import { StatusBar } from './StatusBar';

type Props = {
  frameRef: RefObject<HTMLElement>;
  level: Level;
  health: number;
  energy: number;
  stars: number;
  streak?: number;
  onStory: () => void;
  onPause: () => void;
};

export function GameHud({ frameRef, level, health, energy, stars, streak, onStory, onPause }: Props) {
  return (
    <div className="game-hud">
      <div className="game-player-status">
        <div className="game-brand-row">
          <Link href="/" className="game-brand"><i /> TELECINE</Link>
          <div className="game-frame-actions">
            <FullscreenButton target={frameRef} />
            <button className="pause-button" onClick={onStory}>Story</button>
            <button className="pause-button" onClick={onPause}>Pause</button>
          </div>
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
        {streak !== undefined && <small className="game-streak">🔥 {streak} DAY STREAK</small>}
      </div>
    </div>
  );
}
