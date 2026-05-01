"use client"

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { IconImage } from "../icon-image/icon-image"

export interface GalleryImage {
  id: string
  src: string
  alt: string
}

interface Props {
  images: GalleryImage[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function AdvancedHeroGallery({
  images,
  autoPlay = true,
  autoPlayInterval = 4000,
}: Props) {
  const [index, setIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const paginate = useCallback(
    (dir: number) => {
      setIndex((prev) => (prev + dir + images.length) % images.length)
    },
    [images.length]
  )

  /* ================= Autoplay ================= */
  useEffect(() => {
    if (!autoPlay || isHovered || isFullscreen) return
    const interval = setInterval(() => paginate(1), autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, paginate, isHovered, isFullscreen])

  /* ================= Keyboard ================= */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1)
      if (e.key === "ArrowLeft") paginate(-1)
      if (e.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [paginate])

  /* ================= Swipe ================= */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 50) paginate(-1)
    if (delta < -50) paginate(1)
    touchStartX.current = null
  }

  if (!images?.length) return null

  return (
    <>
      {/* ================= MAIN ================= */}
      <div
        className="w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* BIG IMAGE */}
        <div
          className="
            relative w-full
            h-50
            sm:h-75
            md:h-100
            lg:h-110
            overflow-hidden
            cursor-pointer
          "
          onClick={() => setIsFullscreen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={images[index].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[index].src}
                alt={images[index].alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= THUMBNAILS ================= */}
        <div className="relative mt-6 flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
          >
            <IconImage src="/icons/chevron-left.svg" alt="Previous" />
          </button>

          {/* Thumbnail List */}
          <div
            className="
              flex gap-3 sm:gap-6
              overflow-x-auto
              snap-x snap-mandatory
              px-10 sm:px-16
            "
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setIndex(i)}
                className="
                  relative
                  w-30 h-20
                  sm:w-50 sm:h-32.5
                  md:w-60 md:h-40
                  lg:w-57 lg:h-30
                  shrink-0 snap-center
                "
              >
                <motion.div
                  animate={{ scale: index === i ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`relative w-full h-full border-2 ${
                    index === i
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 120px,
                           (max-width: 1024px) 240px,
                           308px"
                    className="object-cover"
                  />
                </motion.div>
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
          >
            <IconImage src="/icons/chevron-right.svg" alt="Next" />
          </button>
        </div>
      </div>

      {/* ================= FULLSCREEN ================= */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50"
            onClick={() => setIsFullscreen(false)} // close on backdrop click
          >
            {/* Prevent click from bubbling */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="
                  absolute
                  top-4 right-4
                  sm:top-6 sm:right-6
                  z-50
                  bg-white/10
                  backdrop-blur
                  text-white
                  text-2xl
                  w-10 h-10
                  flex items-center justify-center
                  rounded-full
                "
              >
                ✕
              </button>

              <Image
                src={images[index].src}
                alt={images[index].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
