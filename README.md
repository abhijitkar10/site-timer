# Site Timer

Stops doomscrolling: give each site a time limit. Opening the site starts its countdown; at zero you
get a notification and the tab closes. Open it again and the countdown starts fresh.

- Each site has its own limit (YouTube, Instagram, X, Reddit, Facebook, TikTok: 10 min by default).
- The countdown sits in the bottom-right corner and turns red in the last minute.
- Every other site shows a count-up timer instead.
- Time only counts while the tab is visible. Click the timer to hide it.

**Settings**: click the extension's toolbar icon (pin it via the puzzle-piece menu). One line per
site, `site minutes`, e.g. `youtube.com 15`. `* 10` = every other site. **+ Add this site** adds the
site you're on with the default minutes.

## Install (macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/abhijitkar10/site-timer/main/install.sh | bash
```

- **Helium**: fully automatic. Open Helium via the `Helium Timer` app the script creates.
- **Chrome**: Chrome won't let scripts add extensions, so the script opens `chrome://extensions`
  and copies the folder path; you click Developer mode → Load unpacked → paste.
- **Any other Chromium browser**: Load unpacked `~/.site-timer` from its extensions page.

Notifications need your browser allowed in macOS System Settings → Notifications.
