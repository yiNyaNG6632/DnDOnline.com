import { useEffect, useState, type RefObject } from 'react';

type FullscreenButtonProps = {
  target: RefObject<HTMLElement>;
};

export function FullscreenButton({ target }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateState = () => setIsFullscreen(document.fullscreenElement === target.current);
    document.addEventListener('fullscreenchange', updateState);
    return () => document.removeEventListener('fullscreenchange', updateState);
  }, [target]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await target.current?.requestFullscreen();
  };

  return (
    <button
      className="fullscreen-button"
      onClick={() => void toggleFullscreen()}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
    >
      {isFullscreen ? '↙' : '↗'}
    </button>
  );
}
