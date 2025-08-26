"use client"

import { themes } from '@/lib/themes'
import { useState } from 'react'

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Choose PDF Theme
        </label>
        <p className="text-sm text-gray-400 mb-4">
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
                ? 'border-yellow-400 bg-yellow-900/20' 
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }
            `}
            onClick={() => onThemeChange(theme.id)}
          >
            {/* Theme Preview */}
            <div className="mb-3">
              <div 
                className="w-full h-16 rounded-md mb-2"
                style={{ 
                  background: (theme.colors as any).gradient || theme.colors.background,
                  border: `2px solid ${theme.colors.border}`
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <div 
                    className="w-8 h-8 rounded-full mr-2"
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
              <h3 className="font-semibold text-white mb-1">{theme.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{theme.description}</p>
              
              {/* Color Palette */}
              <div className="flex space-x-1">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
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
              className="absolute top-2 right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              title="Preview theme"
            >
              <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Selection Indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-2 left-2">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Theme Preview Modal */}
      {previewTheme && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setPreviewTheme(null)}
        >
          <div 
            className="bg-gray-900 border border-yellow-500/30 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-yellow-300">
                  {themes.find(t => t.id === previewTheme)?.name}
                </h3>
                <button
                  onClick={() => setPreviewTheme(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-300 mb-4 text-sm">
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
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onThemeChange(previewTheme)
                    setPreviewTheme(null)
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Use This Theme
                </button>
                <button
                  onClick={() => setPreviewTheme(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
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
