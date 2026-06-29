export const youtubeSearchUrl = (query: string): string =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`

export const YT_PLAYLIST_MAX = 50

export const youtubePlaylistUrl = (ids: string[]): string =>
  `https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`
