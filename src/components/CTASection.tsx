'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.609.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.64.165-1.31.25-2.015.25H0V4.51h6.938v-.007zM6.545 10.16c.6 0 1.09-.16 1.47-.477.38-.316.57-.773.57-1.37 0-.36-.06-.655-.18-.89-.12-.234-.29-.42-.51-.56-.22-.13-.48-.227-.77-.28-.29-.053-.6-.08-.93-.08H3.53v3.66h3.015v-.003zm.185 5.98c.36 0 .7-.04 1.01-.12.31-.08.58-.21.81-.39.23-.18.41-.42.54-.71.13-.29.2-.65.2-1.08 0-.86-.23-1.48-.7-1.85-.47-.37-1.09-.56-1.85-.56H3.53v4.71h3.2zm9.123-10.7v1.2h5.667V5.44h-5.667zm2.87 10.97c.44.44 1.06.66 1.86.66.58 0 1.08-.15 1.5-.45.42-.3.68-.63.78-.99h2.58c-.41 1.3-1.04 2.24-1.9 2.82-.86.58-1.9.87-3.12.87-.84 0-1.6-.13-2.28-.4-.68-.27-1.27-.65-1.76-1.15-.49-.49-.87-1.08-1.14-1.77-.27-.69-.4-1.45-.4-2.29 0-.82.14-1.57.41-2.26.27-.69.65-1.29 1.15-1.79.49-.5 1.08-.89 1.76-1.18.68-.29 1.43-.43 2.25-.43.9 0 1.7.17 2.4.52.7.35 1.28.83 1.74 1.44.46.61.8 1.32 1.02 2.13.21.81.28 1.69.21 2.63h-7.7c0 .87.29 1.58.72 2.02v-.01zm3.34-4.64c-.35-.38-.88-.59-1.64-.59-.5 0-.92.09-1.26.26-.34.18-.6.38-.8.62-.2.24-.34.49-.42.76-.08.26-.13.5-.14.7h5.04c-.09-.78-.42-1.37-.78-1.75v-.01z" />
    </svg>
  );
}

