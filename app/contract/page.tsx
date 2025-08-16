"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { contractCategories, contractTemplates, standardClauses, ContractTemplate, ContractField } from '@/lib/contract-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Copy, Download, Upload, RotateCcw, FileText, Building, Scale, Home, DollarSign, HardHat, Search, X } from 'lucide-react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    employment: Building,
    business: FileText,
    legal: Scale,
    property: Home,
    financial: DollarSign,
    construction: HardHat
  }

  const filteredTemplates = contractTemplates.filter(template => {
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true
    const matchesSearch = searchQuery ? 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  // URL state management
  useEffect(() => {
    const category = searchParams.get('category')
    const templateId = searchParams.get('template')
    
    if (category) {
      setSelectedCategory(category)
    }
    if (templateId) {
      const template = contractTemplates.find(t => t.id === templateId)
      if (template) {
        handleTemplateSelect(template)
      }
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
    // Initialize inputs
    const initialInputs: Record<string, string> = {}
    template.customizationFields.forEach(field => {
      initialInputs[field.id] = ''
    })
    setContractInputs(initialInputs)
    setSelectedClauses([])
  }

  const handleTemplateSelectWithUrl = (template: ContractTemplate) => {
    handleTemplateSelect(template)
    updateUrl(selectedCategory, template.id)
  }

  const goBackToCategories = () => {
    setSelectedCategory(null)
    setSelectedTemplate(null)
    updateUrl()
  }

  const goBackToTemplates = () => {
    setSelectedTemplate(null)
    updateUrl(selectedCategory)
  }

  const resetContract = () => {
    if (selectedTemplate) {
      const initialInputs: Record<string, string> = {}
      selectedTemplate.customizationFields.forEach(field => {
        initialInputs[field.id] = ''
      })
      setContractInputs(initialInputs)
      setSelectedClauses([])
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setCompanyLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatCurrency = (value: string) => {
    const number = parseFloat(value)
    if (isNaN(number)) return value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(number)
  }

  const generateContract = () => {
    if (!selectedTemplate) return ''

    let contract = selectedTemplate.content

    // Replace all placeholders with user inputs
    Object.entries(contractInputs).forEach(([fieldId, value]) => {
      const field = selectedTemplate.customizationFields.find(f => f.id === fieldId)
      if (field && value) {
        const formattedValue = field.type === 'currency' ? formatCurrency(value) : value
        contract = contract.replaceAll(`[${fieldId}]`, formattedValue)
      }
    })

    // Add selected clauses
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
    const contract = generateContract()
    navigator.clipboard.writeText(contract)
    setCopiedContract(true)
    setTimeout(() => setCopiedContract(false), 2000)
  }

  const downloadPDF = async () => {
    try {
      const contract = generateContract()
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: contract,
          title: selectedTemplate?.title || 'Contract',
          logo: companyLogo
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${selectedTemplate?.title?.replace(/\s+/g, '_') || 'contract'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error generating PDF. Please try again.')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const groupFieldsBySection = (fields: ContractField[]) => {
    const grouped: Record<string, ContractField[]> = {}
    fields.forEach(field => {
      if (!grouped[field.section]) {
        grouped[field.section] = []
      }
      grouped[field.section].push(field)
    })
    return grouped
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Contract Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate legally sound contracts with customizable templates, branding options, 
            and professional formatting for all your business needs.
          </p>
        </div>

        <Tabs defaultValue="contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Contract Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-6">
            {!selectedCategory && !selectedTemplate && (
              <>
                {/* Search All Contracts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search All Contracts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Search contracts by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />
                    {searchQuery && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Found {filteredTemplates.length} contracts
                        </p>
                        <div className="grid gap-3">
                          {filteredTemplates.slice(0, 6).map((template) => (
                            <div 
                              key={template.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                              onClick={() => handleTemplateSelectWithUrl(template)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <span className="text-lg">{template.icon}</span>
                                  {template.title}
                                </h4>
                                <Badge variant="outline">
                                  {contractCategories.find(c => c.id === template.category)?.name}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {template.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contract Categories */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    Choose Contract Category
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contractCategories.map((category) => {
                      const IconComponent = categoryIcons[category.id]
                      return (
                        <Card 
                          key={category.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow group border-2 hover:border-blue-300"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <CardHeader className="text-center">
                            <div className="text-4xl mb-2">{category.icon}</div>
                            <CardTitle className="text-lg group-hover:text-blue-600 flex items-center justify-center gap-2">
                              <IconComponent className="w-5 h-5" />
                              {category.name}
                            </CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="text-center">
                            <Badge variant="secondary">
                              {contractTemplates.filter(t => t.category === category.id).length} templates
                            </Badge>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {selectedCategory && !selectedTemplate && (
              <>
                {/* Category Templates List */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {contractCategories.find(c => c.id === selectedCategory)?.name} Templates
                    </h2>
                    <p className="text-gray-600">
                      {filteredTemplates.length} professional contract templates
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={goBackToCategories}
                  >
                    ← Back to Categories
                  </Button>
                </div>

                <div className="grid gap-4">
                  {filteredTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleTemplateSelectWithUrl(template)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{template.title}</CardTitle>
                              <CardDescription>{template.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {template.customizationFields.length} fields
                            </Badge>
                            <Badge variant="secondary">
                              {template.clauses.length} clauses
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {selectedTemplate && (
              <>
                {/* Contract Builder */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <span className="text-2xl">{selectedTemplate.icon}</span>
                      {selectedTemplate.title}
                    </h2>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={goBackToTemplates}
                    >
                      ← Back to Templates
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={goBackToCategories}
                    >
                      All Categories
                    </Button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column: Contract Fields */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Logo Upload */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Company Branding</CardTitle>
                        <CardDescription>
                          Upload your company logo for professional contracts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!companyLogo ? (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload logo</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <img 
                                src={companyLogo} 
                                alt="Company Logo" 
                                className="max-h-20 mx-auto"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={removeLogo}
                              className="w-full"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove Logo
                            </Button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </CardContent>
                    </Card>

                    {/* Contract Fields */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Contract Details</CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetContract}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                        </div>
                        <CardDescription>
                          Fill in the details for your contract
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(groupFieldsBySection(selectedTemplate.customizationFields)).map(([section, fields]) => (
                            <AccordionItem key={section} value={section}>
                              <AccordionTrigger className="text-sm font-medium">
                                {section} ({fields.length} fields)
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-2">
                                  {fields.map((field) => (
                                    <div key={field.id}>
                                      <Label htmlFor={field.id} className="text-sm font-medium">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                      </Label>
                                      {field.type === 'textarea' ? (
                                        <Textarea
                                          id={field.id}
                                          value={contractInputs[field.id] || ''}
                                          onChange={(e) => setContractInputs({
                                            ...contractInputs,
                                            [field.id]: e.target.value
                                          })}
                                          placeholder={field.placeholder}
                                          className="mt-1"
                                        />
                                      ) : (
                                        <Input
                                          id={field.id}
                                          type={field.type === 'currency' ? 'number' : field.type}
                                          value={contractInputs[field.id] || ''}
                                          onChange={(e) => setContractInputs({
                                            ...contractInputs,
                                            [field.id]: e.target.value
                                          })}
                                          placeholder={field.placeholder}
                                          className="mt-1"
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>

                    {/* Optional Clauses */}
                    {selectedTemplate.clauses.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Optional Clauses</CardTitle>
                          <CardDescription>
                            Select additional clauses to include
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedTemplate.clauses.map((clause) => (
                              <label key={clause.id} className="flex items-start space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedClauses.includes(clause.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedClauses([...selectedClauses, clause.id])
                                    } else {
                                      setSelectedClauses(selectedClauses.filter(id => id !== clause.id))
                                    }
                                  }}
                                  className="mt-1"
                                />
                                <div>
                                  <div className="font-medium text-sm">{clause.title}</div>
                                  <div className="text-xs text-gray-600">{clause.content}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Right Column: Contract Preview */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Contract Preview</CardTitle>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              onClick={copyToClipboard}
                              disabled={!generateContract().trim()}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              {copiedContract ? 'Copied!' : 'Copy Text'}
                            </Button>
                            <Button 
                              onClick={downloadPDF}
                              disabled={!generateContract().trim()}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white border rounded-lg p-6 min-h-[600px] font-mono text-sm overflow-auto">
                          {companyLogo && (
                            <div className="text-center mb-6">
                              <img 
                                src={companyLogo} 
                                alt="Company Logo" 
                                className="max-h-16 mx-auto mb-4"
                              />
                            </div>
                          )}
                          <pre className="whitespace-pre-wrap">
                            {generateContract() || 'Fill in the contract details to see the preview...'}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
    </div>
  )
}

export default function ContractGenerator() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <ContractContent />
      </Suspense>
    </main>
  )
}