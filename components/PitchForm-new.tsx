"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useMemo, useCallback } from "react"
import * as React from "react"
import { ClientFormData, clientFormSchema, servicesByIndustry } from "@/lib/schemas"
import { industryTemplates } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Select from "@radix-ui/react-select"
import * as Label from "@radix-ui/react-label"
import { ChevronDown, Check, Loader2 } from "lucide-react"
import ThemeSelector from "./ThemeSelector"
import AgencyConfigForm from "./AgencyConfig"
import PDFPreview from "./PDFPreview"
import { defaultAgencyConfig, getTheme } from "@/lib/themes"
import { buttonClasses, inputClasses, labelClasses, CurrencyCode, currencies, DEFAULT_CURRENCY } from "@/lib/design-system"

interface PitchFormProps {
  onSubmit: (data: ClientFormData) => void
  onFormChange?: (data: Partial<ClientFormData>) => void
  isGenerating?: boolean
}

// Industry labels constant (moved outside component)
const INDUSTRY_LABELS = {
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
} as const

// Budget ranges by currency
const getBudgetRanges = (currency: CurrencyCode) => {
  const symbol = currencies[currency].symbol
  return [
    { value: "15k-25k" as const, label: `${symbol}15k - ${symbol}25k` },
    { value: "25k-40k" as const, label: `${symbol}25k - ${symbol}40k` },
    { value: "40k-60k" as const, label: `${symbol}40k - ${symbol}60k` },
    { value: "60k+" as const, label: `${symbol}60k+` }
  ]
}

