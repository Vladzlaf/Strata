import { readFileSync, writeFileSync } from 'node:fs'

const PATH = './src/entities/track/model/tracks.json'
const FORCE = process.argv.includes('--all')

const tracks = JSON.parse(readFileSync(PATH, 'utf8'))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const tokens = (s) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .split(' ')
      .filter((w) => w.length >= 3),
  )

const looselyMatches = (query, artist, title) => {
  const want = tokens(query)
  const got = tokens(`${artist} ${title}`)
  for (const w of want) if (got.has(w)) return true
  return false
}

const save = () => writeFileSync(PATH, `${JSON.stringify(tracks, null, 2)}\n`)

let found = 0
let checked = 0

for (let i = 0; i < tracks.length; i++) {
  const t = tracks[i]
  if (!FORCE && t.preview) continue
  const term = `${t.artist} ${t.title}`.trim()
  const url = `https://api.deezer.com/search?limit=3&q=${encodeURIComponent(term)}`

  let data = null
  try {
    const res = await fetch(url)
    data = await res.json()
  } catch {
    data = null
  }

  if (data?.error) {
    console.log(`deezer throttle at ${i}, backing off 5s`)
    await sleep(5000)
    i -= 1
    continue
  }

  checked += 1
  const hit = data?.data?.find(
    (x) => x.preview && looselyMatches(term, x.artist?.name || '', x.title || ''),
  )
  if (hit) {
    t.preview = hit.preview
    found += 1
  }

  if (checked % 50 === 0) {
    console.log(`${i + 1}/${tracks.length} · matched ${found}`)
    save()
  }
  await sleep(200)
}

save()
console.log(`Done. ${found} of ${tracks.length} tracks have a 30s preview.`)
process.exit(0)
