'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  opacity: number
  speed: number
  size: number
  age: number
  lifetime: number
}

export default function Sparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COUNT = 280
    const particles: Particle[] = []
    let rafId: number

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function spawn(): Particle {
      const lifetime = 3000 + Math.random() * 3000
      return {
        x: Math.random() * (canvas?.width ?? 0),
        y: Math.random() * (canvas?.height ?? 0),
        opacity: 0,
        speed: 0.08 + Math.random() * 0.14,
        size: 0.6 + Math.random() * 1.2,
        age: 0,
        lifetime,
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const p = spawn()
      p.age = Math.random() * p.lifetime // stagger initial ages
      particles.push(p)
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.age += 16
        p.y -= p.speed

        // fade in first 25%, hold, fade out last 25%
        const progress = p.age / p.lifetime
        if (progress < 0.25) {
          p.opacity = progress / 0.25
        } else if (progress > 0.75) {
          p.opacity = 1 - (progress - 0.75) / 0.25
        } else {
          p.opacity = 1
        }

        if (p.age >= p.lifetime) {
          Object.assign(p, spawn())
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210, 218, 255, ${p.opacity * 0.55})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  )
}
