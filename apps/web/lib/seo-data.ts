// SEO Analysis Data and Types

export interface SEOChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'onpage' | 'content' | 'local' | 'offpage';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  impact: string;
  resources: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'tool' | 'guide' | 'website' | 'checker';
}

export interface KeywordAnalysis {
  keyword: string;
  difficulty: 'low' | 'medium' | 'high';
  searchVolume: string;
  cpc: string;
  competition: string;
  opportunities: string[];
}

export interface CostAnalysis {
  channel: string;
  monthlyBudget: number;
  expectedClicks: number;
  estimatedCPC: number;
  projectedROI: string;
  description: string;
}

export interface IndustryBenchmark {
  industry: string;
  avgCPC: number;
  conversionRate: number;
  avgOrderValue: number;
  organicCTR: number;
}

// SEO Checklist Data
export const seoChecklist: SEOChecklistItem[] = [
  // Technical SEO
  {
    id: 'ssl-certificate',
    title: 'SSL Certificate (HTTPS)',
    description: 'Ensure your website has a valid SSL certificate and uses HTTPS',
    category: 'technical',
    priority: 'high',
    completed: false,
    impact: 'Improves security, trust, and search rankings. Google considers HTTPS a ranking factor.',
    resources: [
      { title: 'Google SSL Check', url: 'https://transparencyreport.google.com/https/certificates', type: 'checker' },
      { title: 'Let\'s Encrypt (Free SSL)', url: 'https://letsencrypt.org/', type: 'tool' },
      { title: 'Cloudflare (Free SSL)', url: 'https://www.cloudflare.com/', type: 'tool' }
    ]
  },
  {
    id: 'page-speed',
    title: 'Page Speed Optimization',
    description: 'Optimize your website loading speed for better user experience and rankings',
    category: 'technical',
    priority: 'high',
    completed: false,
    impact: 'Faster sites rank better and have higher conversion rates. Google uses Core Web Vitals as ranking factors.',
    resources: [
      { title: 'Google PageSpeed Insights', url: 'https://pagespeed.web.dev/', type: 'checker' },
      { title: 'GTmetrix', url: 'https://gtmetrix.com/', type: 'checker' },
      { title: 'Web.dev Performance Guide', url: 'https://web.dev/performance/', type: 'guide' }
    ]
  },
  {
    id: 'mobile-friendly',
    title: 'Mobile-Friendly Design',
    description: 'Ensure your website is responsive and mobile-optimized',
    category: 'technical',
    priority: 'high',
    completed: false,
    impact: 'Mobile-first indexing means Google primarily uses mobile version for ranking.',
    resources: [
      { title: 'Google Mobile-Friendly Test', url: 'https://search.google.com/test/mobile-friendly', type: 'checker' },
      { title: 'Responsive Design Guide', url: 'https://developers.google.com/web/fundamentals/design-and-ux/responsive', type: 'guide' }
    ]
  },
  {
    id: 'xml-sitemap',
    title: 'XML Sitemap',
    description: 'Create and submit an XML sitemap to search engines',
    category: 'technical',
    priority: 'medium',
    completed: false,
    impact: 'Helps search engines discover and index your pages more efficiently.',
    resources: [
      { title: 'XML Sitemap Generator', url: 'https://www.xml-sitemaps.com/', type: 'tool' },
      { title: 'Google Search Console', url: 'https://search.google.com/search-console', type: 'tool' },
      { title: 'Yoast SEO Plugin (WordPress)', url: 'https://yoast.com/wordpress/plugins/seo/', type: 'tool' }
    ]
  },

  // On-Page SEO
  {
    id: 'title-tags',
    title: 'Optimize Title Tags',
    description: 'Write compelling, keyword-rich title tags for all pages',
    category: 'onpage',
    priority: 'high',
    completed: false,
    impact: 'Title tags are a major ranking factor and affect click-through rates from search results.',
    resources: [
      { title: 'Title Tag Checker', url: 'https://moz.com/learn/seo/title-tag', type: 'guide' },
      { title: 'SERP Preview Tool', url: 'https://mangools.com/free-seo-tools/serp-simulator', type: 'tool' }
    ]
  },
  {
    id: 'meta-descriptions',
    title: 'Write Meta Descriptions',
    description: 'Create unique, compelling meta descriptions for all pages',
    category: 'onpage',
    priority: 'medium',
    completed: false,
    impact: 'Improves click-through rates from search results, indirectly boosting rankings.',
    resources: [
      { title: 'Meta Description Guide', url: 'https://moz.com/learn/seo/meta-description', type: 'guide' },
      { title: 'Character Count Tool', url: 'https://charactercounttool.com/', type: 'tool' }
    ]
  },
  {
    id: 'header-tags',
    title: 'Optimize Header Tags (H1-H6)',
    description: 'Structure content with proper header tag hierarchy',
    category: 'onpage',
    priority: 'medium',
    completed: false,
    impact: 'Helps search engines understand content structure and improves user experience.',
    resources: [
      { title: 'Header Tag Best Practices', url: 'https://moz.com/learn/seo/on-page-factors', type: 'guide' },
      { title: 'SEO Browser Extension', url: 'https://chrome.google.com/webstore/detail/seo-meta-in-1-click/bjogjfinolnhfhkbipphpdlldadpnmhc', type: 'tool' }
    ]
  },
  {
    id: 'image-alt-text',
    title: 'Add Alt Text to Images',
    description: 'Include descriptive alt text for all images on your website',
    category: 'onpage',
    priority: 'medium',
    completed: false,
    impact: 'Improves accessibility and helps images rank in image search results.',
    resources: [
      { title: 'Alt Text Guide', url: 'https://moz.com/learn/seo/alt-text', type: 'guide' },
      { title: 'Image SEO Best Practices', url: 'https://developers.google.com/search/docs/advanced/guidelines/google-images', type: 'guide' }
    ]
  },

  // Content SEO
  {
    id: 'keyword-research',
    title: 'Conduct Keyword Research',
    description: 'Research and target relevant keywords for your business',
    category: 'content',
    priority: 'high',
    completed: false,
    impact: 'Targeting the right keywords is fundamental to SEO success.',
    resources: [
      { title: 'Google Keyword Planner', url: 'https://ads.google.com/home/tools/keyword-planner/', type: 'tool' },
      { title: 'Ubersuggest', url: 'https://neilpatel.com/ubersuggest/', type: 'tool' },
      { title: 'Answer The Public', url: 'https://answerthepublic.com/', type: 'tool' }
    ]
  },
  {
    id: 'content-quality',
    title: 'Create High-Quality Content',
    description: 'Develop comprehensive, valuable content that serves user intent',
    category: 'content',
    priority: 'high',
    completed: false,
    impact: 'Quality content attracts backlinks, keeps users engaged, and establishes authority.',
    resources: [
      { title: 'Content Strategy Guide', url: 'https://moz.com/beginners-guide-to-seo/how-to-create-content', type: 'guide' },
      { title: 'Hemingway Editor', url: 'https://hemingwayapp.com/', type: 'tool' },
      { title: 'Grammarly', url: 'https://www.grammarly.com/', type: 'tool' }
    ]
  },
  {
    id: 'internal-linking',
    title: 'Implement Internal Linking',
    description: 'Create a strategic internal linking structure',
    category: 'content',
    priority: 'medium',
    completed: false,
    impact: 'Helps distribute page authority and improves site navigation.',
    resources: [
      { title: 'Internal Linking Guide', url: 'https://moz.com/learn/seo/internal-link', type: 'guide' },
      { title: 'Screaming Frog (Free version)', url: 'https://www.screamingfrog.co.uk/seo-spider/', type: 'tool' }
    ]
  },

  // Local SEO
  {
    id: 'google-business-profile',
    title: 'Optimize Google Business Profile',
    description: 'Complete and optimize your Google Business Profile listing',
    category: 'local',
    priority: 'high',
    completed: false,
    impact: 'Essential for local search visibility and appearing in local map results.',
    resources: [
      { title: 'Google Business Profile', url: 'https://www.google.com/business/', type: 'tool' },
      { title: 'Local SEO Guide', url: 'https://moz.com/learn/seo/local-seo', type: 'guide' }
    ]
  },
  {
    id: 'local-citations',
    title: 'Build Local Citations',
    description: 'Create consistent business listings across directories',
    category: 'local',
    priority: 'medium',
    completed: false,
    impact: 'Improves local search rankings and helps customers find your business.',
    resources: [
      { title: 'Yelp Business', url: 'https://business.yelp.com/', type: 'website' },
      { title: 'Facebook Business Page', url: 'https://business.facebook.com/', type: 'website' },
      { title: 'BrightLocal Citation Tracker', url: 'https://www.brightlocal.com/local-search-results-checker/', type: 'checker' }
    ]
  },

  // Off-Page SEO
  {
    id: 'backlink-building',
    title: 'Build Quality Backlinks',
    description: 'Develop a strategy to earn high-quality backlinks',
    category: 'offpage',
    priority: 'high',
    completed: false,
    impact: 'Backlinks are one of the strongest ranking factors in Google\'s algorithm.',
    resources: [
      { title: 'Backlink Checker', url: 'https://ahrefs.com/backlink-checker', type: 'checker' },
      { title: 'HARO (Help a Reporter Out)', url: 'https://www.helpareporter.com/', type: 'tool' },
      { title: 'Guest Posting Guide', url: 'https://backlinko.com/guest-blogging-guide', type: 'guide' }
    ]
  }
];

