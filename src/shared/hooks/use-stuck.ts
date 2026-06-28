import { useEffect, useRef, useState } from 'react'

// Tracks whether a sticky element has reached the top. Place the returned ref on a
// zero-height sentinel right before the sticky element: once the sentinel scrolls
// above the viewport, the sticky element is pinned and `stuck` becomes true.
export function useStuck<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, stuck] as const
}
