'use client';

import { motion } from 'framer-motion';

const processSteps = [
    {
        number: '01',
        label: "Speed",
        description: "Execute in seconds what used to take hours. Instantly generate contracts, invoices, and proposals."
    },
    {
        number: '02',
        label: "Precision",
        description: "Eliminate human error with dynamic variables, auto-calculations, and bulletproof templates."
    },
    {
        number: '03',
        label: "Professionalism",
        description: "Every touchpoint with you looks like it came from a Fortune 500 company. Build instant trust."
    },
    {
        number: '04',
        label: "Leverage",
        description: "Scale yourself. A unified system that gives independent founders the output of a 5-person team."
    }
];

export default function WhyChooseUsSection() {
    return (
        <section className="py-24 bg-[#111118] border-t border-[#2A2A38]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#2A2A38] pb-6">
                    <div className="max-w-xl">
                        <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-4 block">
                            03 / The Value
                        </span>
                        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC]">
                            SPEED AND <br />
                            LEVERAGE.
                        </h2>
                    </div>
                    <p className="font-mono text-xs text-[#9E9880] uppercase tracking-widest mt-6 md:mt-0 max-w-xs text-right hidden md:block">
                        Built for independent execution
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 border-l border-[#2A2A38]">
                    {processSteps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="border-r border-b border-[#2A2A38] p-8 hover:bg-[#18181F] transition-colors duration-300 min-h-[300px] flex flex-col justify-between group"
                        >
                            <div className="font-mono text-xs text-[#9E9880] group-hover:text-[#D4A853] transition-colors">
                                ({step.number})
                            </div>

                            <div>
                                <h3 className="font-sans text-xl text-[#EDE9DC] font-medium mb-4 group-hover:text-white transition-colors">
                                    {step.label}
                                </h3>
                                <p className="font-mono text-xs text-[#9E9880] leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
