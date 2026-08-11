"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const projects = [
  { title: "Brand Campaign", cat: "Photography", image: "/images/portfolio/project-01-photography.jpg" },
  { title: "Product Launch Film", cat: "Videography", image: "/images/portfolio/project-02-videography.jpg" },
  { title: "Visual Identity System", cat: "Graphics", image: "/images/portfolio/project-03-event.jpg" },
  { title: "Luxury Event Story", cat: "Photography", image: "/images/portfolio/project-04-conference.jpg" },
  { title: "Aerial Cinema Study", cat: "Videography", image: "/images/portfolio/project-05-landscape.jpg" },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const bar = barRef.current;
      if (!section || !track || !bar) return;

      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      const N = projects.length;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            snap: {
              snapTo: (value: number) => {
                const snapStep = 1 / (N - 1);
                return Math.round(value / snapStep) * snapStep;
              },
              delay: 0.06,
              duration: { min: 0.22, max: 0.5 },
              ease: "power2.out",
              inertia: false,
            },
          },
        })
        .to(track, { xPercent: -(100 * (N - 1)) / N, duration: 1 }, 0)
        .to(bar, { scaleX: 1, duration: 1 }, 0);
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute left-6 top-8 z-20 text-[10px] uppercase tracking-[0.4em] text-white/20 md:left-10 lg:left-14">
          Selected Work
        </div>

        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((p, i) => (
            <article
              key={p.title}
              className="group relative h-full shrink-0 px-[3vw] py-[7vh]"
              style={{ width: "100vw" }}
            >
              <div className="relative h-full overflow-hidden border border-white/6 bg-black">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 group-hover:bg-black/8" />

                <div className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.35em] text-white/22">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </div>

                <div className="absolute inset-x-0 bottom-0 translate-y-5 p-6 opacity-0 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100 md:p-8">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">{p.cat}</p>
                  <h3
                    className="mt-2 text-[clamp(1.8rem,3.5vw,3.6rem)] font-light text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.title}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* progress bar */}
        <div className="absolute inset-x-6 bottom-7 z-20 md:inset-x-10 lg:inset-x-14">
          <div className="h-px bg-white/8">
            <div ref={barRef} className="h-full bg-white/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
