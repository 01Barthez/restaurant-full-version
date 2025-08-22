import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Info, Share2, X } from "lucide-react"
import OptimizedImage from '@/components/ui/OptimizedImage'
import { restaurants } from '@/data/restaurants.data'
import { isLiked as likeIsLiked, toggleLike } from '@/services/like.service'

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

// Curated default sources centered on African meals, chefs, kitchens, and restaurants
const africanDefault: string[] = [
  "https://source.unsplash.com/600x600/?african,food,jollof",
  "https://source.unsplash.com/600x600/?chef,african,kitchen",
  "https://source.unsplash.com/600x600/?grill,africa,bbq",
  "https://source.unsplash.com/600x600/?restaurant,africa,interior",
  "https://source.unsplash.com/600x600/?market,african,spices",
  "https://source.unsplash.com/600x600/?suya,street,food",
  "https://source.unsplash.com/600x600/?fufu,egusi,soup",
  "https://source.unsplash.com/600x600/?chef,cooking,action",
  "https://source.unsplash.com/600x600/?plantain,meal,africa",
  "https://source.unsplash.com/600x600/?tagine,moroccan,food",
  "https://source.unsplash.com/600x600/?berber,food,africa",
  "https://source.unsplash.com/600x600/?injera,ethiopian,food",
]

