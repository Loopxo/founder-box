"use client"

import { AgencyConfig } from '@/lib/themes'
import { inputClasses, labelClasses } from '@/lib/design-system'
import { Building, Mail, Phone, Globe, MapPin, Image as ImageIcon } from 'lucide-react'

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
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Agency Configuration
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Customize your agency details that will appear in the proposal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agency Name */}
        <div>
          <label className={labelClasses.required}>
            <Building className="w-4 h-4 inline mr-1 mb-0.5" />
            Agency Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            className={inputClasses.default}
            placeholder="Your Agency Name"
            required
            aria-required="true"
          />
          <p className="text-xs text-slate-500 mt-1">This will appear prominently in your proposals</p>
        </div>

        {/* Tagline */}
        <div>
          <label className={labelClasses.default}>
            Tagline
          </label>
          <input
            type="text"
            value={config.tagline || ''}
            onChange={(e) => updateConfig('tagline', e.target.value)}
            className={inputClasses.default}
            placeholder="e.g., Digital Marketing Excellence"
          />
          <p className="text-xs text-slate-500 mt-1">A short description of your agency</p>
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses.required}>
            <Mail className="w-4 h-4 inline mr-1 mb-0.5" />
            Email Address
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => updateConfig('email', e.target.value)}
            className={inputClasses.default}
            placeholder="hello@youragency.com"
            required
            aria-required="true"
          />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClasses.required}>
            <Phone className="w-4 h-4 inline mr-1 mb-0.5" />
            Phone Number
          </label>
          <input
            type="tel"
            value={config.phone}
            onChange={(e) => updateConfig('phone', e.target.value)}
            className={inputClasses.default}
            placeholder="+1 (555) 123-4567"
            required
            aria-required="true"
          />
        </div>

        {/* Website */}
        <div>
          <label className={labelClasses.default}>
            <Globe className="w-4 h-4 inline mr-1 mb-0.5" />
            Website
          </label>
          <input
            type="url"
            value={config.website || ''}
            onChange={(e) => updateConfig('website', e.target.value)}
            className={inputClasses.default}
            placeholder="https://youragency.com"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className={labelClasses.default}>
            <ImageIcon className="w-4 h-4 inline mr-1 mb-0.5" />
            Logo URL
          </label>
          <input
            type="url"
            value={config.logo || ''}
            onChange={(e) => updateConfig('logo', e.target.value)}
            className={inputClasses.default}
            placeholder="https://youragency.com/logo.png"
          />
          <p className="text-xs text-slate-500 mt-1">
            Direct link to your logo image (PNG/JPG/SVG)
          </p>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className={labelClasses.required}>
          <MapPin className="w-4 h-4 inline mr-1 mb-0.5" />
          Address
        </label>
        <textarea
          value={config.address}
          onChange={(e) => updateConfig('address', e.target.value)}
          rows={3}
          className={`${inputClasses.default} resize-y`}
          placeholder="123 Business Street, City, State, Country, ZIP"
          required
          aria-required="true"
        />
      </div>

      {/* Preview Card */}
      <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-900">Preview</h4>
          <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full">
            How it appears in proposals
          </span>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          {config.logo && (
            <div className="mb-3">
              <img
                src={config.logo}
                alt={`${config.name} logo`}
                className="h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#00D4FF]" />
              <span className="font-bold text-slate-900">{config.name || 'Your Agency Name'}</span>
            </div>

            {config.tagline && (
              <p className="text-sm text-slate-600 italic">{config.tagline}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5" />
                <span>{config.email || 'email@example.com'}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5" />
                <span>{config.phone || '+1 (555) 123-4567'}</span>
              </div>

              {config.website && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate">{config.website}</span>
                </div>
              )}

              <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-xs">{config.address || '123 Business Street, City, State'}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2 text-center">
          All fields marked with * are required for professional proposals
        </p>
      </div>
    </div>
  )
}
