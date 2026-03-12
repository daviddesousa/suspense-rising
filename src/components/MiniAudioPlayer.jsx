import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Bar heights (relative) for the wave pattern — 7 bars.
 * These drive both the idle animation amplitude and the active animation.
 */
const BAR_COUNT = 7;
const BAR_DELAYS = [0, 0.15, 0.05, 0.25, 0.1, 0.2, 0.08]; // stagger offsets

export default function MiniAudioPlayer({ src }) {
  const audioRef = useRef(null);
  const holdTimer = useRef(null);
  const [active, setActive] = useState(false);

  // ------------------------------------------------------------------
  // Audio control
  // ------------------------------------------------------------------
  const unmute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
    }
    setActive(true);
  }, []);

  const mute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = true;
    }
    setActive(false);
  }, []);

  // ------------------------------------------------------------------
  // Pointer (mouse/trackpad) — hover
  // ------------------------------------------------------------------
  const handlePointerEnter = useCallback(
    (e) => {
      // Only trigger for non-touch pointers
      if (e.pointerType === 'touch') return;
      unmute();
    },
    [unmute],
  );

  const handlePointerLeave = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return;
      mute();
    },
    [mute],
  );

  // ------------------------------------------------------------------
  // Touch — long-press to activate, release to deactivate
  // ------------------------------------------------------------------
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault(); // prevent ghost clicks & text selection
      holdTimer.current = setTimeout(() => {
        unmute();
      }, 200); // slight delay so quick taps don't trigger
    },
    [unmute],
  );

  // Prevent the browser from starting a text-selection drag while the
  // user is holding the player on iOS.
  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(holdTimer.current);
    mute();
  }, [mute]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearTimeout(holdTimer.current);
  }, []);

  return (
    <div
      className="mini-audio-player"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      aria-label={
        active ? 'Audio playing' : 'Audio muted — hover or hold to listen'
      }
      role="button"
      tabIndex={0}
    >
      {/* Hidden audio element */}
      {src && (
        <audio ref={audioRef} src={src} loop muted autoPlay preload="auto" />
      )}

      {/* Speaker icon */}
      <SpeakerIcon active={active} />

      {/* Sound wave bars */}
      <div className="wave-bars">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`wave-bar ${active ? 'wave-bar--active' : ''}`}
            style={{
              animationDelay: `${BAR_DELAYS[i]}s`,
              '--bar-index': i,
            }}
          />
        ))}
      </div>

      <style>{`
        .mini-audio-player {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 100px;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: none;
          transition: border-color 0.4s ease, background 0.4s ease;
          background: rgba(255, 255, 255, 0.03);
        }

        .mini-audio-player:hover,
        .mini-audio-player:focus-visible {
          outline: none;
        }

        /* ---- Speaker icon ---- */
        .speaker-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          transition: opacity 0.4s ease;
        }

        .speaker-icon--muted {
          opacity: 0.6;
        }

        .speaker-icon--active {
          opacity: 0.85;
        }

        /* ---- Wave bars container ---- */
        .wave-bars {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 16px;
        }

        /* ---- Individual bar ---- */
        .wave-bar {
          width: 2px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 1);
          animation: idleWave 2.2s ease-in-out infinite;
          transform-origin: center bottom;
          will-change: height, opacity;
        }

        /* Muted: very subtle, slow pulse */
        @keyframes idleWave {
          0%, 100% { height: 4px;  opacity: 0.25; }
          50%       { height: 8px;  opacity: 0.35; }
        }

        /* Active: bright, lively bars */
        .wave-bar--active {
          background: rgba(255, 255, 255, 1);
          animation: activeWave 0.7s ease-in-out infinite alternate;
        }

        @keyframes activeWave {
          0%   { height: 4px;  opacity: 0.6; }
          100% { height: 16px; opacity: 1;   }
        }

        /* Stagger each bar slightly using its index */
        .wave-bar:nth-child(1) { animation-duration: 2.1s; }
        .wave-bar:nth-child(2) { animation-duration: 1.8s; }
        .wave-bar:nth-child(3) { animation-duration: 2.4s; }
        .wave-bar:nth-child(4) { animation-duration: 1.6s; }
        .wave-bar:nth-child(5) { animation-duration: 2.2s; }
        .wave-bar:nth-child(6) { animation-duration: 1.9s; }
        .wave-bar:nth-child(7) { animation-duration: 2.0s; }

        .wave-bar--active:nth-child(1) { animation-duration: 0.65s; }
        .wave-bar--active:nth-child(2) { animation-duration: 0.80s; }
        .wave-bar--active:nth-child(3) { animation-duration: 0.55s; }
        .wave-bar--active:nth-child(4) { animation-duration: 0.70s; }
        .wave-bar--active:nth-child(5) { animation-duration: 0.90s; }
        .wave-bar--active:nth-child(6) { animation-duration: 0.60s; }
        .wave-bar--active:nth-child(7) { animation-duration: 0.75s; }
      `}</style>
    </div>
  );
}

// --------------------------------------------------------------------------
// Speaker SVG icon — switches between muted/active states
// --------------------------------------------------------------------------
function SpeakerIcon({ active }) {
  return (
    <svg
      className={`speaker-icon ${active ? 'speaker-icon--active' : 'speaker-icon--muted'}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Speaker body */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {/* Sound waves — hidden when muted */}
      {active ? (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity="0.6" />
        </>
      ) : (
        /* Muted cross */
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      )}
    </svg>
  );
}
