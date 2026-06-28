import type { ReactNode } from 'react'

import type { ViewMode } from '@/hooks'

interface ViewSwitcherProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

const GridIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1.5" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" />
  </svg>
)

const ListIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="2" cy="3" r="1.3" />
    <rect x="5" y="2.2" width="10" height="1.6" rx="0.8" />
    <circle cx="2" cy="8" r="1.3" />
    <rect x="5" y="7.2" width="10" height="1.6" rx="0.8" />
    <circle cx="2" cy="13" r="1.3" />
    <rect x="5" y="12.2" width="10" height="1.6" rx="0.8" />
  </svg>
)

const ColumnsIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="4" height="14" rx="1" />
    <rect x="6" y="1" width="4" height="14" rx="1" />
    <rect x="11" y="1" width="4" height="14" rx="1" opacity="0.5" />
  </svg>
)

const GalleryIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="1" width="12" height="9" rx="1.5" />
    <rect x="2" y="12" width="3" height="3" rx="0.8" />
    <rect x="6.5" y="12" width="3" height="3" rx="0.8" />
    <rect x="11" y="12" width="3" height="3" rx="0.8" />
  </svg>
)

const OPTIONS: { mode: ViewMode; label: string; Icon: () => ReactNode }[] = [
  { mode: 'grid', label: 'Icons', Icon: GridIcon },
  { mode: 'list', label: 'List', Icon: ListIcon },
  { mode: 'columns', label: 'Columns', Icon: ColumnsIcon },
  { mode: 'gallery', label: 'Gallery', Icon: GalleryIcon },
]

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="viewswitch" role="group" aria-label="View mode">
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
