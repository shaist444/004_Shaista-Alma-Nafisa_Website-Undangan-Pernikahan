const CONFIG = {
  eventDate: new Date('2026-12-12T08:00:00+07:00'),
  waNumber: '6281234567890',          
  coupleName: 'Putra & Casta'
};

const guest = new URLSearchParams(location.search).get('to');
if (guest) document.getElementById('guestName').textContent = guest;

const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');

document.getElementById('openBtn').addEventListener('click', () => {
  document.getElementById('cover').classList.add('open');
  document.getElementById('main').classList.remove('d-none');
  musicBtn.classList.remove('d-none');
  document.body.classList.remove('locked');
  bgm.load();
  bgm.volume = 0.6;
  bgm.play().then(() => musicBtn.classList.add('on')).catch(() => {});
  observeReveal();
  window.scrollTo(0, 0);
});

musicBtn.addEventListener('click', () => {
  if (bgm.paused) { bgm.play(); musicBtn.classList.add('on'); }
  else { bgm.pause(); musicBtn.classList.remove('on'); }
});

function tick() {
  const d = Math.max(0, CONFIG.eventDate - new Date());
  document.getElementById('cd-d').textContent = Math.floor(d / 864e5);
  document.getElementById('cd-h').textContent = Math.floor(d / 36e5) % 24;
  document.getElementById('cd-m').textContent = Math.floor(d / 6e4) % 60;
  document.getElementById('cd-s').textContent = Math.floor(d / 1e3) % 60;
}
tick(); setInterval(tick, 1000);

function observeReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => {
  const t = document.getElementById(b.dataset.t).textContent;
  navigator.clipboard.writeText(t).then(() => {
    const old = b.textContent; b.textContent = 'Tersalin!';
    setTimeout(() => b.textContent = old, 1500);
  });
}));

document.getElementById('calBtn').addEventListener('click', e => {
  e.preventDefault();
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
    'SUMMARY:Pernikahan ' + CONFIG.coupleName,
    'DTSTART:20261212T010000Z','DTEND:20261212T070000Z',
    'LOCATION:Surabaya','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'pernikahan.ics'; a.click();
});

const wishes = document.getElementById('wishes');
function esc(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function addWish(n, s, m) {
  const el = document.createElement('div');
  el.className = 'wish';
  el.innerHTML = `<b>${esc(n)}</b> <small>(${esc(s)})</small><br>${esc(m)}`;
  wishes.prepend(el);
}
document.getElementById('rsvpSend').addEventListener('click', () => {
  const n = document.getElementById('rsvpName').value.trim() || guest || '';
  const s = document.getElementById('rsvpStatus').value;
  const m = document.getElementById('rsvpMsg').value.trim();
  if (!n) { alert('Mohon isi nama Anda.'); return; }
  addWish(n, s, m || '-');
  const text = `Halo ${CONFIG.coupleName}, saya ${n}.\nKonfirmasi: ${s}\nUcapan: ${m || '-'}`;
  window.open(`https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(text)}`, '_blank');
});
