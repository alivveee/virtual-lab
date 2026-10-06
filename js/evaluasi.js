/* ============================================================
   EVALUASI.JS — modul Evaluasi Akhir (10 soal dalam satu halaman):
   5 PG (radio) + 2 soal kelompokkan/cocokkan (drag&drop + ketuk + dropdown)
   + 1 soal urutkan (drag + tombol ▲▼) + 2 soal jawaban ganda (checkbox)
============================================================ */
'use strict';

let chipTerpilih = null; /* {el, widget, item} — mode ketuk-ketuk */
let seretEl = null;      /* item urutkan yang sedang diseret */

const ST_BENAR = '<span class="status st-benar">✓ Benar</span>';
const ST_SALAH = '<span class="status st-salah">✗ Salah</span>';
const ST_BELUM = '<span class="status st-belum">⚠️ Belum dijawab</span>';

/* ---------- Tata letak soal/opsi yang diacak (tersimpan agar stabil) ---------- */
function buatTataEval() {
  const tata = { urutanPG: acak([0, 1, 2, 3, 4]), optsPG: {}, poolKel: {}, optsMulti: {}, awalUrut: null };
  EVAL.pg.forEach(p => { tata.optsPG[p.id] = acak(p.opts.map((_, i) => i)); });
  EVAL.kelompok.forEach(k => { tata.poolKel[k.id] = acak(k.items.map((_, i) => i)); });
  EVAL.multi.forEach(m => { tata.optsMulti[m.id] = acak(m.opts.map((_, i) => i)); });
  tata.awalUrut = acak(EVAL.urut.items.map((_, i) => i));
  store.ev.tata = tata;
  store.ev.jawaban = {};
  store.ev.diperiksa = false;
  store.ev.skor = 0;
  simpanStore();
}

/* ---------- Kerangka kartu soal ---------- */
function kerangkaSoal(id, nomor, jenis, teks, isi, status, bahas, dikunci) {
  return '<article class="soal-kartu kartu" id="soal-' + id + '">' +
    '<header class="soal-kepala">' +
      '<span class="soal-nomor" aria-hidden="true">' + nomor + '</span>' +
      '<span class="soal-jenis">' + jenis + '</span>' +
      '<span class="soal-status">' + (status || '') + '</span>' +
    '</header>' +
    '<div class="soal-teks">' + teks + '</div>' +
    '<div class="soal-isi">' + isi + '</div>' +
    (dikunci ? '<div class="bahas"><strong>💡 Pembahasan:</strong> ' + bahas + '</div>' : '') +
    '</article>';
}

/* ---------- Soal 1–5: pilihan ganda (single choice) ---------- */
function kartuPGHTML(p, nomor, dikunci) {
  const dipilih = store.ev.jawaban[p.id];
  const labels = store.ev.tata.optsPG[p.id].map(orig => {
    const o = p.opts[orig];
    let cls = 'opsi-label';
    if (dikunci) {
      if (o.benar) cls += ' benar';
      else if (dipilih === orig) cls += ' salah';
    }
    return '<label class="' + cls + '">' +
      '<input type="radio" name="evpg_' + p.id + '" value="' + orig + '"' +
      (dipilih === orig ? ' checked' : '') + (dikunci ? ' disabled' : '') + '>' +
      '<span class="tanda" aria-hidden="true"></span><span class="teks">' + o.t + '</span></label>';
  }).join('');
  const betul = dipilih !== undefined && !!p.opts[dipilih].benar;
  return kerangkaSoal(p.id, nomor, 'Pilihan Ganda', p.q,
    '<div class="pg-opsi">' + labels + '</div>',
    dikunci ? (betul ? ST_BENAR : ST_SALAH) : '', p.bahas, dikunci);
}

/* ---------- Widget kelompokkan / cocokkan ----------
    Tiga cara berinteraksi: (1) seret chip ke kotak, (2) ketuk chip lalu ketuk
    kotak tujuan / kolam awal, (3) dropdown "— pilih —" pada tiap chip. ---------- */
