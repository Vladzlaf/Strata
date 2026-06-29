import { useEffect, useRef, useState } from 'react'

import type { Track } from '@/entities/track'
import { downloadFile, tracksToJson, tracksToQueries, tracksToScript } from '@/lib'

interface ExportMenuProps {
  tracks: Track[]
  favoriteIds: Set<number>
}

export function ExportMenu({ tracks, favoriteIds }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const favorites = tracks.filter((t) => favoriteIds.has(t.n))

  const items = [
    {
      label: 'Backup · collection.json',
      run: () => downloadFile('strata.json', tracksToJson(tracks), 'application/json'),
      disabled: tracks.length === 0,
    },
    {
      label: `Favorites · queries.txt (${favorites.length})`,
      run: () => downloadFile('strata-favorites.txt', tracksToQueries(favorites)),
      disabled: favorites.length === 0,
    },
    {
      label: `Favorites · download.sh (${favorites.length})`,
      run: () => downloadFile('strata-favorites.sh', tracksToScript(favorites), 'application/x-sh'),
      disabled: favorites.length === 0,
    },
    {
      label: `All · queries.txt (${tracks.length})`,
      run: () => downloadFile('strata-all.txt', tracksToQueries(tracks)),
      disabled: tracks.length === 0,
    },
  ]

  return (
    <div ref={ref} className="export">
      <button
        aria-expanded={open}
        aria-label="Export"
        className={`statsbtn ${open ? 'statsbtn--on' : ''}`}
        title="Export"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          aria-hidden
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
        </svg>
      </button>
      {open ? (
        <div className="export__menu" role="menu">
          {items.map((it) => (
            <button
              key={it.label}
              className="export__item"
              disabled={it.disabled}
              role="menuitem"
              type="button"
              onClick={() => {
                it.run()
                setOpen(false)
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
