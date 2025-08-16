// Sales Development Toolkit Data

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  freeTier: boolean;
  url: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
}

export const chapters: Chapter[] = [
  {
    id: 'chapter1',
    title: 'Why Sales Development?',
    description: 'Understanding the pros and cons of SDR roles',
    icon: 'BookOpen',
    content: `THE HARD TRUTH
Sales development jobs come and go. In fact, they have one of the highest churn rates out of all the gigs out there.

Let's break it down, step-by-step so you know whether or not this is something you want to pursue.

THE PROS OF SALES DEVELOPMENT
➜ No degree needed
➜ No education needed
➜ Fast growth potential
➜ Remote/hybrid roles
➜ Commission + benefits

THE CONS OF SALES DEVELOPMENT
➜ Intense work environment
➜ High stress, frequent layoffs
➜ Repetition of tasks and activities 
➜ Lack of creativity or freedom to experiment

"They're going to have to eat sh*t for at least two years" he said. "Back in my day, we didn't even have the audacity to ask for a promotion until twice that amount of time."

These were the words of a past CEO I worked for. And while he was a bit of a scumbag, he wasn't completely wrong about this. SDRs (especially the ones in tech) are a commodity for companies. If you're getting into this career so you can go on to becoming an AE or manager, on average you'll be in the weeds for 18 months.

If you can accept that hard truth — the truth that growth will come with pain — then keep on reading and you'll learn how to land an offer within 60 days or less.`
  },
  {
    id: 'chapter2',
    title: 'Identifying Good Opportunities',
    description: 'Learn how to find the right companies for your SDR career',
    icon: 'Target',
    content: `THE RULE OF THUMB
Almost always, CXOs want to cover their bases. They want to invest the bare minimum in an SDR program with unrealistic promises and expectations.

Here is the pay that you should expect (even if this is your first gig). We'll cover negotiations later, but there's an unspoken law that I call "the 20% rule."

And the 20% rule works like this — in a negotiation, both parties will fight for what they want and ask for 20% more/less than the baseline.

So, for example, if the average salary of an SDR $50K, they will offer you $40K and you will request $60K.

Again, we'll cover this later. But my point is that, at a minimum, you should be getting paid that average amount.

GOOD COMPANIES VS. BAD COMPANIES
Applying aimlessly to company-by-company will cause you to get offers from places you'll quit after 9 months. There's a big difference between the enterprise environments (Dell, Oracle, Salesforce) from the tiny startups or even smaller mid-market spots (Falkon, Whippy, Dock).

The choice should be made based on your personality type in conjunction with your goals. It's a generalization, but reps can be broken into roughly two categories.

Rep #1 (Startup, lower MM): Likes fast paced environments where their back is constantly against the wall. Thrives with minimal resources and can operate in scrappy conditions. Fast-learner who can hit goals completely independently.

Pay for these roles are typically lower — and for good reason. Startups/smaller MM companies that don't have the funds to cover high salaried sellers and are building their first outbound motion.

This is a dice roll. Joining a startup/smaller MM has the highest potential for rapid growth (and can come with other benefits too like equity).

Rep #2 (Upper MM, Enterprise): Can still be fast paced, but are typically slower, a bit outdated (in terms of technology and training), and redundant. This is a role that's ideal for people trying to break into sales and want a higher salary right off the bat.

Because of the size of these companies, reps typically are noticed less and can stay under the radar. There's a comradery in organizations like this — new reps can easily seek out the best sellers in the company for mentorships and guidance.

TLDR; this is the perfect opportunity for reps that will need more ramp up time. The chances of moving up internally at a company like this is lower than a startup or smaller MM and your creativity will be constrained. On the other side of that, it offers new reps the ability to learn quickly with a decent base salary.

ASK AROUND
A big mistake most new sellers make is asking current reps of the company about their experience. There's a conflict of interest there — expect them to answer dishonestly.

Instead, if you like a company and want to work for them, ask past employees about the company. Things you should ask about:

➜ The culture
➜ Quota attainment
➜ Ability to experiment
➜ Management style and personalities of the company
➜ And (most importantly) what the CEO is like — this alone in an indicator of the company's health

An easier way to do this is by checking Glassdoor reviews or indeed reviews.

With that being said, take website reviews with a grain of salt.

HIGH REVENUE & LOW HEADCOUNT
Something we'll cover soon is how to track all of your leads/accounts (hiring managers/companies) on a spreadsheet. One column will be dedicated for identifying what I call an "ease rate."

Ease rate = the company's revenue/total headcount

Here's why that matters — the higher the ease rate, the less stressful the environment will be. It means that they have money to blow through and you probably won't SOL 6 months down the road when their CFO takes a look at their quarterly financial reports. A low ease rate indicates more risk and a lack of job security or certainty.`
  },
  {
    id: 'chapter3',
    title: 'Creating Lists and Managing Contacts',
    description: 'Organize and track your prospects effectively',
    icon: 'Users',
    content: `THE DEADLY CRM
When you do land that first gig, you'll quickly learn that instead of ripping through dials and doing the actual work that brings in the money, you'll instead be spending hours-upon-hours in your CRM (customer relationship management system) to update the statuses of leads.

And whether you like it or not, the smartest way to handle your job search is by doing exactly that. For this, I'd recommend using Google Sheets because it can handle everything you need it to (+ these freebie formulas will help you enrich the data on your spreadsheet).

It isn't hard to put one of these together, but if you want this one, here it is.
If it doesn't download to your drive, do this:
➜ Copy every line up to 20 (or command+A, command+C)
➜ Paste to new spreadsheet
➜ Click line 1 to highlight the row ➜ Right click ➜ View more actions ➜ Freeze row

In the next chapter, we're going to cover how to get in front of your desired companies — to preface that, you'll need to know where to find contact information.

There are a few ways to collect that information:
➜ LinkedIn "Contact info" button.

If you aren't connected with them, then there's a chance that that contact data will be hidden.
➜ Apollo and Seamless both have free plans.
➜ For emails only, here's a free source made by Lucas Perret from Lemlist.`
  },
  {
    id: 'chapter4',
    title: 'Using Outbound Strategies',
    description: 'Create opportunities through proactive outreach',
    icon: 'Send',
    content: `TIME TO START PLAYING
If you haven't noticed, every SDR job on LinkedIn has over 300 applicants. And even with a banger resume, the chance of you getting that job is like playing Squid Game.

But fear not. There's a better way.

If you want to get in front of hiring managers, you'll need to get put yourself in front of them. The easier (and most practical) way to do that is by prospecting them the same way you would if you were SDRing.

That's a friendly way of saying pick up the phone and start typing up some emails and DMs until someone gives you a chance.

TOOLS AND TECH TO HELP
Some of the tech here is free or has a freemium.
Others are paid.

None of these are a necessity, but they will absolutely help you maximize your opportunities.

#1: MailTrack
MailTrack lets you know when someone opened your email and if they clicked on any links.

You can also create campaigns and templates.

#2 Paage
Paage, which is what you see here, let's you create mini-landing pages to showcase a product or service.

In your case — it can be best used as a prospecting tool that can tell the hiring manager why they should hire you.

Here are two examples from Paages I've used during a job search:

➜ Example 1
➜ Example 2

Send these to decision makers and let them convert.

Paage is $50-$100/month but has a free trial.
And you can use my code for 20% off too.

My referral page: paage.io
My discount code: dealcloser

#3 PhoneBurner
Now, I'm biased because I work for them.

But, if you have a list of 100 decision makers, this will help you call them in under 90 minutes.

70+ calls/hour

Light CRM

Spam guard

Voicemail + Email drops

I'll get you setup with an extended trial to support your job hunt.
You can do that here.

MESSAGING
It's more important to note what to avoid before we get into messaging that converts.

Dont:
➜ Send your resume
➜ Say over 75 words
➜ Talk about how great you are
➜ Beg like you need a prom date
➜ Try to sound witty using elongated words
➜ Sound like a corporate goof taking themselves to seriously

What you want to do instead is sound like a human being.

When I interviewed with PhoneBurner, I messaged the CEO on LinkedIn saying:

"Hey, I'm on a job hunt right now and am a PhoneBurner power user.
Any chance I can get a shot at working with you guys?
Here's what I'm good at and why I might be a good fit" (and then included my Paage).

STOP SAYING THE SAME STUFF AS EVERYONE ELSE
If you're wondering why you aren't getting interviews, it's likely for one (or a combination of) these reasons:
➜ Your messaging sounds like everyone else's
➜ You aren't messaging enough decision makers
➜ You aren't showing what you can offer

And if you're message reads like it was written by ChatGPT, the hiring manager will absolutely notice.
DON'T DO IT.

Keep it short, sweet, and easy to read.
Talk about them instead of you.
And always end with soft CTAs:
➜ Worth a chat?
➜ Can I send you some info?
➜ What do you think?

BE AGGRESSIVE AF
You read that right.

Be mad aggressive. If you're doing this for 20 minutes a day, you won't land an SDR job in under 60 days.

No matter how many interviews you have scheduled or how many offers are on the table, you need to keep going. If you do, you'll be able to pick from a pool of options and find something that you'll love.

Cliché advice:
Treat this like it's a job.

8+ hours a day of real work.
➜ Cold calling
➜ Cold emailing
➜ Cold DMs on socials
➜ 1-2 posts per day talking about your journey

When I lost my job in mid '23, about half of my interviews came directly from LinkedIn. Recruiters and managers were seeing my posts and it created a lot of opportunities.

To make it easy, you can break your activities into three categories.

1/ Live Activities: These are activities that allow you to communicate with your prospect in real-time (calls, live social events). Live activities convert at the highest % because they allow the seller to gain control.

2/ Lagging Activities: Activities that create delayed responses (DMs, texts, emails). These occur on the prospect's time and have a significantly lower conversion rate.

3/ Compounding Activities: TLDR, it's about becoming a micro-influencer. The more relevant content you create, the more traction you get. The more traction you get, the more your ICP will see you/your product. The more your ICP sees you, the more you'll receive inbounds in your inbox.

Create content ➜ Gain following ➜ Get inbounds.

The highest converting lead gen. strategy looks like this:

Before 9AM ➜ Compounding activities
Before 11AM ➜ Lagging activities
Before EOD ➜ Live activities`
  },
  {
    id: 'chapter5',
    title: 'Negotiating Offers',
    description: 'Maximize your compensation and role',
    icon: 'Handshake',
    content: `WHAT IS NEGOTIATION POWER?
I can't go over every negotiation strategy I know in full — it would take forever to get through.

However, you need to know the basics. And the most basic rule of them all is the person with the most negotiation power typically wins.

For you, that means collecting multiple offers so companies can start competing over you. There are 5 things that you should be negotiating for:
➜ Title
➜ Salary
➜ OTE (Salary + Commission)
➜ Benefits + sign-on bonuses
➜ Work responsibilities + resources

An even more important rule about negotiating is that you need to accept walking away.

That sounds like this:
"I want to work for you, but {x company} has offered me {y benefit/salary} and unless you can top that, I'm going to have to go with them."

Not all companies will come back with a better off. Especially for an SDR role.

When you start interviewing around, pitch incredibly high. Make it clear that you are expensive.

Figure out what the minimum salary you'd accept is and request +20% more — this is called price anchoring. You may not land the job for the amount you requested, but because you said the price first, the recruiter will try to negotiate against your requested amount (which is significantly better than them negotiating against the true amount you want to be paid).`
  }
];

