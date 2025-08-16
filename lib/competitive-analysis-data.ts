
export interface Competitor {
  id: number;
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  seoScore: number;
  contentScore: number;
  socialScore: number;
}

export interface FeatureComparison {
  feature: string;
  yourBusiness: 'Yes' | 'No' | 'Partial';
  competitorA: 'Yes' | 'No' | 'Partial';
  competitorB: 'Yes' | 'No' | 'Partial';
  competitorC: 'Yes' | 'No' | 'Partial';
}

export const competitors: Competitor[] = [
  {
    id: 1,
    name: 'Competitor A',
    website: 'competitor-a.com',
    strengths: ['Strong brand recognition', 'High domain authority', 'Large social media following'],
    weaknesses: ['Outdated website design', 'Slow to adopt new technology', 'Poor customer reviews'],
    seoScore: 85,
    contentScore: 78,
    socialScore: 92,
  },
  {
    id: 2,
    name: 'Competitor B',
    website: 'competitor-b.com',
    strengths: ['Excellent content marketing', 'Modern, user-friendly website', 'Strong email marketing'],
    weaknesses: ['Low domain authority', 'Small social media presence', 'Limited product range'],
    seoScore: 72,
    contentScore: 90,
    socialScore: 65,
  },
  {
    id: 3,
    name: 'Competitor C',
    website: 'competitor-c.com',
    strengths: ['Niche market leader', 'Very loyal customer base', 'Innovative products'],
    weaknesses: ['Poor SEO strategy', 'Inconsistent content creation', 'High prices'],
    seoScore: 60,
    contentScore: 70,
    socialScore: 75,
  },
];

export const featureComparison: FeatureComparison[] = [
  { feature: 'Free Shipping', yourBusiness: 'Yes', competitorA: 'Yes', competitorB: 'No', competitorC: 'No' },
  { feature: '24/7 Customer Support', yourBusiness: 'No', competitorA: 'Yes', competitorB: 'Yes', competitorC: 'No' },
  { feature: 'Mobile App', yourBusiness: 'Yes', competitorA: 'No', competitorB: 'Yes', competitorC: 'Partial' },
  { feature: 'Loyalty Program', yourBusiness: 'Partial', competitorA: 'Yes', competitorB: 'No', competitorC: 'Yes' },
  { feature: 'Subscription Service', yourBusiness: 'No', competitorA: 'No', competitorB: 'No', competitorC: 'Yes' },
];

export const analysisQuestions = [
    {
      question: "Who are your direct and indirect competitors?",
      description: "Direct competitors offer the same services to the same audience. Indirect competitors solve the same problem with a different solution."
    },
    {
      question: "What are their pricing models?",
      description: "Look at their pricing pages. Are they subscription-based, one-time fee, freemium, or something else?"
    },
    {
      question: "What are their key strengths and weaknesses?",
      description: "Analyze their website, content, social media, and customer reviews. What do they do well? Where do they fall short?"
    },
    {
      question: "What is their marketing strategy?",
      description: "Where do they advertise? What kind of content do they create? How do they engage with their audience on social media?"
    },
    {
        question: "What is their online market share and authority?",
        description: "Use SEO tools to estimate their organic traffic, domain authority, and backlink profile. This indicates their visibility in search engines."
    },
    {
        question: "What unique value proposition (UVP) do they offer?",
        description: "What makes them stand out? Is it price, quality, customer service, or a unique feature? This is often stated on their homepage."
    },
    {
        question: "What technologies are they using?",
        description: "Use browser extensions like Wappalyzer to identify the technologies powering their website (e.g., CMS, analytics, marketing automation)."
    },
    {
        question: "How do customers perceive them?",
        description: "Read reviews on sites like G2, Capterra, Yelp, or Google. Look for common themes in positive and negative feedback."
    }
  ];
  

