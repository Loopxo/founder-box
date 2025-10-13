"use client"

import { useState } from 'react'
import PitchForm from '@/components/PitchForm'
import DashboardLayout from '@/components/DashboardLayout'
import { ToastProvider, useToast } from '@/components/ui/toast'
import type { ClientFormData } from '@/lib/schemas'

function ProposalPageContent() {
  const { addToast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (data: ClientFormData) => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const fileName = `${data.agencyConfig?.name || data.businessName || 'Proposal'}_${data.businessName}_${new Date().toISOString().split('T')[0]}.pdf`
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        addToast({
          type: 'success',
          title: 'Proposal Generated Successfully!',
          message: `Your proposal "${fileName}" has been downloaded.`,
          duration: 5000,
        })
      } else {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to generate PDF')
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      addToast({
        type: 'error',
        title: 'Failed to Generate Proposal',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 7000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Proposal Launcher</h1>
          <p className="text-slate-300">
            Create stunning, professional proposals with customizable themes and branding
          </p>
        </div>
        <PitchForm onSubmit={handleSubmit} isGenerating={isGenerating} />
      </div>
    </DashboardLayout>
  )
}

export default function ProposalPage() {
  return (
    <ToastProvider>
      <ProposalPageContent />
    </ToastProvider>
  )
}
