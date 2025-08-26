"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  MessageSquare, 
  Shield, 
  Mail, 
  TrendingUp, 
  Instagram, 
  BarChart3,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Demo mode - simulate user for testing
        setUser({
          id: 'demo-user',
          email: 'demo@founderbox.com',
          user_metadata: { name: 'Demo User' },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated'
        } as SupabaseUser)
        setLoading(false)
        return
      }
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        // Demo mode - don't redirect for testing
        return
      }
      setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
      icon: Instagram,
      href: '/social-media-content',
      color: 'from-yellow-500 to-orange-500'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.name || 'Founder'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to accelerate your business? Choose a tool to get started.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tools Available</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Proposals Created</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Type</p>
                  <p className="text-2xl font-bold text-gray-900">Free</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center mb-3`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/proposal">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create Proposal</h3>
                      <p className="text-sm text-gray-600">Start a new client proposal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cold-emails">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Cold Emails</h3>
                      <p className="text-sm text-gray-600">Generate outreach emails</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contract">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Contracts</h3>
                      <p className="text-sm text-gray-600">Create legal agreements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Need help? Check out our{' '}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium">
              documentation
            </a>{' '}
            or join our{' '}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium">
              community
            </a>
            .
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
