import type { ReactNode } from 'react'

import type { ViewMode } from '@/hooks'

interface ViewSwitcherProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

const GridIcon = () => (
  <svg aria-hidden fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <rect height="6" rx="1.5" width="6" x="1" y="1" />
    <rect height="6" rx="1.5" width="6" x="9" y="1" />
    <rect height="6" rx="1.5" width="6" x="1" y="9" />
    <rect height="6" rx="1.5" width="6" x="9" y="9" />
  </svg>
)

const ListIcon = () => (
  <svg aria-hidden fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <circle cx="2" cy="3" r="1.3" />
    <rect height="1.6" rx="0.8" width="10" x="5" y="2.2" />
    <circle cx="2" cy="8" r="1.3" />
    <rect height="1.6" rx="0.8" width="10" x="5" y="7.2" />
    <circle cx="2" cy="13" r="1.3" />
    <rect height="1.6" rx="0.8" width="10" x="5" y="12.2" />
  </svg>
)

const GalleryIcon = () => (
  <svg aria-hidden fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <rect height="9" rx="1.5" width="12" x="2" y="1" />
    <rect height="3" rx="0.8" width="3" x="2" y="12" />
    <rect height="3" rx="0.8" width="3" x="6.5" y="12" />
    <rect height="3" rx="0.8" width="3" x="11" y="12" />
  </svg>
)

const OPTIONS: { mode: ViewMode; label: string; Icon: () => ReactNode }[] = [
  { mode: 'grid', label: 'Icons', Icon: GridIcon },
  { mode: 'list', label: 'List', Icon: ListIcon },
  { mode: 'gallery', label: 'Gallery', Icon: GalleryIcon },
]

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div aria-label="View mode" className="viewswitch" role="group">
      {OPTIONS.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          aria-label={label}
          aria-pressed={value === mode}
          className={`viewswitch__btn ${value === mode ? 'viewswitch__btn--on' : ''}`}
          title={label}
          onClick={() => onChange(mode)}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
