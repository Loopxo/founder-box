export interface Template {
  id: string;
  title: string;
  subject: string;
  body: string;
  successRate: string;
  category: string;
  customizationFields: CustomizationField[];
  useCases: string[];
  tips: string[];
}

export interface CustomizationField {
  field: string;
  description: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  templateCount: number;
  successRate: string;
  description: string;
  tags: string[];
}

export const industries: Industry[] = [
  {
    id: "local-service",
    name: "Local Service Businesses",
    icon: "🏪",
    templateCount: 10,
    successRate: "3-5%",
    description: "Lead recovery, booking automation, review generation",
    tags: ["Lead Recovery", "Booking", "Reviews"]
  },
  {
    id: "real-estate",
    name: "Real Estate Agents",
    icon: "🏠",
    templateCount: 8,
    successRate: "4-6%",
    description: "Lead response, client reactivation, referral generation",
    tags: ["Lead Response", "Past Clients", "Referrals"]
  },
  {
    id: "ecommerce",
    name: "E-commerce Owners",
    icon: "🛒",
    templateCount: 8,
    successRate: "2-4%",
    description: "Cart recovery, customer retention, review automation",
    tags: ["Cart Recovery", "Retention", "Reviews"]
  },
  {
    id: "coaches",
    name: "Coaches & Consultants",
    icon: "💼",
    templateCount: 10,
    successRate: "5-8%",
    description: "Client onboarding, time recovery, lead nurturing",
    tags: ["Onboarding", "Time Saving", "Nurturing"]
  },
  {
    id: "saas",
    name: "SaaS Companies",
    icon: "💻",
    templateCount: 8,
    successRate: "3-7%",
    description: "Trial conversion, churn reduction, feature adoption",
    tags: ["Trials", "Churn", "Features"]
  },
  {
    id: "agencies",
    name: "Marketing Agencies",
    icon: "📈",
    templateCount: 8,
    successRate: "4-6%",
    description: "Lead generation, client retention, sales optimization",
    tags: ["Lead Gen", "Retention", "Sales"]
  },
  {
    id: "follow-up",
    name: "Follow-up Sequences",
    icon: "📧",
    templateCount: 12,
    successRate: "2-5%",
    description: "Multi-touch sequences, breakup emails, re-engagement",
    tags: ["Sequences", "Follow-up", "Re-engagement"]
  },
  {
    id: "linkedin",
    name: "LinkedIn DMs",
    icon: "💼",
    templateCount: 10,
    successRate: "8-12%",
    description: "Connection requests, soft qualifiers, proof-based openers",
    tags: ["LinkedIn", "DMs", "Social"]
  },
  {
    id: "objections",
    name: "Objection Handling",
    icon: "🛡️",
    templateCount: 15,
    successRate: "15-25%",
    description: "Common objections, price concerns, timing issues",
    tags: ["Objections", "Responses", "Closing"]
  }
];