export default function PitchForm({ onSubmit, onFormChange, isGenerating = false }: PitchFormProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>("dark-luxe")
  const [agencyConfig, setAgencyConfig] = useState(defaultAgencyConfig)
  const [showPreview, setShowPreview] = useState(false)
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
    },
    mode: "onBlur" // Validate on blur for better UX
  })

  // Memoize budget ranges based on currency
  const budgetRanges = useMemo(() => getBudgetRanges(currency), [currency])

  // Memoize available services
  const availableServices = useMemo(() =>
    selectedIndustry ? servicesByIndustry[selectedIndustry as keyof typeof servicesByIndustry] : []
  , [selectedIndustry])

  // Debounced form change handler
  const debouncedFormChange = useMemo(() => {
    if (!onFormChange) return undefined

    let timeoutId: NodeJS.Timeout
    return (value: Partial<ClientFormData>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        onFormChange({
          ...value,
          theme: selectedTheme,
          agencyConfig: agencyConfig
        })
      }, 300)
    }
  }, [onFormChange, selectedTheme, agencyConfig])

  // Update parent component with form changes (debounced)
  React.useEffect(() => {
    if (debouncedFormChange) {
      const subscription = watch((value) => {
        debouncedFormChange(value as Partial<ClientFormData>)
      })
      return () => subscription.unsubscribe()
    }
  }, [watch, debouncedFormChange])

  const handleIndustryChange = useCallback((industry: string) => {
    setSelectedIndustry(industry)
    setValue("industry", industry as keyof typeof servicesByIndustry)
    setSelectedServices([])
    setValue("services", [])
  }, [setValue])

  const handleServiceToggle = useCallback((service: string) => {
    setSelectedServices(prev => {
      const newServices = prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
      setValue("services", newServices)
      return newServices
    })
  }, [setValue])

  // Form submit handler
  const onFormSubmit = useCallback((data: ClientFormData) => {
    onSubmit({
      ...data,
      theme: selectedTheme,
      agencyConfig: agencyConfig
    })
  }, [onSubmit, selectedTheme, agencyConfig])

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
          Proposal Details
        </h2>
        <p className="text-slate-600">Fill out the information below to generate your professional 8-section proposal</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses.required}>
                Client Name
              </label>
              <Input
                {...register("clientName")}
                placeholder="John Doe"
                className={`${inputClasses.default} ${errors.clientName ? inputClasses.error : ''}`}
                aria-invalid={errors.clientName ? "true" : "false"}
                aria-describedby={errors.clientName ? "clientName-error" : undefined}
              />
              {errors.clientName && (
                <p id="clientName-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses.required}>
                Business Name
              </label>
              <Input
                {...register("businessName")}
                placeholder="Acme Corporation"
                className={`${inputClasses.default} ${errors.businessName ? inputClasses.error : ''}`}
                aria-invalid={errors.businessName ? "true" : "false"}
                aria-describedby={errors.businessName ? "businessName-error" : undefined}
              />
              {errors.businessName && (
                <p id="businessName-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.businessName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClasses.required}>
                Email Address
              </label>
              <Input
                {...register("clientEmail")}
                type="email"
                placeholder="john@acme.com"
                className={`${inputClasses.default} ${errors.clientEmail ? inputClasses.error : ''}`}
                aria-invalid={errors.clientEmail ? "true" : "false"}
                aria-describedby={errors.clientEmail ? "clientEmail-error" : undefined}
              />
              {errors.clientEmail && (
                <p id="clientEmail-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses.required}>
                Phone Number
              </label>
              <Input
                {...register("clientPhone")}
                placeholder="+1 (555) 123-4567"
                className={`${inputClasses.default} ${errors.clientPhone ? inputClasses.error : ''}`}
                aria-invalid={errors.clientPhone ? "true" : "false"}
                aria-describedby={errors.clientPhone ? "clientPhone-error" : undefined}
              />
              {errors.clientPhone && (
                <p id="clientPhone-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.clientPhone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Industry Selection */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Details</h3>
          <div>
            <label className={labelClasses.required}>
              Industry
            </label>
            <Select.Root onValueChange={handleIndustryChange}>
              <Select.Trigger
                className={`flex h-10 w-full items-center justify-between rounded-md border ${errors.industry ? 'border-red-500' : 'border-slate-300'} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] disabled:cursor-not-allowed disabled:opacity-50 mt-1`}
                aria-label="Select industry"
                aria-invalid={errors.industry ? "true" : "false"}
                aria-describedby={errors.industry ? "industry-error" : undefined}
              >
                <Select.Value placeholder="Select your industry" />
                <Select.Icon asChild>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="relative z-50 max-h-96 min-w-[12rem] overflow-hidden rounded-md border bg-white text-slate-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                  <Select.Viewport className="p-2">
                    {Object.keys(servicesByIndustry).map((industry) => (
                      <Select.Item
                        key={industry}
                        value={industry}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-[#00D4FF]/10 focus:bg-[#00D4FF]/10 transition-colors"
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <Select.ItemIndicator>
                            <Check className="h-4 w-4 text-[#00D4FF]" />
                          </Select.ItemIndicator>
                        </span>
                        <Select.ItemText className="font-medium">
                          {INDUSTRY_LABELS[industry as keyof typeof INDUSTRY_LABELS] || industry}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            {errors.industry && (
              <p id="industry-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.industry.message}
              </p>
            )}
          </div>

          {/* Services Selection */}
          {selectedIndustry && (
            <div className="mt-6">
              <label className={labelClasses.required}>
                Services Needed
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2" role="group" aria-labelledby="services-label">
                {availableServices.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedServices.includes(service)
                        ? 'border-[#00D4FF] bg-[#00D4FF]/5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 rounded border-slate-300 text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-0"
                      aria-label={service}
                    />
                    <span className="text-sm font-medium text-slate-900">{service}</span>
                  </label>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-1" role="alert">{errors.services.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Budget, Timeline and Currency */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Currency Selector */}
            <div>
              <label className={labelClasses.default}>
                Currency
              </label>
              <Select.Root value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] mt-1">
                  <Select.Value />
                  <Select.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 max-h-96 min-w-[10rem] overflow-hidden rounded-md border bg-white text-slate-900 shadow-lg">
                    <Select.Viewport className="p-2">
                      {Object.entries(currencies).map(([code, info]) => (
                        <Select.Item
                          key={code}
                          value={code}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-[#00D4FF]/10 focus:bg-[#00D4FF]/10 transition-colors"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Select.ItemIndicator>
                              <Check className="h-4 w-4 text-[#00D4FF]" />
                            </Select.ItemIndicator>
                          </span>
                          <Select.ItemText className="font-medium">
                            {info.symbol} {info.name}
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Budget Range */}
            <div>
              <label className={labelClasses.required}>
                Budget Range
              </label>
              <Select.Root onValueChange={(value) => setValue("budget", value as "15k-25k" | "25k-40k" | "40k-60k" | "60k+")}>
                <Select.Trigger
                  className={`flex h-10 w-full items-center justify-between rounded-md border ${errors.budget ? 'border-red-500' : 'border-slate-300'} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] mt-1`}
                  aria-invalid={errors.budget ? "true" : "false"}
                  aria-describedby={errors.budget ? "budget-error" : undefined}
                >
                  <Select.Value placeholder="Select budget" />
                  <Select.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 max-h-96 min-w-[10rem] overflow-hidden rounded-md border bg-white text-slate-900 shadow-lg">
                    <Select.Viewport className="p-2">
                      {budgetRanges.map(({ value, label }) => (
                        <Select.Item
                          key={value}
                          value={value}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-[#00D4FF]/10 focus:bg-[#00D4FF]/10 transition-colors"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Select.ItemIndicator>
                              <Check className="h-4 w-4 text-[#00D4FF]" />
                            </Select.ItemIndicator>
                          </span>
                          <Select.ItemText className="font-medium">{label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {errors.budget && (
                <p id="budget-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.budget.message}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div>
              <label className={labelClasses.required}>
                Timeline
              </label>
              <Select.Root onValueChange={(value) => setValue("timeline", value as "1-2weeks" | "3-4weeks" | "1-2months" | "3months+")}>
                <Select.Trigger
                  className={`flex h-10 w-full items-center justify-between rounded-md border ${errors.timeline ? 'border-red-500' : 'border-slate-300'} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] mt-1`}
                  aria-invalid={errors.timeline ? "true" : "false"}
                  aria-describedby={errors.timeline ? "timeline-error" : undefined}
                >
                  <Select.Value placeholder="Select timeline" />
                  <Select.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 max-h-96 min-w-[10rem] overflow-hidden rounded-md border bg-white text-slate-900 shadow-lg">
                    <Select.Viewport className="p-2">
                      {[
                        { value: "1-2weeks", label: "1-2 weeks" },
                        { value: "3-4weeks", label: "3-4 weeks" },
                        { value: "1-2months", label: "1-2 months" },
                        { value: "3months+", label: "3+ months" }
                      ].map((option) => (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-[#00D4FF]/10 focus:bg-[#00D4FF]/10 transition-colors"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Select.ItemIndicator>
                              <Check className="h-4 w-4 text-[#00D4FF]" />
                            </Select.ItemIndicator>
                          </span>
                          <Select.ItemText className="font-medium">{option.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {errors.timeline && (
                <p id="timeline-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.timeline.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Information (Optional)</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClasses.default}>
                Current Website
              </label>
              <Input
                {...register("currentWebsite")}
                placeholder="https://example.com"
                className={`${inputClasses.default} ${errors.currentWebsite ? inputClasses.error : ''}`}
              />
              {errors.currentWebsite && (
                <p className="text-red-500 text-sm mt-1" role="alert">{errors.currentWebsite.message}</p>
              )}
            </div>

            <div>
              <label className={labelClasses.default}>
                Special Requirements
              </label>
              <textarea
                {...register("specialRequirements")}
                placeholder="Any specific requirements or preferences..."
                rows={4}
                className={`${inputClasses.default} min-h-[80px] resize-y`}
              />
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6">
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
          />
        </div>

        {/* Agency Configuration */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6">
          <AgencyConfigForm
            config={agencyConfig}
            onConfigChange={setAgencyConfig}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`${buttonClasses.secondary} flex-1 px-6 py-3 rounded-lg text-base`}
            disabled={isGenerating || isSubmitting}
          >
            Preview Proposal
          </Button>
          <Button
            type="submit"
            className={`${buttonClasses.primary} flex-1 px-6 py-3 rounded-lg text-base`}
            disabled={isGenerating || isSubmitting}
          >
            {isGenerating || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Proposal...
              </>
            ) : (
              "Generate PDF"
            )}
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
            agencyConfig: agencyConfig
          }}
          template={industryTemplates[watch('industry') || 'doctors'] as any}
          theme={getTheme(selectedTheme)}
          agencyConfig={agencyConfig}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onGenerate={(customImages, customLogo, customTexts, imageHeights) => {
            setShowPreview(false)
            handleSubmit(onFormSubmit)()
          }}
        />
      )}
    </div>
  )
}
