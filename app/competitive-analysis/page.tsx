
"use client"

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  competitors, 
  featureComparison, 
  analysisQuestions,
  competitorSWOT,
  marketPositions,
  competitiveIntelligenceTools,
  strategyRecommendations,
  businessModels,
  fundingStages,
  employeeCounts,
  industries,
  type CompetitorInput,
  type MarketPosition,
} from '@/lib/competitive-analysis-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown, 
  Scale, 
  Puzzle,
  Plus,
  Target,
  Search,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

function CompetitiveAnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  
  // Competitor input state
  const [newCompetitor, setNewCompetitor] = useState<CompetitorInput>({
    name: '',
    website: '',
    industry: '',
    fundingStage: '',
    employeeCount: '',
    businessModel: ''
  });
  const [customCompetitors, setCustomCompetitors] = useState<CompetitorInput[]>([]);

  const updateUrl = (tab: string) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    router.replace(`/competitive-analysis?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    updateUrl(tab);
  };

  const addCompetitor = () => {
    if (newCompetitor.name && newCompetitor.website) {
      setCustomCompetitors([...customCompetitors, newCompetitor]);
      setNewCompetitor({
        name: '',
        website: '',
        industry: '',
        fundingStage: '',
        employeeCount: '',
        businessModel: ''
      });
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'text-gray-600 bg-gray-100';
      case 'Medium': return 'text-blue-600 bg-blue-100';
      case 'High': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advanced Competitive Intelligence
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Systematic competitor analysis with actionable insights, market positioning, and strategic recommendations.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "🎯 Market Positioning", "🔍 Intelligence Tools", "📊 Dynamic Analysis", 
            "⚡ Strategy Recommendations", "🏗️ Custom Competitor Input", "💡 Opportunity Mapping"
          ].map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-7 text-xs">
          <TabsTrigger value="input" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            Add Competitors
          </TabsTrigger>
          <TabsTrigger value="positioning" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            Market Position
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-1">
            <Search className="w-3 h-3" />
            Intel Tools
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1">
            <Scale className="w-3 h-3" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="swot" className="flex items-center gap-1">
            <Puzzle className="w-3 h-3" />
            SWOT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Your Competitors
              </CardTitle>
              <CardDescription>
                Input your competitors' information to build a comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Competitor Inc."
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="e.g., competitor.com"
                    value={newCompetitor.website}
                    onChange={(e) => setNewCompetitor({...newCompetitor, website: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Select value={newCompetitor.industry} onValueChange={(value) => setNewCompetitor({...newCompetitor, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry.value} value={industry.value}>{industry.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Funding Stage</Label>
                  <Select value={newCompetitor.fundingStage} onValueChange={(value) => setNewCompetitor({...newCompetitor, fundingStage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingStages.map(stage => (
                        <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Employee Count</Label>
                  <Select value={newCompetitor.employeeCount} onValueChange={(value) => setNewCompetitor({...newCompetitor, employeeCount: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee count" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeCounts.map(count => (
                        <SelectItem key={count.value} value={count.value}>{count.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Business Model</Label>
                <Select value={newCompetitor.businessModel} onValueChange={(value) => setNewCompetitor({...newCompetitor, businessModel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business model" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessModels.map(model => (
                      <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={addCompetitor} disabled={!newCompetitor.name || !newCompetitor.website} className="w-full">
                Add Competitor to Analysis
              </Button>
            </CardContent>
          </Card>
          
          {customCompetitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Added Competitors</CardTitle>
                <CardDescription>{customCompetitors.length} competitor(s) added</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {customCompetitors.map((competitor, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{competitor.name}</h3>
                        <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-blue-600 hover:underline">
                          {competitor.website}
                        </a>
                      </div>
                      <div className="grid md:grid-cols-4 gap-2 text-sm">
                        <div><span className="text-gray-500">Industry:</span> {industries.find(i => i.value === competitor.industry)?.label}</div>
                        <div><span className="text-gray-500">Stage:</span> {fundingStages.find(s => s.value === competitor.fundingStage)?.label}</div>
                        <div><span className="text-gray-500">Size:</span> {employeeCounts.find(c => c.value === competitor.employeeCount)?.label}</div>
                        <div><span className="text-gray-500">Model:</span> {businessModels.find(m => m.value === competitor.businessModel)?.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="positioning" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Market Positioning Analysis
              </CardTitle>
              <CardDescription>
                Understand where you and your competitors stand in the market landscape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {marketPositions.map((position, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{position.competitor}</h3>
                      <Badge className={getThreatColor(position.threatLevel)}>
                        {position.threatLevel} Threat
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">Market Share:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={position.marketShare} className="h-2" />
                            <span className="text-sm font-medium">{position.marketShare}%</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">Pricing Tier:</span>
                          <Badge variant="outline" className="ml-2">{position.pricingTier}</Badge>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">Target Segment:</span>
                          <p className="text-sm">{position.targetSegment}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Competitive Advantage:</span>
                          <p className="text-sm">{position.competitiveAdvantage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                Competitive Intelligence Tools
              </CardTitle>
              <CardDescription>
                Essential tools and data points for gathering competitive intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {competitiveIntelligenceTools.map((category, i) => (
                  <AccordionItem key={i} value={`category-${i}`}>
                    <AccordionTrigger className="text-lg font-semibold">{category.category}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {category.tools.map((tool, j) => (
                        <div key={j} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{tool.name}</h4>
                            <Badge variant={tool.freeVersion ? "secondary" : "destructive"}>
                              {tool.freeVersion ? "Free Available" : "Paid Only"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Key Data Points:</h5>
                            <div className="flex flex-wrap gap-2">
                              {tool.dataPoints.map(point => (
                                <Badge key={point} variant="outline" className="text-xs">{point}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Strategic Recommendations
              </CardTitle>
              <CardDescription>
                Actionable strategies based on competitive analysis insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {strategyRecommendations.map((strategy, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{strategy.opportunity}</h3>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(strategy.difficulty)}>
                        {strategy.difficulty}
                      </Badge>
                      <Badge className={getImpactColor(strategy.impact)}>
                        {strategy.impact} Impact
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{strategy.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-2">Implementation Steps:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {strategy.implementation.map((step, j) => (
                          <li key={j}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-2">Timeline:</h5>
                      <p className="text-sm mb-3">{strategy.timeframe}</p>
                      <Badge variant="outline">{strategy.difficulty} to implement</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Competitor Performance Snapshot
              </CardTitle>
              <CardDescription>
                A high-level view of your main competitors' performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-600">{competitor.name}</h3>
                    <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-blue-600">
                      {competitor.website}
                    </a>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>SEO Score</Label>
                      <Progress value={competitor.seoScore} className="h-3 mt-1" />
                      <span className="text-xs text-gray-500">{competitor.seoScore}/100</span>
                    </div>
                    <div>
                      <Label>Content Score</Label>
                      <Progress value={competitor.contentScore} className="h-3 mt-1" />
                      <span className="text-xs text-gray-500">{competitor.contentScore}/100</span>
                    </div>
                    <div>
                      <Label>Social Media Score</Label>
                      <Progress value={competitor.socialScore} className="h-3 mt-1" />
                      <span className="text-xs text-gray-500">{competitor.socialScore}/100</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2"><ThumbsUp className="w-4 h-4 text-green-500" />Strengths</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {competitor.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2"><ThumbsDown className="w-4 h-4 text-red-500" />Weaknesses</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {competitor.weaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Product/Service Feature Comparison
              </CardTitle>
              <CardDescription>
                Compare your offerings against your competitors feature by feature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 font-medium">Feature</th>
                      <th className="p-3 font-medium text-center">Your Business</th>
                      <th className="p-3 font-medium text-center">Competitor A</th>
                      <th className="p-3 font-medium text-center">Competitor B</th>
                      <th className="p-3 font-medium text-center">Competitor C</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3 font-medium">{item.feature}</td>
                        {[item.yourBusiness, item.competitorA, item.competitorB, item.competitorC].map((status, j) => (
                          <td key={j} className="p-3 text-center">
                            {status === 'Yes' && <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />}
                            {status === 'No' && <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                            {status === 'Partial' && <AlertCircle className="w-5 h-5 text-yellow-500 mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swot" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Puzzle className="w-5 h-5" />
                    SWOT Analysis Framework
                </CardTitle>
                <CardDescription>
                    Analyze your Strengths, Weaknesses, Opportunities, and Threats relative to the competition.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 bg-green-50">
                        <h3 className="font-semibold text-lg text-green-700 mb-3">Strengths</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-green-800">
                            {competitorSWOT.strengths.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="border rounded-lg p-4 bg-red-50">
                        <h3 className="font-semibold text-lg text-red-700 mb-3">Weaknesses</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-red-800">
                            {competitorSWOT.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="border rounded-lg p-4 bg-blue-50">
                        <h3 className="font-semibold text-lg text-blue-700 mb-3">Opportunities</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
                            {competitorSWOT.opportunities.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="border rounded-lg p-4 bg-yellow-50">
                        <h3 className="font-semibold text-lg text-yellow-700 mb-3">Threats</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-yellow-800">
                            {competitorSWOT.threats.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Key Analysis Questions
              </CardTitle>
              <CardDescription>
                Use these questions to guide your competitive research and strategy sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {analysisQuestions.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      {item.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CompetitiveAnalysisPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <CompetitiveAnalysisContent />
      </Suspense>
    </DashboardLayout>
  );
}