function widgetKelompokHTML(k, dikunci) {
  const jawab = store.ev.jawaban[k.id] || {};
  const chip = it => {
    const letak = jawab[it.id];
    const benar = letak === it.benar;
    return '<div class="chip-item' + (dikunci ? (benar ? ' benar' : ' salah') : '') + '" data-item="' + it.id + '">' +
      '<span class="chip-isi" draggable="' + (dikunci ? 'false' : 'true') + '" role="button" tabindex="0" aria-pressed="false" ' +
      'title="Seret ke kotak tujuan, atau ketuk lalu ketuk kotaknya" aria-label="Larutan ' + teksPolos(it.t) + ' — pilih lalu letakkan">' +
      it.t + '</span>' +
      '<select class="chip-select" aria-label="Pilih kelompok untuk ' + teksPolos(it.t) + '"' + (dikunci ? ' disabled' : '') + '>' +
        '<option value="">— pilih —</option>' +
        k.bins.map(b => '<option value="' + b.id + '"' + (letak === b.id ? ' selected' : '') + '>' + b.label + '</option>').join('') +
      '</select></div>';
  };
  const poolChips = store.ev.tata.poolKel[k.id].map(i => k.items[i])
    .filter(it => !jawab[it.id]).map(chip).join('');
  const binsHTML = k.bins.map(b => {
    const isiChips = k.items.filter(it => jawab[it.id] === b.id).map(chip).join('');
    return '<div class="kelompok-bin" data-bin="' + b.id + '"' +
      (dikunci ? '' : ' tabindex="0" role="button" aria-label="Kotak kelompok ' + b.label + ' — ketuk untuk memasukkan larutan terpilih"') + '>' +
      '<div class="bin-kepala">' + b.emoji + ' ' + b.label + '</div>' +
      '<div class="bin-slot" data-slot="' + b.id + '">' +
      (isiChips || '<span class="bin-kosong">tarik / ketuk larutan ke sini</span>') + '</div></div>';
  }).join('');
  return '<div class="kelompok-wrap" data-widget="' + k.id + '">' +
    '<div class="kelompok-pool" data-pool="1"' +
    (dikunci ? '' : ' tabindex="0" role="button" aria-label="Tempat larutan belum dikelompokkan — ketuk untuk mengembalikan larutan terpilih"') + '>' +
      '<div class="bin-kepala">📦 Belum dikelompokkan</div>' +
      '<div class="bin-slot" data-pool-slot="1">' +
      (poolChips || '<span class="bin-kosong">semua sudah dikelompokkan 🎉</span>') + '</div></div>' +
    '<div class="kelompok-grid">' + binsHTML + '</div></div>';
}
function kartuKelompokHTML(k, nomor, dikunci) {
  const j = store.ev.jawaban[k.id] || {};
  const semua = k.items.every(it => j[it.id] === it.benar);
  return kerangkaSoal(k.id, nomor, k.jenis,
    '<strong>' + k.judul + '.</strong> ' + k.instruksi,
    widgetKelompokHTML(k, dikunci),
    dikunci ? (semua ? ST_BENAR : ST_SALAH) : '', k.bahas, dikunci);
}

