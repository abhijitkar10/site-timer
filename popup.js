const $ = id => document.getElementById(id);
let limits = {}, defMin = DEFAULTS.minutes, current = null;

// Times are typed as "15" (minutes) or "2:30" (minutes:seconds) and stored as minutes.
const toMin = v => {
  const s = String(v).trim();
  if (!/^\d+(\.\d+)?(:[0-5]?\d)?$/.test(s)) return NaN;
  const [a, b] = s.split(':');
  return b === undefined ? +a : +a + +b / 60;
};
const valid = n => n > 0 && n <= 24 * 60;
const show = mins => { const t = Math.round(mins * 60); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
// "https://www.youtube.com/feed" -> "youtube.com"
const clean = x => x.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[/:?#].*$/, '');

const save = () => chrome.storage.sync.set({ minutes: defMin, limits });

// Edits a time field in place; invalid input is flagged and not saved.
function bindTime(input, get, set) {
  input.value = show(get());
  input.oninput = () => {
    const n = toMin(input.value);
    input.classList.toggle('bad', !valid(n));
    if (valid(n)) { set(n); save(); }
  };
  input.onblur = () => { input.value = show(get()); input.classList.remove('bad'); };
}

function render() {
  const sites = Object.keys(limits).sort((a, b) => (a === '*') - (b === '*') || a.localeCompare(b));
  $('rows').replaceChildren(...sites.map(site => {
    const row = $('row').content.firstElementChild.cloneNode(true);
    const label = row.querySelector('.site');
    label.textContent = site === '*' ? 'All other sites' : site;
    label.classList.toggle('all', site === '*');
    bindTime(row.querySelector('.time'), () => limits[site], n => { limits[site] = n; });
    row.querySelector('.remove').onclick = () => { delete limits[site]; save(); render(); };
    return row;
  }));
  $('new-time').placeholder = show(defMin);
  $('current').textContent = current ? `Add ${current}` : 'Add Current Site';
  $('current').disabled = !current || current in limits;
}

function add(raw, time) {
  const site = raw.trim() === '*' ? '*' : clean(raw);
  if (site !== '*' && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(site)) return false;
  const n = toMin(time);
  limits[site] = valid(n) ? n : defMin;
  save(); render();
  return true;
}

$('new').onsubmit = e => {
  e.preventDefault();
  if (add($('new-site').value, $('new-time').value)) { $('new-site').value = $('new-time').value = ''; }
  else $('new-site').classList.add('bad');
};
$('new-site').oninput = () => $('new-site').classList.remove('bad');
$('current').onclick = () => add(current, '');

getSettings(async d => {
  limits = { ...d.limits };
  defMin = d.minutes;
  bindTime($('default'), () => defMin, n => { defMin = n; $('new-time').placeholder = show(n); });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url?.startsWith('http')) current = clean(tab.url);
  render();
});
