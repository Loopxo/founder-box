"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import * as React from "react"
import { ClientFormData, clientFormSchema, servicesByIndustry } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Select from "@radix-ui/react-select"
import * as Label from "@radix-ui/react-label"
import { ChevronDown, Check } from "lucide-react"

interface PitchFormProps {
  onSubmit: (data: ClientFormData) => void
  onFormChange?: (data: Partial<ClientFormData>) => void
}

export default function PitchForm({ onSubmit, onFormChange }: PitchFormProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])

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

  // Update parent component with form changes
  React.useEffect(() => {
    if (onFormChange) {
      const subscription = watch((value) => {
        onFormChange(value as Partial<ClientFormData>)
      })
      return () => subscription.unsubscribe()
    }
  }, [watch, onFormChange])

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry)
    setValue("industry", industry as keyof typeof servicesByIndustry)
    setSelectedServices([])
    setValue("services", [])
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Proposal Details
        </h2>
        <p className="text-gray-600">Fill out the information below to generate your professional 8-section proposal</p>
        
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root className="text-sm font-medium text-gray-900">
              Client Name *
            </Label.Root>
            <Input
              {...register("clientName")}
              placeholder="Vijeet Shah"
              className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <Label.Root className="text-sm font-medium text-gray-700">
              Business Name *
            </Label.Root>
            <Input
              {...register("businessName")}
              placeholder="Loopxo"
              className="mt-1"
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root className="text-sm font-medium text-gray-700">
              Email Address *
            </Label.Root>
            <Input
              {...register("clientEmail")}
              type="email"
              placeholder="vijeet@vijeetshah.com"
              className="mt-1"
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>
            )}
          </div>

          <div>
            <Label.Root className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label.Root>
            <Input
              {...register("clientPhone")}
              placeholder="+91 9892912999"
              className="mt-1"
            />
            {errors.clientPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.clientPhone.message}</p>
            )}
          </div>
        </div>

        {/* Industry Selection */}
        <div>
          <Label.Root className="text-sm font-medium text-gray-700">
            Industry *
          </Label.Root>
          <Select.Root onValueChange={handleIndustryChange}>
            <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1">
              <Select.Value placeholder="Select your industry" />
              <Select.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[12rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
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
                      className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
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
            <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
          )}
        </div>

        {/* Services Selection */}
        {selectedIndustry && (
          <div>
            <Label.Root className="text-sm font-medium text-gray-700">
              Services Needed *
            </Label.Root>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-loopxo-red focus:ring-loopxo-red"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-red-500 text-sm mt-1">{errors.services.message}</p>
            )}
          </div>
        )}

        {/* Budget and Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label.Root className="text-sm font-medium text-gray-700">
              Budget Range *
            </Label.Root>
            <Select.Root onValueChange={(value) => setValue("budget", value as "15k-25k" | "25k-40k" | "40k-60k" | "60k+")}>
              <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1">
                <Select.Value placeholder="Select budget" />
                <Select.Icon asChild>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="relative z-50 max-h-96 min-w-[10rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg">
                  <Select.Viewport className="p-2">
                    <Select.Item value="15k-25k" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">₹15k - ₹25k</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="25k-40k" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">₹25k - ₹40k</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="40k-60k" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">₹40k - ₹60k</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="60k+" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">₹60k+</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>

          <div>
            <Label.Root className="text-sm font-medium text-gray-700">
              Timeline *
            </Label.Root>
            <Select.Root onValueChange={(value) => setValue("timeline", value as "1-2weeks" | "3-4weeks" | "1-2months" | "3months+")}>
              <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1">
                <Select.Value placeholder="Select timeline" />
                <Select.Icon asChild>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="relative z-50 max-h-96 min-w-[10rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg">
                  <Select.Viewport className="p-2">
                    <Select.Item value="1-2weeks" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">1-2 weeks</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="3-4weeks" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">3-4 weeks</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="1-2months" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">1-2 months</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="3months+" className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none hover:bg-blue-50 focus:bg-blue-50 transition-colors">
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText className="font-medium">3+ months</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            {errors.timeline && (
              <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
            )}
          </div>
        </div>

        {/* Optional Fields */}
        <div>
          <Label.Root className="text-sm font-medium text-gray-700">
            Current Website (Optional)
          </Label.Root>
          <Input
            {...register("currentWebsite")}
            placeholder="https://loopxo.org"
            className="mt-1"
          />
          {errors.currentWebsite && (
            <p className="text-red-500 text-sm mt-1">{errors.currentWebsite.message}</p>
          )}
        </div>

        <div>
          <Label.Root className="text-sm font-medium text-gray-700">
            Special Requirements (Optional)
          </Label.Root>
          <textarea
            {...register("specialRequirements")}
            placeholder="Any specific requirements or preferences..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          />
        </div>

        {/* Section Toggle */}
        {selectedIndustry && (
          <div className="border-t pt-6">
            <Label.Root className="text-sm font-medium text-gray-700 mb-4 block">
              Proposal Sections (All sections are included by default)
            </Label.Root>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'who-we-are', label: '1. Who We Are - LoopXO', enabled: true },
                { id: 'industry-needs', label: `2. What ${selectedIndustry === 'doctors' ? 'Doctors' : selectedIndustry === 'realestate' ? 'Real Estate' : selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)}s Need Today`, enabled: true },
                { id: 'solutions', label: '3. How LoopXO Solves These Problems', enabled: true },
                { id: 'results', label: '4. Sample Client Results', enabled: true },
                { id: 'pricing', label: '5. Investment Options', enabled: true },
                { id: 'why-loopxo', label: '6. Why Choose LoopXO', enabled: true },
                { id: 'next-steps', label: '7. Next Steps', enabled: true },
                { id: 'endnotes', label: '8. Terms & Information', enabled: true }
              ].map((section) => (
                <label
                  key={section.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg bg-green-50 border-green-200 cursor-not-allowed"
                >
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    disabled
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-green-800">{section.label}</span>
                  <span className="text-xs text-green-600 ml-auto">✓ Included</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ℹ️ All 8 sections are included in every proposal to ensure comprehensive coverage. 
              Custom section selection will be available in future updates.
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-blue-800 hover:from-red-700 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating Proposal..." : "Generate Professional Proposal"}
        </Button>
      </form>
    </div>
  )
}