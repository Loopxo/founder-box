"use client"

import { themes } from '@/lib/themes'
import { useState } from 'react'
import { Eye, Check } from 'lucide-react'

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Choose PDF Theme
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Select a theme that matches your brand and target audience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedTheme === theme.id
                ? 'border-[#00D4FF] bg-[#00D4FF]/5 shadow-lg shadow-[#00D4FF]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }
            `}
            onClick={() => onThemeChange(theme.id)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${theme.name} theme`}
            aria-pressed={selectedTheme === theme.id}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onThemeChange(theme.id)
              }
            }}
          >
            {/* Theme Preview */}
            <div className="mb-3">
              <div
                className="w-full h-16 rounded-md mb-2 border"
                style={{
                  background: (theme.colors as any).gradient || theme.colors.background,
                  borderColor: theme.colors.border
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <div
                    className="w-8 h-8 rounded-full mr-2 border-2 border-white/30"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-12 h-2 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">{theme.name}</h4>
              <p className="text-xs text-slate-600 mb-2">{theme.description}</p>

              {/* Color Palette */}
              <div className="flex space-x-1" role="img" aria-label="Theme color palette">
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent color"
                />
              </div>
            </div>

            {/* Preview Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewTheme(theme.id)
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors border border-slate-300"
              title="Preview theme"
              aria-label={`Preview ${theme.name} theme`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {/* Selection Indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-2 left-2">
                <div className="w-6 h-6 bg-[#00D4FF] rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Theme Preview Modal */}
      {previewTheme && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewTheme(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-preview-title"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 id="theme-preview-title" className="text-lg font-semibold text-slate-900">
                  {themes.find(t => t.id === previewTheme)?.name}
                </h3>
                <button
                  onClick={() => setPreviewTheme(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close preview"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-slate-600 mb-4 text-sm">
                {themes.find(t => t.id === previewTheme)?.description}
              </p>

              {/* Sample Preview */}
              <div
                className="w-full h-32 rounded-lg mb-4 p-4 border"
                style={{
                  background: themes.find(t => t.id === previewTheme)?.colors.background,
                  color: themes.find(t => t.id === previewTheme)?.colors.text,
                  borderColor: themes.find(t => t.id === previewTheme)?.colors.border
                }}
              >
                <div className="text-center">
                  <h4
                    className="text-lg font-bold mb-2"
                    style={{ color: themes.find(t => t.id === previewTheme)?.colors.primary }}
                  >
                    Sample Heading
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: themes.find(t => t.id === previewTheme)?.colors.textSecondary }}
                  >
                    This is how your proposal will look with this theme.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onThemeChange(previewTheme)
                    setPreviewTheme(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white rounded-lg hover:from-[#00D4FF]/90 hover:to-[#8B5CF6]/90 font-semibold transition-all duration-200"
                >
                  Use This Theme
                </button>
                <button
                  onClick={() => setPreviewTheme(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
