export interface Problem {
  title: string
  description: string
  statistic: string
}

export interface Solution {
  title: string
  description: string
  benefits: string[]
}

export interface PricingPackage {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

export interface IndustryTemplate {
  industry: string
  problems: Problem[]
  solutions: Solution[]
  pricing: PricingPackage[]
  caseStudy: {
    title: string
    description: string
    results: string[]
    image?: string
  }
}

export const industryTemplates: Record<string, IndustryTemplate> = {
  salon: {
    industry: "salon",
    problems: [
      {
        title: "Mobile-First Customers",
        description: "Modern customers want to book appointments 24/7 from their phones, not just during business hours.",
        statistic: "92% of people trust online reviews as much as personal recommendations"
      },
      {
        title: "Instant Booking Expectations", 
        description: "Customers want to book appointments 24/7, not just during business hours. Missing calls = lost revenue.",
        statistic: "68% of customers will choose a business with online booking"
      },
      {
        title: "Local Competition",
        description: "Every salon in your area is competing for the same customers. You need to stand out online.",
        statistic: "75% of customers choose salons based on online presence"
      },
      {
        title: "Marketing Costs",
        description: "Traditional advertising is expensive and hard to track. Digital marketing gives better ROI.",
        statistic: "Digital marketing costs 62% less than traditional marketing"
      }
    ],
    solutions: [
      {
        title: "24/7 Online Booking System",
        description: "Customers can book appointments anytime with automatic confirmations and reminders.",
        benefits: ["Reduce no-shows by 60%", "Increase bookings by 200%", "Save 5+ hours weekly"]
      },
      {
        title: "Professional Website Design",
        description: "Mobile-optimized website showcasing your services, prices, and team with stunning visuals.",
        benefits: ["Attract premium clients", "Build trust and credibility", "Showcase your work professionally"]
      },
      {
        title: "Google & Social Media Marketing",
        description: "Targeted advertising and SEO to get found by customers searching for salon services.",
        benefits: ["Increase local visibility", "Generate qualified leads", "Compete with larger salons"]
      },
      {
        title: "Customer Review Management",
        description: "Automated review requests and reputation management to build 5-star ratings.",
        benefits: ["Improve online reputation", "Attract more customers", "Build word-of-mouth marketing"]
      },
      {
        title: "Appointment Reminder System",
        description: "Automatic SMS and email reminders reduce no-shows and keep your schedule full.",
        benefits: ["Reduce no-shows by 60%", "Improve customer experience", "Maximize revenue per day"]
      },
      {
        title: "Service Menu & Pricing Display",
        description: "Clear pricing and service descriptions help customers choose and book confidently.",
        benefits: ["Reduce price objections", "Increase average transaction", "Streamline consultations"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "$18,000",
        features: [
          "Professional 5-page website",
          "Basic online booking system",
          "Mobile optimization",
          "3 months support",
          "Basic SEO setup"
        ]
      },
      {
        name: "Professional Package",
        price: "$28,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced booking with SMS reminders",
          "Google Ads setup ($500 ad credit)",
          "Social media integration",
          "Review management system",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "$42,000",
        features: [
          "Everything in Professional",
          "Customer loyalty program",
          "Advanced analytics dashboard",
          "Email marketing automation",
          "Staff scheduling system",
          "12 months support & maintenance",
          "Quarterly strategy sessions"
        ]
      }
    ],
    caseStudy: {
      title: "Bella Hair Studio - 300% Booking Increase",
      description: "After implementing our booking system and marketing strategy, Bella Hair Studio transformed their business.",
      results: [
        "300% increase in online bookings within 60 days",
        "Reduced no-shows from 25% to 8%",
        "Generated $45,000 additional revenue in first quarter",
        "Improved Google rating from 3.2 to 4.8 stars"
      ]
    }
  },

  restaurant: {
    industry: "restaurant",
    problems: [
      {
        title: "Customers Want Contactless Ordering",
        description: "Post-pandemic customers prefer QR code menus and online ordering for safety and convenience.",
        statistic: "73% of customers prefer restaurants with digital ordering options"
      },
      {
        title: "Third-Party Delivery Fees Are Killing Profits",
        description: "UberEats and DoorDash charge 15-30% commission, severely impacting your bottom line.",
        statistic: "Restaurants pay average of 23% in third-party delivery fees"
      },
      {
        title: "Table Management Chaos",
        description: "Peak hours bring long waits, frustrated customers, and lost revenue from poor table turnover.",
        statistic: "Efficient table management increases revenue by 40%"
      },
      {
        title: "Menu Updates Are Expensive & Slow",
        description: "Printing new menus for price changes or seasonal items costs hundreds and takes days.",
        statistic: "Digital menus reduce menu update costs by 90%"
      }
    ],
    solutions: [
      {
        title: "Direct Online Ordering System",
        description: "Your own branded ordering platform that bypasses expensive third-party fees.",
        benefits: ["Keep 100% of profits", "Build direct customer relationships", "Reduce order errors by 80%"]
      },
      {
        title: "QR Code Digital Menus",
        description: "Contactless menus that customers scan with their phones, with instant updates.",
        benefits: ["Reduce printing costs to $0", "Update prices instantly", "Improve customer safety"]
      },
      {
        title: "Table Reservation System",
        description: "Online table booking with waitlist management and automatic notifications.",
        benefits: ["Reduce wait times", "Improve table turnover", "Enhance customer experience"]
      },
      {
        title: "Customer Loyalty Program",
        description: "Points-based rewards system that keeps customers coming back regularly.",
        benefits: ["Increase repeat visits by 65%", "Higher average order value", "Build customer database"]
      },
      {
        title: "Kitchen Display System",
        description: "Digital order management that streamlines kitchen operations and reduces errors.",
        benefits: ["Faster order preparation", "Reduce order mistakes", "Improve kitchen efficiency"]
      },
      {
        title: "Local SEO & Google Marketing",
        description: "Get found by hungry customers searching for restaurants in your area.",
        benefits: ["Increase local visibility", "Drive foot traffic", "Compete with chain restaurants"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "$22,000",
        features: [
          "Professional restaurant website",
          "QR code digital menu system",
          "Basic online ordering",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "$32,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced online ordering with payments",
          "Table reservation system",
          "Customer loyalty program",
          "Google Ads setup",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "$48,000",
        features: [
          "Everything in Professional",
          "Kitchen display system",
          "Advanced analytics & reporting",
          "Email marketing automation",
          "Staff management portal",
          "12 months support & maintenance",
          "Monthly strategy consultations"
        ]
      }
    ],
    caseStudy: {
      title: "Tony's Pizzeria - $80K Additional Revenue",
      description: "Tony's eliminated third-party fees and increased direct orders with our complete restaurant system.",
      results: [
        "$80,000 additional revenue by eliminating delivery fees",
        "250% increase in direct online orders",
        "Reduced order processing time by 60%",
        "Improved customer satisfaction scores by 40%"
      ]
    }
  },

  healthcare: {
    industry: "healthcare",
    problems: [
      {
        title: "Patients Expect Modern Digital Experience",
        description: "Healthcare consumers want the same digital convenience they get from other industries.",
        statistic: "78% of patients prefer providers with online scheduling"
      },
      {
        title: "Administrative Burden Overwhelms Staff",
        description: "Phone scheduling, paper forms, and manual processes consume valuable time and resources.",
        statistic: "Practices spend 15+ hours weekly on manual scheduling"
      },
      {
        title: "HIPAA Compliance Is Complex",
        description: "Healthcare websites and systems must meet strict privacy regulations while being user-friendly.",
        statistic: "HIPAA violations average $2.2 million in penalties"
      },
      {
        title: "Patient No-Shows Cost Revenue",
        description: "Missed appointments create gaps in schedule and lost revenue that's hard to recover.",
        statistic: "Healthcare practices lose $150 billion annually to no-shows"
      }
    ],
    solutions: [
      {
        title: "HIPAA-Compliant Patient Portal",
        description: "Secure online portal where patients can access records, schedule appointments, and communicate.",
        benefits: ["100% HIPAA compliant", "Reduce admin calls by 70%", "Improve patient satisfaction"]
      },
      {
        title: "Online Appointment Scheduling",
        description: "24/7 online booking with automated confirmations and reminders to reduce no-shows.",
        benefits: ["Fill schedules efficiently", "Reduce no-shows by 50%", "Save staff time"]
      },
      {
        title: "Telehealth Integration",
        description: "Video consultation platform integrated with your existing workflow and billing.",
        benefits: ["Expand patient reach", "Reduce overhead costs", "Improve care accessibility"]
      },
      {
        title: "Digital Forms & Intake",
        description: "Patients complete forms online before visits, reducing wait times and improving efficiency.",
        benefits: ["Reduce wait times", "Improve data accuracy", "Streamline check-in process"]
      },
      {
        title: "Medical SEO & Local Marketing",
        description: "Get found by patients searching for healthcare providers in your specialty and area.",
        benefits: ["Attract new patients", "Build online reputation", "Compete effectively"]
      },
      {
        title: "Review & Reputation Management",
        description: "Automated system to request reviews and manage your online reputation professionally.",
        benefits: ["Improve online ratings", "Attract quality patients", "Build trust and credibility"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "$25,000",
        features: [
          "HIPAA-compliant website",
          "Basic patient portal",
          "Online appointment scheduling",
          "Digital forms system",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "$38,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Telehealth platform",
          "Advanced patient communication",
          "Review management system",
          "Medical SEO optimization",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "$55,000",
        features: [
          "Everything in Professional",
          "EHR system integration",
          "Advanced analytics & reporting",
          "Staff training & onboarding",
          "12 months support & maintenance",
          "Quarterly compliance reviews"
        ]
      }
    ],
    caseStudy: {
      title: "Valley Medical Center - 400% Online Booking Increase",
      description: "Valley Medical transformed their patient experience with our comprehensive healthcare platform.",
      results: [
        "400% increase in online appointment bookings",
        "Reduced no-shows from 22% to 9%",
        "Saved 25 hours weekly in administrative tasks",
        "Improved patient satisfaction scores by 45%"
      ]
    }
  },

  retail: {
    industry: "retail",
    problems: [
      {
        title: "E-commerce Is No Longer Optional",
        description: "Customers expect to browse and buy online, especially after pandemic shopping changes.",
        statistic: "E-commerce sales grew 44% in 2020 and continue rising"
      },
      {
        title: "Inventory Management Nightmares",
        description: "Manual inventory tracking leads to overselling, stockouts, and lost sales opportunities.",
        statistic: "Poor inventory management costs retailers $1.1 trillion annually"
      },
      {
        title: "Competition from Amazon & Big Box",
        description: "Large retailers dominate search results and customer attention with massive marketing budgets.",
        statistic: "54% of product searches start on Amazon, not Google"
      },
      {
        title: "Customer Data Scattered Everywhere",
        description: "Sales data, customer info, and inventory exist in separate systems making insights impossible.",
        statistic: "Unified customer data increases sales by 38%"
      }
    ],
    solutions: [
      {
        title: "Professional E-commerce Store",
        description: "Mobile-optimized online store with secure payments and inventory management.",
        benefits: ["Sell 24/7 globally", "Integrated payment processing", "Professional brand presence"]
      },
      {
        title: "Automated Inventory Management",
        description: "Real-time inventory tracking across online and offline sales channels.",
        benefits: ["Prevent overselling", "Optimize stock levels", "Reduce manual errors"]
      },
      {
        title: "Customer Relationship Management",
        description: "Unified system to track customer preferences, purchase history, and communication.",
        benefits: ["Increase repeat sales", "Personalize marketing", "Build customer loyalty"]
      },
      {
        title: "Local SEO & Google Shopping",
        description: "Get found by customers searching for your products online and locally.",
        benefits: ["Compete with big retailers", "Drive local foot traffic", "Increase online visibility"]
      },
      {
        title: "Email Marketing Automation",
        description: "Automated campaigns for abandoned carts, product recommendations, and customer retention.",
        benefits: ["Recover 25% of abandoned carts", "Increase repeat purchases", "Build customer relationships"]
      },
      {
        title: "Analytics & Reporting Dashboard",
        description: "Comprehensive insights into sales trends, customer behavior, and business performance.",
        benefits: ["Make data-driven decisions", "Identify growth opportunities", "Track ROI effectively"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "$20,000",
        features: [
          "Professional e-commerce website",
          "Payment processing setup",
          "Basic inventory management",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "$32,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced inventory management",
          "Customer relationship system",
          "Email marketing automation",
          "Google Shopping integration",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "$48,000",
        features: [
          "Everything in Professional",
          "Multi-channel sales integration",
          "Advanced analytics dashboard",
          "Staff training & onboarding",
          "12 months support & maintenance",
          "Monthly strategy consultations"
        ]
      }
    ],
    caseStudy: {
      title: "Coastal Gifts - 350% Online Revenue Growth",
      description: "Coastal Gifts transformed from struggling local shop to thriving online retailer.",
      results: [
        "350% increase in online revenue within 6 months",
        "Expanded customer base from local to nationwide",
        "Reduced inventory errors by 90%",
        "Improved profit margins by 25%"
      ]
    }
  },

  freelance: {
    industry: "freelance",
    problems: [
      {
        title: "Struggling to Stand Out Online",
        description: "Generic portfolio websites fail to showcase your unique skills and attract premium clients.",
        statistic: "86% of freelancers struggle with client acquisition"
      },
      {
        title: "Undercharging for Your Services", 
        description: "Without proper positioning and professional presentation, clients see you as a commodity.",
        statistic: "Freelancers with professional websites charge 47% more"
      },
      {
        title: "Time Wasted on Admin Tasks",
        description: "Manual invoicing, project tracking, and client communication consume billable hours.",
        statistic: "Freelancers spend 40% of time on non-billable admin work"
      },
      {
        title: "Inconsistent Client Pipeline",
        description: "Feast or famine cycles from relying on referrals and freelance platforms only.",
        statistic: "65% of freelancers have inconsistent monthly income"
      }
    ],
    solutions: [
      {
        title: "Premium Portfolio Website",
        description: "Professional showcase of your work, testimonials, and expertise that attracts high-paying clients.",
        benefits: ["Command premium rates", "Build credibility instantly", "Showcase expertise professionally"]
      },
      {
        title: "Client Management System",
        description: "Streamlined project management, time tracking, and client communication in one platform.",
        benefits: ["Save 10+ hours weekly", "Improve client satisfaction", "Track project profitability"]
      },
      {
        title: "Automated Invoicing & Payments",
        description: "Professional invoices with online payment processing and automatic follow-ups.",
        benefits: ["Get paid 60% faster", "Reduce payment delays", "Look more professional"]
      },
      {
        title: "Lead Generation System",
        description: "SEO-optimized website and content strategy to attract clients searching for your services.",
        benefits: ["Reduce dependence on platforms", "Attract better clients", "Build consistent pipeline"]
      },
      {
        title: "Personal Branding Package",
        description: "Professional logo, brand guidelines, and marketing materials for consistent presentation.",
        benefits: ["Stand out from competitors", "Build brand recognition", "Command higher rates"]
      },
      {
        title: "Social Proof Integration",
        description: "Testimonials, case studies, and client logos strategically displayed to build trust.",
        benefits: ["Increase conversion rates", "Build instant credibility", "Justify premium pricing"]
      }
    ],
    pricing: [
      {
        name: "Starter Package", 
        price: "$15,000",
        features: [
          "Professional portfolio website",
          "Basic client management",
          "Online payment integration",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "$25,000", 
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced project management",
          "Automated invoicing system",
          "SEO & lead generation setup",
          "Personal branding package",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "$38,000",
        features: [
          "Everything in Professional", 
          "Course/digital product platform",
          "Advanced analytics & reporting",
          "Email marketing automation",
          "12 months support & maintenance",
          "Quarterly business strategy sessions"
        ]
      }
    ],
    caseStudy: {
      title: "Sarah Johnson - 200% Rate Increase",
      description: "Graphic designer Sarah transformed her freelance business with our complete system.",
      results: [
        "Increased hourly rate from $35 to $105",
        "Booked solid 3 months in advance",
        "Reduced admin time by 75%",
        "Generated $120,000 revenue in first year"
      ]
    }
  },

  app: {
    industry: "app",
    problems: [
      {
        title: "App Store Competition Is Brutal",
        description: "Millions of apps compete for attention, making discovery nearly impossible without strategy.",
        statistic: "Only 0.005% of mobile apps are financially successful"
      },
      {
        title: "Development Costs Keep Rising",
        description: "Building native iOS and Android apps separately doubles development time and costs.",
        statistic: "Average app development costs $150,000-$450,000"
      },
      {
        title: "User Acquisition Is Expensive",
        description: "Paid advertising and user acquisition costs continue rising while organic discovery declines.",
        statistic: "Average cost per app install is $4.12 and rising"
      },
      {
        title: "Retention Rates Are Terrible", 
        description: "Most apps lose 90% of users within the first month without proper engagement strategy.",
        statistic: "Average app loses 77% of users within 3 days"
      }
    ],
    solutions: [
      {
        title: "Cross-Platform App Development",
        description: "Single codebase that works on iOS, Android, and web, reducing costs and development time.",
        benefits: ["Reduce development costs by 60%", "Faster time to market", "Easier maintenance and updates"]
      },
      {
        title: "App Store Optimization (ASO)",
        description: "Strategic optimization for app store rankings, keywords, and conversion rates.",
        benefits: ["Increase organic downloads", "Improve app store ranking", "Reduce user acquisition costs"]
      },
      {
        title: "User Engagement & Retention System",
        description: "Push notifications, onboarding flows, and retention strategies to keep users active.",
        benefits: ["Improve 30-day retention by 40%", "Increase user lifetime value", "Build loyal user base"]  
      },
      {
        title: "Analytics & Performance Monitoring",
        description: "Comprehensive tracking of user behavior, app performance, and business metrics.",
        benefits: ["Make data-driven decisions", "Identify optimization opportunities", "Track ROI effectively"]
      },
      {
        title: "Backend Infrastructure & APIs",
        description: "Scalable cloud infrastructure that grows with your user base and handles traffic spikes.",
        benefits: ["99.9% uptime guarantee", "Handle viral growth", "Reduce operational overhead"]
      },
      {
        title: "Monetization Strategy Implementation",
        description: "Implement proven monetization models including subscriptions, ads, and in-app purchases.",
        benefits: ["Optimize revenue per user", "Multiple revenue streams", "Sustainable business model"]
      }
    ],
    pricing: [
      {
        name: "MVP Package",
        price: "$35,000",
        features: [
          "Cross-platform mobile app",
          "Basic backend infrastructure", 
          "App store submission",
          "Basic analytics integration",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "$55,000",
        popular: true,
        features: [
          "Everything in MVP",
          "Advanced user engagement features",
          "App store optimization",
          "Push notification system",
          "Admin dashboard",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Enterprise Package", 
        price: "$85,000",
        features: [
          "Everything in Professional",
          "Advanced analytics & AI insights",
          "Custom integrations",
          "Dedicated development team",
          "12 months support & maintenance",
          "Monthly strategy & optimization"
        ]
      }
    ],
    caseStudy: {
      title: "FitTrack App - 500K Downloads in 6 Months",
      description: "Fitness tracking app achieved rapid growth with our complete development and marketing strategy.",
      results: [
        "500,000 downloads in first 6 months",
        "4.8-star rating across app stores",
        "$50,000 monthly recurring revenue",
        "Featured in App Store 'Health & Fitness'"
      ]
    }
  },

  consulting: {
    industry: "consulting",
    problems: [
      {
        title: "Difficulty Establishing Credibility Online",
        description: "Without strong digital presence, potential clients question your expertise and professionalism.",
        statistic: "84% of executives research consultants online before hiring"
      },
      {
        title: "Lead Generation Is Inconsistent",
        description: "Relying solely on referrals and networking creates unpredictable business pipeline.",
        statistic: "Consultants with strong online presence earn 73% more"
      },
      {
        title: "Competing on Price Instead of Value",
        description: "Without proper positioning, clients see consulting as commodity and negotiate on price.",
        statistic: "Consultants with thought leadership content charge 47% more"
      },
      {
        title: "Time Wasted on Non-Billable Tasks",
        description: "Manual proposal creation, scheduling, and admin work reduces billable hours significantly.",
        statistic: "Consultants spend 35% of time on non-billable activities"
      }
    ],
    solutions: [
      {
        title: "Authority-Building Website",
        description: "Professional website showcasing expertise, case studies, and thought leadership content.",
        benefits: ["Establish instant credibility", "Attract premium clients", "Differentiate from competitors"]
      },
      {
        title: "Lead Generation & CRM System",
        description: "Automated lead capture, nurturing sequences, and client relationship management.",
        benefits: ["Generate consistent leads", "Nurture prospects automatically", "Track conversion rates"]
      },
      {
        title: "Content Marketing Strategy",
        description: "Blog, whitepapers, and LinkedIn content that positions you as industry thought leader.",
        benefits: ["Build authority and expertise", "Attract inbound leads", "Support premium pricing"]
      },
      {
        title: "Automated Proposal System",
        description: "Professional proposal templates and automation that saves hours per proposal.",
        benefits: ["Create proposals in minutes", "Improve win rates", "Look more professional"]
      },
      {
        title: "Client Portal & Project Management",
        description: "Dedicated client portal for project updates, deliverables, and communication.",
        benefits: ["Improve client satisfaction", "Streamline communication", "Reduce admin overhead"]
      },
      {
        title: "LinkedIn Marketing Automation",
        description: "Strategic LinkedIn presence and outreach to connect with decision-makers.",
        benefits: ["Reach target executives", "Build professional network", "Generate qualified leads"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "$18,000",
        features: [
          "Professional consulting website", 
          "Basic CRM system",
          "Proposal templates",
          "LinkedIn optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "$32,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced lead generation system",
          "Content marketing strategy",
          "Client portal & project management",
          "LinkedIn marketing automation",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Authority Package",
        price: "$48,000",
        features: [
          "Everything in Professional",
          "Thought leadership program",
          "Speaking & media opportunities",
          "Advanced analytics & reporting", 
          "12 months support & maintenance",
          "Monthly strategy consultations"
        ]
      }
    ],
    caseStudy: {
      title: "McKenna Strategy - $2M Revenue Growth",
      description: "Management consultant increased revenue and client quality with our authority-building system.",
      results: [
        "$2M revenue growth within 18 months",
        "Increased average project value by 180%",
        "Generated 40+ qualified leads monthly",
        "Featured in Forbes and industry publications"
      ]
    }
  },

  doctors: {
    industry: "doctors",
    problems: [
      {
        title: "Patients Expect Online Convenience",
        description: "Modern patients want to book appointments, access records, and communicate with healthcare providers online.",
        statistic: "78% of patients prefer healthcare providers with online services"
      },
      {
        title: "Administrative Burden Overwhelming Staff",
        description: "Manual appointment scheduling, paper forms, and phone calls consume valuable time that could be spent on patient care.",
        statistic: "Healthcare practices spend 40% of time on administrative tasks"
      },
      {
        title: "Patient No-Shows Hurt Revenue",
        description: "Missed appointments create scheduling gaps and lost revenue that's difficult to recover.",
        statistic: "Healthcare no-shows cost the industry ₹2,000 crore annually"
      },
      {
        title: "Competition from Digital-First Clinics",
        description: "Tech-savvy medical practices are attracting patients with modern digital experiences.",
        statistic: "Practices with online booking see 35% more new patients"
      }
    ],
    solutions: [
      {
        title: "HIPAA-Compliant Patient Portal",
        description: "Secure online platform where patients can access medical records, test results, and communicate with your team.",
        benefits: ["100% HIPAA compliant security", "Reduce admin calls by 70%", "Improve patient satisfaction scores"]
      },
      {
        title: "24/7 Online Appointment Booking",
        description: "Patients can schedule appointments anytime with automatic confirmations and SMS reminders.",
        benefits: ["Fill vacant time slots automatically", "Reduce no-shows by 60%", "Save 15+ hours weekly"]
      },
      {
        title: "Digital Forms & Check-in System",
        description: "Patients complete intake forms and medical history online before their visit.",
        benefits: ["Reduce waiting room time", "Improve data accuracy", "Streamline patient flow"]
      },
      {
        title: "Telemedicine Integration",
        description: "Video consultation platform integrated with your existing systems and billing.",
        benefits: ["Expand patient reach", "Reduce overhead costs", "Offer convenient care options"]
      },
      {
        title: "Professional Medical Website",
        description: "Mobile-optimized website showcasing your expertise, services, and patient testimonials.",
        benefits: ["Build trust and credibility", "Attract new patients", "Showcase medical expertise"]
      },
      {
        title: "Review & Reputation Management",
        description: "Automated system to request patient reviews and manage your online reputation.",
        benefits: ["Improve online ratings", "Attract quality patients", "Build community trust"]
      }
    ],
    pricing: [
      {
        name: "Essential Package",
        price: "₹25,000",
        features: [
          "Professional medical website",
          "Basic appointment booking",
          "Digital patient forms",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "₹45,000",
        popular: true,
        features: [
          "Everything in Essential",
          "HIPAA-compliant patient portal",
          "Telemedicine platform",
          "SMS appointment reminders",
          "Review management system",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "₹80,000",
        features: [
          "Everything in Professional",
          "Advanced patient analytics",
          "Multi-location support",
          "Staff training & onboarding",
          "Custom integrations",
          "12 months support & maintenance"
        ]
      }
    ],
    caseStudy: {
      title: "Dr. Sharma's Clinic - 250% Patient Growth",
      description: "A leading family practice in Delhi transformed their patient experience and grew their practice significantly.",
      results: [
        "250% increase in new patient bookings",
        "Reduced no-shows from 30% to 8%",
        "Saved 20 hours weekly in administrative tasks",
        "Improved patient satisfaction scores by 45%"
      ]
    }
  },

  gym: {
    industry: "gym",
    problems: [
      {
        title: "Membership Retention is Challenging",
        description: "Traditional gyms struggle with high churn rates as members lose motivation without proper engagement.",
        statistic: "80% of gym members quit within 6 months of joining"
      },
      {
        title: "Manual Class Booking Creates Frustration",
        description: "Phone-based class reservations lead to missed calls, overbooking, and frustrated members.",
        statistic: "45% of gym members want online class booking"
      },
      {
        title: "Limited Community Engagement",
        description: "Members feel disconnected without proper social features and progress tracking systems.",
        statistic: "Members with community engagement stay 3x longer"
      },
      {
        title: "Competition from Digital Fitness Apps",
        description: "Home workout apps and online fitness programs are attracting your potential members.",
        statistic: "Digital fitness market grew 400% in the last 2 years"
      }
    ],
    solutions: [
      {
        title: "Member Portal & App Integration",
        description: "Dedicated platform where members can track workouts, book classes, and monitor progress.",
        benefits: ["Increase member engagement", "Track fitness progress", "Reduce front desk calls"]
      },
      {
        title: "Online Class Booking System",
        description: "Real-time class schedules with instant booking and automatic waitlist management.",
        benefits: ["Prevent overbooking", "Maximize class attendance", "Reduce administrative work"]
      },
      {
        title: "Professional Fitness Website",
        description: "Mobile-optimized website showcasing facilities, trainers, classes, and membership options.",
        benefits: ["Attract new members", "Showcase facility features", "Build credibility online"]
      },
      {
        title: "Social Fitness Community",
        description: "Member community features with progress sharing, challenges, and group motivation.",
        benefits: ["Improve member retention", "Build community engagement", "Increase motivation levels"]
      },
      {
        title: "Virtual Training Integration",
        description: "Hybrid platform offering both in-person and online training sessions.",
        benefits: ["Expand service offerings", "Generate additional revenue", "Serve members remotely"]
      },
      {
        title: "Automated Marketing & Retention",
        description: "Email campaigns for member retention, birthday offers, and re-engagement sequences.",
        benefits: ["Reduce member churn", "Increase lifetime value", "Automate retention efforts"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "₹20,000",
        features: [
          "Professional gym website",
          "Basic class booking system",
          "Member registration portal",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Fitness Pro Package",
        price: "₹35,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced member portal",
          "Progress tracking system",
          "Social community features",
          "Automated email campaigns",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "₹50,000",
        features: [
          "Everything in Fitness Pro",
          "Virtual training platform",
          "Advanced analytics dashboard",
          "Custom mobile app",
          "Staff training & onboarding",
          "12 months support & maintenance"
        ]
      }
    ],
    caseStudy: {
      title: "FitZone Gym - 180% Member Retention",
      description: "A popular fitness center in Bangalore transformed their member experience and dramatically improved retention.",
      results: [
        "180% improvement in member retention rate",
        "300% increase in class bookings",
        "Reduced front desk calls by 65%",
        "Added ₹5 lakh monthly revenue through virtual training"
      ]
    }
  },

  lawyers: {
    industry: "lawyers",
    problems: [
      {
        title: "Clients Research Lawyers Online First",
        description: "95% of potential clients search for legal services online before making contact.",
        statistic: "95% of legal clients start their search online"
      },
      {
        title: "Lack of Online Credibility Hurts Business",
        description: "Without professional online presence, potential clients question your expertise and professionalism.",
        statistic: "78% of clients choose lawyers based on online reputation"
      },
      {
        title: "Time-Consuming Client Intake Process",
        description: "Manual paperwork and phone consultations consume billable hours and delay case starts.",
        statistic: "Law firms spend 35% of time on non-billable administrative tasks"
      },
      {
        title: "Difficulty Showcasing Legal Expertise",
        description: "Traditional marketing can't effectively demonstrate your legal knowledge and case success rates.",
        statistic: "Lawyers with content marketing get 67% more leads"
      }
    ],
    solutions: [
      {
        title: "Professional Legal Website",
        description: "Authoritative website showcasing your practice areas, case results, and legal expertise.",
        benefits: ["Build instant credibility", "Showcase legal expertise", "Attract quality clients"]
      },
      {
        title: "Online Client Intake System",
        description: "Secure forms for initial consultations and case information collection before meetings.",
        benefits: ["Save consultation time", "Gather complete information", "Streamline case intake"]
      },
      {
        title: "Legal Content Marketing",
        description: "Blog articles, legal guides, and FAQ sections that establish thought leadership.",
        benefits: ["Demonstrate expertise", "Improve search rankings", "Educate potential clients"]
      },
      {
        title: "Client Portal & Case Management",
        description: "Secure portal where clients can access case updates, documents, and communicate.",
        benefits: ["Improve client satisfaction", "Reduce status calls", "Enhance transparency"]
      },
      {
        title: "Local SEO & Google My Business",
        description: "Optimized local search presence to get found by clients in your practice area.",
        benefits: ["Attract local clients", "Improve search visibility", "Build online reputation"]
      },
      {
        title: "Review & Reputation Management",
        description: "System to collect client testimonials and manage your online legal reputation.",
        benefits: ["Build trust with prospects", "Improve online ratings", "Generate referrals"]
      }
    ],
    pricing: [
      {
        name: "Solo Practice Package",
        price: "₹30,000",
        features: [
          "Professional legal website",
          "Practice area showcase",
          "Basic client intake forms",
          "Google My Business setup",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "₹50,000",
        popular: true,
        features: [
          "Everything in Solo Practice",
          "Secure client portal",
          "Content marketing setup",
          "SEO optimization",
          "Review management system",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Law Firm Package",
        price: "₹80,000",
        features: [
          "Everything in Professional",
          "Multi-lawyer profiles",
          "Advanced case management",
          "Lead tracking system",
          "Staff training & onboarding",
          "12 months support & maintenance"
        ]
      }
    ],
    caseStudy: {
      title: "Shah & Associates - 300% Client Inquiries",
      description: "A corporate law firm in Mumbai transformed their online presence and significantly increased client acquisition.",
      results: [
        "300% increase in qualified client inquiries",
        "Improved average case value by 150%",
        "Reduced intake time by 40%",
        "Built reputation as thought leader in corporate law"
      ]
    }
  },

  realestate: {
    industry: "realestate",
    problems: [
      {
        title: "Buyers Start Property Search Online",
        description: "95% of property buyers begin their search online before contacting any agent.",
        statistic: "95% of property searches start online"
      },
      {
        title: "High Competition from Property Portals",
        description: "Large property websites dominate search results, making it hard for individual agents to get noticed.",
        statistic: "78% of leads go to agents with strong online presence"
      },
      {
        title: "Difficulty Showcasing Property Portfolio",
        description: "Traditional marketing can't effectively display property photos, virtual tours, and detailed listings.",
        statistic: "Properties with virtual tours get 87% more views"
      },
      {
        title: "Lead Management is Time-Consuming",
        description: "Manual follow-ups and scattered client information leads to missed opportunities and lost sales.",
        statistic: "Real estate agents lose 40% of leads due to poor follow-up"
      }
    ],
    solutions: [
      {
        title: "Professional Real Estate Website",
        description: "Stunning property showcase website with high-quality galleries and virtual tour integration.",
        benefits: ["Showcase properties professionally", "Build agent credibility", "Attract serious buyers"]
      },
      {
        title: "Property Search & Listing System",
        description: "Advanced search functionality with filters for location, price, property type, and amenities.",
        benefits: ["Help buyers find perfect properties", "Reduce manual search time", "Improve user experience"]
      },
      {
        title: "Lead Capture & CRM System",
        description: "Automated lead capture with integrated CRM for follow-ups and client relationship management.",
        benefits: ["Never miss a lead", "Automate follow-up sequences", "Track client interactions"]
      },
      {
        title: "Virtual Tours & 360° Views",
        description: "Immersive virtual property tours that let buyers explore properties remotely.",
        benefits: ["Reduce unnecessary site visits", "Attract remote buyers", "Stand out from competition"]
      },
      {
        title: "Local SEO & Property Marketing",
        description: "Optimized local search presence to get found by property buyers in your area.",
        benefits: ["Dominate local search", "Attract local buyers", "Compete with large portals"]
      },
      {
        title: "Client Testimonials & Reviews",
        description: "Showcase successful property transactions and satisfied client testimonials.",
        benefits: ["Build trust with prospects", "Demonstrate success rate", "Generate referrals"]
      }
    ],
    pricing: [
      {
        name: "Agent Starter Package",
        price: "₹40,000",
        features: [
          "Professional realtor website",
          "Property listing system (up to 50 listings)",
          "Basic lead capture forms",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "₹70,000",
        popular: true,
        features: [
          "Everything in Agent Starter",
          "Advanced property search",
          "Virtual tour integration",
          "CRM & lead management",
          "Local SEO optimization",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Agency Package",
        price: "₹120,000",
        features: [
          "Everything in Professional",
          "Multi-agent platform",
          "Advanced analytics & reporting",
          "Custom integrations",
          "Staff training & onboarding",
          "12 months support & maintenance"
        ]
      }
    ],
    caseStudy: {
      title: "Patel Properties - 250% Sales Increase",
      description: "A real estate agency in Pune transformed their property marketing and dramatically increased sales.",
      results: [
        "250% increase in property sales within 8 months",
        "Reduced time-to-sale by 35%",
        "Generated 500+ qualified leads monthly",
        "Expanded market reach to 3 additional cities"
      ]
    }
  },

  jewellery: {
    industry: "jewellery",
    problems: [
      {
        title: "Customers Want to See Jewelry Online First",
        description: "Modern jewelry buyers research designs, prices, and reviews online before visiting stores.",
        statistic: "87% of jewelry buyers research online before purchasing"
      },
      {
        title: "Difficulty Showcasing Intricate Designs",
        description: "Traditional marketing can't capture the detail and beauty of jewelry pieces effectively.",
        statistic: "High-quality photos increase jewelry sales by 65%"
      },
      {
        title: "Custom Orders Need Better Communication",
        description: "Bespoke jewelry orders require detailed client communication and design visualization.",
        statistic: "Custom jewelry has 3x higher profit margins"
      },
      {
        title: "Building Trust for High-Value Purchases",
        description: "Jewelry buyers need confidence in authenticity, quality, and after-sales service.",
        statistic: "89% check reviews before buying expensive jewelry"
      }
    ],
    solutions: [
      {
        title: "Stunning Jewelry Website",
        description: "High-resolution photo galleries showcasing your jewelry collections with zoom and 360° views.",
        benefits: ["Showcase intricate details", "Display full collections", "Build professional credibility"]
      },
      {
        title: "Custom Design Portal",
        description: "Interactive platform for custom jewelry orders with design visualization and approval workflow.",
        benefits: ["Streamline custom orders", "Improve design communication", "Increase custom sales"]
      },
      {
        title: "E-commerce Integration",
        description: "Secure online store with inventory management and payment processing for direct sales.",
        benefits: ["Sell 24/7 online", "Manage inventory efficiently", "Process secure payments"]
      },
      {
        title: "Virtual Try-On Technology",
        description: "AR-powered virtual try-on feature for rings, necklaces, and earrings.",
        benefits: ["Reduce returns", "Increase customer confidence", "Offer unique experience"]
      },
      {
        title: "Certificate & Authentication System",
        description: "Digital certificates and authenticity verification for precious stones and metals.",
        benefits: ["Build buyer confidence", "Verify authenticity", "Premium positioning"]
      },
      {
        title: "Customer Review & Gallery",
        description: "Showcase customer photos wearing your jewelry with testimonials and reviews.",
        benefits: ["Build social proof", "Increase trust", "Generate referrals"]
      }
    ],
    pricing: [
      {
        name: "Boutique Package",
        price: "₹25,000",
        features: [
          "Professional jewelry website",
          "High-resolution photo galleries",
          "Basic e-commerce functionality",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Designer Package",
        price: "₹45,000",
        popular: true,
        features: [
          "Everything in Boutique",
          "Custom design portal",
          "Virtual try-on technology",
          "Customer review system",
          "SEO optimization",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "₹70,000",
        features: [
          "Everything in Designer",
          "Advanced e-commerce features",
          "Certificate management system",
          "Multi-location support",
          "Staff training & onboarding",
          "12 months support & maintenance"
        ]
      }
    ],
    caseStudy: {
      title: "Mehra Jewelers - 400% Online Sales Growth",
      description: "A traditional jewelry store in Jaipur transformed their business with stunning online presence.",
      results: [
        "400% increase in online sales within 6 months",
        "Expanded customer base from local to pan-India",
        "Increased average order value by 180%",
        "Custom orders grew from 10% to 45% of total sales"
      ]
    }
  },

  wedding: {
    industry: "wedding",
    problems: [
      {
        title: "Couples Research Wedding Vendors Online",
        description: "95% of engaged couples start their wedding planning by researching vendors online.",
        statistic: "95% of couples research wedding vendors online first"
      },
      {
        title: "Difficulty Showcasing Wedding Portfolio",
        description: "Traditional marketing can't effectively display the emotion and beauty of wedding moments.",
        statistic: "Wedding photos and videos are the #1 factor in vendor selection"
      },
      {
        title: "Complex Wedding Planning Coordination",
        description: "Managing multiple vendors, timelines, and client preferences requires sophisticated organization.",
        statistic: "Wedding planning involves coordinating 15+ different vendors"
      },
      {
        title: "Seasonal Business Needs Consistent Leads",
        description: "Wedding businesses need steady lead generation throughout the year, not just peak seasons.",
        statistic: "Wedding businesses see 70% revenue fluctuation seasonally"
      }
    ],
    solutions: [
      {
        title: "Stunning Wedding Portfolio Website",
        description: "Beautiful galleries showcasing your wedding photography, videography, or planning work.",
        benefits: ["Showcase emotional moments", "Display diverse wedding styles", "Build romantic brand image"]
      },
      {
        title: "Wedding Planning Management System",
        description: "Client portal for timeline management, vendor coordination, and budget tracking.",
        benefits: ["Streamline planning process", "Improve client communication", "Reduce planning stress"]
      },
      {
        title: "Lead Generation & Inquiry System",
        description: "Optimized contact forms and lead capture specifically designed for wedding inquiries.",
        benefits: ["Capture quality leads", "Qualify prospects efficiently", "Reduce inquiry response time"]
      },
      {
        title: "Real Wedding Showcase",
        description: "Detailed case studies of real weddings with photos, stories, and vendor testimonials.",
        benefits: ["Build social proof", "Inspire future couples", "Demonstrate expertise"]
      },
      {
        title: "Vendor Network Integration",
        description: "Connect with other wedding vendors for referrals and collaborative marketing.",
        benefits: ["Increase referral network", "Cross-promote services", "Build industry relationships"]
      },
      {
        title: "Social Media Integration",
        description: "Seamless integration with Instagram, Pinterest, and Facebook for wedding content.",
        benefits: ["Leverage visual platforms", "Increase social engagement", "Attract millennial couples"]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "₹30,000",
        features: [
          "Professional wedding website",
          "Beautiful portfolio galleries",
          "Basic inquiry forms",
          "Mobile optimization",
          "3 months support"
        ]
      },
      {
        name: "Professional Package",
        price: "₹55,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Wedding planning portal",
          "Real wedding showcases",
          "SEO optimization",
          "Social media integration",
          "6 months support & maintenance"
        ]
      },
      {
        name: "Premium Package",
        price: "₹80,000",
        features: [
          "Everything in Professional",
          "Vendor network platform",
          "Advanced analytics",
          "Custom integrations",
          "Staff training & onboarding",
          "12 months support & maintenance"
        ]
      }
    ],
    caseStudy: {
      title: "Eternal Moments Wedding - 300% Booking Growth",
      description: "A wedding planning company in Goa transformed their online presence and significantly increased bookings.",
      results: [
        "300% increase in wedding bookings",
        "Expanded from local to destination weddings",
        "Increased average wedding value by 150%",
        "Built network of 50+ preferred vendors"
      ]
    }
  },

  construction: {
    industry: "construction",
    problems: [
      {
        title: "Project Communication Issues",
        description: "Poor communication between clients and contractors leads to delays and cost overruns.",
        statistic: "67% of construction delays are due to poor communication"
      },
      {
        title: "Outdated Marketing Methods",
        description: "Traditional marketing doesn't reach modern customers who search online for contractors.",
        statistic: "89% of customers research contractors online before hiring"
      },
      {
        title: "Project Showcase Limitations",
        description: "Without a proper portfolio, potential clients can't see your quality work and capabilities.",
        statistic: "Visual portfolios increase project inquiries by 78%"
      },
      {
        title: "Manual Quote Processes",
        description: "Paper-based quotes and estimates are slow and prone to errors.",
        statistic: "Digital quotes are generated 5x faster than manual ones"
      }
    ],
    solutions: [
      {
        title: "Professional Website with Portfolio",
        description: "Showcase your best projects with high-quality galleries and detailed case studies.",
        benefits: [
          "Professional project galleries",
          "Before/after showcases", 
          "Client testimonials",
          "Service area coverage"
        ]
      },
      {
        title: "Digital Quote System",
        description: "Generate professional quotes instantly with automated calculations and follow-ups.",
        benefits: [
          "Instant quote generation",
          "Automated follow-ups",
          "Digital signatures",
          "Payment processing"
        ]
      },
      {
        title: "Lead Generation Tools",
        description: "Capture and manage leads from your website with integrated CRM functionality.",
        benefits: [
          "Contact form optimization",
          "Lead tracking system",
          "Automated responses",
          "Customer database"
        ]
      },
      {
        title: "SEO & Local Marketing",
        description: "Get found by customers searching for construction services in your area.",
        benefits: [
          "Local SEO optimization",
          "Google My Business setup",
          "Review management",
          "Social media presence"
        ]
      }
    ],
    pricing: [
      {
        name: "Starter Package",
        price: "₹50,000",
        popular: false,
        features: [
          "Professional Website",
          "Project Portfolio (10 projects)",
          "Contact Forms",
          "Mobile Responsive Design",
          "Basic SEO Setup",
          "3 Months Support"
        ]
      },
      {
        name: "Professional Package", 
        price: "₹85,000",
        popular: true,
        features: [
          "Everything in Starter",
          "Quote Generation System",
          "Client Portal Access",
          "Advanced Portfolio (25 projects)",
          "Lead Management CRM",
          "Google Ads Setup",
          "6 Months Support"
        ]
      },
      {
        name: "Enterprise Package",
        price: "₹150,000", 
        popular: false,
        features: [
          "Everything in Professional",
          "Custom Project Management",
          "Advanced CRM Integration",
          "Unlimited Project Gallery",
          "Multi-location Support",
          "Custom Integrations",
          "12 Months Support"
        ]
      }
    ],
    caseStudy: {
      title: "Mumbai Construction Company Success Story",
      description: "A leading construction firm in Mumbai increased their project inquiries by 300% and streamlined their quote process with our digital solutions.",
      results: [
        "300% increase in project inquiries",
        "50% faster quote generation",
        "40% reduction in administrative time",
        "85% of leads now come from online sources"
      ]
    }
  }
}