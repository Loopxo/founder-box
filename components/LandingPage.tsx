"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  GitFork,
  FileText,
  MessageSquare,
  TrendingUp,
  Share2,
  Mail,
  Rocket,
  Target,
  Flame,
  Sparkles,
  Timer
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
   
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="FounderBox Logo" 
                width={40} 
                height={40} 
                className="rounded-lg"
              />
              <span className="text-2xl font-black bg-gradient-to-r from-electric-blue via-neon-orange to-electric-violet bg-clip-text text-transparent font-inter">
                FounderBox
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white font-bold shadow-lg shadow-electric-blue/25 hover:shadow-electric-blue/40 transition-all duration-300">
                  Start Using Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-electric-blue/20 text-electric-blue border-electric-blue/30 font-bold animate-pulse">
          • FREE FOREVER •
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 font-inter leading-tight">
            IGNITE YOUR
            <span className="bg-gradient-to-r from-electric-blue via-neon-orange to-electric-violet bg-clip-text text-transparent animate-pulse"> STARTUP</span>
            <br />MISSION
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto font-medium">
            Launch faster than ever with our arsenal of founder tools. From killer proposals to viral content — 
            we've got the fuel for your rocket ship. Ready for liftoff?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white px-12 py-6 text-xl font-black shadow-2xl shadow-electric-blue/30 hover:shadow-electric-blue/50 transition-all duration-300 animate-pulse">
                 LAUNCH NOW
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/Loopxo/founder-box" target="_blank">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-slate-900 font-bold transition-all duration-300">
                <GitFork className="mr-2 w-5 h-5" />
                 STAR MISSION
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl font-black text-electric-blue animate-pulse">8+</div>
              <div className="text-slate-400 font-bold">TOOLS</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-neon-orange animate-pulse">100%</div>
              <div className="text-slate-400 font-bold">FREE</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-electric-violet animate-pulse">∞</div>
              <div className="text-slate-400 font-bold">UNLIMITED</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-electric-blue animate-pulse">24/7</div>
              <div className="text-slate-400 font-bold">ACCESS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-electric-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-neon-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-electric-violet/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 font-inter">
              🚀 MISSION CONTROL CENTER
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium">
              Power up your startup with our arsenal of founder weapons. Each tool is designed to 
              accelerate your growth and dominate your market.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-6 auto-rows-fr max-w-7xl mx-auto">
            {/* Proposal Launcher - Large Featured Card */}
            <Link href="/dashboard/proposal" className="group md:col-span-6 lg:col-span-4 md:row-span-2">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-electric-blue/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-electric-blue group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-col justify-center text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-electric-violet rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-electric-blue/30">
                    <Rocket className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-electric-blue transition-colors text-white font-black text-2xl mb-4">PROPOSAL LAUNCHER</CardTitle>
                  <CardDescription className="text-slate-300 text-lg">
                    Launch killer proposals that convert. Built for founders who close deals fast.
                  </CardDescription>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-electric-blue font-black text-base flex items-center justify-center animate-pulse">
                      IGNITE <Flame className="ml-2 w-5 h-5" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Email Sniper - Medium Card */}
            <Link href="/cold-emails" className="group md:col-span-3 lg:col-span-2">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-neon-orange/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-neon-orange group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-col justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-orange to-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-neon-orange/25">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-neon-orange transition-colors text-white font-black text-lg mb-2">EMAIL SNIPER</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    Precision outreach that hits every target.
                  </CardDescription>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-neon-orange font-black text-xs flex items-center justify-center animate-pulse">
                      FIRE <Target className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Armor Forge - Medium Card */}
            <Link href="/contract" className="group md:col-span-3 lg:col-span-2">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-electric-violet/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-electric-violet group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-col justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-electric-violet to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-electric-violet/25">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-electric-violet transition-colors text-white font-black text-lg mb-2">ARMOR FORGE</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    Bulletproof contracts that protect your mission.
                  </CardDescription>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-electric-violet font-black text-xs flex items-center justify-center animate-pulse">
                      SHIELD <Shield className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Cash Cannon - Wide Card */}
            <Link href="/invoice" className="group md:col-span-6 lg:col-span-4">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-neon-orange/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-neon-orange group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-row items-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-orange to-yellow-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-neon-orange/25">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-neon-orange transition-colors text-white font-black text-lg mb-2">CASH CANNON</CardTitle>
                    <CardDescription className="text-slate-300 text-sm">
                      Fire invoices that get paid fast. Automatic calculations, maximum impact.
                    </CardDescription>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-neon-orange font-black text-xs animate-pulse">
                      CHARGE
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Traffic Booster - Square Card */}
            <Link href="/seo" className="group md:col-span-3 lg:col-span-2">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-electric-blue/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-electric-blue group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-col justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-cyan-400 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-electric-blue/25">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-electric-blue transition-colors text-white font-black text-lg mb-2">TRAFFIC BOOSTER</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    SEO content that ranks #1.
                  </CardDescription>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-electric-blue font-black text-xs flex items-center justify-center animate-pulse">
                      BOOST <TrendingUp className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Sales Accelerator - Square Card */}
            <Link href="/sales" className="group md:col-span-3 lg:col-span-2">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-pink-500 group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-col justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-pink-500 transition-colors text-white font-black text-lg mb-2">SALES ACCELERATOR</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    Copy that converts browsers into buyers instantly.
                  </CardDescription>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-pink-500 font-black text-xs flex items-center justify-center animate-pulse">
                      CONVERT <Flame className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Viral Engine - Wide Card */}
            <Link href="/social-media-content" className="group md:col-span-6 lg:col-span-4">
              <Card className="h-full border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-electric-violet/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02] group-hover:border-electric-violet group-hover:bg-slate-800/70">
                <CardHeader className="h-full flex flex-row items-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-electric-violet to-pink-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-electric-violet/25">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-electric-violet transition-colors text-white font-black text-lg mb-2">VIRAL ENGINE</CardTitle>
                    <CardDescription className="text-slate-300 text-sm">
                      Content that explodes across platforms. Turn your brand into a movement.
                    </CardDescription>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-electric-violet font-black text-xs animate-pulse">
                      VIRAL
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>

           
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-electric-blue/5 via-transparent to-neon-orange/5"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-electric-violet/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 font-inter relative z-10">
              WHY FOUNDERS CHOOSE US
            </h2>
            <p className="text-xl text-slate-300 font-medium relative z-10">
              Built by startup warriors who've been in the trenches. We know what it takes to win.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-electric-violet rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-electric-blue/25 animate-pulse">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">ROCKET SPEED</h3>
              <p className="text-slate-300 font-medium">
                Launch products in minutes, not months. 
                While competitors plan, you execute and dominate.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-neon-orange to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-neon-orange/25 animate-pulse">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">ZERO COST</h3>
              <p className="text-slate-300 font-medium">
                Keep your runway intact. No subscriptions, no limits, no BS. 
                Pure startup fuel, completely free.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-electric-violet to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-electric-violet/25 animate-pulse">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">FOUNDER ARMY</h3>
              <p className="text-slate-300 font-medium">
                Join thousands of founders building the future. 
                Together we rise, together we dominate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-electric-blue/10 via-transparent to-electric-violet/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-inter">
            READY FOR LIFTOFF?
          </h2>
          <p className="text-xl text-slate-300 mb-12 font-medium max-w-2xl mx-auto">
            Join the founder revolution. Launch faster, grow bigger, dominate harder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/90 hover:to-electric-violet/90 text-white px-12 py-4 text-lg font-bold shadow-xl shadow-electric-blue/30 hover:shadow-electric-blue/50 transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <Rocket className="mr-2 w-5 h-5" />
                IGNITE MISSION
              </Button>
            </Link>
            
            <Link href="https://github.com/Loopxo/founder-box" target="_blank">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-slate-900 px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-electric-blue/20 hover:shadow-electric-blue/40 bg-slate-900/50 backdrop-blur-sm"
              >
                <GitFork className="mr-2 w-5 h-5" />
                STAR MISSION
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/logo.png" 
                  alt="FounderBox Logo" 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">FounderBox</span>
              </div>
              <p className="text-gray-400">
                The complete toolkit for founders. Free, open source, and community-driven.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard/proposal" className="hover:text-white">Proposal Generator</Link></li>
                <li><Link href="/cold-emails" className="hover:text-white">Cold Emails</Link></li>
                <li><Link href="/contract" className="hover:text-white">Contracts</Link></li>
                <li><Link href="/invoice" className="hover:text-white">Invoices</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/seo" className="hover:text-white">SEO Content</Link></li>
                <li><Link href="/sales" className="hover:text-white">Sales Copy</Link></li>
                <li><Link href="/social-media-content" className="hover:text-white">Social Media</Link></li>
                <li><Link href="/competitive-analysis" className="hover:text-white">Analysis</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/Loopxo/founder-box" target="_blank" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FounderBox. Made with ❤️ by founders, for founders.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
