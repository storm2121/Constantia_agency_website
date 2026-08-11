"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const services = [
  {
    id: 1,
    title: "PHOTOGRAPHY",
    sub: "Concert / Events / Editorial / Advertising",
    desc: "Every frame a deliberate act of seeing, seized at the threshold of beauty and truth. From concert pits to campaign sets, we capture moments that last.",
    image: "/images/services/photography.jpg",
    type: "image",
  },
  {
    id: 2,
    title: "VIDEOGRAPHY",
    sub: "Brand Films / Documentaries / Music Videos / Events",
    desc: "Cinematic narratives built with breath and restraint, tension that lingers after the cut. Advertising films that evoke emotion, not just attention.",
    video: "/videos/services/VIDEOGRAPHY-scrub.mp4",
    image: "/images/services/videography.jpg",
    type: "video",
  },
  {
    id: 3,
    title: "MOTION GRAPHICS",
    sub: "Logo Animation / Explainer Videos / Reel Production",
    desc: "Motion brings identity to life. Each animation is calibrated, with timing, easing, and rhythm working together until every second lands with intention.",
    image: "/images/services/graphics.jpg",
    type: "image",
  },
  {
    id: 4,
    title: "GRAPHIC DESIGN",
    sub: "Brand Identity / Social Media / Campaigns / Art Direction",
    desc: "Visual systems shaped with precision, not decoration. Identities built to hold pressure across every format, platform, and context.",
    image: "/images/services/video-editing.jpg",
    type: "image",
  },
  {
    id: 5,
    title: "WEB DEVELOPMENT",
    sub: "Web Apps / Mobile / SaaS / Booking Platforms",
    desc: "Scalable web platforms built with clean architecture. Intuitive interfaces backed by robust engineering and elegant solutions to complex requirements.",
    image: "/images/services/video-editing.jpg",
    type: "image",
  },
  {
    id: 6,
    title: "STRATEGY",
    sub: "Partnerships / Client Relations / MENA Market / International",
    desc: "Partnerships built on trust and long-term thinking. We navigate international markets and connect the right people to the right opportunities.",
    image: "/images/services/videography.jpg",
    type: "image",
  },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

