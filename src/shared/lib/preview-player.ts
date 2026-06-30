let audio: HTMLAudioElement | null = null
let currentId: number | null = null
const listeners = new Set<() => void>()

const emit = () => {
  for (const l of listeners) l()
}

const ensure = () => {
  if (!audio && typeof window !== 'undefined') {
    audio = new Audio()
    audio.addEventListener('ended', () => {
      currentId = null
      emit()
    })
  }
  return audio
}

export const previewPlayer = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getCurrent: () => currentId,
  toggle(id: number, url: string) {
    const a = ensure()
    if (!a) return
    if (currentId === id) {
      a.pause()
      currentId = null
      emit()
      return
    }
    a.src = url
    a.play().catch(() => {
      currentId = null
      emit()
    })
    currentId = id
    emit()
  },
}
