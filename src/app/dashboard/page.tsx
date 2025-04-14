import { Metadata } from 'next'
import { createClient } from '@/app/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard | Tradr',
  description: 'View and manage your trading strategies'
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Please sign in</h1>
        <p className="mt-2 text-gray-600">You need to be signed in to view this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-4 text-lg text-gray-600">Let&apos;s get started with your trading journey.</p>
          
          {/* Strategy List Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your Strategies</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Add strategy cards here */}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Create New Strategy
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                Connect Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 