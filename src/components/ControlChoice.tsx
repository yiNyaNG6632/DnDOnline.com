import type { InputMode } from '../game/types';

type Props = { onChoose: (mode: InputMode) => void };

export function ControlChoice({ onChoose }: Props) {
  return (
    <div className="control-choice" role="dialog" aria-modal="true" aria-labelledby="control-choice-title">
      <div className="control-choice__card">
        <small>BEFORE YOU BEGIN</small>
        <h2 id="control-choice-title">How are you playing?</h2>
        <p>You can change this later from Pause.</p>
        <div className="control-choice__options">
          <button onClick={() => onChoose('pc')}>
            <strong>⌨ PC</strong>
            <span>Keyboard controls</span>
          </button>
          <button onClick={() => onChoose('mobile')}>
            <strong>◉ Mobile</strong>
            <span>On-screen controls</span>
          </button>
        </div>
      </div>
    </div>
  );
}
