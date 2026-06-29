// One-time (re-runnable) upload of the collection metadata into Firestore.
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json node scripts/upload-tracks.mjs
// or place the key at ./serviceAccount.json and just run `pnpm upload-tracks`.
import { readFileSync } from 'node:fs'

import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccount.json'
const dataPath = './src/entities/track/model/tracks.json'

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))
const tracks = JSON.parse(readFileSync(dataPath, 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

await db.doc('strata/tracks').set({ tracks })
console.log(`Uploaded ${tracks.length} tracks to Firestore doc strata/tracks`)
process.exit(0)
