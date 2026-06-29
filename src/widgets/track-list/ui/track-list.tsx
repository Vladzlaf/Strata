import { useEffect, useRef, useState } from 'react'

import { Cover, FavoriteStar, MusicLinks } from '@/components'
import type { Track } from '@/entities/track'
import { BASE } from '@/shared/config'

interface TrackListProps {
  items: Track[]
}

const ROW_H = 56

export function TrackList({ items }: TrackListProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [viewH, setViewH] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)
  const [first, setFirst] = useState(0)

  useEffect(() => {
    const measure = () => setViewH(window.innerHeight)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = wrapRef.current
        if (!el) return
        const rel = Math.max(0, window.scrollY - el.offsetTop)
        setFirst(Math.max(0, Math.floor(rel / ROW_H) - 4))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const totalH = items.length * ROW_H
  const firstRow = Math.min(first, Math.max(0, items.length - 1))
  const last = Math.min(items.length, firstRow + Math.ceil(viewH / ROW_H) + 8)

  const rows: number[] = []
  for (let i = firstRow; i < last; i++) rows.push(i)

  return (
    <div ref={wrapRef} className="tlist" style={{ height: totalH }}>
      {rows.map((i) => {
        const t = items[i]
        return (
          <div key={t.n} className="tlist__row" style={{ top: i * ROW_H }}>
            <span className="tlist__n">{String(t.n).padStart(4, '0')}</span>
            <span className="tlist__thumb">
              <Cover alt={`${t.artist} — ${t.title}`} src={`${BASE}${t.cover}`} />
            </span>
            <span className="tlist__title" title={t.title}>
              {t.title}
            </span>
            <span className="tlist__artist" title={t.artist}>
              {t.artist || '—'}
            </span>
            <FavoriteStar className="tlist__fav" n={t.n} />
            <MusicLinks className="tlist__links" query={`${t.artist} ${t.title}`} />
            <span className="tlist__dur">{t.dur}</span>
          </div>
        )
      })}
    </div>
  )
}
