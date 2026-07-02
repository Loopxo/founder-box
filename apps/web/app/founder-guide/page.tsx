import type { Metadata } from 'next'
import DashboardLayout from '@/components/DashboardLayout'
import FounderGuideStages from '@/components/FounderGuideStages'
import { getFounderGuideData } from '@/lib/founder-guide'
import { ArrowRight, BookOpen, Compass, ExternalLink, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Launchpath Atlas',
  description:
    'A structured aspiring founder guide built from the Founder Kit resource library. Learn mindset, idea discovery, validation, building, launch, and growth in one guided page.',
}

const S = {
  bg: '#111118',
  surface: '#18181F',
  surface2: '#1E1E28',
  border: '#2A2A38',
  borderWarm: '#3A3830',
  text: '#EDE9DC',
  muted: '#9E9880',
  gold: '#D4A853',
  goldSoft: 'rgba(212,168,83,0.08)',
} as const

export default function FounderGuidePage() {
  const guide = getFounderGuideData()

  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gap: '24px' }}>
        <section
          style={{
            background: `linear-gradient(180deg, ${S.goldSoft} 0%, rgba(24,24,31,0.94) 35%, ${S.surface} 100%)`,
            border: `1px solid ${S.border}`,
            borderRadius: '8px',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ maxWidth: '760px' }}>
              <p className="studio-label" style={{ marginBottom: '8px' }}>
                {guide.eyebrow}
              </p>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.6rem)',
                  lineHeight: 1.05,
                  fontWeight: 800,
                  color: S.text,
                  marginBottom: '12px',
                }}
              >
                {guide.projectName}
              </h1>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: S.text,
                  maxWidth: '58rem',
                  marginBottom: '10px',
                }}
              >
                {guide.heroTitle}
              </p>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: S.muted, maxWidth: '58rem' }}>
                {guide.heroDescription}
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '18px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: S.bg,
                  border: `1px solid ${S.borderWarm}`,
                  color: S.gold,
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Extra gift for you:
                <span style={{ color: S.text, fontWeight: 600 }}>
                  investor and funding links are waiting at the end of this guide.
                </span>
              </div>
            </div>

            <div
              style={{
                minWidth: '240px',
                background: S.bg,
                border: `1px solid ${S.border}`,
                borderRadius: '8px',
                padding: '18px',
              }}
            >
              <p className="studio-label" style={{ marginBottom: '16px' }}>
                Guide Snapshot
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Stages', value: String(guide.stages.length) },
                  { label: 'Categories', value: String(guide.totalCategories) },
                  { label: 'Resource Links', value: `${guide.totalResources}+` },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '12px',
                      borderBottom: `1px solid ${S.border}`,
                    }}
                  >
                    <span style={{ color: S.muted, fontSize: '13px' }}>{item.label}</span>
                    <span style={{ color: S.text, fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Compass size={18} color={S.gold} />
              <p className="studio-label">How To Use This</p>
            </div>
            <ul style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.6, paddingLeft: '18px' }}>
              {guide.quickStart.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Sparkles size={18} color={S.gold} />
              <p className="studio-label">Built For</p>
            </div>
            <ul style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.6, paddingLeft: '18px' }}>
              {guide.audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <p className="studio-label" style={{ marginBottom: '6px' }}>
              Stage Map
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: S.text }}>Move through the path in sequence</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              gap: '12px',
            }}
            className="md:grid-cols-2 xl:grid-cols-3"
          >
            {guide.stages.map((stage) => (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '180px',
                  padding: '16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: S.bg,
                  border: `1px solid ${S.border}`,
                  color: S.text,
                }}
              >
                <div>
                  <p className="studio-label" style={{ marginBottom: '6px' }}>
                    {stage.label}
                  </p>
                  <p style={{ fontWeight: 700, marginBottom: '8px' }}>{stage.title}</p>
                  <p style={{ color: S.muted, fontSize: '14px', lineHeight: 1.6 }}>{stage.description}</p>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '18px',
                    alignSelf: 'flex-start',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: S.surface,
                    border: `1px solid ${S.borderWarm}`,
                    color: S.gold,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Open Stage
                  <ArrowRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </section>

        <FounderGuideStages stages={guide.stages} />

        <section
          style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <p className="studio-label" style={{ marginBottom: '6px' }}>
              Investor Landscape
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: S.text, marginBottom: '8px' }}>
              See which firms are backing startups like yours
            </h2>
            <p style={{ color: S.muted, lineHeight: 1.7, maxWidth: '60rem' }}>
              Use this section to study where top startup investors are placing bets. The fastest way to understand
              what investors believe in is to read their portfolio pages, not just their marketing copy.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              marginBottom: '18px',
            }}
          >
            {guide.investorFirms.map((firm) => (
              <div
                key={firm.name}
                style={{
                  background: S.bg,
                  border: `1px solid ${S.border}`,
                  borderRadius: '8px',
                  padding: '18px',
                  display: 'grid',
                  gap: '12px',
                  minWidth: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '9999px',
                      background: S.surface,
                      border: `1px solid ${S.borderWarm}`,
                      color: S.gold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {firm.rank}
                  </div>
                  <div>
                    <p style={{ color: S.text, fontWeight: 700 }}>{firm.name}</p>
                    <p style={{ color: S.muted, fontSize: '13px' }}>Investor and startup portfolio access</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <a
                    href={firm.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      border: `1px solid ${S.border}`,
                      background: S.surface,
                      padding: '11px 12px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p className="studio-label" style={{ marginBottom: '4px' }}>
                        Official Site
                      </p>
                      <p style={{ color: S.text, fontSize: '14px', overflowWrap: 'anywhere' }}>{firm.siteLabel}</p>
                    </div>
                    <ExternalLink size={14} color={S.gold} />
                  </a>

                  <a
                    href={firm.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      border: `1px solid ${S.borderWarm}`,
                      background: S.surface,
                      padding: '11px 12px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p className="studio-label" style={{ marginBottom: '4px' }}>
                        Portfolio Page
                      </p>
                      <p style={{ color: S.text, fontSize: '14px', overflowWrap: 'anywhere' }}>{firm.portfolioLabel}</p>
                    </div>
                    <ExternalLink size={14} color={S.gold} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: S.bg,
              border: `1px solid ${S.borderWarm}`,
              borderRadius: '8px',
              padding: '18px',
            }}
          >
            <p className="studio-label" style={{ marginBottom: '10px' }}>
              Funding Trackers
            </p>
            <p style={{ color: S.muted, lineHeight: 1.7, marginBottom: '14px', maxWidth: '56rem' }}>
              If you want one place to monitor funding activity across many firms instead of checking portfolio pages one by one,
              start here.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {guide.fundingTrackers.map((tracker) => (
                <a
                  key={tracker.name}
                  href={tracker.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    background: S.surface,
                    border: `1px solid ${S.border}`,
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                    <p style={{ color: S.text, fontWeight: 700 }}>{tracker.name}</p>
                    <ExternalLink size={14} color={S.gold} />
                  </div>
                  <p style={{ color: S.muted, fontSize: '14px', lineHeight: 1.6 }}>{tracker.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: '8px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <BookOpen size={18} color={S.gold} />
              <p className="studio-label">Founder Path Summary</p>
            </div>
            <ol style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.7, paddingLeft: '18px' }}>
              {guide.pathSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: '8px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Sparkles size={18} color={S.gold} />
              <p className="studio-label">Optional Next Steps</p>
            </div>
            <ul style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.7, paddingLeft: '18px' }}>
              {guide.nextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
