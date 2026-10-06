/* ============================================================
   LAB.JS — modul Lab Virtual (uji daya hantar listrik):
   rak reagen, drag & drop, tuang/celup, lampu & gelembung & ion,
   panel hasil, "Catat ke LKPD", progres, reset praktikum
============================================================ */
'use strict';

let dragPayload = null; /* cadangan payload drag (untuk browser lama) */

/* ---------- Kartu botol reagen (SVG per larutan, berlabel rumus) ---------- */
function renderBotol() {
  const grid = $('#botolGrid');
  grid.innerHTML = SOLUSI.map(s =>
    '<div class="botol-kartu" draggable="true" data-id="' + s.id + '" role="group" aria-label="Botol reagen ' + s.nama + ' 0,1 M">' +
      '<div class="botol-visual">' +
        '<svg viewBox="0 0 90 120" aria-hidden="true" focusable="false">' +
          '<rect x="33" y="2" width="24" height="9" rx="2.5" fill="' + s.permukaan + '"/>' +
          '<rect x="37" y="11" width="16" height="13" fill="rgba(205,235,255,0.55)" stroke="#7db8dd" stroke-width="1.5"/>' +
          '<path d="M36,24 L21,40 Q17,44 17,49 L17,106 Q17,112 23,112 L67,112 Q73,112 73,106 L73,49 Q73,44 69,40 L54,24 Z" fill="rgba(205,235,255,0.35)" stroke="#7db8dd" stroke-width="1.5"/>' +
          '<path d="M17.8,58 L17.8,106 Q17.8,112 23,112 L67,112 Q72.2,112 72.2,106 L72.2,58 Z" fill="' + s.warna + '" opacity="0.9"/>' +
          '<rect x="25" y="66" width="40" height="27" rx="4" fill="#ffffff" stroke="#dee2e6" stroke-width="1.5"/>' +
        '</svg>' +
        '<span class="botol-label">' + s.rumusHTML + '</span>' +
      '</div>' +
      '<p class="botol-nama">' + s.nama + '</p>' +
      '<p class="botol-molar">0,1 M</p>' +
      '<button type="button" class="btn btn-mini btn-sek aksi-tuang" data-id="' + s.id + '">🫗 Tuang ke Gelas</button>' +
    '</div>'
  ).join('');
}

/* ---------- Visual gelas & rangkaian uji ---------- */
function setLampu(nyala) { /* 'terang' | 'redup' | 'padam' */
  $('#lampuGlow').setAttribute('class', 'nyala-' + nyala);
  $('#filamen').setAttribute('class', 'fil-' + nyala);
}
function isiVisual(s) {
  const c = $('#cairan'), p = $('#permukaan');
  c.setAttribute('fill', s.warna); c.style.display = '';
  p.setAttribute('fill', s.permukaan); p.style.display = '';
  $('#labelGelas').textContent = 'GELAS: ' + s.rumusSVG + ' 0,1 M';
  c.style.opacity = '0'; p.style.opacity = '0';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    c.style.opacity = '1'; p.style.opacity = '1';
  }));
}
function kosongkanVisual() {
  $('#cairan').style.display = 'none';
  $('#permukaan').style.display = 'none';
  $('#gelembungGrup').innerHTML = '';
  $('#ionGrup').innerHTML = '';
  $('#labelGelas').textContent = 'GELAS: KOSONG';
}
function angkatVisual() {
  $('#rangkaian').classList.remove('dicelup');
  setLampu('padam');
  $('#gelembungGrup').innerHTML = '';
  $('#ionGrup').innerHTML = '';
}
function terapkanUjiVisual(s) {
  const k = KATEGORI[s.kategori];
  $('#rangkaian').classList.add('dicelup');
  setLampu(k.nyala);
  renderGelembung(k.nGelembung);
  renderIon(k.nIon);
}

