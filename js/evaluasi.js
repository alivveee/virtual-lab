/* ============================================================
   EVALUASI.JS — modul Evaluasi Akhir (10 soal pilihan ganda).
   Soal dan urutan opsi diacak; skor 10 poin per soal (maks. 100).
============================================================ */
'use strict';

const ST_BENAR = '<span class="status st-benar">✓ Benar</span>';
const ST_SALAH = '<span class="status st-salah">✗ Salah</span>';
const ST_BELUM = '<span class="status st-belum">⚠️ Belum dijawab</span>';

/* ---------- Tata letak soal/opsi yang diacak (tersimpan agar stabil) ---------- */
function buatTataEval() {
  const tata = { urutanPG: acak(EVAL.pg.map((_, i) => i)), optsPG: {} };
  EVAL.pg.forEach(p => { tata.optsPG[p.id] = acak(p.opts.map((_, i) => i)); });
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

/* ---------- Soal pilihan ganda (single choice) ---------- */
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
  if (!dikunci) {
    html += '<div class="aksi-tengah"><button id="btnPeriksa" class="btn btn-besar btn-utama">✅ Periksa Jawaban</button></div>';
  }
  box.innerHTML = html;
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
    simpanStore(); bersihkanBelum(t);
  }
}
function tanganiKlikEval(e) {
  if (e.target.closest('#btnPeriksa')) { periksaEvaluasi(); return; }
  if (e.target.closest('#btnUlangiEv')) { ulangiEvaluasi(); return; }
}

/* ---------- Inisialisasi modul evaluasi ---------- */
function tataEvalValid(t) {
  return !!(t && Array.isArray(t.urutanPG) && t.optsPG &&
    EVAL.pg.every(p => Array.isArray(t.optsPG[p.id])));
}
function pasangEvaluasi() {
  if (!tataEvalValid(store.ev.tata)) buatTataEval();
  const box = $('#evalBox');
  box.addEventListener('change', tanganiUbahEval);
  box.addEventListener('click', tanganiKlikEval);
  renderEval();
}
