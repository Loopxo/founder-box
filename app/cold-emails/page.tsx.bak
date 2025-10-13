"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { industries, templates, calculateCampaignMetrics } from '@/lib/cold-email-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Search, Calculator, Target, Mail, Award, RotateCcw } from 'lucide-react'

function ColdEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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
    const matchesSearch = searchQuery ? 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const selectedTemplateData = selectedTemplate ? 
    templates.find(t => t.id === selectedTemplate) : null

  // Function to apply customization inputs to template content
  const applyCustomization = (text: string) => {
    let customizedText = text
    Object.entries(templateInputs).forEach(([field, value]) => {
      if (value.trim()) {
        customizedText = customizedText.replaceAll(field, value)
      }
    })
    return customizedText
  }

  // Initialize template inputs when template is selected
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      // Reset inputs
      const initialInputs: Record<string, string> = {}
      template.customizationFields.forEach(field => {
        initialInputs[field.field] = ''
      })
      setTemplateInputs(initialInputs)
      setEditedSubject(template.subject)
      setEditedBody(template.body)
    }
  }

  // Reset template to original
  const resetTemplate = () => {
    if (selectedTemplateData) {
      const initialInputs: Record<string, string> = {}
      selectedTemplateData.customizationFields.forEach(field => {
        initialInputs[field.field] = ''
      })
      setTemplateInputs(initialInputs)
      setEditedSubject(selectedTemplateData.subject)
      setEditedBody(selectedTemplateData.body)
    }
  }

  const getFinalSubject = () => applyCustomization(editedSubject)
  const getFinalBody = () => applyCustomization(editedBody)

  // URL state management
  useEffect(() => {
    const industry = searchParams.get('industry')
    const template = searchParams.get('template')
    
    if (industry) {
      setSelectedIndustry(industry)
    }
    if (template) {
      handleTemplateSelect(template)
    }
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

  const goBackToIndustries = () => {
    setSelectedIndustry(null)
    setSelectedTemplate(null)
    updateUrl()
  }

  const goBackToTemplates = () => {
    setSelectedTemplate(null)
    updateUrl(selectedIndustry)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Free Cold Email Education & Template Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          89+ battle-tested templates across 9 industries. Copy-paste ready content with 
          interactive calculators and proven strategies.
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Campaign Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {!selectedIndustry && !selectedTemplate && (
            <>
              {/* Search All Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search All Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search templates by title, content, or industry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4"
                  />
                  {searchQuery && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Found {filteredTemplates.length} templates
                      </p>
                      <div className="grid gap-3">
                        {filteredTemplates.slice(0, 6).map((template) => (
                          <div 
                            key={template.id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => handleTemplateSelectWithUrl(template.id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{template.title}</h4>
                              <Badge variant="outline">{template.successRate}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Subject:</strong> {template.subject}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {template.body.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Industry Selection Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Choose Your Industry
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {industries.map((industry) => (
                    <Card 
                      key={industry.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow group border-2 hover:border-blue-300"
                      onClick={() => handleIndustrySelect(industry.id)}
                    >
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-2">{industry.icon}</div>
                        <CardTitle className="text-lg group-hover:text-blue-600">
                          {industry.name}
                        </CardTitle>
                        <CardDescription>{industry.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-2">
                        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {industry.templateCount} templates
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {industry.successRate} reply rate
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {industry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedIndustry && !selectedTemplate && (
            <>
              {/* Industry Templates List */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {industries.find(i => i.id === selectedIndustry)?.name} Templates
                  </h2>
                  <p className="text-gray-600">
                    {filteredTemplates.length} proven templates with success rates
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={goBackToIndustries}
                >
                  ← Back to Industries
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTemplateSelectWithUrl(template.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription>
                            <strong>Subject:</strong> {template.subject}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{template.successRate} reply rate</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {template.body.substring(0, 200)}...
                      </p>
                      <div className="flex gap-2">
                        {template.useCases.slice(0, 2).map((useCase) => (
                          <Badge key={useCase} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {selectedTemplateData && (
            <>
              {/* Template Detail View with Customization */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedTemplateData.title}</h2>
                  <p className="text-gray-600">
                    {industries.find(i => i.id === selectedTemplateData.category)?.name}
                  </p>
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
                    onClick={goBackToIndustries}
                  >
                    All Industries
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column: Template Content */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Template Content</CardTitle>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetTemplate}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                          <Badge variant="outline">{selectedTemplateData.successRate} reply rate</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="font-medium text-sm">Subject Line:</Label>
                        <Textarea
                          value={editedSubject}
                          onChange={(e) => setEditedSubject(e.target.value)}
                          className="mt-1 min-h-[60px]"
                          placeholder="Edit subject line..."
                        />
                      </div>
                      
                      <div>
                        <Label className="font-medium text-sm">Email Body:</Label>
                        <Textarea
                          value={editedBody}
                          onChange={(e) => setEditedBody(e.target.value)}
                          className="mt-1 min-h-[200px]"
                          placeholder="Edit email body..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview with Applied Customizations */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Preview (Customized)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="font-medium text-sm">Subject:</Label>
                        <div className="mt-1 p-3 bg-white rounded border font-mono text-sm">
                          {getFinalSubject()}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="font-medium text-sm">Body:</Label>
                        <div className="mt-1 p-4 bg-white rounded border whitespace-pre-wrap font-mono text-sm">
                          {getFinalBody()}
                        </div>
                      </div>

                      <Button 
                        onClick={() => copyToClipboard(
                          `Subject: ${getFinalSubject()}\n\n${getFinalBody()}`,
                          selectedTemplateData.id
                        )}
                        className="w-full"
                        variant={copiedTemplate === selectedTemplateData.id ? "secondary" : "default"}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedTemplate === selectedTemplateData.id ? "Copied!" : "Copy Customized Template"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Customization and Details */}
                <div className="space-y-6">
                  {/* Customization Inputs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customize Template</CardTitle>
                      <CardDescription>
                        Fill in the fields below to customize your template
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedTemplateData.customizationFields.map((field) => (
                          <div key={field.field}>
                            <Label htmlFor={field.field} className="text-sm font-medium">
                              {field.field}
                            </Label>
                            <p className="text-xs text-gray-500 mb-1">{field.description}</p>
                            <Input
                              id={field.field}
                              value={templateInputs[field.field] || ''}
                              onChange={(e) => setTemplateInputs({
                                ...templateInputs,
                                [field.field]: e.target.value
                              })}
                              placeholder={`Enter ${field.description.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Use Cases */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Use Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedTemplateData.useCases.map((useCase, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Tips for Success */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tips for Success</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedTemplateData.tips.map((tip, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-blue-500 mt-1">💡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Campaign Calculator
              </CardTitle>
              <CardDescription>
                Calculate how many emails you need to reach your meeting goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="targetMeetings">Target meetings/month</Label>
                  <Input
                    id="targetMeetings"
                    type="number"
                    value={campaignData.targetMeetings}
                    onChange={(e) => setCampaignData({
                      ...campaignData,
                      targetMeetings: parseInt(e.target.value) || 50
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Your industry</Label>
                  <Select 
                    value={campaignData.industry} 
                    onValueChange={(value) => setCampaignData({
                      ...campaignData,
                      industry: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white shadow-lg border">
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          {industry.icon} {industry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience level</Label>
                  <Select 
                    value={campaignData.experienceLevel} 
                    onValueChange={(value) => setCampaignData({
                      ...campaignData,
                      experienceLevel: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white shadow-lg border">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {campaignMetrics.emailsNeeded.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">📧 Emails needed/month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {campaignMetrics.expectedReplies}
                      </div>
                      <div className="text-sm text-gray-600">📈 Expected replies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {campaignMetrics.meetingsLikely}
                      </div>
                      <div className="text-sm text-gray-600">✅ Meetings likely</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {campaignMetrics.dailyEmails}
                      </div>
                      <div className="text-sm text-gray-600">🗓️ Emails/day</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">⏱️</span>
                      <div>
                        <div className="font-medium">Timeline: {campaignMetrics.timeline}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div>
                        <div className="font-medium">Recommendation:</div>
                        <div className="text-sm text-gray-600">
                          Start with {campaignMetrics.dailyEmails} emails/day and focus on personalization for higher response rates.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ColdEmailPlatform() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <ColdEmailContent />
      </Suspense>
    </DashboardLayout>
  )
}