// Keyword Analysis Examples
export const keywordExamples: KeywordAnalysis[] = [
  {
    keyword: 'digital marketing agency',
    difficulty: 'high',
    searchVolume: '14,800/month',
    cpc: '$12.50',
    competition: 'High',
    opportunities: ['Long-tail variations', 'Local modifiers', 'Service-specific terms']
  },
  {
    keyword: 'local seo services',
    difficulty: 'medium',
    searchVolume: '2,900/month',
    cpc: '$15.20',
    competition: 'Medium',
    opportunities: ['City + keyword', 'Near me variations', 'Industry-specific']
  },
  {
    keyword: 'website design tips',
    difficulty: 'low',
    searchVolume: '1,600/month',
    cpc: '$3.80',
    competition: 'Low',
    opportunities: ['How-to content', 'Tutorial videos', 'Case studies']
  }
];

// Cost Analysis Data
export const marketingChannels: CostAnalysis[] = [
  {
    channel: 'Google Search Ads',
    monthlyBudget: 2000,
    expectedClicks: 400,
    estimatedCPC: 5.00,
    projectedROI: '3:1',
    description: 'High-intent traffic with immediate results. Good for specific product/service targeting.'
  },
  {
    channel: 'Facebook/Instagram Ads',
    monthlyBudget: 1500,
    expectedClicks: 750,
    estimatedCPC: 2.00,
    projectedROI: '2.5:1',
    description: 'Great for brand awareness and reaching new audiences. Visual content performs well.'
  },
  {
    channel: 'SEO (Content + Technical)',
    monthlyBudget: 3000,
    expectedClicks: 1200,
    estimatedCPC: 0.50,
    projectedROI: '5:1',
    description: 'Long-term strategy with compound growth. Lower cost per click over time.'
  },
  {
    channel: 'LinkedIn Ads (B2B)',
    monthlyBudget: 2500,
    expectedClicks: 250,
    estimatedCPC: 10.00,
    projectedROI: '4:1',
    description: 'Premium platform for B2B targeting. Higher costs but better quality leads.'
  },
  {
    channel: 'Content Marketing',
    monthlyBudget: 2000,
    expectedClicks: 800,
    estimatedCPC: 1.25,
    projectedROI: '3.5:1',
    description: 'Blog posts, videos, infographics. Builds authority and drives organic traffic.'
  }
];

