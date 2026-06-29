on open location this_URL
	set theURL to this_URL
	if theURL starts with "ytmp3://" then set theURL to text 9 thru -1 of theURL
	set shellScript to "export PATH=/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin; mkdir -p \"$HOME/Downloads/strata\"; cd \"$HOME/Downloads/strata\"; D=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.unquote(sys.argv[1]))' \"$1\"); nohup yt-dlp --no-playlist -x --audio-format mp3 --audio-quality 0 -o '%(title)s.%(ext)s' \"$D\" >> \"$HOME/Downloads/strata/strata-dl.log\" 2>&1 &"
	do shell script "/bin/bash -c " & quoted form of shellScript & " bash " & quoted form of theURL
end open location
