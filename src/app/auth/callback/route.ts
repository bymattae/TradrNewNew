import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/auth/join?error=invalid_code', request.url))
      }

      // Get the user's profile to check if they've completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(new URL('/auth/join?error=no_user', request.url))
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url, tags')
        .eq('id', user.id)
        .single()

      // Check if profile exists and has any data
      const isProfileEmpty = !profile || (
        !profile.username &&
        !profile.bio &&
        !profile.avatar_url &&
        (!profile.tags || profile.tags.length === 0)
      )

      // Only redirect to onboarding if profile is completely empty
      if (isProfileEmpty) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }

      // Otherwise, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.error('Error in callback:', error)
      return NextResponse.redirect(new URL('/auth/join?error=server_error', request.url))
    }
  }

  // If no code is present, redirect to join page
  return NextResponse.redirect(new URL('/auth/join', request.url))
} 