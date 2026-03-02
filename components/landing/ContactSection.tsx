'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactSection() {
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
                            Ready to take your freelance business or agency to the next level? Our entire toolkit is 100% free forever. No credit card required.
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

                    {/* Right: CTA */}
                    <div className="flex flex-col justify-center items-start border border-[#2A2A38] p-8 sm:p-12 bg-[#18181F] rounded-sm">
                        <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#EDE9DC] mb-4">Unlimited Access</h3>
                        <p className="font-mono text-sm text-[#9E9880] mb-8 leading-relaxed max-w-sm">
                            Start using Contracts, Invoices, Proposals, Cold Emails, and Resume Builder today. Completely free, forever.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex w-full md:w-auto items-center justify-center px-12 py-4 bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors duration-300 rounded-sm"
                        >
                            Start Free Forever
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
}
