'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
    {
        id: '01',
        name: 'contracts & legal',
        type: 'operations',
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=1080&fit=crop&auto=format&q=80"
    },
    {
        id: '02',
        name: 'invoicing & billing',
        type: 'finance',
        image: "https://images.unsplash.com/photo-1620912189866-474843bb5ebf?w=1920&h=1080&fit=crop&auto=format&q=80"
    },
    {
        id: '03',
        name: 'proposals & pitch',
        type: 'sales',
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop&auto=format&q=80"
    },
    {
        id: '04',
        name: 'cold emails & outreach',
        type: 'growth',
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1920&h=1080&fit=crop&auto=format&q=80"
    }
];

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen min-h-[700px] w-full bg-[#111118] overflow-hidden flex flex-col pt-20">

            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.25 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src={features[currentIndex].image}
                            alt={features[currentIndex].name}
                            fill
                            priority
                            className="object-cover grayscale"
                        />
                        {/* Dark Studio overlay for text contrast */}
                        <div className="absolute inset-0 bg-[#111118]/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="h-full w-full max-w-7xl mx-auto border-r border-l border-white/5 grid grid-cols-4">
                    <div className="border-r border-white/5 h-full" />
                    <div className="border-r border-white/5 h-full" />
                    <div className="border-r border-white/5 h-full" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">

                {/* Top Info */}
                <div className="flex justify-between items-start pt-12 border-b border-white/10 pb-4">
                    <div className="flex flex-col">
                        <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest">Founder Toolkit</span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={currentIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="font-mono text-sm text-[#EDE9DC] uppercase mt-1"
                            >
                                {features[currentIndex].id} / {features[currentIndex].name}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    <div className="hidden sm:flex flex-col items-end">
                        <span className="font-mono text-xs text-[#9E9880] uppercase tracking-widest">System</span>
                        <span className="font-mono text-sm text-[#EDE9DC] uppercase mt-1">FounderBox v1.0</span>
                    </div>
                </div>

                {/* Main Title */}
                <div className="flex-1 flex items-center">
                    <h1 className="font-sans text-5xl sm:text-7xl lg:text-9xl font-bold leading-[0.85] tracking-tighter text-[#EDE9DC] mix-blend-plus-lighter">
                        <span className="block">TURNING</span>
                        <span className="block text-transparent stroke-text hover:text-[#D4A853] transition-colors duration-500 cursor-default">CHAOS</span>
                        <span className="block pl-12 sm:pl-32">INTO</span>
                        <span className="block text-right">EMPIRES.</span>
                    </h1>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-t border-white/10 pt-8">
                    <div>
                        <p className="font-mono text-sm text-[#9E9880] leading-relaxed whitespace-nowrap max-w-lg whitespace-normal">
                            The ultimate operating system for agency owners and independent founders. Craft proposals, close contracts, and send invoices with absolute precision.
                        </p>
                    </div>
                </div>

            </div>

            <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        .stroke-text:hover {
          -webkit-text-stroke: 1px #D4A853;
        }
      `}</style>
        </section>
    );
}
