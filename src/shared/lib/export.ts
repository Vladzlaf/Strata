type Exportable = { artist: string; title: string }

const esc = (s: string) => s.replace(/(["\\$`])/g, '\\$1')

const query = (t: Exportable) => `${t.artist} ${t.title}`.trim()

export const ytDlpCommand = (q: string) =>
  `yt-dlp -x --audio-format mp3 -o "%(title)s.%(ext)s" "ytsearch1:${esc(q.trim())}"`

export const tracksToJson = (tracks: Exportable[]) => JSON.stringify(tracks, null, 2)

export const tracksToQueries = (tracks: Exportable[]) =>
  `${tracks.map((t) => `ytsearch1:${query(t)}`).join('\n')}\n`

export const tracksToScript = (tracks: Exportable[]) =>
  `#!/usr/bin/env bash\nset -e\n${tracks.map((t) => ytDlpCommand(query(t))).join('\n')}\n`

export const downloadFile = (name: string, content: string, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
