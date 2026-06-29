import { Cover, FavoriteStar, MusicLinks } from '@/components'
import { BASE } from '@/shared/config'

import type { Track } from '../../model/track.interface'

interface CardProps {
  t: Track
}

export function Card({ t }: CardProps) {
  return (
    <figure className="card">
      <div className="card__art">
        <Cover alt={`${t.artist} — ${t.title}`} src={`${BASE}${t.cover}`} />
        <span className="card__depth">{String(t.n).padStart(4, '0')}</span>
        <FavoriteStar className="card__fav" n={t.n} />
        <MusicLinks className="card__links" query={`${t.artist} ${t.title}`} />
      </div>
      <figcaption className="card__meta">
        <span className="card__title" title={t.title}>
          {t.title}
        </span>
        <span className="card__artist" title={t.artist}>
          {t.artist || '—'}
        </span>
        {t.dur && <span className="card__dur">{t.dur}</span>}
      </figcaption>
    </figure>
  )
}
