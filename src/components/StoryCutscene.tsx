import { useCallback, useEffect, useState } from 'react';
import './StoryCutscene.css';

export type CutsceneId = 'awakening' | 'clue' | 'maker' | 'origin';

type StoryFrame = { image: string; alt: string };

const CUTSCENES: Record<CutsceneId, StoryFrame[]> = {
  awakening: [
    { image: '/assets/cutscene-awakening.jpg', alt: 'Pip wakes in a giant moonlit bedroom' },
    { image: '/assets/cutscene-awakening-2.jpg', alt: 'Pip follows a golden spark toward the bedroom door' },
  ],
  clue: [
    { image: '/assets/cutscene-clue-fingerprint.jpg', alt: 'Pip finds a fingerprint pressed into old clay' },
    { image: '/assets/cutscene-clue-sketch.jpg', alt: 'Pip discovers an incomplete drawing shaped like him' },
  ],
  maker: [
    { image: '/assets/cutscene-memory.jpg', alt: 'Pip sees fragments of a handmade memory' },
    { image: '/assets/cutscene-memory-2.jpg', alt: 'Pip remembers the hands that shaped him from clay' },
  ],
  origin: [
    { image: '/assets/cutscene-origin.jpg', alt: 'Pip discovers his origin on a sunlit craft table' },
    { image: '/assets/cutscene-origin-2.jpg', alt: 'Pip approaches a door into a new imagined world' },
  ],
};

type Props = { id: CutsceneId; onComplete: () => void };

export function StoryCutscene({ id, onComplete }: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = CUTSCENES[id];
  const frame = frames[frameIndex];
  const isLast = frameIndex === frames.length - 1;
  const advance = useCallback(() => {
    if (isLast) onComplete();
    else setFrameIndex((current) => current + 1);
  }, [isLast, onComplete]);

  useEffect(() => {
    const timer = window.setTimeout(advance, 3600);
    return () => window.clearTimeout(timer);
  }, [advance]);

  useEffect(() => {
    const nextFrame = frames[frameIndex + 1];
    if (nextFrame) new Image().src = nextFrame.image;
  }, [frameIndex, frames]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onComplete();
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') advance();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, onComplete]);

  return (
    <div className="cutscene" role="dialog" aria-modal="true" aria-label="Story cutscene" onClick={advance}>
      <div className={`cutscene__viewport ${frameIndex % 2 ? 'cutscene__viewport--reverse' : ''}`}>
        <img className="cutscene__art" src={frame.image} alt={frame.alt} key={frame.image} />
        <div className="cutscene__shade" />
      </div>
    </div>
  );
}
