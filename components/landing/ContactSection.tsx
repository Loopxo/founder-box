'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactSection() {
    const [email, setEmail] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
        setEmail('');
    };

    return (
        <section className="py-24 bg-[#111118] border-t border-[#2A2A38]" id="contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[#2A2A38] pb-6">
                    <div>
                        <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-4 block">
                            04 / Next Steps
                        </span>
                        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC]">
                            START <br />
                            BUILDING.
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        <p className="font-sans text-lg text-[#9E9880] leading-relaxed max-w-md">
                            Ready to take your freelance business or agency to the next level? Join the private beta and get access to the founder toolkit.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <span className="font-mono text-xs text-[#D4A853] uppercase tracking-widest block mb-2">Support</span>
                                <a href="mailto:hello@founderbox.com" className="font-sans text-xl text-[#EDE9DC] hover:text-[#D4A853] transition-colors">
                                    hello@founderbox.com
                                </a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href="/dashboard" className="font-mono text-xs text-[#9E9880] hover:text-[#D4A853] transition-colors">→ DASHBOARD</Link>
                                <Link href="/contract" className="font-mono text-xs text-[#9E9880] hover:text-[#D4A853] transition-colors">→ CONTRACTS</Link>
                                <Link href="/invoice" className="font-mono text-xs text-[#9E9880] hover:text-[#D4A853] transition-colors">→ INVOICES</Link>
                                <Link href="/cold-emails" className="font-mono text-xs text-[#9E9880] hover:text-[#D4A853] transition-colors">→ COLD EMAILS</Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="group">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="ENTER EMAIL FOR BETA ACCESS"
                                    className="w-full bg-transparent border-b border-[#2A2A38] py-4 font-mono text-sm text-[#EDE9DC] focus:outline-none focus:border-[#D4A853] transition-colors placeholder:text-[#9E9880]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full md:w-auto px-12 py-4 bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors duration-300 rounded-sm"
                            >
                                Join Waitlist
                            </button>

                            {showSuccessMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-[#4D9E6A]/10 border border-[#4D9E6A]/20 text-[#4D9E6A] font-mono text-xs rounded-sm"
                                >
                                    You're on the list. We'll be in touch soon.
                                </motion.div>
                            )}
                        </form>
                    </div>

                </div>

            </div>
        </section>
    );
}
