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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Copy, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  RotateCcw, 
  FileText, 
  Calculator, 
  Eye,
  X,
  Building,
  User
} from 'lucide-react'

function InvoiceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [invoice, setInvoice] = useState<Partial<Invoice>>(() => createSampleInvoice())
  const [selectedRegion, setSelectedRegion] = useState<string>('US')
  const [selectedTheme, setSelectedTheme] = useState<string>('professional')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [copiedInvoice, setCopiedInvoice] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // URL state management
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

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...updates }))
  }

  const updateCompany = (field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      company: { ...prev.company!, [field]: value }
    }))
  }

  const updateClient = (field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client!, [field]: value }
    }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }))
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

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== id)
    }))
  }

  const addTax = () => {
    const regionTaxes = taxRates[selectedRegion as keyof typeof taxRates] || taxRates.US
    const defaultTax = regionTaxes[0]
    
    const newTax: InvoiceTax = {
      name: defaultTax.name,
      rate: defaultTax.rate,
      amount: 0
    }
    
    setInvoice(prev => ({
      ...prev,
      taxes: [...(prev.taxes || []), newTax]
    }))
  }

  const updateTax = (index: number, field: keyof InvoiceTax, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      taxes: prev.taxes?.map((tax, i) => i === index ? { ...tax, [field]: value } : tax)
    }))
  }

  const removeTax = (index: number) => {
    setInvoice(prev => ({
      ...prev,
      taxes: prev.taxes?.filter((_, i) => i !== index)
    }))
  }

  // Recalculate totals whenever items or tax rates change
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
      
      // Only update if values have actually changed
      setInvoice(prev => {
        if (
          prev.subtotal !== subtotal ||
          prev.totalTax !== totalTax ||
          prev.total !== total ||
          JSON.stringify(prev.taxes) !== JSON.stringify(updatedTaxes)
        ) {
          return {
            ...prev,
            subtotal,
            taxes: updatedTaxes,
            totalTax,
            total
          }
        }
        return prev
      })
    }
  }, [invoice.items, invoice.taxes?.length, invoice.taxes?.map(t => `${t.name}-${t.rate}`).join(','), invoice.discount])

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

  const resetInvoice = () => {
    setInvoice(createSampleInvoice())
    setCompanyLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
        paymentTerms: {
          ...invoice.paymentTerms!,
          dueDate,
          notes: paymentTemplate.notes
        }
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
${invoice.items?.map(item => 
  `${item.description} - Qty: ${item.quantity} × ${formatAmount(item.rate)} = ${formatAmount(item.amount)}`
).join('\n')}

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
      const invoiceData = {
        ...invoice,
        logo: companyLogo,
        theme: selectedTheme
      }
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'invoice',
          invoice: invoiceData
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `invoice-${invoice.invoiceNumber || 'draft'}.pdf`
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

  const selectedThemeData = invoiceThemes.find(t => t.id === selectedTheme)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Invoice Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Create professional invoices with automated tax calculations, payment terms, 
          and secure branding for your business.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "💰 Professional Invoices", "📊 Tax Calculations", "💳 Payment Terms", 
            "📧 Email Delivery", "📱 Mobile Friendly", "🔒 Secure & Branded"
          ].map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Create Invoice
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview & Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Header */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Invoice Details</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetInvoice}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="invoiceNumber"
                          value={invoice.invoiceNumber || ''}
                          onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
                          placeholder="INV-2024-001"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={generateNewInvoiceNumber}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate">Invoice Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={invoice.date || ''}
                        onChange={(e) => updateInvoice({ date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={invoice.dueDate || ''}
                        onChange={(e) => updateInvoice({ dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={invoice.currency || 'USD'} 
                        onValueChange={(value) => updateInvoice({ currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.name} ({currency.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select onValueChange={handlePaymentTermsChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentTermsTemplates.map((template) => (
                            <SelectItem key={template.name} value={template.name}>
                              {template.name} - {template.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company & Client Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      From (Your Company)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={invoice.company?.name || ''}
                        onChange={(e) => updateCompany('name', e.target.value)}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={invoice.company?.address || ''}
                        onChange={(e) => updateCompany('address', e.target.value)}
                        placeholder="123 Business St, City, State 12345"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyEmail">Email</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={invoice.company?.email || ''}
                          onChange={(e) => updateCompany('email', e.target.value)}
                          placeholder="hello@company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyPhone">Phone</Label>
                        <Input
                          id="companyPhone"
                          value={invoice.company?.phone || ''}
                          onChange={(e) => updateCompany('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={invoice.company?.website || ''}
                          onChange={(e) => updateCompany('website', e.target.value)}
                          placeholder="www.company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxNumber">Tax ID</Label>
                        <Input
                          id="taxNumber"
                          value={invoice.company?.taxNumber || ''}
                          onChange={(e) => updateCompany('taxNumber', e.target.value)}
                          placeholder="12-3456789"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Bill To (Client)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={invoice.client?.name || ''}
                        onChange={(e) => updateClient('name', e.target.value)}
                        placeholder="Client Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientCompany">Company (Optional)</Label>
                      <Input
                        id="clientCompany"
                        value={invoice.client?.company || ''}
                        onChange={(e) => updateClient('company', e.target.value)}
                        placeholder="Client Company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Address</Label>
                      <Textarea
                        id="clientAddress"
                        value={invoice.client?.address || ''}
                        onChange={(e) => updateClient('address', e.target.value)}
                        placeholder="456 Client St, City, State 12345"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientEmail">Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={invoice.client?.email || ''}
                          onChange={(e) => updateClient('email', e.target.value)}
                          placeholder="client@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Phone</Label>
                        <Input
                          id="clientPhone"
                          value={invoice.client?.phone || ''}
                          onChange={(e) => updateClient('phone', e.target.value)}
                          placeholder="+1 (555) 987-6543"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Invoice Items</CardTitle>
                    <Button onClick={addItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoice.items?.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Label>Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Service or product description"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Rate</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Amount</Label>
                          <Input
                            value={formatCurrency(item.amount, invoice.currency || 'USD')}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={invoice.items?.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Settings & Totals */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Logo</CardTitle>
                  <CardDescription>
                    Upload your logo for professional invoices
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

              {/* Tax Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Tax Configuration</CardTitle>
                    <Button variant="outline" size="sm" onClick={addTax}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tax
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tax Region</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="EU">European Union</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {invoice.taxes?.map((tax, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <Select 
                            value={tax.name} 
                            onValueChange={(value) => {
                              const selectedTax = taxRates[selectedRegion as keyof typeof taxRates]?.find(t => t.name === value)
                              if (selectedTax) {
                                updateTax(index, 'name', value)
                                updateTax(index, 'rate', selectedTax.rate)
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {taxRates[selectedRegion as keyof typeof taxRates]?.map((taxOption) => (
                                <SelectItem key={taxOption.name} value={taxOption.name}>
                                  {taxOption.name} ({taxOption.rate}%)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="text-sm text-gray-600">
                            Amount: {formatCurrency(tax.amount, invoice.currency || 'USD')}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeTax(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Invoice Totals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Invoice Totals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoice.subtotal || 0, invoice.currency || 'USD')}</span>
                  </div>
                  {invoice.taxes?.map((tax, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{tax.name} ({tax.rate}%):</span>
                      <span>{formatCurrency(tax.amount, invoice.currency || 'USD')}</span>
                    </div>
                  ))}
                  {invoice.discount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(invoice.discount.amount, invoice.currency || 'USD')}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.total || 0, invoice.currency || 'USD')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invoice Theme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {invoiceThemes.map((theme) => (
                    <div 
                      key={theme.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-sm text-gray-600">{theme.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {/* Preview and Export */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Invoice Preview</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedInvoice ? 'Copied!' : 'Copy Text'}
                  </Button>
                  <Button onClick={downloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-white border rounded-lg p-8 min-h-[800px] font-mono text-sm overflow-auto"
                style={{ 
                  color: selectedThemeData?.primaryColor,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {companyLogo && (
                      <img 
                        src={companyLogo} 
                        alt="Company Logo" 
                        className="max-h-16 mb-4"
                      />
                    )}
                    <h1 className="text-3xl font-bold mb-2" style={{ color: selectedThemeData?.accentColor }}>
                      INVOICE
                    </h1>
                    <div className="text-lg font-semibold">#{invoice.invoiceNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm space-y-1">
                      <div><strong>Date:</strong> {invoice.date}</div>
                      <div><strong>Due:</strong> {invoice.dueDate}</div>
                      <div><strong>Currency:</strong> {invoice.currency}</div>
                    </div>
                  </div>
                </div>

                {/* Company and Client Info */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold mb-3" style={{ color: selectedThemeData?.accentColor }}>FROM:</h3>
                    <div className="space-y-1">
                      <div className="font-semibold">{invoice.company?.name}</div>
                      <div className="whitespace-pre-line">{invoice.company?.address}</div>
                      <div>{invoice.company?.email}</div>
                      <div>{invoice.company?.phone}</div>
                      {invoice.company?.website && <div>{invoice.company.website}</div>}
                      {invoice.company?.taxNumber && <div>Tax ID: {invoice.company.taxNumber}</div>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3" style={{ color: selectedThemeData?.accentColor }}>TO:</h3>
                    <div className="space-y-1">
                      <div className="font-semibold">{invoice.client?.name}</div>
                      {invoice.client?.company && <div>{invoice.client.company}</div>}
                      <div className="whitespace-pre-line">{invoice.client?.address}</div>
                      <div>{invoice.client?.email}</div>
                      {invoice.client?.phone && <div>{invoice.client.phone}</div>}
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: selectedThemeData?.accentColor + '10' }}>
                        <th className="border p-3 text-left">Description</th>
                        <th className="border p-3 text-center">Qty</th>
                        <th className="border p-3 text-right">Rate</th>
                        <th className="border p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="border p-3">{item.description}</td>
                          <td className="border p-3 text-center">{item.quantity}</td>
                          <td className="border p-3 text-right">{formatCurrency(item.rate, invoice.currency || 'USD')}</td>
                          <td className="border p-3 text-right">{formatCurrency(item.amount, invoice.currency || 'USD')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(invoice.subtotal || 0, invoice.currency || 'USD')}</span>
                    </div>
                    {invoice.taxes?.map((tax, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{tax.name} ({tax.rate}%):</span>
                        <span>{formatCurrency(tax.amount, invoice.currency || 'USD')}</span>
                      </div>
                    ))}
                    {invoice.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(invoice.discount.amount, invoice.currency || 'USD')}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg" style={{ color: selectedThemeData?.accentColor }}>
                        <span>TOTAL:</span>
                        <span>{formatCurrency(invoice.total || 0, invoice.currency || 'USD')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                {invoice.paymentTerms?.notes && (
                  <div className="mb-6">
                    <h4 className="font-bold mb-2" style={{ color: selectedThemeData?.accentColor }}>Payment Terms:</h4>
                    <p>{invoice.paymentTerms.notes}</p>
                  </div>
                )}

                {/* Payment Methods */}
                {invoice.paymentTerms?.paymentMethods && (
                  <div className="mb-6">
                    <h4 className="font-bold mb-2" style={{ color: selectedThemeData?.accentColor }}>Payment Methods:</h4>
                    <p>{invoice.paymentTerms.paymentMethods.join(', ')}</p>
                  </div>
                )}

                {/* Notes */}
                {invoice.notes && (
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: selectedThemeData?.accentColor }}>Notes:</h4>
                    <p className="whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function InvoiceGenerator() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <InvoiceContent />
      </Suspense>
    </DashboardLayout>
  )
}