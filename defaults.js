// Shared by timer.js and popup.js. limits = { site: minutes }; "*" = every other site.
const DEFAULTS = {
  minutes: 10,
  limits: { 'youtube.com': 10, 'instagram.com': 10, 'x.com': 10, 'twitter.com': 10, 'reddit.com': 10, 'facebook.com': 10, 'tiktok.com': 10 },
};
// Not get(DEFAULTS): that merges nested objects, so sites you deleted would come back.
const getSettings = cb => chrome.storage.sync.get(['minutes', 'limits'], d =>
  cb({ minutes: d.minutes ?? DEFAULTS.minutes, limits: d.limits ?? DEFAULTS.limits }));
