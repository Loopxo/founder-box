'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const toolkitItems = [
    {
        id: '01',
        title: "Contracts",
        description: "Iron-clad agreements",
        status: "Live",
        category: "Legal",
        image: "/image/contracts.png",
        link: "/contract"
    },
    {
        id: '02',
        title: "Invoices",
        description: "Professional billing",
        status: "Live",
        category: "Finance",
        image: "/image/invoices.png",
        link: "/invoice"
    },
    {
        id: '03',
        title: "Proposals",
        description: "Winning pitches",
        status: "Live",
        category: "Sales",
        image: "/image/proposals.png",
        link: "/dashboard/proposal"
    },
    {
        id: '04',
        title: "Cold Emails",
        description: "Targeted outreach",
        status: "Live",
        category: "Growth",
        image: "/image/cold-email.png",
        link: "/cold-emails"
    },
    {
        id: '05',
        title: "Resume Builder",
        description: "ATS-optimized profiles",
        status: "Live",
        category: "Career",
        image: "/image/resume.png",
        link: "/resume"
    },
    {
        id: '06',
        title: "Competitive Analysis",
        description: "Market intelligence",
        status: "Beta",
        category: "Strategy",
        image: "/image/competetive-analysis.png",
        link: "/dashboard" // Placeholder for future page
    }
];

import { ParallaxImage } from '@/components/ui/ParallaxImage';

function ToolkitCard({ item, index }: { item: typeof toolkitItems[0]; index: number }) {
    return (
        <motion.div
            className="group relative w-full aspect-video sm:aspect-[4/5] bg-[#18181F] border border-[#2A2A38] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <Link href={item.link} className="block h-full w-full relative">
                {/* Image Layer */}
                <div className="absolute inset-0 z-0">
                    <ParallaxImage
                        src={item.image}
                        alt={item.title}
                        fill
                        className="group-hover:scale-105 opacity-50 group-hover:opacity-80 transition-all duration-700"
                        containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-[#111118]/60 group-hover:bg-[#111118]/20 transition-colors duration-500 z-10 pointer-events-none" />
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">

                    {/* Top: ID & Category */}
                    <div className="flex justify-between items-start opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="font-mono text-xs text-[#D4A853] uppercase tracking-wider">{item.id}</span>
                        <span className="font-mono text-xs text-[#EDE9DC]/80 uppercase tracking-wider border border-[#2A2A38] bg-[#111118]/80 px-2 py-1 rounded-sm">{item.category}</span>
                    </div>

                    {/* Bottom: Title & Details */}
                    <div>
                        <h3 className="font-sans text-2xl text-[#EDE9DC] font-bold mb-2 group-hover:text-[#D4A853] transition-colors duration-300">
                            {item.title}
                        </h3>
                        <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                            <div className="pt-4 border-t border-[#2A2A38] flex justify-between items-center bg-[#111118]/80 -mx-6 px-6 pb-2 backdrop-blur-sm">
                                <span className="font-mono text-xs text-[#9E9880] uppercase">{item.description}</span>
                                <span className="font-mono text-xs text-[#D4A853] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4D9E6A]"></span>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function ProjectsSection() {
    return (
        <section className="py-24 bg-[#111118] border-t border-[#2A2A38]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#2A2A38] pb-6">
                    <div>
                        <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-4 block">
                            02 / The Arsenal
                        </span>
                        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC]">
                            EVERYTHING YOU <br />
                            NEED TO SCALE.
                        </h2>
                    </div>

                    <Link href="/dashboard" className="hidden md:block">
                        <span className="font-mono text-xs text-[#9E9880] uppercase tracking-widest hover:text-[#D4A853] transition-colors">
                            Open Dashboard &rarr;
                        </span>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {toolkitItems.map((item, index) => (
                        <ToolkitCard key={index} item={item} index={index} />
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="mt-12 md:hidden">
                    <Link href="/dashboard" className="block w-full text-center py-4 border border-[#2A2A38] text-xs font-mono uppercase text-[#9E9880] hover:bg-[#18181F] hover:text-[#EDE9DC] transition-colors rounded-sm">
                        Open Dashboard
                    </Link>
                </div>

            </div>
        </section>
    );
}
