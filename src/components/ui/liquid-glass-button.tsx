'use client'

import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

type LiquidButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ children, className, type = 'button', ...props }, ref) => {
    const filterId = useId().replace(/:/g, '')

    return (
      <>
        <button
          ref={ref}
          type={type}
          className={cn('liquid-button', className)}
          {...props}
        >
          <span className="liquid-button__surface" aria-hidden="true">
            <span className="liquid-button__glow" />
            <span
              className="liquid-button__distortion"
              style={{ filter: `url(#${filterId})` }}
            />
            <span className="liquid-button__shine" />
            <span className="liquid-button__edge" />
          </span>
          <span className="liquid-button__label">{children}</span>
        </button>

        <svg
          className="liquid-button__filter"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.025"
                numOctaves="2"
                seed="11"
                result="noise"
              />
              <feGaussianBlur
                in="noise"
                stdDeviation="1.2"
                result="softNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softNoise"
                scale="20"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>
          </defs>
        </svg>

        <style jsx>{`
          .liquid-button {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.42);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.16);
            color: #1a1412;
            backdrop-filter: blur(16px) saturate(150%);
            -webkit-backdrop-filter: blur(16px) saturate(150%);
            box-shadow:
              0 12px 24px rgba(81, 63, 44, 0.08),
              0 3px 10px rgba(81, 63, 44, 0.12),
              inset 1px 1px 0 rgba(255, 255, 255, 0.82),
              inset -1px -1px 0 rgba(151, 131, 110, 0.12);
            isolation: isolate;
            outline: none;
            cursor: pointer;
            transition:
              transform 240ms var(--ease-out-cubic, ease),
              box-shadow 240ms var(--ease-out-cubic, ease),
              background-color 240ms var(--ease-out-cubic, ease),
              border-color 240ms var(--ease-out-cubic, ease);
          }

          .liquid-button:hover:not(:disabled) {
            transform: translateY(-1px) scale(1.018);
            background: rgba(255, 255, 255, 0.2);
            box-shadow:
              0 18px 30px rgba(81, 63, 44, 0.11),
              0 4px 12px rgba(81, 63, 44, 0.14),
              inset 1px 1px 0 rgba(255, 255, 255, 0.9),
              inset -1px -1px 0 rgba(151, 131, 110, 0.16);
          }

          .liquid-button:active:not(:disabled) {
            transform: translateY(0) scale(0.992);
          }

          .liquid-button:focus-visible {
            border-color: rgba(201, 100, 66, 0.34);
            box-shadow:
              0 0 0 3px rgba(201, 100, 66, 0.14),
              0 12px 24px rgba(81, 63, 44, 0.08),
              inset 1px 1px 0 rgba(255, 255, 255, 0.82),
              inset -1px -1px 0 rgba(151, 131, 110, 0.12);
          }

          .liquid-button:disabled {
            cursor: default;
            opacity: 0.58;
          }

          .liquid-button__surface {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            overflow: hidden;
            pointer-events: none;
          }

          .liquid-button__glow {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.2) 22%, transparent 54%),
              radial-gradient(circle at 80% 75%, rgba(237, 222, 205, 0.46) 0%, transparent 48%);
            opacity: 0.9;
          }

          .liquid-button__distortion {
            position: absolute;
            inset: -6%;
            border-radius: inherit;
            background:
              linear-gradient(135deg, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.1) 45%, rgba(218, 198, 180, 0.18) 100%);
            mix-blend-mode: screen;
            opacity: 0.72;
          }

          .liquid-button__shine {
            position: absolute;
            inset: 1px;
            border-radius: inherit;
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.18) 26%, rgba(255, 255, 255, 0.06) 62%, rgba(255, 255, 255, 0.24) 100%);
            opacity: 0.8;
          }

          .liquid-button__edge {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.28),
              inset 0 -12px 18px rgba(131, 107, 85, 0.06);
          }

          .liquid-button__label {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            font: inherit;
            line-height: 1;
            white-space: nowrap;
          }

          .liquid-button__filter {
            position: absolute;
            width: 0;
            height: 0;
            overflow: hidden;
            pointer-events: none;
          }
        `}</style>
      </>
    )
  }
)

LiquidButton.displayName = 'LiquidButton'

export { LiquidButton }
