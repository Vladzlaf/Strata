import { useEffect, useMemo, useState } from 'react'

import { ScrollTop, Spinner, Toaster } from '@/components'
import { fetchTracks, type Track } from '@/entities/track'
import { ExportMenu } from '@/features/export-menu'
import { ViewSwitcher } from '@/features/view-switcher'
import { useFavorites, useStuck, useUrlState, useViewMode } from '@/hooks'
import { durToSec, fmtTotal, signOutUser, toast, youtubePlaylistUrl, YT_PLAYLIST_MAX } from '@/lib'
import { StatsPanel } from '@/widgets/stats-panel'
import { TrackGallery } from '@/widgets/track-gallery'
import { TrackGrid } from '@/widgets/track-grid'
import { TrackList } from '@/widgets/track-list'

type SortKey = 'strata' | 'title' | 'artist' | 'longest'

const VIEWS = {
  grid: TrackGrid,
  list: TrackList,
  gallery: TrackGallery,
} as const

const SORTS: [SortKey, string][] = [
  ['strata', 'chronology'],
  ['title', 'title'],
  ['artist', 'artist'],
  ['longest', 'longest'],
]

const SORT_KEYS = SORTS.map(([k]) => k)

export function Collection() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let alive = true
    fetchTracks()
      .then((t) => {
        if (!alive) return
        setTracks(t)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  const [params, setParams] = useUrlState({ q: '', artist: '', sort: 'strata', fav: '' })
  const q = params.q
  const artist = params.artist
  const sort: SortKey = SORT_KEYS.includes(params.sort as SortKey)
    ? (params.sort as SortKey)
    : 'strata'
  const favOnly = params.fav === '1'
  const [view, setView] = useViewMode()
  const [sentinelRef, stuck] = useStuck<HTMLDivElement>()
  const { ids, count } = useFavorites()
  const [showStats, setShowStats] = useState(false)

  const topArtists = useMemo(() => {
    const c = new Map<string, number>()
    for (const t of tracks) {
      const a = (t.artist || '').trim()
      if (!a) continue
      c.set(a, (c.get(a) || 0) + 1)
    }
    return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24)
  }, [tracks])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let r = tracks.filter((t) => {
      if (favOnly && !ids.has(t.n)) return false
      if (artist && t.artist !== artist) return false
      if (!needle) return true
      return (
        t.title.toLowerCase().includes(needle) || (t.artist || '').toLowerCase().includes(needle)
      )
    })
    if (sort === 'title') r = [...r].sort((a, b) => a.title.localeCompare(b.title, 'en'))
    else if (sort === 'artist')
      r = [...r].sort((a, b) => (a.artist || '').localeCompare(b.artist || '', 'en'))
    else if (sort === 'longest') r = [...r].sort((a, b) => durToSec(b.dur) - durToSec(a.dur))
    return r
  }, [tracks, q, artist, sort, favOnly, ids])

  const totalSec = useMemo(() => filtered.reduce((s, t) => s + durToSec(t.dur), 0), [filtered])

  const ActiveView = VIEWS[view]

  const openPlaylist = () => {
    const ids = filtered.map((t) => t.yt).filter((id): id is string => Boolean(id))
    if (ids.length === 0) {
      toast('No YouTube links in this selection')
      return
    }
    window.open(youtubePlaylistUrl(ids.slice(0, YT_PLAYLIST_MAX)), '_blank', 'noopener,noreferrer')
    if (ids.length > YT_PLAYLIST_MAX) {
      toast(`Opened first ${YT_PLAYLIST_MAX} of ${ids.length}`)
    }
  }

  if (status === 'loading')
    return (
      <div className="loadscreen">
        <Spinner />
      </div>
    )
  if (status === 'error')
    return (
      <div className="loadscreen">
        <span>Couldn’t load the collection.</span>
        <button className="gate__btn" type="button" onClick={() => window.location.reload()}>
          retry
        </button>
      </div>
    )

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__brand">
          <h1 className="wordmark">STRATA</h1>
          <p className="tagline">Every track in the order it settled.</p>
        </div>
        <div className="masthead__meta">
          <dl className="counters">
            <div>
              <dt>records</dt>
              <dd>{tracks.length.toLocaleString('en')}</dd>
            </div>
            <div>
              <dt>shown</dt>
              <dd>{filtered.length.toLocaleString('en')}</dd>
            </div>
            <div>
              <dt>playtime</dt>
              <dd>{fmtTotal(totalSec)}</dd>
            </div>
          </dl>
          <button
            aria-expanded={showStats}
            aria-label="Toggle stats"
            className={`statsbtn ${showStats ? 'statsbtn--on' : ''}`}
            title="Stats"
            onClick={() => setShowStats((v) => !v)}
          >
            <svg aria-hidden fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
              <rect height="9" rx="1" width="4" x="3" y="11" />
              <rect height="14" rx="1" width="4" x="10" y="6" />
              <rect height="6" rx="1" width="4" x="17" y="14" />
            </svg>
          </button>
          <button
            aria-label="Open as YouTube playlist"
            className="statsbtn"
            title="Open shown tracks as a YouTube playlist"
            onClick={openPlaylist}
          >
            <svg aria-hidden fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
              <path d="M23 12s0-3.8-.5-5.6c-.3-1-1-1.8-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4c-1 .3-1.7 1-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6c.3 1 1 1.8 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4c1-.3 1.7-1 2-2C23 15.8 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
            </svg>
          </button>
          <ExportMenu favoriteIds={ids} tracks={tracks} />
          <button aria-label="Lock" className="statsbtn" title="Lock" onClick={() => signOutUser()}>
            <svg
              aria-hidden
              fill="none"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <rect height="10" rx="2" width="14" x="5" y="11" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </button>
        </div>
        {showStats ? <StatsPanel tracks={tracks} /> : null}
      </header>

      <div ref={sentinelRef} aria-hidden className="controls-sentinel" />
      <div className={`controls ${stuck ? 'controls--glass' : ''}`}>
        <input
          className="search"
          placeholder="search by title or artist…"
          type="search"
          value={q}
          onChange={(e) => setParams({ q: e.target.value })}
        />
        <div className="sortgroup">
          {SORTS.map(([k, label]) => (
            <button
              key={k}
              className={`chip ${sort === k ? 'chip--on' : ''}`}
              onClick={() => setParams({ sort: k })}
            >
              {label}
            </button>
          ))}
        </div>
        <ViewSwitcher value={view} onChange={setView} />
      </div>

      <div className="artistbar">
        <button
          className={`chip chip--fav ${favOnly ? 'chip--on' : ''}`}
          onClick={() => setParams({ fav: favOnly ? '' : '1' })}
        >
          ★ <span className="chip__n">{count}</span>
        </button>
        <button
          className={`chip ${artist === '' ? 'chip--on' : ''}`}
          onClick={() => setParams({ artist: '' })}
        >
          all artists
        </button>
        {topArtists.map(([a, n]) => (
          <button
            key={a}
            className={`chip ${artist === a ? 'chip--on' : ''}`}
            title={`${n} tracks`}
            onClick={() => setParams({ artist: artist === a ? '' : a })}
          >
            {a} <span className="chip__n">{n}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Nothing found. Reset the filter or change your query.</div>
      ) : (
        <ActiveView items={filtered} />
      )}

      <footer className="foot">
        <span>
          Strata — a personal archive. Covers and order taken from the original collection.
        </span>
      </footer>

      <ScrollTop />
      <Toaster />
    </div>
  )
}
