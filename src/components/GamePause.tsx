import { Link } from 'wouter';
import type { ControlScheme } from '../game/types';

type Props = {
  controls: ControlScheme;
  onControlsChange: (controls: ControlScheme) => void;
  onResume: () => void;
};

export function GamePause({ controls, onControlsChange, onResume }: Props) {
  return (
    <div className="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="pause-card">
        <small>GAME PAUSED</small>
        <h2 id="pause-title">Controls</h2>
        <div className="control-switch">
          <button className={controls === 'arrows' ? 'active' : ''} onClick={() => onControlsChange('arrows')}>Arrow keys</button>
          <button className={controls === 'wasd' ? 'active' : ''} onClick={() => onControlsChange('wasd')}>WASD</button>
        </div>
        <p>Tap Down to drop through ledges—or enter a hidden opening.</p>
        <button className="resume-button" onClick={onResume}>Resume</button>
        <Link href="/" className="pause-title-button">Back to title</Link>
      </div>
    </div>
  );
}
