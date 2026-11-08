const m = document.getElementById('minutes'), s = document.getElementById('sites');
chrome.storage.sync.get(DEFAULTS, d => {
  m.value = d.minutes;
  s.value = Object.entries(d.limits).map(([site, mins]) => `${site} ${mins}`).join('\n');
});

// "https://www.youtube.com/feed 15" -> ["youtube.com", 15]
const clean = x => x.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[/:].*$/, '').toLowerCase();
const parse = () => Object.fromEntries(s.value.split('\n')
  .map(line => line.trim().split(/\s+/))
  .filter(([raw]) => raw)
  .map(([raw, n]) => [clean(raw), Math.max(0.1, +n || +m.value || DEFAULTS.minutes)]));

const save = () => chrome.storage.sync.set({ minutes: Math.max(1, +m.value || DEFAULTS.minutes), limits: parse() });
m.oninput = s.oninput = save;

document.getElementById('add').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const site = tab?.url?.startsWith('http') && clean(tab.url);
  if (!site || site in parse()) return;
  s.value = (s.value.trim() + `\n${site} ${m.value || DEFAULTS.minutes}`).trim();
  save();
};
