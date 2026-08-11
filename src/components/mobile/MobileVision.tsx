'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const PILLARS = [
  {
    key: '01',
    title: 'Craft',
    body:
      'Work that rewards attention — composed, deliberate, carried through every pixel and frame.',
  },
  {
    key: '02',
    title: 'Restraint',
    body:
      'Every gesture earned. Nothing decorative. Every choice holds weight, or it does not survive the edit.',
  },
  {
    key: '03',
    title: 'Endurance',
    body:
      'Brands that read as confident five years from now. We design for longevity, not trend.',
  },
];

export default function MobileVision() {
  return (
    <section className="m-vis m-section" aria-labelledby="m-vis-title">
      <div className="m-vis-mark" aria-hidden="true">
        № 02 <b>/ Vision</b>
      </div>

      <motion.div
        className="m-vis-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="m-eyebrow">The Vision</p>
        <h2 id="m-vis-title" className="m-h2 m-vis-quote">
          A studio built around
          <br />
          <em>the long frame.</em>
        </h2>
        <p className="m-lead m-vis-lead">
          Seven specialists across photography, film, design and
          engineering — guided by one rule: the work should outlast the
          campaign that commissioned it.
        </p>
      </motion.div>

      <motion.figure
        className="m-vis-figure"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.95, ease: EASE, delay: 0.1 }}
      >
        <div className="m-frame m-frame--45 m-frame--r-lg">
          <Image
            src="/images/vision/photo-28-younes.jpg"
            alt="Studio work in progress"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectPosition: 'center 35%' }}
          />
          <div className="m-vign-bottom" />
          <div className="m-grain" />
          <span className="m-vis-tag">CON / 01</span>
          <span className="m-vis-plus" aria-hidden="true">+</span>
        </div>

        <figcaption className="m-vis-cap">
          <span className="m-vis-cap-dash">—</span>
          <span>Every frame earned.</span>
          <span className="m-vis-cap-year">MMXIX</span>
        </figcaption>
      </motion.figure>

      <ul className="m-vis-pillars" role="list">
        {PILLARS.map((p, i) => (
          <motion.li
            key={p.key}
            className="m-vis-pillar"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.06 + i * 0.08 }}
          >
            <div className="m-vis-pillar-row">
              <span className="m-vis-pillar-key">
                <i />
                {p.key}
              </span>
              <h3 className="m-vis-pillar-title">{p.title}</h3>
            </div>
            <p className="m-vis-pillar-text">{p.body}</p>
          </motion.li>
        ))}
      </ul>

      <style jsx>{`
        .m-vis {
          color: var(--m-ink-hi);
        }

        .m-vis-mark {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.34em;
          color: var(--m-ink-muted);
          margin-bottom: 2.4rem;
          text-transform: uppercase;
        }
        .m-vis-mark b {
          color: var(--m-accent);
          font-weight: 500;
        }

        .m-vis-head {
          margin-bottom: 2.6rem;
        }
        .m-vis-head .m-eyebrow {
          margin-bottom: 1.4rem;
        }
        .m-vis-quote {
          margin: 0 0 1.3rem;
        }
        .m-vis-lead {
          margin: 0;
        }

        .m-vis-figure {
          margin: 0 0 3rem;
          position: relative;
        }
        .m-vis-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 4;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.32em;
          color: var(--m-ink-hi);
          background: rgba(10, 10, 10, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.4rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .m-vis-plus {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 4;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          color: var(--m-accent);
          font-size: 0.9rem;
          line-height: 1;
        }
        .m-vis-cap {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.8rem;
          margin-top: 1rem;
          padding: 0 0.25rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          color: var(--m-ink-lo);
        }
        .m-vis-cap > span:nth-child(2) {
          flex: 1;
          font-style: italic;
        }
        .m-vis-cap-dash {
          color: var(--m-accent);
        }
        .m-vis-cap-year {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          letter-spacing: 0.22em;
          font-style: normal;
          color: var(--m-ink-mid);
        }

        .m-vis-pillars {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }
        .m-vis-pillar {
          padding: 1.6rem 1.3rem;
          border-radius: var(--m-r-lg);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.025) 0%,
            rgba(255,255,255,0.01) 100%
          );
          border: 1px solid var(--m-border);
          position: relative;
          overflow: hidden;
        }
        .m-vis-pillar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 100% at 0% 0%,
            var(--m-accent-soft) 0%,
            transparent 60%
          );
          opacity: 0.55;
          pointer-events: none;
        }
        .m-vis-pillar:nth-child(2)::before {
          background: radial-gradient(
            ellipse 80% 100% at 100% 0%,
            var(--m-warm-soft) 0%,
            transparent 60%
          );
        }
        .m-vis-pillar:nth-child(3)::before {
          background: radial-gradient(
            ellipse 80% 100% at 50% 100%,
            rgba(26,126,176,0.14) 0%,
            transparent 60%
          );
        }
        .m-vis-pillar-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.7rem;
          position: relative;
        }
        .m-vis-pillar-key {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.3em;
          color: var(--m-accent);
        }
        .m-vis-pillar-key i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 10px var(--m-accent-glow);
        }
        .m-vis-pillar-title {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.55rem;
          letter-spacing: -0.022em;
          color: var(--m-ink-hi);
          margin: 0;
          font-weight: 400;
        }
        .m-vis-pillar-text {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          margin: 0;
          position: relative;
        }
      `}</style>
    </section>
  );
}
