'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-darker py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 border border-terminal-green shadow-[0_0_10px_var(--terminal-green)] p-8 rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-terminal-green">
            {isSignUp ? 'INITIALIZE NEW USER PROTOCOL' : 'AUTHORIZATION REQUIRED'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-terminal-dark border border-terminal-green text-terminal-green px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-terminal-green placeholder-terminal-green/50"
                placeholder="ENTER USER IDENTIFIER"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-terminal-dark border border-terminal-green text-terminal-green px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-terminal-green placeholder-terminal-green/50"
                placeholder="ENTER ACCESS CODE"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center shadow-[0_0_10px_var(--terminal-green)]">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-terminal-green text-terminal-green px-4 py-2 rounded hover:bg-terminal-green hover:text-terminal-darker transition-all duration-200 shadow-[0_0_10px_var(--terminal-green)]"
            >
              {loading ? 'PROCESSING...' : isSignUp ? 'INITIALIZE USER' : 'AUTHORIZE ACCESS'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-terminal-green hover:text-terminal-green/80 transition-colors"
          >
            {isSignUp
              ? 'EXISTING USER? AUTHORIZE ACCESS'
              : 'NEW USER? INITIALIZE PROTOCOL'}
          </button>
        </div>
      </div>
    </div>
  )
} 