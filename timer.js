// Listed sites: countdown from the moment the page opens; at zero the tab is closed (background.js).
// Other sites: count-up timer. Time only counts while the tab is visible.
const host = document.createElement('div');
const root = host.attachShadow({ mode: 'closed' }); // shadow DOM so site CSS can't touch it
root.innerHTML = `<style>
  .pill {
    position: fixed; bottom: 16px; right: 16px; z-index: 2147483647;
    display: flex; align-items: center; gap: 6px; padding: 7px 12px 7px 10px;
    font: 600 12px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif;
    font-variant-numeric: tabular-nums; letter-spacing: .01em; -webkit-font-smoothing: antialiased;
    color: #1d1d1f; background: rgba(255, 255, 255, .78);
    -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px);
    border: .5px solid rgba(0, 0, 0, .12); border-radius: 999px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, .12), 0 1px 3px rgba(0, 0, 0, .08);
    cursor: pointer; user-select: none; transition: background .3s, color .3s, opacity .2s, transform .2s;
  }
  .pill:hover { transform: translateY(-1px); }
  .pill svg { width: 13px; height: 13px; flex: none; }
  .sub { font-weight: 500; opacity: .6; }
  .low { color: #fff; background: rgba(255, 59, 48, .92); border-color: transparent; }
  .gone { opacity: 0; transform: translateY(4px); }
  @media (prefers-color-scheme: dark) {
    .pill:not(.low) { color: #f5f5f7; background: rgba(44, 44, 46, .75); border-color: rgba(255, 255, 255, .1); }
  }
</style>
<div class="pill" title="Click to hide">
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <circle cx="8" cy="9.2" r="5.3"/><path d="M8 9.2V6.6M6.4 1.8h3.2M8 1.8v2.1"/>
  </svg>
  <span class="v">0:00</span><span class="sub"></span>
</div>`;
const pill = root.querySelector('.pill'), v = root.querySelector('.v');
pill.onclick = () => { pill.classList.add('gone'); setTimeout(() => host.remove(), 200); };
document.documentElement.appendChild(host);

const fmt = s => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

getSettings(({ minutes, limits }) => {
  const h = location.hostname;
  const site = Object.keys(limits).find(s => h === s || h.endsWith('.' + s)) ?? ('*' in limits ? '*' : null);
  site ? countDown(site === '*' ? h : site, limits[site] || minutes) : countUp();
});

function countUp() {
  let elapsed = 0;
  setInterval(() => { if (!document.hidden) v.textContent = fmt(++elapsed); }, 1000);
}

function countDown(site, mins) {
  let left = Math.round(mins * 60);
  root.querySelector('.sub').textContent = 'left';
  const show = () => { v.textContent = fmt(left); pill.classList.toggle('low', left < 60); };
  show();
  const id = setInterval(() => {
    if (document.hidden) return;
    left--; show();
    if (left > 0) return;
    clearInterval(id);
    chrome.runtime.sendMessage({ timesUp: true, site, limit: fmt(Math.round(mins * 60)) });
  }, 1000);
}