/* ---------- Soal 8: urutkan daya hantar (drag + tombol ▲▼) ---------- */
function kartuUrutHTML(nomor, dikunci) {
  if (!store.ev.jawaban.e8 || !Array.isArray(store.ev.jawaban.e8.urutan) ||
      store.ev.jawaban.e8.urutan.length !== EVAL.urut.items.length) {
    store.ev.jawaban.e8 = { urutan: store.ev.tata.awalUrut.map(i => EVAL.urut.items[i].id) };
    simpanStore();
  }
  const st = store.ev.jawaban.e8.urutan;
  const semuaBenar = st.every((id, i) => id === EVAL.urut.benar[i]);
  const items = st.map((id, i) => {
    const it = EVAL.urut.items.find(x => x.id === id);
    const posBenar = EVAL.urut.benar[i] === id;
    return '<li class="urut-item' + (dikunci ? (posBenar ? ' benar' : ' salah') : '') + '" draggable="' +
      (dikunci ? 'false' : 'true') + '" data-item="' + id + '">' +
      '<span class="urut-nomor" aria-hidden="true">' + (i + 1) + '</span>' +
      '<span class="urut-teks">' + it.t + '</span>' +
      (dikunci ? '' : '<span class="urut-tombol">' +
        '<button type="button" class="btn btn-mini btn-sek" data-aksi="naik" data-i="' + i + '" aria-label="Naikkan ' + teksPolos(it.t) + '">▲</button>' +
        '<button type="button" class="btn btn-mini btn-sek" data-aksi="turun" data-i="' + i + '" aria-label="Turunkan ' + teksPolos(it.t) + '">▼</button>' +
      '</span>') +
    '</li>';
  }).join('');
  return kerangkaSoal('e8', nomor, 'Urutkan',
    '<strong>' + EVAL.urut.judul + '.</strong> ' + EVAL.urut.instruksi,
    '<ol class="urut-daftar" id="urutDaftar">' + items + '</ol>',
    dikunci ? (semuaBenar ? ST_BENAR : ST_SALAH) : '', EVAL.urut.bahas, dikunci);
}
/* Sinkronkan urutan DOM → state tersimpan */
function sinkronUrut() {
  const daftar = $('#urutDaftar');
  if (!daftar) return;
  const anak = Array.from(daftar.children);
  store.ev.jawaban.e8 = { urutan: anak.map(li => li.dataset.item) };
  simpanStore();
  anak.forEach((li, i) => {
    const n = li.querySelector('.urut-nomor');
    if (n) n.textContent = String(i + 1);
    li.querySelectorAll('[data-aksi]').forEach(b => { b.dataset.i = String(i); });
  });
}
function aksiUrut(btn) {
  const daftar = $('#urutDaftar');
  if (!daftar || store.ev.diperiksa) return;
  const anak = Array.from(daftar.children);
  const i = +btn.dataset.i;
  if (btn.dataset.aksi === 'naik' && i > 0) daftar.insertBefore(anak[i], anak[i - 1]);
  else if (btn.dataset.aksi === 'turun' && i < anak.length - 1) daftar.insertBefore(anak[i + 1], anak[i]);
  sinkronUrut();
}

/* ---------- Soal 9–10: jawaban ganda (checkbox, benar > 1) ---------- */
function kartuMultiHTML(m, nomor, dikunci) {
  const j = store.ev.jawaban[m.id] || {};
  const tepat = m.opts.every((o, i) => (!!o.benar) === (!!j[i]));
  const labels = store.ev.tata.optsMulti[m.id].map(orig => {
    const o = m.opts[orig];
    let cls = 'opsi-label cek';
    if (dikunci) {
      if (o.benar) cls += ' benar';
      else if (j[orig]) cls += ' salah';
    }
    return '<label class="' + cls + '">' +
      '<input type="checkbox" name="evmw_' + m.id + '" value="' + orig + '"' +
      (j[orig] ? ' checked' : '') + (dikunci ? ' disabled' : '') + '>' +
      '<span class="tanda" aria-hidden="true"></span><span class="teks">' + o.t + '</span></label>';
  }).join('');
  return kerangkaSoal(m.id, nomor, 'Jawaban Ganda', m.q,
    '<div class="pg-opsi">' + labels + '</div>',
    dikunci ? (tepat ? ST_BENAR : ST_SALAH) : '', m.bahas, dikunci);
}

/* ---------- Banner skor evaluasi ---------- */
function skorBannerHTML(s) {
  const em = s >= 90 ? '🏆' : s >= 70 ? '🎉' : s >= 50 ? '👍' : s >= 30 ? '💪' : '🌱';
  return '<div class="skor-banner kartu" id="skorBanner" role="status">' +
    '<div class="skor-emoji" aria-hidden="true">' + em + '</div>' +
    '<h3>Skor Evaluasi</h3>' +
    '<p class="skor-angka">' + s + '<span>/100</span></p>' +
    '<p class="skor-pesan">' + pesanSkor(s) + '</p>' +
    '<div class="modal-aksi">' +
      '<button id="btnUlangiEv" class="btn btn-utama">🔄 Ulangi Evaluasi</button>' +
      '<button class="btn btn-sek" data-goto="referensi">📚 Lanjut ke Referensi</button>' +
    '</div></div>';
}

