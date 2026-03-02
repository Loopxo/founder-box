"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { industries, templates, calculateCampaignMetrics, blueprintSteps } from '@/lib/cold-email-data'

// Studio palette
const S = {
  bg: '#111118',
  surface: '#18181F',
  surface2: '#1E1E28',
  border: '#2A2A38',
  text: '#EDE9DC',
  muted: '#9E9880',
  gold: '#D4A853',
  goldDim: '#C49843',
  success: '#4D9E6A',
  error: '#C0514A',
} as const

// Reusable Studio card
const SCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', ...style }}>
    {children}
  </div>
)

function ColdEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'templates' | 'calculator' | 'blueprint'>('templates')
  const [activeBlueprintStep, setActiveBlueprintStep] = useState<number>(0)
  const [campaignData, setCampaignData] = useState({
    targetMeetings: 50,
    industry: 'saas',
    experienceLevel: 'beginner'
  })
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)
  const [templateInputs, setTemplateInputs] = useState<Record<string, string>>({})
  const [editedSubject, setEditedSubject] = useState('')
  const [editedBody, setEditedBody] = useState('')

  const filteredTemplates = templates.filter(template => {
    const matchesIndustry = selectedIndustry ? template.category === selectedIndustry : true
    const matchesSearch = searchQuery
      ? template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesIndustry && matchesSearch
  })

  const campaignMetrics = calculateCampaignMetrics(
    campaignData.targetMeetings,
    campaignData.industry,
    campaignData.experienceLevel
  )

  const copyToClipboard = (text: string, templateId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTemplate(templateId)
    setTimeout(() => setCopiedTemplate(null), 2000)
  }

  const selectedTemplateData = selectedTemplate ? templates.find(t => t.id === selectedTemplate) : null

  const applyCustomization = (text: string) => {
    let customizedText = text
    Object.entries(templateInputs).forEach(([field, value]) => {
      if (value.trim()) customizedText = customizedText.replaceAll(field, value)
    })
    return customizedText
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      const initialInputs: Record<string, string> = {}
      template.customizationFields.forEach(field => { initialInputs[field.field] = '' })
      setTemplateInputs(initialInputs)
      setEditedSubject(template.subject)
      setEditedBody(template.body)
    }
  }

  const resetTemplate = () => {
    if (selectedTemplateData) {
      const initialInputs: Record<string, string> = {}
      selectedTemplateData.customizationFields.forEach(field => { initialInputs[field.field] = '' })
      setTemplateInputs(initialInputs)
      setEditedSubject(selectedTemplateData.subject)
      setEditedBody(selectedTemplateData.body)
    }
  }

  const getFinalSubject = () => applyCustomization(editedSubject)
  const getFinalBody = () => applyCustomization(editedBody)

  useEffect(() => {
    const industry = searchParams.get('industry')
    const template = searchParams.get('template')
    if (industry) setSelectedIndustry(industry)
    if (template) handleTemplateSelect(template)
  }, [searchParams])

  const updateUrl = (industry?: string | null, template?: string | null) => {
    const params = new URLSearchParams()
    if (industry) params.set('industry', industry)
    if (template) params.set('template', template)
    const newUrl = params.toString() ? `/cold-emails?${params.toString()}` : '/cold-emails'
    router.replace(newUrl, { scroll: false })
  }

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId)
    updateUrl(industryId)
  }

  const handleTemplateSelectWithUrl = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      handleTemplateSelect(templateId)
      updateUrl(selectedIndustry, templateId)
    }
  }

  const goBackToIndustries = () => { setSelectedIndustry(null); setSelectedTemplate(null); updateUrl() }
  const goBackToTemplates = () => { setSelectedTemplate(null); updateUrl(selectedIndustry) }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: S.bg, border: `1px solid ${S.border}`,
    borderRadius: '6px', padding: '8px 12px', fontSize: '14px',
    color: S.text, outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: S.muted, display: 'block', marginBottom: '6px',
  }
  const textareaStyle: React.CSSProperties = {
    ...inputStyle, resize: 'vertical', fontFamily: 'monospace',
  }
  const ghostBtn: React.CSSProperties = {
    padding: '7px 14px', background: 'transparent', border: `1px solid ${S.border}`,
    borderRadius: '6px', color: S.muted, fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', transition: 'color 0.15s',
  }

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={labelStyle}>Cold Emails</p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: S.text, marginBottom: '6px' }}>
          Template Platform
        </h1>
        <p style={{ color: S.muted, fontSize: '14px' }}>
          89+ battle-tested templates across 9 industries. Copy-paste ready with interactive calculators.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '1px', background: S.border, borderRadius: '8px', padding: '1px', marginBottom: '28px', width: 'fit-content' }}>
        {(['templates', 'calculator', 'blueprint'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab ? S.surface : 'transparent',
              color: activeTab === tab ? S.text : S.muted,
              letterSpacing: '0.02em',
            }}
          >
            {tab === 'templates' ? 'Templates' : tab === 'calculator' ? 'Campaign Calculator' : 'The Blueprint'}
          </button>
        ))}
      </div>

      {/* ── TEMPLATES TAB ── */}
      {activeTab === 'templates' && (
        <div>
          {/* Step 1: Industry selection */}
          {!selectedIndustry && !selectedTemplate && (
            <>
              {/* Search */}
              <SCard style={{ padding: '20px', marginBottom: '28px' }}>
                <p style={{ ...labelStyle, marginBottom: '10px' }}>Search All Templates</p>
                <input
                  style={inputStyle}
                  placeholder="Search by title, content, or industry..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ color: S.muted, fontSize: '13px', marginBottom: '10px' }}>
                      {filteredTemplates.length} templates found
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {filteredTemplates.slice(0, 6).map(template => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelectWithUrl(template.id)}
                          style={{ padding: '14px', background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ color: S.text, fontWeight: 600, fontSize: '14px' }}>{template.title}</span>
                            <span style={{ fontSize: '11px', color: S.gold, fontWeight: 700, padding: '2px 8px', background: 'rgba(212,168,83,0.1)', border: `1px solid rgba(212,168,83,0.3)`, borderRadius: '3px' }}>{template.successRate}</span>
                          </div>
                          <p style={{ color: S.muted, fontSize: '13px', marginBottom: '4px' }}>
                            <strong style={{ color: S.text }}>Subject:</strong> {template.subject}
                          </p>
                          <p style={{ color: S.muted, fontSize: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {template.body.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SCard>

              {/* Industry grid */}
              <p style={{ ...labelStyle, marginBottom: '16px' }}>Choose Your Industry</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: S.border, border: `1px solid ${S.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                {industries.map(industry => (
                  <div
                    key={industry.id}
                    onClick={() => handleIndustrySelect(industry.id)}
                    style={{ background: S.surface, padding: '24px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = S.surface2)}
                    onMouseLeave={e => (e.currentTarget.style.background = S.surface)}
                  >
                    <p style={{ fontSize: '15px', fontWeight: 600, color: S.text, marginBottom: '4px' }}>{industry.name}</p>
                    <p style={{ fontSize: '13px', color: S.muted, marginBottom: '12px' }}>{industry.description}</p>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: S.muted }}>{industry.templateCount} templates</span>
                      <span style={{ fontSize: '12px', color: S.gold, fontWeight: 600 }}>{industry.successRate} reply rate</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {industry.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: S.muted, padding: '2px 6px', background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '3px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Template list */}
          {selectedIndustry && !selectedTemplate && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: S.text }}>
                    {industries.find(i => i.id === selectedIndustry)?.name} Templates
                  </h2>
                  <p style={{ color: S.muted, fontSize: '13px' }}>{filteredTemplates.length} proven templates with success rates</p>
                </div>
                <button
                  style={ghostBtn}
                  onClick={goBackToIndustries}
                  onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
                >
                  Back to Industries
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelectWithUrl(template.id)}
                    style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = S.gold; (e.currentTarget as HTMLElement).style.background = S.surface2 }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = S.border; (e.currentTarget as HTMLElement).style.background = S.surface }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: S.text }}>{template.title}</h3>
                      <span style={{ fontSize: '11px', color: S.gold, fontWeight: 700, padding: '2px 8px', background: 'rgba(212,168,83,0.1)', border: `1px solid rgba(212,168,83,0.3)`, borderRadius: '3px', flexShrink: 0 }}>
                        {template.successRate} reply rate
                      </span>
                    </div>
                    <p style={{ color: S.muted, fontSize: '13px', marginBottom: '8px' }}>
                      <strong style={{ color: S.text }}>Subject:</strong> {template.subject}
                    </p>
                    <p style={{ color: S.muted, fontSize: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {template.body.substring(0, 200)}...
                    </p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      {template.useCases.slice(0, 2).map(useCase => (
                        <span key={useCase} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: S.muted, padding: '2px 6px', background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '3px' }}>
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Template detail */}
          {selectedTemplateData && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: S.text }}>{selectedTemplateData.title}</h2>
                  <p style={{ color: S.muted, fontSize: '13px' }}>
                    {industries.find(i => i.id === selectedTemplateData.category)?.name}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={ghostBtn} onClick={goBackToTemplates}
                    onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
                  >Back to Templates</button>
                  <button style={ghostBtn} onClick={goBackToIndustries}
                    onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
                  >All Industries</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left: Content editor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SCard style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ color: S.text, fontWeight: 600 }}>Template Content</p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button style={{ ...ghostBtn, fontSize: '12px', padding: '5px 10px' }} onClick={resetTemplate}
                          onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                          onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
                        >Reset</button>
                        <span style={{ fontSize: '11px', color: S.gold, fontWeight: 700, padding: '2px 8px', background: 'rgba(212,168,83,0.1)', border: `1px solid rgba(212,168,83,0.3)`, borderRadius: '3px' }}>
                          {selectedTemplateData.successRate} reply rate
                        </span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={labelStyle}>Subject Line</label>
                      <textarea style={{ ...textareaStyle, minHeight: '60px' }}
                        value={editedSubject} onChange={e => setEditedSubject(e.target.value)}
                        placeholder="Edit subject line..." />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Body</label>
                      <textarea style={{ ...textareaStyle, minHeight: '200px' }}
                        value={editedBody} onChange={e => setEditedBody(e.target.value)}
                        placeholder="Edit email body..." />
                    </div>
                  </SCard>

                  {/* Preview */}
                  <SCard style={{ padding: '20px', borderColor: 'rgba(212,168,83,0.3)' }}>
                    <p style={{ color: S.text, fontWeight: 600, marginBottom: '14px' }}>Preview (Customized)</p>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={labelStyle}>Subject</label>
                      <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '6px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '13px', color: S.text }}>
                        {getFinalSubject()}
                      </div>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={labelStyle}>Body</label>
                      <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '13px', color: S.text, whiteSpace: 'pre-wrap' }}>
                        {getFinalBody()}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${getFinalSubject()}\n\n${getFinalBody()}`, selectedTemplateData.id)}
                      style={{
                        width: '100%', padding: '10px', border: 'none', borderRadius: '6px',
                        background: copiedTemplate === selectedTemplateData.id ? S.success : S.gold,
                        color: '#111118', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      }}
                    >
                      {copiedTemplate === selectedTemplateData.id ? 'Copied!' : 'Copy Customized Template'}
                    </button>
                  </SCard>
                </div>

                {/* Right: Customization + meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SCard style={{ padding: '20px' }}>
                    <p style={{ color: S.text, fontWeight: 600, marginBottom: '4px' }}>Customize Template</p>
                    <p style={{ color: S.muted, fontSize: '13px', marginBottom: '16px' }}>Fill in the fields to personalize your email.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {selectedTemplateData.customizationFields.map(field => (
                        <div key={field.field}>
                          <label style={labelStyle}>{field.field}</label>
                          <p style={{ color: S.muted, fontSize: '12px', marginBottom: '6px' }}>{field.description}</p>
                          <input
                            style={inputStyle}
                            value={templateInputs[field.field] || ''}
                            onChange={e => setTemplateInputs({ ...templateInputs, [field.field]: e.target.value })}
                            placeholder={`Enter ${field.description.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                  </SCard>

                  <SCard style={{ padding: '20px' }}>
                    <p style={{ color: S.text, fontWeight: 600, marginBottom: '12px' }}>Use Cases</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedTemplateData.useCases.map((useCase, i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: S.muted }}>
                          <span style={{ color: S.success, flexShrink: 0 }}>—</span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </SCard>

                  <SCard style={{ padding: '20px' }}>
                    <p style={{ color: S.text, fontWeight: 600, marginBottom: '12px' }}>Tips for Success</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedTemplateData.tips.map((tip, i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: S.muted }}>
                          <span style={{ color: S.gold, flexShrink: 0 }}>—</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </SCard>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── CALCULATOR TAB ── */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SCard style={{ padding: '28px' }}>
            <p style={{ color: S.text, fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Campaign Calculator</p>
            <p style={{ color: S.muted, fontSize: '13px', marginBottom: '24px' }}>
              Calculate how many emails you need to reach your meeting goals.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Target meetings / month</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={campaignData.targetMeetings}
                  onChange={e => setCampaignData({ ...campaignData, targetMeetings: parseInt(e.target.value) || 50 })}
                />
              </div>
              <div>
                <label style={labelStyle}>Industry</label>
                <select
                  style={{ ...inputStyle, appearance: 'none' }}
                  value={campaignData.industry}
                  onChange={e => setCampaignData({ ...campaignData, industry: e.target.value })}
                >
                  {industries.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Experience level</label>
                <select
                  style={{ ...inputStyle, appearance: 'none' }}
                  value={campaignData.experienceLevel}
                  onChange={e => setCampaignData({ ...campaignData, experienceLevel: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '24px' }}>
              <p style={{ ...labelStyle, marginBottom: '20px' }}>Results</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: S.border, borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                {[
                  { label: 'Emails / month', value: campaignMetrics.emailsNeeded.toLocaleString() },
                  { label: 'Expected replies', value: campaignMetrics.expectedReplies },
                  { label: 'Meetings likely', value: campaignMetrics.meetingsLikely },
                  { label: 'Emails / day', value: campaignMetrics.dailyEmails },
                ].map(stat => (
                  <div key={stat.label} style={{ background: S.surface, padding: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: S.gold, marginBottom: '4px' }}>{stat.value}</p>
                    <p style={{ fontSize: '11px', color: S.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: S.text }}>Timeline: </span>
                  <span style={{ fontSize: '13px', color: S.muted }}>{campaignMetrics.timeline}</span>
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: S.text }}>Recommendation: </span>
                  <span style={{ fontSize: '13px', color: S.muted }}>
                    Start with {campaignMetrics.dailyEmails} emails/day and focus on personalization for higher response rates.
                  </span>
                </div>
              </div>
            </div>
          </SCard>
        </div>
      )}

      {/* ── BLUEPRINT TAB ── */}
      {activeTab === 'blueprint' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left Menu / Stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '24px' }}>
            {blueprintSteps.map((step: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveBlueprintStep(idx)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '16px', borderRadius: '8px', border: `1px solid ${activeBlueprintStep === idx ? S.gold : S.border}`,
                  background: activeBlueprintStep === idx ? S.surface2 : S.surface,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: activeBlueprintStep === idx ? S.gold : S.muted, marginBottom: '4px' }}>
                  STEP {idx + 1}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: activeBlueprintStep === idx ? S.text : S.muted }}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right Content */}
          <SCard style={{ padding: '32px' }}>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${S.border}` }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: S.gold, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                {blueprintSteps[activeBlueprintStep].part}
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: S.text }}>
                {blueprintSteps[activeBlueprintStep].title}
              </h2>
            </div>

            <div
              style={{ fontSize: '14px', lineHeight: '1.7', color: S.text, whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{
                __html: blueprintSteps[activeBlueprintStep].content
                  // Simple markdown parsing for the content
                  .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #D4A853; font-weight: 700">$1</strong>')
                  .replace(/•/g, '<span style="color: #D4A853; margin-right: 8px">•</span>')
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${S.border}` }}>
              <button
                onClick={() => setActiveBlueprintStep(Math.max(0, activeBlueprintStep - 1))}
                style={{ ...ghostBtn, opacity: activeBlueprintStep === 0 ? 0.3 : 1, pointerEvents: activeBlueprintStep === 0 ? 'none' : 'auto' }}
              >
                ← Previous Step
              </button>
              <button
                onClick={() => setActiveBlueprintStep(Math.min(blueprintSteps.length - 1, activeBlueprintStep + 1))}
                style={{ ...ghostBtn, borderColor: S.gold, color: S.gold, opacity: activeBlueprintStep === blueprintSteps.length - 1 ? 0.3 : 1, pointerEvents: activeBlueprintStep === blueprintSteps.length - 1 ? 'none' : 'auto' }}
              >
                Next Step →
              </button>
            </div>
          </SCard>
        </div>
      )}
    </div>
  )
}

export default function ColdEmailPlatform() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div style={{ color: '#9E9880', fontSize: '14px' }}>Loading...</div>}>
        <ColdEmailContent />
      </Suspense>
    </DashboardLayout>
  )
}