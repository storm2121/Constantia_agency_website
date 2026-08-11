'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LINKS = [
  { label: 'Work', href: '/portfolio', hint: 'Selected projects' },
  { label: 'Services', href: '/#services', hint: 'Five disciplines' },
  { label: 'Team', href: '/talents', hint: 'The collective' },
  { label: 'Contact', href: '/#contact', hint: 'Start a project' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const fillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 6);
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${p})`;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* The single persistent nav bar. The same toggle button morphs between
          hamburger and X — no duplicate logo, no overlap. */}
      <header className={`m-nav ${scrolled || open ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <Link
          href="/"
          aria-label="Constantia — home"
          className="m-nav-mark"
          onClick={() => setOpen(false)}
        >
          <span className="m-nav-dot" aria-hidden="true" />
          <span className="m-nav-word">Constantia</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="m-menu"
          className={`m-nav-toggle ${open ? 'is-open' : ''}`}
        >
          <span className="m-nav-toggle-icon" aria-hidden="true">
            <span className="m-nav-bar m-nav-bar--top" />
            <span className="m-nav-bar m-nav-bar--bot" />
          </span>
          <span className="m-nav-toggle-label">{open ? 'Close' : 'Menu'}</span>
        </button>
      </header>

      <div className="m-progress" aria-hidden="true">
        <span className="m-progress-fill" ref={fillRef} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="m-menu"
            key="m-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="m-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="m-menu-glow" aria-hidden="true" />

            <nav className="m-menu-list" aria-label="Primary">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.55, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="m-menu-link"
                  >
                    <span className="m-menu-idx">0{i + 1}</span>
                    <span className="m-menu-col">
                      <span className="m-menu-label">{link.label}</span>
                      <span className="m-menu-hint">{link.hint}</span>
                    </span>
                    <span className="m-menu-arrow" aria-hidden="true">↗</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="m-menu-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.55 }}
            >
              <div className="m-menu-foot-line">
                <span className="m-menu-foot-key">Studio</span>
                <span className="m-menu-foot-val">Casablanca · MA</span>
              </div>
              <a
                href="mailto:h.lachheb@constantia.ma"
                className="m-menu-email"
                onClick={() => setOpen(false)}
              >
                h.lachheb@constantia.ma
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .m-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding:
            calc(var(--m-safe-t) + 0.5rem)
            var(--m-pad-x)
            0.5rem;
          z-index: var(--m-z-menu); /* sits ABOVE the menu overlay so toggle stays tappable */
          background: transparent;
          transition:
            background var(--m-dur) var(--m-ease),
            backdrop-filter var(--m-dur) var(--m-ease),
            border-color var(--m-dur) var(--m-ease);
          border-bottom: 1px solid transparent;
          min-height: calc(var(--m-safe-t) + 56px);
          pointer-events: auto;
        }
        .m-nav.is-scrolled {
          background: rgba(13, 14, 18, 0.72);
          backdrop-filter: saturate(180%) blur(18px);
          -webkit-backdrop-filter: saturate(180%) blur(18px);
          border-bottom-color: var(--m-border);
        }
        .m-nav.is-open {
          background: rgba(13, 14, 18, 0.85);
          border-bottom-color: var(--m-border-strong);
        }

        .m-nav-mark {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          min-height: var(--m-tap);
          padding: 0 0.1rem;
        }
        .m-nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 14px var(--m-accent-glow);
          animation: m-nav-pulse 2.4s ease-in-out infinite;
        }
        @keyframes m-nav-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px var(--m-accent-glow); }
          50%      { transform: scale(1.15); box-shadow: 0 0 20px var(--m-accent-glow); }
        }
        .m-nav-word {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1rem;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
        }

        .m-nav-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          min-width: var(--m-tap);
          min-height: var(--m-tap);
          padding: 0 0.7rem 0 0.9rem;
          background: rgba(255,248,240,0.04);
          border: 1px solid var(--m-border-strong);
          border-radius: 999px;
          cursor: pointer;
          transition:
            background var(--m-dur) var(--m-ease),
            border-color var(--m-dur) var(--m-ease);
        }
        .m-nav-toggle.is-open {
          background: var(--m-accent);
          border-color: var(--m-accent);
        }
        .m-nav-toggle-icon {
          position: relative;
          width: 18px;
          height: 14px;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .m-nav-bar {
          position: absolute;
          left: 0;
          height: 1.8px;
          border-radius: 2px;
          background: var(--m-ink-hi);
          transition:
            transform var(--m-dur) var(--m-ease),
            width var(--m-dur) var(--m-ease),
            top var(--m-dur) var(--m-ease),
            background var(--m-dur) var(--m-ease);
        }
        .m-nav-bar--top { top: 3px; width: 18px; }
        .m-nav-bar--bot { top: 11px; width: 12px; }
        .m-nav-toggle.is-open .m-nav-bar { background: #06131d; width: 18px; }
        .m-nav-toggle.is-open .m-nav-bar--top { top: 7px; transform: rotate(45deg); }
        .m-nav-toggle.is-open .m-nav-bar--bot { top: 7px; transform: rotate(-45deg); }
        .m-nav-toggle-label {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-ink-hi);
          font-weight: 500;
          transition: color var(--m-dur) var(--m-ease);
        }
        .m-nav-toggle.is-open .m-nav-toggle-label { color: #06131d; }

        /* The menu opens BELOW the nav, so the logo is never duplicated
           and the X toggle is always the single way to close. */
        .m-menu {
          position: fixed;
          top: calc(var(--m-safe-t) + 56px);
          left: 0;
          right: 0;
          bottom: 0;
          z-index: var(--m-z-menu);
          background: linear-gradient(
            180deg,
            #15161b 0%,
            #0d0e12 60%,
            #0d0e12 100%
          );
          display: flex;
          flex-direction: column;
          padding:
            1rem
            var(--m-pad-x)
            calc(var(--m-safe-b) + 2rem);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .m-menu-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 85% 45% at 0% 0%, rgba(97,203,248,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 100% 30%, rgba(243,194,138,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 120%, rgba(232,113,142,0.16) 0%, transparent 70%);
        }

        .m-menu-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-top: 0.5rem;
          position: relative;
          z-index: 1;
        }
        .m-menu-link {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 0.15rem;
          border-bottom: 1px solid var(--m-border);
          min-height: 78px;
          transition: padding-left var(--m-dur) var(--m-ease);
        }
        .m-menu-link:active { padding-left: 0.6rem; }
        .m-menu-idx {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.3em;
          color: var(--m-ink-muted);
        }
        .m-menu-col {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .m-menu-label {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: clamp(2.2rem, 9vw, 3.2rem);
          line-height: 1;
          letter-spacing: -0.035em;
          color: var(--m-ink-hi);
        }
        .m-menu-hint {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.64rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
        }
        .m-menu-arrow {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1.1rem;
          color: var(--m-accent);
          opacity: 0.75;
        }

        .m-menu-foot {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .m-menu-foot-line {
          display: inline-flex;
          gap: 0.7rem;
          align-items: center;
        }
        .m-menu-foot-key {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
        }
        .m-menu-foot-val {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.78rem;
          color: var(--m-ink-mid);
        }
        .m-menu-email {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          color: var(--m-ink-hi);
          border-bottom: 1px solid var(--m-accent);
          width: fit-content;
          padding-bottom: 3px;
        }
      `}</style>
    </>
  );
}
