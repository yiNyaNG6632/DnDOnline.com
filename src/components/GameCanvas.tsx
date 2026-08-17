import { useEffect, useRef } from 'react';
import { createState, updateGame } from '../game/engine';
import type { GameActions } from '../game/engine';
import { renderGame } from '../game/renderer';
import { loadEnemyStrategy } from '../lib/enemyAi';
import type { ControlScheme, Level } from '../game/types';
import { TouchControls } from './TouchControls';

type Props = {
  level: Level;
  levelIndex: number;
  controls: ControlScheme;
  paused: boolean;
  onProgress: (stars: number) => void;
  onHealthChange: (health: number) => void;
  onEnergyChange: (energy: number) => void;
  onSecretFound: () => void;
  onStrategyChange: (name: string, taunt: string, generatedByAi: boolean) => void;
  onLose: () => void;
  onWin: () => void;
};

export function GameCanvas({
  level, levelIndex, controls, paused, onProgress, onHealthChange, onEnergyChange,
  onSecretFound, onStrategyChange, onLose, onWin,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef(new Set<string>());
  const actionsRef = useRef<GameActions>({ jump: false, split: false, power: false });
  const controlsRef = useRef(controls);
  const pausedRef = useRef(paused);

  useEffect(() => { controlsRef.current = controls; }, [controls]);
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      keysRef.current.clear();
      actionsRef.current = { jump: false, split: false, power: false };
    }
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = createState(level);
    let active = true;
    onHealthChange(state.player.health);
    onEnergyChange(state.player.energy);
    void loadEnemyStrategy(level).then(({ strategy, generatedByAi }) => {
      if (!active) return;
      state.enemyStrategy = strategy;
      onStrategyChange(strategy.name, strategy.taunt, generatedByAi);
    });
    const image = new Image();
    image.src = level.background;
    let frame = 0;
    let lastStars = 0;
    let lastSecrets = 0;
    let lastHealth = state.player.health;
    let lastEnergy = Math.round(state.player.energy);
    const down = (event: KeyboardEvent) => {
      if (pausedRef.current) return;
      const key = event.key.toLowerCase();
      if ([' ', 'a', 'd', 'w', 's', 'q', 'e', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) event.preventDefault();
      keysRef.current.add(key);
      const jumpKey = controlsRef.current === 'wasd' ? 'w' : 'arrowup';
      if (!event.repeat && [jumpKey, ' '].includes(key)) actionsRef.current.jump = true;
      if (!event.repeat && key === 'q') actionsRef.current.split = true;
      if (!event.repeat && key === 'e') actionsRef.current.power = true;
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    const loop = () => {
      if (pausedRef.current) {
        frame = requestAnimationFrame(loop);
        return;
      }
      updateGame(state, level, keysRef.current, actionsRef.current, controlsRef.current);
      actionsRef.current = { jump: false, split: false, power: false };
      renderGame(ctx, state, level, image);
      const count = state.stars.filter(Boolean).length;
      if (count !== lastStars) { lastStars = count; onProgress(count); }
      const secretCount = state.discoveredSecrets.filter(Boolean).length;
      if (secretCount > lastSecrets) { lastSecrets = secretCount; onSecretFound(); }
      if (state.player.health !== lastHealth) {
        lastHealth = state.player.health;
        onHealthChange(lastHealth);
      }
      const energy = Math.round(state.player.energy);
      if (energy !== lastEnergy) {
        lastEnergy = energy;
        onEnergyChange(energy);
      }
      if (state.lost) onLose();
      else if (state.won) onWin();
      else frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [level, levelIndex, onEnergyChange, onHealthChange, onLose, onProgress, onSecretFound, onStrategyChange, onWin]);

  const press = (key: string) => keysRef.current.add(key);
  const release = (key: string) => keysRef.current.delete(key);
  const directionKeys = controls === 'wasd'
    ? { left: 'a', right: 'd', up: 'w', down: 's' }
    : { left: 'arrowleft', right: 'arrowright', up: 'arrowup', down: 'arrowdown' };
  const directionLabels = controls === 'wasd'
    ? { left: 'A', right: 'D', up: 'W', down: 'S' }
    : { left: '←', right: '→', up: '↑', down: '↓' };
  return (
    <div className="game-stage">
      <canvas ref={canvasRef} width="1000" height="650" aria-label="Telecine game world" />
      <div className="power-buttons">
        <button onPointerDown={() => { actionsRef.current.split = true; }}><kbd>Q</kbd> Split step</button>
        <button
          onPointerDown={() => {
            keysRef.current.add('e');
            actionsRef.current.power = true;
          }}
          onPointerUp={() => release('e')}
          onPointerLeave={() => release('e')}
        ><kbd>E</kbd> Push / move</button>
      </div>
      <TouchControls
        keys={directionKeys}
        labels={directionLabels}
        onPress={press}
        onRelease={release}
        onJump={() => {
          press(directionKeys.up);
          actionsRef.current.jump = true;
        }}
        onSplit={() => { actionsRef.current.split = true; }}
        onPowerStart={() => {
          press('e');
          actionsRef.current.power = true;
        }}
        onPowerEnd={() => release('e')}
      />
    </div>
  );
}
