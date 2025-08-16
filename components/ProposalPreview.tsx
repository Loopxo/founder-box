"use client"

import { ClientFormData } from "@/lib/schemas"
import { FileText, Building, Mail, Phone, Clock, DollarSign } from "lucide-react"

interface ProposalPreviewProps {
  formData: Partial<ClientFormData>
}

export default function ProposalPreview({ formData }: ProposalPreviewProps) {
  const {
    clientName = "Client Name",
    businessName = "Business Name",
    clientEmail = "email@example.com",
    clientPhone = "Phone Number",
    industry = "Industry",
    services = [],
    budget = "Budget Range",
    timeline = "Timeline",
    currentWebsite,
    specialRequirements
  } = formData

  return (
    <div className="preview-container p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Proposal Preview</h2>
        </div>
        <p className="text-sm text-gray-600">
          See how your proposal will look as you fill out the form
        </p>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-blue-800 text-white p-6 rounded-lg mb-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">LoopXO</h1>
          <p className="text-lg">Digital Marketing Proposal</p>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="h-5 w-5 text-red-600" />
          Client Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Client Name</label>
            <p className="text-gray-900 font-medium">{clientName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Business Name</label>
            <p className="text-gray-900 font-medium">{businessName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">{clientEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">{clientPhone}</span>
          </div>
        </div>
        
        {currentWebsite && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">Current Website</label>
            <p className="text-blue-600 underline">{currentWebsite}</p>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">Industry</label>
            <p className="text-gray-900 font-medium capitalize">{industry}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-600">Timeline</label>
              <p className="text-gray-900">{timeline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-600">Budget Range</label>
              <p className="text-gray-900">{budget}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Requested Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-gray-900">{service}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Requirements */}
      {specialRequirements && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requirements</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{specialRequirements}</p>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 text-sm mb-2">
          This proposal is generated automatically based on your requirements
        </p>
        <p className="text-gray-500 text-xs">
          LoopXO Digital Marketing Solutions
        </p>
      </div>
    </div>
  )
}