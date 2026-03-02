"use client"

import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div style={{ backgroundColor: '#111118', minHeight: '100vh' }}>
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div className="lg:ml-[220px] transition-all duration-200">
        <main className="p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  )
}
