'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Character {
  id: string
  name: string
}

export default function Home() {
  const router = useRouter()
  const supabase = createClient()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

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
        .select('id, name')
        .eq('user_id', session.user.id)
        .single()

      if (!error) {
        setCharacter(character)
      }
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

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
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-mono mb-8">ENDLESS FRONT</h1>
            {character ? (
              <div className="space-y-4">
                <p className="text-2xl">Welcome back, {character.name}</p>
                <p className="text-lg opacity-80">Your adventure continues...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xl">Welcome to the frontlines</p>
                <p className="text-lg opacity-80">Begin your journey by creating a character</p>
                <Link href="/character">
                  <Button className="mt-4">
                    Create Your Character
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
