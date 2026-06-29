import { yandexMusicSearchUrl, youtubeSearchUrl } from '@/lib'

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
    </span>
  )
}
