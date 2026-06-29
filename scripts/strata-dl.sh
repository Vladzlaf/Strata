#!/usr/bin/env bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin"
DIR="$HOME/strata"
Q=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.unquote(sys.argv[1]))' "$1")
NAME=$(printf '%s' "${Q#ytsearch1:}" | tr -d '"\\')
mkdir -p "$DIR"
cd "$DIR" || exit 1
notify() {
  if command -v terminal-notifier >/dev/null 2>&1; then
    terminal-notifier -title "Strata" -subtitle "$1" -message "$NAME" -group strata -sound "$2" >/dev/null 2>&1
  else
    osascript -e "display notification \"$NAME\" with title \"Strata\" subtitle \"$1\"" >/dev/null 2>&1
  fi
}
if yt-dlp --no-playlist -x --audio-format mp3 --audio-quality 0 --cookies-from-browser chrome -o '%(title)s.%(ext)s' "$Q" >>"$DIR/strata-dl.log" 2>&1; then
  notify "Downloaded" "Glass"
else
  notify "Failed" "Basso"
fi