export const templates: Template[] = [
  // Local Service Business Templates
  {
    id: "local-1",
    title: "Lead Recovery System",
    subject: "Quick question about leads",
    body: `Hey [Name],

I saw you run [Business Name] here in [City]—looks awesome. I help local service businesses recover missed leads and automate follow-ups (especially when people call and don't get an answer).

Would you be open to seeing how I could set this up for you—free to start?

Cheers,
[Your Name]`,
    successRate: "3-5%",
    category: "local-service",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" },
      { field: "[Business Name]", description: "Their business name" },
      { field: "[City]", description: "Their location" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Local service businesses",
      "When targeting missed leads",
      "First outreach attempt"
    ],
    tips: [
      "Research their website first",
      "Mention specific service area",
      "Follow up in 3-4 days"
    ]
  },
  {
    id: "local-2",
    title: "Missed Call Recovery",
    subject: "You're losing leads—here's how to fix it",
    body: `Hey [Name],

If a client calls and no one answers… what happens?

Most businesses lose that lead. I help you text them back automatically within seconds and get the deal back.

Want to try it free?

[Your Name]`,
    successRate: "4-6%",
    category: "local-service",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Service businesses with phone leads",
      "High-volume call businesses",
      "Businesses that miss calls often"
    ],
    tips: [
      "Focus on the pain point",
      "Use urgency without being pushy",
      "Offer free trial to reduce risk"
    ]
  },
  {
    id: "local-3",
    title: "Booking Automation",
    subject: "Idea to help [Business Name] get more bookings",
    body: `Hey [Name],

I'm a local automation consultant—I help businesses like yours automate booking flows and reduce last-minute cancellations.

Would love to show you how a simple system could save your staff hours per week.

[Your Name]`,
    successRate: "3-4%",
    category: "local-service",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" },
      { field: "[Business Name]", description: "Their business name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Appointment-based businesses",
      "High cancellation rate businesses",
      "Busy service providers"
    ],
    tips: [
      "Mention time savings for staff",
      "Focus on reducing cancellations",
      "Position as efficiency improvement"
    ]
  },

  // Real Estate Templates
  {
    id: "realestate-1",
    title: "Lead Response Automation",
    subject: "Automating real estate lead follow-ups",
    body: `Hey [Name],

I help agents like you follow up with every online lead within 5 seconds—even when you're at a showing or asleep.

Want me to show you how it works? It's helped one agent close 2 extra deals last month.

Let me know—happy to send a quick demo too (:

[Your Name]`,
    successRate: "4-6%",
    category: "real-estate",
    customizationFields: [
      { field: "[Name]", description: "Agent's first name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Real estate agents with online leads",
      "Agents who miss lead response windows",
      "Busy agents with multiple showings"
    ],
    tips: [
      "Emphasize 5-second response time",
      "Include specific success story",
      "Use friendly, conversational tone"
    ]
  },

  // E-commerce Templates
  {
    id: "ecommerce-1",
    title: "Cart Abandonment Recovery",
    subject: "Recovering lost sales for [Brand Name]",
    body: `Hey [Name],

How many people add items to their cart on [Website] but never complete the purchase?

I help e-commerce brands recover 15-25% of abandoned carts with automated email sequences and exit-intent offers.

Worth seeing how this could work for [Brand Name]?

[Your Name]`,
    successRate: "2-4%",
    category: "ecommerce",
    customizationFields: [
      { field: "[Name]", description: "Business owner's first name" },
      { field: "[Brand Name]", description: "Their brand name" },
      { field: "[Website]", description: "Their website URL" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "E-commerce stores with cart abandonment",
      "Online retailers losing sales",
      "Businesses wanting to increase conversion"
    ],
    tips: [
      "Use specific recovery percentages",
      "Ask engaging questions first",
      "Mention both email and exit-intent strategies"
    ]
  },

  // Follow-up Sequences
  {
    id: "followup-1",
    title: "Initial Follow-up (Day 2)",
    subject: "Re: [Original Subject]",
    body: `Hey [Name],

Just wanted to make sure my last email didn't get buried in your inbox.

[Restate main value proposition in one sentence]

Still worth exploring?

[Your Name]`,
    successRate: "2-3%",
    category: "follow-up",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" },
      { field: "[Original Subject]", description: "Original email subject line" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Second touch in sequence",
      "Gentle reminder without pressure",
      "When first email gets no response"
    ],
    tips: [
      "Keep it shorter than original email",
      "Reference previous email clearly",
      "Use same value proposition"
    ]
  },

  // LinkedIn DM Templates
  {
    id: "linkedin-1",
    title: "Local Business Owner",
    subject: "",
    body: `Hey [Name], saw your post about the new studio—looks amazing!

Quick question: are you doing all your bookings manually or using anything automated?`,
    successRate: "8-12%",
    category: "linkedin",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" }
    ],
    useCases: [
      "LinkedIn connection requests",
      "Local business owners",
      "Initial social outreach"
    ],
    tips: [
      "Reference their recent post",
      "Ask engaging questions",
      "Keep it conversational"
    ]
  },

  // More Real Estate Templates
  {
    id: "realestate-2",
    title: "Past Client Reactivation",
    subject: "Bringing back past clients automatically",
    body: `Hey [Name],

How many past clients do you have who might buy or sell again in the next 2-3 years?

I help agents stay top-of-mind with automated check-ins, market updates, and birthday messages. Usually generates 2-3 extra referrals per month.

Want to see how it works for your database?

[Your Name]`,
    successRate: "4-7%",
    category: "real-estate",
    customizationFields: [
      { field: "[Name]", description: "Agent's first name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Agents with large databases",
      "Reactivating dormant clients",
      "Building referral systems"
    ],
    tips: [
      "Emphasize passive income potential",
      "Focus on database size",
      "Mention specific results"
    ]
  },

  // More E-commerce Templates
  {
    id: "ecommerce-2",
    title: "Post-Purchase Automation",
    subject: "A quick idea to boost your repeat customers",
    body: `Hey [Name],

Just checked out [Brand Name]—awesome vibe.

I help e-comm brands increase repeat purchases by automating post-purchase review flows, reactivation campaigns, and follow-up offers.

Happy to send a short video breaking down a few ideas—no strings.

[Your Name]`,
    successRate: "3-5%",
    category: "ecommerce",
    customizationFields: [
      { field: "[Name]", description: "Business owner's first name" },
      { field: "[Brand Name]", description: "Their brand name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "E-commerce brands",
      "Increasing customer lifetime value",
      "Post-purchase optimization"
    ],
    tips: [
      "Compliment their brand first",
      "Offer value upfront",
      "Keep it low-pressure"
    ]
  },

  // Coaches Templates
  {
    id: "coaches-2",
    title: "Client Onboarding",
    subject: "Streamlining your client onboarding",
    body: `Hey [Name],

How much time do you spend each week onboarding new coaching clients?

I help coaches create automated onboarding sequences: welcome videos, resource delivery, calendar booking, and check-in schedules.

Usually saves 3-5 hours per new client.

Want to see the system?

[Your Name]`,
    successRate: "5-8%",
    category: "coaches",
    customizationFields: [
      { field: "[Name]", description: "Coach's first name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Coaches with manual onboarding",
      "Time-strapped consultants",
      "Scaling coaching businesses"
    ],
    tips: [
      "Quantify time savings",
      "Focus on efficiency",
      "Mention specific deliverables"
    ]
  },

  // SaaS Templates
  {
    id: "saas-2",
    title: "Trial Conversion",
    subject: "Improving your trial-to-paid conversion",
    body: `Hey [Name],

What's your current trial-to-paid conversion rate for [SaaS Name]?

I help SaaS companies increase conversions through automated onboarding sequences, feature adoption campaigns, and perfectly timed upgrade prompts.

One client increased their conversion rate from 12% to 23%.

Want to see the trial optimization strategy?

[Your Name]`,
    successRate: "4-6%",
    category: "saas",
    customizationFields: [
      { field: "[Name]", description: "Founder/Marketing lead name" },
      { field: "[SaaS Name]", description: "Their SaaS product name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "SaaS with free trials",
      "Low conversion rates",
      "Onboarding optimization"
    ],
    tips: [
      "Ask about current metrics",
      "Share specific results",
      "Focus on proven strategies"
    ]
  },

  // Agency Templates
  {
    id: "agencies-2",
    title: "Results-Focused Outreach",
    subject: "Quick question about leads",
    body: `Hey [Name],

Noticed you're running an incredible agency. But tell me, are you absolutely crushing it in sales right now, or is there room for improvement?

I specialize in lead generation for agencies like yours, and I'm confident I can help you significantly increase your sales.

On a scale of 1 to 10, how satisfied are you with your current sales performance?

[Your Name]`,
    successRate: "4-7%",
    category: "agencies",
    customizationFields: [
      { field: "[Name]", description: "Agency owner's first name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Marketing agencies",
      "Agencies needing more leads",
      "Sales process optimization"
    ],
    tips: [
      "Use direct qualification",
      "Create urgency tactfully",
      "Ask for specific metrics"
    ]
  },

  // More Follow-up Templates
  {
    id: "followup-2",
    title: "Value-Add Follow-up (Day 6)",
    subject: "Case study: How [Similar Company] got [Result]",
    body: `Hey [Name],

Since you didn't reply to my last email, figured I'd share a quick case study.

Just helped [Similar Company Type] achieve [Specific Result] using [Brief Strategy Description].

Same industry as you, similar challenges.

Want to see how we did it?

[Your Name]`,
    successRate: "3-5%",
    category: "follow-up",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" },
      { field: "[Similar Company Type]", description: "Similar business type" },
      { field: "[Specific Result]", description: "Quantified outcome" },
      { field: "[Brief Strategy Description]", description: "How you achieved it" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Second follow-up in sequence",
      "Sharing social proof",
      "Re-engaging prospects"
    ],
    tips: [
      "Acknowledge no response directly",
      "Lead with value",
      "Use similar company examples"
    ]
  },

  {
    id: "followup-3",
    title: "Breakup Email (Day 17)",
    subject: "Last email (promise)",
    body: `Hey [Name],

I'll assume this isn't a priority right now and stop following up.

If things change, feel free to reach out. My door's always open.

Best of luck with [Company Name]!

[Your Name]

P.S. - If I've misread the situation and you are interested, just reply "interested" and I'll send over some times to chat.`,
    successRate: "5-8%",
    category: "follow-up",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" },
      { field: "[Company Name]", description: "Their company name" },
      { field: "[Your Name]", description: "Your name" }
    ],
    useCases: [
      "Final follow-up email",
      "Breaking up professionally",
      "Last-chance engagement"
    ],
    tips: [
      "Be graceful and respectful",
      "Leave door open",
      "Include escape hatch in PS"
    ]
  },

  // More LinkedIn Templates
  {
    id: "linkedin-2",
    title: "Digital Marketer",
    subject: "",
    body: `Hey [Name], just came across your agency—love what you're building. 

Curious—have you explored using AI for lead follow-ups or reporting yet?`,
    successRate: "10-15%",
    category: "linkedin",
    customizationFields: [
      { field: "[Name]", description: "Prospect first name" }
    ],
    useCases: [
      "Digital marketing agencies",
      "AI automation prospects",
      "LinkedIn connection requests"
    ],
    tips: [
      "Compliment their work first",
      "Ask about current tech stack",
      "Keep it conversational"
    ]
  },

  {
    id: "linkedin-3",
    title: "Coach/Consultant",
    subject: "",
    body: `Hey [Name], I work with coaches and creators to automate client onboarding and email flows. 

Want to see how I can help save you 5+ hours/week?

Looking forward to hearing from you!`,
    successRate: "8-12%",
    category: "linkedin",
    customizationFields: [
      { field: "[Name]", description: "Coach's first name" }
    ],
    useCases: [
      "Coaches and consultants",
      "Time-saving automation",
      "Direct value proposition"
    ],
    tips: [
      "Be specific about time savings",
      "Target their main pain point",
      "End with enthusiasm"
    ]
  },

  // Objection Handling
  {
    id: "objection-1",
    title: "I'm not interested",
    subject: "",
    body: `I understand that you might not be looking for [service type] at the moment, but our approach has helped many [industry] businesses significantly increase their [results]. 

If it's okay with you, I'd like to send you some case studies and additional information that you can review at your convenience. Who knows, it might become relevant to your business down the line.`,
    successRate: "15-25%",
    category: "objections",
    customizationFields: [
      { field: "[service type]", description: "Your service category" },
      { field: "[industry]", description: "Their industry" },
      { field: "[results]", description: "Specific outcomes you deliver" }
    ],
    useCases: [
      "When prospect says not interested",
      "Softening resistance",
      "Keeping door open for future"
    ],
    tips: [
      "Acknowledge their position",
      "Offer low-pressure next step",
      "Focus on future relevance"
    ]
  },

  {
    id: "objection-2",
    title: "Price is too high",
    subject: "",
    body: `I understand that budget can be a concern. However, our services are designed to generate a significant return on your investment by helping you [specific benefit]. 

If you're open to it, we can schedule a meeting to discuss your specific needs and explore options that might fit your budget better. Sometimes we can phase the implementation to spread costs over time.`,
    successRate: "20-30%",
    category: "objections",
    customizationFields: [
      { field: "[specific benefit]", description: "Main value proposition" }
    ],
    useCases: [
      "Price objections",
      "Budget concerns",
      "Cost justification"
    ],
    tips: [
      "Focus on ROI not cost",
      "Offer payment options",
      "Suggest meeting to discuss"
    ]
  },

  {
    id: "objection-3",
    title: "We already have someone",
    subject: "",
    body: `That's great to hear! Our services can complement the efforts of your current [team/provider] by bringing a fresh perspective and new strategies to the table. 

We could potentially work together to optimize your current process and further increase your results. Would you be open to a meeting to explore possible synergies?`,
    successRate: "10-20%",
    category: "objections",
    customizationFields: [
      { field: "[team/provider]", description: "Current solution type" }
    ],
    useCases: [
      "Existing vendor objection",
      "Competition concerns",
      "Complementary positioning"
    ],
    tips: [
      "Don't attack current solution",
      "Position as complementary",
      "Focus on synergies"
    ]
  }
];

// Calculator functions
export const calculateCampaignMetrics = (
  targetMeetings: number,
  industry: string,
  experienceLevel: string
) => {
  // Base conversion rates by industry
  const industryRates: Record<string, number> = {
    "local-service": 0.04,
    "real-estate": 0.05,
    "ecommerce": 0.03,
    "coaches": 0.065,
    "saas": 0.05,
    "agencies": 0.05,
    "follow-up": 0.035,
    "linkedin": 0.10,
    "objections": 0.20
  };

  // Experience multipliers
  const experienceMultipliers: Record<string, number> = {
    "beginner": 0.7,
    "intermediate": 1.0,
    "expert": 1.3
  };

  const baseRate = industryRates[industry] || 0.04;
  const experienceMultiplier = experienceMultipliers[experienceLevel] || 1.0;
  const actualRate = baseRate * experienceMultiplier;

  // Calculate backwards from target meetings
  const meetingBookingRate = 0.4; // 40% of positive replies book meetings
  const positiveReplyRate = 0.3; // 30% of replies are positive
  
  const requiredPositiveReplies = targetMeetings / meetingBookingRate;
  const requiredTotalReplies = requiredPositiveReplies / positiveReplyRate;
  const requiredEmails = Math.ceil(requiredTotalReplies / actualRate);

  return {
    emailsNeeded: requiredEmails,
    expectedReplies: Math.round(requiredEmails * actualRate),
    meetingsLikely: Math.round(requiredEmails * actualRate * positiveReplyRate * meetingBookingRate),
    dailyEmails: Math.ceil(requiredEmails / 30), // Monthly target
    timeline: experienceLevel === "beginner" ? "2-3 months to optimize" : 
              experienceLevel === "intermediate" ? "1-2 months to optimize" : 
              "2-4 weeks to optimize"
  };
};

// Subject line analyzer
export const analyzeSubjectLine = (subject: string) => {
  const length = subject.length;
  const words = subject.toLowerCase().split(' ');
  
  // Urgency words (can be spammy if overused)
  const urgencyWords = ['urgent', 'immediate', 'asap', 'quick', 'fast', 'now', 'today'];
  const urgencyCount = words.filter(word => urgencyWords.includes(word)).length;
  
  // Personalization check
  const hasPersonalization = subject.includes('[') || subject.includes('{');
  
  // Emotion words
  const positiveWords = ['help', 'improve', 'better', 'grow', 'increase', 'boost'];
  const negativeWords = ['problem', 'issue', 'trouble', 'losing', 'missing'];
  const emotionScore = 
    words.filter(word => positiveWords.includes(word)).length * 2 +
    words.filter(word => negativeWords.includes(word)).length * 1;
  
  // Question check
  const isQuestion = subject.includes('?');
  
  let score = 0;
  const feedback: string[] = [];
  
  // Length scoring
  if (length >= 30 && length <= 50) {
    score += 25;
    feedback.push("✅ Good length (30-50 characters)");
  } else if (length < 30) {
    score += 15;
    feedback.push("⚠️ Might be too short - consider adding context");
  } else {
    score += 10;
    feedback.push("⚠️ Might be too long - risk of truncation");
  }
  
  // Urgency scoring
  if (urgencyCount === 0) {
    score += 25;
    feedback.push("✅ No urgency words (avoids spam triggers)");
  } else if (urgencyCount === 1) {
    score += 15;
    feedback.push("⚠️ One urgency word - use carefully");
  } else {
    score += 5;
    feedback.push("❌ Multiple urgency words - high spam risk");
  }
  
  // Personalization scoring
  if (hasPersonalization) {
    score += 25;
    feedback.push("✅ Includes personalization fields");
  } else {
    score += 10;
    feedback.push("⚠️ Consider adding personalization");
  }
  
  // Emotion scoring
  if (emotionScore > 0) {
    score += 25;
    feedback.push("✅ Includes emotional words");
  } else {
    score += 15;
    feedback.push("⚠️ Consider adding emotional appeal");
  }
  
  return {
    score: Math.min(100, score),
    length,
    feedback,
    isQuestion,
    hasPersonalization,
    urgencyCount,
    emotionScore
  };
};