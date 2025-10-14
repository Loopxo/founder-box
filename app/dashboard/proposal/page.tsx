"use client"

import { useState } from 'react'
import PitchForm from '@/components/PitchForm'
import DashboardLayout from '@/components/DashboardLayout'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Upload, FileSpreadsheet, X, Download, Loader2, CheckCircle, XCircle } from 'lucide-react'
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
            <h1 className="text-3xl font-bold text-white mb-2">Proposal Launcher</h1>
            <p className="text-slate-300">
              Create stunning, professional proposals with customizable themes and branding
            </p>
          </div>
          <Button
            onClick={() => setShowBulkModal(true)}
            className="bg-gradient-to-r from-neon-orange to-electric-violet hover:from-neon-orange/80 hover:to-electric-violet/80 text-white font-bold shadow-lg"
          >
            <Package className="w-4 h-4 mr-2" />
            Bulk Generator
          </Button>
        </div>
        <PitchForm onSubmit={handleSubmit} isGenerating={isGenerating} />

        {/* PDF Generation Loading Modal */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border-2 border-electric-blue rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-electric-blue animate-spin mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Generating Your Proposal</h3>
                <p className="text-slate-400 mb-4">
                  Please wait while we create your professional proposal...
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Generator Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Bulk Proposal Generator</h2>
                <button
                  onClick={closeBulkModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Step 1: Upload */}
              {bulkStep === 'upload' && (
                <div className="p-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Upload Client Data</CardTitle>
                      <CardDescription className="text-slate-400">
                        Upload an Excel file (.xlsx) with up to 10 clients
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-electric-blue transition-colors">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <label className="cursor-pointer">
                          <span className="text-white font-medium">Click to upload</span>
                          <span className="text-slate-400"> or drag and drop</span>
                          <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleBulkFileUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-slate-500 mt-2">Excel file (max 10 clients)</p>
                      </div>

                      <Button
                        onClick={downloadTemplate}
                        variant="outline"
                        className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Configure Pricing */}
              {bulkStep === 'configure' && (
                <div className="p-6 space-y-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">
                      {bulkClients.length} Clients Uploaded
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Configure the pricing packages below. These settings will apply to all clients.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-bold mb-4">Global Pricing Configuration</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Set the pricing packages that will be used for all {bulkClients.length} proposals
                    </p>
                    <PricingEditor
                      packages={globalPricing}
                      onPackagesChange={setGlobalPricing}
                      currency="USD"
                    />
                  </div>

                  {/* Client Preview */}
                  <div>
                    <h3 className="text-white text-lg font-bold mb-4">Client List Preview</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {bulkClients.map((client, index) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{client.data.businessName || 'N/A'}</p>
                              <p className="text-slate-400 text-xs">{client.data.clientName || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-slate-400 text-xs">
                            {client.data.industry || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        setBulkClients([])
                        setBulkStep('upload')
                      }}
                      variant="outline"
                      className="flex-1 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      Back to Upload
                    </Button>
                    <Button
                      onClick={generateAllBulk}
                      className="flex-1 bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white font-bold"
                    >
                      Generate All Proposals
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Generate & Download */}
              {bulkStep === 'generate' && (
                <div className="p-6 space-y-6">
                  {/* Progress */}
                  {isGeneratingBulk && (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
                      <Loader2 className="w-12 h-12 text-electric-blue animate-spin mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">
                        Generating Proposals...
                      </h3>
                      <p className="text-slate-400">
                        {bulkProgress.current} of {bulkProgress.total} complete
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white text-lg font-bold">Results</h3>
                      {bulkClients.some(c => c.status === 'success') && (
                        <Button
                          onClick={downloadAllBulk}
                          className="bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white font-bold"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Download All as ZIP
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {bulkClients.map((client, index) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium">{client.data.businessName || 'N/A'}</p>
                              <p className="text-sm text-slate-400">{client.data.clientName || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {client.status === 'pending' && (
                              <span className="text-slate-400 text-sm">Waiting...</span>
                            )}
                            {client.status === 'processing' && (
                              <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
                            )}
                            {client.status === 'success' && (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                {client.pdfUrl && (
                                  <a
                                    href={client.pdfUrl}
                                    download={`${client.data.businessName}_Proposal.pdf`}
                                    className="text-electric-blue hover:underline text-sm flex items-center gap-1"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </a>
                                )}
                              </>
                            )}
                            {client.status === 'error' && (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 text-sm">{client.error}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isGeneratingBulk && (
                    <Button
                      onClick={closeBulkModal}
                      variant="outline"
                      className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      Close
                    </Button>
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
