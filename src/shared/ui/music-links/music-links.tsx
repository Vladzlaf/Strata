import { spotifySearchUrl, yandexMusicSearchUrl, youtubeSearchUrl } from '@/lib'

interface MusicLinksProps {
  query: string
  labeled?: boolean
  className?: string
}

const YtIcon = () => (
  <svg aria-hidden fill="currentColor" height="15" viewBox="0 0 24 24" width="15">
    <path d="M23 12s0-3.8-.5-5.6c-.3-1-1-1.8-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4c-1 .3-1.7 1-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6c.3 1 1 1.8 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4c1-.3 1.7-1 2-2C23 15.8 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
  </svg>
)

const YmIcon = () => (
  <svg aria-hidden height="15" viewBox="0 0 16 16" width="15">
    <rect fill="currentColor" height="16" rx="4" width="16" />
    <text
      fill="var(--bg)"
      fontFamily="'Space Mono', monospace"
      fontSize="10"
      fontWeight="700"
      textAnchor="middle"
      x="8"
      y="11.6"
    >
      Я
    </text>
  </svg>
)

const SpIcon = () => (
  <svg aria-hidden fill="currentColor" height="15" viewBox="0 0 24 24" width="15">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.21c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.85zm1.23-2.74a.78.78 0 01-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 11-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.37.22.49.7.25 1.07zm.11-2.85C14.84 8.95 9.6 8.79 6.7 9.67a.93.93 0 11-.54-1.78c3.33-1.01 9.11-.82 12.71 1.32a.93.93 0 01-.95 1.6z" />
  </svg>
)

export function MusicLinks({ query, labeled, className }: MusicLinksProps) {
  return (
    <span className={`svclinks ${labeled ? 'svclinks--labeled' : ''} ${className ?? ''}`}>
      <a
        aria-label="Find on YouTube"
        className="svc svc--yt"
        href={youtubeSearchUrl(query)}
        rel="noreferrer"
        target="_blank"
        title="Find on YouTube"
        onClick={(e) => e.stopPropagation()}
      >
        <YtIcon />
        {labeled ? <span className="svc__label">YouTube</span> : null}
      </a>
      <a
        aria-label="Найти в Яндекс Музыке"
        className="svc svc--ym"
        href={yandexMusicSearchUrl(query)}
        rel="noreferrer"
        target="_blank"
        title="Найти в Яндекс Музыке"
        onClick={(e) => e.stopPropagation()}
      >
        <YmIcon />
        {labeled ? <span className="svc__label">Я.Музыка</span> : null}
      </a>
      <a
        aria-label="Find on Spotify"
        className="svc svc--sp"
        href={spotifySearchUrl(query)}
        rel="noreferrer"
        target="_blank"
        title="Find on Spotify"
        onClick={(e) => e.stopPropagation()}
      >
        <SpIcon />
        {labeled ? <span className="svc__label">Spotify</span> : null}
      </a>
    </span>
  )
}
