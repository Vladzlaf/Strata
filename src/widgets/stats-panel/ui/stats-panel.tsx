import { useMemo } from 'react'

import type { Track } from '@/entities/track'
import { durToSec } from '@/lib'

interface StatsPanelProps {
  tracks: Track[]
}

const REMIX_RE =
  /remix|ремикс|slowed|sped[\s-]?up|phonk|фонк|nightcore|\bedit\b|cover|кавер|mashup|\bprod\b|bootleg|\bvip\b|\bflip\b|rework/i
const COLLAB_RE = /\bfeat\.?\b|\bft\.?\b| x | × | vs\.?\b|&/i
const CYR_RE = /[а-яё]/i

// overview of the whole collection (complements the live counters in the header)
export function StatsPanel({ tracks }: StatsPanelProps) {
  const s = useMemo(() => {
    const counts = new Map<string, number>()
    let totalSec = 0
    let withDur = 0
    let longest: Track | null = null
    let shortest: Track | null = null
    let longestSec = 0
    let shortestSec = Infinity
    let remixCount = 0
    let collabCount = 0
    let cyrCount = 0
    let longestTitle: Track | null = null
    let longestTitleLen = 0
    for (const t of tracks) {
      const a = (t.artist || '').trim()
      if (a) counts.set(a, (counts.get(a) || 0) + 1)
      if (REMIX_RE.test(t.title)) remixCount += 1
      if (COLLAB_RE.test(`${t.artist} ${t.title}`)) collabCount += 1
      if (CYR_RE.test(t.title)) cyrCount += 1
      if (t.title.length > longestTitleLen) {
        longestTitleLen = t.title.length
        longestTitle = t
      }
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
    const total = tracks.length || 1
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    return {
      artists: counts.size,
      solo: [...counts.values()].filter((c) => c === 1).length,
      avg: withDur ? Math.round(totalSec / withDur) : 0,
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      remixPct: Math.round((remixCount / total) * 100),
      collabPct: Math.round((collabCount / total) * 100),
      ruPct: Math.round((cyrCount / total) * 100),
      longest,
      shortest,
      longestTitle,
      longestTitleLen,
      top,
      max: top.length ? top[0][1] : 1,
    }
  }, [tracks])

  const fmtAvg = `${Math.floor(s.avg / 60)}:${String(s.avg % 60).padStart(2, '0')}`

  return (
    <section className="stats">
      <div className="stats__grid">
        <div className="stats__cell">
          <span className="stats__k">artists</span>
          <span className="stats__v">{s.artists.toLocaleString('en')}</span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">appear once</span>
          <span className="stats__v">{s.solo.toLocaleString('en')}</span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">non-stop</span>
          <span className="stats__v">
            {s.days}d {s.hours}h
          </span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">avg length</span>
          <span className="stats__v">{fmtAvg}</span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">remixes / edits</span>
          <span className="stats__v">{s.remixPct}%</span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">collabs</span>
          <span className="stats__v">{s.collabPct}%</span>
        </div>
        <div className="stats__cell">
          <span className="stats__k">russian titles</span>
          <span className="stats__v">{s.ruPct}%</span>
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
        {s.longestTitle ? (
          <div className="stats__cell">
            <span className="stats__k">longest title · {s.longestTitleLen} chars</span>
            <span className="stats__sub" title={s.longestTitle.title}>
              {s.longestTitle.title}
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
