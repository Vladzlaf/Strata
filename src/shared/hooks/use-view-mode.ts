import { useEffect, useState } from 'react'

export type ViewMode = 'grid' | 'list' | 'columns' | 'gallery'

export const VIEW_MODES: ViewMode[] = ['grid', 'list', 'columns', 'gallery']

const KEY = 'strata:view'

const read = (): ViewMode => {
  if (typeof window === 'undefined') return 'grid'
  const v = window.localStorage.getItem(KEY)
  return v && (VIEW_MODES as string[]).includes(v) ? (v as ViewMode) : 'grid'
}

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>(read)
  useEffect(() => {
    window.localStorage.setItem(KEY, mode)
  }, [mode])
  return [mode, setMode] as const
}
