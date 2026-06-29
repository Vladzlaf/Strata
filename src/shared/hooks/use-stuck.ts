import { useEffect, useRef, useState } from 'react'

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
