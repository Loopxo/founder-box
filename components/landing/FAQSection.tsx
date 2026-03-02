'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Is FounderBox really free?",
        answer: "Yes. FounderBox is 100% free and open source under the MIT license. No credit card, no trial period, no feature gates. Every tool is available from day one — proposals, contracts, invoices, cold emails, resumes, and more."
    },
    {
        question: "What tools are included in FounderBox?",
        answer: "FounderBox includes nine professional tools: Proposal Generator, Contract Templates, Invoice Generator, Cold Email Templates, Resume Builder, SEO Content Tools, Sales Copy Generator, Social Media Content Creator, and Competitive Analysis Suite. All with multiple themes and PDF export."
    },
    {
        question: "Who built FounderBox?",
        answer: "FounderBox is built and maintained by Loopxo, a digital agency founded by Vijeet Shah. The project is open source and community-driven — contributions are welcome on GitHub."
    },
    {
        question: "How is FounderBox different from paid tools like Proposify or FreshBooks?",
        answer: "Paid alternatives charge $20-100+ per month for a single capability. FounderBox bundles 9+ professional tools into one free platform. Because it is open source, you own your data, can customize every template, and never worry about vendor lock-in."
    },
    {
        question: "Can I self-host FounderBox?",
        answer: "Absolutely. FounderBox is built with Next.js 15 and can be deployed to Vercel, Netlify, Railway, or any platform that supports Node.js. Clone the repo, add your environment variables, and deploy in minutes."
    },
    {
        question: "Do I need to create an account?",
        answer: "Dashboard features use Supabase authentication for a personalized experience, but many tools work without any sign-up. Creating an account is free and takes under 30 seconds."
    },
    {
        question: "Can I customize the templates and themes?",
        answer: "Yes. FounderBox ships with multiple professional themes — Dark Luxe, Minimal Elegance, Geometric Futurism, Corporate Modern, and Magazine Style. Every template, color, and layout is customizable through the code or the built-in UI."
    },
    {
        question: "Is my data safe?",
        answer: "FounderBox uses Supabase for authentication and data storage with row-level security. Because it is open source, you can audit the code yourself or self-host for complete data ownership."
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