export const tools: Tool[] = [
  {
    id: 'mailtrack',
    name: 'MailTrack',
    description: 'Track email opens and link clicks. Create campaigns and templates.',
    category: 'Email Tracking',
    freeTier: true,
    url: 'https://mailtrack.io'
  },
  {
    id: 'paage',
    name: 'Paage',
    description: 'Create mini-landing pages to showcase why hiring managers should hire you.',
    category: 'Landing Pages',
    freeTier: true,
    url: 'https://paage.io'
  },
  {
    id: 'phoneburner',
    name: 'PhoneBurner',
    description: 'Call 100 decision makers in under 90 minutes with 70+ calls/hour.',
    category: 'Calling',
    freeTier: true,
    url: 'https://www.phoneburner.com'
  },
  {
    id: 'apollo',
    name: 'Apollo',
    description: 'Find contact information and build prospect lists.',
    category: 'Prospecting',
    freeTier: true,
    url: 'https://apollo.io'
  },
  {
    id: 'seamless',
    name: 'Seamless.AI',
    description: 'Real-time search for B2B contact data.',
    category: 'Prospecting',
    freeTier: true,
    url: 'https://www.seamless.ai'
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    description: 'Find and verify email addresses.',
    category: 'Email Finding',
    freeTier: true,
    url: 'https://hunter.io'
  }
];

