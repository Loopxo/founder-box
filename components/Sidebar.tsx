"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    router.push('/')
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
                ? 'bg-gradient-to-r from-electric-blue to-electric-violet text-white shadow-lg shadow-electric-blue/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }
              ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}
            onClick={hasChildren ? () => toggleExpanded(item.name) : undefined}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </div>
            {!isCollapsed && hasChildren && (
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded-full">
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
                      ? 'bg-slate-800 text-electric-blue border-l-2 border-electric-blue'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
        fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 z-50 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="FounderBox Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-electric-blue via-neon-orange to-electric-violet bg-clip-text text-transparent">FounderBox</span>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Image
                src="/logo.png"
                alt="FounderBox Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Collapse Toggle Button - Desktop Only */}
        <div className="hidden lg:block p-4 border-t border-slate-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                <span className="ml-2 text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Mobile menu button - Only show when sidebar is closed */}
      {!isMobileOpen && (
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileOpen(true)}
            className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800 shadow-lg"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  )
}
