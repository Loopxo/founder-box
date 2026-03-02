"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { contractCategories, contractTemplates, standardClauses, ContractTemplate, ContractField } from '@/lib/contract-data'

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
} as const

const SCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', ...style }}>
    {children}
  </div>
)

function ContractContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [contractInputs, setContractInputs] = useState<Record<string, string>>({})
  const [selectedClauses, setSelectedClauses] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [copiedContract, setCopiedContract] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredTemplates = contractTemplates.filter(template => {
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true
    const matchesSearch = searchQuery
      ? template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    const category = searchParams.get('category')
    const templateId = searchParams.get('template')
    if (category) setSelectedCategory(category)
    if (templateId) {
      const template = contractTemplates.find(t => t.id === templateId)
      if (template) handleTemplateSelect(template)
    }
  }, [searchParams])

  const updateUrl = (category?: string | null, templateId?: string | null) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (templateId) params.set('template', templateId)
    const newUrl = params.toString() ? `/contract?${params.toString()}` : '/contract'
    router.replace(newUrl, { scroll: false })
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    updateUrl(categoryId)
  }

  const handleTemplateSelect = (template: ContractTemplate) => {
    setSelectedTemplate(template)
    const initialInputs: Record<string, string> = {}
    template.customizationFields.forEach(field => { initialInputs[field.id] = '' })
    setContractInputs(initialInputs)
    setSelectedClauses([])
    // Open first section by default
    const sections = [...new Set(template.customizationFields.map(f => f.section))]
    if (sections.length) setOpenSections(new Set([sections[0]]))
  }

  const handleTemplateSelectWithUrl = (template: ContractTemplate) => {
    handleTemplateSelect(template)
    updateUrl(selectedCategory, template.id)
  }

  const goBackToCategories = () => { setSelectedCategory(null); setSelectedTemplate(null); updateUrl() }
  const goBackToTemplates = () => { setSelectedTemplate(null); updateUrl(selectedCategory) }

  const resetContract = () => {
    if (selectedTemplate) {
      const initialInputs: Record<string, string> = {}
      selectedTemplate.customizationFields.forEach(field => { initialInputs[field.id] = '' })
      setContractInputs(initialInputs)
      setSelectedClauses([])
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => setCompanyLogo(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setCompanyLogo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatCurrency = (value: string) => {
    const number = parseFloat(value)
    if (isNaN(number)) return value
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
  }

  const generateContract = () => {
    if (!selectedTemplate) return ''
    let contract = selectedTemplate.content
    Object.entries(contractInputs).forEach(([fieldId, value]) => {
      const field = selectedTemplate.customizationFields.find(f => f.id === fieldId)
      if (field && value) {
        const formattedValue = field.type === 'currency' ? formatCurrency(value) : value
        contract = contract.replaceAll(`[${fieldId}]`, formattedValue)
      }
    })
    if (selectedClauses.length > 0) {
      const additionalClauses = selectedClauses.map(clauseId => {
        const clause = selectedTemplate.clauses.find(c => c.id === clauseId) ||
          Object.values(standardClauses).flat().find(c => c.id === clauseId)
        return clause ? `\n\nADDITIONAL CLAUSE: ${clause.title}\n${clause.content}` : ''
      }).join('')
      contract += additionalClauses
    }
    return contract
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateContract())
    setCopiedContract(true)
    setTimeout(() => setCopiedContract(false), 2000)
  }

  const downloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: generateContract(), title: selectedTemplate?.title || 'Contract', logo: companyLogo }),
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedTemplate?.title?.replace(/\s+/g, '_') || 'contract'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch { /* silent */ }
  }

  const groupFieldsBySection = (fields: ContractField[]) => {
    const grouped: Record<string, ContractField[]> = {}
    fields.forEach(field => {
      if (!grouped[field.section]) grouped[field.section] = []
      grouped[field.section].push(field)
    })
    return grouped
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) { next.delete(section); } else { next.add(section); }
      return next
    })
  }

  // Shared style atoms
  const inputStyle: React.CSSProperties = {
    width: '100%', background: S.bg, border: `1px solid ${S.border}`, borderRadius: '6px',
    padding: '8px 12px', fontSize: '13px', color: S.text, outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: S.muted, display: 'block', marginBottom: '6px',
  }
  const ghostBtn: React.CSSProperties = {
    padding: '7px 14px', background: 'transparent', border: `1px solid ${S.border}`,
    borderRadius: '6px', color: S.muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={labelStyle}>Contracts</p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: S.text, marginBottom: '6px' }}>
          Contract Generator
        </h1>
        <p style={{ color: S.muted, fontSize: '14px' }}>
          Generate legally sound contracts with customizable templates and professional formatting.
        </p>
      </div>

      {/* Step 1: Category selection */}
      {!selectedCategory && !selectedTemplate && (
        <>
          {/* Search */}
          <SCard style={{ padding: '20px', marginBottom: '28px' }}>
            <p style={labelStyle}>Search All Contracts</p>
            <input
              style={inputStyle}
              placeholder="Search contracts by name or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: S.muted, fontSize: '13px', marginBottom: '10px' }}>
                  {filteredTemplates.length} contracts found
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredTemplates.slice(0, 6).map(template => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelectWithUrl(template)}
                      style={{ padding: '14px', background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: S.text, fontWeight: 600, fontSize: '14px' }}>{template.title}</span>
                        <span style={{ fontSize: '11px', color: S.muted, padding: '2px 8px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: '3px' }}>
                          {contractCategories.find(c => c.id === template.category)?.name}
                        </span>
                      </div>
                      <p style={{ color: S.muted, fontSize: '13px' }}>{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SCard>

          {/* Category grid */}
          <p style={labelStyle}>Choose Contract Category</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: S.border, border: `1px solid ${S.border}`, borderRadius: '8px', overflow: 'hidden', marginTop: '12px' }}>
            {contractCategories.map(category => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                style={{ background: S.surface, padding: '24px', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = S.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = S.surface)}
              >
                <p style={{ fontSize: '15px', fontWeight: 600, color: S.text, marginBottom: '4px' }}>{category.name}</p>
                <p style={{ fontSize: '13px', color: S.muted, marginBottom: '12px' }}>{category.description}</p>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: S.gold }}>
                  {contractTemplates.filter(t => t.category === category.id).length} templates
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Template list */}
      {selectedCategory && !selectedTemplate && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: S.text }}>
                {contractCategories.find(c => c.id === selectedCategory)?.name} Templates
              </h2>
              <p style={{ color: S.muted, fontSize: '13px' }}>{filteredTemplates.length} professional contract templates</p>
            </div>
            <button style={ghostBtn} onClick={goBackToCategories}
              onMouseEnter={e => (e.currentTarget.style.color = S.text)}
              onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
            >Back to Categories</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelectWithUrl(template)}
                style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = S.gold; (e.currentTarget as HTMLElement).style.background = S.surface2 }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = S.border; (e.currentTarget as HTMLElement).style.background = S.surface }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: S.text, marginBottom: '4px' }}>{template.title}</p>
                    <p style={{ fontSize: '13px', color: S.muted }}>{template.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '16px' }}>
                    <span style={{ fontSize: '11px', color: S.muted, padding: '2px 8px', background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '3px' }}>
                      {template.customizationFields.length} fields
                    </span>
                    <span style={{ fontSize: '11px', color: S.muted, padding: '2px 8px', background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '3px' }}>
                      {template.clauses.length} clauses
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 3: Contract builder */}
      {selectedTemplate && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: S.text }}>{selectedTemplate.title}</h2>
              <p style={{ color: S.muted, fontSize: '13px' }}>{selectedTemplate.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={ghostBtn} onClick={goBackToTemplates}
                onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
              >Back</button>
              <button style={ghostBtn} onClick={goBackToCategories}
                onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
              >All Categories</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
            {/* Left: fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Logo upload */}
              <SCard style={{ padding: '20px' }}>
                <p style={{ color: S.text, fontWeight: 600, marginBottom: '4px' }}>Company Branding</p>
                <p style={{ color: S.muted, fontSize: '13px', marginBottom: '14px' }}>Upload your company logo for professional contracts.</p>
                {!companyLogo ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: `2px dashed ${S.border}`, borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = S.gold)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = S.border)}
                  >
                    <p style={{ color: S.muted, fontSize: '13px', marginBottom: '4px' }}>Click to upload logo</p>
                    <p style={{ color: S.muted, fontSize: '11px' }}>PNG, JPG up to 2MB</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '6px', padding: '16px', textAlign: 'center', marginBottom: '10px' }}>
                      /* eslint-disable-next-line @next/next/no-img-element */
