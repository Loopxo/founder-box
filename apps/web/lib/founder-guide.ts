export interface ResourceLink {
  title: string
  url: string
}

export interface ResourceGroup {
  title: string
  links: ResourceLink[]
}

export interface ResourceCategory {
  title: string
  groups: ResourceGroup[]
}

export interface GuideStage {
  id: string
  title: string
  label: string
  description: string
  keyLessons: string[]
  actionSteps: string[]
  doNow: string[]
  resourceNote: string
  resources: ResourceCategory[]
}

export interface FounderGuideData {
  projectName: string
  eyebrow: string
  heroTitle: string
  heroDescription: string
  quickStart: string[]
  audience: string[]
  stages: GuideStage[]
  pathSummary: string[]
  nextSteps: string[]
  totalResources: number
  totalCategories: number
  investorFirms: InvestorFirm[]
  fundingTrackers: FundingTracker[]
}

interface StageDefinition {
  id: string
  title: string
  label: string
  description: string
  keyLessons: string[]
  actionSteps: string[]
  doNow: string[]
  resourceNote: string
  categories: string[]
}

export interface InvestorFirm {
  rank: number
  name: string
  siteLabel: string
  siteUrl: string
  portfolioLabel: string
  portfolioUrl: string
}

export interface FundingTracker {
  name: string
  url: string
  description: string
}