// Industry Benchmarks
export const industryBenchmarks: IndustryBenchmark[] = [
  {
    industry: 'E-commerce',
    avgCPC: 1.16,
    conversionRate: 2.86,
    avgOrderValue: 68,
    organicCTR: 3.17
  },
  {
    industry: 'Finance',
    avgCPC: 3.77,
    conversionRate: 5.10,
    avgOrderValue: 650,
    organicCTR: 2.91
  },
  {
    industry: 'Healthcare',
    avgCPC: 2.62,
    conversionRate: 3.36,
    avgOrderValue: 280,
    organicCTR: 3.27
  },
  {
    industry: 'Legal',
    avgCPC: 5.88,
    conversionRate: 4.12,
    avgOrderValue: 1500,
    organicCTR: 2.46
  },
  {
    industry: 'Real Estate',
    avgCPC: 2.37,
    conversionRate: 2.47,
    avgOrderValue: 8500,
    organicCTR: 3.64
  },
  {
    industry: 'Technology',
    avgCPC: 3.80,
    conversionRate: 3.04,
    avgOrderValue: 340,
    organicCTR: 2.79
  },
  {
    industry: 'Education',
    avgCPC: 2.40,
    conversionRate: 3.48,
    avgOrderValue: 180,
    organicCTR: 4.08
  },
  {
    industry: 'Home Services',
    avgCPC: 2.93,
    conversionRate: 4.63,
    avgOrderValue: 420,
    organicCTR: 3.85
  }
];