/* ---------- Gelembung gas di sekitar elektroda ---------- */
function renderGelembung(n) {
  const g = $('#gelembungGrup');
  g.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const c = document.createElementNS(SVGNS, 'circle');
    const sisi = i % 2 === 0 ? 350 : 386; /* di sekitar kedua elektroda */
    c.setAttribute('cx', (sisi + (Math.random() * 24 - 12)).toFixed(1));
    c.setAttribute('cy', (335 + Math.random() * 8).toFixed(1));
    c.setAttribute('r', (2 + Math.random() * 2.6).toFixed(1));
    c.setAttribute('class', 'gelembung');
    c.style.animationDelay = (Math.random() * 1.8).toFixed(2) + 's';
    c.style.animationDuration = (1.6 + Math.random()).toFixed(2) + 's';
    g.appendChild(c);
  }
}
/* ---------- Animasi ion + dan − bergerak dalam larutan ---------- */
function renderIon(n) {
  const g = $('#ionGrup');
  g.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const positif = i % 2 === 0; /* selang-seling kation (+) / anion (−) */
    const cx = positif ? 315 + Math.random() * 26 : 398 + Math.random() * 30;
    const cy = 310 + Math.random() * 56;
    const grup = document.createElementNS(SVGNS, 'g');
    grup.setAttribute('class', 'ion ' + (positif ? 'ion-pos' : 'ion-neg'));
    grup.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
    grup.style.animationDuration = (3 + Math.random() * 2).toFixed(2) + 's';
    const c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('cx', cx.toFixed(1)); c.setAttribute('cy', cy.toFixed(1));
    c.setAttribute('r', '7');
    c.setAttribute('fill', positif ? '#4dabf7' : '#ff922b');
    const t = document.createElementNS(SVGNS, 'text');
    t.setAttribute('x', cx.toFixed(1)); t.setAttribute('y', (cy + 3.6).toFixed(1));
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '10');
    t.setAttribute('font-weight', '800'); t.setAttribute('fill', '#ffffff');
    t.textContent = positif ? '+' : '\u2212';
    grup.appendChild(c); grup.appendChild(t);
    g.appendChild(grup);
  }
}

/* ---------- Panel hasil pengamatan ---------- */
function perbaruiPanel() {
  const p = $('#panelHasil');
  if (!store.lab.isi) {
    p.innerHTML = '<p class="panel-kosong">🫙 <strong>Gelas masih kosong.</strong> Tuang salah satu larutan dari rak reagen — klik tombol <em>Tuang ke Gelas</em> atau seret botolnya ke meja praktikum.</p>';
    return;
  }
  const s = solusiById(store.lab.isi);
  if (!s) return;
  if (!store.lab.elektroda) {
    p.innerHTML = '<p class="panel-kosong">🧪 Gelas berisi <strong>' + s.nama + '</strong> (' + s.rumusHTML + ', 0,1 M). Sekarang <strong>celupkan rangkaian elektroda</strong> untuk menguji daya hantar listriknya!</p>';
    return;
  }
  const k = KATEGORI[s.kategori];
  const ikonNyala = k.nyala === 'terang' ? '💡' : k.nyala === 'redup' ? '🔅' : '🌑';
  const ikonGel = k.gelembung === 'banyak' ? '🫧🫧🫧' : k.gelembung === 'sedikit' ? '🫧' : '—';
  p.innerHTML =
    '<div class="hasil-kepala">' +
      '<span class="hasil-emoji" aria-hidden="true">' + k.emoji + '</span>' +
      '<div><h3>' + s.nama + ' <span class="rumus-kecil">(' + s.rumusHTML + ' • 0,1 M)</span></h3>' +
      '<p class="hasil-golongan gol-' + s.kategori + '">' + k.nama + ' — ' + k.deskripsi + '</p></div>' +
    '</div>' +
    '<ul class="hasil-daftar">' +
      '<li><span>Nyala lampu</span><strong>' + ikonNyala + ' ' + k.nyalaLabel + '</strong></li>' +
      '<li><span>Gelembung</span><strong>' + ikonGel + ' ' + k.gelembungLabel + '</strong></li>' +
      '<li><span>Golongan</span><strong>' + k.nama + '</strong></li>' +
    '</ul>' +
    '<div class="persamaan"><span class="persamaan-label">Persamaan</span>' + s.persamaan + '</div>' +
    '<p class="penjelasan">' + s.penjelasan + '</p>' +
    '<div class="hasil-aksi no-print"><button id="btnCatat" class="btn btn-utama">📋 Catat ke LKPD</button></div>';
}

