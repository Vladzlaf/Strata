export const yandexMusicSearchUrl = (query: string): string =>
  `https://music.yandex.ru/search?text=${encodeURIComponent(query.trim())}`
