"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  MessageSquare, 
  Shield, 
  Mail, 
  TrendingUp, 
  Share2, 
  BarChart3,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

export default function DashboardPage() {

  const tools = [
    {
      title: 'Proposal Generator',
      description: 'Create stunning, professional proposals',
      icon: FileText,
      href: '/dashboard/proposal',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Cold Emails',
      description: 'High-converting email templates',
      icon: MessageSquare,
      href: '/cold-emails',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Contracts',
      description: 'Legal contract templates',
      icon: Shield,
      href: '/contract',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Invoices',
      description: 'Professional invoice templates',
      icon: Mail,
      href: '/invoice',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'SEO Content',
      description: 'SEO-optimized content templates',
      icon: TrendingUp,
      href: '/seo',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Sales Copy',
      description: 'High-converting sales copy',
      icon: BarChart3,
      href: '/sales',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Social Media',
      description: 'Engaging social media content',
      icon: Share2,
      href: '/social-media-content',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Competitive Analysis',
      description: 'Analyze your competition',
      icon: BarChart3,
      href: '/competitive-analysis',
      color: 'from-emerald-500 to-green-500'
    }
  ]

  return (
    <DashboardLayout>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, Founder! 👋
          </h1>
          <p className="text-slate-300">
            Ready to accelerate your business? Choose a tool to get started.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Tools Available</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-electric-violet rounded-lg flex items-center justify-center shadow-lg shadow-electric-blue/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Proposals Created</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-electric-violet rounded-lg flex items-center justify-center shadow-lg shadow-electric-blue/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Account Type</p>
                  <p className="text-2xl font-bold text-white">Free</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-neon-orange to-electric-violet rounded-lg flex items-center justify-center shadow-lg shadow-neon-orange/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Status</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="hover:shadow-xl hover:shadow-electric-blue/20 transition-all cursor-pointer bg-slate-900/90 backdrop-blur-sm border-slate-700 hover:border-electric-blue/50">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">{tool.title}</CardTitle>
                    <CardDescription className="text-sm text-slate-400">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/proposal">
              <Card className="hover:shadow-xl hover:shadow-electric-blue/20 transition-all cursor-pointer bg-slate-900/90 backdrop-blur-sm border-slate-700 hover:border-electric-blue/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-electric-violet rounded-lg flex items-center justify-center shadow-lg shadow-electric-blue/30">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Create Proposal</h3>
                      <p className="text-sm text-slate-400">Start a new client proposal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cold-emails">
              <Card className="hover:shadow-xl hover:shadow-green-500/20 transition-all cursor-pointer bg-slate-900/90 backdrop-blur-sm border-slate-700 hover:border-green-500/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Cold Emails</h3>
                      <p className="text-sm text-slate-400">Generate outreach emails</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contract">
              <Card className="hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer bg-slate-900/90 backdrop-blur-sm border-slate-700 hover:border-purple-500/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-orange to-electric-violet rounded-lg flex items-center justify-center shadow-lg shadow-neon-orange/30">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Contracts</h3>
                      <p className="text-sm text-slate-400">Create legal agreements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Need help? Check out our{' '}
            <a href="https://github.com/Loopxo/founder-box" target="_blank" className="text-electric-blue hover:text-electric-blue/80 font-medium">
              documentation
            </a>{' '}
            or join our{' '}
            <a href="https://github.com/Loopxo/founder-box" target="_blank" className="text-electric-blue hover:text-electric-blue/80 font-medium">
              community
            </a>
            .
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
