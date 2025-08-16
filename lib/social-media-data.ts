
export interface PlatformStrategy {
  platform: 'X/Twitter' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'TikTok';
  postFrequency: string;
  contentMix: {
    type: string;
    percentage: number;
  }[];
  growthTips: string[];
}

export interface ContentIdea {
  category: string;
  ideas: {
    title: string;
    description: string;
    formats: string[];
  }[];
}

export interface HashtagStrategy {
  platform: string;
  categories: {
    name: string;
    hashtags: string[];
  }[];
}

export const platformStrategies: PlatformStrategy[] = [
  {
    platform: 'X/Twitter',
    postFrequency: '3-5 tweets/day, 1-2 threads/week',
    contentMix: [
      { type: 'Quick Tips & Insights', percentage: 40 },
      { type: 'Engagement (Polls, Questions)', percentage: 30 },
      { type: 'Promotional & Links', percentage: 20 },
      { type: 'User-Generated Content', percentage: 10 },
    ],
    growthTips: [
      'Engage with larger accounts in your niche.',
      'Use relevant hashtags in every tweet.',
      'Host or participate in Twitter Spaces.',
      'Run polls to increase engagement.',
    ],
  },
  {
    platform: 'LinkedIn',
    postFrequency: '3-5 posts/week',
    contentMix: [
      { type: 'Industry Insights & Articles', percentage: 50 },
      { type: 'Company News & Culture', percentage: 20 },
      { type: 'Case Studies & Testimonials', percentage: 20 },
      { type: 'Promotional Content', percentage: 10 },
    ],
    growthTips: [
      'Publish long-form articles to establish thought leadership.',
      'Engage in relevant industry groups.',
      'Tag influencers and companies in your posts.',
      'Use a professional and authoritative tone.',
    ],
  },
  {
    platform: 'Instagram',
    postFrequency: '4-6 posts/week, 8-15 stories/week',
    contentMix: [
      { type: 'High-Quality Visuals (Images/Videos)', percentage: 60 },
      { type: 'Behind-the-Scenes & Stories', percentage: 20 },
      { type: 'User-Generated Content & Reels', percentage: 15 },
      { type: 'Promotional Posts', percentage: 5 },
    ],
    growthTips: [
      'Use high-quality, visually appealing images and videos.',
      'Collaborate with influencers and other brands.',
      'Use Reels to reach a wider audience.',
      'Engage with your audience through comments and DMs.',
    ],
  },
];

export const contentIdeas: ContentIdea[] = [
  {
    category: 'Educational',
    ideas: [
      { title: 'How-To Guide', description: 'A step-by-step guide on a topic relevant to your audience.', formats: ['Blog Post', 'Video', 'Carousel'] },
      { title: 'Industry Glossary', description: 'Define key terms and jargon in your industry.', formats: ['Blog Post', 'Twitter Thread'] },
      { title: 'Common Mistakes', description: 'Highlight common mistakes your audience makes and how to avoid them.', formats: ['Video', 'Carousel'] },
    ],
  },
  {
    category: 'Promotional',
    ideas: [
      { title: 'Product Demo', description: 'Showcase your product in action and highlight its key features.', formats: ['Video', 'Live Stream'] },
      { title: 'Customer Testimonial', description: 'Share a success story from a satisfied customer.', formats: ['Image with Quote', 'Video'] },
      { title: 'Limited-Time Offer', description: 'Create a sense of urgency with a special promotion.', formats: ['Image', 'Story'] },
    ],
  },
  {
    category: 'Engagement',
    ideas: [
      { title: 'Ask Me Anything (AMA)', description: 'Invite your audience to ask you questions about your expertise.', formats: ['Live Stream', 'Twitter Space'] },
      { title: 'Run a Poll or Quiz', description: 'Engage your audience with a fun and interactive poll or quiz.', formats: ['Twitter Poll', 'Instagram Story'] },
      { title: 'Caption This Photo', description: 'Post an interesting photo and ask your audience to come up with a creative caption.', formats: ['Image'] },
    ],
  },
];