export const templates: Template[] = [
  {
    id: 'linkedin-dm',
    title: 'LinkedIn DM Template',
    content: `Hey [Name], I'm on a job hunt right now and am a [Tool/Product] power user.
Any chance I can get a shot at working with you guys?
Here's what I'm good at and why I might be a good fit: [Link to Paage/Portfolio]`,
    category: 'Messaging'
  },
  {
    id: 'email-template',
    title: 'Cold Email Template',
    content: `Subject: Quick question about [Company Name]

Hey [Name],

I noticed [Company Name] is doing [something impressive]. I'm currently on a job hunt and would love to learn more about your team.

Would you be open to a quick 15-minute conversation about potential opportunities?

[Your Name]`,
    category: 'Email'
  },
  {
    id: 'negotiation-script',
    title: 'Negotiation Script',
    content: `I'm really excited about the opportunity to join [Company Name] and believe I can make a significant impact in the role. I've also been speaking with [Other Company] who has offered me [X salary] and [Y benefits]. I'd love to work with you, but I need to make the best decision for my career. Is there any flexibility in the compensation package to bring it more in line with what I've been offered elsewhere?`,
    category: 'Negotiation'
  }
];

// Calculator functions
export const calculateEaseRate = (revenue: number, headcount: number): number => {
  if (headcount === 0) return 0;
  return revenue / headcount;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Advanced Sales Management Interfaces
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  value: number;
  stage: 'cold' | 'contacted' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: string;
  lastContact: string;
  nextAction: string;
  notes: string;
  score: number;
  probability: number;
  tags: string[];
}