const duration = 0.15
const transition = { duration, ease: 'easeInOut' as const }
const transitionOverlay = { duration: 0.5, ease: 'easeInOut' as const }

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
  }: {
    handleClick: (imgUrl: string, index: number) => void
    controls: any
    cards: string[]
    isCarouselActive: boolean
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    // On mobile, use fewer, larger faces for readability and smoother perf
    const visibleCards = useMemo(() => (isScreenSizeSm ? cards.slice(0, 8) : cards), [cards, isScreenSizeSm])
    const cylinderWidth = isScreenSizeSm ? 720 : 1800
    const faceCount = visibleCards.length
    const faceWidth = Math.max(180, cylinderWidth / Math.max(1, faceCount))
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="flex h-full items-center justify-center bg-transparent"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {visibleCards.map((imgUrl, i) => (
            <motion.div
              key={`key-${imgUrl}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(imgUrl, i)}
            >
              <motion.div
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transition}
                className="w-full"
              >
                <OptimizedImage
                  src={imgUrl}
                  alt={`carousel_${i}`}
                  className="pointer-events-none w-full rounded-2xl object-cover aspect-square shadow-lg ring-1 ring-black/10 dark:ring-white/10"
                  skeletonClassName="rounded-2xl"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)

export type CarouselItem = { src: string; title?: string; id?: string; description?: string }

function ThreeDPhotoCarousel({ items }: { items?: CarouselItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [liking, setLiking] = useState(false)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const controls = useAnimation()
  const resolvedItems: CarouselItem[] = useMemo(() => {
    if (items && items.length) return items
    // Build from restaurants with metadata
    const fromRestaurants: CarouselItem[] = restaurants.flatMap((r) =>
      (r.images || []).map((src, idx) => ({
        src,
        id: `${r.id}-${idx}`,
        title: r.name,
        description: r.description,
      }))
    )
    // Deduplicate by src
    const seen = new Set<string>()
    const deduped: CarouselItem[] = []
    for (const it of fromRestaurants) {
      if (seen.has(it.src)) continue
      seen.add(it.src)
      deduped.push(it)
    }
    // Fallback to africanDefault if empty
    if (deduped.length === 0) return africanDefault.map((src, i) => ({ src, id: `af-${i}` }))
    return deduped
  }, [items])

  const cards = useMemo(() => resolvedItems.map((i) => i.src), [resolvedItems])

  const isActive = activeIndex !== null

  // Keyboard navigation when a card is active
  useEffect(() => {
    if (!isActive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, activeIndex, cards])

  const handleClick = (_imgUrl: string, index: number) => {
    setActiveIndex(index)
    setIsCarouselActive(false)
    setDetailsOpen(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveIndex(null)
    setIsCarouselActive(true)
    setDetailsOpen(false)
  }

  const handlePrev = () => {
    setActiveIndex((idx) => {
      if (idx === null) return 0
      const next = (idx - 1 + cards.length) % cards.length
      return next
    })
    setDetailsOpen(false)
  }
  const handleNext = () => {
    setActiveIndex((idx) => {
      if (idx === null) return 0
      const next = (idx + 1) % cards.length
      return next
    })
    setDetailsOpen(false)
  }

  // Like with persistence service
  const handleLike = async () => {
    if (activeIndex === null || liking) return
    setLiking(true)
    try {
      const item = resolvedItems[activeIndex]
      const key = item?.id || item?.src
      if (!key) return
      const res = await toggleLike(key)
      setLiked((prev) => ({ ...prev, [key]: res.liked }))
    } finally {
      setLiking(false)
    }
  }

  // Share handler (Web Share API + fallbacks)
  const handleShare = async () => {
    if (activeIndex === null) return
    const current = resolvedItems[activeIndex]
    const url = current.src
    const title = current.title || 'Découvrez ce plat !'
    const text = current.description || 'Une inspiration culinaire depuis notre restaurant.'
    // Web Share API
    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share({ title, text, url })
        return
      }
    } catch (_) {}
    // Fallbacks
    const encoded = encodeURIComponent(url)
    const shareLinks = [
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(text)}`,
      `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    ]
    window.open(shareLinks[0], '_blank')
  }

  const toggleDetails = () => setDetailsOpen((v) => !v)

  const activeImg = activeIndex !== null ? cards[activeIndex] : null
  const activeItem = activeIndex !== null ? resolvedItems[activeIndex] : null
  const likeKey = activeItem?.id || activeItem?.src || ''
  const isLikedNow = likeKey ? (liked[likeKey] ?? likeIsLiked(likeKey)) : false

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog" aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />
            {/* Modal content */}
            <motion.div
              className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/15 bg-white/80 dark:bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
              transition={transitionOverlay}
            >
              <div className="relative aspect-[5/3] w-full overflow-hidden">
                <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="h-full w-full">
                  <OptimizedImage
                    src={activeImg}
                    alt="photo active"
                    className="h-full w-full object-cover"
                    skeletonClassName="rounded-none"
                    priority
                  />
                </motion.div>
                {/* Top-right close */}
                <button
                  onClick={handleClose}
                  aria-label="Fermer"
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-md ring-1 ring-white/20 hover:bg-black/70"
                >
                  <X className="h-5 w-5" />
                </button>
                {/* Prev / Next */}
                <button
                  onClick={handlePrev}
                  aria-label="Précédent"
                  className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-md ring-1 ring-white/20 hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Suivant"
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-md ring-1 ring-white/20 hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Action bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
                <div className="text-sm sm:text-base font-medium text-foreground">
                  Image {activeIndex! + 1} / {cards.length}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleLike} disabled={liking} className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/15 bg-white text-black dark:bg-white/10 dark:text-white px-3 py-2 text-sm shadow-sm hover:bg-white/90 dark:hover:bg-white/15 disabled:opacity-60">
                    <Heart className={`h-4 w-4 ${isLikedNow ? 'fill-current text-red-500' : ''}`} />
                    {isLikedNow ? 'Aimé' : (liking ? '...' : 'J’aime')}
                  </button>
                  <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/15 bg-white text-black dark:bg-white/10 dark:text-white px-3 py-2 text-sm shadow-sm hover:bg-white/90 dark:hover:bg-white/15">
                    <Share2 className="h-4 w-4" />
                    Partager
                  </button>
                  <button onClick={toggleDetails} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--restaurant-primary))] text-white px-3 py-2 text-sm shadow-sm hover:brightness-105">
                    <Info className="h-4 w-4" />
                    Détails
                  </button>
                </div>
              </div>

              {/* Inline details popup */}
              {detailsOpen && (
                <div className="absolute bottom-24 right-4 w-[min(90vw,420px)] rounded-2xl border border-black/10 dark:border-white/15 bg-white/95 dark:bg-neutral-900/95 text-foreground shadow-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold mb-1">{activeItem?.title || 'Détails de la photo'}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {activeItem?.description || 'Image de notre univers culinaire.'}
                      </div>
                    </div>
                    <button onClick={() => setDetailsOpen(false)} aria-label="Fermer les détails" className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/70">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-[380px] sm:h-[460px] md:h-[500px] w-full overflow-hidden">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
        {/* Mobile hint */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white shadow-sm sm:hidden">
          Glissez pour explorer
        </div>
      </div>
    </motion.div>
  )
}

export { ThreeDPhotoCarousel };
