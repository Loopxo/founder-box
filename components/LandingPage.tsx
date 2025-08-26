"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Zap, 
  Shield, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Github,
  Globe,
  FileText,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Instagram,
  Mail
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                FounderBox
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
            <Github className="w-4 h-4 mr-2" />
            Open Source • Free Forever
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Complete
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"> Founder Toolkit</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to grow your business. Professional proposals, marketing copy, 
            contracts, and more - all in one place. Built by founders, for founders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/your-repo/founder-box" target="_blank">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                <Github className="mr-2 w-5 h-5" />
                View on GitHub
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10+</div>
              <div className="text-gray-600">Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-gray-600">Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">∞</div>
              <div className="text-gray-600">Unlimited</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From proposal generation to social media content, we've got you covered with 
              professional templates and AI-powered tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Proposal Generator</CardTitle>
                <CardDescription>
                  Create stunning, professional proposals with customizable themes and branding
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Cold Email Templates</CardTitle>
                <CardDescription>
                  High-converting email templates for outreach and lead generation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Contract Templates</CardTitle>
                <CardDescription>
                  Legal contract templates for clients, employees, and partnerships
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Invoice Generator</CardTitle>
                <CardDescription>
                  Professional invoice templates with automatic calculations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>SEO Content</CardTitle>
                <CardDescription>
                  SEO-optimized content templates for blogs and websites
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Engaging social media content for all platforms
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Founders Choose FounderBox
            </h2>
            <p className="text-xl text-gray-600">
              Built by entrepreneurs who understand the challenges of growing a business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate professional documents in minutes, not hours. 
                Focus on what matters most - growing your business.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Free</h3>
              <p className="text-gray-600">
                No hidden fees, no premium tiers, no credit card required. 
                Everything is completely free and open source.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Built and maintained by the founder community. 
                Contribute, suggest features, and help others succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Business?
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Join thousands of founders who are already using FounderBox to grow their businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/your-repo/founder-box" target="_blank">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg">
                <Github className="mr-2 w-5 h-5" />
                Star on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
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
                <li><a href="https://github.com/your-repo/founder-box" target="_blank" className="hover:text-white">GitHub</a></li>
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
