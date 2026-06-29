export const durToSec = (d: string): number => {
  if (!d) return 0
  const [m, s] = d.split(':').map(Number)
  return (m || 0) * 60 + (s || 0)
}

export const fmtTotal = (sec: number): string => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h} h ${m} min` : `${m} min`
}

export const fmtClock = (sec: number): string => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