function perbaruiKendali() {
  const dip = store.lab.elektroda;
  $('#btnElektroda').textContent = dip ? '⬆️ Angkat Elektroda' : '⬇️ Celupkan Elektroda';
  $('#chipRangkaian').setAttribute('aria-pressed', String(dip));
}

/* ---------- Progres "5/9 larutan sudah diuji" ---------- */
function perbaruiProgres() {
  const n = Object.keys(store.lab.diuji).length;
  $('#teksProgres').textContent = n + '/9';
  $('#barProgres').style.width = (n / 9 * 100) + '%';
  const bar = $('.bar-progres');
  if (bar) bar.setAttribute('aria-valuenow', String(n));
  $('#titikProgres').innerHTML =
    SOLUSI.map(s => '<span class="titik' + (store.lab.diuji[s.id] ? ' teruji' : '') + '" title="' + s.nama + '" aria-hidden="true"></span>').join('') +
    '<span class="visually-hidden">' + n + ' dari 9 larutan sudah diuji</span>';
}

/* ---------- Tuang larutan (gelas hanya berisi satu larutan) ---------- */
function tuangLarutan(id) {
  const s = solusiById(id);
  if (!s) return;
  if (store.lab.isi === id) {
    toast('Gelas sudah berisi <strong>' + s.nama + '</strong>. Celupkan elektroda untuk mengujinya!', 'info');
    return;
  }
  const isiBaru = () => {
    if (store.lab.elektroda) { angkatVisual(); store.lab.elektroda = false; }
    kosongkanVisual(); /* gelas dibilas */
    store.lab.isi = id;
    simpanStore();
    isiVisual(s);
    perbaruiPanel(); perbaruiKendali();
    toast('🫗 <strong>' + s.nama + '</strong> (0,1 M) dituang ke gelas kimia.', 'sukses');
  };
  if (store.lab.isi) {
    const lama = solusiById(store.lab.isi);
    konfirmasi('Ganti Larutan?',
      'Gelas masih berisi <strong>' + lama.nama + '</strong>. Gelas akan <strong>dibilas</strong> dulu sebelum diisi <strong>' + s.nama + '</strong>.',
      'Ya, Bilas & Isi', 'Batal', isiBaru);
  } else isiBaru();
}

/* ---------- Celup / angkat elektroda ---------- */
function celupElektroda() {
  if (store.lab.elektroda) { angkatElektroda(); return; } /* tombol berfungsi ganda (toggle) */
  if (!store.lab.isi) {
    toast('🧪 Gelas masih kosong! Tuang larutan dulu dari rak reagen.', 'peringatan');
    return;
  }
  const s = solusiById(store.lab.isi);
  if (!s) return;
  const k = KATEGORI[s.kategori];
  store.lab.elektroda = true;
  store.lab.diuji[s.id] = true;
  simpanStore();
  terapkanUjiVisual(s);
  perbaruiPanel(); perbaruiProgres(); perbaruiKendali();
  toast('⚡ Hasil uji <strong>' + s.nama + '</strong>: lampu <strong>' + k.nyalaLabel.toLowerCase() +
        '</strong>, gelembung <strong>' + k.gelembungLabel.toLowerCase() + '</strong>.', 'info');
}
function angkatElektroda() {
  store.lab.elektroda = false;
  simpanStore();
  angkatVisual();
  perbaruiPanel(); perbaruiKendali();
  toast('⬆️ Elektroda diangkat — gelas siap dibilas atau diisi larutan lain.', 'info');
}

