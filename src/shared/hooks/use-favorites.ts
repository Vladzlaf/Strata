import { useSyncExternalStore } from 'react'

import { favoritesStore } from '@/lib'

export function useFavorites() {
  const ids = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getSnapshot,
  )
  return {
    ids,
    count: ids.size,
    has: (n: number) => ids.has(n),
    toggle: favoritesStore.toggle,
  }
}