const RESOURCE_LIBRARY: ResourceCategory[] = [
  {
    title: 'Learning & Knowledge',
    groups: [
      {
        title: 'Essential Reading',
        links: [
          { title: "Paul Graham's Essays", url: 'https://paulgraham.com/' },
          { title: "Sam Altman's Blog", url: 'https://blog.samaltman.com/' },
          { title: 'Startup Library', url: 'https://www.startuplibrary.io/' },
          { title: 'Founder Resources', url: 'https://www.founderresources.com/' },
          { title: 'Startup Handbook', url: 'https://www.startuphandbook.co/' },
          { title: 'The Founder Library - NFX', url: 'https://www.nfx.com/founder-library' },
        ],
      },
      {
        title: 'Books',
        links: [
          { title: 'The Lean Startup - Eric Ries', url: 'https://amzn.to/4rwpzcI' },
          { title: 'Running Lean - Ash Maurya', url: 'https://amzn.to/4kPgZTB' },
          { title: 'Zero to One - Peter Thiel', url: 'https://amzn.to/3ZMyWc3' },
          { title: 'The Hard Thing About Hard Things - Ben Horowitz', url: 'https://amzn.to/4tFyBFA' },
          { title: 'Founders At Work - Jessica Livingston', url: 'https://amzn.to/3OqEfvi' },
          { title: 'The Mom Test - Rob Fitzpatrick', url: 'https://www.momtestbook.com/' },
          { title: 'Venture Deals - Brad Feld and Jason Mendelson', url: 'https://venturedeals.com/' },
        ],
      },
    ],
  },
  {
    title: 'Courses & Videos',
    groups: [
      {
        title: 'Online Courses',
        links: [
          { title: 'How to Start a Startup', url: 'https://startupclass.co/course/how-to-start-a-startup' },
          { title: 'Startup School 2018 - Y Combinator', url: 'https://www.ycombinator.com/startupschool/2018' },
          { title: 'Startup School 2019 - Y Combinator', url: 'https://www.ycombinator.com/startupschool/2019' },
          { title: 'The Lean Launchpad - Steve Blank', url: 'https://www.udacity.com/course/ep245' },
          { title: 'Startup Engineering', url: 'https://www.coursera.org/course/startup' },
          { title: 'Startup Class - Sam Altman', url: 'https://startupclass.samaltman.com' },
        ],
      },
      {
        title: 'Must-Watch Videos',
        links: [
          { title: "Steve Jobs' Vision of the World", url: 'https://www.youtube.com/watch?v=UvEiSa6_EPA' },
          { title: 'Authors@Google: Eric Ries "The Lean Startup"', url: 'https://www.youtube.com/watch?v=fEvKo90qBns' },
          { title: 'PandoMonthly: Brian Chesky', url: 'https://www.youtube.com/watch?v=6yPfxcqEXhE' },
          { title: 'Managing Growth & Delivering Magic', url: 'https://www.youtube.com/watch?v=s7O3_tRB5t4' },
        ],
      },
    ],
  },
  {
    title: 'Podcasts',
    groups: [
      {
        title: 'Shows To Keep In Rotation',
        links: [
          { title: 'Acquired', url: 'https://www.acquired.fm/' },
          { title: 'A16z', url: 'https://a16z.com/podcasts/' },
          { title: 'Masters of Scale', url: 'https://mastersofscale.com/' },
          { title: 'Inside Intercom', url: 'https://www.intercom.com/blog/podcasts/' },
          { title: 'Product Led Podcast', url: 'https://www.productledpodcast.com/' },
        ],
      },
    ],
  },
  {
    title: 'Key Articles & Essays',
    groups: [
      {
        title: 'Foundational Essays',
        links: [
          { title: "Paul Graham's Articles", url: 'http://www.paulgraham.com/articles.html' },
          { title: 'How to Get Startup Ideas', url: 'http://www.paulgraham.com/startupideas.html' },
          { title: "Do Things That Don't Scale", url: 'http://paulgraham.com/ds.html' },
          { title: '18 Mistakes That Kill Startups', url: 'http://www.paulgraham.com/startupmistakes.html' },
          { title: 'Startup Advice, Briefly', url: 'http://blog.samaltman.com/startup-advice-briefly' },
          { title: 'Startup Playbook', url: 'https://blog.samaltman.com/startup-playbook' },
        ],
      },
      {
        title: 'Product And Growth Reads',
        links: [
          { title: 'Retention is King', url: 'http://andrewchen.co/retention-is-king/' },
          { title: '12 Things About Product-Market Fit', url: 'https://a16z.com/12-things-about-product-market-fit' },
          { title: "The Hacker's Guide to User Acquisition", url: 'http://www.austenallred.com/the-hackers-guide-to-user-acquisition/' },
          { title: 'How to Solve the Cold-Start Problem for Social Products', url: 'http://andrewchen.co/2014/03/27/how-to-solve-the-cold-start-problem-for-social-products/' },
        ],
      },
    ],
  },
  {
    title: 'Inspiration & Discovery',
    groups: [
      {
        title: 'Product Discovery',
        links: [
          { title: 'Product Hunt', url: 'https://www.producthunt.com/' },
          { title: 'Hacker News', url: 'https://news.ycombinator.com/' },
          { title: 'Crunchbase', url: 'https://www.crunchbase.com/' },
          { title: 'BetaPage', url: 'https://www.betapage.co/' },
          { title: 'Betalist', url: 'https://betalist.com/' },
        ],
      },
      {
        title: 'Design Inspiration',
        links: [
          { title: 'SaaS Pages', url: 'https://www.saaspages.com/' },
          { title: 'Mobbin', url: 'https://www.mobbin.com/' },
          { title: 'Page Flows', url: 'https://pageflows.com/' },
          { title: 'Page Collective', url: 'https://pagecollective.com/' },
          { title: 'Hoverstat.es', url: 'https://www.hoverstat.es/' },
        ],
      },
      {
        title: 'Idea Discovery',
        links: [
          { title: 'Start Story', url: 'https://www.startstory.io/' },
          { title: 'Test Your Startup Idea', url: 'https://www.testyourstartupidea.com/' },
          { title: 'How to Find the Right Startup Idea', url: 'https://www.howtofindtherightstartupidea.com/' },
          { title: 'Product Checklist', url: 'https://www.productchecklist.com/' },
        ],
      },
    ],
  },
  {
    title: 'Customer Development',
    groups: [
      {
        title: 'Discovery Tools',
        links: [
          { title: 'Customer Development Resources', url: 'https://www.customerdevelopmentresources.com/' },
          { title: 'Customer Forces Canvas', url: 'https://www.customerforcescanvas.com/' },
          { title: 'The Mom Test', url: 'https://www.themomtest.com/' },
          { title: 'Empathy Map', url: 'https://www.empathymap.com/' },
          { title: 'Fundamentals of Product-Market Fit', url: 'https://www.fundamentalsofproductmarketfit.com/' },
          { title: 'Superhuman Article on PMF', url: 'https://www.superhuman.com/article/' },
        ],
      },
    ],
  },
  {
    title: 'Company Building',
    groups: [
      {
        title: 'Naming And Positioning',
        links: [
          { title: 'WSGR Startup Basics: How to Name Your Startup', url: 'https://www.wsgr.com/en/insights/startup-basics-how-to-name-your-startup.html' },
          { title: 'Panabee', url: 'https://panabee.com/' },
          { title: 'Namechk', url: 'https://namechk.com/' },
          { title: 'BrandBucket', url: 'https://www.brandbucket.com/' },
        ],
      },
      {
        title: 'Founder Mechanics',
        links: [
          { title: 'How to Find a Co-Founder', url: 'https://www.howtofindacofounder.com/' },
          { title: 'How to Split Equity Among Co-founders', url: 'https://www.howtosplitco-founderequity.com/' },
          { title: 'Curated KPIs and OKRs List', url: 'https://www.kpisandokrs.com/' },
          { title: 'Founder Library About Hiring', url: 'https://www.founderlibrary.com/hiring' },
          { title: "Job Interviews Don't Work", url: 'https://fs.blog/2020/07/job-interviews/' },
        ],
      },
      {
        title: 'Growth References',
        links: [
          { title: 'Growthhacklist', url: 'https://www.growthhacklist.com/' },
          { title: 'Beginners Guide to SEO', url: 'https://www.beginnersguideto.seo/' },
          { title: '100+ Growth Tactics', url: 'https://www.100growthtactics.com/' },
          { title: 'Where Does Growth Come From?', url: 'https://www.wheredoesgrowthcomefrom.com/' },
        ],
      },
    ],
  },
  {
    title: 'Incubators & Accelerators',
    groups: [
      {
        title: 'Programs',
        links: [
          { title: 'Y Combinator', url: 'https://www.ycombinator.com/' },
          { title: '500 Startups', url: 'https://www.500startups.com/' },
          { title: 'Plug and Play', url: 'https://www.plugandplaytechcenter.com/' },
        ],
      },
    ],
  },
  {
    title: 'Communities',
    groups: [
      {
        title: 'Founder Communities',
        links: [
          { title: 'r/Entrepreneur', url: 'https://www.reddit.com/r/Entrepreneur/' },
          { title: 'r/startups', url: 'https://www.reddit.com/r/startups/' },
          { title: 'r/SaaS', url: 'https://www.reddit.com/r/SaaS/' },
          { title: 'Indie Hackers', url: 'https://www.indiehackers.com/' },
          { title: 'AngelList', url: 'https://www.angellist.com/' },
          { title: 'The Hive List', url: 'https://www.thehivelist.com/' },
        ],
      },
      {
        title: 'Places To Post Your Startup',
        links: [
          { title: 'Places to Post Your Startup', url: 'https://www.placestopostyourstartup.com/' },
          { title: 'Product Hunt', url: 'https://www.producthunt.com/' },
          { title: 'BetaPage', url: 'https://www.betapage.co/' },
          { title: 'Betalist', url: 'https://betalist.com/' },
        ],
      },
    ],
  },
  {
    title: 'Fundraising',
    groups: [
      {
        title: 'Guides',
        links: [
          { title: 'A Guide to Seed Fundraising', url: 'https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising' },
          { title: 'How to Raise Money', url: 'https://www.howtoraise.money/' },
          { title: 'Venture Deals', url: 'https://venturedeals.com/' },
          { title: 'How Startup Funding Works - Paul Graham', url: 'https://www.paulgraham.com/funding.html' },
          { title: 'How To Invest In Startups - Sam Altman', url: 'https://blog.samaltman.com/how-to-invest-in-startups' },
        ],
      },
      {
        title: 'Pitch Deck References',
        links: [
          { title: 'OpenDeck', url: 'https://www.opendeck.co/' },
          { title: '30 Legendary Startup Pitch Decks', url: 'https://slidebean.com/blog/30-legendary-startup-pitch-decks' },
          { title: 'Startup Financing Calculator', url: 'https://www.startupfinancingcalculator.com/' },
        ],
      },
    ],
  },
  {
    title: 'Website & Hosting',
    groups: [
      {
        title: 'Website Builders',
        links: [
          { title: 'Webflow', url: 'https://webflow.com/' },
          { title: 'Framer', url: 'https://www.framer.com/' },
          { title: 'Carrd', url: 'https://carrd.co/' },
          { title: 'Shopify', url: 'https://www.shopify.com/' },
          { title: 'Landen', url: 'https://landen.co/' },
        ],
      },
      {
        title: 'Hosting And Access',
        links: [
          { title: 'DigitalOcean', url: 'https://www.digitalocean.com/' },
          { title: 'Heroku', url: 'https://www.heroku.com/' },
          { title: 'Amazon AWS', url: 'https://aws.amazon.com/' },
          { title: 'Google Cloud', url: 'https://cloud.google.com/' },
          { title: 'Memberstack', url: 'https://www.memberstack.com/' },
        ],
      },
    ],
  },
  {
    title: 'Design Tools',
    groups: [
      {
        title: 'Wireframes And Product Design',
        links: [
          { title: 'Figma', url: 'https://www.figma.com/' },
          { title: 'FigJam', url: 'https://www.figma.com/figjam' },
          { title: 'Whimsical', url: 'https://whimsical.com/' },
          { title: 'Balsamiq', url: 'https://balsamiq.com/' },
          { title: 'Miro', url: 'https://miro.com/' },
        ],
      },
      {
        title: 'Brand, Graphics, And Presentation',
        links: [
          { title: 'Canva', url: 'https://canva.com/' },
          { title: 'RemoveBg', url: 'https://remove.bg/' },
          { title: 'Beautiful.ai', url: 'https://www.beautiful.ai/' },
          { title: 'Undesign', url: 'https://undesign.io/' },
          { title: 'Dribbble', url: 'https://dribbble.com/' },
        ],
      },
    ],
  },
  {
    title: 'Stock Resources',
    groups: [
      {
        title: 'Images And Icons',
        links: [
          { title: 'Unsplash', url: 'https://unsplash.com/' },
          { title: 'Pexels', url: 'https://www.pexels.com/' },
          { title: 'Pixabay', url: 'https://pixabay.com/' },
          { title: 'Flaticon', url: 'https://flaticon.com/' },
          { title: 'Icons8', url: 'https://icons8.com/' },
        ],
      },
      {
        title: 'Illustrations And Motion',
        links: [
          { title: 'unDraw', url: 'https://undraw.co/' },
          { title: 'Blush', url: 'https://blush.design/' },
          { title: 'LottieFiles', url: 'https://lottiefiles.com/' },
          { title: 'Rive', url: 'https://rive.app/' },
        ],
      },
    ],
  },
  {
    title: 'AI Tools',
    groups: [
      {
        title: 'AI Assistants',
        links: [
          { title: 'ChatGPT', url: 'https://chat.openai.com/' },
          { title: 'Rows', url: 'https://rows.com/' },
          { title: 'Copy.ai', url: 'https://www.copy.ai/' },
          { title: 'Jasper', url: 'https://www.jasper.ai/' },
          { title: 'Captions', url: 'https://www.captions.ai/' },
        ],
      },
    ],
  },
  {
    title: 'Content & SEO',
    groups: [
      {
        title: 'Content Stack',
        links: [
          { title: 'Strapi', url: 'https://strapi.io/' },
          { title: 'Prismic', url: 'https://prismic.io/' },
          { title: 'Contentful', url: 'https://www.contentful.com/' },
          { title: 'Netlify CMS', url: 'https://www.netlifycms.org/' },
        ],
      },
      {
        title: 'SEO And Conversion',
        links: [
          { title: 'Ahrefs', url: 'https://ahrefs.com/' },
          { title: 'SpyFu', url: 'https://www.spyfu.com/' },
          { title: 'Metatags', url: 'https://metatags.io/' },
          { title: 'Formspree', url: 'https://formspree.io/' },
        ],
      },
    ],
  },
  {
    title: 'Automation & Backend',
    groups: [
      {
        title: 'Automation',
        links: [
          { title: 'Zapier', url: 'https://zapier.com/' },
          { title: 'Make', url: 'https://www.make.com/' },
          { title: 'IFTTT', url: 'https://ifttt.com/' },
          { title: 'n8n', url: 'https://n8n.io/' },
        ],
      },
      {
        title: 'Backend Services',
        links: [
          { title: 'Airtable', url: 'https://airtable.com/' },
          { title: 'Firebase', url: 'https://firebase.google.com/' },
          { title: 'Supabase', url: 'https://supabase.com/' },
        ],
      },
    ],
  },
  {
    title: 'Documentation',
    groups: [
      {
        title: 'Docs And Onboarding',
        links: [
          { title: 'Docusaurus', url: 'https://docusaurus.io/' },
          { title: 'Readme', url: 'https://readme.com/' },
          { title: 'Swagger', url: 'https://swagger.io/' },
          { title: 'GitBook', url: 'https://www.gitbook.com/' },
          { title: 'Notion', url: 'https://www.notion.so/' },
          { title: 'UserGuiding', url: 'https://userguiding.com/' },
        ],
      },
    ],
  },
  {
    title: 'No-Code Tools',
    groups: [
      {
        title: 'Fast Build Paths',
        links: [
          { title: 'Bubble', url: 'https://bubble.io/' },
          { title: 'Retool', url: 'https://retool.com/' },
          { title: 'Super', url: 'https://super.so/' },
          { title: 'Bravo Studio', url: 'https://www.bravostudio.app/' },
        ],
      },
    ],
  },
  {
    title: 'Miscellaneous Tools',
    groups: [
      {
        title: 'Utility Stack',
        links: [
          { title: 'Linktree', url: 'https://linktr.ee/' },
          { title: 'Gumroad', url: 'https://gumroad.com/' },
          { title: 'Bitly', url: 'https://bitly.com/' },
          { title: 'Uploadcare', url: 'https://uploadcare.com/' },
        ],
      },
      {
        title: 'Market Research',
        links: [
          { title: 'Google Trends', url: 'https://trends.google.com/' },
          { title: 'Similar Web', url: 'https://www.similarweb.com/' },
          { title: 'Statista', url: 'https://www.statista.com/' },
          { title: 'An MVP is Not a Cheaper Product', url: 'https://www.steveblank.com/' },
        ],
      },
    ],
  },
  {
    title: 'Email & Newsletters',
    groups: [
      {
        title: 'Email Platforms',
        links: [
          { title: 'MailChimp', url: 'https://mailchimp.com/' },
          { title: 'ConvertKit', url: 'https://convertkit.com/' },
          { title: 'Mailerlite', url: 'https://www.mailerlite.com/' },
          { title: 'Klaviyo', url: 'https://www.klaviyo.com/' },
          { title: 'Postmark', url: 'https://postmarkapp.com/' },
        ],
      },
      {
        title: 'Newsletter And Writing',
        links: [
          { title: 'Buttondown', url: 'https://buttondown.email/' },
          { title: 'Substack', url: 'https://substack.com/' },
          { title: 'Really Good Emails', url: 'https://www.reallygoodemails.com/' },
          { title: 'Hashnode', url: 'https://hashnode.com/' },
        ],
      },
    ],
  },
  {
    title: 'CRM & Support',
    groups: [
      {
        title: 'Customer Ops',
        links: [
          { title: 'HubSpot', url: 'https://www.hubspot.com/' },
          { title: 'Zendesk', url: 'https://www.zendesk.com/' },
          { title: 'Intercom', url: 'https://www.intercom.com/' },
          { title: 'Crisp', url: 'https://crisp.chat/' },
          { title: 'Groove', url: 'https://www.groovehq.com/' },
          { title: 'Odoo', url: 'https://www.odoo.com/' },
        ],
      },
    ],
  },
  {
    title: 'Marketing Tools',
    groups: [
      {
        title: 'Distribution Tools',
        links: [
          { title: 'Buffer', url: 'https://buffer.com/' },
          { title: 'BuzzSumo', url: 'https://buzzsumo.com/' },
          { title: 'SocialBlade', url: 'https://socialblade.com/' },
          { title: 'HubSpot for Startups', url: 'https://www.hubspot.com/startups' },
          { title: 'Viral Loops', url: 'https://www.viralloops.com/' },
          { title: 'Customer.io', url: 'https://customer.io/' },
          { title: '150 Marketing Tools', url: 'https://www.150marketingtools.com/' },
        ],
      },
    ],
  },
  {
    title: 'Media & Video',
    groups: [
      {
        title: 'Lightweight Media Tools',
        links: [
          { title: 'Talevideo', url: 'https://www.talevideo.com/' },
          { title: 'Uppbeat', url: 'https://uppbeat.io/' },
        ],
      },
    ],
  },
  {
    title: 'Places to Share & Promote',
    groups: [
      {
        title: 'Launch Platforms',
        links: [
          { title: 'Reddit', url: 'https://www.reddit.com/' },
          { title: 'Hacker News', url: 'https://news.ycombinator.com/' },
          { title: 'Product Hunt', url: 'https://www.producthunt.com/' },
          { title: 'SaaSHub', url: 'https://www.saashub.com/' },
          { title: 'Indie Hackers', url: 'https://www.indiehackers.com/' },
          { title: 'BetaList', url: 'https://betalist.com/' },
        ],
      },
      {
        title: 'Content Distribution',
        links: [
          { title: 'Medium', url: 'https://medium.com/' },
          { title: 'DEV Community', url: 'https://dev.to/' },
          { title: 'LinkedIn', url: 'https://linkedin.com/' },
          { title: 'Hacker Noon', url: 'https://hackernoon.com/' },
          { title: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/' },
        ],
      },
    ],
  },
  {
    title: 'Affiliates & Referrals',
    groups: [
      {
        title: 'Referral Infrastructure',
        links: [
          { title: 'Impact', url: 'https://impact.com/' },
          { title: 'Partnerstack', url: 'https://partnerstack.com/' },
          { title: 'Friendbuy', url: 'https://www.friendbuy.com/' },
          { title: 'Idevaffiliate', url: 'https://www.idevaffiliate.com/' },
        ],
      },
    ],
  },
  {
    title: 'Payments',
    groups: [
      {
        title: 'Billing And Checkout',
        links: [
          { title: 'Stripe', url: 'https://stripe.com/' },
          { title: 'PayPal', url: 'https://www.paypal.com/' },
          { title: 'Adyen', url: 'https://www.adyen.com/' },
          { title: 'Square', url: 'https://squareup.com/' },
          { title: 'Dodo payments', url: 'https://app.dodopayments.com/partners/sYbKltTo3h/signup' },
        ],
      },
    ],
  },
  {
    title: 'Analytics & Data',
    groups: [
      {
        title: 'Product Analytics',
        links: [
          { title: 'Segment', url: 'https://segment.com/' },
          { title: 'Amplitude', url: 'https://amplitude.com/' },
          { title: 'Mixpanel', url: 'https://mixpanel.com/' },
          { title: 'PostHog', url: 'https://posthog.com/' },
          { title: 'Google Analytics', url: 'https://analytics.google.com/' },
        ],
      },
      {
        title: 'Behavior And Revenue',
        links: [
          { title: 'Hotjar', url: 'https://www.hotjar.com/' },
          { title: 'Microsoft Clarity', url: 'https://clarity.microsoft.com/' },
          { title: 'ChartMogul', url: 'https://chartmogul.com/' },
          { title: 'Baremetrics', url: 'https://baremetrics.com/' },
          { title: 'Metabase', url: 'https://www.metabase.com/' },
          { title: 'Google Looker Studio', url: 'https://lookerstudio.google.com/' },
        ],
      },
    ],
  },
  {
    title: 'User Feedback',
    groups: [
      {
        title: 'Feedback Collection',
        links: [
          { title: 'Canny', url: 'https://canny.io/' },
          { title: 'Productlane', url: 'https://productlane.com/' },
          { title: 'Feedbear', url: 'https://feedbear.com/' },
          { title: 'LaunchNotes', url: 'https://www.launchnotes.com/' },
          { title: 'Testimonial', url: 'https://testimonial.to/' },
        ],
      },
    ],
  },
  {
    title: 'User Engagement',
    groups: [
      {
        title: 'Lifecycle And Messaging',
        links: [
          { title: 'Braze', url: 'https://www.braze.com/' },
          { title: 'OneSignal', url: 'https://onesignal.com/' },
          { title: 'Customer.io', url: 'https://customer.io/' },
          { title: 'Landbot', url: 'https://landbot.io/' },
          { title: 'Twilio', url: 'https://www.twilio.com/' },
        ],
      },
    ],
  },
  {
    title: 'Team Management',
    groups: [
      {
        title: 'Execution Stack',
        links: [
          { title: 'Slack', url: 'https://slack.com/' },
          { title: 'ClickUp', url: 'https://clickup.com/' },
          { title: 'Linear', url: 'https://linear.app/' },
          { title: 'Loom', url: 'https://www.loom.com/' },
          { title: 'Calendly', url: 'https://calendly.com/' },
        ],
      },
      {
        title: 'Project Management',
        links: [
          { title: 'Asana', url: 'https://asana.com/' },
          { title: 'Trello', url: 'https://trello.com/' },
          { title: 'Jira', url: 'https://www.atlassian.com/software/jira' },
          { title: 'Basecamp', url: 'https://basecamp.com/' },
        ],
      },
    ],
  },
  {
    title: 'Monitoring & Logging',
    groups: [
      {
        title: 'Reliability',
        links: [
          { title: 'Sentry', url: 'https://sentry.io/' },
          { title: 'Instabug', url: 'https://instabug.com/' },
          { title: 'Crashlytics', url: 'https://firebase.google.com/products/crashlytics' },
          { title: 'UptimeRobot', url: 'https://uptimerobot.com/' },
          { title: 'Datadog', url: 'https://www.datadoghq.com/' },
        ],
      },
    ],
  },
  {
    title: 'Startup Programs & Credits',
    groups: [
      {
        title: 'Infrastructure Credits',
        links: [
          { title: 'AWS Activate', url: 'https://aws.amazon.com/activate/' },
          { title: 'Google Cloud for Startups', url: 'https://cloud.google.com/developers/startups/' },
          { title: 'Microsoft for Startups', url: 'https://startups.microsoft.com/en-us/' },
          { title: 'Hatch by DigitalOcean', url: 'https://www.digitalocean.com/hatch/' },
          { title: 'MongoDB for Startups', url: 'https://www.mongodb.com/startups' },
        ],
      },
      {
        title: 'Growth And Ops Programs',
        links: [
          { title: 'Mixpanel for Startups', url: 'https://mixpanel.com/startups/' },
          { title: 'HubSpot for Startups', url: 'https://www.hubspot.com/startups' },
          { title: 'Intercom Early Stage Program', url: 'https://www.intercom.com/early-stage' },
          { title: 'Postmark for Bootstrapped Startups', url: 'https://postmarkapp.com/for/bootstrapped-startups#pricing' },
          { title: 'Twilio Startups Program', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfcc7bGIqosjJ-vWdSi4iFW2oQ_lcCQh9JXNpREXPCkFBssRw/viewform' },
        ],
      },
    ],
  },
]

const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    id: 'mindset',
    label: 'Stage 1',
    title: 'Think Like a Founder',
    description:
      'Start by upgrading your judgment. Before you build anything, learn how strong founders spot leverage, make tradeoffs, and stay focused on the real problem.',
    keyLessons: [
      'Your first job is not to look impressive. It is to understand what makes a startup worth building.',
      'Founders need both operating discipline and emotional resilience. Your habits affect the company.',
      'A few great sources studied deeply beat endless random startup content.',
    ],
    actionSteps: [
      'Choose one core startup book, one course, and one weekly podcast to anchor your learning.',
      'Create a running founder journal with notes on ideas, customer pain, and lessons from what you read.',
      'Use essays and interviews to study decisions, not just success stories.',
    ],
    doNow: [
      'Pick a startup book you will actually finish this week.',
      'Bookmark one course and schedule the first lesson on your calendar.',
      'Write down three beliefs you currently have about startups, then challenge them with what you learn.',
    ],
    resourceNote:
      'Use this stage as your founder curriculum. The reading lists, courses, podcasts, and essays below are your calibration layer.',
    categories: ['Learning & Knowledge', 'Courses & Videos', 'Podcasts', 'Key Articles & Essays'],
  },
  {
    id: 'ideas',
    label: 'Stage 2',
    title: 'Find a Problem Worth Solving',
    description:
      'Good startup ideas are usually discovered, not invented in isolation. Focus on painful, specific problems and real user behavior before naming a solution.',
    keyLessons: [
      'A startup idea gets stronger when it comes from repeated friction, not vague inspiration.',
      'Customer discovery is about learning the truth, not collecting polite feedback.',
      'Product-market fit begins with the right problem and the right audience.',
    ],
    actionSteps: [
      'List the top five problems you see often in work, life, or communities you understand well.',
      'Interview potential users and ask about current behavior, workarounds, and spending.',
      'Study existing products, adjacent tools, and founder stories to sharpen your angle.',
    ],
    doNow: [
      'Write one sentence that describes the user, the pain, and the current workaround.',
      'Set up five customer conversations this week.',
      'Score each idea on urgency, frequency, and willingness to pay.',
    ],
    resourceNote:
      'These resources help you move from vague ideas to validated pain. Use them to research problems, run interviews, and test early demand.',
    categories: ['Inspiration & Discovery', 'Customer Development'],
  },
  {
    id: 'company',
    label: 'Stage 3',
    title: 'Design the Company Around the Problem',
    description:
      'Once the problem is real, shape the company intentionally. Nail the basics: co-founder fit, positioning, operating metrics, network, and financing context.',
    keyLessons: [
      'Company design decisions compound early. Bad co-founder fit or fuzzy priorities create expensive drag.',
      'Community and accelerator networks can compress years of learning if used well.',
      'Fundraising is a tool, not a milestone. Understand it before you need it.',
    ],
    actionSteps: [
      'Clarify your company thesis, who you serve, and why you are the right team to solve the problem.',
      'Define a few operating metrics so you can tell progress from motion.',
      'Map the people and programs that can help: founder communities, advisors, accelerators, and investors.',
    ],
    doNow: [
      'Write a one-page company brief covering mission, user, problem, solution, and business model.',
      'If you have a co-founder, align on roles, equity logic, and how decisions get made.',
      'Shortlist the communities and programs most relevant to your stage.',
    ],
    resourceNote:
      'Use this stage to build the company shell around your idea. It covers naming, co-founders, operating systems, community, and capital.',
    categories: ['Company Building', 'Incubators & Accelerators', 'Communities', 'Fundraising'],
  },
  {
    id: 'build',
    label: 'Stage 4',
    title: 'Build the First Credible Version',
    description:
      'Your first version should prove usefulness, not perfection. Assemble the smallest product, brand, and technical stack that lets users experience the value.',
    keyLessons: [
      'A credible first version solves one painful workflow clearly.',
      'Design, copy, infrastructure, and documentation all influence trust.',
      'Modern founders can move faster by combining code, no-code, automation, and AI responsibly.',
    ],
    actionSteps: [
      'Choose the fastest build path that still gives you enough control over the product.',
      'Create a simple brand, landing page, product flow, and support docs that make the offer understandable.',
      'Keep your stack boring where possible so you can spend energy on the product, not setup.',
    ],
    doNow: [
      'Define the one workflow your MVP must handle well.',
      'Select your build stack and hosting path before you start adding features.',
      'Create a simple landing page and onboarding doc before launch day.',
    ],
    resourceNote:
      'This is the production shelf. Use these tools and references to build the product, shape the brand, create assets, and document the experience.',
    categories: [
      'Website & Hosting',
      'Design Tools',
      'Stock Resources',
      'AI Tools',
      'Content & SEO',
      'Automation & Backend',
      'Documentation',
      'No-Code Tools',
      'Miscellaneous Tools',
    ],
  },
  {
    id: 'launch',
    label: 'Stage 5',
    title: 'Launch, Distribute, and Talk to Users',
    description:
      'A product without distribution is unfinished. Build feedback loops, create reasons to share, and put the product in front of the right communities repeatedly.',
    keyLessons: [
      'Launch is not a day. It is a repeated cycle of messaging, distribution, feedback, and iteration.',
      'Early marketing should help you learn which channels and messages actually move users.',
      'Support, email, and customer conversations are product inputs, not side tasks.',
    ],
    actionSteps: [
      'Write a simple launch narrative: problem, audience, promise, proof, and call to action.',
      'Set up email, CRM, basic support, and a repeatable content workflow.',
      'Post where your users already spend time and track which channels drive real conversations.',
    ],
    doNow: [
      'Prepare your launch post, landing page CTA, and follow-up email before announcing anything.',
      'Choose three launch communities and three ongoing distribution channels.',
      'Create one feedback inbox so you do not lose early signals.',
    ],
    resourceNote:
      'These resources support your first distribution engine: email, CRM, marketing workflows, launch directories, and promotion channels.',
    categories: ['Email & Newsletters', 'CRM & Support', 'Marketing Tools', 'Media & Video', 'Places to Share & Promote', 'Affiliates & Referrals'],
  },
  {
    id: 'scale',
    label: 'Stage 6',
    title: 'Measure, Improve, and Scale Responsibly',
    description:
      'Once users arrive, the real operating work begins. Measure behavior, collect feedback, improve retention, and strengthen the systems that keep the company reliable.',
    keyLessons: [
      'Growth without measurement creates noise. Instrument the business early.',
      'Retention, product feedback, and team clarity matter more than vanity numbers.',
      'Credits, programs, and operational tooling can extend runway if used intentionally.',
    ],
    actionSteps: [
      'Instrument product analytics, revenue tracking, and user feedback before scaling acquisition.',
      'Set up engagement, billing, support, and incident workflows so the product can survive growth.',
      'Use startup programs and credits to reduce fixed costs while you find traction.',
    ],
    doNow: [
      'Define the three numbers that best reflect founder progress right now.',
      'Install analytics, feedback capture, and uptime monitoring before your next growth push.',
      'Audit which startup credits or partner programs you can apply for this month.',
    ],
    resourceNote:
      'This stage is your operating stack. It covers analytics, feedback, engagement, payments, hiring, monitoring, and cost-saving startup programs.',
    categories: [
      'Payments',
      'Analytics & Data',
      'User Feedback',
      'User Engagement',
      'Team Management',
      'Monitoring & Logging',
      'Startup Programs & Credits',
    ],
  },
]

