const m = document.getElementById('minutes'), s = document.getElementById('sites');
chrome.storage.sync.get(DEFAULTS, d => { m.value = d.minutes; s.value = d.sites.join('\n'); });

// "https://www.youtube.com/feed" -> "youtube.com"
const clean = x => x.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[/:].*$/, '');
const save = () => chrome.storage.sync.set({
  minutes: Math.max(1, +m.value || DEFAULTS.minutes),
  sites: [...new Set(s.value.split('\n').map(clean).filter(Boolean))],
});
m.oninput = s.oninput = save;

document.getElementById('add').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const site = tab?.url?.startsWith('http') && clean(tab.url);
  if (!site) return;
  if (!s.value.split('\n').map(clean).includes(site)) s.value = (s.value.trim() + '\n' + site).trim();
  save();
};
