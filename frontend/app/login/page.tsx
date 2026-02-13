'use client'

import LoginPage from '../LoginPage'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error // The LoginPage will catch this and show the error message
    }

    router.push('/') // Redirect to home on success
    router.refresh() // Refresh to ensure server components update with new session
  }

  return <LoginPage onLogin={handleLogin} />
}
