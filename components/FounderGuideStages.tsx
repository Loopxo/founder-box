"use client"

import { useEffect, useState } from 'react'
import { ChevronDown, ExternalLink, Flag } from 'lucide-react'
import type { GuideStage } from '@/lib/founder-guide'

const S = {
  bg: '#111118',
  surface: '#18181F',
  surface2: '#1E1E28',
  border: '#2A2A38',
  borderWarm: '#3A3830',
  text: '#EDE9DC',
  muted: '#9E9880',
  gold: '#D4A853',
} as const

function buildInitialOpenState(stages: GuideStage[]) {
  return Object.fromEntries(stages.map((stage, index) => [stage.id, index === 0]))
}

export default function FounderGuideStages({ stages }: { stages: GuideStage[] }) {
  const [openStages, setOpenStages] = useState<Record<string, boolean>>(() => buildInitialOpenState(stages))

  useEffect(() => {
    const syncHashStage = () => {
      const stageId = decodeURIComponent(window.location.hash.replace('#', ''))

      if (!stageId) {
        return
      }

      setOpenStages((current) => ({
        ...current,
        [stageId]: true,
      }))
    }

    syncHashStage()
    window.addEventListener('hashchange', syncHashStage)

    return () => window.removeEventListener('hashchange', syncHashStage)
  }, [])

  const toggleStage = (stageId: string) => {
    setOpenStages((current) => ({
      ...current,
      [stageId]: !current[stageId],
    }))
  }

  return (
    <section style={{ display: 'grid', gap: '16px' }}>
      {stages.map((stage, index) => {
        const isOpen = openStages[stage.id]

        return (
          <section
            key={stage.id}
            id={stage.id}
            style={{
              scrollMarginTop: '24px',
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => toggleStage(stage.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '24px',
                background: index % 2 === 0 ? S.surface : S.surface2,
                border: 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '18px',
                }}
              >
                <div style={{ maxWidth: '860px' }}>
                  <p className="studio-label" style={{ marginBottom: '6px' }}>
                    {stage.label}
                  </p>
                  <h3 style={{ fontSize: '28px', fontWeight: 700, color: S.text, marginBottom: '10px' }}>
                    {stage.title}
                  </h3>
                  <p style={{ color: S.muted, lineHeight: 1.7 }}>{stage.description}</p>
                </div>

                <div
                  style={{
                    minWidth: '180px',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${S.border}`,
                    background: S.bg,
                  }}
                >
                  <p className="studio-label" style={{ marginBottom: '8px' }}>
                    Resource Shelf
                  </p>
                  <p style={{ color: S.text, fontWeight: 700, marginBottom: '4px' }}>{stage.resources.length} categories</p>
                  <p style={{ color: S.muted, fontSize: '13px', lineHeight: 1.5 }}>
                    Open this section when you need references, tools, or examples.
                  </p>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: `1px solid ${S.borderWarm}`,
                    background: S.bg,
                    color: S.gold,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isOpen ? 'Close Stage' : 'Expand Stage'}
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.18s ease',
                    }}
                  />
                </div>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: '0 24px 24px', display: 'grid', gap: '18px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '18px' }}>
                    <p className="studio-label" style={{ marginBottom: '10px' }}>
                      Key Lessons
                    </p>
                    <ul style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.6, paddingLeft: '18px' }}>
                      {stage.keyLessons.map((lesson) => (
                        <li key={lesson}>{lesson}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '18px' }}>
                    <p className="studio-label" style={{ marginBottom: '10px' }}>
                      Action Steps
                    </p>
                    <ol style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.6, paddingLeft: '18px' }}>
                      {stage.actionSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.borderWarm}`,
                    borderRadius: '8px',
                    padding: '18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Flag size={16} color={S.gold} />
                    <p className="studio-label">What You Should Do Now</p>
                  </div>
                  <ul style={{ display: 'grid', gap: '10px', color: S.text, lineHeight: 1.6, paddingLeft: '18px', marginBottom: '10px' }}>
                    {stage.doNow.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                  <p style={{ color: S.muted, fontSize: '14px', lineHeight: 1.6 }}>{stage.resourceNote}</p>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {stage.resources.map((category) => (
                    <details
                      key={category.title}
                      style={{
                        background: S.bg,
                        border: `1px solid ${S.border}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <summary
                        style={{
                          listStyle: 'none',
                          cursor: 'pointer',
                          padding: '16px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <p style={{ color: S.text, fontWeight: 700, marginBottom: '4px' }}>{category.title}</p>
                          <p style={{ color: S.muted, fontSize: '13px' }}>
                            {category.groups.reduce((count, group) => count + group.links.length, 0)} links across{' '}
                            {category.groups.length} sections
                          </p>
                        </div>
                        <ChevronDown size={16} color={S.gold} />
                      </summary>

                      <div style={{ padding: '0 18px 18px', display: 'grid', gap: '16px' }}>
                        {category.groups.map((group) => (
                          <div key={`${category.title}-${group.title}`}>
                            <p className="studio-label" style={{ marginBottom: '10px' }}>
                              {group.title}
                            </p>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '10px',
                              }}
                            >
                              {group.links.map((link) => (
                                <a
                                  key={`${group.title}-${link.title}`}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    background: S.surface,
                                    border: `1px solid ${S.border}`,
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <span style={{ color: S.text, lineHeight: 1.5, fontSize: '14px' }}>{link.title}</span>
                                  <ExternalLink size={14} color={S.gold} style={{ flexShrink: 0 }} />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}
    </section>
  )
}