export interface SalesActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow-up';
  description: string;
  date: string;
  outcome: 'successful' | 'no-response' | 'interested' | 'not-interested' | 'scheduled-follow-up';
  nextSteps?: string;
}

export interface SalesMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalValue: number;
  avgDealSize: number;
  conversionRate: number;
  avgSalesCycle: number;
}

export interface SalesTemplate {
  id: string;
  name: string;
  type: 'email' | 'call-script' | 'linkedin' | 'sms' | 'proposal' | 'follow-up';
  subject?: string;
  content: string;
  useCase: string;
  conversionRate?: string;
  tags: string[];
}

export interface SalesPlaybook {
  id: string;
  name: string;
  description: string;
  stages: {
    name: string;
    description: string;
    activities: string[];
    avgDuration: string;
    successCriteria: string[];
  }[];
  templates: string[];
  targetPersona: string;
}

// Sample Data
export const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechFlow Solutions',
    email: 'sarah@techflow.com',
    phone: '+1-555-0123',
    value: 25000,
    stage: 'demo',
    source: 'LinkedIn Outreach',
    lastContact: '2024-01-15',
    nextAction: 'Send demo follow-up email',
    notes: 'Very interested in our automation features. Has budget approved.',
    score: 85,
    probability: 75,
    tags: ['hot-lead', 'saas', 'decision-maker']
  },
  {
    id: '2',
    name: 'Mike Chen',
    company: 'StartupX',
    email: 'mike@startupx.io',
    value: 15000,
    stage: 'qualified',
    source: 'Cold Email',
    lastContact: '2024-01-14',
    nextAction: 'Schedule discovery call',
    notes: 'Founder looking for cost-effective solution. Price sensitive.',
    score: 70,
    probability: 50,
    tags: ['startup', 'price-sensitive', 'founder']
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Enterprise Corp',
    email: 'emily@enterprise.com',
    value: 75000,
    stage: 'proposal',
    source: 'Referral',
    lastContact: '2024-01-13',
    nextAction: 'Present final proposal',
    notes: 'Large enterprise deal. Requires custom integration.',
    score: 90,
    probability: 80,
    tags: ['enterprise', 'high-value', 'custom-integration']
  }
];

export const salesTemplates: SalesTemplate[] = [
  {
    id: 'cold-email-1',
    name: 'Cold Email - Problem Agitate Solve',
    type: 'email',
    subject: 'Quick question about [Company]\'s [pain point]',
    content: `Hi [Name],

I noticed [Company] is [relevant trigger/news]. Quick question: Are you currently facing challenges with [specific pain point] that's impacting your [business metric]?

I've helped companies like [similar company] [specific result] using [your solution].

Would you be open to a 15-minute conversation to see if we can do the same for [Company]?

Best,
[Your Name]`,
    useCase: 'Initial outreach to cold prospects',
    conversionRate: '15-25%',
    tags: ['cold-outreach', 'pain-point', 'high-converting']
  },
  {
    id: 'follow-up-1',
    name: 'Follow-up - Value Reinforcement',
    type: 'email',
    subject: 'Re: [original subject]',
    content: `Hi [Name],

Following up on my previous email about [pain point]. I wanted to share a quick case study that might interest you.

[Similar company] was facing [same challenge] and after implementing our solution, they:
• [Specific result 1]
• [Specific result 2]  
• [Specific result 3]

I'd love to show you how we could achieve similar results for [Company]. Are you free for a brief call this week?

Best,
[Your Name]`,
    useCase: 'First follow-up with social proof',
    conversionRate: '8-12%',
    tags: ['follow-up', 'social-proof', 'case-study']
  },
  {
    id: 'linkedin-connect',
    name: 'LinkedIn Connection Request',
    type: 'linkedin',
    content: `Hi [Name], I saw your post about [topic] and thought you'd appreciate this resource I created for [their industry] leaders. Would love to connect!`,
    useCase: 'LinkedIn connection requests',
    conversionRate: '30-40%',
    tags: ['linkedin', 'connection', 'value-first']
  },
  {
    id: 'call-script-1',
    name: 'Cold Call Script - SPIN Selling',
    type: 'call-script',
    content: `Hi [Name], this is [Your Name] from [Company]. I know you weren't expecting my call...

I'm reaching out because I noticed [Company] is [trigger event]. I work with [similar companies] to help them [specific benefit].

Quick question: How are you currently handling [specific process/challenge]?

[Listen for pain points]

That's actually quite common. Most [their role] tell me they struggle with [common pain point]. 

What impact does that have on [business metric/goal]?

[Continue with SPIN framework...]`,
    useCase: 'Cold calling script using SPIN methodology',
    conversionRate: '5-10%',
    tags: ['cold-calling', 'spin-selling', 'discovery']
  }
];

