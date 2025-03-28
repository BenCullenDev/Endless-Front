'use client'

import { useEffect, useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terminal-darker">
        <div className="text-terminal-green text-xl shadow-[0_0_10px_var(--terminal-green)]">INITIALIZING SYSTEM...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-darker">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-terminal-dark border border-terminal-green shadow-[0_0_10px_var(--terminal-green)] rounded-lg p-8">
          <h1 className="text-4xl font-bold text-terminal-green mb-8 text-center">
            WELCOME, USER {user.email}
          </h1>
          <div className="space-y-4">
            <p className="text-terminal-green text-center">
              SYSTEM READY FOR COMMANDS
            </p>
            <button
              onClick={handleSignOut}
              className="w-full bg-transparent border border-terminal-green text-terminal-green px-4 py-2 rounded hover:bg-terminal-green hover:text-terminal-darker transition-all duration-200 shadow-[0_0_10px_var(--terminal-green)]"
            >
              TERMINATE SESSION
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
