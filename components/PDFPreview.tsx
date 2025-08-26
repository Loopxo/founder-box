"use client"

import { useState } from 'react'
import { ThemeConfig, AgencyConfig } from '@/lib/themes'
import { X, ChevronLeft, ChevronRight, Settings, Image as ImageIcon, Type } from 'lucide-react'

interface PDFPreviewProps {
  clientData: Record<string, unknown>
  template: Record<string, unknown>
  theme: ThemeConfig
  agencyConfig: AgencyConfig
  isOpen: boolean
  onClose: () => void
  onGenerate: (customImages: Record<string, string>, customLogo: string, customTexts: Record<string, string>, imageHeights: Record<string, number>) => void
}

export default function PDFPreview({ 
  clientData, 
  template, 
  theme, 
  agencyConfig, 
  isOpen, 
  onClose, 
  onGenerate 
}: PDFPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [customImages, setCustomImages] = useState<{[key: string]: string}>({})
  const [customLogo] = useState('')
  const [customTexts, setCustomTexts] = useState<{[key: string]: string}>({})
  const [imageHeights, setImageHeights] = useState<{[key: string]: number}>({})
  const [showImageEditor, setShowImageEditor] = useState<string | null>(null)
  const [showTextEditor, setShowTextEditor] = useState<string | null>(null)
  const [showImageSettings, setShowImageSettings] = useState<string | null>(null)

  // Default images for each section
  const defaultImages = {
    'who-we-are': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    'industry-needs': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    'solutions': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    'results': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    'pricing': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    'why-loopxo': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    'next-steps': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    'endnotes': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop'
  }

  // Helper function to convert template sections to text
  const getTemplateText = (section: string): string => {
    if (!template) return 'Content not available...'
    
    switch (section) {
      case 'who-we-are':
        return `${agencyConfig.name} is a leading digital agency specializing in helping ${clientData?.industry || 'businesses'} grow their online presence. We combine cutting-edge technology with proven marketing strategies to deliver exceptional results.`
      
      case 'industry-needs':
        if (template.problems && Array.isArray(template.problems)) {
          return template.problems.map((problem: Record<string, string>) => 
            `${problem.title}: ${problem.description}`
          ).join('\n\n')
        }
        return 'Industry needs analysis...'
      
      case 'solutions':
        if (template.solutions && Array.isArray(template.solutions)) {
          return template.solutions.map((solution: Record<string, unknown>) => 
            `${solution.title}: ${solution.description}\nBenefits: ${Array.isArray(solution.benefits) ? solution.benefits.join(', ') : ''}`
          ).join('\n\n')
        }
        return 'Our solutions...'
      
      case 'results':
        if (template.caseStudy) {
          return `${(template.caseStudy as any).title}\n${(template.caseStudy as any).description}\nResults: ${Array.isArray((template.caseStudy as any).results) ? (template.caseStudy as any).results.join(', ') : ''}`
        }
        return 'Client results and case studies...'
      
      case 'pricing':
        if (template.pricing && Array.isArray(template.pricing)) {
          return template.pricing.map((pkg: Record<string, unknown>) => 
            `${pkg.name} - ${pkg.price}\nFeatures: ${Array.isArray(pkg.features) ? pkg.features.join(', ') : ''}`
          ).join('\n\n')
        }
        return 'Pricing packages...'
      
      case 'why-loopxo':
        return `Why choose ${agencyConfig.name}?\n\n• Proven track record with ${clientData?.industry || 'businesses'}\n• Custom solutions tailored to your needs\n• Ongoing support and optimization\n• Transparent pricing and communication`
      
      case 'next-steps':
        return 'Next Steps:\n\n1. Schedule a consultation call\n2. Review proposal and ask questions\n3. Sign agreement and begin project\n4. Regular updates and progress reports'
      
      case 'endnotes':
        return 'Terms & Information:\n\n• Proposal valid for 30 days\n• Payment terms: 50% upfront, 50% upon completion\n• Project timeline: 3-6 weeks\n• Includes 3 months of support'
      
      default:
        return 'Content not available...'
    }
  }

  // Default texts for each section
  const defaultTexts = {
    'who-we-are': getTemplateText('who-we-are'),
    'industry-needs': getTemplateText('industry-needs'),
    'solutions': getTemplateText('solutions'),
    'results': getTemplateText('results'),
    'pricing': getTemplateText('pricing'),
    'why-loopxo': getTemplateText('why-loopxo'),
    'next-steps': getTemplateText('next-steps'),
    'endnotes': getTemplateText('endnotes')
  }

  // Default image heights
  const defaultImageHeights = {
    'who-we-are': 300,
    'industry-needs': 250,
    'solutions': 280,
    'results': 320,
    'pricing': 200,
    'why-loopxo': 300,
    'next-steps': 250,
    'endnotes': 200
  }

  const getImageForSection = (section: string) => {
    return customImages[section] || defaultImages[section as keyof typeof defaultImages] || ''
  }

  const getTextForSection = (section: string) => {
    return customTexts[section] || defaultTexts[section as keyof typeof defaultTexts] || 'Content not available...'
  }

  const getImageHeight = (section: string) => {
    return imageHeights[section] || defaultImageHeights[section as keyof typeof defaultImageHeights] || 300
  }

  const handleImageUpload = (section: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setCustomImages(prev => ({
        ...prev,
        [section]: e.target?.result as string
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleTextChange = (section: string, text: string) => {
    setCustomTexts(prev => ({
      ...prev,
      [section]: text
    }))
  }

  const handleImageHeightChange = (section: string, height: number) => {
    setImageHeights(prev => ({
      ...prev,
      [section]: height
    }))
  }

  const renderCoverPage = () => (
    <div 
      className="bg-white rounded-lg shadow-lg p-8 mb-6"
      style={{
        background: theme.styles.gradient,
        color: theme.colors.text
      }}
    >
      <div className="text-center">
        <div className="mb-8">
          {customLogo || agencyConfig.logo ? (
            <img 
              src={customLogo || agencyConfig.logo} 
              alt={agencyConfig.name}
              className="h-16 mx-auto mb-4"
            />
          ) : (
            <div 
              className="text-3xl font-bold mb-4"
              style={{ color: theme.colors.primary }}
            >
              {agencyConfig.name}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2">Professional Proposal</h1>
          <p className="text-xl mb-8">For {(clientData as any)?.businessName || 'Your Business'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">Client Information</h3>
            <p>Business: {(clientData as any)?.businessName || 'N/A'}</p>
            <p>Contact: {(clientData as any)?.clientName || 'N/A'}</p>
            <p>Industry: {(clientData as any)?.industry || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Project Details</h3>
            <p>Budget: {(clientData as any)?.budget || 'N/A'}</p>
            <p>Timeline: {(clientData as any)?.timeline || 'N/A'}</p>
            <p>Services: {Array.isArray((clientData as any)?.services) ? (clientData as any).services.length : 0} selected</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContentPage = (section: string, title: string, content: string) => (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-2xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          {title}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTextEditor(section)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Edit text"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowImageEditor(section)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Edit image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowImageSettings(section)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Image settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <img 
          src={getImageForSection(section)}
          alt={title}
          className="w-full rounded-lg"
          style={{ height: `${getImageHeight(section)}px`, objectFit: 'cover' }}
        />
      </div>
      
      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )

  const renderWhoWeAre = () => renderContentPage(
    'who-we-are',
    `Who We Are - ${agencyConfig.name}`,
    getTextForSection('who-we-are')
  )

  const renderIndustryNeeds = () => renderContentPage(
    'industry-needs',
    `What ${(clientData as any)?.industry ? (clientData as any).industry.charAt(0).toUpperCase() + (clientData as any).industry.slice(1) : 'Business'}s Need Today`,
    getTextForSection('industry-needs')
  )

  const renderSolutions = () => renderContentPage(
    'solutions',
    `How ${agencyConfig.name} Solves These Problems`,
    getTextForSection('solutions')
  )

  const renderResults = () => renderContentPage(
    'results',
    'Sample Client Results',
    getTextForSection('results')
  )

  const renderPricing = () => renderContentPage(
    'pricing',
    'Investment Options',
    getTextForSection('pricing')
  )

  const renderWhyChooseUs = () => renderContentPage(
    'why-loopxo',
    `Why Choose ${agencyConfig.name}`,
    getTextForSection('why-loopxo')
  )

  const renderNextSteps = () => renderContentPage(
    'next-steps',
    'Next Steps',
    getTextForSection('next-steps')
  )

  const renderEndnotes = () => renderContentPage(
    'endnotes',
    'Terms & Information',
    getTextForSection('endnotes')
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-lg p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Proposal Preview</h2>
            <p className="text-gray-600">Theme: {theme.name} • Customize your proposal</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of 9
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(9, currentPage + 1))}
                disabled={currentPage === 9}
                className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value={1}>Cover Page</option>
              <option value={2}>Who We Are</option>
              <option value={3}>Industry Needs</option>
              <option value={4}>Solutions</option>
              <option value={5}>Results</option>
              <option value={6}>Pricing</option>
              <option value={7}>Why Choose Us</option>
              <option value={8}>Next Steps</option>
              <option value={9}>Endnotes</option>
            </select>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === 1 && renderCoverPage()}
          {currentPage === 2 && renderWhoWeAre()}
          {currentPage === 3 && renderIndustryNeeds()}
          {currentPage === 4 && renderSolutions()}
          {currentPage === 5 && renderResults()}
          {currentPage === 6 && renderPricing()}
          {currentPage === 7 && renderWhyChooseUs()}
          {currentPage === 8 && renderNextSteps()}
          {currentPage === 9 && renderEndnotes()}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-lg p-6 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Customizations: {Object.keys(customImages).length + Object.keys(customTexts).length}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onGenerate(customImages, customLogo, customTexts, imageHeights)}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>

        {/* Image Editor Modal */}
        {showImageEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Image</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Custom Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(showImageEditor, file)
                    }}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => {
                    setCustomImages(prev => {
                      const newImages = { ...prev }
                      delete newImages[showImageEditor]
                      return newImages
                    })
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Use Default Image
                </button>
                
                {/* Done Button */}
                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowImageEditor(null)}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text Editor Modal */}
        {showTextEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Text</h3>
              <textarea
                value={getTextForSection(showTextEditor)}
                onChange={(e) => handleTextChange(showTextEditor, e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Enter your custom text..."
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleTextChange(showTextEditor, defaultTexts[showTextEditor as keyof typeof defaultTexts] || '')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Use Default Text
                </button>
                
                {/* Done Button */}
                <div className="flex-1">
                  <button
                    onClick={() => setShowTextEditor(null)}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Settings Modal */}
        {showImageSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Height: {getImageHeight(showImageSettings)}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    value={getImageHeight(showImageSettings)}
                    onChange={(e) => handleImageHeightChange(showImageSettings, Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => handleImageHeightChange(showImageSettings, defaultImageHeights[showImageSettings as keyof typeof defaultImageHeights] || 300)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Use Default Height
                </button>
                
                {/* Done Button */}
                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowImageSettings(null)}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
