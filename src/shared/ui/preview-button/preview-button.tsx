import { usePreviewCurrent } from '@/hooks'
import { previewPlayer } from '@/lib'

interface PreviewButtonProps {
  n: number
  url: string
  className?: string
}

const PlayIcon = () => (
  <svg aria-hidden fill="currentColor" height="15" viewBox="0 0 24 24" width="15">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const PauseIcon = () => (
  <svg aria-hidden fill="currentColor" height="15" viewBox="0 0 24 24" width="15">
    <rect height="14" rx="1" width="4" x="6" y="5" />
    <rect height="14" rx="1" width="4" x="14" y="5" />
  </svg>
)

export function PreviewButton({ n, url, className }: PreviewButtonProps) {
  const current = usePreviewCurrent()
  const playing = current === n
  return (
    <button
      aria-label={playing ? 'Pause preview' : 'Play 30-second preview'}
      className={`preview ${playing ? 'preview--on' : ''} ${className ?? ''}`}
      title={playing ? 'Pause' : 'Play 30s preview'}
      onClick={(e) => {
        e.stopPropagation()
        previewPlayer.toggle(n, url)
      }}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}
