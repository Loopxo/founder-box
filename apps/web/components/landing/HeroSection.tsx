'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
    { id: '01', name: 'daily proof' },
    { id: '02', name: 'revenue attempts' },
    { id: '03', name: 'shipped outputs' },
    { id: '04', name: 'outreach methods' },
    { id: '05', name: 'work sessions' },
    { id: '06', name: 'product progress' },
    { id: '07', name: 'weekly reports' },
    { id: '08', name: 'founder tools' },
    { id: '09', name: 'mcp agents' }
];

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-[100svh] min-h-[600px] sm:min-h-[650px] w-full bg-[#111118] overflow-hidden flex flex-col pt-4 sm:pt-8 pb-4">

            {/* Background Grid Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="h-full w-full max-w-7xl mx-auto border-r border-l border-white/5 grid grid-cols-4">
                    <div className="border-r border-white/5 h-full" />
                    <div className="border-r border-white/5 h-full" />
                    <div className="border-r border-white/5 h-full" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">

                {/* Top Info */}
                <div className="flex justify-between items-start pt-6 border-b border-white/10 pb-4">
                    <div className="flex flex-col">
                        <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest">Accountability OS</span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={currentIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="font-mono text-xs sm:text-sm text-[#EDE9DC] uppercase mt-1"
                            >
                                {features[currentIndex].id} / {features[currentIndex].name}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    <div className="hidden sm:flex flex-col items-end">
                        <span className="font-mono text-xs text-[#9E9880] uppercase tracking-widest">System</span>
                        <span className="font-mono text-sm text-[#EDE9DC] uppercase mt-1">FounderBox v2.0</span>
                    </div>
                </div>

                {/* Main Title */}
                <div className="flex-1 flex items-center">
                    <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.85] tracking-tighter text-[#EDE9DC]">
                        <span className="block">PROVE</span>
                        <span className="block text-transparent stroke-text hover:text-[#D4A853] transition-colors duration-500 cursor-default">WHAT</span>
                        <span className="block pl-4 sm:pl-8 md:pl-16 lg:pl-32">YOU</span>
                        <span className="block text-right">DID.</span>
                    </h1>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-end border-t border-white/10 pt-4 sm:pt-6 mt-2 sm:mt-4">
                    <div>
                        <p className="font-mono text-xs sm:text-sm text-[#9E9880] leading-relaxed max-w-lg mb-4 sm:mb-6">
                            FounderBox tracks revenue attempts, shipped outputs, outreach experiments, work sessions, product progress, and weekly proof for solo operators.
                        </p>
                        <Link
                            href="/accountability/today"
                            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors duration-300 rounded-sm"
                        >
                            Start Free
                        </Link>
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
