"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Invoice,
  InvoiceItem,
  InvoiceTax,
  createSampleInvoice,
  generateInvoiceNumber,
  calculateItemAmount,
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal,
  formatCurrency,
  addDaysToDate,
  taxRates,
  currencies,
  paymentTermsTemplates,
  invoiceThemes
} from '@/lib/invoice-data'

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
  error: '#C0514A'
} as const

const SCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', ...style }}>
    {children}
  </div>
)

function InvoiceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [invoice, setInvoice] = useState<Partial<Invoice>>(() => createSampleInvoice())
  const [selectedRegion, setSelectedRegion] = useState<string>('US')
  const [selectedTheme, setSelectedTheme] = useState<string>('professional')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [copiedInvoice, setCopiedInvoice] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'preview'>('create')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const theme = searchParams.get('theme')
    if (theme && invoiceThemes.find(t => t.id === theme)) {
      setSelectedTheme(theme)
    }
  }, [searchParams])

  const updateUrl = (invoiceId?: string, theme?: string) => {
    const params = new URLSearchParams()
    if (invoiceId) params.set('id', invoiceId)
    if (theme) params.set('theme', theme)
    const newUrl = params.toString() ? `/invoice?${params.toString()}` : '/invoice'
    router.replace(newUrl, { scroll: false })
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
    updateUrl(invoice.id, theme)
  }

  const updateInvoice = (updates: Partial<Invoice>) => setInvoice(prev => ({ ...prev, ...updates }))
  const updateCompany = (field: string, value: string) => setInvoice(prev => ({ ...prev, company: { ...prev.company!, [field]: value } }))
  const updateClient = (field: string, value: string) => setInvoice(prev => ({ ...prev, client: { ...prev.client!, [field]: value } }))

  const addItem = () => {
    const newItem: InvoiceItem = { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }
    setInvoice(prev => ({ ...prev, items: [...(prev.items || []), newItem] }))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items?.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = calculateItemAmount(updatedItem.quantity, updatedItem.rate)
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const removeItem = (id: string) => setInvoice(prev => ({ ...prev, items: prev.items?.filter(item => item.id !== id) }))

  const addTax = () => {
    const regionTaxes = taxRates[selectedRegion as keyof typeof taxRates] || taxRates.US
    const defaultTax = regionTaxes[0]
    const newTax: InvoiceTax = { name: defaultTax.name, rate: defaultTax.rate, amount: 0 }
    setInvoice(prev => ({ ...prev, taxes: [...(prev.taxes || []), newTax] }))
  }

  const updateTax = (index: number, field: keyof InvoiceTax, value: string | number) => {
    setInvoice(prev => ({ ...prev, taxes: prev.taxes?.map((tax, i) => i === index ? { ...tax, [field]: value } : tax) }))
  }

  const removeTax = (index: number) => setInvoice(prev => ({ ...prev, taxes: prev.taxes?.filter((_, i) => i !== index) }))

  useEffect(() => {
    if (invoice.items) {
      const subtotal = calculateSubtotal(invoice.items)
      let totalTax = 0
      const updatedTaxes = invoice.taxes?.map(tax => {
        const amount = calculateTaxAmount(subtotal, tax.rate)
        totalTax += amount
        return { ...tax, amount }
      }) || []
      const { total } = calculateTotal(subtotal, totalTax, invoice.discount)

      setInvoice(prev => {
        if (prev.subtotal !== subtotal || prev.totalTax !== totalTax || prev.total !== total || JSON.stringify(prev.taxes) !== JSON.stringify(updatedTaxes)) {
          return { ...prev, subtotal, taxes: updatedTaxes, totalTax, total }
        }
        return prev
      })
    }
  }, [invoice.items, invoice.taxes, invoice.discount])

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

  const resetInvoice = () => {
    setInvoice(createSampleInvoice())
    setCompanyLogo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const generateNewInvoiceNumber = () => {
    const newNumber = generateInvoiceNumber()
    updateInvoice({ invoiceNumber: newNumber })
  }

  const handlePaymentTermsChange = (template: string) => {
    const paymentTemplate = paymentTermsTemplates.find(pt => pt.name === template)
    if (paymentTemplate && invoice.date) {
      const dueDate = addDaysToDate(invoice.date, paymentTemplate.days)
      updateInvoice({
        dueDate,
        paymentTerms: { ...invoice.paymentTerms!, dueDate, notes: paymentTemplate.notes }
      })
    }
  }

  const copyToClipboard = () => {
    const invoiceText = generateInvoiceText()
    navigator.clipboard.writeText(invoiceText)
    setCopiedInvoice(true)
    setTimeout(() => setCopiedInvoice(false), 2000)
  }

  const generateInvoiceText = (): string => {
    if (!invoice.company || !invoice.client) return ''
    const formatAmount = (amount: number) => formatCurrency(amount, invoice.currency || 'USD')

    return `INVOICE #${invoice.invoiceNumber}

FROM:
${invoice.company.name}
${invoice.company.address}
${invoice.company.email}
${invoice.company.phone}
${invoice.company.taxNumber ? `Tax ID: ${invoice.company.taxNumber}` : ''}

TO:
${invoice.client.name}
${invoice.client.company ? `${invoice.client.company}` : ''}
${invoice.client.address}
${invoice.client.email}
${invoice.client.phone || ''}

Invoice Date: ${invoice.date}
Due Date: ${invoice.dueDate}

ITEMS:
${invoice.items?.map(item => `${item.description} - Qty: ${item.quantity} × ${formatAmount(item.rate)} = ${formatAmount(item.amount)}`).join('\n')}

TOTALS:
Subtotal: ${formatAmount(invoice.subtotal || 0)}
${invoice.taxes?.map(tax => `${tax.name} (${tax.rate}%): ${formatAmount(tax.amount)}`).join('\n')}
${invoice.discount ? `Discount: -${formatAmount(invoice.discount.amount)}` : ''}
TOTAL: ${formatAmount(invoice.total || 0)}

Payment Terms: ${invoice.paymentTerms?.notes || ''}
Payment Methods: ${invoice.paymentTerms?.paymentMethods?.join(', ') || ''}

${invoice.notes || ''}
`
  }

  const downloadPDF = async () => {
    try {
      const invoiceData = { ...invoice, logo: companyLogo, theme: selectedTheme }
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'invoice', invoice: invoiceData }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${invoice.invoiceNumber || 'draft'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch { /* silent */ }
  }

  const selectedThemeData = invoiceThemes.find(t => t.id === selectedTheme)

  // Shared inner styles
  const inputStyle: React.CSSProperties = {
    width: '100%', background: S.bg, border: `1px solid ${S.border}`, borderRadius: '6px',
    padding: '8px 12px', fontSize: '13px', color: S.text, outline: 'none'
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: S.muted, display: 'block', marginBottom: '6px'
  }
  const ghostBtn: React.CSSProperties = {
    padding: '7px 14px', background: 'transparent', border: `1px solid ${S.border}`,
    borderRadius: '6px', color: S.muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer'
  }
  const solidBtn: React.CSSProperties = {
    padding: '7px 14px', background: S.gold, color: '#111118', border: 'none',
    borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={labelStyle}>Invoices</p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: S.text, marginBottom: '6px' }}>Invoice Generator</h1>
        <p style={{ color: S.muted, fontSize: '14px', marginBottom: '16px' }}>
          Create professional invoices with automated tax calculations, payment terms, and secure branding.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {["Professional Invoices", "Tax Calculations", "Payment Terms", "Email Delivery", "Mobile Friendly", "Secure & Branded"].map(feature => (
            <span key={feature} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: S.muted, padding: '4px 8px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: '4px' }}>
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1px', background: S.border, borderRadius: '8px', padding: '1px', marginBottom: '28px', width: 'fit-content' }}>
        {(['create', 'preview'] as const).map(tab => (
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
            {tab === 'create' ? 'Create Invoice' : 'Preview & Export'}
          </button>
        ))}
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: { gridTemplateColumns: '2fr 1fr' }, gap: '24px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Invoice Details */}
            <SCard style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ color: S.text, fontWeight: 600 }}>Invoice Details</p>
                <button style={{ ...ghostBtn, fontSize: '12px', padding: '5px 10px' }} onClick={resetInvoice}>Reset</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Invoice Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input style={inputStyle} value={invoice.invoiceNumber || ''} onChange={e => updateInvoice({ invoiceNumber: e.target.value })} placeholder="INV-2024-001" />
                    <button style={ghostBtn} onClick={generateNewInvoiceNumber}>Generate</button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Invoice Date</label>
                  <input type="date" style={inputStyle} value={invoice.date || ''} onChange={e => updateInvoice({ date: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Due Date</label>
                  <input type="date" style={inputStyle} value={invoice.dueDate || ''} onChange={e => updateInvoice({ dueDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select style={{ ...inputStyle, appearance: 'none' }} value={invoice.currency || 'USD'} onChange={e => updateInvoice({ currency: e.target.value })}>
                    {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Payment Terms</label>
                  <select style={{ ...inputStyle, appearance: 'none' }} onChange={e => handlePaymentTermsChange(e.target.value)} defaultValue="">
                    <option value="" disabled>Select payment terms</option>
                    {paymentTermsTemplates.map(t => <option key={t.name} value={t.name}>{t.name} - {t.description}</option>)}
                  </select>
                </div>
              </div>
            </SCard>

            {/* Company & Client */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '24px' }}>
              <SCard style={{ padding: '24px' }}>
                <p style={{ color: S.text, fontWeight: 600, marginBottom: '20px' }}>From (Your Company)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Company Name</label>
                    <input style={inputStyle} value={invoice.company?.name || ''} onChange={e => updateCompany('name', e.target.value)} placeholder="Your Company Name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Address</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={invoice.company?.address || ''} onChange={e => updateCompany('address', e.target.value)} placeholder="123 Business St, City, State" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={invoice.company?.email || ''} onChange={e => updateCompany('email', e.target.value)} placeholder="hello@company.com" /></div>
                    <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={invoice.company?.phone || ''} onChange={e => updateCompany('phone', e.target.value)} placeholder="+1 (555) 123-4567" /></div>
                    <div><label style={labelStyle}>Website</label><input style={inputStyle} value={invoice.company?.website || ''} onChange={e => updateCompany('website', e.target.value)} placeholder="www.company.com" /></div>
                    <div><label style={labelStyle}>Tax ID</label><input style={inputStyle} value={invoice.company?.taxNumber || ''} onChange={e => updateCompany('taxNumber', e.target.value)} placeholder="12-3456789" /></div>
                  </div>
                </div>
              </SCard>

              <SCard style={{ padding: '24px' }}>
                <p style={{ color: S.text, fontWeight: 600, marginBottom: '20px' }}>Bill To (Client)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div><label style={labelStyle}>Client Name</label><input style={inputStyle} value={invoice.client?.name || ''} onChange={e => updateClient('name', e.target.value)} placeholder="Client Name" /></div>
                  <div><label style={labelStyle}>Company (Optional)</label><input style={inputStyle} value={invoice.client?.company || ''} onChange={e => updateClient('company', e.target.value)} placeholder="Client Company" /></div>
                  <div><label style={labelStyle}>Address</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={invoice.client?.address || ''} onChange={e => updateClient('address', e.target.value)} placeholder="456 Client St, City, State" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={invoice.client?.email || ''} onChange={e => updateClient('email', e.target.value)} placeholder="client@email.com" /></div>
                    <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={invoice.client?.phone || ''} onChange={e => updateClient('phone', e.target.value)} placeholder="+1 (555) 987-6543" /></div>
                  </div>
                </div>
              </SCard>
            </div>

            {/* Items */}
            <SCard style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ color: S.text, fontWeight: 600 }}>Invoice Items</p>
                <button style={{ ...ghostBtn, fontSize: '12px', padding: '5px 10px' }} onClick={addItem}>Add Item</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {invoice.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', paddingBottom: '16px', borderBottom: `1px solid ${S.border}` }}>
                    <div style={{ flex: 2 }}><label style={labelStyle}>Description</label><input style={inputStyle} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Service description" /></div>
                    <div style={{ flex: '0 0 80px' }}><label style={labelStyle}>Qty</label><input style={inputStyle} type="number" min="0" step="0.01" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} /></div>
                    <div style={{ flex: '0 0 100px' }}><label style={labelStyle}>Rate</label><input style={inputStyle} type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} /></div>
                    <div style={{ flex: '0 0 120px' }}><label style={labelStyle}>Amount</label><div style={{ ...inputStyle, background: S.surface2 }}>{formatCurrency(item.amount, invoice.currency || 'USD')}</div></div>
                    <button style={{ ...ghostBtn, padding: '8px 12px', flexShrink: 0, color: invoice.items?.length === 1 ? S.border : S.muted }} onClick={() => removeItem(item.id)} disabled={invoice.items?.length === 1}>Remove</button>
                  </div>
                ))}
              </div>
            </SCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Logo */}
            <SCard style={{ padding: '24px' }}>
              <p style={{ color: S.text, fontWeight: 600, marginBottom: '16px' }}>Company Logo</p>
              {!companyLogo ? (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: `2px dashed ${S.border}`, borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                  <p style={{ color: S.muted, fontSize: '13px', marginBottom: '4px' }}>Click to upload logo</p>
                  <p style={{ color: S.muted, fontSize: '11px' }}>PNG, JPG up to 2MB</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: S.bg, padding: '16px', borderRadius: '6px', textAlign: 'center', border: `1px solid ${S.border}` }}>
                    <img src={companyLogo} alt="Logo" style={{ maxHeight: '64px', margin: '0 auto' }} />
                  </div>
                  <button style={ghostBtn} onClick={removeLogo}>Remove Logo</button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </SCard>

            {/* Tax */}
            <SCard style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ color: S.text, fontWeight: 600 }}>Tax Configuration</p>
                <button style={{ ...ghostBtn, fontSize: '12px', padding: '5px 10px' }} onClick={addTax}>Add Tax</button>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Tax Region</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="EU">European Union</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invoice.taxes?.map((tax, idx) => (
                  <div key={idx} style={{ background: S.surface2, border: `1px solid ${S.border}`, borderRadius: '6px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <select style={{ ...inputStyle, width: 'auto', background: S.surface, appearance: 'none' }} value={tax.name} onChange={e => {
                        const sTax = taxRates[selectedRegion as keyof typeof taxRates]?.find(t => t.name === e.target.value)
                        if (sTax) { updateTax(idx, 'name', e.target.value); updateTax(idx, 'rate', sTax.rate) }
                      }}>
                        {taxRates[selectedRegion as keyof typeof taxRates]?.map(opt => <option key={opt.name} value={opt.name}>{opt.name} ({opt.rate}%)</option>)}
                      </select>
                      <button style={{ ...ghostBtn, padding: '4px 8px', fontSize: '11px' }} onClick={() => removeTax(idx)}>Remove</button>
                    </div>
                    <p style={{ color: S.muted, fontSize: '12px' }}>Amount: {formatCurrency(tax.amount, invoice.currency || 'USD')}</p>
                  </div>
                ))}
              </div>
            </SCard>

            {/* Totals Box */}
            <SCard style={{ padding: '24px', background: S.bg, borderColor: S.border }}>
              <p style={{ color: S.text, fontWeight: 600, marginBottom: '16px' }}>Invoice Totals</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: S.text }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: S.muted }}>Subtotal:</span><span>{formatCurrency(invoice.subtotal || 0, invoice.currency || 'USD')}</span></div>
                {invoice.taxes?.map((tax, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: S.muted }}>{tax.name} ({tax.rate}%):</span><span>{formatCurrency(tax.amount, invoice.currency || 'USD')}</span></div>
                ))}
                {invoice.discount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: S.success }}><span style={{ color: S.muted }}>Discount:</span><span>-{formatCurrency(invoice.discount.amount, invoice.currency || 'USD')}</span></div>
                )}
                <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px', color: S.gold }}>
                  <span>Total:</span><span>{formatCurrency(invoice.total || 0, invoice.currency || 'USD')}</span>
                </div>
              </div>
            </SCard>

            {/* Theme Select */}
            <SCard style={{ padding: '24px' }}>
              <p style={{ color: S.text, fontWeight: 600, marginBottom: '16px' }}>Print Theme</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {invoiceThemes.map(theme => (
                  <div key={theme.id} onClick={() => handleThemeChange(theme.id)} style={{ padding: '12px', borderRadius: '6px', border: `1px solid ${selectedTheme === theme.id ? S.gold : S.border}`, background: selectedTheme === theme.id ? S.surface2 : S.surface, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.primaryColor, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: S.text, fontSize: '13px', fontWeight: selectedTheme === theme.id ? 700 : 500 }}>{theme.name}</p>
                        <p style={{ color: S.muted, fontSize: '11px' }}>{theme.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SCard>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <SCard style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${S.border}` }}>
            <p style={{ color: S.text, fontWeight: 600 }}>Invoice Preview</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={ghostBtn} onClick={copyToClipboard}>{copiedInvoice ? 'Copied!' : 'Copy Text'}</button>
              <button style={solidBtn} onClick={downloadPDF}>Download PDF</button>
            </div>
          </div>
          <div style={{ padding: '40px', minHeight: '800px', background: S.bg, color: selectedThemeData?.primaryColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>

              {/* Fake PDF document inner wrapper to show real print colors against white bg, since this previews the PDF */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                  {companyLogo && <img src={companyLogo} alt="Logo" style={{ maxHeight: '64px', marginBottom: '16px' }} />}
                  <h1 style={{ fontSize: '32px', fontWeight: 800, color: selectedThemeData?.accentColor, marginBottom: '8px' }}>INVOICE</h1>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>#{invoice.invoiceNumber}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '14px', color: '#444' }}>
                  <p><strong style={{ color: '#111' }}>Date:</strong> {invoice.date}</p>
                  <p><strong style={{ color: '#111' }}>Due:</strong> {invoice.dueDate}</p>
                  <p><strong style={{ color: '#111' }}>Currency:</strong> {invoice.currency}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px', fontSize: '14px', color: '#444' }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: selectedThemeData?.accentColor, marginBottom: '12px', fontSize: '12px', letterSpacing: '0.05em' }}>FROM:</h3>
                  <p style={{ fontWeight: 600, color: '#111' }}>{invoice.company?.name}</p>
                  <p style={{ whiteSpace: 'pre-line' }}>{invoice.company?.address}</p>
                  <p>{invoice.company?.email}</p>
                  <p>{invoice.company?.phone}</p>
                  {invoice.company?.website && <p>{invoice.company.website}</p>}
                  {invoice.company?.taxNumber && <p>Tax ID: {invoice.company.taxNumber}</p>}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: selectedThemeData?.accentColor, marginBottom: '12px', fontSize: '12px', letterSpacing: '0.05em' }}>TO:</h3>
                  <p style={{ fontWeight: 600, color: '#111' }}>{invoice.client?.name}</p>
                  {invoice.client?.company && <p>{invoice.client.company}</p>}
                  <p style={{ whiteSpace: 'pre-line' }}>{invoice.client?.address}</p>
                  <p>{invoice.client?.email}</p>
                  <p>{invoice.client?.phone}</p>
                </div>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: (selectedThemeData?.accentColor || '#000') + '10' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#111' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd', color: '#111' }}>Qty</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd', color: '#111' }}>Rate</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd', color: '#111' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#444' }}>{item.description}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center', color: '#444' }}>{item.quantity}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#444' }}>{formatCurrency(item.rate, invoice.currency || 'USD')}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#111', fontWeight: 500 }}>{formatCurrency(item.amount, invoice.currency || 'USD')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <div style={{ width: '250px', fontSize: '14px', color: '#444' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                    <span>Subtotal:</span><span>{formatCurrency(invoice.subtotal || 0, invoice.currency || 'USD')}</span>
                  </div>
                  {invoice.taxes?.map((tax, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                      <span>{tax.name} ({tax.rate}%):</span><span>{formatCurrency(tax.amount, invoice.currency || 'USD')}</span>
                    </div>
                  ))}
                  {invoice.discount && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', color: '#2e7d32' }}>
                      <span>Discount:</span><span>-{formatCurrency(invoice.discount.amount, invoice.currency || 'USD')}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '2px solid #ddd', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', color: selectedThemeData?.accentColor }}>
                    <span>TOTAL:</span><span>{formatCurrency(invoice.total || 0, invoice.currency || 'USD')}</span>
                  </div>
                </div>
              </div>

              {invoice.paymentTerms?.notes && (
                <div style={{ marginBottom: '24px', fontSize: '14px', color: '#444' }}>
                  <p style={{ fontWeight: 700, color: selectedThemeData?.accentColor, marginBottom: '8px', fontSize: '12px', letterSpacing: '0.05em' }}>PAYMENT TERMS:</p>
                  <p>{invoice.paymentTerms.notes}</p>
                </div>
              )}
              {invoice.paymentTerms?.paymentMethods && (
                <div style={{ marginBottom: '24px', fontSize: '14px', color: '#444' }}>
                  <p style={{ fontWeight: 700, color: selectedThemeData?.accentColor, marginBottom: '8px', fontSize: '12px', letterSpacing: '0.05em' }}>PAYMENT METHODS:</p>
                  <p>{invoice.paymentTerms.paymentMethods.join(', ')}</p>
                </div>
              )}
              {invoice.notes && (
                <div style={{ fontSize: '14px', color: '#444' }}>
                  <p style={{ fontWeight: 700, color: selectedThemeData?.accentColor, marginBottom: '8px', fontSize: '12px', letterSpacing: '0.05em' }}>NOTES:</p>
                  <p style={{ whiteSpace: 'pre-line' }}>{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </SCard>
      )}
    </div>
  )
}

export default function InvoiceGenerator() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div style={{ color: '#9E9880', fontSize: '14px' }}>Loading...</div>}>
        <InvoiceContent />
      </Suspense>
    </DashboardLayout>
  )
}