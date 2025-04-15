'use client';

import { Metadata } from 'next'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard | Tradr',
  description: 'View and manage your trading strategies'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/join')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p>Welcome back, {user.email}</p>
    </div>
  )
} 