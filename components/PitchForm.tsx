"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import * as React from "react"
import { ClientFormData, clientFormSchema, servicesByIndustry } from "@/lib/schemas"
import { industryTemplates } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Select from "@radix-ui/react-select"
import * as Label from "@radix-ui/react-label"
import { ChevronDown, Check } from "lucide-react"
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-blue via-neon-orange to-electric-violet bg-clip-text text-transparent mb-2">
          Proposal Details
        </h2>
        <p className="text-slate-300">Fill out the information below to generate your professional 8-section proposal</p>

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
      })} className="space-y-6 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root className="text-sm font-medium text-white">
              Client Name *
            </Label.Root>
            <Input
              {...register("clientName")}
              placeholder="Vijeet Shah"
              className="mt-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-electric-blue focus:ring-electric-blue"
            />
            {errors.clientName && (
              <p className="text-red-400 text-sm mt-1">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <Label.Root className="text-sm font-medium text-white">
              Business Name *
            </Label.Root>
            <Input
              {...register("businessName")}
              placeholder="Loopxo"
              className="mt-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-electric-blue focus:ring-electric-blue"
            />
            {errors.businessName && (
              <p className="text-red-400 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root className="text-sm font-medium text-white">
              Email Address <span className="text-slate-400 text-xs">(Optional)</span>
            </Label.Root>
            <Input
              {...register("clientEmail")}
              type="email"
              placeholder="vijeet@vijeetshah.com"
              className="mt-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-electric-blue focus:ring-electric-blue"
            />
            {errors.clientEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.clientEmail.message}</p>
            )}
          </div>

          <div>
            <Label.Root className="text-sm font-medium text-white">
              Phone Number *
            </Label.Root>
            <Input
              {...register("clientPhone")}
              placeholder="+91 9892912999"
              className="mt-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-electric-blue focus:ring-electric-blue"
            />
            {errors.clientPhone && (
              <p className="text-red-400 text-sm mt-1">{errors.clientPhone.message}</p>
            )}
          </div>
        </div>

        {/* Industry Selection */}
        <div>
          <Label.Root className="text-sm font-medium text-white">
            Industry *
          </Label.Root>
          <Select.Root onValueChange={handleIndustryChange}>
            <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue disabled:cursor-not-allowed disabled:opacity-50 mt-1">
              <Select.Value placeholder="Select your industry" />
              <Select.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[12rem] overflow-hidden rounded-md border border-slate-600 bg-slate-900 text-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
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
                      className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-electric-blue" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">
                        {industryLabels[industry as keyof typeof industryLabels] || industry}
                      </Select.ItemText>
                    </Select.Item>
                  )})}
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
            <Label.Root className="text-sm font-medium text-white">
              Services Needed *
            </Label.Root>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className="flex items-center space-x-2 p-3 border border-slate-600 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-slate-600 bg-slate-700 text-electric-blue focus:ring-electric-blue"
                  />
                  <span className="text-sm text-white">{service}</span>
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
            <Label.Root className="text-sm font-medium text-white">
              Timeline *
            </Label.Root>
            <Select.Root onValueChange={(value) => setValue("timeline", value as "1-2weeks" | "3-4weeks" | "1-2months" | "3months+")}>
              <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue disabled:cursor-not-allowed disabled:opacity-50 mt-1">
                <Select.Value placeholder="Select timeline" />
                <Select.Icon asChild>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="relative z-50 max-h-96 min-w-[10rem] overflow-hidden rounded-md border border-slate-600 bg-slate-900 text-white shadow-lg">
                  <Select.Viewport className="p-2">
                    <Select.Item value="1-2weeks" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-electric-blue" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">1-2 weeks</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="3-4weeks" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-electric-blue" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">3-4 weeks</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="1-2months" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-electric-blue" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">1-2 months</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="3months+" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-electric-blue" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">3+ months</Select.ItemText>
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
          <Label.Root className="text-sm font-medium text-white">
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
          <Label.Root className="text-sm font-medium text-white">
            Special Requirements (Optional)
          </Label.Root>
          <textarea
            {...register("specialRequirements")}
            placeholder="Any specific requirements or preferences..."
            className="flex min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:border-electric-blue disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          />
        </div>

        {/* Theme Selection */}
        <div className="border-t border-slate-700 pt-6">
          <ThemeSelector 
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
          />
        </div>

        {/* Agency Configuration */}
        <div className="border-t border-slate-700 pt-6">
          <AgencyConfigForm
            config={agencyConfig}
            onConfigChange={setAgencyConfig}
          />
        </div>

        {/* Pricing Packages Editor */}
        {selectedIndustry && customPricing && (
          <div className="border-t border-slate-700 pt-6">
            <PricingEditor
              packages={customPricing}
              onPackagesChange={setCustomPricing}
              currency={currency}
            />
          </div>
        )}

        {/* Section Toggle */}
        {selectedIndustry && (
          <div className="border-t border-slate-700 pt-6">
            <Label.Root className="text-sm font-medium text-white mb-4 block">
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
                  className="flex items-center space-x-3 p-3 border rounded-lg bg-slate-800 border-slate-600 cursor-not-allowed"
                >
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    disabled
                    className="rounded border-slate-600 bg-slate-700 text-electric-blue focus:ring-electric-blue"
                  />
                  <span className="text-sm font-medium text-white">{section.label}</span>
                  <span className="text-xs text-green-400 ml-auto">✓ Included</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-3">
              ℹ️ All 8 sections are included in every proposal to ensure comprehensive coverage.
              Custom section selection will be available in future updates.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => setShowPreview(true)}
            className="w-full max-w-md bg-gradient-to-r from-electric-blue to-electric-violet hover:from-electric-blue/80 hover:to-electric-violet/80 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-electric-blue/25 hover:shadow-electric-blue/40 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Preview & Generate Proposal
          </Button>
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