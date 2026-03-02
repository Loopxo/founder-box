"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import * as React from "react"
import { ClientFormData, clientFormSchema, servicesByIndustry } from "@/lib/schemas"
import { industryTemplates } from "@/lib/templates"
import { Input } from "@/components/ui/input"
import * as Select from "@radix-ui/react-select"
import * as Label from "@radix-ui/react-label"
// no icon imports — Studio theme is icon-free
import ThemeSelector from "./ThemeSelector"
import AgencyConfigForm from "./AgencyConfig"
import PDFPreview from "./PDFPreview"
import PricingEditor, { PricingPackage } from "./PricingEditor"
import { defaultAgencyConfig, getTheme } from "@/lib/themes"
import { DEFAULT_CURRENCY, CurrencyCode } from "@/lib/design-system"

interface PitchFormProps {
  onSubmit: (data: ClientFormData) => void
  onFormChange?: (data: Partial<ClientFormData>) => void
  isGenerating?: boolean
}

export default function PitchForm({ onSubmit, onFormChange }: PitchFormProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>("dark-luxe")
  const [agencyConfig, setAgencyConfig] = useState(defaultAgencyConfig)
  const [showPreview, setShowPreview] = useState(false)
  const [customPricing, setCustomPricing] = useState<PricingPackage[] | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      services: []
    }
  })

  // Initialize pricing from template when industry changes
  React.useEffect(() => {
    if (selectedIndustry) {
      const template = industryTemplates[selectedIndustry as keyof typeof industryTemplates]
      if (template && template.pricing && !customPricing) {
        setCustomPricing(template.pricing as PricingPackage[])
      }
    }
  }, [selectedIndustry, customPricing])

  // Update parent component with form changes
  React.useEffect(() => {
    if (onFormChange) {
      const subscription = watch((value) => {
        onFormChange({
          ...value as Partial<ClientFormData>,
          theme: selectedTheme,
          agencyConfig: agencyConfig,
          customPricing: customPricing || undefined
        })
      })
      return () => subscription.unsubscribe()
    }
  }, [watch, onFormChange, selectedTheme, agencyConfig, customPricing])

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry)
    setValue("industry", industry as keyof typeof servicesByIndustry)
    setSelectedServices([])
    setValue("services", [])
    setCustomPricing(null) // Reset pricing when industry changes
  }

  const handleServiceToggle = (service: string) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service]

    setSelectedServices(newServices)
    setValue("services", newServices)
  }

  const availableServices = selectedIndustry ? servicesByIndustry[selectedIndustry as keyof typeof servicesByIndustry] : []

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#EDE9DC', marginBottom: '4px' }}>Proposal Details</h2>
        <p style={{ color: '#9E9880', fontSize: '14px' }}>Fill in the details below to generate a professional 8-section proposal.</p>

      </div>

      <form onSubmit={handleSubmit((data) => {
        console.log('Form Submit - Custom Pricing:', customPricing)
        const submissionData = {
          ...data,
          theme: selectedTheme,
          agencyConfig: agencyConfig,
          customPricing: customPricing || undefined
        }
        console.log('Form Submit - Full Data:', submissionData)
        onSubmit(submissionData)
      })} className="space-y-6" style={{ background: '#18181F', border: '1px solid #2A2A38', borderRadius: '8px', padding: '32px' }}>
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
              Client Name *
            </Label.Root>
            <Input
              {...register("clientName")}
              placeholder="Vijeet Shah"
              style={{ background: '#111118', border: '1px solid #2A2A38', color: '#EDE9DC', borderRadius: '6px', marginTop: '0' }} className="placeholder:text-[#5E5A50] focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40"
            />
            {errors.clientName && (
              <p className="text-red-400 text-sm mt-1">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
              Business Name *
            </Label.Root>
            <Input
              {...register("businessName")}
              placeholder="Loopxo"
              style={{ background: '#111118', border: '1px solid #2A2A38', color: '#EDE9DC', borderRadius: '6px', marginTop: '0' }} className="placeholder:text-[#5E5A50] focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40"
            />
            {errors.businessName && (
              <p className="text-red-400 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
              Email <span style={{ color: '#5E5A50', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </Label.Root>
            <Input
              {...register("clientEmail")}
              type="email"
              placeholder="vijeet@vijeetshah.com"
              style={{ background: '#111118', border: '1px solid #2A2A38', color: '#EDE9DC', borderRadius: '6px', marginTop: '0' }} className="placeholder:text-[#5E5A50] focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40"
            />
            {errors.clientEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.clientEmail.message}</p>
            )}
          </div>

          <div>
            <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
              Phone Number *
            </Label.Root>
            <Input
              {...register("clientPhone")}
              placeholder="+91 9892912999"
              style={{ background: '#111118', border: '1px solid #2A2A38', color: '#EDE9DC', borderRadius: '6px', marginTop: '0' }} className="placeholder:text-[#5E5A50] focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40"
            />
            {errors.clientPhone && (
              <p className="text-red-400 text-sm mt-1">{errors.clientPhone.message}</p>
            )}
          </div>
        </div>

        {/* Industry Selection */}
        <div>
          <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
            Industry
          </Label.Root>
          <Select.Root onValueChange={handleIndustryChange}>
            <Select.Trigger style={{ display: 'flex', height: '38px', width: '100%', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px', border: '1px solid #2A2A38', background: '#111118', padding: '0 12px', fontSize: '14px', color: '#EDE9DC', outline: 'none', cursor: 'pointer' }} className="focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40">
              <Select.Value placeholder="Select industry" />
              <Select.Icon>
                <span style={{ color: '#9E9880', fontSize: '10px' }}>▼</span>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content style={{ background: '#18181F', border: '1px solid #2A2A38', borderRadius: '6px', zIndex: 50, minWidth: '12rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <Select.Viewport className="p-2 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
                  {Object.keys(servicesByIndustry).map((industry) => {
                    const industryLabels = {
                      salon: "Salon & Beauty",
                      construction: "Construction",
                      doctors: "Doctors & Clinics",
                      gym: "Gym/Yoga",
                      lawyers: "Lawyers/CAs/Consultants",
                      realestate: "Real Estate",
                      jewellery: "Jewellery Shop",
                      wedding: "Wedding Services",
                      restaurant: "Restaurant",
                      healthcare: "Healthcare",
                      retail: "Retail",
                      freelance: "Freelance",
                      app: "App Development",
                      consulting: "Consulting"
                    }

                    return (
                      <Select.Item
                        key={industry}
                        value={industry}
                        style={{ padding: '8px 12px', fontSize: '14px', color: '#EDE9DC', cursor: 'pointer', borderRadius: '4px', outline: 'none' }} className="hover:bg-[#1E1E28] focus:bg-[#1E1E28] data-[highlighted]:bg-[#1E1E28] data-[state=checked]:text-[#D4A853] transition-colors">
                        <Select.ItemText>{industryLabels[industry as keyof typeof industryLabels] || industry}</Select.ItemText>
                      </Select.Item>
                    )
                  })}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          {errors.industry && (
            <p className="text-red-400 text-sm mt-1">{errors.industry.message}</p>
          )}
        </div>

        {/* Services Selection */}
        {selectedIndustry && (
          <div>
            <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
              Services Needed *
            </Label.Root>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableServices.map((service) => (
                <label
                  key={service}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid #2A2A38', background: selectedServices.includes(service) ? 'rgba(212,168,83,0.06)' : '#111118', borderColor: selectedServices.includes(service) ? '#D4A853' : '#2A2A38', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    style={{ accentColor: '#D4A853', width: '14px', height: '14px' }}
                  />
                  <span style={{ fontSize: '13px', color: '#EDE9DC' }}>{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-red-400 text-sm mt-1">{errors.services.message}</p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div>
          <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
            Timeline
          </Label.Root>
          <Select.Root onValueChange={(value) => setValue("timeline", value as "1-2weeks" | "3-4weeks" | "1-2months" | "3months+")}>
            <Select.Trigger style={{ display: 'flex', height: '38px', width: '100%', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px', border: '1px solid #2A2A38', background: '#111118', padding: '0 12px', fontSize: '14px', color: '#EDE9DC', outline: 'none', cursor: 'pointer' }} className="focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40">
              <Select.Value placeholder="Select timeline" />
              <Select.Icon>
                <span style={{ color: '#9E9880', fontSize: '10px' }}>▼</span>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content style={{ background: '#18181F', border: '1px solid #2A2A38', borderRadius: '6px', zIndex: 50, minWidth: '10rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <Select.Viewport className="p-2">
                  <Select.Item value="1-2weeks" style={{ padding: '8px 12px', fontSize: '14px', color: '#EDE9DC', cursor: 'pointer', borderRadius: '4px' }} className="hover:bg-[#1E1E28] data-[highlighted]:bg-[#1E1E28] data-[state=checked]:text-[#D4A853] transition-colors">
                    <Select.ItemText>1-2 weeks</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="3-4weeks" style={{ padding: '8px 12px', fontSize: '14px', color: '#EDE9DC', cursor: 'pointer', borderRadius: '4px' }} className="hover:bg-[#1E1E28] data-[highlighted]:bg-[#1E1E28] data-[state=checked]:text-[#D4A853] transition-colors">
                    <Select.ItemText>3-4 weeks</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="1-2months" style={{ padding: '8px 12px', fontSize: '14px', color: '#EDE9DC', cursor: 'pointer', borderRadius: '4px' }} className="hover:bg-[#1E1E28] data-[highlighted]:bg-[#1E1E28] data-[state=checked]:text-[#D4A853] transition-colors">
                    <Select.ItemText>1-2 months</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="3months+" style={{ padding: '8px 12px', fontSize: '14px', color: '#EDE9DC', cursor: 'pointer', borderRadius: '4px' }} className="hover:bg-[#1E1E28] data-[highlighted]:bg-[#1E1E28] data-[state=checked]:text-[#D4A853] transition-colors">
                    <Select.ItemText>3+ months</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          {errors.timeline && (
            <p className="text-red-400 text-sm mt-1">{errors.timeline.message}</p>
          )}
        </div>

        {/* Optional Fields */}
        <div>
          <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
            Current Website (Optional)
          </Label.Root>
          <Input
            {...register("currentWebsite")}
            placeholder="https://loopxo.org"
            className="mt-1"
          />
          {errors.currentWebsite && (
            <p className="text-red-400 text-sm mt-1">{errors.currentWebsite.message}</p>
          )}
        </div>

        <div>
          <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '6px' }}>
            Special Requirements (Optional)
          </Label.Root>
          <textarea
            {...register("specialRequirements")}
            placeholder="Any specific requirements or preferences..."
            style={{ width: '100%', minHeight: '80px', background: '#111118', border: '1px solid #2A2A38', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', color: '#EDE9DC', resize: 'vertical', outline: 'none' }}
            className="placeholder:text-[#5E5A50] focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/40"
          />
        </div>

        {/* Theme Selection */}
        <div style={{ borderTop: '1px solid #2A2A38', paddingTop: '24px' }}>
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
          />
        </div>

        {/* Agency Configuration */}
        <div style={{ borderTop: '1px solid #2A2A38', paddingTop: '24px' }}>
          <AgencyConfigForm
            config={agencyConfig}
            onConfigChange={setAgencyConfig}
          />
        </div>

        {/* Pricing Packages Editor */}
        {selectedIndustry && customPricing && (
          <div style={{ borderTop: '1px solid #2A2A38', paddingTop: '24px' }}>
            <PricingEditor
              packages={customPricing}
              onPackagesChange={setCustomPricing}
              currency={currency}
            />
          </div>
        )}

        {/* Section Toggle */}
        {selectedIndustry && (
          <div style={{ borderTop: '1px solid #2A2A38', paddingTop: '24px' }}>
            <Label.Root style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9E9880', display: 'block', marginBottom: '12px' }}>
              Proposal Sections (All sections are included by default)
            </Label.Root>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'who-we-are', label: `1. Who We Are - ${agencyConfig.name}`, enabled: true },
                { id: 'industry-needs', label: `2. What ${selectedIndustry === 'doctors' ? 'Doctors' : selectedIndustry === 'realestate' ? 'Real Estate' : selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)}s Need Today`, enabled: true },
                { id: 'solutions', label: `3. How ${agencyConfig.name} Solves These Problems`, enabled: true },
                { id: 'results', label: '4. Sample Client Results', enabled: true },
                { id: 'pricing', label: '5. Investment Options', enabled: true },
                { id: 'why-loopxo', label: `6. Why Choose ${agencyConfig.name}`, enabled: true },
                { id: 'next-steps', label: '7. Next Steps', enabled: true },
                { id: 'endnotes', label: '8. Terms & Information', enabled: true }
              ].map((section) => (
                <label
                  key={section.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid #2A2A38', background: '#111118', borderRadius: '6px', cursor: 'not-allowed', opacity: 0.8 }}
                >
                  <input type="checkbox" checked={section.enabled} disabled style={{ accentColor: '#D4A853', width: '14px', height: '14px' }} />
                  <span style={{ fontSize: '13px', color: '#EDE9DC', flex: 1 }}>{section.label}</span>
                  <span style={{ fontSize: '11px', color: '#4D9E6A', fontWeight: 600, letterSpacing: '0.04em' }}>Included</span>
                </label>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#9E9880', marginTop: '10px' }}>All 8 sections are included in every proposal. Custom section selection coming soon.</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            style={{ width: '100%', maxWidth: '420px', background: '#D4A853', color: '#111118', fontWeight: 700, fontSize: '14px', letterSpacing: '0.04em', padding: '13px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'background 0.15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#C49843')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#D4A853')}
          >
            Preview & Generate Proposal
          </button>
        </div>
      </form>

      {/* PDF Preview Modal */}
      {showPreview && (
        <PDFPreview
          clientData={{
            clientName: watch('clientName') || '',
            businessName: watch('businessName') || '',
            industry: watch('industry') || 'doctors',
            services: watch('services') || [],
            timeline: watch('timeline') || '2-4 weeks',
            currentWebsite: watch('currentWebsite') || '',
            specialRequirements: watch('specialRequirements') || '',
            theme: selectedTheme,
            agencyConfig: agencyConfig,
            customPricing: customPricing || undefined
          }}
          template={industryTemplates[watch('industry') || 'doctors'] as any}
          theme={getTheme(selectedTheme)}
          agencyConfig={agencyConfig}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onGenerate={(customImages, customLogo, customTexts, imageHeights) => {
            setShowPreview(false)
            handleSubmit((data) => {
              onSubmit({
                ...data,
                theme: selectedTheme,
                agencyConfig: agencyConfig,
                customPricing: customPricing || undefined
              })
            })()
          }}
        />
      )}
    </div>
  )
}