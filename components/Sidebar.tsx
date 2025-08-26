"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Shield, 
  Mail, 
  TrendingUp, 
  Instagram, 
  BarChart3,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: SidebarItem[]
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Proposal Generator',
      href: '/dashboard/proposal',
      icon: FileText
    },
    {
      name: 'Cold Emails',
      href: '/cold-emails',
      icon: MessageSquare
    },
    {
      name: 'Competitive Analysis',
      href: '/competitive-analysis',
      icon: BarChart3
    },
    {
      name: 'Contracts',
      href: '/contract',
      icon: Shield
    },
    {
      name: 'Invoices',
      href: '/invoice',
      icon: Mail
    },
    {
      name: 'SEO Content',
      href: '/seo',
      icon: TrendingUp
    },
    {
      name: 'Sales Copy',
      href: '/sales',
      icon: BarChart3
    },
    {
      name: 'Social Media',
      href: '/social-media-content',
      icon: Instagram
    }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const SidebarItem = ({ item }: { item: SidebarItem }) => {
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)

    return (
      <div>
        <Link href={hasChildren ? '#' : item.href}>
          <div
            className={`
              flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer
              ${active 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
              ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}
            onClick={hasChildren ? () => toggleExpanded(item.name) : undefined}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </div>
            {!isCollapsed && hasChildren && (
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    {item.badge}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </Link>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="ml-6 mt-2 space-y-1">
            {item.children!.map((child) => (
              <Link key={child.href} href={child.href}>
                <div
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer
                    ${isActive(child.href) 
                      ? 'bg-yellow-50 text-yellow-700 border-l-2 border-yellow-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <child.icon className="w-4 h-4" />
                  <span className="text-sm">{child.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FounderBox</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-4 h-4 mr-3" />
              {!isCollapsed && <span>Settings</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="bg-white shadow-lg"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>
    </>
  )
}