export const hashtagStrategies: HashtagStrategy[] = [
  {
    platform: 'Instagram',
    categories: [
      { name: 'Broad (1M+ posts)', hashtags: ['#digitalmarketing', '#socialmedia', '#business'] },
      { name: 'Niche (100k-500k posts)', hashtags: ['#marketingstrategy', '#contentcreation', '#startupgrowth'] },
      { name: 'Specific (10k-50k posts)', hashtags: ['#seotips', '#emailmarketingtips', '#leadgeneration'] },
    ],
  },
  {
    platform: 'X/Twitter',
    categories: [
      { name: 'Industry Events', hashtags: ['#SXSW', '#INBOUND2024', '#WebSummit'] },
      { name: 'Weekly Chats', hashtags: ['#MarketingMonday', '#TechTuesday', '#FollowFriday'] },
      { name: 'General Business', hashtags: ['#entrepreneurship', '#innovation', '#leadership'] },
    ],
  },
  {
    platform: 'LinkedIn',
    categories: [
      { name: 'Professional Development', hashtags: ['#careeradvice', '#personalbranding', '#publicspeaking'] },
      { name: 'Industry Trends', hashtags: ['#futureofwork', '#aiinbusiness', '#digitaltransformation'] },
      { name: 'Job Seeking', hashtags: ['#jobsearch', '#resume', '#interviewtips'] },
    ],
  },
];

export const engagementTactics = {
    responseTemplates: [
        { name: "Positive Feedback", template: "Thank you so much for your kind words! We're thrilled you had a great experience." },
        { name: "Negative Feedback", template: "We're so sorry to hear about your experience. Please DM us so we can learn more and make things right." },
        { name: "User-Generated Content", template: "This is amazing! Thanks for sharing. Do we have your permission to feature this on our page?" }
    ],
    communityBuilding: [
        "Run a weekly Q&A session with an expert from your team.",
        "Create a user-generated content campaign with a unique hashtag.",
        "Feature a customer or community member of the week.",
        "Ask open-ended questions to encourage discussion in your comments."
    ]
};

