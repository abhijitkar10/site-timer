const m = document.getElementById('minutes'), s = document.getElementById('sites');

// Times are typed as "10" (minutes) or "10:30" (minutes:seconds); stored as minutes.
const toMin = v => { const [a, b] = String(v).split(':'); return b === undefined ? +a : +a + +b / 60; };
const show = mins => {
  const t = Math.round(mins * 60);
  return t % 60 ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` : String(t / 60);
};
const def = () => Math.max(1 / 60, toMin(m.value) || DEFAULTS.minutes);

getSettings(d => {
  m.value = show(d.minutes);
  s.value = Object.entries(d.limits).map(([site, mins]) => `${site} ${show(mins)}`).join('\n');
});

// "https://www.youtube.com/feed 10:30" -> ["youtube.com", 10.5]
const clean = x => x.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[/:].*$/, '').toLowerCase();
const parse = () => Object.fromEntries(s.value.split('\n')
  .map(line => line.trim().split(/\s+/))
  .filter(([raw]) => raw)
  .map(([raw, n]) => [clean(raw), Math.max(1 / 60, toMin(n) || def())]));

const save = () => chrome.storage.sync.set({ minutes: def(), limits: parse() });
m.oninput = s.oninput = save;

document.getElementById('add').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const site = tab?.url?.startsWith('http') && clean(tab.url);
  if (!site || site in parse()) return;
  s.value = (s.value.trim() + `\n${site} ${show(def())}`).trim();
  save();
};
