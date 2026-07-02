"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  abbr: string       // 2-char abbr shown when collapsed
  badge?: string
}

const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Workspace',
    items: [
      { name: 'Dashboard', href: '/dashboard', abbr: 'DB' },
      { name: 'Today', href: '/accountability/today', abbr: 'TD' },
      { name: 'Check-in', href: '/accountability/check-in', abbr: 'CI' },
      { name: 'Leads', href: '/accountability/leads', abbr: 'LD' },
      { name: 'Outreach', href: '/accountability/outreach', abbr: 'OR' },
      { name: 'Work', href: '/accountability/work', abbr: 'WK' },
      { name: 'Products', href: '/accountability/products', abbr: 'PR' },
      { name: 'Methods', href: '/accountability/methods', abbr: 'MT' },
      { name: 'Builder', href: '/accountability/builder', abbr: 'BU' },
      { name: 'Reports', href: '/accountability/reports', abbr: 'RP' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { name: 'API Keys', href: '/dashboard/api-keys', abbr: 'AK' },
      { name: 'Billing', href: '/billing', abbr: 'BI' },
      { name: 'Account', href: '/account', abbr: 'AC' },
      { name: 'Settings', href: '/accountability/settings', abbr: 'ST' },
    ],
  },
  {
    label: 'Founder Tools',
    items: [
      { name: 'Loopxo Academy', href: '/academy', abbr: 'AC', badge: 'NEW' },
      { name: 'Launchpath Atlas', href: '/founder-guide', abbr: 'LA' },
      { name: 'Startup Lens', href: '/startup-lens', abbr: 'SL', badge: 'NEW' },
      { name: 'Proposal Generator', href: '/dashboard/proposal', abbr: 'PG' },
      { name: 'Cold Emails', href: '/cold-emails', abbr: 'CE' },
      { name: 'Competitive Analysis', href: '/competitive-analysis', abbr: 'CA' },
      { name: 'Contracts', href: '/contract', abbr: 'CN' },
      { name: 'Invoices', href: '/invoice', abbr: 'IN' },
      { name: 'SEO Content', href: '/seo', abbr: 'SE' },
      { name: 'Sales Copy', href: '/sales', abbr: 'SC' },
      { name: 'Social Media', href: '/social-media-content', abbr: 'SM' },
      { name: 'Resume Forge', href: '/resume', abbr: 'RF', badge: 'NEW' },
    ],
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const sidebarWidth = collapsed ? 'w-[60px]' : 'w-[220px]'

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{ backgroundColor: '#18181F', borderColor: '#2A2A38' }}
        className={`
          fixed top-0 left-0 h-full border-r z-50 flex flex-col transition-all duration-200
          ${sidebarWidth}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div
          style={{ borderColor: '#2A2A38' }}
          className="flex items-center justify-between px-4 py-5 border-b flex-shrink-0"
        >
          {!collapsed ? (
            <span
              style={{ color: '#D4A853', letterSpacing: '0.08em' }}
              className="text-sm font-800 font-extrabold tracking-widest uppercase"
            >
              FounderBox
            </span>
          ) : (
            <span
              style={{ color: '#D4A853' }}
              className="text-sm font-extrabold tracking-widest w-full text-center"
            >
              FB
            </span>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{ color: '#9E9880' }}
            className="lg:hidden text-sm hover:text-white transition-colors ml-2"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: '#68634F' }}>
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      style={{
                        borderLeft: active ? '2px solid #D4A853' : '2px solid transparent',
                        color: active ? '#D4A853' : '#9E9880',
                        backgroundColor: active ? 'rgba(212,168,83,0.06)' : 'transparent',
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 cursor-pointer hover:bg-white/[0.03]"
                      onMouseEnter={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.color = '#EDE9DC'
                      }}
                      onMouseLeave={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.color = '#9E9880'
                      }}
                    >
                      {collapsed ? (
                        <span
                          style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', minWidth: '28px', textAlign: 'center' }}
                        >
                          {item.abbr}
                        </span>
                      ) : (
                        <>
                          <span className="text-sm font-medium flex-1 truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '9px',
                                letterSpacing: '0.08em',
                                padding: '1px 6px',
                                borderRadius: '3px',
                                background: 'rgba(212,168,83,0.15)',
                                color: '#D4A853',
                                border: '1px solid rgba(212,168,83,0.3)',
                                fontWeight: 700,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop */}
        <div style={{ borderColor: '#2A2A38' }} className="hidden lg:block border-t flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#9E9880' }}
            className="w-full py-4 text-xs font-semibold tracking-widest uppercase hover:text-white transition-colors"
          >
            {collapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </aside>

      {/* Mobile hamburger */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: '#18181F', border: '1px solid #2A2A38', color: '#EDE9DC' }}
          className="lg:hidden fixed top-4 right-4 z-50 px-3 py-2 rounded text-sm font-semibold"
        >
          Menu
        </button>
      )}
    </>
  )
}
