import { useEffect, useRef } from 'react';
import { createState, updateGame } from '../game/engine';
import { renderGame } from '../game/renderer';
import type { Level } from '../game/types';

type Props = { level: Level; levelIndex: number; onProgress: (stars: number) => void; onWin: () => void };

export function GameCanvas({ level, levelIndex, onProgress, onWin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef(new Set<string>());
  const actionsRef = useRef({ split: false, recall: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = createState(level);
    state.enemies = level.enemies.map((enemy) => ({ ...enemy, vx: 0, vy: 0 }));
    const image = new Image(); image.src = level.background;
    let frame = 0;
    let lastStars = 0;
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'a', 'd', 'w', 's', 'q', 'e'].includes(key)) event.preventDefault();
      keysRef.current.add(key);
      if (!event.repeat && key === 'q') actionsRef.current.split = true;
      if (!event.repeat && key === 'e') actionsRef.current.recall = true;
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    const loop = () => {
      updateGame(state, level, keysRef.current, actionsRef.current);
      actionsRef.current = { split: false, recall: false };
      renderGame(ctx, state, level, image);
      const count = state.stars.filter(Boolean).length;
      if (count !== lastStars) { lastStars = count; onProgress(count); }
      if (state.won) onWin(); else frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [level, levelIndex, onProgress, onWin]);

  const press = (key: string) => () => keysRef.current.add(key);
  const release = (key: string) => () => keysRef.current.delete(key);
  return (
    <div className="game-stage">
      <canvas ref={canvasRef} width="1000" height="650" aria-label="Telecine game world" />
      <div className="power-buttons">
        <button onPointerDown={() => { actionsRef.current.split = true; }}><kbd>Q</kbd> Split</button>
        <button onPointerDown={() => { actionsRef.current.recall = true; }}><kbd>E</kbd> Reunite</button>
      </div>
      <div className="touch-controls">
        <button onPointerDown={press('a')} onPointerUp={release('a')} onPointerLeave={release('a')}>←</button>
        <button onPointerDown={press('d')} onPointerUp={release('d')} onPointerLeave={release('d')}>→</button>
        <button onPointerDown={press('w')} onPointerUp={release('w')}>↑</button>
        <button onPointerDown={press('s')} onPointerUp={release('s')}>↓</button>
        <button className="touch-power" aria-label="Split body" onPointerDown={() => { actionsRef.current.split = true; }}>◐</button>
        <button className="touch-power touch-recall" aria-label="Reunite body" onPointerDown={() => { actionsRef.current.recall = true; }}>✦</button>
      </div>
    </div>
  );
}
