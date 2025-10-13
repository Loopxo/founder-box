"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Edit2, Check, Trash2, Star, DollarSign } from 'lucide-react'
import { inputClasses, labelClasses, buttonClasses } from '@/lib/design-system'
import { CurrencyCode, currencies } from '@/lib/design-system'

export interface PricingPackage {
  name: string
  price: string
  popular?: boolean
  features: string[]
}

interface PricingEditorProps {
  packages: PricingPackage[]
  onPackagesChange: (packages: PricingPackage[]) => void
  currency: CurrencyCode
}

export default function PricingEditor({ packages, onPackagesChange, currency }: PricingEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null)
  const [newFeature, setNewFeature] = useState('')

  const currencySymbol = currencies[currency].symbol

  const handleEditPackage = (index: number) => {
    setEditingIndex(index)
    setEditingPackage({ ...packages[index] })
  }

  const handleSavePackage = () => {
    if (editingIndex !== null && editingPackage) {
      const updatedPackages = [...packages]
      updatedPackages[editingIndex] = editingPackage
      onPackagesChange(updatedPackages)
      setEditingIndex(null)
      setEditingPackage(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingPackage(null)
    setNewFeature('')
  }

  const handleAddFeature = () => {
    if (editingPackage && newFeature.trim()) {
      setEditingPackage({
        ...editingPackage,
        features: [...editingPackage.features, newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (featureIndex: number) => {
    if (editingPackage) {
      setEditingPackage({
        ...editingPackage,
        features: editingPackage.features.filter((_, i) => i !== featureIndex)
      })
    }
  }

  const handleTogglePopular = (index: number) => {
    const updatedPackages = packages.map((pkg, i) => ({
      ...pkg,
      popular: i === index ? !pkg.popular : false // Only one can be popular
    }))
    onPackagesChange(updatedPackages)
  }

  const handleDeletePackage = (index: number) => {
    if (packages.length > 1) {
      onPackagesChange(packages.filter((_, i) => i !== index))
    }
  }

  const handleAddPackage = () => {
    const newPackage: PricingPackage = {
      name: 'New Package',
      price: `${currencySymbol}0`,
      popular: false,
      features: ['Feature 1', 'Feature 2', 'Feature 3']
    }
    onPackagesChange([...packages, newPackage])
    setEditingIndex(packages.length)
    setEditingPackage(newPackage)
  }

  const handleResetToDefault = () => {
    // This would reset to template defaults
    // You can implement this based on the selected industry
    if (confirm('Reset all pricing packages to template defaults? This will discard your changes.')) {
      // Trigger reset logic here
      alert('Reset functionality - you can implement this to reload from templates')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            <DollarSign className="w-5 h-5 inline mr-2 mb-1" />
            Pricing Packages
          </h3>
          <p className="text-sm text-slate-600">
            Customize your pricing packages. Click edit to modify, or add new packages.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleResetToDefault}
            variant="outline"
            className="text-sm border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Reset to Default
          </Button>
          <Button
            type="button"
            onClick={handleAddPackage}
            className={`${buttonClasses.secondary} text-sm`}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Package
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`relative border-2 rounded-lg p-4 transition-all ${
              pkg.popular
                ? 'border-[#00D4FF] bg-[#00D4FF]/5 shadow-lg'
                : 'border-slate-200 bg-white'
            } ${editingIndex === index ? 'ring-2 ring-[#8B5CF6]' : ''}`}
          >
            {/* Popular Badge */}
            {pkg.popular && editingIndex !== index && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Most Popular
                </span>
              </div>
            )}

            {editingIndex === index && editingPackage ? (
              // Edit Mode
              <div className="space-y-3 pt-2">
                <div>
                  <label className={labelClasses.default}>Package Name</label>
                  <Input
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className={inputClasses.default}
                    placeholder="e.g., Professional Package"
                  />
                </div>

                <div>
                  <label className={labelClasses.default}>Price</label>
                  <Input
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                    className={inputClasses.default}
                    placeholder={`e.g., ${currencySymbol}50,000`}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Include currency symbol: {currencySymbol}
                  </p>
                </div>

                <div>
                  <label className={labelClasses.default}>Features</label>
                  <div className="space-y-2">
                    {editingPackage.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...editingPackage.features]
                            newFeatures[fIndex] = e.target.value
                            setEditingPackage({ ...editingPackage, features: newFeatures })
                          }}
                          className={`${inputClasses.default} text-sm`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIndex)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        placeholder="Add new feature..."
                        className={`${inputClasses.default} text-sm`}
                      />
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        className="bg-[#00D4FF] hover:bg-[#00D4FF]/80 text-white text-sm px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id={`popular-${index}`}
                    checked={editingPackage.popular}
                    onChange={(e) => setEditingPackage({ ...editingPackage, popular: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#00D4FF] focus:ring-[#00D4FF]"
                  />
                  <label htmlFor={`popular-${index}`} className="text-sm font-medium text-slate-700">
                    Mark as Most Popular
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={handleSavePackage}
                    className={`${buttonClasses.primary} flex-1 text-sm py-2`}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-3 pt-2">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-slate-900">{pkg.name}</h4>
                  <p className="text-2xl font-black text-[#00D4FF] mt-2">{pkg.price}</p>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-sm text-slate-700">
                        <span className="text-[#00D4FF] mr-2 font-bold">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    type="button"
                    onClick={() => handleEditPackage(index)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm py-2"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleTogglePopular(index)}
                    className={`flex-1 text-sm py-2 ${
                      pkg.popular
                        ? 'bg-[#FF6B35] hover:bg-[#FF6B35]/80 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={pkg.popular ? 'Remove popular badge' : 'Mark as popular'}
                  >
                    <Star className={`w-3 h-3 mr-1 ${pkg.popular ? 'fill-current' : ''}`} />
                    {pkg.popular ? 'Popular' : 'Popular'}
                  </Button>
                  {packages.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleDeletePackage(index)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-sm py-2 px-3"
                      title="Delete package"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-[#00D4FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-semibold mb-1">Tips for pricing packages:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Keep package names clear and descriptive</li>
              <li>Mark your recommended package as "Most Popular"</li>
              <li>Include currency symbol in prices: {currencySymbol}</li>
              <li>List features in order of importance</li>
              <li>Use "Everything in [Previous Package]" to show value progression</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
