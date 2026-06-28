import { youtubeSearchUrl } from '@/lib'

interface YoutubeLinkProps {
  query: string
  label?: string
  className?: string
}

export function YoutubeLink({ query, label, className }: YoutubeLinkProps) {
  return (
    <a
      aria-label="Find on YouTube"
      className={className ? `yt ${className}` : 'yt'}
      href={youtubeSearchUrl(query)}
      rel="noreferrer"
      target="_blank"
      title="Find on YouTube"
      onClick={(e) => e.stopPropagation()}
    >
      <svg aria-hidden fill="currentColor" height="15" viewBox="0 0 24 24" width="15">
        <path d="M23 12s0-3.8-.5-5.6c-.3-1-1-1.8-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4c-1 .3-1.7 1-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6c.3 1 1 1.8 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4c1-.3 1.7-1 2-2C23 15.8 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
      </svg>
      {label ? <span className="yt__label">{label}</span> : null}
    </a>
  )
}