<img src={companyLogo} alt="Company Logo" style={{ maxHeight: '64px', margin: '0 auto' }} />
                    </div>
                    <button
                      onClick={removeLogo}
                      style={{ width: '100%', padding: '8px', background: 'transparent', border: `1px solid ${S.border}`, borderRadius: '6px', color: S.muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >Remove Logo</button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </SCard>

              {/* Contract details accordion */}
              <SCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${S.border}` }}>
                  <p style={{ color: S.text, fontWeight: 600 }}>Contract Details</p>
                  <button style={{ ...ghostBtn, fontSize: '12px', padding: '5px 10px' }} onClick={resetContract}
                    onMouseEnter={e => (e.currentTarget.style.color = S.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
                  >Reset</button>
                </div>
                {Object.entries(groupFieldsBySection(selectedTemplate.customizationFields)).map(([section, fields], idx, arr) => (
                  <div key={section} style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${S.border}` : 'none' }}>
                    <button
                      onClick={() => toggleSection(section)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 600, color: S.text }}>{section}</span>
                      <span style={{ color: S.muted, fontSize: '12px' }}>{openSections.has(section) ? '▲' : '▼'} {fields.length} fields</span>
                    </button>
                    {openSections.has(section) && (
                      <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {fields.map(field => (
                          <div key={field.id}>
                            <label style={labelStyle}>
                              {field.label}{field.required && <span style={{ color: '#C0514A', marginLeft: '3px' }}>*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
                                value={contractInputs[field.id] || ''}
                                onChange={e => setContractInputs({ ...contractInputs, [field.id]: e.target.value })}
                                placeholder={field.placeholder}
                              />
                            ) : (
                              <input
                                style={inputStyle}
                                type={field.type === 'currency' ? 'number' : field.type}
                                value={contractInputs[field.id] || ''}
                                onChange={e => setContractInputs({ ...contractInputs, [field.id]: e.target.value })}
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SCard>

              {/* Optional clauses */}
              {selectedTemplate.clauses.length > 0 && (
                <SCard style={{ padding: '20px' }}>
                  <p style={{ color: S.text, fontWeight: 600, marginBottom: '4px' }}>Optional Clauses</p>
                  <p style={{ color: S.muted, fontSize: '13px', marginBottom: '14px' }}>Select additional clauses to include.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedTemplate.clauses.map(clause => (
                      <label key={clause.id} style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedClauses.includes(clause.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedClauses([...selectedClauses, clause.id])
                            else setSelectedClauses(selectedClauses.filter(id => id !== clause.id))
                          }}
                          style={{ accentColor: S.gold, width: '14px', height: '14px', marginTop: '2px', flexShrink: 0 }}
                        />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: S.text, marginBottom: '2px' }}>{clause.title}</p>
                          <p style={{ fontSize: '12px', color: S.muted, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{clause.content}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </SCard>
              )}
            </div>

            {/* Right: preview */}
            <SCard style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${S.border}` }}>
                <p style={{ color: S.text, fontWeight: 600 }}>Contract Preview</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={copyToClipboard}
                    disabled={!generateContract().trim()}
                    style={{ ...ghostBtn, opacity: !generateContract().trim() ? 0.4 : 1 }}
                    onMouseEnter={e => { if (generateContract().trim()) (e.currentTarget as HTMLElement).style.color = S.text }}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = S.muted}
                  >
                    {copiedContract ? 'Copied!' : 'Copy Text'}
                  </button>
                  <button
                    onClick={downloadPDF}
                    disabled={!generateContract().trim()}
                    style={{
                      padding: '7px 14px', background: generateContract().trim() ? S.gold : S.surface2,
                      color: generateContract().trim() ? '#111118' : S.muted,
                      border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: generateContract().trim() ? 'pointer' : 'not-allowed',
                    }}
                  >Download PDF</button>
                </div>
              </div>
              <div style={{ padding: '24px', minHeight: '600px', fontFamily: 'monospace', fontSize: '13px', color: S.text }}>
                {companyLogo && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    /* eslint-disable-next-line @next/next/no-img-element */
<img src={companyLogo} alt="Company Logo" style={{ maxHeight: '64px', margin: '0 auto' }} />
                  </div>
                )}
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: S.text }}>
                  {generateContract() || <span style={{ color: S.muted }}>Fill in the contract details to see the preview...</span>}
                </pre>
              </div>
            </SCard>
          </div>
        </>
      )}
    </div>
  )
}

export default function ContractGenerator() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div style={{ color: '#9E9880', fontSize: '14px' }}>Loading...</div>}>
        <ContractContent />
      </Suspense>
    </DashboardLayout>
  )
}