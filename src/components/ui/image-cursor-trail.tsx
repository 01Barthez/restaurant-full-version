import React, { createRef, useEffect, useRef, type ReactNode } from "react"

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

// Simple URL optimizer for Unsplash-hosted images
function optimizeSrc(src: string, width = 800, quality = 80) {
  if (src.includes("unsplash.com")) {
    const url = new URL(src)
    const params = url.searchParams
    // preserve existing but ensure required
    if (!params.has("auto")) params.set("auto", "format")
    params.set("fit", params.get("fit") || "crop")
    params.set("w", String(width))
    params.set("q", String(quality))
    return url.toString()
  }
  return src
}

interface ImageMouseTrailProps {
  items: string[]
  children?: ReactNode
  className?: string
  imgClass?: string
  distance?: number
  maxNumberOfImages?: number
  fadeAnimation?: boolean
}

function ImageCursorTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()))
  const currentZIndexRef = useRef(1)

  let globalIndex = 0
  let last = { x: 0, y: 0 }

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top
    image.style.left = `${relativeX}px`
    image.style.top = `${relativeY}px`

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1
    }
    image.style.zIndex = String(currentZIndexRef.current)
    currentZIndexRef.current++

    image.dataset.status = "active"
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive"
      }, 1500)
    }
    last = { x, y }
  }

  const distanceFromLast = (x: number, y: number) =>
    Math.hypot(x - last.x, y - last.y)

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive"
  }

  // Preload images to ensure they are available when the user moves the cursor
  useEffect(() => {
    const controllers: AbortController[] = []
    items.forEach((src) => {
      const img = new Image()
      const controller = new AbortController()
      controllers.push(controller)
      img.src = src
    })
    return () => {
      controllers.forEach((c) => c.abort())
    }
  }, [items])

  // Show one image at the center initially so the user sees the effect immediately
  useEffect(() => {
    const container = containerRef.current
    const first = refs.current[0]?.current
    if (container && first) {
      const rect = container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      activate(first as HTMLImageElement, cx, cy)
    }
    // no cleanup needed; the next move will manage states
  }, [])

  const handleOnMove = (clientX: number, clientY: number) => {
    if (distanceFromLast(clientX, clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex % refs.current.length].current
      const tail =
        refs.current[
          (globalIndex - maxNumberOfImages) % refs.current.length
        ]?.current
      if (lead) activate(lead, clientX, clientY)
      if (tail) deactivate(tail)
      globalIndex++
    }
  }

  return (
    <section
      onMouseMove={(e) => handleOnMove(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches && e.touches[0]
        if (t) handleOnMove(t.clientX, t.clientY)
      }}
      ref={containerRef}
      className={cn(
        "relative grid h-[600px] w-full place-content-center overflow-hidden rounded-lg",
        className
      )}
    >
      {items.map((item, index) => (
        <img
          key={index}
          className={cn(
            "opacity-0 data-[status='active']:ease-out-expo absolute -translate-x-[50%] -translate-y-[50%] scale-0 rounded-3xl object-cover transition-transform duration-300 data-[status='active']:scale-100 data-[status='active']:opacity-100 data-[status='active']:duration-500",
            imgClass
          )}
          data-index={index}
          data-status="inactive"
          src={optimizeSrc(item)}
          alt={`image-${index}`}
          ref={refs.current[index]}
          loading="lazy"
          decoding="async"
        />
      ))}
      {children}
    </section>
  )
}

export default function CursorTrailDemo() {
  const images = [
    // Reliable Unsplash Source endpoints (always return an image)
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1200&auto=format",
    
  ]

  return (
    <section className="relative w-full py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-950/80 dark:to-neutral-900">
      {/* Brand glow accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-40 bg-gradient-to-b from-restaurant.orange/20 to-transparent blur-[2px]" />
      <div className="pointer-events-none absolute -right-10 top-10 -z-0 h-56 w-56 rounded-full bg-restaurant-gradient opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-10 -z-0 h-56 w-56 rounded-full bg-restaurant-gold-gradient opacity-20 blur-3xl" />

      <div className="relative mx-auto flex w-full flex-col">
        {/* Centered overlay heading & description */}
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold font-playfair text-restaurant.dark dark:text-white tracking-tight drop-shadow">
              Saveurs africaines, expérience unique
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Découvrez une sélection raffinée de plats authentiques — un voyage culinaire entre épices, textures et traditions.
            </p>
          </div>
        </div>
        <ImageCursorTrail
          items={images}
          maxNumberOfImages={5}
          distance={25}
          imgClass="sm:w-40 w-28 sm:h-48 h-36 shadow-restaurant-lg"
          className="w-full"
          fadeAnimation
        />
        {/* Subtle bottom separator */}
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-restaurant.orange/40 to-transparent" />
      </div>
    </section>
  )
}
