"use client"

import Image from 'next/image'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
}

export default function DashboardLayout({ children, showHeader = true }: DashboardLayoutProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Sidebar />

      {/* Main content area */}
      <div className="lg:ml-64 transition-all duration-300">


        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
