# Site Timer

A small timer in the bottom-right corner of every website, to stop doomscrolling.

- **Countdown sites** (YouTube, Instagram, X, Reddit, Facebook, TikTok by default): a daily
  countdown per site (10 min default). Reloading doesn't reset it. At zero the page is covered,
  videos pause and scrolling stops; "5 more minutes" is the only way back in. Resets at midnight.
- **Every other site**: a count-up timer showing how long you've been on the page.
- Time only counts while the tab is visible. Click the timer to hide it.

**Settings**: click the extension's toolbar icon (pin it via the puzzle-piece menu). Set the daily
minutes, edit the site list (one per line, `*` = every site), or click **+ Add this site**.

## Install (macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/abhijitkar10/site-timer/main/install.sh | bash
```

- **Helium**: fully automatic. Open Helium via the `Helium Timer` app the script creates.
- **Chrome**: Chrome won't let scripts add extensions, so the script opens `chrome://extensions`
  and copies the folder path; you click Developer mode → Load unpacked → paste.
- **Any other Chromium browser**: Load unpacked `~/.site-timer` from its extensions page.