export const salesPlaybooks: SalesPlaybook[] = [
  {
    id: 'smb-saas',
    name: 'SMB SaaS Sales Process',
    description: 'Optimized sales process for selling to small-medium businesses',
    stages: [
      {
        name: 'Prospecting',
        description: 'Identify and qualify potential customers',
        activities: [
          'Research target companies using LinkedIn Sales Navigator',
          'Find decision maker contact information',
          'Personalize outreach messages',
          'Send initial cold email or LinkedIn message'
        ],
        avgDuration: '1-3 days',
        successCriteria: ['Response to outreach', 'Meeting scheduled', 'Pain points identified']
      },
      {
        name: 'Discovery',
        description: 'Understand customer needs and pain points',
        activities: [
          'Conduct discovery call using SPIN selling',
          'Identify budget and timeline',
          'Understand decision-making process',
          'Qualify as sales-ready lead'
        ],
        avgDuration: '1 week',
        successCriteria: ['Budget confirmed', 'Timeline established', 'Pain points documented']
      },
      {
        name: 'Demo/Proposal',
        description: 'Present solution and create proposal',
        activities: [
          'Deliver customized product demo',
          'Address specific use cases',
          'Create tailored proposal',
          'Provide pricing options'
        ],
        avgDuration: '1-2 weeks',
        successCriteria: ['Demo completed', 'Proposal sent', 'Next steps agreed']
      },
      {
        name: 'Negotiation',
        description: 'Handle objections and finalize terms',
        activities: [
          'Address pricing objections',
          'Negotiate contract terms',
          'Provide additional social proof',
          'Create urgency with limited-time offers'
        ],
        avgDuration: '1-3 weeks',
        successCriteria: ['Objections resolved', 'Terms agreed', 'Contract ready']
      },
      {
        name: 'Closing',
        description: 'Finalize the deal and onboard customer',
        activities: [
          'Send final contract for signature',
          'Process payment/setup billing',
          'Schedule onboarding call',
          'Hand off to customer success'
        ],
        avgDuration: '3-7 days',
        successCriteria: ['Contract signed', 'Payment processed', 'Onboarding scheduled']
      }
    ],
    templates: ['cold-email-1', 'follow-up-1', 'call-script-1'],
    targetPersona: 'SMB Decision Makers (10-200 employees)'
  }
];

export const leadSources = [
  { value: 'cold-email', label: 'Cold Email' },
  { value: 'linkedin', label: 'LinkedIn Outreach' },
  { value: 'cold-call', label: 'Cold Call' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website Inquiry' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'content-marketing', label: 'Content Marketing' },
  { value: 'paid-ads', label: 'Paid Advertising' },
  { value: 'partnership', label: 'Partner Referral' }
];

export const leadStages = [
  { value: 'cold', label: 'Cold', color: 'bg-gray-100 text-gray-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'demo', label: 'Demo Scheduled', color: 'bg-purple-100 text-purple-800' },
  { value: 'proposal', label: 'Proposal Sent', color: 'bg-orange-100 text-orange-800' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'closed-won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { value: 'closed-lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' }
];

export const activityTypes = [
  { value: 'call', label: 'Phone Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'demo', label: 'Demo', icon: '🖥️' },
  { value: 'proposal', label: 'Proposal', icon: '📄' },
  { value: 'follow-up', label: 'Follow-up', icon: '🔄' }
];