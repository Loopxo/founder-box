
"use client"

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { 
  platformStrategies,
  contentIdeas,
  hashtagStrategies,
  engagementTactics,
  growthHackingStrategies,
  conversionStrategies,
  advancedAnalytics,
  competitorAnalysisFramework,
  crisisManagementStrategies,
  targetAudiences,
  timeAvailability,
  businessFields,
  generatePersonalizedStrategy,
  type PersonalizedStrategy,
} from '@/lib/social-media-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Hash, 
  MessageSquare, 
  TrendingUp, 
  Lightbulb, 
  Copy,
  Zap,
  Target,
  BarChart3,
  Users,
  Shield,
  Brain
} from 'lucide-react';

function SocialMediaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'strategy');
  const [selectedPlatform, setSelectedPlatform] = useState('X/Twitter');
  
  // Personalized strategy state
  const [targetAudience, setTargetAudience] = useState('');
  const [timeAvail, setTimeAvail] = useState('');
  const [field, setField] = useState('');
  const [personalizedStrategy, setPersonalizedStrategy] = useState<PersonalizedStrategy | null>(null);

  const updateUrl = (tab: string) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    router.replace(`/social-media-content?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    updateUrl(tab);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateStrategy = () => {
    if (targetAudience && timeAvail && field) {
      const strategy = generatePersonalizedStrategy(targetAudience, timeAvail, field);
      setPersonalizedStrategy(strategy);
    }
  };

  const currentStrategy = platformStrategies.find(p => p.platform === selectedPlatform);
  const currentHashtags = hashtagStrategies.find(h => h.platform === selectedPlatform);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advanced Social Media Growth System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Psychology-based growth strategies, viral mechanics, and proven frameworks that go beyond basic social media advice.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "🧠 Psychology-Based Growth", "⚡ Growth Hacking", "🎯 Conversion Optimization", 
            "📊 Advanced Analytics", "🔍 Competitor Analysis", "💡 Viral Formulas"
          ].map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-8 text-xs">
          <TabsTrigger value="strategy" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Strategy
          </TabsTrigger>
          <TabsTrigger value="growth-hacking" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Growth Hacks
          </TabsTrigger>
          <TabsTrigger value="conversion" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            Conversion
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Competitor
          </TabsTrigger>
          <TabsTrigger value="crisis" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Crisis
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            Hashtags
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Personalized Strategy Generator
              </CardTitle>
              <CardDescription>Get a custom social media strategy based on your specific situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map(audience => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Time Availability</label>
                  <Select value={timeAvail} onValueChange={setTimeAvail}>
                    <SelectTrigger>
                      <SelectValue placeholder="How much time can you dedicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeAvailability.map(time => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Field</label>
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessFields.map(businessField => (
                        <SelectItem key={businessField.value} value={businessField.value}>
                          {businessField.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={generateStrategy} 
                disabled={!targetAudience || !timeAvail || !field}
                className="w-full"
              >
                Generate My Personalized Strategy
              </Button>
            </CardContent>
          </Card>

          {personalizedStrategy && (
            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Strategy</CardTitle>
                <CardDescription>
                  Customized for {personalizedStrategy.target_audience} in {personalizedStrategy.field} with {personalizedStrategy.time_availability}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      🎯 Recommended Platforms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {personalizedStrategy.recommended_platforms.map(platform => (
                        <Badge key={platform} variant="secondary">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      📅 Posting Schedule
                    </h4>
                    <p className="text-sm">{personalizedStrategy.content_strategy.posting_schedule}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    🎨 Content Strategy
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="font-medium text-sm mb-2">Primary Focus:</p>
                    <p className="text-sm">{personalizedStrategy.content_strategy.primary_focus}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm mb-2">Content Types:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {personalizedStrategy.content_strategy.content_types.map((type, i) => (
                          <li key={i}>{type}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Growth Tactics:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {personalizedStrategy.content_strategy.growth_tactics.map((tactic, i) => (
                          <li key={i}>{tactic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      ⚡ Quick Wins (Start This Week)
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {personalizedStrategy.quick_wins.map((win, i) => (
                        <li key={i}>{win}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      🚀 Long-term Goals (3-6 months)
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {personalizedStrategy.long_term_goals.map((goal, i) => (
                        <li key={i}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Platform-Specific Strategies</CardTitle>
              <CardDescription>Generic strategies by platform (use the personalized generator above for better results)</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[180px] mb-4">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformStrategies.map(p => <SelectItem key={p.platform} value={p.platform}>{p.platform}</SelectItem>)}
                </SelectContent>
              </Select>
              
              {currentStrategy && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Posting Frequency</h4>
                    <p className="text-sm">{currentStrategy.postFrequency}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Content Mix</h4>
                    <div className="space-y-2">
                      {currentStrategy.contentMix.map((mix, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{mix.type}</span>
                          <Badge variant="outline">{mix.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Growth Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {currentStrategy.growthTips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Idea Generator</CardTitle>
              <CardDescription>Stuck for ideas? Here are some content prompts to get you started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {contentIdeas.map((category, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-lg font-semibold">{category.category}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {category.ideas.map((idea, j) => (
                        <div key={j} className="border rounded-lg p-4">
                          <h4 className="font-medium">{idea.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 mb-2">{idea.description}</p>
                          <div className="flex gap-2">
                            {idea.formats.map(format => <Badge key={format} variant="secondary">{format}</Badge>)}
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

        <TabsContent value="hashtags" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Hashtag Platform Selection</CardTitle>
                    <CardDescription>Select a platform to see a tailored hashtag strategy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                            {hashtagStrategies.map(p => <SelectItem key={p.platform} value={p.platform}>{p.platform}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
          {currentHashtags && (
            <Card>
              <CardHeader>
                <CardTitle>Hashtag Strategy for {currentHashtags.platform}</CardTitle>
                <CardDescription>A mix of hashtags to maximize reach and engagement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentHashtags.categories.map((category, i) => (
                  <div key={i}>
                    <h4 className="font-semibold mb-2">{category.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.hashtags.map(tag => (
                        <div key={tag} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                            <span className="text-sm">{tag}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(tag)}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="growth-hacking" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Advanced Growth Hacking Strategies
              </CardTitle>
              <CardDescription>Psychology-based tactics and viral mechanics that actually work</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {growthHackingStrategies.map((category, i) => (
                  <AccordionItem key={i} value={`growth-${i}`}>
                    <AccordionTrigger className="text-lg font-semibold">{category.category}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {category.tactics.map((tactic, j) => (
                        <div key={j} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{tactic.name}</h4>
                            <Badge variant={tactic.difficultyLevel === 'Beginner' ? 'secondary' : tactic.difficultyLevel === 'Intermediate' ? 'default' : 'destructive'}>
                              {tactic.difficultyLevel}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{tactic.description}</p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-sm text-gray-600 mb-1">Implementation:</h5>
                              <p className="text-sm">{tactic.implementation}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm text-gray-600 mb-1">Expected Results:</h5>
                              <p className="text-sm font-medium text-green-700">{tactic.expectedResults}</p>
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

        <TabsContent value="conversion" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Conversion-Focused Content Strategies
              </CardTitle>
              <CardDescription>Turn social media engagement into actual business results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {conversionStrategies.map((platform, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 text-blue-700">{platform.platform} Conversion Strategies</h3>
                  <div className="grid gap-4">
                    {platform.strategies.map((strategy, j) => (
                      <div key={j} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">{strategy.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-sm text-gray-600 mb-1">How to implement:</h5>
                            <p className="text-sm">{strategy.implementation}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm text-gray-600 mb-1">Performance boost:</h5>
                            <p className="text-sm font-medium text-green-700">{strategy.conversionRate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Advanced Analytics Framework
              </CardTitle>
              <CardDescription>Metrics that actually matter for growth and revenue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {advancedAnalytics.map((metric, i) => (
                <div key={i} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-semibold text-lg mb-2">{metric.metric}</h3>
                  <p className="text-gray-700 mb-3">{metric.description}</p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-1">Calculation:</h5>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{metric.calculation}</code>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-1">Benchmarks:</h5>
                      <p className="text-sm font-medium">{metric.benchmarks}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-1">Platform Relevance:</h5>
                      <Badge variant="secondary">All Platforms</Badge>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Actionable Insights:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {metric.actionable_insights.map((insight, j) => <li key={j}>{insight}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitor" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                Competitor Analysis & Reverse Engineering
              </CardTitle>
              <CardDescription>Systematically outmaneuver your competition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {competitorAnalysisFramework.map((strategy, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{strategy.analysis_type}</h3>
                    <Badge variant="outline">{strategy.frequency}</Badge>
                  </div>
                  <p className="text-gray-700 mb-4">{strategy.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-2">Tools Needed:</h5>
                      <div className="flex flex-wrap gap-2">
                        {strategy.tools_needed.map(tool => (
                          <Badge key={tool} variant="secondary">{tool}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-2">Implementation Steps:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {strategy.implementation_steps.map((step, j) => <li key={j}>{step}</li>)}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crisis" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Crisis Management & Reputation Protection
              </CardTitle>
              <CardDescription>Frameworks for handling negative situations and protecting your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {crisisManagementStrategies.map((crisis, i) => (
                <div key={i} className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
                  <h3 className="font-semibold text-lg mb-2">{crisis.scenario}</h3>
                  <div className="mb-4">
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Framework:</h5>
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{crisis.response_framework}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-2">Immediate Actions (First 24 hours):</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {crisis.immediate_actions.map((action, j) => <li key={j}>{action}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-600 mb-2">Long-term Strategy:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {crisis.long_term_strategy.map((strategy, j) => <li key={j}>{strategy}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-sm text-gray-600">Example Response Template:</h5>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(crisis.example_response)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-white border rounded p-3 italic">{crisis.example_response}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Tactics</CardTitle>
              <CardDescription>Build a strong community with these engagement strategies.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-3">Response Templates</h4>
                    <div className="space-y-3">
                        {engagementTactics.responseTemplates.map((template, i) => (
                            <div key={i} className="border rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-medium">{template.name}</h5>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(template.template)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{template.template}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Community Building Ideas</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {engagementTactics.communityBuilding.map((idea, i) => <li key={i}>{idea}</li>)}
                    </ul>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SocialMediaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <SocialMediaContent />
      </Suspense>
    </main>
  );
}
