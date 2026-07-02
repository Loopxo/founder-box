'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Is FounderBox really free?",
        answer: "Yes. FounderBox keeps the web toolkit free and adds a free hosted MCP tier. Hosted usage has fair limits to protect infrastructure, and self-hosting can be unlimited."
    },
    {
        question: "What tools are included in FounderBox?",
        answer: "FounderBox includes Dashboard, Launchpath Atlas, Startup Lens, Proposal Generator, Cold Emails, Competitive Analysis, Contracts, Invoices, SEO Content, Sales Copy, Social Media, and Resume Forge."
    },
    {
        question: "Who built FounderBox?",
        answer: "FounderBox is built and maintained by Loopxo, a digital agency founded by Vijeet Shah. The project is open source and community-driven — contributions are welcome on GitHub."
    },
    {
        question: "How is FounderBox different from paid tools like Proposify or FreshBooks?",
        answer: "FounderBox is becoming an MCP server plus AI skills library, not only a web app. That means founders can use the same tools directly inside Claude, Cursor, Codex, Windsurf, and other compatible agents."
    },
    {
        question: "Can I self-host FounderBox?",
        answer: "Yes. The new workspace splits the web app, MCP server, shared core logic, and skill package so self-hosting can run the full stack with Postgres and local artifact storage."
    },
    {
        question: "Do I need to create an account?",
        answer: "You need a free email OTP login only to create hosted API keys and view account usage. The hosted dashboard uses Resend OTP and HTTP-only sessions."
    },
    {
        question: "Can I customize the templates and themes?",
        answer: "Yes. FounderBox ships with multiple professional themes — Dark Luxe, Minimal Elegance, Geometric Futurism, Corporate Modern, and Magazine Style. Every template, color, and layout is customizable through the code or the built-in UI."
    },
    {
        question: "Is my data safe?",
        answer: "OTP codes and API keys are stored as hashes, not plaintext. Generated artifacts expire on the hosted tier, and self-hosting gives you full control over storage."
    }
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="border-b border-[#2A2A38]"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left py-6 flex justify-between items-center group cursor-pointer"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#9E9880] group-hover:text-[#D4A853] transition-colors">
                        ({String(index + 1).padStart(2, '0')})
                    </span>
                    <span className="font-sans text-base sm:text-lg text-[#EDE9DC] group-hover:text-white transition-colors pr-4">
                        {faq.question}
                    </span>
                </span>
                <span className={`font-mono text-lg text-[#D4A853] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    +
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="font-mono text-sm text-[#9E9880] leading-relaxed pb-6 pl-12 pr-8 max-w-3xl">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQSection() {
    return (
        <section className="py-24 bg-[#111118] border-t border-[#2A2A38]" id="faq" aria-label="Frequently asked questions about FounderBox">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-16 border-b border-[#2A2A38] pb-6">
                    <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-4 block">
                        04 / FAQ
                    </span>
                    <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC]">
                        COMMON <br />
                        QUESTIONS.
                    </h2>
                </div>

                {/* FAQ Items */}
                <div className="border-t border-[#2A2A38]">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
}
