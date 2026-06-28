import { useMemo, useState } from 'react'

import { Cover } from '@/components'
import type { Track } from '@/entities/track'
import { BASE } from '@/shared/config'

interface TrackColumnsProps {
  items: Track[]
}

// Miller-columns repurposed for flat data: artists on the left, their tracks on the right
export function TrackColumns({ items }: TrackColumnsProps) {
  const groups = useMemo(() => {
    const m = new Map<string, Track[]>()
    for (const t of items) {
      const a = (t.artist || '').trim() || '—'
      const arr = m.get(a)
      if (arr) arr.push(t)
      else m.set(a, [t])
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [items])

  const [sel, setSel] = useState<string | null>(null)
  const active = groups.find(([a]) => a === sel) ?? groups[0]

  return (
    <div className="tcol">
      <div className="tcol__pane tcol__artists">
        {groups.map(([artist, tracks]) => (
          <button
            key={artist}
            className={`tcol__item ${artist === active?.[0] ? 'tcol__item--on' : ''}`}
            onClick={() => setSel(artist)}
          >
            <span className="tcol__name">{artist}</span>
            <span className="tcol__count">{tracks.length}</span>
          </button>
        ))}
      </div>
      <div className="tcol__pane tcol__tracks">
        {active?.[1].map((t) => (
          <div key={t.n} className="tcol__track">
            <span className="tcol__thumb">
              <Cover alt={`${t.artist} — ${t.title}`} src={`${BASE}${t.cover}`} />
            </span>
            <span className="tcol__ttitle" title={t.title}>
              {t.title}
            </span>
            <span className="tcol__tdur">{t.dur}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
