"use client"

import { AgencyConfig } from '@/lib/themes'

interface AgencyConfigProps {
  config: AgencyConfig
  onConfigChange: (config: AgencyConfig) => void
}

export default function AgencyConfigForm({ config, onConfigChange }: AgencyConfigProps) {
  const updateConfig = (field: keyof AgencyConfig, value: string) => {
    onConfigChange({
      ...config,
      [field]: value
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-yellow-300 mb-4">Agency Configuration</h3>
        <p className="text-sm text-gray-400 mb-4">
          Customize your agency details that will appear in the proposal
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agency Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Agency Name *
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            placeholder="Your Agency Name"
            required
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={config.tagline || ''}
            onChange={(e) => updateConfig('tagline', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            placeholder="A Digital Agency"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => updateConfig('email', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            placeholder="hello@youragency.com"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={config.phone}
            onChange={(e) => updateConfig('phone', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={config.website || ''}
            onChange={(e) => updateConfig('website', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            placeholder="https://youragency.com"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={config.logo || ''}
            onChange={(e) => updateConfig('logo', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            placeholder="https://youragency.com/logo.png"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a direct link to your logo image (PNG/JPG)
          </p>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Address *
        </label>
        <textarea
          value={config.address}
          onChange={(e) => updateConfig('address', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          placeholder="123 Business Street, City, State, Country"
          required
        />
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
        <h4 className="text-sm font-medium text-yellow-300 mb-3">Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-400 w-20">Name:</span>
            <span className="text-white">{config.name}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 w-20">Email:</span>
            <span className="text-white">{config.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 w-20">Phone:</span>
            <span className="text-white">{config.phone}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 w-20">Address:</span>
            <span className="text-white">{config.address}</span>
          </div>
          {config.website && (
            <div className="flex items-center">
              <span className="text-gray-400 w-20">Website:</span>
              <span className="text-white">{config.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

