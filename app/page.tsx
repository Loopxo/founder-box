
"use client"

import { useState, useCallback } from 'react'
import PitchForm from '@/components/PitchForm'
import ProposalPreview from '@/components/ProposalPreview'
import Navigation from '@/components/Navigation'
import { ClientFormData } from '@/lib/schemas'

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<Partial<ClientFormData>>({})

  const handleFormChange = useCallback((data: Partial<ClientFormData>) => {
    setFormData(data)
  }, [])

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to generate PDF'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Create a blob from the response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `LoopXO_Proposal_${data.businessName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Clean up
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent mb-4">
            LoopXO Proposal Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            Create professional, customized 8-section proposals in minutes. Industry-specific content with beautiful design.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {[
              "🏪 Salon & Beauty", "🏗️ Construction", "👨‍⚕️ Doctors & Clinics", 
              "💪 Gym/Yoga", "⚖️ Lawyers/CAs", "🏠 Real Estate", 
              "💎 Jewellery", "💒 Wedding Services"
            ].map((industry) => (
              <span key={industry} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {industry}
              </span>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Column */}
          <div className="form-container p-8">
            <PitchForm onSubmit={handleFormSubmit} onFormChange={handleFormChange} />
          </div>
          
          {/* Preview Column */}
          <div className="hidden xl:block">
            <div className="sticky top-8">
              <ProposalPreview formData={formData} />
            </div>
          </div>
        </div>
        
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generating Your Proposal
                </h3>
                <p className="text-gray-600">
                  Please wait while we create your professional proposal...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
