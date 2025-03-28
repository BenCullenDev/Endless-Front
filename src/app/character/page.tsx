'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Character {
  id: string
  name: string
  user_id: string
  created_at: string
}

export default function CharacterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [character, setCharacter] = useState<Character | null>(null)
  const [newCharacterName, setNewCharacterName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      // Fetch character data
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
        setError('Error fetching character data')
      } else {
        setCharacter(character)
      }
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            name: newCharacterName,
            user_id: session.user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      setCharacter(data)
      setSuccess('Character created successfully!')
      setNewCharacterName('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating character')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center">Loading...</div>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <h1 className="text-3xl mb-6">Character Management</h1>
          
          {character ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Character Name</label>
                <div className="terminal-input">{character.name}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateCharacter} className="space-y-6">
              <div>
                <label htmlFor="character-name" className="block mb-2">
                  Create Your Character
                </label>
                <Input
                  id="character-name"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  placeholder="Enter character name"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-[#4AF626]">
                  {success}
                </div>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Character'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
} 