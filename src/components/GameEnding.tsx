import { Link } from 'wouter';

type Props = {
  kind: 'defeat' | 'finished';
  onAction: () => void;
};

export function GameEnding({ kind, onAction }: Props) {
  const defeated = kind === 'defeat';

  return (
    <div className="ending">
      <div className="ending__card">
        <span className="ending__star">{defeated ? '☾' : '✦'}</span>
        <p>{defeated ? 'THE SHADOWS CAUGHT PIP' : 'PIP REMEMBERED'}</p>
        <h1>
          {defeated ? <>Try a different path<br />or push them <em>away.</em></> : <>
            Made from one small idea.<br />Ready for a <em>big world.</em>
          </>}
        </h1>
        <button onClick={onAction}>{defeated ? 'Try again' : 'Play again'} <b>↻</b></button>
        <Link href="/">Back to the title</Link>
      </div>
    </div>
  );
}
