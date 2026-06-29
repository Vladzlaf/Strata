import { useMemo } from 'react'

import { type Track, tracks } from '@/entities/track'
import { durToSec, fmtClock } from '@/lib'

// overview of the whole collection (complements the live counters in the header)
export function StatsPanel() {
  const s = useMemo(() => {
    const counts = new Map<string, number>()
    let totalSec = 0
    let withDur = 0
    let longest: Track | null = null
    let shortest: Track | null = null
    let longestSec = 0
    let shortestSec = Infinity
    for (const t of tracks) {
      const a = (t.artist || '').trim()
      if (a) counts.set(a, (counts.get(a) || 0) + 1)
      const sec = durToSec(t.dur)
      if (sec > 0) {
        totalSec += sec
        withDur += 1
        if (sec > longestSec) {
          longestSec = sec
          longest = t
        }
        if (sec < shortestSec) {
          shortestSec = sec
          shortest = t
        }
      }
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    return {
      artists: counts.size,
      avg: withDur ? Math.round(totalSec / withDur) : 0,
      longest,
      shortest,
      top,
      max: top.length ? top[0][1] : 1,
    }
  }, [])

  return (
    <section className="stats">
      <div className="stats__grid">
        <div className="stats__cell">
          <span className="stats__k">artists</span>
          <span className="stats__v">{s.artists.toLocaleString('en')}</span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">avg length</span>
          <span className="stats__v">{fmtClock(s.avg)}</span>
        </div>
        {s.longest ? (
          <div className="stats__cell">
            <span className="stats__k">longest</span>
            <span className="stats__v">{s.longest.dur}</span>
            <span className="stats__sub" title={s.longest.title}>
              {s.longest.title}
            </span>
          </div>
        ) : null}
        {s.shortest ? (
          <div className="stats__cell">
            <span className="stats__k">shortest</span>
            <span className="stats__v">{s.shortest.dur}</span>
            <span className="stats__sub" title={s.shortest.title}>
              {s.shortest.title}
            </span>
          </div>
        ) : null}
      </div>

      <div className="stats__top">
        <h3 className="stats__h">top artists</h3>
        <ul className="stats__bars">
          {s.top.map(([artist, n]) => (
            <li key={artist} className="stats__bar">
              <span className="stats__bar-name" title={artist}>
                {artist}
              </span>
              <span className="stats__bar-track">
                <span className="stats__bar-fill" style={{ width: `${(n / s.max) * 100}%` }} />
              </span>
              <span className="stats__bar-n">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
