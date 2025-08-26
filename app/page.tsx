
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import LandingPage from '@/components/LandingPage'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // If user is logged in, redirect to dashboard
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  return <LandingPage />
}