export interface GrowthHackingStrategy {
  category: string;
  tactics: {
    name: string;
    description: string;
    implementation: string;
    expectedResults: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
}

export const growthHackingStrategies: GrowthHackingStrategy[] = [
  {
    category: "Psychological Triggers",
    tactics: [
      {
        name: "The Zeigarnik Effect",
        description: "People remember unfinished tasks better than completed ones. Create content that leaves viewers wanting more.",
        implementation: "End posts with cliffhangers like 'Tomorrow I'll reveal the 3rd mistake that cost me $50K...' or create multi-part series.",
        expectedResults: "35-50% higher engagement on follow-up posts",
        difficultyLevel: "Beginner"
      },
      {
        name: "Social Proof Cascading",
        description: "Leverage multiple types of social proof in sequence to build credibility momentum.",
        implementation: "Post customer count → testimonial → case study → media mention within 48 hours. Each builds on previous proof.",
        expectedResults: "60-80% increase in conversion rates",
        difficultyLevel: "Intermediate"
      },
      {
        name: "Authority Transference",
        description: "Borrow credibility from established figures by strategic association.",
        implementation: "Quote industry leaders, respond to their posts with valuable insights, or create content inspired by their frameworks.",
        expectedResults: "25-40% boost in perceived expertise",
        difficultyLevel: "Advanced"
      }
    ]
  },
  {
    category: "Viral Mechanics",
    tactics: [
      {
        name: "The Hook-Story-Offer Formula",
        description: "Pattern interrupt → emotional story → clear value proposition. Based on neuroscience of attention.",
        implementation: "Start with controversial/surprising statement, share relatable struggle, end with solution/insight.",
        expectedResults: "300-500% higher share rates",
        difficultyLevel: "Intermediate"
      },
      {
        name: "Reciprocity Loops",
        description: "Create content that naturally encourages audience to contribute back.",
        implementation: "Share vulnerable failures → ask for similar experiences → feature responses → creates ongoing cycle.",
        expectedResults: "2-3x more user-generated content",
        difficultyLevel: "Advanced"
      },
      {
        name: "Controversy Bridging",
        description: "Take opposing views and find unexpected common ground to maximize reach across audiences.",
        implementation: "Address polarizing topics by acknowledging both sides, then reveal shared underlying values.",
        expectedResults: "400-600% broader reach",
        difficultyLevel: "Advanced"
      }
    ]
  },
  {
    category: "Algorithm Exploitation",
    tactics: [
      {
        name: "Engagement Velocity Hacking",
        description: "Front-load engagement in first 30 minutes to trigger algorithm promotion.",
        implementation: "Schedule posts when your audience is most active, notify top fans beforehand, use engagement bait in comments.",
        expectedResults: "200-300% wider organic reach",
        difficultyLevel: "Intermediate"
      },
      {
        name: "Cross-Platform Seeding",
        description: "Use smaller platforms to build momentum before posting on main platform.",
        implementation: "Test content on Twitter/TikTok first, then post proven winners on LinkedIn/Instagram with momentum.",
        expectedResults: "150-250% better performance on main platform",
        difficultyLevel: "Advanced"
      },
      {
        name: "Comment Threading Strategy",
        description: "Structure comments to maximize thread length and keep users on platform longer.",
        implementation: "Ask follow-up questions in comments, create comment templates that encourage responses, pin strategic comments.",
        expectedResults: "40-60% longer session duration",
        difficultyLevel: "Beginner"
      }
    ]
  }
];

export interface ConversionStrategy {
  platform: string;
  strategies: {
    name: string;
    description: string;
    implementation: string;
    conversionRate: string;
  }[];
}

export const conversionStrategies: ConversionStrategy[] = [
  {
    platform: "LinkedIn",
    strategies: [
      {
        name: "Soft Pitch Sandwich",
        description: "Bury sales messages between valuable content to reduce resistance.",
        implementation: "Value post → subtle product mention → value post. Ratio should be 80% value, 20% promotion.",
        conversionRate: "15-25% higher than direct promotion"
      },
      {
        name: "Problem-Agitation-Solution (PAS) Evolution",
        description: "Advanced version that includes social proof and urgency.",
        implementation: "Identify pain → amplify consequences → show solution → provide social proof → create urgency.",
        conversionRate: "200-400% better than traditional PAS"
      }
    ]
  },
  {
    platform: "Twitter/X",
    strategies: [
      {
        name: "Thread-to-Funnel Conversion",
        description: "Use thread format to gradually warm prospects before conversion ask.",
        implementation: "Start with broad insight, narrow to specific problem, end with solution link. Each tweet builds buying intent.",
        conversionRate: "8-12% click-through rates vs 2-3% standard"
      },
      {
        name: "Quote Tweet Amplification",
        description: "Strategically quote tweet your own content to extend reach and add new angles.",
        implementation: "Quote tweet your post with additional insight, stats, or questions 4-6 hours after original.",
        conversionRate: "50-80% additional reach and engagement"
      }
    ]
  }
];

export interface AnalyticsFramework {
  metric: string;
  description: string;
  calculation: string;
  benchmarks: string;
  actionable_insights: string[];
}

export const advancedAnalytics: AnalyticsFramework[] = [
  {
    metric: "Engagement Velocity",
    description: "Speed of engagement in first hour vs. total post lifespan",
    calculation: "(Engagements in first 60 min / Total engagements) × 100",
    benchmarks: "Good: >40%, Excellent: >60%",
    actionable_insights: [
      "If low (<30%), posting time is wrong for your audience",
      "If high (>70%), your content has strong hook potential",
      "Optimize posting times based on highest velocity periods"
    ]
  },
  {
    metric: "Content Decay Rate",
    description: "How quickly your content stops generating engagement",
    calculation: "Time until engagement drops to 10% of peak hourly rate",
    benchmarks: "Twitter: 18 min, LinkedIn: 2 hours, Instagram: 48 hours",
    actionable_insights: [
      "Fast decay = great hook, poor substance",
      "Slow decay = evergreen content potential",
      "Plan content updates during decay phases"
    ]
  },
  {
    metric: "Conversion Attribution Score",
    description: "Which content types drive actual business results",
    calculation: "Track UTM parameters and assign conversion values to content types",
    benchmarks: "Varies by industry, track monthly improvements",
    actionable_insights: [
      "Double down on high-attribution content types",
      "A/B test low performers before eliminating",
      "Create content series around winning formats"
    ]
  }
];

export interface CompetitorStrategy {
  analysis_type: string;
  description: string;
  tools_needed: string[];
  implementation_steps: string[];
  frequency: string;
}

export const competitorAnalysisFramework: CompetitorStrategy[] = [
  {
    analysis_type: "Content Gap Analysis",
    description: "Identify topics your competitors aren't covering that your audience needs",
    tools_needed: ["BuzzSumo", "Ahrefs", "Manual audit"],
    implementation_steps: [
      "List top 5 competitors in your space",
      "Audit their last 50 posts across platforms", 
      "Categorize content themes and identify gaps",
      "Survey your audience about unmet needs",
      "Create content calendar filling gaps with your unique angle"
    ],
    frequency: "Monthly"
  },
  {
    analysis_type: "Engagement Pattern Reverse Engineering",
    description: "Analyze what makes competitor content perform and adapt principles",
    tools_needed: ["Social Blade", "Sprout Social", "Manual tracking"],
    implementation_steps: [
      "Identify competitors' top-performing posts from last 90 days",
      "Analyze common elements: length, format, time, hooks, CTAs",
      "Test similar patterns with your brand voice",
      "Track performance vs your baseline",
      "Refine approach based on results"
    ],
    frequency: "Bi-weekly"
  },
  {
    analysis_type: "Algorithm Timing Analysis",
    description: "Discover when competitors post and find your optimal windows",
    tools_needed: ["Hootsuite", "Later", "Buffer"],
    implementation_steps: [
      "Track competitor posting times for 4 weeks",
      "Identify their peak engagement periods",
      "Test posting during their 'off-peak' times",
      "Measure reach and engagement differences",
      "Establish unique optimal posting schedule"
    ],
    frequency: "Quarterly"
  }
];

export interface CrisisManagement {
  scenario: string;
  response_framework: string;
  immediate_actions: string[];
  long_term_strategy: string[];
  example_response: string;
}

export const crisisManagementStrategies: CrisisManagement[] = [
  {
    scenario: "Negative Viral Content",
    response_framework: "RESPOND - Rapid Engagement, Support, Prevention, Oversight, Navigate, Deliver",
    immediate_actions: [
      "Acknowledge within 2 hours max",
      "Move conversation to DMs when possible",
      "Apologize sincerely if at fault",
      "Provide concrete next steps",
      "Monitor mentions every 30 minutes"
    ],
    long_term_strategy: [
      "Conduct internal review of processes",
      "Create content addressing root cause",
      "Implement systems to prevent recurrence",
      "Follow up publicly on improvements made"
    ],
    example_response: "Thank you for bringing this to our attention. This doesn't meet our standards, and we're taking immediate action to address it. I'm sending you a DM to discuss how we can make this right. We'll also be reviewing our processes to prevent this from happening again."
  },
  {
    scenario: "Product/Service Failure",
    response_framework: "CARE - Communicate, Acknowledge, Resolve, Evolve",
    immediate_actions: [
      "Publish transparent status update",
      "Provide realistic timeline for resolution",
      "Offer interim solutions or compensation",
      "Create dedicated hashtag for updates"
    ],
    long_term_strategy: [
      "Share detailed post-mortem when resolved",
      "Implement customer feedback loop",
      "Create content showcasing improvements",
      "Build reputation recovery campaign"
    ],
    example_response: "We're experiencing technical difficulties with [service]. Our team is working on a fix, and we expect resolution by [time]. Affected users will receive [compensation]. We'll update you every hour at #[hashtag]. We sincerely apologize for the inconvenience."
  },
  {
    scenario: "Competitor Attack or Comparison",
    response_framework: "REDIRECT - Respect, Educate, Direct, Invite, Refocus, Engage, Create, Transform",
    immediate_actions: [
      "Stay professional and factual",
      "Focus on your unique value proposition",
      "Redirect to positive customer testimonials",
      "Invite private discussion if necessary"
    ],
    long_term_strategy: [
      "Create content highlighting differentiation",
      "Build stronger customer advocacy program",
      "Develop strategic partnerships",
      "Focus on innovation announcements"
    ],
    example_response: "We respect [competitor] and believe there's room for different approaches in our industry. What sets us apart is [unique value]. Here's what our customers say about their experience: [testimonial link]. Happy to discuss more privately."
  }
];

export interface PersonalizedStrategy {
  target_audience: string;
  time_availability: string;
  field: string;
  recommended_platforms: string[];
  content_strategy: {
    primary_focus: string;
    content_types: string[];
    posting_schedule: string;
    growth_tactics: string[];
  };
  quick_wins: string[];
  long_term_goals: string[];
}

export const targetAudiences = [
  { value: "entrepreneurs", label: "Entrepreneurs & Startup Founders" },
  { value: "professionals", label: "Business Professionals" },
  { value: "consumers", label: "General Consumers" },
  { value: "developers", label: "Developers & Tech Community" },
  { value: "creators", label: "Content Creators & Influencers" },
  { value: "investors", label: "Investors & VCs" },
  { value: "students", label: "Students & Recent Graduates" },
  { value: "executives", label: "C-Level Executives" }
];

export const timeAvailability = [
  { value: "minimal", label: "1-2 hours/week (Minimal)" },
  { value: "light", label: "3-5 hours/week (Light)" },
  { value: "moderate", label: "6-10 hours/week (Moderate)" },
  { value: "heavy", label: "10+ hours/week (Heavy)" }
];

export const businessFields = [
  { value: "saas", label: "SaaS & Tech" },
  { value: "ecommerce", label: "E-commerce & Retail" },
  { value: "consulting", label: "Consulting & Services" },
  { value: "finance", label: "Finance & Fintech" },
  { value: "health", label: "Health & Wellness" },
  { value: "education", label: "Education & Training" },
  { value: "realestate", label: "Real Estate" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "manufacturing", label: "Manufacturing & Industrial" },
  { value: "nonprofit", label: "Non-profit & Social Impact" }
];

export function generatePersonalizedStrategy(
  targetAudience: string,
  timeAvail: string,
  field: string
): PersonalizedStrategy {
  const strategies: { [key: string]: PersonalizedStrategy } = {
    // SaaS strategies
    "entrepreneurs-minimal-saas": {
      target_audience: "Entrepreneurs & Startup Founders",
      time_availability: "1-2 hours/week",
      field: "SaaS & Tech",
      recommended_platforms: ["LinkedIn", "Twitter/X"],
      content_strategy: {
        primary_focus: "Thought leadership and industry insights",
        content_types: ["Quick tips", "Industry observations", "Behind-the-scenes"],
        posting_schedule: "3 posts/week (2 LinkedIn, 1 Twitter)",
        growth_tactics: ["Engage with industry leaders", "Share startup learnings", "Comment on trending tech topics"]
      },
      quick_wins: [
        "Share one startup lesson learned per week",
        "Engage with 5 industry leaders daily (10 min)",
        "Repost relevant content with your take"
      ],
      long_term_goals: [
        "Build network of 1000+ entrepreneurs",
        "Establish thought leadership in your niche",
        "Generate inbound leads through content"
      ]
    },
    "professionals-moderate-consulting": {
      target_audience: "Business Professionals",
      time_availability: "6-10 hours/week",
      field: "Consulting & Services",
      recommended_platforms: ["LinkedIn", "Instagram"],
      content_strategy: {
        primary_focus: "Professional expertise and case studies",
        content_types: ["Case studies", "Industry analysis", "How-to guides", "Professional tips"],
        posting_schedule: "5 posts/week (4 LinkedIn, 1 Instagram)",
        growth_tactics: ["Publish weekly case studies", "Create industry reports", "Host LinkedIn Live sessions"]
      },
      quick_wins: [
        "Share 1 client success story per week (anonymized)",
        "Create template/framework posts",
        "Engage in industry LinkedIn groups"
      ],
      long_term_goals: [
        "Position as industry expert",
        "Generate 3-5 qualified leads monthly",
        "Build email list of 1000+ prospects"
      ]
    },
    // Add more specific combinations as needed
  };

  // Default strategy generator based on individual components
  const defaultStrategy: PersonalizedStrategy = {
    target_audience: targetAudiences.find(t => t.value === targetAudience)?.label || "Business Professionals",
    time_availability: timeAvailability.find(t => t.value === timeAvail)?.label || "3-5 hours/week",
    field: businessFields.find(f => f.value === field)?.label || "General Business",
    recommended_platforms: getPlatformsByAudienceAndField(targetAudience, field),
    content_strategy: getContentStrategy(targetAudience, timeAvail, field),
    quick_wins: getQuickWins(targetAudience, timeAvail, field),
    long_term_goals: getLongTermGoals(targetAudience, field)
  };

  // Try to find specific strategy, fallback to default
  const key = `${targetAudience}-${timeAvail}-${field}`;
  return strategies[key] || defaultStrategy;
}

function getPlatformsByAudienceAndField(audience: string, field: string): string[] {
  const platformMatrix: { [key: string]: string[] } = {
    "entrepreneurs": ["LinkedIn", "Twitter/X"],
    "professionals": ["LinkedIn", "Instagram"],
    "consumers": ["Instagram", "Facebook", "TikTok"],
    "developers": ["Twitter/X", "LinkedIn"],
    "creators": ["Instagram", "TikTok", "Twitter/X"],
    "investors": ["LinkedIn", "Twitter/X"],
    "students": ["Instagram", "TikTok", "LinkedIn"],
    "executives": ["LinkedIn"]
  };
  
  return platformMatrix[audience] || ["LinkedIn", "Twitter/X"];
}

function getContentStrategy(audience: string, time: string, field: string) {
  const timeBasedFrequency: { [key: string]: string } = {
    "minimal": "2-3 posts/week",
    "light": "4-5 posts/week", 
    "moderate": "6-8 posts/week",
    "heavy": "10+ posts/week"
  };

  const audienceContent: { [key: string]: { focus: string, types: string[] } } = {
    "entrepreneurs": {
      focus: "Startup insights and founder journey",
      types: ["Startup lessons", "Industry trends", "Founder stories", "Business tips"]
    },
    "professionals": {
      focus: "Professional expertise and industry knowledge",
      types: ["Industry analysis", "Professional tips", "Case studies", "How-to guides"]
    },
    "consumers": {
      focus: "Lifestyle and product benefits",
      types: ["Behind-the-scenes", "Product demos", "User stories", "Lifestyle content"]
    },
    "developers": {
      focus: "Technical insights and coding content",
      types: ["Code snippets", "Tech tutorials", "Industry news", "Tool reviews"]
    }
  };

  const content = audienceContent[audience] || audienceContent["professionals"];
  
  return {
    primary_focus: content.focus,
    content_types: content.types,
    posting_schedule: timeBasedFrequency[time] || "4-5 posts/week",
    growth_tactics: [
      "Engage with industry leaders daily",
      "Share valuable insights consistently", 
      "Participate in relevant conversations"
    ]
  };
}

function getQuickWins(audience: string, time: string, field: string): string[] {
  const quickWins: { [key: string]: string[] } = {
    "entrepreneurs": [
      "Share one startup lesson per week",
      "Engage with 10 founder posts daily",
      "Comment valuable insights on trending topics"
    ],
    "professionals": [
      "Share industry insights 3x/week",
      "Engage with colleagues and prospects daily",
      "Create one how-to post weekly"
    ],
    "consumers": [
      "Post behind-the-scenes content",
      "Share customer testimonials",
      "Engage with brand communities"
    ]
  };

  return quickWins[audience] || quickWins["professionals"];
}

function getLongTermGoals(audience: string, field: string): string[] {
  const goals: { [key: string]: string[] } = {
    "entrepreneurs": [
      "Build network of 1000+ industry connections",
      "Establish thought leadership in your niche",
      "Generate inbound partnership opportunities"
    ],
    "professionals": [
      "Position as industry expert",
      "Generate qualified leads monthly",
      "Build engaged professional network"
    ],
    "consumers": [
      "Build loyal customer community",
      "Increase brand awareness by 300%",
      "Drive consistent sales through social proof"
    ]
  };

  return goals[audience] || goals["professionals"];
}