export const competitorSWOT = {
  strengths: [
    "Identify what your competitors do well.",
    "What are their unique selling propositions (USPs)?",
    "Where do they have a strong market presence?",
    "What resources (e.g., funding, patents) do they have?"
  ],
  weaknesses: [
    "Where are your competitors lacking?",
    "Are there customer complaints or negative reviews?",
    "Do they have any resource limitations?",
    "Are there gaps in their product/service offerings?"
  ],
  opportunities: [
    "What market trends can you capitalize on that they are not?",
    "Are there underserved customer segments?",
    "Can you leverage their weaknesses?",
    "Are there new technologies you can adopt first?"
  ],
  threats: [
    "What market trends could negatively impact your business?",
    "Are there new competitors entering the market?",
    "Could your competitors' strengths negatively impact you?",
    "Are there any potential regulatory changes?"
  ]
};

export interface CompetitorInput {
  name: string;
  website: string;
  industry: string;
  fundingStage: string;
  employeeCount: string;
  businessModel: string;
}

export interface MarketPosition {
  competitor: string;
  marketShare: number;
  pricingTier: 'Budget' | 'Mid-Market' | 'Premium' | 'Enterprise';
  targetSegment: string;
  competitiveAdvantage: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CompetitiveIntelligence {
  category: string;
  tools: {
    name: string;
    description: string;
    dataPoints: string[];
    freeVersion: boolean;
  }[];
}

export interface StrategyRecommendation {
  opportunity: string;
  description: string;
  implementation: string[];
  timeframe: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
}

export const marketPositions: MarketPosition[] = [
  {
    competitor: "TechCorp (You)",
    marketShare: 15,
    pricingTier: "Mid-Market",
    targetSegment: "SMB Tech Companies",
    competitiveAdvantage: "Superior customer support & faster implementation",
    threatLevel: "Medium"
  },
  {
    competitor: "MarketLeader Inc",
    marketShare: 35,
    pricingTier: "Enterprise",
    targetSegment: "Fortune 500 Companies",
    competitiveAdvantage: "Brand recognition & comprehensive feature set",
    threatLevel: "High"
  },
  {
    competitor: "StartupRival",
    marketShare: 12,
    pricingTier: "Budget",
    targetSegment: "Early-stage startups",
    competitiveAdvantage: "Low pricing & simple onboarding",
    threatLevel: "Medium"
  },
  {
    competitor: "NicheFocus Co",
    marketShare: 8,
    pricingTier: "Premium",
    targetSegment: "Healthcare industry",
    competitiveAdvantage: "Industry-specific compliance & features",
    threatLevel: "Low"
  }
];

export const competitiveIntelligenceTools: CompetitiveIntelligence[] = [
  {
    category: "Website & SEO Analysis",
    tools: [
      {
        name: "Ahrefs",
        description: "Comprehensive SEO analysis tool",
        dataPoints: ["Organic traffic", "Keyword rankings", "Backlink profile", "Content gaps"],
        freeVersion: false
      },
      {
        name: "SimilarWeb",
        description: "Website traffic and engagement analytics",
        dataPoints: ["Traffic sources", "Audience demographics", "Engagement metrics", "App downloads"],
        freeVersion: true
      },
      {
        name: "BuiltWith",
        description: "Technology stack analysis",
        dataPoints: ["CMS platform", "Analytics tools", "Marketing stack", "E-commerce platform"],
        freeVersion: true
      }
    ]
  },
  {
    category: "Social Media Intelligence",
    tools: [
      {
        name: "BuzzSumo",
        description: "Content performance and social media analytics",
        dataPoints: ["Top-performing content", "Social engagement", "Influencer connections", "Content trends"],
        freeVersion: true
      },
      {
        name: "Sprout Social",
        description: "Social media monitoring and analytics",
        dataPoints: ["Engagement rates", "Follower growth", "Brand mentions", "Competitor benchmarks"],
        freeVersion: false
      }
    ]
  },
  {
    category: "Product Intelligence",
    tools: [
      {
        name: "G2 Reviews",
        description: "Software review and comparison platform",
        dataPoints: ["Customer satisfaction", "Feature ratings", "Pricing feedback", "Implementation experience"],
        freeVersion: true
      },
      {
        name: "ProductHunt",
        description: "Product launch and discovery platform",
        dataPoints: ["Launch performance", "Community reception", "Feature highlights", "User feedback"],
        freeVersion: true
      }
    ]
  },
  {
    category: "Financial Intelligence",
    tools: [
      {
        name: "Crunchbase",
        description: "Company funding and business intelligence",
        dataPoints: ["Funding rounds", "Investor information", "Employee count", "Acquisition history"],
        freeVersion: true
      },
      {
        name: "PitchBook",
        description: "Private market intelligence platform",
        dataPoints: ["Valuation data", "Deal flow", "Market analysis", "Exit opportunities"],
        freeVersion: false
      }
    ]
  }
];

export const strategyRecommendations: StrategyRecommendation[] = [
  {
    opportunity: "Content Marketing Gap",
    description: "Competitors are not creating educational content around emerging industry trends",
    implementation: [
      "Create weekly trend analysis blog posts",
      "Develop comprehensive guides on new technologies",
      "Host monthly webinars with industry experts",
      "Launch a podcast series interviewing thought leaders"
    ],
    timeframe: "3-6 months",
    difficulty: "Medium",
    impact: "High"
  },
  {
    opportunity: "Underserved Market Segment",
    description: "Mid-market companies (50-200 employees) lack tailored solutions",
    implementation: [
      "Develop mid-market specific pricing tier",
      "Create case studies targeting this segment",
      "Build partnerships with mid-market focused consultants",
      "Tailor onboarding process for mid-market needs"
    ],
    timeframe: "6-12 months",
    difficulty: "Hard",
    impact: "High"
  },
  {
    opportunity: "Technology Differentiation",
    description: "Competitors are slow to adopt AI/ML capabilities",
    implementation: [
      "Integrate AI-powered analytics into existing product",
      "Develop predictive features using machine learning",
      "Create AI-driven customer support chatbot",
      "Launch beta program for AI features"
    ],
    timeframe: "9-18 months",
    difficulty: "Hard",
    impact: "High"
  },
  {
    opportunity: "Customer Experience Enhancement",
    description: "Competitors have poor onboarding and support experiences",
    implementation: [
      "Implement guided onboarding flow",
      "Create comprehensive knowledge base",
      "Offer 24/7 chat support",
      "Develop customer success program"
    ],
    timeframe: "2-4 months",
    difficulty: "Easy",
    impact: "Medium"
  },
  {
    opportunity: "Partnership Ecosystem",
    description: "Limited integration partnerships in the competitive landscape",
    implementation: [
      "Identify top 10 complementary tools for integration",
      "Develop API partnership program",
      "Create joint marketing campaigns with partners",
      "Build marketplace presence on partner platforms"
    ],
    timeframe: "4-8 months",
    difficulty: "Medium",
    impact: "Medium"
  }
];

export const businessModels = [
  { value: "saas", label: "SaaS (Software as a Service)" },
  { value: "marketplace", label: "Marketplace" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "subscription", label: "Subscription" },
  { value: "freemium", label: "Freemium" },
  { value: "advertising", label: "Advertising-based" },
  { value: "consulting", label: "Consulting/Services" },
  { value: "platform", label: "Platform" }
];

export const fundingStages = [
  { value: "pre-seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B" },
  { value: "series-c", label: "Series C+" },
  { value: "ipo", label: "Public (IPO)" },
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "acquired", label: "Acquired" }
];

export const employeeCounts = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" }
];

export const industries = [
  { value: "saas", label: "SaaS & Software" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthcare Technology" },
  { value: "edtech", label: "Education Technology" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "hr", label: "Human Resources" },
  { value: "productivity", label: "Productivity Tools" },
  { value: "security", label: "Cybersecurity" },
  { value: "analytics", label: "Data & Analytics" }
];
