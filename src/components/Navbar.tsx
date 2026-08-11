'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SEPARATOR = ' \u00B7 ';

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const leftTabRef = useRef<HTMLButtonElement>(null);
  const rightTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const alpha = window.scrollY > 80 ? '0' : '1';
      if (leftTabRef.current) leftTabRef.current.style.opacity = alpha;
      if (rightTabRef.current) rightTabRef.current.style.opacity = alpha;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <button
        ref={leftTabRef}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '60px',
          height: '60px',
          background: 'transparent',
          borderRadius: '0 0 16px 0',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          cursor: 'pointer',
          border: 'none',
          transition: 'opacity 0.5s ease',
        }}
      >
        <span style={{ display: 'block', width: '22px', height: '2px', background: 'white' }} />
        <span style={{ display: 'block', width: '22px', height: '2px', background: 'white' }} />
      </button>

      <div
        ref={rightTabRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: 'transparent',
          borderRadius: '0 0 0 16px',
          zIndex: 1001,
          transition: 'opacity 0.5s ease',
        }}
      />

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '1.8rem',
              right: '2.2rem',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Close
          </button>

          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'Labil Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 10vw, 6.5rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'white',
                transition: 'opacity 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}

          <p
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.72rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            {`Constantia${SEPARATOR}Casablanca, Morocco`}
          </p>
        </div>
      )}
    </>
  );
}
