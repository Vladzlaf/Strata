import { useCallback, useEffect, useRef, useState } from 'react'

import { Cover, FavoriteStar, MusicLinks } from '@/components'
import type { Track } from '@/entities/track'
import { BASE } from '@/shared/config'

interface TrackListProps {
  items: Track[]
}

const ROW_H = 56

// single-column virtualized list, like Finder's list view
export function TrackList({ items }: TrackListProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewH, setViewH] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)

  const onScroll = useCallback(() => setScrollTop(window.scrollY), [])
  useEffect(() => {
    const onResize = () => setViewH(window.innerHeight)
    onResize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [onScroll])

  const totalH = items.length * ROW_H
  /* eslint-disable react-hooks/refs */
  const wrapTop = wrapRef.current?.offsetTop || 0
  const rel = Math.max(0, scrollTop - wrapTop)
  /* eslint-enable react-hooks/refs */
  const first = Math.max(0, Math.floor(rel / ROW_H) - 4)
  const last = Math.min(items.length, first + Math.ceil(viewH / ROW_H) + 8)

  const rows: number[] = []
  for (let i = first; i < last; i++) rows.push(i)

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
