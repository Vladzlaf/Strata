import { useEffect, useRef, useState } from 'react'

import { Card, type Track } from '@/entities/track'

interface TrackGridProps {
  items: Track[]
}

interface Cell {
  t: Track
  top: number
  left: number
  width: number
  height: number
}

const GAP = 16
const MIN_COL = 132
const META_H = 74 // reserved space for title (2 lines) + artist + duration, keep in sync with css

// renders only rows near the viewport, so 2100+ cards stay smooth.
// re-renders only when the visible row window changes, not on every scroll frame.
export function TrackGrid({ items }: TrackGridProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [wrapW, setWrapW] = useState(0)
  const [viewH, setViewH] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)
  const [first, setFirst] = useState(0)

  useEffect(() => {
    const measure = () => {
      setWrapW(wrapRef.current?.clientWidth || window.innerWidth)
      setViewH(window.innerHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // rAF-throttled scroll: compute the first visible row from the ref (event time, not render)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = wrapRef.current
        if (!el) return
        const cw = el.clientWidth
        const cols = Math.max(2, Math.floor(cw / (MIN_COL + GAP)))
        const cellW = (cw - (cols - 1) * GAP) / cols
        const rowH = cellW + META_H + GAP
        const rel = Math.max(0, window.scrollY - el.offsetTop)
        setFirst(Math.max(0, Math.floor(rel / rowH) - 2))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const w = wrapW || (typeof window !== 'undefined' ? window.innerWidth : 1000)
  const cols = Math.max(2, Math.floor(w / (MIN_COL + GAP)))
  const cellW = (w - (cols - 1) * GAP) / cols
  const cardH = cellW + META_H // cover is aspect-ratio 1, so its height equals the cell width
  const rowH = cardH + GAP

  const rows = Math.ceil(items.length / cols)
  const totalH = rows * rowH
  const firstRow = Math.min(first, Math.max(0, rows - 1))
  const visibleRows = Math.ceil(viewH / rowH) + 6
  const lastRow = Math.min(rows, firstRow + visibleRows)

  const slice: Cell[] = []
  for (let r = firstRow; r < lastRow; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      if (i >= items.length) break
      slice.push({
        t: items[i],
        top: r * rowH,
        left: c * (cellW + GAP),
        width: cellW,
        height: cardH,
      })
    }
  }

  return (
    <div ref={wrapRef} className="grid" style={{ height: totalH }}>
      {slice.map(({ t, top, left, width, height }) => (
        <div key={t.n} className="grid__cell" style={{ top, left, width, height }}>
          <Card t={t} />
        </div>
      ))}
    </div>
  )
}
