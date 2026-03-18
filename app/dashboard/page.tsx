"use client"

import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

const TOOLS = [
  {
    title: 'Proposal Generator',
    description: 'Craft client-ready proposals in minutes.',
    href: '/dashboard/proposal',
    tag: 'Writing',
  },
  {
    title: 'Launchpath Atlas',
    description: 'A guided founder curriculum with curated resources.',
    href: '/founder-guide',
    tag: 'Guide',
  },
  {
    title: 'Cold Emails',
    description: 'High-converting outreach at scale.',
    href: '/cold-emails',
    tag: 'Outreach',
  },
  {
    title: 'Contracts',
    description: 'Legal-grade agreements, ready to send.',
    href: '/contract',
    tag: 'Legal',
  },
  {
    title: 'Invoices',
    description: 'Professional invoices with one click.',
    href: '/invoice',
    tag: 'Finance',
  },
  {
    title: 'SEO Content',
    description: 'Content engineered to rank and convert.',
    href: '/seo',
    tag: 'Content',
  },
  {
    title: 'Sales Copy',
    description: 'Persuasive copy that drives revenue.',
    href: '/sales',
    tag: 'Marketing',
  },
  {
    title: 'Social Media',
    description: 'Scroll-stopping content for every platform.',
    href: '/social-media-content',
    tag: 'Social',
  },
  {
    title: 'Competitive Analysis',
    description: 'Know your market. Stay ahead.',
    href: '/competitive-analysis',
    tag: 'Research',
  },
  {
    title: 'Resume Forge',
    description: '100% ATS-friendly founder resumes.',
    href: '/resume',
    tag: 'Career',
  },
]

const STATS = [
  { label: 'Tools Available', value: '10' },
  { label: 'Account Type', value: 'Free' },
  { label: 'Status', value: 'Active' },
  { label: 'Workspace', value: 'Personal' },
]

// Inline style objects for Studio palette
const S = {
  bg: '#111118',
  surface: '#18181F',
  surface2: '#1E1E28',
  border: '#2A2A38',
  borderWarm: '#3A3830',
  text: '#EDE9DC',
  muted: '#9E9880',
  gold: '#D4A853',
  goldDim: 'rgba(212,168,83,0.08)',
  success: '#4D9E6A',
} as const

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="studio-label" style={{ marginBottom: '6px' }}>Overview</p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: S.text, lineHeight: 1.2 }}>
          Your workspace
        </h1>
        <p style={{ color: S.muted, marginTop: '6px', fontSize: '14px' }}>
          All your founder tools in one place.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: S.border,
          border: `1px solid ${S.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '48px',
        }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            style={{ background: S.surface, padding: '20px 24px' }}
          >
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.muted, marginBottom: '6px' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: S.text }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tools section */}
      <div>
        <p className="studio-label" style={{ marginBottom: '16px' }}>Tools</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1px',
            background: S.border,
            border: `1px solid ${S.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} style={{ display: 'block' }}>
              <div
                style={{
                  background: S.surface,
                  padding: '24px',
                  height: '100%',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = S.surface2
                  el.style.borderLeft = `2px solid ${S.gold}`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = S.surface
                  el.style.borderLeft = '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: S.muted,
                    padding: '2px 8px',
                    background: S.surface2,
                    border: `1px solid ${S.border}`,
                    borderRadius: '3px',
                  }}>
                    {tool.tag}
                  </span>
                  {tool.isNew && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: S.gold,
                      padding: '2px 6px',
                      background: 'rgba(212,168,83,0.12)',
                      border: `1px solid rgba(212,168,83,0.3)`,
                      borderRadius: '3px',
                    }}>
                      New
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: S.text, marginBottom: '6px' }}>
                  {tool.title}
                </p>
                <p style={{ fontSize: '13px', color: S.muted, lineHeight: 1.5 }}>
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${S.border}` }}>
        <p style={{ fontSize: '12px', color: S.muted }}>
          FounderBox — built by{' '}
          <a
            href="https://loopxo.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: S.gold, textDecoration: 'none', fontWeight: 600 }}
          >
            LoopXo
          </a>
        </p>
      </div>
    </DashboardLayout>
  )
}
