# Site Timer

A small timer in the bottom-right corner of every website, showing how long you've been on the page.
Pauses when the tab is hidden. Click it to hide it.

## Install (macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/abhijitkar10/site-timer/main/install.sh | bash
```

- **Helium**: fully automatic. Open Helium via the `Helium Timer` app the script creates.
- **Chrome**: Chrome won't let scripts add extensions, so the script opens `chrome://extensions`
  and copies the folder path; you click Developer mode → Load unpacked → paste.
- **Any other Chromium browser**: Load unpacked `~/.site-timer` from its extensions page.
