"use client"

import * as React from "react"
import { HTMLMotionProps, MotionConfig, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
  text: string
  index: number
}
interface HoverSliderImageProps {
  index: number
}
interface HoverSliderVideoProps {
  index: number
  src: string
  poster: string
  isSectionActive: boolean
}
interface HoverSliderContextValue {
  activeSlide: number
  changeSlide: (index: number) => void
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "))
  const characters = words.map((word) => word.split("")).flat(1)
  return { words, characters }
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(undefined)

export function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within a HoverSlider")
  }
  return context
}

export const HoverSlider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0)
  const changeSlide = React.useCallback(
    (index: number) => setActiveSlide(index),
    [setActiveSlide]
  )
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  )
})
HoverSlider.displayName = "HoverSlider"

export const TextStaggerHover = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & TextStaggerHoverProps
>(({ text, index, className, style, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext()
  const { characters } = splitText(text)
  const isActive = activeSlide === index

  return (
    <span
      className={cn("relative inline-block origin-bottom overflow-hidden", className)}
      style={style}
      {...props}
      ref={ref}
    >
      {characters.map((char, i) => (
        <span key={`${char}-${i}`} className="relative inline-block overflow-hidden">
          <MotionConfig
            transition={{
              delay: i * 0.025,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.span
              className="inline-block opacity-20"
              initial={{ y: "0%" }}
              animate={isActive ? { y: "-110%" } : { y: "0%" }}
            >
              {char}
              {char === " " && i < characters.length - 1 && <>&nbsp;</>}
            </motion.span>

            <motion.span
              className="absolute left-0 top-0 inline-block opacity-100"
              initial={{ y: "110%" }}
              animate={isActive ? { y: "0%" } : { y: "110%" }}
            >
              {char}
            </motion.span>
          </MotionConfig>
        </span>
      ))}
    </span>
  )
})
TextStaggerHover.displayName = "TextStaggerHover"

const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
  },
}

export const HoverSliderImageWrap = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
        className
      )}
      {...props}
    />
  )
})
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, className, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext()
  return (
    <motion.img
      className={cn("inline-block align-middle", className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={activeSlide === index ? "visible" : "hidden"}
      ref={ref}
      {...props}
    />
  )
})
HoverSliderImage.displayName = "HoverSliderImage"

export function HoverSliderVideo({
  index,
  src,
  poster,
  isSectionActive,
  className,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement> & HoverSliderVideoProps) {
  const { activeSlide } = useHoverSliderContext()
  const prefersReducedMotion = useReducedMotion()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [saveData, setSaveData] = React.useState(false)
  const [shouldAttachSrc, setShouldAttachSrc] = React.useState(false)
  const isActive = activeSlide === index
  const canAutoplay = isActive && isSectionActive && !prefersReducedMotion && !saveData

  React.useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    setSaveData(Boolean(connection?.saveData))
  }, [])

  React.useEffect(() => {
    if (canAutoplay) {
      setShouldAttachSrc(true)
    }
  }, [canAutoplay])

  React.useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) {
      return
    }

    if (shouldAttachSrc && videoElement.src !== src) {
      videoElement.src = src
      videoElement.load()
    }

    if (!shouldAttachSrc || !canAutoplay) {
      videoElement.pause()
      return
    }

    const playPromise = videoElement.play()

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {})
    }

    return () => {
      videoElement.pause()
    }
  }, [canAutoplay, shouldAttachSrc, src])

  return (
    <motion.div
      className="size-full"
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={isActive ? "visible" : "hidden"}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload={shouldAttachSrc ? "metadata" : "none"}
        poster={poster}
        className={cn("inline-block h-full w-full align-middle object-cover", className)}
        {...props}
      />
    </motion.div>
  )
}
