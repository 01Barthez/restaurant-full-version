import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { galleryItems } from '@/data/galleryItems.data'
import { ThreeDPhotoCarousel } from '../ui/3d-carousel'
import { features } from '@/data/features.data'

const FeaturesSection = () => {
    const photos = galleryItems.slice(0, 2)

    const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const [visible, setVisible] = useState<boolean[]>(Array(features.length).fill(false))

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const idx = Number((entry.target as HTMLElement).dataset.index)
                    if (entry.isIntersecting) {
                        setVisible((prev) => {
                            if (prev[idx]) return prev
                            const next = [...prev]
                            next[idx] = true
                            return next
                        })
                    }
                })
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        )

        cardRefs.current.forEach((el) => el && obs.observe(el))
        return () => obs.disconnect()
    }, [])

    return (
        <section className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
            {/* Radiant, patterned background */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient (theme aware, radiant but not overpowering) */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-white dark:from-neutral-950 dark:via-slate-900 dark:to-black" />
                {/* Radiant glows */}
                <div className="absolute inset-0 opacity-70 dark:opacity-60 [background:radial-gradient(60rem_60rem_at_20%_10%,rgba(255,166,0,0.12),transparent_60%),radial-gradient(50rem_40rem_at_80%_10%,rgba(255,215,130,0.08),transparent_60%)]" />
                {/* Subtle grid pattern with mask */}
                <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] [background-image:linear-gradient(to_right,rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.12)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            </div>

            <div className="text-center mb-12">
                <h2 className="title text-restaurant-dark mb-4">
                    Pourquoi nous choisir ?
                </h2>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
                    {/* Left: Feature Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 content-start">
                        {features.map((f, i) => (
                            <Card
                                key={f.title}
                                ref={(el) => {
                                    cardRefs.current[i] = el
                                }}
                                data-index={i}
                                className={
                                    `group col-span-1 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/15 text-foreground p-5 sm:p-6 lg:p-8 rounded-2xl ` +
                                    `transition-all duration-500 will-change-transform ` +
                                    `hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 hover:ring-2 hover:ring-[hsl(var(--restaurant-primary))] ` +
                                    `${i % 2 === 1 ? 'mt-6' : ''} ` +
                                    `${visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
                                }
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <CardContent className="text-center space-y-3 sm:space-y-4">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${f.tile} rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-3 transition-transform duration-300`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="font-bold text-base sm:text-lg">{f.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{f.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Right: Photo Frame / Collage */}
                    <div className="relative min-h-[320px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[520px] flex items-center justify-center">
                        <ThreeDPhotoCarousel />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection