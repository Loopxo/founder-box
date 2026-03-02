"use client"

import { useState } from 'react'
import PitchForm from '@/components/PitchForm'
import DashboardLayout from '@/components/DashboardLayout'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import * as XLSX from 'xlsx'
import PricingEditor, { PricingPackage } from '@/components/PricingEditor'
import { industryTemplates } from '@/lib/templates'
import type { ClientFormData } from '@/lib/schemas'

interface ClientRow {
  id: string
  data: Partial<ClientFormData>
  status: 'pending' | 'processing' | 'success' | 'error'
  error?: string
  pdfUrl?: string
}

function ProposalPageContent() {
  const { addToast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkClients, setBulkClients] = useState<ClientRow[]>([])
  const [bulkStep, setBulkStep] = useState<'upload' | 'configure' | 'generate'>('upload')
  const [globalPricing, setGlobalPricing] = useState<PricingPackage[]>(industryTemplates.doctors.pricing)
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false)
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 })

  const handleSubmit = async (data: ClientFormData) => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const fileName = `${data.agencyConfig?.name || data.businessName || 'Proposal'}_${data.businessName}_${new Date().toISOString().split('T')[0]}.pdf`
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        addToast({
          type: 'success',
          title: 'Proposal Generated Successfully!',
          message: `Your proposal "${fileName}" has been downloaded.`,
          duration: 5000,
        })
      } else {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to generate PDF')
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      addToast({
        type: 'error',
        title: 'Failed to Generate Proposal',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 7000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBulkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

      const limitedData = jsonData.slice(0, 10)

      const parsedClients: ClientRow[] = limitedData.map((row, index) => ({
        id: `client-${Date.now()}-${index}`,
        data: {
          clientName: row.clientName || '',
          clientEmail: row.clientEmail || '',
          clientPhone: row.clientPhone || '',
          businessName: row.businessName || '',
          industry: row.industry || 'doctors',
          services: row.services ? row.services.split(',').map((s: string) => s.trim()) : [],
          timeline: row.timeline || '1-2months',
          currentWebsite: row.currentWebsite || '',
          specialRequirements: row.specialRequirements || '',
        },
        status: 'pending'
      }))

      setBulkClients(parsedClients)
      setBulkStep('configure')
    } catch (error) {
      console.error('Error parsing file:', error)
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Error parsing file. Please check the format.',
        duration: 5000,
      })
    }
  }

  const downloadTemplate = () => {
    const template = [{
      clientName: 'John Smith',
      clientEmail: 'john@example.com (Optional)',
      clientPhone: '+1-555-0123',
      businessName: 'Smith Fitness',
      industry: 'gym',
      services: 'Website Design, SEO, Social Media',
      timeline: '1-2months',
      currentWebsite: 'https://example.com (Optional)',
      specialRequirements: 'Need booking system (Optional)'
    }]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Clients')
    XLSX.writeFile(wb, 'bulk-proposal-template.xlsx')
  }

  const generateAllBulk = async () => {
    setIsGeneratingBulk(true)
    setBulkStep('generate')
    setBulkProgress({ current: 0, total: bulkClients.length })

    for (let i = 0; i < bulkClients.length; i++) {
      const client = bulkClients[i]

      setBulkClients(prev => prev.map((c, idx) =>
        idx === i ? { ...c, status: 'processing' } : c
      ))

      try {
        const requestData = {
          ...client.data,
          customPricing: globalPricing
        }

        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)

          setBulkClients(prev => prev.map((c, idx) =>
            idx === i ? { ...c, status: 'success', pdfUrl: url } : c
          ))
        } else {
          throw new Error('Failed to generate PDF')
        }
      } catch (error) {
        setBulkClients(prev => prev.map((c, idx) =>
          idx === i ? { ...c, status: 'error', error: 'Generation failed' } : c
        ))
      }

      setBulkProgress({ current: i + 1, total: bulkClients.length })
    }

    setIsGeneratingBulk(false)
  }

  const downloadAllBulk = async () => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    for (const client of bulkClients) {
      if (client.status === 'success' && client.pdfUrl) {
        const response = await fetch(client.pdfUrl)
        const blob = await response.blob()
        const fileName = `${client.data.businessName || 'Proposal'}_${new Date().toISOString().split('T')[0]}.pdf`
        zip.file(fileName, blob)
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `Bulk_Proposals_${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  const closeBulkModal = () => {
    setShowBulkModal(false)
    setBulkClients([])
    setBulkStep('upload')
    setGlobalPricing(industryTemplates.doctors.pricing)
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#EDE9DC', marginBottom: '4px' }}>Proposal Generator</h1>
            <p style={{ color: '#9E9880', fontSize: '14px' }}>Create professional, client-ready proposals with custom themes and branding.</p>
          </div>
          <button
            onClick={() => setShowBulkModal(true)}
            style={{ background: '#D4A853', color: '#111118', fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', padding: '9px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#C49843')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#D4A853')}
          >
            Bulk Generator
          </button>
        </div>
        <PitchForm onSubmit={handleSubmit} isGenerating={isGenerating} />

        {/* PDF Generation Loading Modal */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div style={{ background: '#18181F', border: '1px solid #D4A853', borderRadius: '8px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #D4A853', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#EDE9DC', marginBottom: '8px' }}>Generating Your Proposal</h3>
              <p style={{ color: '#9E9880', fontSize: '14px' }}>Please wait while we create your professional proposal...</p>
            </div>
          </div>
        )}

        {/* Bulk Generator Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div style={{ background: '#18181F', border: '1px solid #2A2A38', borderRadius: '8px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ position: 'sticky', top: 0, background: '#18181F', borderBottom: '1px solid #2A2A38', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#EDE9DC' }}>Bulk Proposal Generator</h2>
                <button onClick={closeBulkModal} style={{ color: '#9E9880', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EDE9DC')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9880')}>✕</button>
              </div>

              {/* Step 1: Upload */}
              {bulkStep === 'upload' && (
                <div style={{ padding: '24px' }}>
                  <div style={{ background: '#111118', border: '2px dashed #2A2A38', borderRadius: '6px', padding: '40px 24px', textAlign: 'center' }}>
                    <label style={{ cursor: 'pointer' }}>
                      <p style={{ color: '#EDE9DC', fontWeight: 600, marginBottom: '4px' }}>Click to upload</p>
                      <p style={{ color: '#9E9880', fontSize: '13px' }}>or drag and drop — Excel file, max 10 clients</p>
                      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleBulkFileUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    style={{ width: '100%', marginTop: '12px', padding: '10px', background: '#1E1E28', border: '1px solid #2A2A38', borderRadius: '6px', color: '#9E9880', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#EDE9DC')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9880')}
                  >
                    Download Template
                  </button>
                </div>
              )}

              {/* Step 2: Configure Pricing */}
              {bulkStep === 'configure' && (
                <div style={{ padding: '24px' }} className="space-y-6">
                  <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '6px', padding: '16px' }}>
                    <h3 style={{ color: '#EDE9DC', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{bulkClients.length} Clients Uploaded</h3>
                    <p style={{ color: '#9E9880', fontSize: '13px' }}>Configure pricing below — these settings apply to all clients.</p>
                  </div>

                  <div>
                    <h3 style={{ color: '#EDE9DC', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Global Pricing</h3>
                    <p style={{ color: '#9E9880', fontSize: '13px', marginBottom: '20px' }}>Set pricing packages for all {bulkClients.length} proposals.</p>
                    <PricingEditor packages={globalPricing} onPackagesChange={setGlobalPricing} currency="USD" />
                  </div>

                  <div>
                    <h3 style={{ color: '#EDE9DC', fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>Client List</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                      {bulkClients.map((client, index) => (
                        <div key={client.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#111118', border: '1px solid #2A2A38', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,168,83,0.12)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{index + 1}</span>
                            <div>
                              <p style={{ color: '#EDE9DC', fontWeight: 500, fontSize: '14px' }}>{client.data.businessName || 'N/A'}</p>
                              <p style={{ color: '#9E9880', fontSize: '12px' }}>{client.data.clientName || 'N/A'}</p>
                            </div>
                          </div>
                          <span style={{ color: '#9E9880', fontSize: '12px' }}>{client.data.industry || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => { setBulkClients([]); setBulkStep('upload') }} style={{ flex: 1, padding: '10px', background: '#1E1E28', border: '1px solid #2A2A38', borderRadius: '6px', color: '#9E9880', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                    <button onClick={generateAllBulk} style={{ flex: 1, padding: '10px', background: '#D4A853', color: '#111118', fontWeight: 700, fontSize: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#C49843')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#D4A853')}
                    >Generate All Proposals</button>
                  </div>
                </div>
              )}

              {/* Step 3: Generate & Download */}
              {bulkStep === 'generate' && (
                <div style={{ padding: '24px' }} className="space-y-6">
                  {isGeneratingBulk && (
                    <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '6px', padding: '32px', textAlign: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #D4A853', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                      <h3 style={{ color: '#EDE9DC', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Generating Proposals...</h3>
                      <p style={{ color: '#9E9880', fontSize: '14px' }}>{bulkProgress.current} of {bulkProgress.total} complete</p>
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ color: '#EDE9DC', fontWeight: 700, fontSize: '16px' }}>Results</h3>
                      {bulkClients.some(c => c.status === 'success') && (
                        <button onClick={downloadAllBulk}
                          style={{ padding: '8px 16px', background: '#D4A853', color: '#111118', fontWeight: 700, fontSize: '13px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#C49843')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#D4A853')}
                        >Download All (ZIP)</button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '384px', overflowY: 'auto' }}>
                      {bulkClients.map((client, index) => (
                        <div key={client.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#111118', border: '1px solid #2A2A38', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1E1E28', color: '#EDE9DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
                            <div>
                              <p style={{ color: '#EDE9DC', fontWeight: 500, fontSize: '14px' }}>{client.data.businessName || 'N/A'}</p>
                              <p style={{ color: '#9E9880', fontSize: '12px' }}>{client.data.clientName || 'N/A'}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {client.status === 'pending' && <span style={{ color: '#9E9880', fontSize: '12px' }}>Waiting</span>}
                            {client.status === 'processing' && <span style={{ color: '#D4A853', fontSize: '12px', fontWeight: 600 }}>Generating...</span>}
                            {client.status === 'success' && (
                              <>
                                <span style={{ color: '#4D9E6A', fontSize: '12px', fontWeight: 600 }}>Done</span>
                                {client.pdfUrl && (
                                  <a href={client.pdfUrl} download={`${client.data.businessName}_Proposal.pdf`}
                                    style={{ color: '#D4A853', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                                  >Download</a>
                                )}
                              </>
                            )}
                            {client.status === 'error' && <span style={{ color: '#C0514A', fontSize: '12px' }}>{client.error}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isGeneratingBulk && (
                    <button onClick={closeBulkModal}
                      style={{ width: '100%', padding: '10px', background: '#1E1E28', border: '1px solid #2A2A38', borderRadius: '6px', color: '#9E9880', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                    >Close</button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function ProposalPage() {
  return (
    <ToastProvider>
      <ProposalPageContent />
    </ToastProvider>
  )
}
