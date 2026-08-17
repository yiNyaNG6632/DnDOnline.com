import type { PointerEvent } from 'react';

type DirectionKeys = { left: string; right: string; up: string; down: string };
type DirectionLabels = { left: string; right: string; up: string; down: string };

type Props = {
  keys: DirectionKeys;
  labels: DirectionLabels;
  onPress: (key: string) => void;
  onRelease: (key: string) => void;
  onJump: () => void;
  onSplit: () => void;
  onPowerStart: () => void;
  onPowerEnd: () => void;
};

type HoldButtonProps = {
  label: string;
  ariaLabel: string;
  className?: string;
  onStart: () => void;
  onEnd: () => void;
};

function HoldButton({ label, ariaLabel, className, onStart, onEnd }: HoldButtonProps) {
  const start = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onStart();
  };
  const end = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onEnd();
  };

  return (
    <button
      className={className}
      aria-label={ariaLabel}
      onPointerDown={start}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {label}
    </button>
  );
}

export function TouchControls({
  keys, labels, onPress, onRelease, onJump, onSplit, onPowerStart, onPowerEnd,
}: Props) {
  return (
    <div className="touch-controls" aria-label="Touch game controls">
      <div className="touch-cluster touch-movement">
        <HoldButton label={labels.left} ariaLabel="Move left" onStart={() => onPress(keys.left)} onEnd={() => onRelease(keys.left)} />
        <HoldButton label={labels.right} ariaLabel="Move right" onStart={() => onPress(keys.right)} onEnd={() => onRelease(keys.right)} />
        <HoldButton label={labels.down} ariaLabel="Drop down" onStart={() => onPress(keys.down)} onEnd={() => onRelease(keys.down)} />
      </div>
      <div className="touch-cluster touch-actions">
        <HoldButton label="◐" ariaLabel="Split off a jump step" className="touch-split" onStart={onSplit} onEnd={() => undefined} />
        <HoldButton label="✦" ariaLabel="Use telekinesis" className="touch-power" onStart={onPowerStart} onEnd={onPowerEnd} />
        <HoldButton label={labels.up} ariaLabel="Jump" className="touch-jump" onStart={onJump} onEnd={() => onRelease(keys.up)} />
      </div>
    </div>
  );
}
