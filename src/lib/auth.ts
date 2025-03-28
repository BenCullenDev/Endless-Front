import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useSignOut() {
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return signOut
} 