import { z } from "zod"

export const industries = [
  "salon",
  "construction",
  "doctors",
  "gym",
  "lawyers",
  "realestate", 
  "jewellery",
  "wedding",
  "restaurant", 
  "healthcare",
  "retail",
  "freelance",
  "app",
  "consulting"
] as const

export const budgetRanges = [
  "15k-25k",
  "25k-40k", 
  "40k-60k",
  "60k+"
] as const

export const timelineOptions = [
  "1-2weeks",
  "3-4weeks",
  "1-2months", 
  "3months+"
] as const

export const clientFormSchema = z.object({
  // Basic Information
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  
  // Business Details
  industry: z.enum(industries),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  budget: z.enum(budgetRanges),
  timeline: z.enum(timelineOptions),
  
  // Agency Configuration
  agencyConfig: z.object({
    name: z.string().default("LoopXO"),
    logo: z.string().optional(),
    email: z.string().email().default("hello@loopxo.com"),
    phone: z.string().default("+91 98765 43210"),
    address: z.string().default("Mumbai, Maharashtra, India"),
    website: z.string().url().optional(),
    tagline: z.string().default("A Digital Agency")
  }).default({}),
  
  // Theme Selection
  theme: z.string().default("dark-luxe"),
  
  // Optional Fields
  specialRequirements: z.string().optional(),
  currentWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  competitors: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientFormSchema>

export const servicesByIndustry = {
  salon: [
    "Website Development",
    "Online Booking System", 
    "SEO Optimization",
    "Social Media Management",
    "Google Ads",
    "Review Management"
  ],
  construction: [
    "Professional Website",
    "Project Portfolio Gallery",
    "Quote Request System", 
    "SEO Optimization",
    "Google Ads",
    "Client Management CRM"
  ],
  doctors: [
    "HIPAA Compliant Website",
    "Patient Portal",
    "Appointment Booking",
    "Telehealth Integration",
    "Medical Forms",
    "Insurance Verification"
  ],
  gym: [
    "Membership Website",
    "Class Booking System",
    "Trainer Profiles",
    "Progress Tracking",
    "Payment Processing",
    "Mobile App Integration"
  ],
  lawyers: [
    "Professional Website",
    "Client Portal",
    "Case Management",
    "Document Sharing",
    "Appointment Scheduling",
    "Secure Communication"
  ],
  realestate: [
    "Property Listings",
    "Advanced Search",
    "Virtual Tours",
    "Lead Generation",
    "CRM Integration",
    "Market Analytics"
  ],
  jewellery: [
    "E-commerce Website",
    "Product Galleries",
    "Custom Design Tools",
    "Virtual Try-On",
    "Secure Payments",
    "Inventory Management"
  ],
  wedding: [
    "Portfolio Website",
    "Package Showcase",
    "Availability Calendar",
    "Client Planning Portal",
    "Vendor Directory",
    "Payment Scheduling"
  ],
  restaurant: [
    "Website Development",
    "Online Ordering System",
    "Table Booking",
    "Menu Management",
    "Delivery Integration",
    "Social Media Management"
  ],
  healthcare: [
    "Patient Portal",
    "Appointment System", 
    "Telehealth Integration",
    "HIPAA Compliance",
    "Medical Forms",
    "Review Management"
  ],
  retail: [
    "E-commerce Website",
    "Inventory Management",
    "Payment Processing",
    "SEO Optimization", 
    "Google Ads",
    "Social Media Marketing"
  ],
  freelance: [
    "Portfolio Website",
    "Client Management",
    "Booking System",
    "Payment Integration",
    "SEO Optimization",
    "Social Media Presence"
  ],
  app: [
    "Mobile App Development",
    "Web App Development",
    "API Development",
    "Database Design",
    "Cloud Hosting",
    "App Store Optimization"
  ],
  consulting: [
    "Professional Website",
    "Lead Generation",
    "Content Management",
    "CRM Integration", 
    "SEO Optimization",
    "LinkedIn Marketing"
  ]
} as const