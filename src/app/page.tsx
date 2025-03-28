'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      }
    }

    checkUser()
  }, [router, supabase.auth])

  return (
    <DashboardLayout>
      <Card>
        <h1 className="text-3xl mb-6">Welcome to ENDLESS</h1>
        <p>Your terminal to infinite possibilities.</p>
      </Card>
    </DashboardLayout>
  )
}
