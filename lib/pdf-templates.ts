import puppeteer from 'puppeteer'

import { ClientFormData } from './schemas'
import { industryTemplates, IndustryTemplate } from './templates'
import { Invoice, formatCurrency, invoiceThemes } from './invoice-data'
import { getTheme, ThemeConfig, AgencyConfig } from './themes'

export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter'
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  printBackground?: boolean
  preferCSSPageSize?: boolean
}

export const defaultPDFOptions: PDFGenerationOptions = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '20mm',
    bottom: '20mm',
    left: '20mm'
  },
  printBackground: true,
  preferCSSPageSize: true
}

export interface ContractPDFData {
  content: string
  title: string
  logo?: string | null
}

export interface InvoicePDFData {
  invoice: Partial<Invoice>
  logo?: string | null
  theme?: string
}



export async function generateProposalPDF(
  clientData: ClientFormData,
  options: PDFGenerationOptions = defaultPDFOptions,
  customImages?: Record<string, string>,
  customLogo?: string,
  customTexts?: Record<string, string>,
  imageHeights?: Record<string, number>
): Promise<Buffer> {
  const template = industryTemplates[clientData.industry]
  if (!template) {
    throw new Error(`Template not found for industry: ${clientData.industry}`)
  }

  const theme = getTheme(clientData.theme || 'dark-luxe')
  const agencyConfig = {
    name: clientData.agencyConfig?.name || 'LoopXO',
    email: clientData.agencyConfig?.email || 'hello@loopxo.com',
    phone: clientData.agencyConfig?.phone || '+91 98765 43210',
    address: clientData.agencyConfig?.address || 'Mumbai, Maharashtra, India',
    tagline: clientData.agencyConfig?.tagline || 'A Digital Agency',
    logo: clientData.agencyConfig?.logo,
    website: clientData.agencyConfig?.website
  }

  const htmlContent = generateProposalHTML(clientData, template, theme, agencyConfig, customImages, customLogo, customTexts, imageHeights)
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      ...options,
      format: options.format,
      margin: options.margin,
      printBackground: options.printBackground,
      preferCSSPageSize: options.preferCSSPageSize
    })

    return pdfBuffer as Buffer
  } finally {
    await browser.close()
  }
}

