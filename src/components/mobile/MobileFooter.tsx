'use client';

import Link from 'next/link';

const STUDIO_LINKS = [
  { label: 'Work', href: '/portfolio' },
  { label: 'Team', href: '/talents' },
  { label: 'Services', href: '/#services' },
  { label: 'Contact', href: '/#contact' },
];

const SERVICE_LINKS = [
  { label: 'Photography', href: '/services/photo/portfolio' },
  { label: 'Videography', href: '/services/video/portfolio' },
  { label: 'Motion', href: '/services/motion/portfolio' },
  { label: 'Design', href: '/services/design/portfolio' },
  { label: 'Web', href: '/services/web/portfolio' },
];

export default function MobileFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="m-foot">
      <div className="m-foot-hero">
        <p className="m-foot-wordmark" aria-hidden="true">
          Constantia
        </p>
        <p className="m-foot-tagline">
          A creative studio working globally
          <br />
          from Casablanca, Morocco.
        </p>
      </div>

      <nav className="m-foot-nav" aria-label="Footer">
        <div className="m-foot-col">
          <p className="m-foot-head">Studio</p>
          <div className="m-foot-links">
            {STUDIO_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="m-foot-link">
                {l.label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="m-foot-col">
          <p className="m-foot-head">Services</p>
          <div className="m-foot-links">
            {SERVICE_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="m-foot-link">
                {l.label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="m-foot-mark-row">
        <span className="m-foot-dot" aria-hidden="true" />
        <p className="m-foot-mark">Constantia Studio</p>
        <span className="m-foot-sep" />
        <p className="m-foot-year">MMXXVI</p>
      </div>

      <div className="m-foot-bottom">
        <a href="mailto:h.lachheb@constantia.ma" className="m-foot-email">
          h.lachheb@constantia.ma
        </a>
        <p className="m-foot-small">
          © {year} Constantia. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        .m-foot {
          position: relative;
          background: linear-gradient(
            180deg,
            var(--m-bg) 0%,
            #060608 100%
          );
          color: var(--m-ink-hi);
          padding:
            var(--m-sp-9)
            var(--m-pad-x)
            calc(var(--m-safe-b) + 2.25rem);
          overflow: hidden;
          isolation: isolate;
        }
        .m-foot::before {
          content: '';
          position: absolute;
          top: -40%;
          left: -10%;
          right: -10%;
          height: 60%;
          background: radial-gradient(
            ellipse 60% 55% at 50% 100%,
            rgba(97, 203, 248, 0.12) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: -1;
        }

        .m-foot-hero {
          margin-bottom: 2.8rem;
        }
        .m-foot-wordmark {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-style: italic;
          font-size: clamp(3.2rem, 18vw, 5.4rem);
          line-height: 0.92;
          letter-spacing: -0.03em;
          color: var(--m-ink-hi);
          margin: 0 0 1.4rem;
          background: linear-gradient(
            180deg,
            var(--m-ink-hi) 0%,
            rgba(255, 255, 255, 0.25) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .m-foot-tagline {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.5;
          color: var(--m-ink-mid);
          max-width: 30ch;
          margin: 0;
        }

        .m-foot-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem 1rem;
          padding: 2rem 0;
          border-top: 1px solid var(--m-border);
          border-bottom: 1px solid var(--m-border);
          margin-bottom: 2rem;
        }
        .m-foot-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .m-foot-head {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0;
        }
        .m-foot-links {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .m-foot-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.98rem;
          color: var(--m-ink-mid);
          padding: 0.55rem 0;
          min-height: var(--m-tap);
          transition: color var(--m-dur) var(--m-ease);
        }
        .m-foot-link span {
          color: var(--m-ink-muted);
          font-size: 0.72rem;
        }
        .m-foot-link:active {
          color: var(--m-ink-hi);
        }

        .m-foot-mark-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.4rem;
        }
        .m-foot-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 12px var(--m-accent-glow);
        }
        .m-foot-mark {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 0.9rem;
          color: var(--m-ink-hi);
          margin: 0;
        }
        .m-foot-sep {
          flex: 1;
          height: 1px;
          background: var(--m-border);
        }
        .m-foot-year {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          color: var(--m-ink-muted);
          margin: 0;
        }

        .m-foot-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .m-foot-email {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          color: var(--m-ink-hi);
          border-bottom: 1px solid var(--m-border-strong);
          width: fit-content;
          padding-bottom: 3px;
        }
        .m-foot-small {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: var(--m-ink-muted);
          margin: 0;
        }
      `}</style>
    </footer>
  );
}
