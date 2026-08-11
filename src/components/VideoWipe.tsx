'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export default function VideoWipe() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const textContainer = textContainerRef.current;
    const video = videoRef.current;

    if (!section || !container || !textContainer || !video) return;

    // Start state for the card before it enters the screen
    gsap.set(container, {
      width: '65vw', // Much wider
      height: '55vh', // Much taller
      borderRadius: '45px', // Smoother radius
      y: '50vh', // Pushed down so it physically "enters" from below the frame
    });

    // We must sync the video scrubbing to the ENTIRE section scroll
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom', // Start the moment the section enters from bottom
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        if (!video.duration) return;
        video.currentTime = Math.min(self.progress, 0.9999) * video.duration;
      }
    });

    // TRIGGER 1: "Grow on Enter"
    // This happens WHILE the section is scrolling up from bottom to top
    const growTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom', // Starts the exact pixel it enters the screen
        end: 'top top',      // Ends the exact pixel it hits the top and pins
        scrub: 1,
      }
    });

    growTl.to(container, {
      y: '0vh', // Center it
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
      ease: 'power3.in', // Exponential acceleration as it reaches the top
    });

    // TRIGGER 2: "Pin & Dock"
    // This happens AFTER the section hits the top and pins
    const dockTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top', 
        end: 'bottom bottom',
        scrub: 1, 
        pin: true,
        pinSpacing: false,
      }
    });

    // Phase 1: Hold full screen for a moment
    dockTl.to({}, { duration: 0.5 });

    // Phase 2: Smooth background color fade to creme while shrinking
    dockTl.to(section, {
      backgroundColor: '#f0ede6',
      ease: 'power2.inOut',
      duration: 1
    }, "dock"); // Sync this with the "dock" label

    // Phase 3: Shrink & Round back down to a portrait card
    dockTl.to(container, {
      width: '35vw',
      height: '70vh',
      borderRadius: '30px',
      ease: 'power2.inOut',
      duration: 1
    }, "dock");

    // Phase 4: Dock Left and Reveal Text
    dockTl.to(container, {
      x: '-25vw', // Move to the left
      ease: 'power2.inOut',
      duration: 1
    }, "dock");

    dockTl.to(textContainer, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 1
    }, "dock");

    dockTl.to({}, { duration: 0.5 });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="h-[400vh] relative overflow-hidden" 
      style={{ backgroundColor: '#000000' }} // Start pure blue to match Hero reveal
    >
      <div className="h-screen w-full sticky top-0 flex items-center justify-center overflow-hidden">
        
        {/* Video Container */}
        <div
          ref={containerRef}
          className="absolute origin-center flex items-center justify-center overflow-hidden"
          style={{ willChange: 'width, height, border-radius, transform' }}
        >
          <video
            ref={videoRef}
            src="/videos/services/VIDEOGRAPHY-scrub.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Text Block - Right Side */}
        <div
          ref={textContainerRef}
          className="absolute right-[8%] top-0 bottom-0 w-[36vw] flex flex-col justify-center opacity-0"
          style={{ willChange: 'opacity, transform', transform: 'translateY(80px)' }}
        >
          <p className="font-inter text-sm tracking-[0.45em] uppercase text-black/40 mb-4">
            Our craft
          </p>
          <h2 className="font-['Labil_Grotesk'] text-[clamp(3rem,6vw,6rem)] tracking-[-0.04em] leading-[0.9] text-black font-normal">
            What we create.
          </h2>
          <p className="mt-8 text-black/70 text-lg max-w-md font-inter leading-relaxed">
            We transform ideas into visual narratives that captivate and resonate. From concept to final cut, our cinematic approach ensures every frame serves your story.
          </p>
        </div>

      </div>
    </section>
  );
}








