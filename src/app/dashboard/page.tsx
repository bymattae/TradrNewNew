'use client';

import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/join')
      }
    }
    
    checkAuth()
  }, [router, supabase.auth])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p>Welcome back!</p>
    </div>
  )
} 