/* ---------- Reset praktikum (tanpa menghapus data LKPD & progres) ---------- */
function resetPraktikum() {
  if (!store.lab.isi && !store.lab.elektroda) { toast('Gelas sudah kosong dan bersih ✨', 'info'); return; }
  store.lab.elektroda = false;
  store.lab.isi = null;
  simpanStore();
  angkatVisual();
  kosongkanVisual();
  perbaruiPanel(); perbaruiKendali();
  toast('🧼 Praktikum direset: gelas dibilas, elektroda diangkat, lampu padam. <strong>Data LKPD & progres uji tetap aman!</strong>', 'sukses');
}

/* ---------- Drag & drop: botol & rangkaian → meja lab ---------- */
function pasangDragLab() {
  const zona = $('#zonaLab');
  document.addEventListener('dragstart', e => {
    if (!e.target || !e.target.closest) return;
    const kartu = e.target.closest('.botol-kartu');
    const chip = e.target.closest('#chipRangkaian');
    let payload = null;
    if (kartu) payload = JSON.stringify({ t: 'larutan', id: kartu.dataset.id });
    else if (chip) payload = JSON.stringify({ t: 'rig' });
    if (payload) {
      dragPayload = payload;
      try { e.dataTransfer.setData('text/plain', payload); e.dataTransfer.effectAllowed = 'move'; } catch (err) { /* abaikan */ }
    }
  });
  zona.addEventListener('dragover', e => {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = 'move'; } catch (err) { /* abaikan */ }
    zona.classList.add('siap-drop');
  });
  zona.addEventListener('dragleave', e => { if (e.target === zona) zona.classList.remove('siap-drop'); });
  zona.addEventListener('drop', e => {
    e.preventDefault();
    zona.classList.remove('siap-drop');
    let p = null;
    try { p = e.dataTransfer.getData('text/plain'); } catch (err) { /* abaikan */ }
    if (!p) p = dragPayload;
    dragPayload = null;
    if (!p) return;
    try {
      const d = JSON.parse(p);
      if (d.t === 'larutan') tuangLarutan(d.id);
      else if (d.t === 'rig') celupElektroda();
    } catch (err) { /* payload tidak valid */ }
  });
  document.addEventListener('dragend', () => { zona.classList.remove('siap-drop'); dragPayload = null; });
}

/* ---------- Inisialisasi modul lab ---------- */
function pasangLab() {
  renderBotol();
  /* Alternatif non-drag: tombol per botol (keyboard & layar sentuh) */
  $('#botolGrid').addEventListener('click', e => {
    const b = e.target.closest('.aksi-tuang');
    if (b) tuangLarutan(b.dataset.id);
  });
  $('#btnElektroda').addEventListener('click', celupElektroda);
  $('#btnResetLab').addEventListener('click', resetPraktikum);
  /* Chip rangkaian: klik / Enter → celup-angkat (juga bisa diseret ke meja) */
  const chip = $('#chipRangkaian');
  chip.addEventListener('click', celupElektroda);
  chip.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); celupElektroda(); }
  });
  /* Tombol "Catat ke LKPD" pada panel hasil */
  $('#panelHasil').addEventListener('click', e => {
    if (e.target.closest('#btnCatat')) catatKeLKPD();
  });
  pasangDragLab();
  /* Pulihkan keadaan tersimpan dari sesi sebelumnya */
  if (store.lab.isi) { const s = solusiById(store.lab.isi); if (s) isiVisual(s); }
  if (store.lab.elektroda && store.lab.isi) {
    const s = solusiById(store.lab.isi);
    if (s) terapkanUjiVisual(s);
  }
  perbaruiPanel(); perbaruiKendali(); perbaruiProgres();
}
