// Floating timer: time spent on this page, counting only while the tab is visible.
const host = document.createElement('div');
const root = host.attachShadow({ mode: 'closed' }); // shadow DOM so site CSS can't touch it
root.innerHTML = `<style>
  div { position: fixed; bottom: 12px; right: 12px; z-index: 2147483647;
        font: 600 13px/1 ui-monospace, Menlo, monospace; color: #fff;
        background: rgba(0,0,0,.7); padding: 6px 9px; border-radius: 6px;
        cursor: pointer; user-select: none; }
</style><div title="Click to hide">0:00</div>`;
const el = root.querySelector('div');
el.onclick = () => host.remove();

let elapsed = 0; // seconds
const fmt = s => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};
setInterval(() => {
  if (document.hidden) return;
  el.textContent = fmt(++elapsed);
}, 1000);

const mount = () => document.documentElement.appendChild(host);
document.documentElement ? mount() : addEventListener('DOMContentLoaded', mount);