/* ---------- Render seluruh evaluasi (10 soal) ---------- */
function renderEval() {
  const box = $('#evalBox');
  if (!box) return;
  const dikunci = store.ev.diperiksa;
  let html = '';
  if (dikunci) html += skorBannerHTML(store.ev.skor);
  let nomor = 1;
  store.ev.tata.urutanPG.forEach(i => { html += kartuPGHTML(EVAL.pg[i], nomor++, dikunci); });
  EVAL.kelompok.forEach(k => { html += kartuKelompokHTML(k, nomor++, dikunci); });
  html += kartuUrutHTML(nomor++, dikunci);
  EVAL.multi.forEach(m => { html += kartuMultiHTML(m, nomor++, dikunci); });
  if (!dikunci) {
    html += '<div class="aksi-tengah"><button id="btnPeriksa" class="btn btn-besar btn-utama">✅ Periksa Jawaban</button></div>';
  }
  box.innerHTML = html;
  chipTerpilih = null;
  seretEl = null;
}

/* ---------- Penempatan chip (semua jalur interaksi bermuara ke sini) ---------- */
function letakkanChip(widgetId, itemId, binId) {
  if (store.ev.diperiksa) return;
  const j = store.ev.jawaban[widgetId] || {};
  if (binId) j[itemId] = binId; else delete j[itemId]; /* '' = kembali ke kolam */
  store.ev.jawaban[widgetId] = j;
  simpanStore();
  chipTerpilih = null;
  renderEval();
}
function hapusPilihChip() {
  if (chipTerpilih && chipTerpilih.el) {
    chipTerpilih.el.classList.remove('terpilih');
    chipTerpilih.el.setAttribute('aria-pressed', 'false');
  }
  chipTerpilih = null;
}
function togglePilihChip(el) {
  if (chipTerpilih && chipTerpilih.el === el) { hapusPilihChip(); return; }
  hapusPilihChip();
  const item = el.closest('.chip-item');
  const widget = el.closest('.kelompok-wrap');
  if (!item || !widget) return;
  chipTerpilih = { el: el, widget: widget.dataset.widget, item: item.dataset.item };
  el.classList.add('terpilih');
  el.setAttribute('aria-pressed', 'true');
}
function masukkanTerpilih(binId, widgetId) {
  if (!chipTerpilih || chipTerpilih.widget !== widgetId) return;
  letakkanChip(widgetId, chipTerpilih.item, binId);
}
/* Hapus tanda "belum dijawab" saat soal dijawab */
function bersihkanBelum(t) {
  const kartu = t.closest('.soal-kartu');
  if (kartu) {
    kartu.classList.remove('belum');
    const st = kartu.querySelector('.soal-status');
    if (st && !store.ev.diperiksa) st.innerHTML = '';
  }
}

