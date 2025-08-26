"use client"

import { useEffect } from 'react'


export default function TestRedirectPage() {


  useEffect(() => {
    // Test redirect after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = '/dashboard'
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Testing Redirect...</h1>
        <p className="text-gray-600">Redirecting to dashboard in 2 seconds...</p>
      </div>
    </div>
  )
}

