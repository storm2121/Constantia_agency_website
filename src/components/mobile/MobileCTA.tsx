'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function MobileCTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, honeypot }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setStatus('error');
        return;
      }
      setName('');
      setEmail('');
      setMessage('');
      setHoneypot('');
      setStatus('sent');
      resetTimerRef.current = window.setTimeout(() => setStatus('idle'), 3200);
    } catch {
      setStatus('error');
    }
  };

  const buttonLabel = {
    idle: 'Send message',
    sending: 'Sending…',
    sent: 'Message sent ✓',
    error: 'Try again',
  }[status];

  const isDisabled = status === 'sending';

  return (
    <section id="contact" className="m-cta m-section" aria-labelledby="m-cta-title">
      <div className="m-cta-mark" aria-hidden="true">
        № 06 <b>/ Contact</b>
      </div>

      <div className="m-cta-aura" aria-hidden="true" />

      <motion.div
        className="m-cta-inner"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p className="m-eyebrow">Let&apos;s talk</p>
        <h2 id="m-cta-title" className="m-h1 m-cta-title">
          Let&rsquo;s build
          <br />
          something <em>real.</em>
        </h2>
        <p className="m-cta-body">
          Drop your name, your email, and a clear brief. We&rsquo;ll take it
          from there with the same care we bring to the work itself.
        </p>

        <div className="m-cta-reply">
          <span className="m-cta-reply-dot" aria-hidden="true" />
          <span>Typical reply within 24h</span>
        </div>

        <form onSubmit={handleSubmit} className="m-cta-form" noValidate>
          <div className="m-cta-row">
            <label className="m-cta-field">
              <span className="m-cta-label">
                <i>01</i> Your name
              </span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                autoComplete="name"
                className="m-cta-input"
              />
            </label>

            <label className="m-cta-field">
              <span className="m-cta-label">
                <i>02</i> Email
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                required
                autoComplete="email"
                inputMode="email"
                className="m-cta-input"
              />
            </label>
          </div>

          <label className="m-cta-field">
            <span className="m-cta-label">
              <i>03</i> Project brief
            </span>
            <textarea
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scope, dates, what matters most."
              required
              className="m-cta-textarea"
            />
          </label>

          <div className="m-cta-honeypot" aria-hidden="true">
            <label htmlFor="m-cta-company">Company</label>
            <input
              id="m-cta-company"
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            aria-busy={isDisabled}
            className={`m-cta-submit is-${status}`}
          >
            <span>{buttonLabel}</span>
            {status === 'idle' && (
              <span className="m-cta-arrow" aria-hidden="true">
                →
              </span>
            )}
          </button>
        </form>

        <hr className="m-divider m-cta-divider" />

        <div className="m-cta-direct">
          <div className="m-cta-direct-col">
            <p className="m-cta-direct-label">Or write direct</p>
            <a href="mailto:h.lachheb@constantia.ma" className="m-cta-direct-email">
              h.lachheb@constantia.ma
            </a>
          </div>
          <div className="m-cta-direct-col m-cta-direct-col--right">
            <p className="m-cta-direct-label">Studio</p>
            <p className="m-cta-direct-place">Casablanca · MA</p>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .m-cta {
          position: relative;
          color: var(--m-ink-hi);
          overflow: hidden;
        }
        .m-cta-mark {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.34em;
          color: var(--m-ink-muted);
          margin-bottom: 2.4rem;
          text-transform: uppercase;
        }
        .m-cta-mark b {
          color: var(--m-accent);
          font-weight: 500;
        }
        .m-cta-aura {
          position: absolute;
          top: 0;
          left: -10%;
          right: -10%;
          height: 80%;
          pointer-events: none;
          background: radial-gradient(
            ellipse 70% 70% at 50% 0%,
            rgba(97, 203, 248, 0.12) 0%,
            transparent 65%
          );
        }

        .m-cta-inner {
          position: relative;
        }
        .m-cta-title {
          margin: 1.2rem 0 1.4rem;
        }
        .m-cta-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          max-width: 36ch;
          margin: 0 0 1.4rem;
        }
        .m-cta-reply {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--m-accent);
          padding: 0.5rem 0.85rem;
          background: var(--m-accent-soft);
          border: 1px solid var(--m-accent-soft);
          border-radius: 999px;
          margin-bottom: 2.4rem;
        }
        .m-cta-reply-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 10px var(--m-accent-glow);
          animation: m-cta-ping 1.8s ease-in-out infinite;
        }
        @keyframes m-cta-ping {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        .m-cta-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }
        .m-cta-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 540px) {
          .m-cta-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        .m-cta-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .m-cta-label {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-ink-lo);
        }
        .m-cta-label i {
          font-style: normal;
          color: var(--m-accent);
          letter-spacing: 0.26em;
        }
        .m-cta-input,
        .m-cta-textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.035);
          color: var(--m-ink-hi);
          border: 1px solid var(--m-border);
          border-radius: var(--m-r-md);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.4;
          outline: none;
          transition:
            border-color var(--m-dur) var(--m-ease),
            background var(--m-dur) var(--m-ease),
            box-shadow var(--m-dur) var(--m-ease);
        }
        .m-cta-input {
          height: 3.4rem;
          padding: 0 1rem;
        }
        .m-cta-textarea {
          min-height: 9rem;
          padding: 1rem;
          resize: vertical;
        }
        .m-cta-input::placeholder,
        .m-cta-textarea::placeholder {
          color: var(--m-ink-muted);
        }
        .m-cta-input:focus,
        .m-cta-textarea:focus {
          border-color: var(--m-accent);
          background: rgba(255, 255, 255, 0.055);
          box-shadow: 0 0 0 3px var(--m-accent-soft);
        }
        .m-cta-honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        .m-cta-submit {
          margin-top: 0.4rem;
          display: inline-flex;
          height: 3.6rem;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          border-radius: 999px;
          background: var(--m-ink-hi);
          color: var(--m-bg);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.92rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 30px -14px rgba(255, 255, 255, 0.3);
          transition:
            transform var(--m-dur-fast) var(--m-ease),
            background var(--m-dur) var(--m-ease),
            color var(--m-dur) var(--m-ease),
            opacity var(--m-dur) var(--m-ease);
        }
        .m-cta-submit:active:not(:disabled) {
          transform: scale(0.98);
        }
        .m-cta-submit:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .m-cta-submit.is-sent {
          background: var(--m-accent);
          color: var(--m-bg);
          box-shadow: 0 10px 30px -10px var(--m-accent-glow);
        }
        .m-cta-submit.is-error {
          background: #d14b4b;
          color: #fff;
        }
        .m-cta-arrow {
          font-size: 1.05rem;
          line-height: 1;
        }

        .m-cta-divider {
          margin: 3rem 0 1.8rem;
        }

        .m-cta-direct {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: start;
        }
        .m-cta-direct-col {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .m-cta-direct-col--right {
          align-items: flex-end;
          text-align: right;
        }
        .m-cta-direct-label {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--m-ink-lo);
          margin: 0;
        }
        .m-cta-direct-email {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1.05rem;
          color: var(--m-ink-hi);
          border-bottom: 1px solid var(--m-border-strong);
          width: fit-content;
          padding-bottom: 4px;
        }
        .m-cta-direct-place {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1rem;
          color: var(--m-ink-mid);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
