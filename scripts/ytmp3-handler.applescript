on open location this_URL
	set theURL to this_URL
	if theURL starts with "ytmp3://" then set theURL to text 9 thru -1 of theURL
	set helperPath to (POSIX path of (path to home folder)) & ".config/yt-dlp/strata-dl.sh"
	do shell script "nohup /bin/bash " & quoted form of helperPath & " " & quoted form of theURL & " >/dev/null 2>&1 &"
end open location
