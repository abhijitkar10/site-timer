#!/usr/bin/env bash
# Site Timer installer (macOS). Run again any time to update.
#   curl -fsSL https://raw.githubusercontent.com/abhijitkar10/site-timer/main/install.sh | bash
#   ... | bash -s helium      # only one browser
set -euo pipefail

DIR="$HOME/.site-timer"
mkdir -p "$DIR"
curl -fsSL https://github.com/abhijitkar10/site-timer/archive/refs/heads/main.tar.gz \
  | tar xz --strip-components=1 -C "$DIR"
echo "Downloaded extension to $DIR"

# Browsers block scripts from adding extensions, so: open the extensions page + copy the path.
want=$(printf '%s' "${1:-}" | tr '[:upper:]' '[:lower:]')
found=0
for app in "Helium" "Google Chrome" "Brave Browser" "Microsoft Edge" "Arc" "Vivaldi" "Chromium"; do
  [ -d "/Applications/$app.app" ] || continue
  case "$(printf '%s' "$app" | tr '[:upper:]' '[:lower:]')" in *"$want"*) ;; *) continue ;; esac
  open -a "$app" "chrome://extensions"
  echo "Opened $app's extensions page."
  found=1
done

if [ "$found" = 1 ]; then
  printf '%s' "$DIR" | pbcopy
  echo
  echo "Folder path copied. On the extensions page:"
  echo "  1. Turn on 'Developer mode' (top right)"
  echo "  2. Click 'Load unpacked'"
  echo "  3. Press Cmd+Shift+G, Cmd+V, Enter, then 'Select'"
  echo "First time only. To update later: re-run this, then click the reload arrow on Site Timer."
else
  echo "No matching browser found. Load $DIR via your browser's extensions page (Load unpacked)."
fi
