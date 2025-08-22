"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";

interface BackgroundCirclesProps {
    title?: string;
    description?: string;
    className?: string;
    variant?: keyof typeof COLOR_VARIANTS;
}

const COLOR_VARIANTS = {
    // App brand-aligned variant (uses restaurant theme colors)
    brand: {
        border: [
            "border-restaurant-gold/60",
            "border-restaurant-orange/50",
            "border-slate-600/30",
        ],
        gradient: "from-restaurant-gold/30",
    },
    primary: {
        border: [
            "border-emerald-500/60",
            "border-cyan-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-emerald-500/30",
    },
    secondary: {
        border: [
            "border-violet-500/60",
            "border-fuchsia-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-violet-500/30",
    },
    tertiary: {
        border: [
            "border-orange-500/60",
            "border-yellow-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-orange-500/30",
    },
    quaternary: {
        border: [
            "border-purple-500/60",
            "border-pink-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-purple-500/30",
    },
    quinary: {
        border: [
            "border-red-500/60",
            "border-rose-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-red-500/30",
    }, // red
    senary: {
        border: [
            "border-blue-500/60",
            "border-sky-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-blue-500/30",
    }, // blue
    septenary: {
        border: [
            "border-gray-500/60",
            "border-gray-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-gray-500/30",
    },
    octonary: {
        border: [
            "border-red-500/60",
            "border-rose-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-red-500/30",
    },
} as const;

const AnimatedGrid = () => (
    <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
        animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
        }}
    >
        <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-20" />
    </motion.div>
);

export function BackgroundCircles({
    title = "",
    description = "",
    className,
    // Default to brand to match application theme automatically
    variant = "brand",
}: BackgroundCirclesProps) {
    const variantStyles = COLOR_VARIANTS[variant];

    const variants = Object.keys(
        COLOR_VARIANTS
    ) as (keyof typeof COLOR_VARIANTS)[];

    return (
        <div
            className={clsx(
                // Responsive height to fit smaller screens gracefully
                "relative flex h-[52vh] sm:h-[60vh] md:h-[70vh] lg:h-screen w-full items-center justify-center overflow-hidden",
                className
            )}
        >
            <AnimatedGrid />
            {/* Responsive circle wrapper size */}
            <motion.div className="absolute w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={clsx(
                            "absolute inset-0 rounded-full",
                            "border-2 bg-gradient-to-br to-transparent",
                            variantStyles.border[i],
                            variantStyles.gradient
                        )}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05 + i * 0.05, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className={clsx(
                                "absolute inset-0 rounded-full mix-blend-screen",
                                `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient.replace(
                                    "from-",
                                    ""
                                )}/10%,transparent_70%)]`
                            )}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
            </motion.div>

            {/* Themed soft glows with dark mode tuning */}
            <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)] pointer-events-none">
                <div className="absolute inset-0 blur-[120px] bg-[radial-gradient(ellipse_at_center,theme('colors.restaurant.gold')/0.15_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,theme('colors.restaurant.gold')/0.08_0%,transparent_70%)]" />
                <div className="absolute inset-0 blur-[80px] bg-[radial-gradient(ellipse_at_center,theme('colors.restaurant.orange')/0.12_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,theme('colors.restaurant.orange')/0.06_0%,transparent_70%)]" />
            </div>
        </div>
    );
}

export function DemoCircles() {
    const [currentVariant, setCurrentVariant] =
        useState<keyof typeof COLOR_VARIANTS>("octonary");

    const variants = Object.keys(
        COLOR_VARIANTS
    ) as (keyof typeof COLOR_VARIANTS)[];

    function getNextVariant() {
        const currentIndex = variants.indexOf(currentVariant);
        const nextVariant = variants[(currentIndex + 1) % variants.length];
        return nextVariant;
    }

    return (
        <>
            <BackgroundCircles variant={currentVariant} />
        </>
    );
}
