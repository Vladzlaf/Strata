import { useSyncExternalStore } from 'react'

import { previewPlayer } from '@/lib'

export function usePreviewCurrent() {
  return useSyncExternalStore(
    previewPlayer.subscribe,
    previewPlayer.getCurrent,
    previewPlayer.getCurrent,
  )
}
