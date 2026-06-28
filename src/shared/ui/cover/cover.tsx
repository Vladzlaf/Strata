import { useState } from 'react'

interface CoverProps {
  src: string
  alt: string
}

export function Cover({ src, alt }: CoverProps) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div aria-hidden className="cover cover--missing">
        ♪
      </div>
    )
  }
  return (
    <img
      alt={alt}
      className="cover"
      decoding="async"
      loading="lazy"
      src={src}
      onError={() => setErr(true)}
    />
  )
}
