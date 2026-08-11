"use client";

import { useEffect, useRef } from "react";

const stats = [
  { label: 'Years Combined Experience', value: 22, suffix: '+' },
  { label: 'Satisfied Clients', value: 50, suffix: '+' },
  { label: 'Projects Completed', value: 100, suffix: '+' },
  { label: 'Countries Reached', value: 5, suffix: '' },
];

function animateCount(el: HTMLElement, target: number, duration = 2000) {
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 5);
    el.textContent = String(Math.round(ease * target));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function CountUpAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLSpanElement[]>([]);
  const firedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          countersRef.current.forEach((el, i) => {
            animateCount(el, stats[i].value, 2200);
          });
        }
      },
      { threshold: 0.3 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative bg-[#0a0a0a] px-6 py-28 md:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-16 text-[10px] uppercase tracking-[0.4em] text-white/20 md:mb-24">
          About
        </div>

        <div className="flex flex-col gap-14 lg:flex-row lg:gap-20">
          <div className="max-w-2xl flex-1">
            <h2
              className="text-[clamp(2.4rem,5vw,5.5rem)] font-light leading-[1.08] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Craft over noise.
            </h2>
            <p className="mt-8 text-[1rem] leading-8 text-white/40 md:text-[1.05rem]">
              We are a collective of entrepreneurs, image-makers, developers, and strategists who
              believe in the quiet power of intention. Five people, one vision — working globally
              from Morocco with precision, creativity, and a commitment to work worth remembering.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-10 lg:gap-y-14">
            {stats.map((s, i) => (
              <div key={s.label}>
                <span
                  className="block text-[clamp(2.4rem,5.5vw,5rem)] font-light tabular-nums text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span
                    ref={(el) => {
                      if (el) countersRef.current[i] = el;
                    }}
                  >
                    0
                  </span>
                  {s.suffix}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-white/30">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
