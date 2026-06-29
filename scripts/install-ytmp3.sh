#!/usr/bin/env bash
set -e

APP="$HOME/Applications/ytmp3.app"
SRC="$(cd "$(dirname "$0")" && pwd)/ytmp3-handler.applescript"
PB=/usr/libexec/PlistBuddy
PL="$APP/Contents/Info.plist"

mkdir -p "$HOME/Applications"
rm -rf "$APP"
osacompile -o "$APP" "$SRC"

"$PB" -c "Add :CFBundleIdentifier string com.strata.ytmp3" "$PL" 2>/dev/null || "$PB" -c "Set :CFBundleIdentifier com.strata.ytmp3" "$PL"
"$PB" -c "Add :LSUIElement bool true" "$PL" 2>/dev/null || true
"$PB" -c "Add :CFBundleURLTypes array" "$PL" 2>/dev/null || true
"$PB" -c "Add :CFBundleURLTypes:0 dict" "$PL" 2>/dev/null || true
"$PB" -c "Add :CFBundleURLTypes:0:CFBundleURLName string Strata ytmp3" "$PL" 2>/dev/null || true
"$PB" -c "Add :CFBundleURLTypes:0:CFBundleURLSchemes array" "$PL" 2>/dev/null || true
"$PB" -c "Add :CFBundleURLTypes:0:CFBundleURLSchemes:0 string ytmp3" "$PL" 2>/dev/null || true

codesign --force --deep -s - "$APP"
open "$APP"

echo "ytmp3 handler (re)installed at $APP"