const socials = [
  { icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: BehanceIcon, href: '#', label: 'Behance' },
];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const left = leftRef.current;
      const card = cardRef.current;

      if (!section || !left || !card) return;

      gsap.fromTo(
        left,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            once: true,
          } as ScrollTrigger.Vars,
        }
      );

      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            once: true,
          } as ScrollTrigger.Vars,
        }
      );
    },
    { scope: sectionRef }
  );

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

      resetTimerRef.current = window.setTimeout(() => {
        setStatus('idle');
      }, 3200);
    } catch {
      setStatus('error');
    }
  };

  const buttonLabel = {
    idle: 'Send Message',
    sending: 'Sending...',
    sent: 'Message Sent',
    error: 'Try Again',
  }[status];

  return (
    <section id="contact" ref={sectionRef} className="cta-section scroll-mt-16">
      <div className="cta-shell">
        <div className="cta-divider" aria-hidden="true" />

        <div ref={leftRef} className="cta-left">
          <h2 className="cta-title">
            Let&apos;s build
            <br />
            something
            <br />
            real.
          </h2>

          <p className="cta-body">
            Drop your name, your email, and a clear message. We&apos;ll take it
            from there with the same care we bring to the work itself.
          </p>

          <div className="cta-contact">
            <p className="cta-label">Contact</p>
            <a href="mailto:h.lachheb@constantia.ma" className="cta-email">
              h.lachheb@constantia.ma
            </a>
          </div>

          <div className="cta-socials">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="cta-social">
                <Icon className="cta-social-icon" />
              </a>
            ))}
          </div>
        </div>

        <div ref={cardRef} className="cta-card">
          <form onSubmit={handleSubmit} className="cta-form">
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="NAME"
              required
              autoComplete="name"
              className="cta-field"
            />

            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="EMAIL"
              required
              autoComplete="email"
              className="cta-field"
            />

            <textarea
              name="message"
              rows={6}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="MESSAGE"
              required
              className="cta-textarea"
            />

            <div className="cta-honeypot">
              <label htmlFor="company-name">Company</label>
              <input
                id="company-name"
                type="text"
                name="company"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="cta-submit"
            >
              <span>{buttonLabel}</span>
              <ArrowUpRight size={16} strokeWidth={2} className="cta-submit-icon" />
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .cta-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 16% 16%, rgba(226, 216, 203, 0.52) 0%, rgba(241, 236, 230, 0) 24%),
            radial-gradient(circle at 78% 18%, rgba(229, 220, 208, 0.48) 0%, rgba(241, 236, 230, 0) 21%),
            radial-gradient(circle at 22% 76%, rgba(228, 219, 206, 0.34) 0%, rgba(241, 236, 230, 0) 20%),
            radial-gradient(circle at 84% 72%, rgba(227, 217, 205, 0.32) 0%, rgba(241, 236, 230, 0) 18%),
            #f1ece6;
          padding: 5rem 1.5rem 4.75rem;
        }

        .cta-shell {
          --left-x: 13.7355cqw;
          --left-top: 10.9738cqw;
          --left-w: 27.1802cqw;
          --card-x: 53.343cqw;
          --card-top: 10.1017cqw;
          --card-w: 32.9942cqw;
          --card-h: 35.6831cqw;
          --card-pad-x: 3.343cqw;
          --card-pad-top: 3.343cqw;
          --card-pad-bottom: 3.1977cqw;
          --field-h: 3.1977cqw;
          --field-gap: 1.4535cqw;
          --button-extra-gap: 0.218cqw;
          --textarea-h: 13.8081cqw;
          --button-h: 4.3605cqw;
          --body-mt: 3.0523cqw;
          --body-w: 25.218cqw;
          --contact-mt: 3.9244cqw;
          --social-mt: 2.907cqw;
          --social-gap: 1.2355cqw;
          --social-size: 1.3081cqw;
          margin: 0 auto;
          display: flex;
          max-width: 34rem;
          flex-direction: column;
          gap: 2.75rem;
        }

        .cta-divider {
          display: none;
        }

        .cta-left {
          display: flex;
          flex-direction: column;
        }

        .cta-title {
          margin: 0;
          color: #151515;
          font-family: 'Labil Grotesk', sans-serif;
          font-size: clamp(3.375rem, 15.5vw, 5rem);
          font-weight: 400;
          line-height: 0.91;
          letter-spacing: -0.065em;
          text-wrap: balance;
        }

        .cta-body {
          margin: 2rem 0 0;
          max-width: 21rem;
          color: rgba(17, 17, 17, 0.92);
          font-family: var(--font-inter);
          font-size: 1.0625rem;
          line-height: 1.38;
        }

        .cta-contact {
          margin-top: 2.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .cta-label {
          margin: 0;
          color: #141414;
          font-family: var(--font-inter);
          font-size: 0.75rem;
          line-height: 1;
          letter-spacing: 0.045em;
          text-transform: uppercase;
        }

        .cta-email {
          width: fit-content;
          color: #141414;
          font-family: var(--font-inter);
          font-size: 1.125rem;
          line-height: 1.2;
          transition: opacity 0.24s var(--ease-out-cubic);
        }

        .cta-email:hover {
          opacity: 0.74;
        }

        .cta-socials {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cta-social {
          display: inline-flex;
          color: #141414;
          transition:
            opacity 0.24s var(--ease-out-cubic),
            transform 0.24s var(--ease-out-cubic);
        }

        .cta-social:hover {
          opacity: 0.72;
          transform: translateY(-1px);
        }

        .cta-social-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .cta-card {
          position: relative;
          border: 1px solid rgba(152, 144, 133, 0.34);
          border-radius: 0.625rem;
          background: rgba(255, 255, 255, 0.98);
          box-shadow:
            0 18px 42px rgba(0, 0, 0, 0.08),
            0 3px 8px rgba(0, 0, 0, 0.04);
          padding: 1.35rem;
        }

        .cta-form {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .cta-field,
        .cta-textarea {
          width: 100%;
          border: 1px solid rgba(100, 94, 86, 0.54);
          border-radius: 0.5rem;
          background: #ffffff;
          color: #161616;
          font-family: var(--font-inter);
          font-size: 0.9375rem;
          outline: none;
          transition:
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .cta-field {
          height: 3.125rem;
          padding: 0 0.95rem;
        }

        .cta-textarea {
          min-height: 12rem;
          padding: 1rem 0.95rem;
          line-height: 1.4;
          resize: vertical;
        }

        .cta-field::placeholder,
        .cta-textarea::placeholder {
          color: rgba(74, 70, 64, 0.88);
          opacity: 1;
        }

        .cta-field:focus-visible,
        .cta-textarea:focus-visible {
          border-color: rgba(31, 30, 26, 0.78);
          box-shadow: 0 0 0 1px rgba(31, 30, 26, 0.18);
        }

        .cta-honeypot {
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        .cta-submit {
          margin-top: 0.15rem;
          display: inline-flex;
          height: 3.5rem;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border-radius: 0.5rem;
          background: #2e2f2a;
          color: #f3f3f1;
          font-family: var(--font-inter);
          font-size: 0.95rem;
          line-height: 1;
          text-transform: uppercase;
          transition:
            transform 0.24s var(--ease-out-cubic),
            background-color 0.24s var(--ease-out-cubic),
            opacity 0.24s var(--ease-out-cubic);
        }

        .cta-submit:hover:not(:disabled) {
          background: #262722;
        }

        .cta-submit:disabled {
          cursor: not-allowed;
          opacity: 0.66;
        }

        .cta-submit-icon {
          transition: transform 0.24s var(--ease-out-cubic);
        }

        .cta-submit:hover:not(:disabled) .cta-submit-icon {
          transform: translate3d(1px, -1px, 0);
        }

        @media (min-width: 1024px) {
          .cta-section {
            padding: 0;
          }

          .cta-shell {
            width: 100%;
            max-width: 1376px;
            aspect-ratio: 1376 / 768;
            display: block;
            container-type: inline-size;
          }

          .cta-divider {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            display: block;
            width: 1px;
            transform: translateX(-0.5px);
            background: rgba(116, 108, 96, 0.18);
          }

          .cta-left {
            position: absolute;
            left: var(--left-x);
            top: var(--left-top);
            width: var(--left-w);
          }

          .cta-title {
            font-size: min(81px, 5.8866cqw);
            line-height: 0.9;
          }

          .cta-body {
            margin-top: var(--body-mt);
            max-width: var(--body-w);
            font-size: min(17px, 1.2355cqw);
            line-height: 1.39;
          }

          .cta-contact {
            margin-top: var(--contact-mt);
            gap: min(11px, 0.7994cqw);
          }

          .cta-label {
            font-size: min(12px, 0.8721cqw);
          }

          .cta-email {
            font-size: min(18px, 1.3081cqw);
          }

          .cta-socials {
            margin-top: var(--social-mt);
            gap: var(--social-gap);
          }

          .cta-social-icon {
            width: var(--social-size);
            height: var(--social-size);
          }

          .cta-card {
            position: absolute;
            left: var(--card-x);
            top: var(--card-top);
            width: var(--card-w);
            height: var(--card-h);
            border-radius: min(9px, 0.6541cqw);
            padding: var(--card-pad-top) var(--card-pad-x) var(--card-pad-bottom);
            box-shadow:
              0 min(18px, 1.3081cqw) min(34px, 2.4709cqw) rgba(0, 0, 0, 0.08),
              0 min(3px, 0.218cqw) min(8px, 0.5814cqw) rgba(0, 0, 0, 0.04);
          }

          .cta-form {
            height: 100%;
            gap: var(--field-gap);
          }

          .cta-field,
          .cta-textarea {
            font-size: min(15px, 1.09cqw);
            border-radius: min(6px, 0.436cqw);
          }

          .cta-field {
            height: var(--field-h);
            padding-inline: min(14px, 1.0174cqw);
          }

          .cta-textarea {
            height: var(--textarea-h);
            min-height: 0;
            padding: min(14px, 1.0174cqw);
          }

          .cta-submit {
            margin-top: var(--button-extra-gap);
            margin-left: calc(min(5px, 0.3634cqw) * -0.5);
            height: var(--button-h);
            width: calc(100% + min(5px, 0.3634cqw));
            gap: min(9px, 0.6541cqw);
            border-radius: min(6px, 0.436cqw);
            font-size: min(15px, 1.09cqw);
          }
        }
      `}</style>
    </section>
  );
}
