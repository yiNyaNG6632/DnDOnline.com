import { useEffect, useRef } from 'react';
import { createState, updateGame } from '../game/engine';
import { renderGame } from '../game/renderer';
import type { GameMode, Level } from '../game/types';

type Props = {
  level: Level;
  levelIndex: number;
  mode: GameMode;
  onProgress: (stars: number) => void;
  onCombatChange: (wave: number, enemies: number, complete: boolean) => void;
  onWin: () => void;
};

export function GameCanvas({ level, levelIndex, mode, onProgress, onCombatChange, onWin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef(new Set<string>());
  const actionsRef = useRef({ jump: false, split: false, power: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = createState(level, mode);
    const image = new Image(); image.src = level.background;
    let frame = 0;
    let lastStars = 0;
    let lastCombat = '';
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'a', 'd', 'w', 's', 'q', 'e'].includes(key)) event.preventDefault();
      keysRef.current.add(key);
      if (!event.repeat && ['w', 'arrowup', ' '].includes(key)) actionsRef.current.jump = true;
      if (!event.repeat && key === 'q') actionsRef.current.split = true;
      if (!event.repeat && key === 'e') actionsRef.current.power = true;
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    const loop = () => {
      updateGame(state, level, keysRef.current, actionsRef.current, mode);
      actionsRef.current = { jump: false, split: false, power: false };
      renderGame(ctx, state, level, image);
      const count = state.stars.filter(Boolean).length;
      if (count !== lastStars) { lastStars = count; onProgress(count); }
      if (state.pve) {
        const combat = `${state.pve.wave}:${state.enemies.length}:${state.pve.complete}`;
        if (combat !== lastCombat) {
          lastCombat = combat;
          onCombatChange(state.pve.wave, state.enemies.length, state.pve.complete);
        }
      }
      if (state.won) onWin(); else frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [level, levelIndex, mode, onCombatChange, onProgress, onWin]);

  const press = (key: string) => () => keysRef.current.add(key);
  const release = (key: string) => () => keysRef.current.delete(key);
  return (
    <div className="game-stage">
      <canvas ref={canvasRef} width="1000" height="650" aria-label="Telecine game world" />
      <div className="power-buttons">
        <button onPointerDown={() => { actionsRef.current.split = true; }}><kbd>Q</kbd> Split step</button>
        <button
          onPointerDown={() => {
            if (mode !== 'hard') keysRef.current.add('e');
            actionsRef.current.power = true;
          }}
          onPointerUp={release('e')}
          onPointerLeave={release('e')}
        ><kbd>E</kbd> {mode === 'pve' ? 'Pick up / throw' : mode === 'hard' ? 'Push' : '+ directions'}</button>
      </div>
      <div className="touch-controls">
        <button onPointerDown={press('a')} onPointerUp={release('a')} onPointerLeave={release('a')}>←</button>
        <button onPointerDown={press('d')} onPointerUp={release('d')} onPointerLeave={release('d')}>→</button>
        <button onPointerDown={() => { keysRef.current.add('w'); actionsRef.current.jump = true; }} onPointerUp={release('w')}>↑</button>
        <button onPointerDown={press('s')} onPointerUp={release('s')}>↓</button>
        <button className="touch-power touch-split" aria-label="Split off a jump step" onPointerDown={() => { actionsRef.current.split = true; }}>◐</button>
        <button
          className="touch-power"
          aria-label="Use telekinesis"
          onPointerDown={() => {
            if (mode !== 'hard') keysRef.current.add('e');
            actionsRef.current.power = true;
          }}
          onPointerUp={release('e')}
          onPointerLeave={release('e')}
        >✦</button>
      </div>
    </div>
  );
}
