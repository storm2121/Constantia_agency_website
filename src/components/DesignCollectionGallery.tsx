'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import styles from '@/components/DesignCollectionGallery.module.css'

export type DesignGalleryImage = {
  id: string
  src: string
  fullSrc?: string
  alt: string
}

export type DesignGalleryVideo = {
  id: string
  title: string
  poster: string
  hlsManifestPath: string
  alt: string
}

export type DesignGallerySection = {
  id: string
  title: string
  kind: 'images' | 'mixed' | 'videos'
  images: DesignGalleryImage[]
  videos: DesignGalleryVideo[]
}

type LenisWindow = Window & {
  __lenis?: {
    stop: () => void
    start: () => void
  }
}

const SECTION_KIND_LABELS: Record<DesignGallerySection['kind'], string> = {
  images: 'Image Series',
  mixed: 'Mixed Media',
  videos: 'Playable Reels',
}

export default function DesignCollectionGallery({
  title,
  hero,
  sections,
}: {
  title: string
  hero: DesignGalleryImage
  sections: DesignGallerySection[]
}) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const { sectionImageOffsets, sectionVideoOffsets, imageOverlayItems, flatVideos } = useMemo(() => {
    const computedSectionImageOffsets: Record<string, number> = {}
    const computedSectionVideoOffsets: Record<string, number> = {}
    const computedImageOverlayItems = [hero]
    const computedFlatVideos: DesignGalleryVideo[] = []

    for (const section of sections) {
      computedSectionImageOffsets[section.id] = computedImageOverlayItems.length
      computedImageOverlayItems.push(...section.images)
      computedSectionVideoOffsets[section.id] = computedFlatVideos.length
      computedFlatVideos.push(...section.videos)
    }

    return {
      sectionImageOffsets: computedSectionImageOffsets,
      sectionVideoOffsets: computedSectionVideoOffsets,
      imageOverlayItems: computedImageOverlayItems,
      flatVideos: computedFlatVideos,
    }
  }, [hero, sections])

  useEffect(() => {
    if (activeImageIndex === null && activeVideoIndex === null) {
      return
    }

    const lenisWindow = window as LenisWindow
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null)
        setActiveVideoIndex(null)
        return
      }

      if (event.key === 'ArrowLeft') {
        if (activeVideoIndex !== null && flatVideos.length > 0) {
          setActiveVideoIndex((current) =>
            current === null ? current : (current - 1 + flatVideos.length) % flatVideos.length
          )
          return
        }

        if (activeImageIndex !== null && imageOverlayItems.length > 0) {
          setActiveImageIndex((current) =>
            current === null ? current : (current - 1 + imageOverlayItems.length) % imageOverlayItems.length
          )
        }
      }

      if (event.key === 'ArrowRight') {
        if (activeVideoIndex !== null && flatVideos.length > 0) {
          setActiveVideoIndex((current) =>
            current === null ? current : (current + 1) % flatVideos.length
          )
          return
        }

        if (activeImageIndex !== null && imageOverlayItems.length > 0) {
          setActiveImageIndex((current) =>
            current === null ? current : (current + 1) % imageOverlayItems.length
          )
        }
      }
    }

    document.body.style.overflow = 'hidden'
    lenisWindow.__lenis?.stop()
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      lenisWindow.__lenis?.start()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeImageIndex, activeVideoIndex, flatVideos.length, imageOverlayItems.length])

  useEffect(() => {
    if (activeVideoIndex === null) {
      return
    }

    const videoElement = videoRef.current
    const activeVideo = flatVideos[activeVideoIndex]
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
        await videoElement.play().catch(() => {})
        return
      }

      const hlsModule = await import('hls.js')
      if (isCancelled) {
        return
      }

      const Hls = hlsModule.default
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true })
        hls.loadSource(activeVideo.hlsManifestPath)
        hls.attachMedia(videoElement)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(() => {})
        })
        hlsInstance = hls
        return
      }

      videoElement.src = activeVideo.hlsManifestPath
      await videoElement.play().catch(() => {})
    }

    attachStream().catch(() => {})

    return () => {
      isCancelled = true
      hlsInstance?.destroy()
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
    }
  }, [activeVideoIndex, flatVideos])

  return (
    <div className={styles.content}>
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
          />
        </div>
      </button>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.id} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKind}>{SECTION_KIND_LABELS[section.kind]}</span>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
            </div>

            {section.images.length > 0 ? (
              <div className={styles.imageGrid}>
                {section.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    className={styles.imageButton}
                    onClick={() => setActiveImageIndex(sectionImageOffsets[section.id] + index)}
                    aria-label={`Open ${image.alt}`}
                  >
                    <div className={styles.imageVisual}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 245px"
                        className={styles.image}
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            {section.videos.length > 0 ? (
              <div className={styles.videoGrid}>
                {section.videos.map((video, index) => (
                  <button
                    key={video.id}
                    type="button"
                    className={styles.videoButton}
                    onClick={() => {
                      setActiveImageIndex(null)
                      setActiveVideoIndex(sectionVideoOffsets[section.id] + index)
                    }}
                    aria-label={`Play ${video.title}`}
                  >
                    <div className={styles.videoVisual}>
                      <Image
                        src={video.poster}
                        alt={video.alt}
                        fill
                        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 245px"
                        className={styles.image}
                      />
                      <span className={styles.playBadge}>
                        <Play size={18} fill="currentColor" strokeWidth={1.3} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      {activeImageIndex !== null ? (
        <div
          className={styles.overlay}
          onClick={() => setActiveImageIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {imageOverlayItems.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveImageIndex(
                    (activeImageIndex - 1 + imageOverlayItems.length) % imageOverlayItems.length
                  )
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
                  setActiveImageIndex((activeImageIndex + 1) % imageOverlayItems.length)
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
              src={imageOverlayItems[activeImageIndex].fullSrc ?? imageOverlayItems[activeImageIndex].src}
              alt={imageOverlayItems[activeImageIndex].alt}
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
          {flatVideos.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveVideoIndex((activeVideoIndex - 1 + flatVideos.length) % flatVideos.length)
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
                  setActiveVideoIndex((activeVideoIndex + 1) % flatVideos.length)
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
              poster={flatVideos[activeVideoIndex].poster}
              className={styles.overlayVideo}
            />
            <div className={styles.overlayVideoMeta}>
              <span className={styles.overlayVideoTitle}>{flatVideos[activeVideoIndex].title}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
