import { useEffect, useState } from 'react'

export function ScrollTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      aria-label="Scroll to top"
      className="scrolltop"
      title="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg
        aria-hidden
        fill="none"
        height="18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
