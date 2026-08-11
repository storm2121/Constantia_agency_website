"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const CRAFT_MARKERS = [
  { label: "5 DISCIPLINES", value: "Photo / Film / Motion / Design / Web" },
  { label: "80+ PROJECTS", value: "Campaigns / Platforms / Case Studies" },
  { label: "7 TALENTS", value: "One multidisciplinary team" },
] as const;

export default function VisionPanel() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const markerGroupRef = useRef<HTMLDivElement>(null);
  const textInsetX = "clamp(1.5rem, 1.15rem + 1vw, 2.25rem)";
  const textInsetY = `calc(${textInsetX} * 5)`;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const img = imageRef.current;
      const headline = headlineRef.current;
      const markerGroup = markerGroupRef.current;
      const markers = markerGroup
        ? Array.from(
            markerGroup.querySelectorAll<HTMLElement>("[data-craft-marker]"),
          )
        : [];

      if (!section || !container || !img || !headline) return;

      gsap.to(container, {
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top 40%",
          scrub: true,
        },
      });

      gsap.set(img, { scale: 1.12 });
      gsap.fromTo(
        img,
        { yPercent: -2 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      const overlayTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      overlayTimeline.fromTo(
        headline,
        { y: 46, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power3.out",
          duration: 0.9,
        },
      );

      if (markers.length > 0) {
        overlayTimeline.fromTo(
          markers,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "power3.out",
            duration: 0.72,
            stagger: 0.12,
          },
          0.16,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full flex-col bg-[#f0ede6] pt-[4vh]"
    >
      <div
        ref={containerRef}
        className="relative mx-3 h-[138vh] min-h-[48rem] bg-black sm:mx-4 md:mx-6 md:h-[148vh] lg:min-h-[56rem]"
        style={{ borderRadius: "clamp(15rem, 26vw, 25rem)" }}
      >
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[inherit]">
          <Image
            ref={imageRef}
            src="/images/vision/photo-28-younes.jpg"
            alt="Black and white concert photography detail"
            fill
            className="object-cover opacity-85"
            style={{ objectPosition: "58% 46%" }}
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(0,0,0,0.26),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.34)_36%,rgba(0,0,0,0.56)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.16)_52%,rgba(0,0,0,0.46)_100%)]" />
        </div>

        <div
          className="pointer-events-none relative z-10 h-full w-full"
          style={{
            paddingLeft: textInsetX,
            paddingRight: textInsetX,
            paddingTop: textInsetY,
            paddingBottom: textInsetY,
          }}
        >
          <div className="sticky" style={{ top: textInsetY }}>
            <div className="relative">
              <div className="flex max-w-[70rem] flex-col items-start gap-10 md:gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(17rem,19rem)] lg:items-start lg:gap-[clamp(2.5rem,5vw,6rem)]">
                <div ref={headlineRef} className="max-w-[22rem] sm:max-w-[26rem]">
                  <h2
                    className="max-w-[14.5ch] text-[clamp(1.55rem,2.9vw,3.2rem)] leading-[0.98] tracking-[-0.028em] text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      textWrap: "balance",
                    }}
                  >
                    The craft that makes the vision possible.
                  </h2>
                </div>

                <div
                  ref={markerGroupRef}
                  className="w-full max-w-[20rem] lg:justify-self-end"
                >
                  <div className="flex w-full flex-col gap-3 sm:gap-4">
                    {CRAFT_MARKERS.map((marker) => (
                      <div
                        key={marker.label}
                        data-craft-marker
                        className="border-l border-white/16 pl-4"
                      >
                        <p
                          className="text-[0.62rem] uppercase tracking-[0.28em] text-[#e2d7c6]/58"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {marker.label}
                        </p>
                        <p
                          className="mt-1 text-[clamp(0.98rem,1.35vw,1.18rem)] font-semibold leading-[1.05] text-[#f5efe7]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {marker.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
