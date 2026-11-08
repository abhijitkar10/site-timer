// Count-up timer on normal sites; daily countdown + block screen on listed sites.
// Time only counts while the tab is visible.
const host = document.createElement('div');
const root = host.attachShadow({ mode: 'closed' }); // shadow DOM so site CSS can't touch it
root.innerHTML = `<style>
  #t { position: fixed; bottom: 12px; right: 12px; z-index: 2147483647;
       font: 600 13px/1 ui-monospace, Menlo, monospace; color: #fff;
       background: rgba(0,0,0,.7); padding: 6px 9px; border-radius: 6px;
       cursor: pointer; user-select: none; }
  #t.low { background: #c0392b; }
  #block { position: fixed; inset: 0; z-index: 2147483647; background: #111; color: #eee;
           display: none; flex-direction: column; align-items: center; justify-content: center;
           gap: 18px; font: 500 20px/1.4 system-ui, sans-serif; text-align: center; padding: 24px; }
  #block.on { display: flex; }
  button { font: 500 14px system-ui, sans-serif; padding: 8px 14px; border-radius: 6px;
           border: 1px solid #555; background: #222; color: #bbb; cursor: pointer; }
</style>
<div id="t" title="Click to hide">0:00</div>
<div id="block"><div id="msg"></div><button>5 more minutes</button></div>`;
const $ = id => root.getElementById(id);
$('t').onclick = () => $('t').remove();
document.documentElement.appendChild(host);

const fmt = s => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};
const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

chrome.storage.sync.get(DEFAULTS, ({ minutes, sites }) => {
  const h = location.hostname;
  const site = sites.find(s => s === '*' || h === s || h.endsWith('.' + s));
  site ? countDown(site === '*' ? h : site, minutes * 60) : countUp();
});

function countUp() {
  let elapsed = 0;
  setInterval(() => { if (!document.hidden) $('t').textContent = fmt(++elapsed); }, 1000);
}

function countDown(site, limit) {
  const key = 'used:' + site;
  let used = 0, day = today();
  // ponytail: last-writer-wins per site; two tabs of one site visible side by side undercount.
  const load = () => chrome.storage.local.get(key, r => {
    used = r[key]?.d === today() ? r[key].s : 0;
    render();
  });
  const save = () => chrome.storage.local.set({ [key]: { d: day, s: used } });

  const render = () => {
    const left = Math.max(0, limit - used), done = left === 0;
    $('t').textContent = fmt(left) + ' left';
    $('t').classList.toggle('low', left < 60);
    $('block').classList.toggle('on', done);
    $('msg').textContent = `Time's up on ${site}. ${Math.round(used / 60)} min today.`;
    document.documentElement.style.overflow = done ? 'hidden' : '';
    if (done) document.querySelectorAll('video, audio').forEach(m => m.pause());
  };

  $('block').querySelector('button').onclick = () => { used = limit - 300; save(); render(); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); }); // pick up other tabs' time
  load();

  setInterval(() => {
    if (document.hidden) return;
    if (today() !== day) { day = today(); used = 0; }
    if (used < limit) { used++; save(); }
    render(); // keeps pausing media the site auto-plays after the block
  }, 1000);
}
