"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  seoChecklist, 
  keywordExamples, 
  marketingChannels, 
  industryBenchmarks, 
  seoTools, 
  costSavingStrategies,
  calculateROI,
  projectedTrafficGrowth,
  SEOChecklistItem
} from '@/lib/seo-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink, 
  Calculator, 
  Target, 
  Lightbulb,
  BarChart3,
  Zap,
  Globe,
  Clock,
  Award,
  Rocket
} from 'lucide-react'

function SEOContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [checklist, setChecklist] = useState<SEOChecklistItem[]>(seoChecklist)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('technology')
  const [website, setWebsite] = useState<string>('')
  const [monthlyBudget, setMonthlyBudget] = useState<number>(5000)
  const [currentTraffic, setCurrentTraffic] = useState<number>(1000)
  const [activeTab, setActiveTab] = useState<string>('audit')

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
    router.replace(`/seo?${params.toString()}`, { scroll: false })
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    updateUrl(tab)
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const getCompletionPercentage = () => {
    const completed = checklist.filter(item => item.completed).length
    return Math.round((completed / checklist.length) * 100)
  }

  const getCompletionByCategory = (category: string) => {
    const categoryItems = checklist.filter(item => item.category === category)
    const completed = categoryItems.filter(item => item.completed).length
    return Math.round((completed / categoryItems.length) * 100)
  }

  const selectedBenchmark = industryBenchmarks.find(b => b.industry.toLowerCase().includes(selectedIndustry)) || industryBenchmarks[5]

  const projectedTraffic6Months = projectedTrafficGrowth(currentTraffic, 15, 6)
  const projectedTraffic12Months = projectedTrafficGrowth(currentTraffic, 15, 12)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SEO Analysis & Cost Optimization Tool
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Comprehensive SEO audit, keyword analysis, and marketing cost optimization 
          to reduce ad spend and improve organic visibility.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "🔍 SEO Audit", "💰 Cost Analysis", "📈 ROI Optimization", 
            "🎯 Strategy Planning", "📊 Performance Tracking", "⚡ Quick Wins"
          ].map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            SEO Audit
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Strategy
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            ROI Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-6">
          {/* Website Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Website Analysis Setup
              </CardTitle>
              <CardDescription>
                Enter your website URL to get started with the SEO audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industryBenchmarks.map((industry) => (
                        <SelectItem key={industry.industry.toLowerCase()} value={industry.industry.toLowerCase()}>
                          {industry.industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                SEO Audit Progress
              </CardTitle>
              <CardDescription>
                Track your SEO optimization progress across key areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Overall Progress</span>
                  <span className="text-2xl font-bold text-blue-600">{getCompletionPercentage()}%</span>
                </div>
                <Progress value={getCompletionPercentage()} className="h-3" />
                
                <div className="grid md:grid-cols-5 gap-4 mt-6">
                  {['technical', 'onpage', 'content', 'local', 'offpage'].map((category) => (
                    <div key={category} className="text-center">
                      <div className="text-sm font-medium capitalize mb-2">{category.replace('onpage', 'On-Page').replace('offpage', 'Off-Page')}</div>
                      <div className="text-xl font-bold text-blue-600">{getCompletionByCategory(category)}%</div>
                      <Progress value={getCompletionByCategory(category)} className="h-2 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization Checklist</CardTitle>
              <CardDescription>
                Complete these tasks to improve your website&apos;s search engine performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {['technical', 'onpage', 'content', 'local', 'offpage'].map((category) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{category.replace('onpage', 'On-Page').replace('offpage', 'Off-Page')} SEO</span>
                        <Badge variant="outline">
                          {checklist.filter(item => item.category === category).filter(item => item.completed).length}/
                          {checklist.filter(item => item.category === category).length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {checklist.filter(item => item.category === category).map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleChecklistItem(item.id)}
                                className={`mt-1 ${item.completed ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </Button>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                    {item.title}
                                  </h4>
                                  <Badge 
                                    variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {item.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-blue-600">Impact:</p>
                                  <p className="text-sm text-gray-700">{item.impact}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {item.resources.map((resource, index) => (
                                    <a
                                      key={index}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      {resource.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          {/* Keyword Research Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Keyword Research & Analysis
              </CardTitle>
              <CardDescription>
                Find profitable keywords and understand search competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Free Keyword Research Process:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Start with Google Keyword Planner (free with Google Ads account)</li>
                    <li>Use Google Autocomplete for long-tail suggestions</li>
                    <li>Check &quot;People also ask&quot; and &quot;Related searches&quot; on Google</li>
                    <li>Analyze competitor websites with Ubersuggest (3 free searches/day)</li>
                    <li>Use Answer The Public for question-based keywords</li>
                    <li>Check Google Trends for seasonal patterns</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Keyword Evaluation Criteria:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Search Volume:</strong> 100+ monthly searches minimum</li>
                    <li><strong>Competition:</strong> Look for &quot;Low&quot; to &quot;Medium&quot; difficulty</li>
                    <li><strong>Commercial Intent:</strong> Include buying keywords</li>
                    <li><strong>Relevance:</strong> Match your business offerings</li>
                    <li><strong>Local Potential:</strong> Add city/area for local business</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis Examples</CardTitle>
              <CardDescription>
                Sample keyword data to understand search landscape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordExamples.map((keyword, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <div className="font-medium text-blue-600">{keyword.keyword}</div>
                        <div className="text-sm text-gray-500">Search Volume: {keyword.searchVolume}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Difficulty</div>
                        <Badge 
                          variant={keyword.difficulty === 'low' ? 'secondary' : keyword.difficulty === 'medium' ? 'default' : 'destructive'}
                        >
                          {keyword.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Est. CPC</div>
                        <div className="font-semibold">{keyword.cpc}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Opportunities</div>
                        <div className="flex flex-wrap gap-1">
                          {keyword.opportunities.slice(0, 2).map((opp, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {opp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Long-tail Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Long-tail Keyword Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">60-70%</div>
                  <div className="text-sm text-green-700">Lower Competition</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.5x</div>
                  <div className="text-sm text-blue-700">Higher Conversion Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">50-70%</div>
                  <div className="text-sm text-purple-700">Lower Cost Per Click</div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Long-tail Examples for Different Business Types:</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Local Service:</strong> &quot;emergency plumber near me&quot; vs &quot;plumber&quot;</div>
                  <div><strong>E-commerce:</strong> &quot;wireless bluetooth headphones under $100&quot; vs &quot;headphones&quot;</div>
                  <div><strong>B2B:</strong> &quot;marketing automation software for small business&quot; vs &quot;marketing software&quot;</div>
                  <div><strong>Professional:</strong> &quot;divorce lawyer in [city]&quot; vs &quot;lawyer&quot;</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          {/* Budget Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Marketing Budget Calculator
              </CardTitle>
              <CardDescription>
                Calculate optimal budget allocation across marketing channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Monthly Marketing Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="traffic">Current Monthly Website Traffic</Label>
                    <Input
                      id="traffic"
                      type="number"
                      value={currentTraffic}
                      onChange={(e) => setCurrentTraffic(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Industry Benchmark ({selectedBenchmark.industry})</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Avg. CPC:</span>
                      <span className="font-medium">${selectedBenchmark.avgCPC}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">{selectedBenchmark.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Order Value:</span>
                      <span className="font-medium">${selectedBenchmark.avgOrderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Organic CTR:</span>
                      <span className="font-medium">{selectedBenchmark.organicCTR}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channel Cost Analysis</CardTitle>
              <CardDescription>
                Compare costs and expected returns across different marketing channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingChannels.map((channel, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <div className="font-medium">{channel.channel}</div>
                        <div className="text-sm text-gray-500">{channel.description}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Monthly Budget</div>
                        <div className="font-semibold">${channel.monthlyBudget.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Expected Clicks</div>
                        <div className="font-semibold">{channel.expectedClicks.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Cost Per Click</div>
                        <div className="font-semibold">${channel.estimatedCPC.toFixed(2)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Projected ROI</div>
                        <Badge variant="outline" className="font-semibold">
                          {channel.projectedROI}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Recommended Budget Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Optimal Budget Split</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>SEO & Content (40%)</span>
                      <span className="font-semibold">${(monthlyBudget * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Google Ads (30%)</span>
                      <span className="font-semibold">${(monthlyBudget * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Social Media (20%)</span>
                      <span className="font-semibold">${(monthlyBudget * 0.2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tools & Analytics (10%)</span>
                      <span className="font-semibold">${(monthlyBudget * 0.1).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Why This Split Works</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>SEO provides long-term, compound growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Paid ads deliver immediate traffic and data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Social media builds brand awareness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Analytics track and optimize performance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          {/* Cost-Saving Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Cost-Saving Strategies
              </CardTitle>
              <CardDescription>
                Proven methods to reduce marketing costs while improving results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {costSavingStrategies.map((strategy, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{strategy.strategy}</h3>
                        <Badge 
                          variant={strategy.impact === 'Very High' ? 'destructive' : strategy.impact === 'High' ? 'default' : 'secondary'}
                        >
                          {strategy.impact} Impact
                        </Badge>
                      </div>
                      <div className="ml-auto">
                        <span className="text-2xl font-bold text-green-600">{strategy.savingsPercent}</span>
                        <span className="text-sm text-gray-500 ml-1">Savings</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{strategy.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Implementation Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {strategy.implementation.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Wins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Quick SEO Wins (0-30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Technical Quick Fixes</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Optimize images (compress, add alt text)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Fix missing title tags and meta descriptions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Set up Google Search Console</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Create and submit XML sitemap</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Fix broken internal links</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Content Quick Wins</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>Update old blog posts with current info</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>Add internal links to relevant pages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>Create FAQ page targeting long-tail keywords</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>Optimize Google Business Profile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>Add schema markup to key pages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          {/* Free Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Essential Free SEO Tools
              </CardTitle>
              <CardDescription>
                Start with these free tools to analyze and improve your SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {seoTools.free.map((tool, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{tool.name}</h4>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paid Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Premium SEO Tools
              </CardTitle>
              <CardDescription>
                Advanced tools for serious SEO campaigns (when budget allows)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {seoTools.paid.map((tool, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{tool.name}</h4>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DIY vs Agency */}
          <Card>
            <CardHeader>
              <CardTitle>DIY vs Agency Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-green-600 mb-3">DIY SEO Approach</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tools (monthly):</span>
                      <span>$0-200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Investment:</span>
                      <span>10-20 hrs/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Curve:</span>
                      <span>3-6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Monthly Cost:</span>
                      <span className="font-semibold">$500-1,500</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    *Assuming $25-50/hour for your time
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-3">SEO Agency</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Retainer:</span>
                      <span>$2,000-10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Investment:</span>
                      <span>2-5 hrs/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Results Timeline:</span>
                      <span>3-6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Monthly Cost:</span>
                      <span className="font-semibold">$2,000-10,000</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    *Plus your management time
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">Hybrid Approach (Recommended)</h5>
                <p className="text-sm text-yellow-700">
                  Start with DIY for 3-6 months to learn the basics and prove ROI, 
                  then hire specialists for specific tasks like technical SEO or link building.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          {/* ROI Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                SEO Growth Projections
              </CardTitle>
              <CardDescription>
                Estimated traffic and revenue growth with consistent SEO efforts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Current Traffic</div>
                  <div className="text-2xl font-bold text-blue-700">{currentTraffic.toLocaleString()}</div>
                  <div className="text-xs text-blue-500">visitors/month</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">6 Month Projection</div>
                  <div className="text-2xl font-bold text-green-700">{projectedTraffic6Months.toLocaleString()}</div>
                  <div className="text-xs text-green-500">
                    +{Math.round(((projectedTraffic6Months - currentTraffic) / currentTraffic) * 100)}% growth
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">12 Month Projection</div>
                  <div className="text-2xl font-bold text-purple-700">{projectedTraffic12Months.toLocaleString()}</div>
                  <div className="text-xs text-purple-500">
                    +{Math.round(((projectedTraffic12Months - currentTraffic) / currentTraffic) * 100)}% growth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Projections */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Impact Projections</CardTitle>
              <CardDescription>
                Based on {selectedBenchmark.industry} industry averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Current Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Visitors:</span>
                        <span>{currentTraffic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Monthly Conversions:</span>
                        <span>{Math.round(currentTraffic * (selectedBenchmark.conversionRate / 100))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Monthly Revenue:</span>
                        <span className="font-semibold">
                          ${Math.round(currentTraffic * (selectedBenchmark.conversionRate / 100) * selectedBenchmark.avgOrderValue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">12-Month Projection</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Visitors:</span>
                        <span>{projectedTraffic12Months.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Monthly Conversions:</span>
                        <span>{Math.round(projectedTraffic12Months * (selectedBenchmark.conversionRate / 100))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Monthly Revenue:</span>
                        <span className="font-semibold text-green-600">
                          ${Math.round(projectedTraffic12Months * (selectedBenchmark.conversionRate / 100) * selectedBenchmark.avgOrderValue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Projected Annual Revenue Increase</div>
                    <div className="text-3xl font-bold text-green-600">
                      ${Math.round((projectedTraffic12Months - currentTraffic) * (selectedBenchmark.conversionRate / 100) * selectedBenchmark.avgOrderValue * 12).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment vs Return */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Investment vs Return Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">SEO Investment (12 months)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly SEO Budget:</span>
                      <span>${(monthlyBudget * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Investment:</span>
                      <span className="font-semibold">${(monthlyBudget * 0.4 * 12).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Expected Return</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Additional Annual Revenue:</span>
                      <span>${Math.round((projectedTraffic12Months - currentTraffic) * (selectedBenchmark.conversionRate / 100) * selectedBenchmark.avgOrderValue * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="font-semibold text-green-600">
                        {calculateROI(
                          monthlyBudget * 0.4 * 12,
                          Math.round((projectedTraffic12Months - currentTraffic) * (selectedBenchmark.conversionRate / 100) * selectedBenchmark.avgOrderValue * 12)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-green-700 mb-1">Break-even Timeline</div>
                  <div className="text-xl font-bold text-green-800">
                    {Math.round((monthlyBudget * 0.4 * 12) / (Math.round((projectedTraffic12Months - currentTraffic) * (selectedBenchmark.conversionRate / 100) * selectedBenchmark.avgOrderValue * 12) / 12))} months
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SEOAnalyzer() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <SEOContent />
      </Suspense>
    </DashboardLayout>
  )
}