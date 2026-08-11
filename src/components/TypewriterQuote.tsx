"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function TypewriterQuote() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useGSAP(
    () => {
      const el = quoteRef.current;
      if (!el) return;

      const split = new SplitText(el, { type: "chars", charsClass: "split-char" });

      gsap.set(split.chars, { autoAlpha: 0, filter: "blur(8px)" });

      gsap.to(split.chars, {
        autoAlpha: 1,
        filter: "blur(0px)",
        stagger: 0.025,
        duration: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] px-6 py-32 md:py-44 lg:py-56">
      <div className="mx-auto max-w-5xl text-center">
        <blockquote
          ref={quoteRef}
          className="text-[clamp(1.6rem,4vw,4.2rem)] font-light leading-[1.25] text-white/85"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We don&rsquo;t sell services. We build the things people remember.
        </blockquote>
      </div>
    </section>
  );
}