const INVESTOR_FIRMS: InvestorFirm[] = [
  {
    rank: 1,
    name: 'Y Combinator',
    siteLabel: 'ycombinator.com',
    siteUrl: 'https://www.ycombinator.com/',
    portfolioLabel: 'ycombinator.com/companies',
    portfolioUrl: 'https://www.ycombinator.com/companies',
  },
  {
    rank: 2,
    name: 'Techstars',
    siteLabel: 'techstars.com',
    siteUrl: 'https://www.techstars.com/',
    portfolioLabel: 'techstars.com/portfolio',
    portfolioUrl: 'https://www.techstars.com/portfolio',
  },
  {
    rank: 3,
    name: '500 Global',
    siteLabel: '500.co',
    siteUrl: 'https://500.co/',
    portfolioLabel: '500.co/companies',
    portfolioUrl: 'https://500.co/companies',
  },
  {
    rank: 4,
    name: 'Plug and Play',
    siteLabel: 'plugandplaytechcenter.com',
    siteUrl: 'https://www.plugandplaytechcenter.com/',
    portfolioLabel: 'plugandplaytechcenter.com/portfolio',
    portfolioUrl: 'https://www.plugandplaytechcenter.com/portfolio',
  },
  {
    rank: 5,
    name: 'SOSV (HAX, IndieBio)',
    siteLabel: 'sosv.com',
    siteUrl: 'https://sosv.com/',
    portfolioLabel: 'sosv.com/portfolio',
    portfolioUrl: 'https://sosv.com/portfolio',
  },
  {
    rank: 6,
    name: 'Antler',
    siteLabel: 'antler.co',
    siteUrl: 'https://www.antler.co/',
    portfolioLabel: 'antler.co/portfolio',
    portfolioUrl: 'https://www.antler.co/portfolio',
  },
  {
    rank: 7,
    name: 'Sequoia / Peak XV (India/SEA)',
    siteLabel: 'peakxv.com',
    siteUrl: 'https://www.peakxv.com/',
    portfolioLabel: 'peakxv.com/portfolio',
    portfolioUrl: 'https://www.peakxv.com/portfolio',
  },
  {
    rank: 8,
    name: 'Andreessen Horowitz (a16z)',
    siteLabel: 'a16z.com',
    siteUrl: 'https://a16z.com/',
    portfolioLabel: 'a16z.com/portfolio',
    portfolioUrl: 'https://a16z.com/portfolio',
  },
  {
    rank: 9,
    name: 'Seedcamp',
    siteLabel: 'seedcamp.com',
    siteUrl: 'https://seedcamp.com/',
    portfolioLabel: 'seedcamp.com/portfolio',
    portfolioUrl: 'https://seedcamp.com/portfolio',
  },
  {
    rank: 10,
    name: 'AngelPad',
    siteLabel: 'angelpad.com',
    siteUrl: 'https://angelpad.com/',
    portfolioLabel: 'angelpad.com/portfolio',
    portfolioUrl: 'https://angelpad.com/portfolio',
  },
]