/* ---------- Periksa jawaban (validasi + skor + pembahasan) ---------- */
function periksaEvaluasi() {
  if (store.ev.diperiksa) {
    toast('Evaluasi sudah diperiksa. Klik <strong>Ulangi Evaluasi</strong> untuk mencoba lagi.', 'info');
    return;
  }
  /* 1) validasi: masih ada soal belum dijawab? */
  const belum = [];
  EVAL.pg.forEach(p => { if (store.ev.jawaban[p.id] === undefined) belum.push('soal-' + p.id); });
  EVAL.kelompok.forEach(k => {
    const j = store.ev.jawaban[k.id] || {};
    if (k.items.some(it => !j[it.id])) belum.push('soal-' + k.id);
  });
  if (!store.ev.jawaban.e8 || !Array.isArray(store.ev.jawaban.e8.urutan) ||
      store.ev.jawaban.e8.urutan.length !== EVAL.urut.items.length) belum.push('soal-e8');
  EVAL.multi.forEach(m => {
    const j = store.ev.jawaban[m.id] || {};
    if (!Object.keys(j).length) belum.push('soal-' + m.id);
  });
  if (belum.length) {
    belum.forEach(cid => {
      const c = document.getElementById(cid);
      if (c) {
        c.classList.add('belum');
        const st = c.querySelector('.soal-status');
        if (st) st.innerHTML = ST_BELUM;
      }
    });
    toast('⚠️ Masih ada <strong>' + belum.length + ' soal belum dijawab</strong>. Lengkapi dulu, ya! (lihat kartu bertanda merah)', 'peringatan');
    gulirKe(document.getElementById(belum[0]));
    return;
  }
  /* 2) hitung skor: setiap soal bernilai 10 */
  let skor = 0;
  EVAL.pg.forEach(p => { if (p.opts[store.ev.jawaban[p.id]].benar) skor += 10; });
  EVAL.kelompok.forEach(k => {
    const j = store.ev.jawaban[k.id] || {};
    if (k.items.every(it => j[it.id] === it.benar)) skor += 10;
  });
  if (store.ev.jawaban.e8.urutan.every((id, i) => id === EVAL.urut.benar[i])) skor += 10;
  EVAL.multi.forEach(m => {
    const j = store.ev.jawaban[m.id] || {};
    if (m.opts.every((o, i) => (!!o.benar) === (!!j[i]))) skor += 10;
  });
  /* 3) kunci + tampilkan hasil & pembahasan */
  store.ev.diperiksa = true;
  store.ev.skor = skor;
  simpanStore();
  renderEval();
  gulirKe($('#skorBanner'));
  toast('Skor evaluasimu: <strong>' + skor + '/100</strong> ' + (skor >= 70 ? '🎉' : '💪'), 'sukses');
}

/* ---------- Ulangi evaluasi (jawaban dihapus, soal/opsi diacak ulang) ---------- */
function ulangiEvaluasi() {
  buatTataEval();
  renderEval();
  keAtas();
  toast('🔄 Evaluasi diacak ulang — semua jawaban dihapus. Semangat!', 'info');
}

