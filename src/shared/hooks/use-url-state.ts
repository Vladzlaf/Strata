import { useCallback, useEffect, useRef, useState } from 'react'

function parse<T extends Record<string, string>>(defaults: T): T {
  const p = new URLSearchParams(window.location.search)
  const out = { ...defaults }
  for (const k of Object.keys(defaults)) {
    const v = p.get(k)
    if (v !== null) out[k as keyof T] = v as T[keyof T]
  }
  return out
}

// Syncs a flat record of string params to the URL query string (shareable + reload-safe).
// Params equal to their default are omitted to keep the URL clean. Back/forward re-applies.
export function useUrlState<T extends Record<string, string>>(defaults: T) {
  const defaultsRef = useRef(defaults)
  const [state, setState] = useState<T>(() => parse(defaults))

  useEffect(() => {
    const p = new URLSearchParams()
    for (const k of Object.keys(state)) {
      const v = state[k]
      if (v && v !== defaultsRef.current[k]) p.set(k, v)
    }
    const qs = p.toString()
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [state])

  useEffect(() => {
    const onPop = () => setState(parse(defaultsRef.current))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const patch = useCallback((p: Partial<T>) => setState((s) => ({ ...s, ...p })), [])

  return [state, patch] as const
}
