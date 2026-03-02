"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Target,
  Send,
  CheckCircle2,
  Lightbulb,
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Zap,
  Download,
  Copy,
  BarChart3,
  Plus
} from 'lucide-react'

import {
  sampleLeads,
  salesTemplates,
  salesPlaybooks,
  leadStages,
  leadSources,
  formatCurrency,
  type Lead
} from '@/lib/sales-data'

interface GeneratedPlan {
  createdAt?: string
  plan?: {
    executiveSummary?: string
    prospecting?: {
      title?: string
      description?: string
      steps?: string[]
    }
    messaging?: {
      title?: string
      description?: string
      templates?: Array<{
        type: string
        subject?: string
        body: string
      }>
    }
    tools?: {
      title?: string
      description?: string
      recommendations?: Array<{
        name: string
        cost: string
        purpose: string
      }>
    }
    timeline?: {
      title?: string
      weeks?: Array<{
        week: string
        focus: string
        tasks?: string[]
      }>
    }
    metrics?: {
      title?: string
      kpis?: Array<{
        name: string
        target: string
      }>
    }
  }
}

export default function SelfServiceSDRGenerator() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelfServiceSDRGeneratorContent />
    </Suspense>
  )
}

function SelfServiceSDRGeneratorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<string>('pipeline')
  const [businessInfo, setBusinessInfo] = useState({
    companyName: '',
    industry: '',
    productService: '',
    targetCustomers: '',
    currentSales: '',
    salesChallenges: '',
    budget: ''
  })
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const planRef = useRef<HTMLDivElement>(null)

  // New sales management state
  const [leads] = useState<Lead[]>(sampleLeads)


  // URL state management
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const updateUrl = (tab: string) => {
    const params = new URLSearchParams()
    params.set('tab', tab)
    router.replace(`/sales?${params.toString()}`, { scroll: false })
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    updateUrl(tab)
  }

  const handleInputChange = (field: string, value: string) => {
    setBusinessInfo({
      ...businessInfo,
      [field]: value
    })
  }

  const generatePlan = () => {
    setIsGenerating(true)

    // Simulate processing time
    setTimeout(() => {
      const now = new Date()
      const plan = {
        ...businessInfo,
        createdAt: `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
        plan: generateCustomPlan(businessInfo)
      }
      setGeneratedPlan(plan)
      setIsGenerating(false)
      handleTabChange('plan')
    }, 1500)
  }

  const generateCustomPlan = (info: Record<string, string>) => {
    // This would be replaced with actual AI/algorithmic plan generation
    return {
      executiveSummary: `This Self-Service SDR Plan is customized for ${info.companyName} in the ${info.industry} industry. The plan focuses on generating qualified leads for your ${info.productService} targeting ${info.targetCustomers}.`,
      prospecting: {
        title: "Targeted Prospecting Strategy",
        description: `Based on your ${info.industry} focus, we recommend targeting companies with 10-500 employees and $2M-$50M in annual revenue. Your ideal customer profile should align with businesses facing challenges similar to "${info.salesChallenges}".`,
        steps: [
          "Use LinkedIn Sales Navigator to find decision makers in your target companies",
          "Build a list of 500-1000 prospects in your first 30 days",
          "Segment prospects by company size and specific pain points",
          "Create a scoring system to prioritize high-value targets"
        ]
      },
      messaging: {
        title: "Personalized Messaging Framework",
        description: `Your messaging should focus on solving "${info.salesChallenges}" for your target customers. Since you&apos;re in the ${info.industry} space, emphasize ROI and measurable results.`,
        templates: [
          {
            type: "Cold Email",
            subject: `Quick question about ${info.salesChallenges}`,
            body: `Hey [First Name],

I noticed [Company Name] is in the ${info.industry} space. Quick question: Are you currently facing challenges with ${info.salesChallenges} that&apos;s impacting your bottom line?

I&apos;ve helped companies like yours increase efficiency by 30% using ${info.productService}.

Would you be open to a 15-minute conversation to see if we can do the same for you?

Best,
[Your Name]`
          },
          {
            type: "LinkedIn Message",
            body: `Hey [First Name], I work with ${info.industry} companies to solve ${info.salesChallenges}. 

Want to see how I can help save you 5+ hours/week?

Looking forward to hearing from you!`
          }
        ]
      },
      tools: {
        title: "Recommended Tool Stack",
        description: `Based on your budget of ${info.budget}, here&apos;s an optimized tool stack that maximizes ROI:`,
        recommendations: [
          {
            name: "Google Workspace",
            cost: "$6/user/month",
            purpose: "Professional email and document collaboration"
          },
          {
            name: "MailTrack",
            cost: "Free",
            purpose: "Email tracking and analytics"
          },
          {
            name: "Hunter.io",
            cost: "$49/month",
            purpose: "Email finding and verification"
          },
          {
            name: "Calendly",
            cost: "Free",
            purpose: "Meeting scheduling automation"
          }
        ]
      },
      timeline: {
        title: "30-Day Implementation Timeline",
        weeks: [
          {
            week: "Week 1",
            focus: "Set up tools and define ICP",
            tasks: ["Create professional email", "Set up MailTrack", "Define ideal customer profile", "Build initial prospect list (100 contacts)"]
          },
          {
            week: "Week 2",
            focus: "Launch outreach campaigns",
            tasks: ["Send 200 initial emails", "Connect with 50 prospects on LinkedIn", "Track responses and refine messaging"]
          },
          {
            week: "Week 3",
            focus: "Follow up and nurture",
            tasks: ["Send follow-up sequences", "Schedule 5-10 meetings", "Document successful approaches"]
          },
          {
            week: "Week 4",
            focus: "Optimize and scale",
            tasks: ["Analyze results and metrics", "Refine targeting and messaging", "Expand prospect list to 500 contacts"]
          }
        ]
      },
      metrics: {
        title: "Key Performance Indicators",
        kpis: [
          { name: "Email Response Rate", target: "20-30%" },
          { name: "Meeting Conversion Rate", target: "10-15%" },
          { name: "Monthly Qualified Meetings", target: "15-25" },
          { name: "Cost Per Meeting", target: `$${info.budget ? (parseInt(info.budget.replace(/[^0-9]/g, '')) / 20).toFixed(0) : '100'}` }
        ]
      }
    }
  }

  const downloadPlanAsPDF = async () => {
    setIsDownloading(true);

    try {
      // Create a simplified HTML version for PDF
      const planContent = `
        <html>
          <head>
            <title>Self-Service SDR Plan - ${businessInfo.companyName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1, h2, h3 { color: #1e40af; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 30px; }
              .step { margin-bottom: 10px; }
              .template { background: #f1f5f9; padding: 15px; margin: 15px 0; border-radius: 5px; }
              .badge { background: #dbeafe; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
              th { background: #dbeafe; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Self-Service SDR Plan</h1>
              <h2>${businessInfo.companyName}</h2>
              <p>Generated on: ${generatedPlan?.createdAt || 'N/A'}</p>
            </div>
            
            <div class="section">
              <h2>Executive Summary</h2>
              <p>${generatedPlan?.plan?.executiveSummary}</p>
            </div>
            
            <div class="section">
              <h2>${generatedPlan?.plan?.prospecting?.title}</h2>
              <p>${generatedPlan?.plan?.prospecting?.description}</p>
              <h3>Action Steps:</h3>
              <ul>
                ${generatedPlan?.plan?.prospecting?.steps?.map((step: string) => `<li class="step">• ${step}</li>`).join('')}
              </ul>
            </div>
            
            <div class="section">
              <h2>${generatedPlan?.plan?.messaging?.title}</h2>
              <p>${generatedPlan?.plan?.messaging?.description}</p>
              
              ${generatedPlan?.plan?.messaging?.templates?.map((template: Record<string, string>) => `
                <div class="template">
                  <h3>${template.type}</h3>
                  ${template.subject ? `<p><strong>Subject:</strong> ${template.subject}</p>` : ''}
                  <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${template.body}</pre>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h2>${generatedPlan?.plan?.tools?.title}</h2>
              <p>${generatedPlan?.plan?.tools?.description}</p>
              
              <table>
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Cost</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  ${generatedPlan?.plan?.tools?.recommendations?.map((tool: Record<string, string>) => `
                    <tr>
                      <td>${tool.name}</td>
                      <td>${tool.cost}</td>
                      <td>${tool.purpose}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <h2>${generatedPlan?.plan?.timeline?.title}</h2>
              ${generatedPlan?.plan?.timeline?.weeks?.map((week: any) => `
                <div>
                  <h3><span class="badge">Week ${week.week.replace('Week ', '')}</span> ${week.focus}</h3>
                  <ul>
                    ${week.tasks?.map((task: string) => `<li class="step">• ${task}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h2>${generatedPlan?.plan?.metrics?.title}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  ${generatedPlan?.plan?.metrics?.kpis?.map((kpi: Record<string, string>) => `
                    <tr>
                      <td>${kpi.name}</td>
                      <td>${kpi.target}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      // Create a Blob with the HTML content
      const blob = new Blob([planContent], { type: 'text/html' });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SDR-Plan-${businessInfo.companyName.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Your SDR Plan has been downloaded as an HTML file! You can open it in any browser or convert it to PDF using your browser's print function.");
    } catch (error) {
      alert('Error downloading plan. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }

  const copyToClipboard = () => {
    if (generatedPlan) {
      const planText = JSON.stringify(generatedPlan, null, 2);
      navigator.clipboard.writeText(planText);
      alert("Plan copied to clipboard!");
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC] uppercase tracking-tight mb-4">
            Advanced Sales Management Suite
          </h1>
          <p className="text-xl text-[#9E9880] font-mono text-xs max-w-3xl mx-auto mb-6">
            Complete sales toolkit: CRM, pipeline management, templates, analytics, and automated SDR plan generation.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Pipeline Management",
              "Sales Analytics",
              "Proven Templates",
              "Lead Scoring",
              "Conversion Tracking",
              "SDR Plan Generator"
            ].map((feature) => (
              <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] text-sm" key={feature} variant="secondary" >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex flex-wrap border-b border-[#2A2A38] bg-transparent w-full p-0 h-auto gap-2">
            <TabsTrigger value="pipeline" className="font-mono text-xs uppercase text-[#9E9880] data-[state=active]:text-[#D4A853] data-[state=active]:border-b-2 data-[state=active]:border-[#D4A853] bg-transparent rounded-none px-4 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-transparent shadow-none">
              <TrendingUp className="w-3 h-3" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="templates" className="font-mono text-xs uppercase text-[#9E9880] data-[state=active]:text-[#D4A853] data-[state=active]:border-b-2 data-[state=active]:border-[#D4A853] bg-transparent rounded-none px-4 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-transparent shadow-none">
              <FileText className="w-3 h-3" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-mono text-xs uppercase text-[#9E9880] data-[state=active]:text-[#D4A853] data-[state=active]:border-b-2 data-[state=active]:border-[#D4A853] bg-transparent rounded-none px-4 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-transparent shadow-none">
              <BarChart3 className="w-3 h-3" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="playbooks" className="font-mono text-xs uppercase text-[#9E9880] data-[state=active]:text-[#D4A853] data-[state=active]:border-b-2 data-[state=active]:border-[#D4A853] bg-transparent rounded-none px-4 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-transparent shadow-none">
              <BookOpen className="w-3 h-3" />
              Playbooks
            </TabsTrigger>
            <TabsTrigger value="business-info" className="font-mono text-xs uppercase text-[#9E9880] data-[state=active]:text-[#D4A853] data-[state=active]:border-b-2 data-[state=active]:border-[#D4A853] bg-transparent rounded-none px-4 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-transparent shadow-none">
              <Target className="w-3 h-3" />
              SDR Setup
            </TabsTrigger>
            <TabsTrigger value="plan" className="font-mono text-xs uppercase text-[#9E9880] data-[state=active]:text-[#D4A853] data-[state=active]:border-b-2 data-[state=active]:border-[#D4A853] bg-transparent rounded-none px-4 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-transparent shadow-none" disabled={!generatedPlan}>
              <Zap className="w-3 h-3" />
              SDR Plan
            </TabsTrigger>
          </TabsList>

          {/* Pipeline Management Tab */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                  <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#D4A853]" />
                    Sales Pipeline Overview
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                    Manage your leads and track deals through the sales process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                      <div className="text-2xl font-bold text-[#D4A853]">{leads.length}</div>
                      <div className="text-sm text-[#9E9880] font-mono text-xs">Total Leads</div>
                    </div>
                    <div className="text-center p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                      <div className="text-2xl font-bold text-[#4D9E6A]">
                        {leads.filter(l => ['demo', 'proposal', 'negotiation'].includes(l.stage)).length}
                      </div>
                      <div className="text-sm text-[#9E9880] font-mono text-xs">Active Deals</div>
                    </div>
                    <div className="text-center p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                      <div className="text-2xl font-bold text-[#EDE9DC]">
                        {formatCurrency(leads.reduce((sum, l) => sum + (l.stage !== 'closed-lost' ? l.value * (l.probability / 100) : 0), 0))}
                      </div>
                      <div className="text-sm text-[#9E9880] font-mono text-xs">Pipeline Value</div>
                    </div>
                    <div className="text-center p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                      <div className="text-2xl font-bold text-[#D4A853]">
                        {Math.round(leads.filter(l => l.stage === 'closed-won').length / Math.max(leads.length, 1) * 100)}%
                      </div>
                      <div className="text-sm text-[#9E9880] font-mono text-xs">Win Rate</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-sans text-lg font-bold text-[#EDE9DC]">Your Leads</h3>
                      <Button size="sm" className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lead
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {leads.map((lead) => {
                        const stageConfig = leadStages.find(s => s.value === lead.stage);
                        return (
                          <div key={lead.id} className="border border-[#2A2A38] rounded-sm p-4 hover:bg-[#111118] border border-[#2A2A38]">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{lead.name}</h4>
                                <p className="text-sm text-[#9E9880] font-mono text-xs">{lead.company}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{formatCurrency(lead.value)}</div>
                                <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118]" className={stageConfig?.color}>{stageConfig?.label}</Badge>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-[#9E9880] font-mono text-xs">Source:</span> {lead.source}
                              </div>
                              <div>
                                <span className="text-[#9E9880] font-mono text-xs">Score:</span> {lead.score}/100
                              </div>
                              <div>
                                <span className="text-[#9E9880] font-mono text-xs">Probability:</span> {lead.probability}%
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-[#9E9880] font-mono text-xs">Next Action:</span> {lead.nextAction}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {lead.tags.map(tag => (
                                <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] text-xs" key={tag} variant="outline" >{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
              <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4D9E6A]" />
                  High-Converting Sales Templates
                </CardTitle>
                <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                  Proven templates for emails, calls, and LinkedIn outreach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {salesTemplates.map((template) => (
                    <div key={template.id} className="border border-[#2A2A38] rounded-sm p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <p className="text-sm text-[#9E9880] font-mono text-xs">{template.useCase}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {template.conversionRate && (
                            <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118]" variant="secondary">{template.conversionRate} conversion</Badge>
                          )}
                          <Button size="sm" className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0">
                            <Copy className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </div>

                      {template.subject && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Subject: </span>
                          <span className="text-sm">{template.subject}</span>
                        </div>
                      )}

                      <div className="bg-[#111118] border border-[#2A2A38] p-3 rounded-lg text-sm whitespace-pre-line mb-3">
                        {template.content}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] text-xs" key={tag} variant="outline" >{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
              <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#EDE9DC]" />
                  Sales Analytics & Performance
                </CardTitle>
                <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                  Track your sales performance and identify improvement opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Lead Sources Performance</h3>
                    {leadSources.slice(0, 5).map((source) => {
                      const sourceLeads = leads.filter(l => l.source.toLowerCase().includes(source.value.replace('-', ' ')));
                      const percentage = Math.round((sourceLeads.length / leads.length) * 100);
                      return (
                        <div key={source.value} className="flex justify-between items-center">
                          <span className="text-sm">{source.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#2A2A38] rounded-full h-2">
                              <div
                                className="bg-[#D4A853] h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Stage Distribution</h3>
                    {leadStages.slice(0, 6).map((stage) => {
                      const stageLeads = leads.filter(l => l.stage === stage.value);
                      const percentage = Math.round((stageLeads.length / leads.length) * 100);
                      return (
                        <div key={stage.value} className="flex justify-between items-center">
                          <span className="text-sm">{stage.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#2A2A38] rounded-full h-2">
                              <div
                                className="bg-[#4D9E6A] h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{stageLeads.length}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#9E9880] font-mono text-xs">Avg Deal Size</span>
                        <span className="font-medium">{formatCurrency(leads.reduce((sum, l) => sum + l.value, 0) / leads.length)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#9E9880] font-mono text-xs">Avg Lead Score</span>
                        <span className="font-medium">{Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#9E9880] font-mono text-xs">High Value Deals</span>
                        <span className="font-medium">{leads.filter(l => l.value > 50000).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#9E9880] font-mono text-xs">Hot Leads (Score &gt;80)</span>
                        <span className="font-medium">{leads.filter(l => l.score > 80).length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Recommended Actions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                      <h4 className="font-medium text-[#EDE9DC] mb-2">Focus on High-Value Leads</h4>
                      <p className="text-sm text-[#9E9880]">
                        You have {leads.filter(l => l.value > 30000 && l.score > 70).length} high-value, high-score leads.
                        Prioritize these for immediate follow-up.
                      </p>
                    </div>
                    <div className="p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                      <h4 className="font-medium text-[#EDE9DC] mb-2">Improve Conversion Rate</h4>
                      <p className="text-sm text-[#9E9880]">
                        Your LinkedIn outreach has the highest lead score average.
                        Consider increasing effort on this channel.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playbooks Tab */}
          <TabsContent value="playbooks" className="space-y-6">
            <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
              <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D4A853]" />
                  Sales Playbooks & Processes
                </CardTitle>
                <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                  Step-by-step guides for consistent sales success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {salesPlaybooks.map((playbook) => (
                    <div key={playbook.id} className="border border-[#2A2A38] rounded-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-sans text-xl font-bold text-[#EDE9DC]">{playbook.name}</h3>
                          <p className="text-[#9E9880] font-mono text-xs">{playbook.description}</p>
                          <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] mt-2" variant="outline" >{playbook.targetPersona}</Badge>
                        </div>
                        <Button className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0">
                          View Full Playbook
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        {playbook.stages.map((stage, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-[#D4A853] rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{stage.name}</h4>
                                <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118]" variant="secondary">{stage.avgDuration}</Badge>
                              </div>
                              <p className="text-sm text-[#9E9880] font-mono text-xs mb-2">{stage.description}</p>
                              <div className="text-xs text-[#9E9880] font-mono text-xs">
                                {stage.activities.length} activities • {stage.successCriteria.length} success criteria
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Info Tab */}
          <TabsContent value="business-info" className="space-y-6">
            <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
              <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tell Us About Your Business
                </CardTitle>
                <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                  Provide details about your business to generate a customized SDR plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="companyName">Company Name *</Label>
                      <Input className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm"
                        id="companyName"
                        value={businessInfo.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="e.g., TechFlow Solutions"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="industry">Industry *</Label>
                      <Input className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm"
                        id="industry"
                        value={businessInfo.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        placeholder="e.g., SaaS, E-commerce, Professional Services"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="productService">Product or Service *</Label>
                    <Textarea className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm min-h-[100px]"
                      id="productService"
                      value={businessInfo.productService}
                      onChange={(e) => handleInputChange('productService', e.target.value)}
                      placeholder="Describe what you sell or the service you provide"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="targetCustomers">Target Customers *</Label>
                    <Textarea className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm min-h-[100px]"
                      id="targetCustomers"
                      value={businessInfo.targetCustomers}
                      onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
                      placeholder="Describe your ideal customers (company size, roles, challenges, etc.)"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="currentSales">Current Monthly Sales ($) *</Label>
                      <Input className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm"
                        id="currentSales"
                        value={businessInfo.currentSales}
                        onChange={(e) => handleInputChange('currentSales', e.target.value)}
                        placeholder="e.g., $10,000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="budget">Monthly SDR Budget ($) *</Label>
                      <Input className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm"
                        id="budget"
                        value={businessInfo.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="e.g., $200"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="font-mono text-xs text-[#D4A853] uppercase tracking-widest mb-2 block" htmlFor="salesChallenges">Top Sales Challenge *</Label>
                    <Textarea className="bg-transparent border-[#2A2A38] text-[#EDE9DC] placeholder:text-[#9E9880] focus-visible:ring-[#D4A853] rounded-sm min-h-[100px]"
                      id="salesChallenges"
                      value={businessInfo.salesChallenges}
                      onChange={(e) => handleInputChange('salesChallenges', e.target.value)}
                      placeholder="What's your biggest obstacle in acquiring new customers?"
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-[#111118] border border-[#2A2A38] p-4 rounded-lg">
                    <h3 className="font-semibold text-[#EDE9DC] mb-2">How This Helps</h3>
                    <p className="text-sm text-[#9E9880]">
                      Based on your inputs, we&apos;ll generate a customized SDR plan that includes:
                      prospecting strategies, messaging templates, tool recommendations, and a 30-day implementation timeline.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleTabChange('generate')}
                      disabled={!businessInfo.companyName || !businessInfo.industry || !businessInfo.productService}
                      className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0"
                    >
                      Generate My SDR Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
              <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Generate Your Custom SDR Plan
                </CardTitle>
                <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                  Creating a tailored sales development strategy for {businessInfo.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  {isGenerating ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A853] mb-4"></div>
                      <h3 className="font-sans text-xl font-bold text-[#EDE9DC] mb-2">Generating Your Custom Plan</h3>
                      <p className="text-[#9E9880] font-mono text-xs">
                        Analyzing your business information and creating a tailored SDR strategy...
                      </p>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="font-sans text-xl font-bold text-[#EDE9DC] mb-2">Ready to Generate Your Plan</h3>
                      <p className="text-[#9E9880] font-mono text-xs mb-6 max-w-2xl mx-auto">
                        Based on your inputs, we&apos;ll create a comprehensive Self-Service SDR Plan customized for
                        {businessInfo.companyName} in the {businessInfo.industry} industry.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={() => handleTabChange('business-info')}
                          variant="outline"
                          className="bg-[#18181F] text-[#EDE9DC] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#2A2A38] transition-colors rounded-sm border border-[#2A2A38] shadow-none ring-0"
                        >
                          Edit Information
                        </Button>
                        <Button
                          onClick={generatePlan}
                          className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0"
                        >
                          Generate Custom Plan
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {!isGenerating && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                  <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                    <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2 text-[#D4A853]">
                      <Target className="w-5 h-5" />
                      Prospecting Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#9E9880] font-mono text-xs">
                      Customized approach to find your ideal customers in the {businessInfo.industry} space.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                  <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                    <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2 text-[#4D9E6A]">
                      <Send className="w-5 h-5" />
                      Messaging Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#9E9880] font-mono text-xs">
                      Personalized outreach messages that resonate with your target audience.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                  <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                    <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2 text-[#EDE9DC]">
                      <TrendingUp className="w-5 h-5" />
                      30-Day Implementation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#9E9880] font-mono text-xs">
                      Step-by-step timeline to execute your SDR strategy effectively.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
              <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Customized SDR Plan
                </CardTitle>
                <CardDescription className="font-mono text-xs text-[#9E9880] mt-1">
                  Generated for {businessInfo.companyName} on {generatedPlan?.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2 mb-6">
                  <Button onClick={copyToClipboard} variant="outline" className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Plan
                  </Button>
                  <Button onClick={downloadPlanAsPDF} disabled={isDownloading} className="bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C49843] transition-colors rounded-sm border-none shadow-none ring-0">
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? 'Generating...' : 'Download as HTML'}
                  </Button>
                </div>

                <div ref={planRef} className="space-y-8">
                  {/* Executive Summary */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-[#EDE9DC]">Executive Summary</h2>
                    <p className="text-[#9E9880] font-mono text-xs bg-[#111118] border border-[#2A2A38] p-4 rounded-lg">
                      {generatedPlan?.plan?.executiveSummary}
                    </p>
                  </div>

                  {/* Prospecting Strategy */}
                  <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                    <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                      <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {generatedPlan?.plan?.prospecting?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#9E9880] font-mono text-xs mb-4">
                        {generatedPlan?.plan?.prospecting?.description}
                      </p>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Action Steps:</h4>
                        <ul className="space-y-2">
                          {generatedPlan?.plan?.prospecting?.steps?.map((step: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-[#4D9E6A] mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Messaging Framework */}
                  <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                    <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                      <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        {generatedPlan?.plan?.messaging?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#9E9880] font-mono text-xs mb-4">
                        {generatedPlan?.plan?.messaging?.description}
                      </p>

                      <div className="space-y-6">
                        {generatedPlan?.plan?.messaging?.templates?.map((template: Record<string, string>, index: number) => (
                          <div key={index} className="border border-[#2A2A38] rounded-sm p-4">
                            <h4 className="font-semibold mb-2">{template.type}</h4>
                            {template.subject && (
                              <div className="mb-2">
                                <span className="font-medium">Subject: </span>
                                <span className="text-[#9E9880] font-mono text-xs">{template.subject}</span>
                              </div>
                            )}
                            <div className="bg-[#111118] border border-[#2A2A38] p-3 rounded text-sm whitespace-pre-line">
                              {template.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tool Recommendations */}
                  <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                    <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                      <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {generatedPlan?.plan?.tools?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#9E9880] font-mono text-xs mb-4">
                        {generatedPlan?.plan?.tools?.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        {generatedPlan?.plan?.tools?.recommendations?.map((tool: Record<string, string>, index: number) => (
                          <div key={index} className="border border-[#2A2A38] rounded-sm p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{tool.name}</h4>
                              <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118]" variant="secondary">{tool.cost}</Badge>
                            </div>
                            <p className="text-sm text-[#9E9880] font-mono text-xs">{tool.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Implementation Timeline */}
                  <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                    <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                      <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {generatedPlan?.plan?.timeline?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {generatedPlan?.plan?.timeline?.weeks?.map((week: any, index: number) => (
                          <div key={index} className="border-l-2 border-[#D4A853] pl-4 py-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118]" variant="default">Week {week.week.replace('Week ', '')}</Badge>
                              <span className="font-semibold">{week.focus}</span>
                            </div>
                            <ul className="space-y-1">
                              {week.tasks?.map((task: string, taskIndex: number) => (
                                <li key={taskIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-[#4D9E6A] mt-0.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#2A2A38] rounded-sm" >
                    <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                      <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {generatedPlan?.plan?.metrics?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        {generatedPlan?.plan?.metrics?.kpis?.map((kpi: Record<string, string>, index: number) => (
                          <div key={index} className="text-center p-4 bg-[#111118] border border-[#2A2A38] rounded-lg">
                            <div className="text-lg font-bold text-[#D4A853]">{kpi.target}</div>
                            <div className="text-sm text-[#9E9880] font-mono text-xs">{kpi.name}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Final Section */}
                  <Card className="bg-[#18181F] border border-[#2A2A38] rounded-sm bg-[#18181F] border border-[#D4A853] text-white" >
                    <CardHeader className="border-b border-[#2A2A38] pb-4 bg-[#111118]">
                      <CardTitle className="font-sans text-lg sm:text-xl text-[#EDE9DC] uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Congratulations! You now have a complete Self-Service SDR Plan tailored for {businessInfo.companyName}.
                        Follow the 30-day timeline to implement your strategy and start generating qualified leads.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] bg-slate-800 text-[#D4A853]" variant="secondary" >
                          Start Week 1
                        </Badge>
                        <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] bg-slate-800 text-[#D4A853]" variant="secondary" >
                          Set up tools
                        </Badge>
                        <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] bg-slate-800 text-[#D4A853]" variant="secondary" >
                          Build prospect list
                        </Badge>
                        <Badge className="bg-[#111118] border border-[#2A2A38] text-[#EDE9DC] font-mono rounded-sm hover:bg-[#111118] bg-slate-800 text-[#D4A853]" variant="secondary" >
                          Launch outreach
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}