const FUNDING_TRACKERS: FundingTracker[] = [
  {
    name: 'Crunchbase',
    url: 'https://www.crunchbase.com/',
    description: 'The broadest default source for tracking funding rounds, investors, and company profiles across the startup market.',
  },
  {
    name: 'AngelList',
    url: 'https://www.angellist.com/',
    description: 'Useful for early-stage and seed visibility, especially when you want to understand startup-investor overlap.',
  },
  {
    name: 'Tracxn',
    url: 'https://tracxn.com/',
    description: 'Especially useful when you want stronger coverage on Indian startup activity and regional market movement.',
  },
]

export function getFounderGuideData(): FounderGuideData {
  const categoryMap = new Map(RESOURCE_LIBRARY.map((category) => [category.title, category]))

  const stages = STAGE_DEFINITIONS.map((stage) => ({
    ...stage,
    resources: stage.categories
      .map((categoryName) => categoryMap.get(categoryName))
      .filter((category): category is ResourceCategory => Boolean(category)),
  }))

  const totalResources = RESOURCE_LIBRARY.reduce(
    (resourceCount, category) =>
      resourceCount + category.groups.reduce((groupCount, group) => groupCount + group.links.length, 0),
    0
  )

  return {
    projectName: 'Launchpath Atlas',
    eyebrow: 'Aspiring Founder Guide',
    heroTitle: 'A guided path from curious builder to capable founder.',
    heroDescription:
      'This page turns a scattered founder reading list into a structured, self-contained startup playbook. Work stage by stage, do the actions first, and use the resource shelf when you need depth.',
    quickStart: [
      'Move in order the first time. Later, revisit only the stage you are actively working on.',
      'Do the action steps before opening the full resource shelf.',
      'When in doubt, talk to users earlier and ship a smaller version sooner.',
    ],
    audience: [
      'First-time founders who need a practical starting structure.',
      'Indie builders and product operators turning side ideas into companies.',
      'Students, freelancers, and agency owners exploring startup-style products.',
      'Anyone who wants a curated founder path instead of scattered startup advice.',
    ],
    stages,
    pathSummary: [
      'Think clearly before you build.',
      'Find painful problems instead of chasing random ideas.',
      'Shape the company around the problem and the team.',
      'Build the smallest version that proves usefulness.',
      'Launch repeatedly and learn from distribution.',
      'Measure what matters, tighten operations, and scale with discipline.',
    ],
    nextSteps: [
      'Start at Stage 1 if you are still forming your founder worldview.',
      'Jump to Stage 2 if you already have startup energy but no validated problem.',
      'Use Stage 4 onward once you have a real idea and need execution support.',
    ],
    totalResources,
    totalCategories: RESOURCE_LIBRARY.length,
    investorFirms: INVESTOR_FIRMS,
    fundingTrackers: FUNDING_TRACKERS,
  }
}
