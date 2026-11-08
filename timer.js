// Listed sites: countdown from the moment the page opens; at zero the tab is closed (background.js).
// Other sites: count-up timer. Time only counts while the tab is visible.
const host = document.createElement('div');
const root = host.attachShadow({ mode: 'closed' }); // shadow DOM so site CSS can't touch it
root.innerHTML = `<style>
  div { position: fixed; bottom: 12px; right: 12px; z-index: 2147483647;
        font: 600 13px/1 ui-monospace, Menlo, monospace; color: #fff;
        background: rgba(0,0,0,.7); padding: 6px 9px; border-radius: 6px;
        cursor: pointer; user-select: none; }
  .low { background: #c0392b; }
</style><div title="Click to hide">0:00</div>`;
const t = root.querySelector('div');
t.onclick = () => t.remove();
document.documentElement.appendChild(host);

const fmt = s => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

chrome.storage.sync.get(DEFAULTS, ({ minutes, limits }) => {
  const h = location.hostname;
  const site = Object.keys(limits).find(s => h === s || h.endsWith('.' + s)) ?? ('*' in limits ? '*' : null);
  site ? countDown(site === '*' ? h : site, limits[site] || minutes) : countUp();
});

function countUp() {
  let elapsed = 0;
  setInterval(() => { if (!document.hidden) t.textContent = fmt(++elapsed); }, 1000);
}

function countDown(site, mins) {
  let left = Math.round(mins * 60);
  const show = () => { t.textContent = fmt(left) + ' left'; t.classList.toggle('low', left < 60); };
  show();
  const id = setInterval(() => {
    if (document.hidden) return;
    left--; show();
    if (left > 0) return;
    clearInterval(id);
    chrome.runtime.sendMessage({ timesUp: true, site, mins });
  }, 1000);
}
