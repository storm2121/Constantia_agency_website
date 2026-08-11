'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import styles from '@/components/ServiceCaseStudyGallery.module.css'

export type ImageMediaItem = {
  kind: 'image'
  src: string
  fullSrc?: string
  alt: string
  interactive?: boolean
  objectPosition?: string
}

export type PlayableVideoItem = {
  kind: 'video'
  id: string
  title: string
  poster: string
  hlsManifestPath: string
  alt: string
  posterPosition?: string
}

export type HeroMediaItem =
  | ImageMediaItem
  | {
      kind: 'storage-video'
      src: string
      poster?: string
      alt: string
    }
  | {
      kind: 'youtube-embed'
      youtubeVideoId: string
      youtubeStartSeconds?: number
      poster?: string
      alt: string
    }

type LenisWindow = Window & {
  __lenis?: {
    stop: () => void
    start: () => void
  }
}

function getYoutubeEmbedSrc(videoId: string, startSeconds?: number) {
  const search = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })

  if (startSeconds && startSeconds > 0) {
    search.set('start', String(startSeconds))
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${search.toString()}`
}

function getOverlaySrc(item: ImageMediaItem) {
  return item.fullSrc ?? item.src
}

function formatSequence(index: number) {
  return String(index + 1).padStart(2, '0')
}

function VideoPosterCard({
  item,
  displayIndex,
  label,
  onOpen,
}: {
  item: PlayableVideoItem
  displayIndex: number
  label: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      className={`${styles.thumbButton} ${styles.motionPosterButton}`}
      onClick={onOpen}
      aria-label={`Play ${item.title}`}
    >
      <div className={styles.motionPosterFrame}>
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 44vw, 242px"
          className={styles.image}
          style={item.posterPosition ? { objectPosition: item.posterPosition } : undefined}
        />
        <span className={`${styles.playBadge} ${styles.motionRailPlayBadge}`}>
          <Play size={18} fill="currentColor" strokeWidth={1.3} />
        </span>
      </div>
      <div className={styles.motionPosterInfo}>
        <div className={styles.motionPosterMetaRow}>
          <span className={styles.motionPosterSequence}>{formatSequence(displayIndex)}</span>
          <span className={styles.motionPosterDivider} />
          <span className={styles.motionPosterLabel}>{label}</span>
        </div>
        <p className={styles.motionPosterTitle}>{item.title}</p>
      </div>
    </button>
  )
}

export default function ServiceCaseStudyGallery({
  title,
  hero,
  supportingMedia,
  playableVideos = [],
}: {
  title: string
  hero: HeroMediaItem
  supportingMedia: ImageMediaItem[]
  playableVideos?: PlayableVideoItem[]
}) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [heroActivated, setHeroActivated] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)

  const hasPlayableVideos = playableVideos.length > 0
  const heroIsInteractiveImage = hero.kind === 'image' && hero.interactive !== false
  const overlayMedia = heroIsInteractiveImage ? [hero, ...supportingMedia] : supportingMedia

  useEffect(() => {
    if (activeImageIndex === null && activeVideoIndex === null) {
      return
    }

    const lenisWindow = window as LenisWindow
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null)
        setActiveVideoIndex(null)
      }

      if (event.key === 'ArrowLeft') {
        if (activeVideoIndex !== null && playableVideos.length > 0) {
          setActiveVideoIndex((current) => {
            if (current === null) return current
            return (current - 1 + playableVideos.length) % playableVideos.length
          })
          return
        }

        if (activeImageIndex !== null && overlayMedia.length > 0) {
          setActiveImageIndex((current) => {
            if (current === null) return current
            return (current - 1 + overlayMedia.length) % overlayMedia.length
          })
        }
      }

      if (event.key === 'ArrowRight') {
        if (activeVideoIndex !== null && playableVideos.length > 0) {
          setActiveVideoIndex((current) => {
            if (current === null) return current
            return (current + 1) % playableVideos.length
          })
          return
        }

        if (activeImageIndex !== null && overlayMedia.length > 0) {
          setActiveImageIndex((current) => {
            if (current === null) return current
            return (current + 1) % overlayMedia.length
          })
        }
      }
    }

    document.body.style.overflow = 'hidden'
    lenisWindow.__lenis?.stop()
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      lenisWindow.__lenis?.start()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeImageIndex, activeVideoIndex, playableVideos.length, overlayMedia.length])

  useEffect(() => {
    if (activeVideoIndex === null) {
      return
    }

    const videoElement = videoRef.current
    const activeVideo = playableVideos[activeVideoIndex]

    if (!videoElement || !activeVideo) {
      return
    }

    let isCancelled = false
    let hlsInstance: { destroy: () => void } | null = null

    const attachStream = async () => {
      videoElement.poster = activeVideo.poster
      videoElement.preload = 'metadata'

      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = activeVideo.hlsManifestPath
        try {
          await videoElement.play()
        } catch {}
        return
      }

      const hlsModule = await import('hls.js')
      if (isCancelled) {
        return
      }

      const Hls = hlsModule.default
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
        })
        hls.loadSource(activeVideo.hlsManifestPath)
        hls.attachMedia(videoElement)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(() => {})
        })
        hlsInstance = hls
        return
      }

      videoElement.src = activeVideo.hlsManifestPath
      try {
        await videoElement.play()
      } catch {}
    }

    attachStream().catch(() => {})

    return () => {
      isCancelled = true
      hlsInstance?.destroy()
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
    }
  }, [activeVideoIndex, playableVideos])

  useEffect(() => {
    if (hero.kind !== 'storage-video' || !heroActivated) {
      return
    }

    const videoElement = heroVideoRef.current
    if (!videoElement) {
      return
    }

    let isCancelled = false
    let hlsInstance: { destroy: () => void } | null = null

    const attachStream = async () => {
      if (hero.poster) {
        videoElement.poster = hero.poster
      }
      videoElement.preload = 'metadata'

      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = hero.src
        try {
          await videoElement.play()
        } catch {}
        return
      }

      const hlsModule = await import('hls.js')
      if (isCancelled) {
        return
      }

      const Hls = hlsModule.default
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
        })
        hls.loadSource(hero.src)
        hls.attachMedia(videoElement)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(() => {})
        })
        hlsInstance = hls
        return
      }

      videoElement.src = hero.src
      try {
        await videoElement.play()
      } catch {}
    }

    attachStream().catch(() => {})

    return () => {
      isCancelled = true
      hlsInstance?.destroy()
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
    }
  }, [hero, heroActivated])

  const renderHero = () => {
    if (hero.kind === 'image') {
      if (hero.interactive === false) {
        return (
          <div className={styles.heroStatic}>
            <div className={styles.heroVisual}>
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 780px"
                className={styles.image}
                style={hero.objectPosition ? { objectPosition: hero.objectPosition } : undefined}
              />
            </div>
          </div>
        )
      }

      return (
        <button
          type="button"
          className={styles.heroButton}
          onClick={() => setActiveImageIndex(0)}
          aria-label={`Open ${title} hero image`}
        >
          <div className={styles.heroVisual}>
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 780px"
              className={styles.image}
              style={hero.objectPosition ? { objectPosition: hero.objectPosition } : undefined}
            />
          </div>
        </button>
      )
    }

    const poster = hero.poster

    if (hero.kind === 'storage-video') {
      return (
        <div className={styles.heroVisual}>
          {heroActivated ? (
            <video
              ref={heroVideoRef}
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={poster}
              className={styles.embeddedMedia}
            />
          ) : (
            <button
              type="button"
              className={styles.mediaLaunch}
              onClick={() => setHeroActivated(true)}
              aria-label={`Play ${title} video`}
            >
              {poster ? (
                <Image
                  src={poster}
                  alt={hero.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 780px"
                  className={styles.image}
                />
              ) : null}
              <span className={styles.playBadge}>
                <Play size={20} fill="currentColor" strokeWidth={1.3} />
              </span>
            </button>
          )}
        </div>
      )
    }

    return (
      <div className={styles.heroVisual}>
        {heroActivated ? (
          <iframe
            src={getYoutubeEmbedSrc(hero.youtubeVideoId, hero.youtubeStartSeconds)}
            title={hero.alt}
            className={styles.embeddedMedia}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={styles.mediaLaunch}
            onClick={() => setHeroActivated(true)}
            aria-label={`Play ${title} video`}
          >
            {hero.poster ? (
              <Image
                src={hero.poster}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 780px"
                className={styles.image}
              />
            ) : null}
            <span className={styles.playBadge}>
              <Play size={20} fill="currentColor" strokeWidth={1.3} />
            </span>
          </button>
        )}
      </div>
    )
  }

  const openVideo = (index: number) => {
    setActiveImageIndex(null)
    setActiveVideoIndex(index)
  }

  return (
    <div className={styles.content}>
      {hasPlayableVideos ? null : renderHero()}

      <h1 className={`${styles.title} ${hasPlayableVideos ? styles.titleLead : ''}`}>{title}</h1>

      {hasPlayableVideos ? (
        <div className={styles.motionPosterRail}>
          {playableVideos.map((item, index) => (
            <VideoPosterCard
              key={item.id}
              item={item}
              displayIndex={index}
              label="Motion Reel"
              onOpen={() => openVideo(index)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.supportGrid}>
          {supportingMedia.map((item, index) => {
            const overlayIndex = heroIsInteractiveImage ? index + 1 : index

            return (
              <button
                key={`${item.src}-${index}`}
                type="button"
                className={styles.thumbButton}
                onClick={() => setActiveImageIndex(overlayIndex)}
                aria-label={`Open ${title} image ${index + 2}`}
              >
                <div className={styles.thumbVisual}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 245px"
                    className={styles.image}
                    style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                  />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {activeImageIndex !== null ? (
        <div
          className={styles.overlay}
          onClick={() => setActiveImageIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {overlayMedia.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveImageIndex((activeImageIndex - 1 + overlayMedia.length) % overlayMedia.length)
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={36} strokeWidth={1.1} />
              </button>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveImageIndex((activeImageIndex + 1) % overlayMedia.length)
                }}
                aria-label="Next image"
              >
                <ChevronRight size={36} strokeWidth={1.1} />
              </button>
            </>
          ) : null}

          <div className={styles.overlayInner} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.overlayClose}
              onClick={() => setActiveImageIndex(null)}
              aria-label="Close gallery"
            >
              <X size={30} strokeWidth={1.2} />
            </button>
            <Image
              src={getOverlaySrc(overlayMedia[activeImageIndex])}
              alt={overlayMedia[activeImageIndex].alt}
              fill
              priority
              sizes="100vw"
              className={styles.overlayImage}
            />
          </div>
        </div>
      ) : null}

      {activeVideoIndex !== null ? (
        <div
          className={styles.overlay}
          onClick={() => setActiveVideoIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {playableVideos.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveVideoIndex(
                    (activeVideoIndex - 1 + playableVideos.length) % playableVideos.length
                  )
                }}
                aria-label="Previous video"
              >
                <ChevronLeft size={36} strokeWidth={1.1} />
              </button>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveVideoIndex((activeVideoIndex + 1) % playableVideos.length)
                }}
                aria-label="Next video"
              >
                <ChevronRight size={36} strokeWidth={1.1} />
              </button>
            </>
          ) : null}

          <div
            className={`${styles.overlayInner} ${styles.videoOverlayInner}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.overlayClose}
              onClick={() => setActiveVideoIndex(null)}
              aria-label="Close video player"
            >
              <X size={30} strokeWidth={1.2} />
            </button>
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={playableVideos[activeVideoIndex].poster}
              className={styles.overlayVideo}
            />
            <div className={styles.overlayVideoMeta}>
              <span className={styles.overlayVideoTitle}>{playableVideos[activeVideoIndex].title}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
