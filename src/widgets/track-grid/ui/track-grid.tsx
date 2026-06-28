import { useCallback, useEffect, useRef, useState } from 'react'

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

// renders only rows near the viewport, so 2100+ cards stay smooth
export function TrackGrid({ items }: TrackGridProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [wrapW, setWrapW] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewH, setViewH] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)

  // measure container width so row height can follow the real (square) cover size
  useEffect(() => {
    const calc = () => {
      setWrapW(wrapRef.current?.clientWidth || window.innerWidth)
      setViewH(window.innerHeight)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const onScroll = useCallback(() => setScrollTop(window.scrollY), [])
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const w = wrapW || window.innerWidth
  const cols = Math.max(2, Math.floor(w / (MIN_COL + GAP)))
  const cellW = (w - (cols - 1) * GAP) / cols
  const coverH = cellW // cover is aspect-ratio 1, so its height equals the cell width
  const cardH = coverH + META_H
  const rowH = cardH + GAP

  const rows = Math.ceil(items.length / cols)
  const totalH = rows * rowH

  // reads layout from the ref during render — pre-existing behavior, preserved as-is
  /* eslint-disable react-hooks/refs */
  const wrapTop = wrapRef.current?.offsetTop || 0
  const rel = Math.max(0, scrollTop - wrapTop)
  /* eslint-enable react-hooks/refs */
  const firstRow = Math.max(0, Math.floor(rel / rowH) - 2)
  const visibleRows = Math.ceil(viewH / rowH) + 4
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
