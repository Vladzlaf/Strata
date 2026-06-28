import { useState } from 'react'

import { Cover } from '@/components'
import type { Track } from '@/entities/track'
import { BASE } from '@/shared/config'

interface TrackGalleryProps {
  items: Track[]
}

// large preview + horizontal filmstrip, like Finder's gallery view
export function TrackGallery({ items }: TrackGalleryProps) {
  const [sel, setSel] = useState(0)
  const active = items[sel] ?? items[0]
  if (!active) return null

  return (
    <div className="tgal">
      <div className="tgal__stage">
        <div className="tgal__cover">
          <Cover alt={`${active.artist} — ${active.title}`} src={`${BASE}${active.cover}`} />
        </div>
        <div className="tgal__meta">
          <span className="tgal__num">{String(active.n).padStart(4, '0')}</span>
          <h2 className="tgal__title">{active.title}</h2>
          <p className="tgal__artist">{active.artist || '—'}</p>
          {active.dur && <p className="tgal__dur">{active.dur}</p>}
        </div>
      </div>
      <div className="tgal__strip">
        {items.map((t, i) => (
          <button
            key={t.n}
            className={`tgal__thumb ${i === sel ? 'tgal__thumb--on' : ''}`}
            title={`${t.title} — ${t.artist || '—'}`}
            onClick={() => setSel(i)}
          >
            <Cover alt={t.title} src={`${BASE}${t.cover}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
