'use client'

import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { gsap, useGSAP } from '@/lib/gsap'

const stats = [
  { value: 80, suffix: '+', label: 'Projects Delivered' },
  { value: 30,  suffix: '+', label: 'Years of Combined Experience' },
  { value: 12, suffix: '+', label: 'Countries Worldwide' },
  { value: 7,  suffix: '',  label: 'Talents Driving Execution' },
]

const clients = [
  { name: 'Libra',                 logo: '/images/clients/optimized/Libra.webp' }, 
  { name: 'Mohamed VI',            logo: '/images/clients/optimized/Mohamed_Vi_Environment_protection.webp' },
  { name: 'Al Akhawayn',           logo: '/images/clients/optimized/al_akhawayn.webp' },
  { name: 'Copima',                logo: '/images/clients/optimized/copima.webp' },
  { name: 'Regisol',               logo: '/images/clients/optimized/regisol.webp' },
  { name: 'Unesco',                logo: '/images/clients/optimized/unesco.webp' },
  { name: 'United Nations',        logo: '/images/clients/optimized/united_nations.webp' },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const glassPanelRef = useRef<HTMLDivElement>(null)
  const numRefs    = useRef<(HTMLSpanElement | null)[]>([])
  
  const physicsContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logosRef = useRef<(HTMLDivElement | null)[]>([])
  const reqRef = useRef<number>(0)
  
  const system = useRef<{ 
    nodes: { x: number, y: number, vx: number, vy: number, w: number, h: number, active: boolean }[],
    dots: { basex: number, basey: number, x: number, y: number }[],
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D | null
  }>({ nodes: [], dots: [], width: 0, height: 0, ctx: null })

  const themeProxyRef = useRef({ dotColor: 'rgba(200, 180, 138, 0.65)' })
  const lastRippleTime = useRef<number>(0)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const letterBoxes = useRef<{ x: number, y: number, w: number, h: number }[]>([])
  const letterShockTimes = useRef<number[]>([])

  const triggerRipple = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastRippleTime.current < 150) return;
    lastRippleTime.current = now;

    const container = physicsContainerRef.current;
    if (!container) return;

    const ripple = document.createElement('div');
    ripple.className = 'absolute rounded-full border opacity-0 pointer-events-none z-[1]';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.borderColor = 'var(--accent)';
    ripple.style.boxShadow = '0 0 30px var(--accent), inset 0 0 20px var(--accent)';
    
    container.appendChild(ripple);

    gsap.to(ripple, {
        width: 150,
        height: 150,
        opacity: 0.8,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(ripple, {
              opacity: 0,
              width: 350,
              height: 350,
              duration: 1.2,
              ease: 'power2.out',
              onComplete: () => ripple.remove()
          })
        }
    })
  }, []);

  const updatePhysics = useCallback(() => {
    const { nodes, dots, width, height, ctx } = system.current;
    if (width === 0 || height === 0) return; 
    
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n.active) continue;
        
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) { 
           n.x = 0; n.vx *= -1; 
           triggerRipple(0, n.y + n.h / 2); 
        } else if (n.x > width - n.w) { 
           n.x = width - n.w; n.vx *= -1; 
           triggerRipple(width, n.y + n.h / 2); 
        }
        
        if (n.y < 0) { 
           n.y = 0; n.vy *= -1; 
           triggerRipple(n.x + n.w / 2, 0); 
        } else if (n.y > height - n.h) { 
           n.y = height - n.h; n.vy *= -1; 
           triggerRipple(n.x + n.w / 2, height); 
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          const overlapX = Math.min((n1.x + n1.w) - n2.x, (n2.x + n2.w) - n1.x);
          const overlapY = Math.min((n1.y + n1.h) - n2.y, (n2.y + n2.h) - n1.y);
          
          if (overlapX > 0 && overlapY > 0) {
              const c1x = n1.x + n1.w / 2;
              const c1y = n1.y + n1.h / 2;
              const c2x = n2.x + n2.w / 2;
              const c2y = n2.y + n2.h / 2;
              
              const dx = c2x - c1x;
              const dy = c2y - c1y;

              const dvx = n2.vx - n1.vx;
              const dvy = n2.vy - n1.vy;
              
              // Only resolve if colliding entities carry relative approach velocity
              if ((dvx * dx + dvy * dy) < 0) {
                  if (overlapX < overlapY) {
                     const nx = dx > 0 ? 1 : -1;
                     n1.x -= nx * overlapX * 0.51;
                     n2.x += nx * overlapX * 0.51;
                     
                     const temp = n1.vx;
                     n1.vx = n2.vx;
                     n2.vx = temp;
                  } else {
                     const ny = dy > 0 ? 1 : -1;
                     n1.y -= ny * overlapY * 0.51;
                     n2.y += ny * overlapY * 0.51;
                     
                     const temp = n1.vy;
                     n1.vy = n2.vy;
                     n2.vy = temp;
                  }
                  triggerRipple((c1x + c2x) / 2, (c1y + c2y) / 2);
              }
          }
        }
    }

    // Letter collision — logos deflect off letters; letters spring back with shockwave
    const now = Date.now();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      for (let li = 0; li < letterBoxes.current.length; li++) {
        const lb = letterBoxes.current[li];
        if (lb.w === 0) continue;

        const overlapX = Math.min((n.x + n.w) - lb.x, (lb.x + lb.w) - n.x);
        const overlapY = Math.min((n.y + n.h) - lb.y, (lb.y + lb.h) - n.y);

        if (overlapX > 0 && overlapY > 0) {
          // Deflect logo
          if (overlapX < overlapY) {
            n.vx *= -0.75;
            n.x += n.vx > 0 ? overlapX : -overlapX;
          } else {
            n.vy *= -0.75;
            n.y += n.vy > 0 ? overlapY : -overlapY;
          }

          // Shockwave on letter (throttled 250ms per letter)
          const el = letterRefs.current[li];
          if (el && now - (letterShockTimes.current[li] ?? 0) > 250) {
            letterShockTimes.current[li] = now;
            const jx = (Math.random() - 0.5) * 14;
            const jy = (Math.random() - 0.5) * 10;
            gsap.killTweensOf(el);
            gsap.to(el, {
              x: jx, y: jy, scale: 1.15, duration: 0.08, ease: 'power3.out',
              onComplete: () => {
                gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.75, ease: 'elastic.out(1, 0.45)' });
              }
            });
          }
        }
      }
    }

    // High performance hardware accelerated Canvas Dot Grid mapping local gravity distortions
    if (ctx && dots.length > 0) {
       ctx.clearRect(0, 0, width, height);
       ctx.fillStyle = themeProxyRef.current.dotColor; 
       
       ctx.beginPath();
       for (let i = 0; i < dots.length; i++) {
           const dot = dots[i];
           
           // Restoring spring mechanics towards base grid lattice
           dot.x += (dot.basex - dot.x) * 0.12; 
           dot.y += (dot.basey - dot.y) * 0.12;

           let pullX = 0;
           let pullY = 0;
           for (let ln = 0; ln < nodes.length; ln++) {
               const cx = nodes[ln].x + nodes[ln].w / 2;
               const cy = nodes[ln].y + nodes[ln].h / 2;
               
               const ldx = cx - dot.x;
               const ldy = cy - dot.y;
               const distSq = ldx*ldx + ldy*ldy;
               
               const radiusSq = 350 * 350; // Visible gravity well radius
               if (distSq < radiusSq) {
                  const dist = Math.sqrt(distSq) || 1;
                  const force = Math.pow((radiusSq - distSq) / radiusSq, 2);
                  pullX += (ldx / dist) * force * 6;
                  pullY += (ldy / dist) * force * 6;
               }
           }
           // Cap displacement so dots bend but never leave their neighborhood
           const maxDisplace = 12;
           const displaceLen = Math.sqrt(pullX * pullX + pullY * pullY);
           if (displaceLen > maxDisplace) {
             pullX = (pullX / displaceLen) * maxDisplace;
             pullY = (pullY / displaceLen) * maxDisplace;
           }
           dot.x += pullX;
           dot.y += pullY;

           ctx.rect(dot.x - 1.75, dot.y - 1.75, 3.5, 3.5);
       }
       ctx.fill();
    }

    nodes.forEach((n, i) => {
        if (logosRef.current[i]) {
            logosRef.current[i]!.style.transform = `translate(${n.x}px, ${n.y}px)`;
        }
    });

    reqRef.current = requestAnimationFrame(updatePhysics);
  }, [triggerRipple]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const initPhysics = () => {
        const container = physicsContainerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Critical DOM paint wait buffer locking valid coordinate bounds execution
        if (width < 100) {
            timeoutId = setTimeout(initPhysics, 50);
            return;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const spacing = 35; // Dense grid lattice
        const cols = Math.floor(width / spacing) + 2;
        const rows = Math.floor(height / spacing) + 2;
        const dots = [];
        for (let i = 0; i < cols; i++) {
           for (let j = 0; j < rows; j++) {
              dots.push({ 
                basex: i * spacing, basey: j * spacing, 
                x: i * spacing, y: j * spacing 
              });
           }
        }

        const nodeW = 270;
        const nodeH = 105;

        const nodes = clients.map((_, i) => {
            const angle = (i / clients.length) * Math.PI * 2;
            const rx = (width / 2) - nodeW; 
            const ry = (height / 2) - nodeH * 2; 
            
            const startCenterX = (width / 2) + Math.cos(angle) * Math.max(0, rx);
            const startCenterY = (height / 2) + Math.sin(angle) * Math.max(0, ry);
            const x = startCenterX - (nodeW / 2);
            const y = startCenterY - (nodeH / 2);

            const speed = 0.5 + Math.random() * 0.7;
            const vAngle = Math.random() * Math.PI * 2; 

            return { x, y, vx: Math.cos(vAngle) * speed, vy: Math.sin(vAngle) * speed, w: nodeW, h: nodeH, active: true };
        });

        system.current = { nodes, dots, width, height, ctx };

        // Measure letter bounding boxes relative to physics container
        const containerRect = container.getBoundingClientRect();
        letterBoxes.current = letterRefs.current.map(el => {
          if (!el) return { x: 0, y: 0, w: 0, h: 0 };
          const r = el.getBoundingClientRect();
          return { x: r.left - containerRect.left, y: r.top - containerRect.top, w: r.width, h: r.height };
        });
        letterShockTimes.current = new Array(letterRefs.current.length).fill(0);

        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        reqRef.current = requestAnimationFrame(updatePhysics);
    }

    initPhysics();
    const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(initPhysics, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
    }
  }, [updatePhysics]);

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const theme = {
      bg: '#08090f',               
      text: '#f7f0e6',             
      glassBg: 'rgba(12, 13, 20, 0.40)', 
      glassBorder: 'rgba(255, 255, 255, 0.04)',
      accent: '#c8b48a',           
      invert: 1,                   
      morph1: '#1e1b4b',
      morph2: '#c8b48a',
      dotColor: 'rgba(200, 180, 138, 0.65)',
      blendParam: 0 // <0.5 = dark mode Screen blend, >0.5 = light mode Multiply blend
    }

    gsap.to(theme, {
       bg: '#F5EFE6',         
       text: '#131317',       
       glassBg: 'rgba(255, 255, 255, 0.55)', 
       glassBorder: 'rgba(20, 20, 30, 0.1)', 
       accent: '#9A7B58',     
       invert: 0.15,          
       morph1: '#FFFFFF',     
       morph2: '#E5D6C1',
       dotColor: 'rgba(20, 20, 30, 0.4)',
       blendParam: 1,
       ease: 'none',
       scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 10%',
          scrub: true,
          onUpdate: () => {
             section.style.setProperty('--base-bg', theme.bg);
             section.style.setProperty('--base-text', theme.text);
             section.style.setProperty('--glass-bg', theme.glassBg);
             section.style.setProperty('--glass-border', theme.glassBorder);
             section.style.setProperty('--accent', theme.accent);
             section.style.setProperty('--logo-invert', theme.invert.toString());
             section.style.setProperty('--morph-1', theme.morph1);
             section.style.setProperty('--morph-2', theme.morph2);
             
             // Universally correct mixed rendering blending avoiding black jpg blocks
             section.style.setProperty('--logo-blend', theme.blendParam > 0.5 ? 'multiply' : 'screen');
             themeProxyRef.current.dotColor = theme.dotColor;
          }
       }
    })

    if (!prefersReduced && glassPanelRef.current) {
      gsap.fromTo(glassPanelRef.current,
        { 
          clipPath: 'circle(0% at 50% 10%)', 
          scale: 0.85, 
          filter: 'brightness(2)' 
        },
        { 
          clipPath: 'circle(200% at 50% 50%)', 
          scale: 1, 
          filter: 'brightness(1)', 
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 10%',
            scrub: 1.2,
          }
        }
      )
    }

    numRefs.current.forEach((el, i) => {
      if (!el) return
      const counter = { val: 0 }
      gsap.to(counter, {
        val: stats[i].value,
        duration: prefersReduced ? 0 : 2.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: glassPanelRef.current,
          start: 'top 60%',
          once: true,
        },
        onUpdate: () => { el.textContent = Math.round(counter.val) + stats[i].suffix },
      })
    })
  }, { scope: sectionRef })

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full pb-0 overflow-hidden m-0 border-none"
      style={{
        '--base-bg': '#08090f', 
        '--base-text': '#f7f0e6',
        '--glass-bg': 'rgba(12, 13, 20, 0.40)',
        '--glass-border': 'rgba(255, 255, 255, 0.04)',
        '--accent': '#c8b48a',
        '--logo-invert': 1,
        '--morph-1': '#1e1b4b',
        '--morph-2': '#c8b48a',
        '--logo-blend': 'screen'
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 pointer-events-none transition-colors" style={{ backgroundColor: 'var(--base-bg)' }} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes liquidMorph {
          0% { transform: scale(1) rotate(0deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { transform: scale(1.1) rotate(180deg); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { transform: scale(1) rotate(360deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
      `}} />

      <div className="relative z-20 w-full px-[4%] lg:px-[8%] pt-[10vh]">
        <div 
          ref={glassPanelRef}
          className="relative w-full rounded-[2.5rem] backdrop-blur-3xl flex flex-col items-center justify-center p-8 md:p-14 lg:p-20 overflow-hidden transition-colors"
          style={{ transformOrigin: 'top center', backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderWidth: '1px' }}
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-40 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 0%, var(--accent), transparent 100%)' }} />
          
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-6 mb-16 lg:mb-24 opacity-80">
              <div className="h-px w-8 transition-colors" style={{ backgroundColor: 'var(--accent)' }} />
              <p className="text-[0.6rem] uppercase tracking-[0.4em] font-mono transition-colors" style={{ color: 'var(--accent)' }}>
                System Logic
              </p>
              <div className="h-px w-8 transition-colors" style={{ backgroundColor: 'var(--accent)' }} />
            </div>

            <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-y-16 gap-x-8 w-full text-center">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center relative flex-1">
                  <div
                    style={{
                      fontFamily: "'Labil Grotesk', sans-serif",
                      fontSize: 'clamp(4.5rem, 6.5vw, 8rem)',
                      letterSpacing: '-0.05em',
                      lineHeight: 0.9,
                      fontWeight: 300,
                      color: 'var(--base-text)',
                    }}
                    className="transition-colors drop-shadow-sm"
                  >
                    <span ref={el => { numRefs.current[i] = el }}>0{stat.suffix}</span>
                  </div>
                  
                  <p 
                    className="mt-6 text-[0.65rem] uppercase tracking-[0.25em] font-light max-w-[140px] opacity-70 transition-colors" 
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--base-text)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={physicsContainerRef} 
        className="relative w-full h-[70vh] lg:h-[90vh] mt-10 lg:mt-24 overflow-hidden" 
      >
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 flex items-center">
          {'Trusted by experts'.split('').map((char, i) => (
            <span
              key={i}
              ref={el => { letterRefs.current[i] = el }}
              className="inline-block text-[2rem] uppercase tracking-[0.6em] font-mono font-bold transition-colors opacity-50 select-none"
              style={{ color: 'var(--accent)', willChange: 'transform' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* The Gravitational Canvas Grid */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* 11 AABB mapped natively transparent vectors utilizing dynamic scroll blending modes */}
        {clients.map((client, i) => (
          <div
            key={i}
            ref={el => { logosRef.current[i] = el }}
            className="absolute top-0 left-0 w-[270px] h-[105px] flex items-center justify-center z-10 pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={270}
                  height={105}
                  className="w-full h-full object-contain pointer-events-auto"
                  style={{
                    // GSAP interpolates screen vs multiply dynamically based on scroll light/dark transition!
                    filter: `grayscale(1) contrast(1.5) invert(calc(var(--logo-invert) * 100%)) opacity(80%)`,
                    mixBlendMode: 'var(--logo-blend)' as any
                  }}
                />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
