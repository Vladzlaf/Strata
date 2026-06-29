import { AuthGate } from '@/features/auth-gate'
import { useAuth } from '@/hooks'

import { Collection } from './Collection'

export function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loadscreen">…</div>
  if (!user) return <AuthGate />
  return <Collection />
}
