'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
    return (
        <section id="about" className="py-24 sm:py-32 bg-[#111118] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Title & Label */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="sticky top-32"
                        >
                            <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-4 block">
                                01 / The Problem
                            </span>
                            <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC] leading-tight mb-8">
                                THE UNFAIR <br />
                                ADVANTAGE.
                            </h2>
                            <div className="w-12 h-[1px] bg-[#D4A853]" />
                        </motion.div>
                    </div>

                    {/* Right Column: Content & Statistics */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <p className="font-sans text-xl sm:text-2xl text-[#EDE9DC] font-light leading-relaxed mb-8">
                                Business isn&apos;t just about building great products; it&apos;s about defining the system that scales them. Since day one, founders waste countless hours on administrative friction instead of pure execution.
                            </p>
                            <p className="font-mono text-sm text-[#9E9880] leading-relaxed max-w-2xl">
                                Our methodology is subtractive. We remove the unnecessary context switching tools to reveal the essential workflow. Every contract, proposal, and invoice is calculated to create a sense of permanence in a fast-paced ecosystem.
                            </p>
                        </motion.div>

                        {/* Image Grid */}
                        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <motion.div
                                className="relative aspect-[3/4] bg-[#18181F] rounded-lg overflow-hidden border border-[#2A2A38]"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=1067&fit=crop&auto=format&q=80"
                                    alt="Dashboard Data"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-700"
                                />
                            </motion.div>

                            <div className="flex flex-col justify-end space-y-8">
                                {/* Stats */}
                                <motion.div
                                    className="border-l border-[#2A2A38] pl-8"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    viewport={{ once: true }}
                                >
                                    <span className="block font-sans text-6xl font-bold text-[#EDE9DC] mb-2">12+</span>
                                    <span className="font-mono text-xs text-[#9E9880] uppercase tracking-widest">
                                        Hours Saved Weekly
                                    </span>
                                </motion.div>

                                <motion.div
                                    className="border-l border-[#2A2A38] pl-8"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <span className="block font-sans text-6xl font-bold text-[#D4A853] mb-2">100%</span>
                                    <span className="font-mono text-xs text-[#9E9880] uppercase tracking-widest">
                                        Professional Output
                                    </span>
                                </motion.div>

                                <motion.div
                                    className="relative aspect-square bg-[#18181F] border border-[#2A2A38] rounded-lg overflow-hidden mt-8"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop&auto=format&q=80"
                                        alt="Founder working"
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-[#111118]/40 flex items-center justify-center">
                                        <span className="font-mono text-xs text-[#D4A853] rotate-90 tracking-widest font-bold">FOUNDER OS</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
