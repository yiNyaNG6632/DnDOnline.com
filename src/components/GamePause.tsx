import { Link } from 'wouter';
import type { ControlScheme, InputMode } from '../game/types';

type Props = {
  controls: ControlScheme;
  inputMode: InputMode;
  onControlsChange: (controls: ControlScheme) => void;
  onInputModeChange: (mode: InputMode) => void;
  onResume: () => void;
};

export function GamePause({ controls, inputMode, onControlsChange, onInputModeChange, onResume }: Props) {
  return (
    <div className="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="pause-card">
        <small>GAME PAUSED</small>
        <h2 id="pause-title">Controls</h2>
        <div className="control-switch">
          <button className={inputMode === 'pc' ? 'active' : ''} onClick={() => onInputModeChange('pc')}>PC</button>
          <button className={inputMode === 'mobile' ? 'active' : ''} onClick={() => onInputModeChange('mobile')}>Mobile</button>
        </div>
        {inputMode === 'pc' && <div className="control-switch control-switch--keyboard">
          <button className={controls === 'arrows' ? 'active' : ''} onClick={() => onControlsChange('arrows')}>Arrow keys</button>
          <button className={controls === 'wasd' ? 'active' : ''} onClick={() => onControlsChange('wasd')}>WASD</button>
        </div>}
        <p>Tap Down to drop through ledges—or enter a hidden opening.</p>
        <button className="resume-button" onClick={onResume}>Resume</button>
        <Link href="/" className="pause-title-button">Back to title</Link>
      </div>
    </div>
  );
}
