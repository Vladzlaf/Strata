import { useFavorites } from '@/hooks'

interface FavoriteStarProps {
  n: number
  className?: string
}

export function FavoriteStar({ n, className }: FavoriteStarProps) {
  const { has, toggle } = useFavorites()
  const on = has(n)
  return (
    <button
      aria-label={on ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={on}
      className={`fav ${on ? 'fav--on' : ''} ${className ?? ''}`}
      title={on ? 'Remove from favorites' : 'Add to favorites'}
      onClick={(e) => {
        e.stopPropagation()
        toggle(n)
      }}
    >
      <svg aria-hidden height="16" viewBox="0 0 24 24" width="16">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </button>
  )
}