// SEO Tools and Resources
export const seoTools = {
  free: [
    { name: 'Google Search Console', url: 'https://search.google.com/search-console', description: 'Monitor website performance in Google search' },
    { name: 'Google Analytics', url: 'https://analytics.google.com/', description: 'Track website traffic and user behavior' },
    { name: 'Google PageSpeed Insights', url: 'https://pagespeed.web.dev/', description: 'Test page loading speed and optimization' },
    { name: 'Google Keyword Planner', url: 'https://ads.google.com/home/tools/keyword-planner/', description: 'Research keywords and search volumes' },
    { name: 'Ubersuggest (Limited Free)', url: 'https://neilpatel.com/ubersuggest/', description: 'Keyword research and competitor analysis' },
    { name: 'Answer The Public', url: 'https://answerthepublic.com/', description: 'Find questions people ask about your topic' },
    { name: 'Google Trends', url: 'https://trends.google.com/', description: 'Explore search trend data over time' },
    { name: 'MozBar (Browser Extension)', url: 'https://moz.com/products/pro/seo-toolbar', description: 'See page authority and other SEO metrics' }
  ],
  paid: [
    { name: 'Ahrefs', url: 'https://ahrefs.com/', description: 'Comprehensive SEO toolkit - $99/month' },
    { name: 'SEMrush', url: 'https://www.semrush.com/', description: 'All-in-one marketing toolkit - $119/month' },
    { name: 'Moz Pro', url: 'https://moz.com/products/pro', description: 'SEO software suite - $99/month' },
    { name: 'Screaming Frog (Paid)', url: 'https://www.screamingfrog.co.uk/seo-spider/', description: 'Website crawler for technical SEO - $149/year' }
  ]
};

// Cost-Saving Strategies
export const costSavingStrategies = [
  {
    strategy: 'Focus on Long-Tail Keywords',
    impact: 'High',
    savingsPercent: '40-60%',
    description: 'Target specific, less competitive keywords with lower CPC but higher conversion intent.',
    implementation: [
      'Use keyword research tools to find long-tail variations',
      'Create content around specific questions and problems',
      'Optimize for voice search queries',
      'Target local + service combinations'
    ]
  },
  {
    strategy: 'Invest in SEO Over Paid Ads',
    impact: 'Very High',
    savingsPercent: '70-80%',
    description: 'Build organic traffic that doesn\'t require ongoing ad spend.',
    implementation: [
      'Create high-quality, helpful content consistently',
      'Build topic clusters around your expertise',
      'Optimize existing content for better rankings',
      'Focus on earning quality backlinks'
    ]
  },
  {
    strategy: 'Use Negative Keywords in PPC',
    impact: 'Medium',
    savingsPercent: '15-25%',
    description: 'Prevent ads from showing for irrelevant searches.',
    implementation: [
      'Regularly review search terms reports',
      'Add negative keywords for irrelevant queries',
      'Use phrase and exact match types strategically',
      'Monitor and refine keyword lists monthly'
    ]
  },
  {
    strategy: 'Optimize for Local Search',
    impact: 'High',
    savingsPercent: '30-50%',
    description: 'Target local customers who are more likely to convert.',
    implementation: [
      'Optimize Google Business Profile completely',
      'Build local citations and directories',
      'Create location-specific landing pages',
      'Encourage and manage customer reviews'
    ]
  },
  {
    strategy: 'Content Repurposing',
    impact: 'Medium',
    savingsPercent: '50-70%',
    description: 'Get more value from existing content across multiple channels.',
    implementation: [
      'Turn blog posts into videos and podcasts',
      'Create social media posts from blog content',
      'Break long content into multiple pieces',
      'Update and republish evergreen content'
    ]
  }
];

// ROI Calculation Functions
export const calculateROI = (investment: number, revenue: number): string => {
  const roi = ((revenue - investment) / investment) * 100;
  return `${roi.toFixed(1)}%`;
};

export const calculatePaybackPeriod = (monthlyInvestment: number, monthlyReturn: number): string => {
  const months = monthlyInvestment / (monthlyReturn - monthlyInvestment);
  return `${months.toFixed(1)} months`;
};

export const projectedTrafficGrowth = (currentTraffic: number, monthlyGrowthRate: number, months: number): number => {
  return Math.round(currentTraffic * Math.pow(1 + monthlyGrowthRate / 100, months));
};