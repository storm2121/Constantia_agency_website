"use client";

import { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";

export default function AmbientContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [sent, setSent] = useState(false);

  /* ── magnetic button ── */
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let rAF = 0;
    let x = 0, y = 0, tx = 0, ty = 0;

    const move = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        tx = dx * 0.25;
        ty = dy * 0.25;
      } else {
        tx = 0;
        ty = 0;
      }
    };

    const leave = () => { tx = 0; ty = 0; };

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      btn.style.transform = `translate(${x}px, ${y}px)`;
      rAF = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    rAF = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rAF);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-28 md:py-40 lg:py-52"
    >
      {/* subtle ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(255,255,255,0.04), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-10 text-[10px] uppercase tracking-[0.4em] text-white/20">
          Get in Touch
        </div>

        <h2
          className="text-[clamp(2.6rem,6vw,6.5rem)] font-light leading-[1.05] text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let&rsquo;s make
          <br />
          something real.
        </h2>

        <form onSubmit={handleSubmit} className="mt-14 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="w-full border-b border-white/10 bg-transparent px-0 py-3 text-[0.9rem] text-white/80 outline-none transition-colors duration-500 placeholder:text-white/18 focus:border-white/30"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full border-b border-white/10 bg-transparent px-0 py-3 text-[0.9rem] text-white/80 outline-none transition-colors duration-500 placeholder:text-white/18 focus:border-white/30"
            />
          </div>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell us about your project..."
            className="w-full resize-none border-b border-white/10 bg-transparent px-0 py-3 text-[0.9rem] text-white/80 outline-none transition-colors duration-500 placeholder:text-white/18 focus:border-white/30"
          />
          <div className="pt-6">
            <button
              ref={btnRef}
              type="submit"
              className="group inline-flex items-center gap-3 border border-white/12 bg-white/[0.03] px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-white/70 backdrop-blur transition-colors duration-500 hover:border-white/25 hover:text-white"
            >
              {sent ? "Sent" : "Send Message"}
              <Send size={14} className="opacity-40 transition-opacity duration-500 group-hover:opacity-80" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
