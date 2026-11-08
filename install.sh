#!/usr/bin/env bash
# Site Timer installer (macOS). Run again any time to update.
#   curl -fsSL https://raw.githubusercontent.com/abhijitkar10/site-timer/main/install.sh | bash
set -euo pipefail

DIR="$HOME/.site-timer"
mkdir -p "$DIR"
curl -fsSL https://github.com/abhijitkar10/site-timer/archive/refs/heads/main.tar.gz \
  | tar xz --strip-components=1 -C "$DIR"
echo "Downloaded extension to $DIR"

found=0

# Helium (and other plain Chromium builds) honour --load-extension: fully automatic.
if [ -d /Applications/Helium.app ]; then
  found=1
  APP="$HOME/Applications/Helium Timer.app"
  mkdir -p "$HOME/Applications"
  osacompile -o "$APP" -e "do shell script \"open -a Helium --args --load-extension='$DIR'\""
  echo
  echo "Helium: done. Quit Helium (Cmd+Q), then open it with 'Helium Timer' from ~/Applications"
  echo "        (drag it to your Dock). The timer loads every time you start Helium that way."
fi

# Google Chrome blocks --load-extension, so the last step is 3 clicks.
if [ -d "/Applications/Google Chrome.app" ]; then
  found=1
  printf '%s' "$DIR" | pbcopy
  open -a "Google Chrome" "chrome://extensions"
  echo
  echo "Chrome: extensions page opened, folder path copied. Then:"
  echo "  1. Turn on 'Developer mode' (top right)"
  echo "  2. Click 'Load unpacked'"
  echo "  3. Press Cmd+Shift+G, Cmd+V, Enter, then 'Select'"
  echo "  Chrome remembers it after that; re-run this script to update."
fi

[ "$found" = 1 ] || echo "No Helium or Chrome found. Load $DIR via your browser's extensions page (Load unpacked)."
