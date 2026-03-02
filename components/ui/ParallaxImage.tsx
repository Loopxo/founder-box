'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image, { ImageProps } from 'next/image';

interface ParallaxImageProps extends Omit<ImageProps, 'className'> {
    className?: string;
    containerClassName?: string;
}

export function ParallaxImage({
    src,
    alt,
    className = "",
    containerClassName = "",
    ...props
}: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax Logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Transform Y range: moves image slightly within container
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${containerClassName}`}
        >
            <motion.div
                style={{ y }}
                className="relative w-full h-[120%] -top-[10%]" // Extra height for parallax movement
            >
                <motion.div
                    className="w-full h-full relative"
                    initial={{ filter: "grayscale(100%)" }}
                    whileInView={{ filter: "grayscale(0%)" }}
                    viewport={{ once: false, margin: "-25% 0px -25% 0px" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <Image
                        src={src}
                        alt={alt}
                        className={`object-cover ${className}`}
                        {...props}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