export default function ServicesReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section) return;

      const totalServices = services.length;
      const videoLayerIndex = 1;
      const layers = gsap.utils.toArray<HTMLElement>(".srv-layer", section);
      const dots = gsap.utils.toArray<HTMLElement>(".srv-dot", section);
      const labels = gsap.utils.toArray<HTMLElement>(".srv-label", section);

      const splits = layers.map((layer, index) => {
        const titleEl = layer.querySelector<HTMLElement>(".srv-title");
        const descEl = layer.querySelector<HTMLElement>(".srv-desc");
        const bg = layer.querySelector<HTMLElement>(".srv-bg");
        const isFirst = index === 0;

        if (!titleEl || !descEl || !bg) {
          throw new Error("ServicesReveal layer is missing required elements.");
        }

        const titleSplit = new SplitText(titleEl, {
          type: "chars",
          charsClass: "split-char",
        });
        const descSplit = new SplitText(descEl, {
          type: "words",
          wordsClass: "split-word",
        });

        gsap.set(layer, { autoAlpha: isFirst ? 1 : 0 });
        gsap.set(bg, { scale: isFirst ? 1.12 : 1.08, opacity: isFirst ? 0.34 : 1 });
        gsap.set(titleSplit.chars, {
          autoAlpha: 0,
          y: isFirst ? 64 : 50,
          rotateZ: isFirst
            ? () => gsap.utils.random(-8, 8, 1)
            : () => gsap.utils.random(-6, 6, 1),
          filter: isFirst ? "blur(16px)" : "blur(12px)",
        });
        gsap.set(descSplit.words, {
          autoAlpha: 0,
          y: isFirst ? 24 : 20,
          filter: isFirst ? "blur(10px)" : "blur(8px)",
        });

        return { titleSplit, descSplit, bg, layer };
      });

      gsap.set(dots, { opacity: 0.15, scale: 1 });
      gsap.set(labels, { opacity: 0.25, x: 0 });
      if (dots[0]) gsap.set(dots[0], { opacity: 0.9, scale: 1.4 });
      if (labels[0]) gsap.set(labels[0], { opacity: 0.9, x: 8 });

      let videoDuration = 7;

      if (video) {
        video.pause();
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.currentTime = 0;

        const onMeta = () => {
          videoDuration = video.duration || 7;
        };

        video.addEventListener("loadedmetadata", onMeta);
      }

      const segStart = videoLayerIndex / totalServices;
      const segEnd = (videoLayerIndex + 1) / totalServices;
      const segRange = segEnd - segStart;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!video || video.readyState < 1) return;

            const local = clamp((self.progress - segStart) / segRange, 0, 1);
            const targetTime = local * videoDuration;

            if (Math.abs(video.currentTime - targetTime) > 0.02) {
              video.currentTime = targetTime;
            }
          },
        },
      });

      tl.to(section, { "--entry-blackout": 0, duration: 0.42 }, 0)
        .to(splits[0].bg, { opacity: 1, scale: 1.01, duration: 0.62 }, 0.04)
        .to(
          splits[0].titleSplit.chars,
          {
            autoAlpha: 1,
            y: 0,
            rotateZ: 0,
            filter: "blur(0px)",
            stagger: { each: 0.014, from: "random" },
            duration: 0.24,
            ease: "power2.out",
          },
          0.12,
        )
        .to(
          splits[0].descSplit.words,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.02,
            duration: 0.2,
            ease: "power2.out",
          },
          0.24,
        );

      splits.forEach(({ titleSplit, descSplit, bg, layer }, index) => {
        if (index !== 0) {
          const enter = index - 0.15;

          tl.to(layer, { autoAlpha: 1, duration: 0.18 }, enter)
            .fromTo(bg, { scale: 1.08 }, { scale: 1.01, duration: 0.9 }, enter)
            .to(
              titleSplit.chars,
              {
                autoAlpha: 1,
                y: 0,
                rotateZ: 0,
                filter: "blur(0px)",
                stagger: { each: 0.014, from: "random" },
                duration: 0.2,
                ease: "power2.out",
              },
              enter + 0.05,
            )
            .to(
              descSplit.words,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.02,
                duration: 0.15,
                ease: "power2.out",
              },
              enter + 0.14,
            )
            .to(dots[index], { opacity: 0.9, scale: 1.4, duration: 0.14 }, enter + 0.05)
            .to(labels[index], { opacity: 0.9, x: 8, duration: 0.14 }, enter + 0.05);
        }

        const fadeAt = index === totalServices - 1 ? index + 0.85 : index + 0.8;

        tl.to(
          descSplit.words,
          {
            autoAlpha: 0,
            y: -14,
            filter: "blur(8px)",
            stagger: { each: 0.014, from: "end" },
            duration: 0.12,
            ease: "power2.in",
          },
          fadeAt,
        )
          .to(
            titleSplit.chars,
            {
              autoAlpha: 0,
              y: -45,
              rotateZ: () => gsap.utils.random(-7, 7, 1),
              filter: "blur(12px)",
              stagger: { each: 0.01, from: "edges" },
              duration: 0.14,
              ease: "power2.in",
            },
            fadeAt + 0.02,
          )
          .to(layer, { autoAlpha: index === totalServices - 1 ? 0.1 : 0, duration: 0.18 }, fadeAt)
          .to(dots[index], { opacity: 0.15, scale: 1, duration: 0.12 }, fadeAt)
          .to(labels[index], { opacity: 0.25, x: 0, duration: 0.12 }, fadeAt);
      });

      return () => {
        splits.forEach((split) => {
          split.titleSplit.revert();
          split.descSplit.revert();
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{
        height: `${services.length * 120}vh`,
        ["--entry-blackout" as string]: 1,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {services.map((service, index) => (
          <article key={service.id} className="srv-layer absolute inset-0">
            <div className="srv-bg absolute inset-0 will-change-transform">
              {service.type === "video" && service.video ? (
                <>
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source src={service.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/30" />
                </>
              ) : service.image ? (
                <>
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              ) : null}
            </div>

            <div className="relative z-10 flex h-full items-center px-6 md:px-10 lg:px-14">
              <div className="w-full max-w-[1500px]">
                <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-white/35 md:text-[11px]">
                  {service.sub}
                </p>
                <h2
                  className="srv-title max-w-[16ch] text-[clamp(3.2rem,10vw,10.5rem)] font-light uppercase leading-[0.92] text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {service.title}
                </h2>
                <p className="srv-desc mt-6 max-w-xl text-[0.95rem] leading-7 text-white/45 md:text-[1.02rem]">
                  {service.desc}
                </p>
              </div>
            </div>
          </article>
        ))}

        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.5) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[6] bg-[#0a0a0a]"
          style={{ opacity: "var(--entry-blackout)" }}
        />

        <div className="pointer-events-none absolute inset-y-0 right-6 z-20 hidden items-center lg:flex xl:right-10">
          <div className="flex items-center gap-5 rounded-2xl border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-lg">
            <div className="space-y-1.5">
              <span className="block text-[9px] uppercase tracking-[0.35em] text-white/20">Disciplines</span>
              {services.map((service) => (
                <span
                  key={service.id}
                  className="srv-label block text-[10px] uppercase tracking-[0.28em] text-white/25"
                >
                  {service.title}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              {services.map((service) => (
                <span key={service.id} className="srv-dot h-2 w-2 rounded-full bg-white" />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute left-6 top-8 z-20 text-[10px] uppercase tracking-[0.4em] text-white/20 md:left-10 lg:left-14">
          Services
        </div>
      </div>
    </section>
  );
}
