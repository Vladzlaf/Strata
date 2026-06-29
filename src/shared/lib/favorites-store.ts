// tiny localStorage-backed store of favorite track numbers, shared via useSyncExternalStore
const KEY = 'strata:favs'

const load = (): Set<number> => {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set(JSON.parse(window.localStorage.getItem(KEY) || '[]') as number[])
  } catch {
    return new Set()
  }
}

let ids = load()
const listeners = new Set<() => void>()

export const favoritesStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot: () => ids,
  toggle(n: number) {
    const next = new Set(ids)
    if (next.has(n)) next.delete(n)
    else next.add(n)
    ids = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KEY, JSON.stringify([...ids]))
    }
    listeners.forEach((l) => l())
  },
}