/* ---------- Event evaluasi (delegasi pada #evalBox) ---------- */
function tanganiUbahEval(e) {
  const t = e.target;
  if (!t || store.ev.diperiksa) return;
  if (t.name && t.name.indexOf('evpg_') === 0) {           /* radio PG */
    const id = t.name.slice(5); /* awalan 'evpg_' = 5 karakter */
    store.ev.jawaban[id] = +t.value;
    simpanStore(); bersihkanBelum(t); return;
  }
  if (t.name && t.name.indexOf('evmw_') === 0) {           /* checkbox multi */
    const id = t.name.slice(5); /* awalan 'evmw_' = 5 karakter */
    const j = store.ev.jawaban[id] || {};
    if (t.checked) j[+t.value] = true; else delete j[+t.value];
    store.ev.jawaban[id] = j;
    simpanStore(); bersihkanBelum(t); return;
  }
  if (t.classList && t.classList.contains('chip-select')) { /* dropdown kelompok */
    const w = t.closest('.kelompok-wrap').dataset.widget;
    const item = t.closest('.chip-item').dataset.item;
    letakkanChip(w, item, t.value); /* renderEval otomatis menghapus tanda belum */
  }
}
function tanganiKlikEval(e) {
  if (e.target.closest('#btnPeriksa')) { periksaEvaluasi(); return; }
  if (e.target.closest('#btnUlangiEv')) { ulangiEvaluasi(); return; }
  if (store.ev.diperiksa) return;
  const chipIsi = e.target.closest('.chip-isi');
  if (chipIsi) { togglePilihChip(chipIsi); return; }
  if (e.target.closest('select')) return; /* biarkan dropdown bekerja */
  const bin = e.target.closest('.kelompok-bin');
  if (bin) { masukkanTerpilih(bin.dataset.bin, bin.closest('.kelompok-wrap').dataset.widget); return; }
  const pool = e.target.closest('.kelompok-pool');
  if (pool) { masukkanTerpilih('', pool.closest('.kelompok-wrap').dataset.widget); return; }
  const tombol = e.target.closest('[data-aksi]');
  if (tombol) aksiUrut(tombol);
}
function tanganiTombolEval(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const t = e.target;
  if (t && t.classList &&
      (t.classList.contains('chip-isi') || t.classList.contains('kelompok-bin') || t.classList.contains('kelompok-pool'))) {
    e.preventDefault();
    t.click(); /* memicu jalur klik yang sama (role="button") */
  }
}
function tanganiDragMulaiEval(e) {
  if (!e.target || !e.target.closest || store.ev.diperiksa) return;
  const chip = e.target.closest('.chip-isi');
  if (chip) { /* seret chip larutan ke kotak tujuan */
    const payload = JSON.stringify({
      t: 'evchip',
      w: chip.closest('.kelompok-wrap').dataset.widget,
      i: chip.closest('.chip-item').dataset.item
    });
    try { e.dataTransfer.setData('text/plain', payload); e.dataTransfer.effectAllowed = 'move'; } catch (err) { /* abaikan */ }
    return;
  }
  const item = e.target.closest('.urut-item');
  if (item) { /* seret untuk mengurutkan ulang */
    seretEl = item;
    item.classList.add('diseret');
    try { e.dataTransfer.setData('text/plain', 'urut'); e.dataTransfer.effectAllowed = 'move'; } catch (err) { /* abaikan */ }
  }
}
function tanganiDragAtasEval(e) {
  if (!e.target || !e.target.closest) return;
  /* izinkan drop pada slot kelompok (kolam maupun kotak tujuan) */
  const slot = e.target.closest('.bin-slot') || e.target.closest('.kelompok-bin');
  if (slot) { e.preventDefault(); return; }
  /* reorder item urutkan: sisipkan sebelum/sesudah item yang ditunjuk */
  if (seretEl) {
    const item = e.target.closest('.urut-item');
    if (item && item !== seretEl) {
      e.preventDefault();
      const rect = item.getBoundingClientRect();
      const bawah = e.clientY > rect.top + rect.height / 2;
      item.parentNode.insertBefore(seretEl, bawah ? item.nextSibling : item);
      sinkronUrut();
    }
  }
}
function tanganiDropEval(e) {
  if (store.ev.diperiksa) return;
  const slot = e.target.closest && e.target.closest('.bin-slot');
  const binEl = e.target.closest && e.target.closest('.kelompok-bin');
  if (!slot && !binEl) return;
  let p = null;
  try { p = e.dataTransfer.getData('text/plain'); } catch (err) { /* abaikan */ }
  if (!p) return;
  let d = null;
  try { d = JSON.parse(p); } catch (err) { return; }
  if (!d || d.t !== 'evchip') return;
  e.preventDefault();
  let bin = '';
  if (slot) bin = slot.hasAttribute('data-pool-slot') ? '' : slot.dataset.slot;
  else if (binEl) bin = binEl.dataset.bin;
  letakkanChip(d.w, d.i, bin);
}
function tanganiDragSelesaiEval() {
  if (seretEl) {
    seretEl.classList.remove('diseret');
    seretEl = null;
    sinkronUrut();
  }
}

/* ---------- Inisialisasi modul evaluasi ---------- */
function pasangEvaluasi() {
  if (!store.ev.tata) buatTataEval();
  const box = $('#evalBox');
  box.addEventListener('change', tanganiUbahEval);
  box.addEventListener('click', tanganiKlikEval);
  box.addEventListener('keydown', tanganiTombolEval);
  box.addEventListener('dragstart', tanganiDragMulaiEval);
  box.addEventListener('dragover', tanganiDragAtasEval);
  box.addEventListener('drop', tanganiDropEval);
  box.addEventListener('dragend', tanganiDragSelesaiEval);
  renderEval();
}
