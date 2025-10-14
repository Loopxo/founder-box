"use client"

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle, XCircle, Package, Edit2, X, Trash2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { ClientFormData } from '@/lib/schemas'
import PricingEditor, { PricingPackage } from '@/components/PricingEditor'
import { industryTemplates } from '@/lib/templates'

interface ClientRow {
  id: string
  data: Partial<ClientFormData>
  status: 'pending' | 'processing' | 'success' | 'error'
  error?: string
  pdfUrl?: string
  customPricing?: PricingPackage[]
}

export default function BulkProposalPage() {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editTab, setEditTab] = useState<'details' | 'pricing' | 'services'>('details')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

      // Limit to 10 clients
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

      setClients(parsedClients)
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Error parsing file. Please check the format.')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        clientName: 'John Smith',
        clientEmail: 'john@example.com (Optional)',
        clientPhone: '+1-555-0123',
        businessName: 'Smith Fitness',
        industry: 'gym',
        services: 'Website Design, SEO, Social Media',
        timeline: '1-2months',
        currentWebsite: 'https://example.com (Optional)',
        specialRequirements: 'Need booking system (Optional)'
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Clients')
    XLSX.writeFile(wb, 'bulk-proposal-template.xlsx')
  }

  const generateAll = async () => {
    setIsGenerating(true)
    setProgress({ current: 0, total: clients.length })

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i]

      // Update status to processing
      setClients(prev => prev.map((c, idx) =>
        idx === i ? { ...c, status: 'processing' } : c
      ))

      try {
        // Call API to generate PDF with custom pricing if available
        const requestData = {
          ...client.data,
          customPricing: client.customPricing
        }

        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)

          setClients(prev => prev.map((c, idx) =>
            idx === i ? { ...c, status: 'success', pdfUrl: url } : c
          ))
        } else {
          throw new Error('Failed to generate PDF')
        }
      } catch (error) {
        setClients(prev => prev.map((c, idx) =>
          idx === i ? { ...c, status: 'error', error: 'Generation failed' } : c
        ))
      }

      setProgress({ current: i + 1, total: clients.length })
    }

    setIsGenerating(false)
  }

  const downloadAll = async () => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    for (const client of clients) {
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

  const handleEditClient = (index: number) => {
    const client = clients[index]
    setEditingIndex(index)

    // Initialize custom pricing if not exists
    const industry = client.data.industry || 'doctors'
    const template = industryTemplates[industry]

    setEditingClient({
      ...client,
      customPricing: client.customPricing || template?.pricing || []
    })
    setEditTab('details')
  }

  const handleSaveClient = () => {
    if (editingIndex !== null && editingClient) {
      const updatedClients = [...clients]
      updatedClients[editingIndex] = editingClient
      setClients(updatedClients)
      setEditingIndex(null)
      setEditingClient(null)
      setEditTab('details')
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingClient(null)
    setEditTab('details')
  }

  const handleDeleteClient = (index: number) => {
    if (confirm('Are you sure you want to remove this client?')) {
      setClients(clients.filter((_, i) => i !== index))
    }
  }

  const updateEditingClientField = (field: keyof ClientFormData, value: any) => {
    if (editingClient) {
      setEditingClient({
        ...editingClient,
        data: {
          ...editingClient.data,
          [field]: value
        }
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bulk Proposal Generator</h1>
          <p className="text-slate-300">
            Upload an Excel file with up to 10 clients and generate proposals in bulk
          </p>
        </div>

        {/* Upload Section */}
        {clients.length === 0 && (
          <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Upload Client Data</CardTitle>
              <CardDescription className="text-slate-400">
                Upload an Excel file (.xlsx) with your client information
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
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-sm text-slate-500 mt-2">Excel file (max 10 clients)</p>
              </div>

              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Client List */}
        {clients.length > 0 && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={generateAll}
                disabled={isGenerating}
                className="bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white font-bold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating {progress.current}/{progress.total}
                  </>
                ) : (
                  'Generate All Proposals'
                )}
              </Button>

              {clients.some(c => c.status === 'success') && (
                <>
                  <Button
                    onClick={downloadAll}
                    className="bg-slate-800 border border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Download ZIP
                  </Button>
                </>
              )}

              <Button
                onClick={() => setClients([])}
                variant="outline"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Upload New File
              </Button>
            </div>

            {/* Client Table */}
            <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  {clients.map((client, index) => (
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
                          <>
                            <span className="text-slate-400 text-sm mr-2">Waiting</span>
                            <Button
                              onClick={() => handleEditClient(index)}
                              size="sm"
                              variant="outline"
                              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteClient(index)}
                              size="sm"
                              variant="outline"
                              className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
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
                                className="text-electric-blue hover:underline text-sm"
                              >
                                <Download className="w-4 h-4 inline mr-1" />
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {editingClient && editingIndex !== null && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Customize Proposal</h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTab('details')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      editTab === 'details'
                        ? 'bg-electric-blue text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Client Details
                  </button>
                  <button
                    onClick={() => setEditTab('pricing')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      editTab === 'pricing'
                        ? 'bg-electric-blue text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Pricing Packages
                  </button>
                  <button
                    onClick={() => setEditTab('services')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      editTab === 'services'
                        ? 'bg-electric-blue text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Services
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Client Details Tab */}
                {editTab === 'details' && (
                  <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="text-white">Client Name</Label>
                  <Input
                    id="clientName"
                    value={editingClient.data.clientName || ''}
                    onChange={(e) => updateEditingClientField('clientName', e.target.value)}
                    placeholder="John Doe"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="clientEmail" className="text-white">
                    Client Email <span className="text-slate-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={editingClient.data.clientEmail || ''}
                    onChange={(e) => updateEditingClientField('clientEmail', e.target.value)}
                    placeholder="john@example.com"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="clientPhone" className="text-white">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    value={editingClient.data.clientPhone || ''}
                    onChange={(e) => updateEditingClientField('clientPhone', e.target.value)}
                    placeholder="+1-555-0123"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="businessName" className="text-white">Business Name</Label>
                  <Input
                    id="businessName"
                    value={editingClient.data.businessName || ''}
                    onChange={(e) => updateEditingClientField('businessName', e.target.value)}
                    placeholder="Acme Corp"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="text-white">Industry</Label>
                  <select
                    id="industry"
                    value={editingClient.data.industry || 'doctors'}
                    onChange={(e) => updateEditingClientField('industry', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="doctors">Doctors</option>
                    <option value="dentists">Dentists</option>
                    <option value="restaurants">Restaurants</option>
                    <option value="gym">Gym</option>
                    <option value="salons">Salons</option>
                    <option value="lawyers">Lawyers</option>
                    <option value="realestate">Real Estate</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="services" className="text-white">Services (comma-separated)</Label>
                  <Input
                    id="services"
                    value={Array.isArray(editingClient.data.services) ? editingClient.data.services.join(', ') : ''}
                    onChange={(e) => updateEditingClientField('services', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Website Design, SEO, Social Media"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="timeline" className="text-white">Timeline</Label>
                  <select
                    id="timeline"
                    value={editingClient.data.timeline || '1-2months'}
                    onChange={(e) => updateEditingClientField('timeline', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="1-2weeks">1-2 Weeks</option>
                    <option value="2-4weeks">2-4 Weeks</option>
                    <option value="1-2months">1-2 Months</option>
                    <option value="2-3months">2-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="currentWebsite" className="text-white">Current Website (Optional)</Label>
                  <Input
                    id="currentWebsite"
                    value={editingClient.data.currentWebsite || ''}
                    onChange={(e) => updateEditingClientField('currentWebsite', e.target.value)}
                    placeholder="https://example.com"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequirements" className="text-white">Special Requirements (Optional)</Label>
                  <Input
                    id="specialRequirements"
                    value={editingClient.data.specialRequirements || ''}
                    onChange={(e) => updateEditingClientField('specialRequirements', e.target.value)}
                    placeholder="Any special requirements..."
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {editTab === 'pricing' && (
                  <div>
                    <PricingEditor
                      packages={editingClient.customPricing || []}
                      onPackagesChange={(packages) => {
                        setEditingClient({
                          ...editingClient,
                          customPricing: packages
                        })
                      }}
                      currency="USD"
                    />
                  </div>
                )}

                {/* Services Tab */}
                {editTab === 'services' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white text-lg font-semibold mb-4 block">
                        What services will you provide?
                      </Label>
                      <p className="text-slate-400 text-sm mb-4">
                        Customize the services you'll provide to this client
                      </p>

                      <div className="space-y-3">
                        {[
                          'Website Design',
                          'Website Development',
                          'SEO Optimization',
                          'Social Media Marketing',
                          'Content Creation',
                          'Email Marketing',
                          'Branding',
                          'E-commerce Setup',
                          'Analytics Setup',
                          'Maintenance & Support'
                        ].map((service) => (
                          <div key={service} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`service-${service}`}
                              checked={(editingClient.data.services || []).includes(service)}
                              onChange={(e) => {
                                const currentServices = editingClient.data.services || []
                                const newServices = e.target.checked
                                  ? [...currentServices, service]
                                  : currentServices.filter(s => s !== service)
                                updateEditingClientField('services', newServices)
                              }}
                              className="w-5 h-5 rounded border-slate-600 text-electric-blue focus:ring-electric-blue bg-slate-800"
                            />
                            <Label htmlFor={`service-${service}`} className="text-white cursor-pointer">
                              {service}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6 flex gap-4">
                <Button
                  onClick={handleSaveClient}
                  className="flex-1 bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white font-bold"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex-1 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