function generateProposalHTML(
  clientData: ClientFormData, 
  template: IndustryTemplate, 
  theme: ThemeConfig, 
  agencyConfig: AgencyConfig,
  customImages?: Record<string, string>,
  customLogo?: string,
  customTexts?: Record<string, string>,
  imageHeights?: Record<string, number>
): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Default images for each section
  const defaultImages = {
    'who-we-are': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop&auto=format&q=80',
    'industry-needs': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=400&fit=crop&auto=format&q=80',
    'solutions': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop&auto=format&q=80',
    'results': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop&auto=format&q=80',
    'pricing': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=400&fit=crop&auto=format&q=80',
    'why-choose': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=400&fit=crop&auto=format&q=80',
    'next-steps': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop&auto=format&q=80'
  }

  const getImageForSection = (sectionId: string) => {
    return customImages?.[sectionId] || defaultImages[sectionId as keyof typeof defaultImages] || ''
  }

  const getLogoUrl = () => {
    return customLogo || agencyConfig.logo || ''
  }

  // Default texts for customization
  const defaultTexts = {
    'cover-title': 'Digital Transformation Proposal',
    'cover-subtitle': 'Elevate Your Business',
    'who-we-are-intro': 'Hello! We\'ve been making professional websites for years, helping businesses thrive in the digital world.',
    'who-we-are-services': 'Custom websites and mobile apps that convert visitors into customers',
    'who-we-are-booking': '24/7 online booking that reduces no-shows and increases revenue',
    'who-we-are-seo': 'Get found by customers searching for your services online',
    'who-we-are-social': 'Connect all your social platforms for maximum online presence',
    'who-we-are-cta': 'Ready to Transform Your Business?',
    'next-steps-title': 'Ready to Transform Your Business?',
    'next-steps-intro': 'Contact us today for a FREE consultation and see how we can help you dominate the digital space.',
    'next-steps-badge1': '24/7 Customer Support Available',
    'next-steps-badge2': 'FREE Initial Consultation',
    'next-steps-badge3': 'Located in Your Area',
    'endnotes-validity': 'This proposal is valid for 30 days from the date of issue.'
  }

  const defaultImageHeights = {
    'who-we-are': 80,
    'industry-needs': 80,
    'solutions': 80,
    'results': 80,
    'pricing': 80,
    'why-choose': 80,
    'next-steps': 80
  }

  const _getTextForSection = (textId: string) => {
    return customTexts?.[textId] || defaultTexts[textId as keyof typeof defaultTexts] || ''
  }

  const _getImageHeight = (sectionId: string) => {
    return imageHeights?.[sectionId] || defaultImageHeights[sectionId as keyof typeof defaultImageHeights] || 80
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${agencyConfig.name} Proposal - ${clientData.businessName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
        
        /* Dynamic Theme Styles */
        :root {
            --primary: ${theme.colors.primary};
            --secondary: ${theme.colors.secondary};
            --accent: ${theme.colors.accent};
            --background: ${theme.colors.background};
            --surface: ${theme.colors.surface};
            --text: ${theme.colors.text};
            --text-secondary: ${theme.colors.textSecondary};
            --border: ${theme.colors.border};
            --border-radius: ${theme.styles.borderRadius};
            --shadow: ${theme.styles.shadow};
            --gradient: ${theme.styles.gradient};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${theme.fonts.body}, -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--background);
        }
        
        .page {
            width: 210mm;
            height: 297mm;
            padding: 8mm;
            margin: 0 auto;
            background: var(--background);
            page-break-after: always;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Page break controls */
        .solution-grid {
            page-break-inside: avoid;
        }
        
        .case-study {
            page-break-inside: avoid;
        }
        
        .results-grid {
            page-break-inside: avoid;
        }
        
        /* Cover Page Styles - Dynamic Theme */
        .cover-page {
            background: var(--gradient);
            color: var(--text);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            padding: 40mm 20mm;
            border: 2px solid var(--primary);
        }
        
        .cover-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, ${theme.colors.primary}20 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${theme.colors.secondary}10 0%, transparent 50%);
            pointer-events: none;
        }
        
        .logo-container {
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 2;
        }
        
        .logo-image {
            max-width: 200px;
            max-height: 100px;
            width: auto;
            height: auto;
            filter: brightness(1.2) contrast(1.1);
        }
        
        .logo-text {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--primary);
            text-align: center;
            letter-spacing: 2px;
        }
        
        .cover-tagline {
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 3rem;
            opacity: 0.9;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--primary);
            position: relative;
            z-index: 2;
        }
        
        .cover-title {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 1rem;
            line-height: 1.2;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            z-index: 2;
        }
        
        .cover-subtitle {
            font-size: 1.8rem;
            font-weight: 400;
            margin-bottom: 2rem;
            opacity: 0.9;
            color: var(--text);
            position: relative;
            z-index: 2;
        }
        
        .client-info-card {
            background: ${theme.colors.surface}ee;
            color: var(--text);
            padding: 3rem 4rem;
            border-radius: 20px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(10px);
            border: 2px solid var(--primary);
            position: relative;
            z-index: 2;
        }
        
        .client-name {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .business-name {
            font-size: 1.6rem;
            font-weight: 500;
            color: var(--text);
            margin-bottom: 1.5rem;
        }
        
        .proposal-date {
            font-size: 1.1rem;
            color: var(--text-secondary);
            font-weight: 400;
        }

        /* Content Page Styles - Dynamic Theme */
        .content-page {
            background: var(--gradient);
            color: var(--text);
            border: 1px solid var(--border);
        }
        
        .page-header {
            background: linear-gradient(135deg, var(--surface) 0%, ${theme.colors.background} 100%);
            color: var(--text);
            padding: 1.5rem 1rem;
            margin: -11mm -11mm 1.5rem -11mm;
            text-align: center;
            position: relative;
            flex-shrink: 0;
            border-bottom: 3px solid var(--primary);
        }
        
        .page-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent 0%, ${theme.colors.primary}20 50%, transparent 100%);
            pointer-events: none;
        }
        
        .page-title {
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            z-index: 2;
        }
        
        .page-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            color: var(--text-secondary);
            position: relative;
            z-index: 2;
        }
        
        .section {
            margin-bottom: 1rem;
            flex: 1;
            overflow: hidden;
        }
        
        .section-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 1.5rem;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 0.4rem;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .service-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border: 2px solid #333333;
            border-radius: 12px;
            padding: 1.2rem;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #d4af37 0%, #00ffff 100%);
        }
        
        .service-card:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            box-shadow: 0 8px 30px ${theme.colors.primary}30;
        }
        
        .service-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 0.8rem;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--background);
            box-shadow: 0 4px 15px ${theme.colors.primary}50;
        }
        
        .problem-grid, .solution-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
            margin-bottom: 0.8rem;
        }
        
        .card {
            background: linear-gradient(135deg, var(--surface) 0%, ${theme.colors.background} 100%);
            border: 2px solid var(--border);
            border-radius: var(--border-radius);
            padding: 1rem;
            box-shadow: var(--shadow);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            min-height: 0;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        }
        
        .card:hover {
            border-color: var(--primary);
            box-shadow: 0 8px 30px ${theme.colors.primary}30;
        }
        
        .card h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 0.8rem;
        }
        
        .card p {
            color: var(--text-secondary);
            margin-bottom: 0.8rem;
            line-height: 1.5;
            font-size: 0.9rem;
        }
        
        .statistic {
            font-size: 1rem;
            font-weight: 700;
            color: var(--secondary);
            background: ${theme.colors.secondary}20;
            padding: 0.8rem;
            border-radius: 8px;
            margin-top: 1rem;
            border-left: 4px solid var(--secondary);
        }
        
        .benefits-list {
            list-style: none;
            margin-top: 0.8rem;
        }
        
        .benefits-list li {
            color: var(--secondary);
            font-weight: 600;
            margin-bottom: 0.4rem;
            padding-left: 1.2rem;
            position: relative;
            font-size: 0.85rem;
        }
        
        .benefits-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--secondary);
            font-weight: bold;
        }
        
        .pricing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
        }
        
        .pricing-card {
            background: linear-gradient(135deg, var(--surface) 0%, ${theme.colors.background} 100%);
            border: 2px solid var(--border);
            border-radius: var(--border-radius);
            padding: 1rem 1rem 1.8rem 1rem;
            margin-top: 0.5rem;
            text-align: center;
            position: relative;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
        }
        
        .pricing-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px ${theme.colors.primary}30;
        }
        
        .pricing-card.popular {
            border-color: var(--primary);
            transform: scale(1.05);
            box-shadow: 0 15px 35px ${theme.colors.primary}50;
            margin-bottom: 1rem;
        }
        
        .popular-badge {
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: var(--background);
            padding: 0.5rem 1.2rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            box-shadow: 0 4px 15px ${theme.colors.primary}50;
            z-index: 10;
            white-space: nowrap;
        }
        
        .price {
            font-size: 2rem;
            font-weight: 800;
            color: var(--primary);
            margin: 1rem 0;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 1rem 0;
            text-align: left;
        }
        
        .feature-list li {
            padding: 0.4rem 0;
            border-bottom: 1px solid #333333;
            color: #a0a0a0;
            position: relative;
            padding-left: 1.2rem;
            font-size: 0.85rem;
        }
        
        .feature-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--primary);
            font-weight: bold;
        }
        
        .case-study {
            background: linear-gradient(135deg, var(--surface) 0%, ${theme.colors.background} 100%);
            color: var(--text);
            padding: 2rem;
            border-radius: 20px;
            margin: 1rem 0;
            box-shadow: var(--shadow);
            border: 2px solid var(--primary);
            position: relative;
            overflow: hidden;
        }
        
        .case-study::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.secondary}10 100%);
            pointer-events: none;
        }
        
        .case-study h3 {
            font-size: 1.6rem;
            margin-bottom: 1rem;
            font-weight: 700;
            color: var(--primary);
            position: relative;
            z-index: 2;
        }
        
        .case-study p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
            position: relative;
            z-index: 2;
        }
        
        .results-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .result-item {
            background: ${theme.colors.primary}20;
            padding: 1rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid ${theme.colors.primary}40;
            position: relative;
            z-index: 2;
            font-size: 0.9rem;
        }
        
        .values-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .value-badge {
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: var(--background);
            padding: 0.8rem;
            border-radius: 25px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 4px 15px ${theme.colors.primary}50;
            font-size: 0.9rem;
        }
        
        .contact-info {
            background: linear-gradient(135deg, var(--surface) 0%, ${theme.colors.background} 100%);
            border: 2px solid var(--border);
            border-radius: 15px;
            padding: 2rem;
            margin-top: 2rem;
            text-align: center;
        }
        
        .contact-card {
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: var(--background);
            padding: 1.5rem 2rem;
            border-radius: 12px;
            display: inline-block;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 8px 25px ${theme.colors.primary}50;
        }
        
        .stats-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin: 1rem 0;
            text-align: center;
        }
        
        .stat-card {
            background: linear-gradient(135deg, var(--surface) 0%, ${theme.colors.background} 100%);
            border: 2px solid var(--border);
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--primary);
            display: block;
            margin-bottom: 0.4rem;
        }
        
        .hero-image {
            width: 100%;
            height: 80px;
            background-size: cover;
            background-position: center;
            border-radius: 8px;
            margin-bottom: 0.6rem;
            flex-shrink: 0;
            border: 2px solid var(--border);
            position: relative;
            overflow: hidden;
        }
        
        .hero-image::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, ${theme.colors.primary}30 0%, ${theme.colors.secondary}20 100%);
            pointer-events: none;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page cover-page">
        <!-- Brand Elements -->
        <div class="logo-container">
            ${getLogoUrl() ? `<img src="${getLogoUrl()}" alt="${agencyConfig.name} Logo" class="logo-image" />` : `<div class="logo-text">${agencyConfig.name}</div>`}
        </div>
        <div class="cover-tagline">${agencyConfig.tagline}</div>
        
        <!-- Client Information -->
        <div class="client-info-cover">
            <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem;">Digital Transformation Proposal</h2>
            <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 1.5rem;">Elevate Your ${template.industry.charAt(0).toUpperCase() + template.industry.slice(1)} Business</p>
            <div style="border-top: 2px solid rgba(212, 175, 55, 0.3); padding-top: 1.5rem;">
                <div style="font-size: 1.6rem; font-weight: 600; margin-bottom: 0.5rem;">${clientData.clientName}</div>
                <div style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 0.5rem;">${clientData.businessName}</div>
                <div style="font-size: 1rem; opacity: 0.8;">${currentDate}</div>
            </div>
        </div>
    </div>

    <!-- Section 1: Who We Are -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">Who We Are - LoopXO</h1>
            <p class="page-subtitle">Your trusted partner in digital transformation</p>
        </div>
        
        ${getImageForSection('who-we-are') ? `<div class="hero-image" style="background-image: url('${getImageForSection('who-we-are')}');"></div>` : ''}
        
        <div class="section">
            <p style="font-size: 1.2rem; color: #a0a0a0; margin-bottom: 2rem; text-align: center;">
                Hello <strong style="color: #d4af37;">${clientData.clientName}</strong>! We've been making professional <strong style="color: #d4af37;">${template.industry}</strong> websites for years, helping businesses like <strong style="color: #d4af37;">${clientData.businessName}</strong> thrive in the digital world.
            </p>
            
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">🌐</div>
                    <h3>Web & Mobile Development</h3>
                    <p>Custom websites and mobile apps that convert visitors into customers</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">📅</div>
                    <h3>Booking Systems</h3>
                    <p>24/7 online booking that reduces no-shows and increases revenue</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">📈</div>
                    <h3>SEO & Marketing</h3>
                    <p>Get found by customers searching for your services online</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">📱</div>
                    <h3>Social Media Integration</h3>
                    <p>Connect all your social platforms for maximum online presence</p>
                </div>
            </div>
            
            <div class="values-grid">
                <div class="value-badge">Integrity</div>
                <div class="value-badge">Collaboration</div>
                <div class="value-badge">Reliability</div>
            </div>
            
            <div class="contact-info">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">Ready to Transform Your Business?</h3>
                <div class="contact-card">
                    📧 ${agencyConfig.email} | 📱 ${agencyConfig.phone} | 📍 ${agencyConfig.address}
                </div>
            </div>
        </div>
    </div>

    <!-- Section 2: What Salons Need Today -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">What ${template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}s Need Today</h1>
            <p class="page-subtitle">Understanding the challenges facing ${clientData.businessName}</p>
        </div>
        
        ${getImageForSection('industry-needs') ? `<div class="hero-image" style="background-image: url('${getImageForSection('industry-needs')}');"></div>` : ''}
        
        <div class="section">
            <div class="problem-grid">
                ${template.problems.map(problem => `
                    <div class="card">
                        <h3>${problem.title}</h3>
                        <p>${problem.description}</p>
                        <div class="statistic">${problem.statistic}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <div class="stat-card">
                    <span class="stat-number">92%</span>
                    <p>of customers research online before visiting a ${template.industry}</p>
                </div>
                <div class="stat-card">
                    <span class="stat-number">68%</span>
                    <p>of customers prefer businesses with online booking systems</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Section 3: How LoopXO Solves These Problems -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">How LoopXO Solves These Problems</h1>
            <p class="page-subtitle">Our proven solutions for ${clientData.businessName}</p>
        </div>
        
        ${getImageForSection('solutions') ? `<div class="hero-image" style="background-image: url('${getImageForSection('solutions')}');"></div>` : ''}
        
        <div class="section">
            <div class="solution-grid">
                ${template.solutions.map(solution => `
                    <div class="card">
                        <h3>${solution.title}</h3>
                        <p>${solution.description}</p>
                        <ul class="benefits-list">
                            ${solution.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <!-- Section 4: Sample Client Results -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">Sample Client Results</h1>
            <p class="page-subtitle">Real success stories from businesses like yours</p>
        </div>
        
        ${getImageForSection('results') ? `<div class="hero-image" style="background-image: url('${getImageForSection('results')}');"></div>` : ''}
        
        <div class="case-study">
            <h3>${template.caseStudy.title}</h3>
            <p>${template.caseStudy.description}</p>
            
            <div class="results-grid">
                ${template.caseStudy.results.map(result => `
                    <div class="result-item">
                        <strong>${result}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="stats-section">
            <div class="stat-card">
                <span class="stat-number">15→45</span>
                <p>Daily bookings increased after our solutions</p>
            </div>
            <div class="stat-card">
                <span class="stat-number">85%</span>
                <p>of bookings now come through online channels</p>
            </div>
        </div>
    </div>

    <!-- Section 5: Pricing -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">Investment Options</h1>
            <p class="page-subtitle">Choose the perfect package for ${clientData.businessName}</p>
        </div>
        
        ${getImageForSection('pricing') ? `<div class="hero-image" style="background-image: url('${getImageForSection('pricing')}');"></div>` : ''}
        
        <div class="section">
            <div class="pricing-grid">
                ${template.pricing.map(pkg => `
                    <div class="pricing-card ${pkg.popular ? 'popular' : ''}">
                        ${pkg.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                        <h3>${pkg.name}</h3>
                        <div class="price">${pkg.price}</div>
                        <ul class="feature-list">
                            ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <!-- Section 6: Why LoopXO -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">Why Choose LoopXO</h1>
            <p class="page-subtitle">What makes us different from other agencies</p>
        </div>
        
        ${getImageForSection('why-choose') ? `<div class="hero-image" style="background-image: url('${getImageForSection('why-choose')}');"></div>` : ''}
        
        <div class="section">
            <div class="solution-grid">
                <div class="card">
                    <h3>${template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}-Focused</h3>
                    <p>We specialize in ${template.industry} businesses and understand your unique challenges and opportunities.</p>
                </div>
                <div class="card">
                    <h3>Quick Launch</h3>
                    <p>Get your new website live in 2-4 weeks, not months. We move fast without compromising quality.</p>
                </div>
                <div class="card">
                    <h3>Local Support</h3>
                    <p>Based in Mumbai, we provide local support and understand the Indian market dynamics.</p>
                </div>
                <div class="card">
                    <h3>Results-Driven</h3>
                    <p>We don't just build websites, we build business growth. Every feature has a purpose.</p>
                </div>
                <div class="card">
                    <h3>Ongoing Partnership</h3>
                    <p>24/7 support, regular updates, and continuous optimization to keep you ahead of competition.</p>
                </div>
                <div class="card">
                    <h3>Latest Technology</h3>
                    <p>Modern, fast, secure websites built with cutting-edge technology that scales with your business.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Section 7: Next Steps -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">Let's Get Started</h1>
            <p class="page-subtitle">Ready to 3X your ${template.industry} bookings?</p>
        </div>
        
        ${getImageForSection('next-steps') ? `<div class="hero-image" style="background-image: url('${getImageForSection('next-steps')}');"></div>` : ''}
        
        <div class="section">
            <div class="card" style="text-align: center; padding: 2rem;">
                <h3 style="font-size: 1.8rem; margin-bottom: 1rem;">Ready to Transform ${clientData.businessName}?</h3>
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
                    Hi ${clientData.clientName}, contact us today for a FREE consultation and see how we can help ${clientData.businessName} dominate the digital space.
                </p>
                
                <div class="contact-card" style="margin: 1rem 0;">
                    📧 ${agencyConfig.email} | 📱 ${agencyConfig.phone}
                </div>
                
                <div class="values-grid" style="margin-top: 1rem;">
                    <div class="value-badge">24/7 Customer Support Available</div>
                    <div class="value-badge">FREE Initial Consultation</div>
                    <div class="value-badge">Located in Mumbai</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Section 8: Endnotes -->
    <div class="page content-page">
        <div class="page-header">
            <h1 class="page-title">Terms & Information</h1>
            <p class="page-subtitle">Important details about our services</p>
        </div>
        
        <div class="section">
            <div class="card">
                <h3>Project Timeline</h3>
                <p>Typical project completion: 2-4 weeks from contract signing. Timeline may vary based on package selected and client feedback cycles.</p>
            </div>
            
            <div class="card">
                <h3>Payment Terms</h3>
                <p>50% advance payment to start the project, 50% on completion. We accept bank transfers, UPI, and cheques.</p>
            </div>
            
            <div class="card">
                <h3>Support & Maintenance</h3>
                <p>All packages include initial support period as mentioned. Extended support and maintenance packages available separately.</p>
            </div>
            
            <div class="card">
                <h3>Intellectual Property</h3>
                <p>Upon full payment, all rights to the website and content are transferred to the client. Source code ownership included.</p>
            </div>
            
            <div class="contact-info" style="margin-top: 1.5rem;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">${agencyConfig.name}</h3>
                <p>📧 ${agencyConfig.email}</p>
                <p>📱 ${agencyConfig.phone}</p>
                <p>📍 ${agencyConfig.address}</p>
                ${agencyConfig.website ? `<p>🌐 ${agencyConfig.website}</p>` : ''}
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
                    This proposal is valid for 30 days from the date of issue.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `
}

export function generateFileName(clientData: ClientFormData): string {
  const date = new Date().toISOString().split('T')[0]
  const businessName = clientData.businessName.replace(/[^a-zA-Z0-9]/g, '_')
  return `LoopXO_Proposal_${businessName}_${date}.pdf`
}

// Legacy function for compatibility
export function generateHTMLTemplate(template: string, data: ClientFormData): string {
  const baseStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Arial', sans-serif; }
      
      /* LoopXO Dark Luxe Styling */
      .cover-page {
        height: 100vh;
        background: var(--gradient);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 2px solid var(--primary);
      }
      
      .geometric-pattern {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" patternUnits="userSpaceOnUse" width="2" height="2"><circle cx="1" cy="1" r="0.5" fill="%23ffffff" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
      }
      
      .business-silhouette {
        position: absolute;
        bottom: 10%;
        left: 10%;
        width: 200px;
        height: 300px;
        background: rgba(0,0,0,0.8);
        clip-path: polygon(30% 0%, 70% 0%, 70% 100%, 30% 100%);
      }
      
      .company-name {
        position: absolute;
        right: 15%;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
        font-size: 4rem;
        font-weight: 900;
        color: #1a1a1a;
        letter-spacing: 0.2em;
      }
      
      .tagline {
        position: absolute;
        right: 8%;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
        font-size: 1.2rem;
        color: #1a1a1a;
        margin-top: 80px;
      }
      
      /* Content Pages */
      .content-page {
        min-height: 100vh;
        padding: 60px;
        background: var(--gradient);
        color: var(--text);
        page-break-before: always;
        border: 1px solid var(--border);
      }
      
      .page-title {
        font-size: 3rem;
        font-weight: 900;
        margin-bottom: 40px;
        background: linear-gradient(45deg, var(--primary), var(--accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .problem-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        margin: 40px 0;
      }
      
      .problem-card {
        background: linear-gradient(135deg, var(--surface) 0%, var(--background) 100%);
        border-radius: 20px;
        padding: 30px;
        border: 3px solid var(--primary);
        box-shadow: var(--shadow);
      }
      
      .problem-card h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: #d4af37;
      }
      
      .solution-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
        margin: 40px 0;
      }
      
      .solution-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border-radius: 15px;
        padding: 25px;
        color: #e2e8f0;
        border: 2px solid #d4af37;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }
      
      .pricing-section {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        margin: 50px 0;
      }
      
      .pricing-card {
        flex: 1;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border-radius: 20px;
        padding: 40px 30px;
        text-align: center;
        border: 2px solid #333333;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }
      
      .pricing-card.popular {
        border-color: #d4af37;
        transform: scale(1.05);
        box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3);
      }
      
      .price {
        font-size: 2.5rem;
        font-weight: 900;
        color: #d4af37;
        margin: 20px 0;
      }
      
      .stats-section {
        display: flex;
        justify-content: space-around;
        margin: 50px 0;
      }
      
      .stat-item {
        text-align: center;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border-radius: 15px;
        padding: 30px 20px;
        min-width: 200px;
        border: 2px solid #333333;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }
      
      .stat-number {
        font-size: 3rem;
        font-weight: 900;
        color: #d4af37;
        display: block;
      }
      
      .contact-section {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border-radius: 20px;
        padding: 40px;
        margin-top: 50px;
        text-align: center;
        border: 2px solid #333333;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }
      
      .cta-button {
        background: linear-gradient(45deg, #d4af37, #ffd700);
        color: #0a0a0a;
        padding: 15px 40px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 1.2rem;
        border: none;
        margin: 20px 10px;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
      }
    </style>
  `
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      ${baseStyles}
    </head>
    <body>
      ${generateCoverPage(data)}
      ${generateProblemsPageLegacy(template, data)}
    </body>
    </html>
  `
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateCoverPage(_data: ClientFormData): string {
  return `
    <div class="cover-page">
      <div class="geometric-pattern"></div>
      <div class="business-silhouette"></div>
      <div class="company-name">LoopXO</div>
      <div class="tagline">A Digital Agency</div>
    </div>
  `
}

function generateProblemsPageLegacy(_template: string, data: ClientFormData): string {
  const problems = getProblemsForIndustry(data.industry)
  
  return `
    <div class="content-page">
      <h1 class="page-title">What ${data.businessName} Needs Today</h1>
      
      <div class="problem-grid">
        ${problems.map((problem: {title: string, description: string}) => `
          <div class="problem-card">
            <h3>${problem.title}</h3>
            <p>${problem.description}</p>
          </div>
        `).join('')}
      </div>
      
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-number">92%</span>
          <p>of people trust online reviews as much as personal recommendations</p>
        </div>
        <div class="stat-item">
          <span class="stat-number">68%</span>
          <p>of customers will choose a business with online booking</p>
        </div>
      </div>
    </div>
  `
}

// Continue with more template functions...
function getProblemsForIndustry(industry: string): Array<{title: string, description: string}> {
  const problemMap = {
    salon: [
      {
        title: 'Mobile-First Customers',
        description: 'Modern, responsive websites that work perfectly on all devices'
      },
      {
        title: 'Instant Booking Expectations', 
        description: 'Customers want to book appointments 24/7, not just during business hours. Missing calls = lost revenue.'
      },
      {
        title: 'Local Competition',
        description: 'Every salon in your area is competing for the same customers. You need to stand out online.'
      },
      {
        title: 'Marketing Costs',
        description: 'Traditional advertising is expensive and hard to track. Digital marketing gives better ROI.'
      }
    ],
    // Add more industries...
  }
  
  return problemMap[industry as keyof typeof problemMap] || problemMap.salon
}

export async function generateContractPDF(
  contractData: ContractPDFData,
  options: PDFGenerationOptions = defaultPDFOptions
): Promise<Buffer> {
  let browser
  
  try {
    console.log('Launching browser for contract PDF generation...')
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    console.log('Browser page created')
    
    const html = generateContractHTML(contractData)
    console.log('Contract HTML generated, length:', html.length)
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    console.log('HTML content set on page')
    
    const pdfBuffer = await page.pdf(options)
    console.log('PDF buffer generated, size:', pdfBuffer.length)
    
    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error('Error in generateContractPDF:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
      console.log('Browser closed')
    }
  }
}

function generateContractHTML(contractData: ContractPDFData): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contractData.title}</title>
    <style>
        @page {
            margin: 0.75in;
            size: A4;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            background: white;
        }
        
        .contract-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #333;
        }
        
        .logo-section {
            margin-bottom: 1rem;
        }
        
        .logo-section img {
            max-height: 80px;
            max-width: 200px;
        }
        
        .contract-title {
            font-size: 24pt;
            font-weight: bold;
            margin: 1rem 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .contract-date {
            font-size: 14pt;
            color: #666;
            margin-bottom: 1rem;
        }
        
        .contract-content {
            margin: 2rem 0;
            white-space: pre-wrap;
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.8;
        }
        
        .signature-section {
            margin-top: 3rem;
            page-break-inside: avoid;
        }
        
        .signature-block {
            margin: 2rem 0;
            border-top: 1px solid #333;
            padding-top: 0.5rem;
        }
        
        .signature-line {
            border-bottom: 1px solid #000;
            min-height: 40px;
            margin: 0.5rem 0;
            display: inline-block;
            width: 300px;
        }
        
        .footer {
            position: fixed;
            bottom: 0.5in;
            left: 0.75in;
            right: 0.75in;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 0.5rem;
        }
        
        .page-number {
            position: fixed;
            bottom: 0.25in;
            right: 0.75in;
            font-size: 10pt;
            color: #666;
        }
        
        h1, h2, h3 {
            margin: 1.5rem 0 1rem 0;
            color: #000;
        }
        
        h1 {
            font-size: 18pt;
            border-bottom: 1px solid #666;
            padding-bottom: 0.5rem;
        }
        
        h2 {
            font-size: 16pt;
        }
        
        h3 {
            font-size: 14pt;
        }
        
        p {
            margin: 1rem 0;
            text-align: justify;
        }
        
        .clause-number {
            font-weight: bold;
            margin-right: 0.5rem;
        }
        
        .legal-text {
            text-indent: 1rem;
        }
        
        @media print {
            .no-print {
                display: none;
            }
            
            body {
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="contract-header">
        ${contractData.logo ? `
            <div class="logo-section">
                <img src="${contractData.logo}" alt="Company Logo" />
            </div>
        ` : ''}
        <h1 class="contract-title">${contractData.title}</h1>
        <div class="contract-date">Generated on ${currentDate}</div>
    </div>
    
    <div class="contract-content">
${contractData.content}
    </div>
    
    <div class="footer">
        This document was generated electronically and is legally binding upon execution by all parties.
    </div>
</body>
</html>
  `
}

export async function generateInvoicePDF(
  invoiceData: InvoicePDFData,
  options: PDFGenerationOptions = defaultPDFOptions
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    const html = generateInvoiceHTML(invoiceData)
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: options.format as 'A4' | 'Letter',
      margin: options.margin,
      printBackground: options.printBackground,
      preferCSSPageSize: options.preferCSSPageSize
    })
    
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

function generateInvoiceHTML(invoiceData: InvoicePDFData): string {
  const { invoice, logo, theme = 'professional' } = invoiceData
  const currentDate = new Date().toLocaleDateString()
  const selectedTheme = invoiceThemes.find(t => t.id === theme) || invoiceThemes[0]
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${invoice.invoiceNumber || 'DRAFT'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: ${selectedTheme.primaryColor};
            font-size: 11pt;
        }
        
        .invoice-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 3px solid ${selectedTheme.accentColor};
        }
        
        .logo-section img {
            max-height: 60px;
            width: auto;
            margin-bottom: 1rem;
        }
        
        .invoice-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: ${selectedTheme.accentColor};
            margin-bottom: 0.5rem;
        }
        
        .invoice-number {
            font-size: 1.2rem;
            font-weight: 600;
            color: ${selectedTheme.primaryColor};
            margin-bottom: 0.5rem;
        }
        
        .invoice-meta {
            text-align: right;
            font-size: 0.95rem;
        }
        
        .invoice-meta div {
            margin-bottom: 0.3rem;
        }
        
        .invoice-meta strong {
            color: ${selectedTheme.accentColor};
        }
        
        .parties-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .party-info h3 {
            font-size: 1.1rem;
            font-weight: 700;
            color: ${selectedTheme.accentColor};
            margin-bottom: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .party-details {
            line-height: 1.5;
        }
        
        .party-details .company-name {
            font-weight: 600;
            font-size: 1.05rem;
            margin-bottom: 0.3rem;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }
        
        .items-table th {
            background-color: ${selectedTheme.accentColor};
            color: white;
            padding: 0.8rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .items-table th:nth-child(2),
        .items-table th:nth-child(3),
        .items-table th:nth-child(4) {
            text-align: right;
        }
        
        .items-table td {
            padding: 0.8rem;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .items-table td:nth-child(2),
        .items-table td:nth-child(3),
        .items-table td:nth-child(4) {
            text-align: right;
        }
        
        .items-table tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2rem;
        }
        
        .totals-table {
            width: 300px;
            font-size: 0.95rem;
        }
        
        .totals-table tr {
            border-bottom: 1px solid #e5e5e5;
        }
        
        .totals-table td {
            padding: 0.5rem 0;
        }
        
        .totals-table td:last-child {
            text-align: right;
            font-weight: 500;
        }
        
        .total-row {
            border-top: 2px solid ${selectedTheme.accentColor} !important;
            font-size: 1.1rem;
            font-weight: 700;
            color: ${selectedTheme.accentColor};
        }
        
        .total-row td {
            padding: 0.8rem 0 !important;
        }
        
        .payment-terms,
        .payment-methods,
        .notes-section {
            margin-bottom: 1.5rem;
        }
        
        .payment-terms h4,
        .payment-methods h4,
        .notes-section h4 {
            font-size: 1rem;
            font-weight: 600;
            color: ${selectedTheme.accentColor};
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .payment-terms p,
        .payment-methods p,
        .notes-section p {
            line-height: 1.5;
            color: ${selectedTheme.primaryColor};
        }
        
        .footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 2px solid ${selectedTheme.accentColor};
            text-align: center;
            font-size: 0.85rem;
            color: #666;
            font-style: italic;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-draft {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .status-sent {
            background-color: #dbeafe;
            color: #1e40af;
        }
        
        .status-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .status-overdue {
            background-color: #fee2e2;
            color: #991b1b;
        }
        
        @media print {
            .no-print {
                display: none;
            }
            
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .invoice-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div>
                ${logo ? `
                    <div class="logo-section">
                        <img src="${logo}" alt="Company Logo" />
                    </div>
                ` : ''}
                <h1 class="invoice-title">INVOICE</h1>
                <div class="invoice-number">#${invoice.invoiceNumber || 'DRAFT'}</div>
                ${invoice.status ? `
                    <span class="status-badge status-${invoice.status}">${invoice.status}</span>
                ` : ''}
            </div>
            <div class="invoice-meta">
                <div><strong>Date:</strong> ${invoice.date || currentDate}</div>
                <div><strong>Due Date:</strong> ${invoice.dueDate || 'Not specified'}</div>
                <div><strong>Currency:</strong> ${invoice.currency || 'USD'}</div>
            </div>
        </div>
        
        <div class="parties-section">
            <div class="party-info">
                <h3>From:</h3>
                <div class="party-details">
                    ${invoice.company?.name ? `<div class="company-name">${invoice.company.name}</div>` : ''}
                    ${invoice.company?.address ? `<div>${invoice.company.address.replace(/\n/g, '<br>')}</div>` : ''}
                    ${invoice.company?.email ? `<div>${invoice.company.email}</div>` : ''}
                    ${invoice.company?.phone ? `<div>${invoice.company.phone}</div>` : ''}
                    ${invoice.company?.website ? `<div>${invoice.company.website}</div>` : ''}
                    ${invoice.company?.taxNumber ? `<div>Tax ID: ${invoice.company.taxNumber}</div>` : ''}
                </div>
            </div>
            <div class="party-info">
                <h3>To:</h3>
                <div class="party-details">
                    ${invoice.client?.name ? `<div class="company-name">${invoice.client.name}</div>` : ''}
                    ${invoice.client?.company ? `<div>${invoice.client.company}</div>` : ''}
                    ${invoice.client?.address ? `<div>${invoice.client.address.replace(/\n/g, '<br>')}</div>` : ''}
                    ${invoice.client?.email ? `<div>${invoice.client.email}</div>` : ''}
                    ${invoice.client?.phone ? `<div>${invoice.client.phone}</div>` : ''}
                </div>
            </div>
        </div>
        
        ${invoice.items && invoice.items.length > 0 ? `
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.description || 'No description'}</td>
                            <td>${item.quantity || 0}</td>
                            <td>${formatCurrency(item.rate || 0, invoice.currency || 'USD')}</td>
                            <td>${formatCurrency(item.amount || 0, invoice.currency || 'USD')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : ''}
        
        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td>Subtotal:</td>
                    <td>${formatCurrency(invoice.subtotal || 0, invoice.currency || 'USD')}</td>
                </tr>
                ${invoice.taxes?.map(tax => `
                    <tr>
                        <td>${tax.name} (${tax.rate}%):</td>
                        <td>${formatCurrency(tax.amount, invoice.currency || 'USD')}</td>
                    </tr>
                `).join('') || ''}
                ${invoice.discount ? `
                    <tr style="color: #16a34a;">
                        <td>Discount:</td>
                        <td>-${formatCurrency(invoice.discount.amount, invoice.currency || 'USD')}</td>
                    </tr>
                ` : ''}
                <tr class="total-row">
                    <td><strong>TOTAL:</strong></td>
                    <td><strong>${formatCurrency(invoice.total || 0, invoice.currency || 'USD')}</strong></td>
                </tr>
            </table>
        </div>
        
        ${invoice.paymentTerms?.notes ? `
            <div class="payment-terms">
                <h4>Payment Terms</h4>
                <p>${invoice.paymentTerms.notes}</p>
            </div>
        ` : ''}
        
        ${invoice.paymentTerms?.paymentMethods && invoice.paymentTerms.paymentMethods.length > 0 ? `
            <div class="payment-methods">
                <h4>Payment Methods</h4>
                <p>${invoice.paymentTerms.paymentMethods.join(', ')}</p>
            </div>
        ` : ''}
        
        ${invoice.paymentTerms?.bankDetails ? `
            <div class="payment-methods">
                <h4>Bank Details</h4>
                <p>
                    Bank: ${invoice.paymentTerms.bankDetails.bankName}<br>
                    Account: ${invoice.paymentTerms.bankDetails.accountNumber}<br>
                    Routing: ${invoice.paymentTerms.bankDetails.routingNumber}
                    ${invoice.paymentTerms.bankDetails.swiftCode ? `<br>SWIFT: ${invoice.paymentTerms.bankDetails.swiftCode}` : ''}
                </p>
            </div>
        ` : ''}
        
        ${invoice.notes ? `
            <div class="notes-section">
                <h4>Notes</h4>
                <p>${invoice.notes.replace(/\n/g, '<br>')}</p>
            </div>
        ` : ''}
        
        <div class="footer">
            This invoice was generated electronically on ${currentDate} and is valid without signature.
        </div>
    </div>
</body>
</html>
  `
}