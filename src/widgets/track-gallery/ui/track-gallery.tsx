import { useCallback, useEffect, useRef, useState } from 'react'

import { Cover, FavoriteStar, MusicLinks } from '@/components'
import type { Track } from '@/entities/track'
import { BASE } from '@/shared/config'

interface TrackGalleryProps {
  items: Track[]
}

// large preview + horizontal filmstrip, like Finder's gallery view
export function TrackGallery({ items }: TrackGalleryProps) {
  const [sel, setSel] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  const idx = Math.min(sel, items.length - 1) // clamp when the filtered set shrinks
  const active = items[idx]

  const go = useCallback(
    (delta: number) => setSel((s) => Math.max(0, Math.min(items.length - 1, s + delta))),
    [items.length],
  )

  // arrow keys flip through tracks (unless the search box is focused)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // keep the active thumbnail in view
  useEffect(() => {
    const thumb = stripRef.current?.children[idx] as HTMLElement | undefined
    thumb?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [idx])

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
          <div className="tgal__actions">
            <FavoriteStar className="tgal__fav" n={active.n} />
            <MusicLinks
              labeled
              className="tgal__links"
              query={`${active.artist} ${active.title}`}
            />
          </div>
        </div>
      </div>
      <div ref={stripRef} className="tgal__strip">
        {items.map((t, i) => (
          <button
            key={t.n}
            className={`tgal__thumb ${i === idx ? 'tgal__thumb--on' : ''}`}
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
