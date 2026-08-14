import { useState } from 'react';
import { Link } from 'wouter';
import './HomePage.css';

type OpenPanel = 'controls' | 'about' | null;

export function HomePage() {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  return (
    <main className="home-menu">
      <div className="home-menu__shade" />
      <section className="home-menu__content">
        <div className="home-menu__clay-mark" aria-hidden="true">✦</div>
        <p className="home-menu__studio">A tiny plasticine adventure</p>
        <h1>Tele<em>cine</em></h1>
        <p className="home-menu__tagline">Small body. Big thoughts.</p>

        <nav className="home-menu__buttons" aria-label="Main menu">
          <Link href="/game" className="menu-button menu-button--play">
            <span>Play</span><b>▶</b>
          </Link>
          <button className="menu-button" onClick={() => setOpenPanel('controls')}>How to play</button>
          <button className="menu-button" onClick={() => setOpenPanel('about')}>About</button>
        </nav>
      </section>

      <p className="home-menu__footer">Made with clay, courage &amp; imagination</p>

      {openPanel && (
        <div className="menu-modal" role="dialog" aria-modal="true" aria-labelledby="menu-modal-title">
          <div className="menu-modal__card">
            <button className="menu-modal__close" onClick={() => setOpenPanel(null)} aria-label="Close">×</button>
            {openPanel === 'controls' ? <Controls /> : <About />}
          </div>
        </div>
      )}
    </main>
  );
}

function Controls() {
  return (
    <div className="menu-modal__body">
      <p className="menu-modal__label">Ready, Pip?</p>
      <h2 id="menu-modal-title">How to play</h2>
      <div className="control-row"><kbd>←</kbd><kbd>→</kbd><span>Move left and right</span></div>
      <div className="control-row"><kbd>↑</kbd><span>Jump</span></div>
      <div className="control-row"><kbd>Q</kbd><span>Split off a clay step while airborne (up to 3)</span></div>
      <div className="control-row"><kbd>↑</kbd><span>Bounce, then split again to chain jumps</span></div>
      <div className="control-row"><kbd>E</kbd><kbd>ARROWS</kbd><span>Move glowing platforms with your mind</span></div>
      <div className="control-row"><kbd>E</kbd><span>Push nearby creatures with telekinesis</span></div>
      <p className="menu-modal__hint">Press Esc to pause and swap between Arrow keys and WASD.</p>
    </div>
  );
}

function About() {
  return (
    <div className="menu-modal__body">
      <p className="menu-modal__label">About the game</p>
      <h2 id="menu-modal-title">A little hero,<br />a very big world.</h2>
      <p className="menu-modal__copy">
        Help Pip escape nine handmade rooms by moving platforms with telekinesis
        and using a well-timed split jump. Every room holds a memory.
      </p>
    </div>
  );
}
