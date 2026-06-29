import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/lib'

import type { Track } from '../model/track.interface'

// the collection metadata lives in a single Firestore doc, gated by auth rules
export async function fetchTracks(): Promise<Track[]> {
  const snap = await getDoc(doc(db, 'strata', 'tracks'))
  if (!snap.exists()) return []
  return (snap.data().tracks ?? []) as Track[]
}
