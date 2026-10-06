/* ============================================================
   UTIL.JS — modul dasar: util, penyimpanan sesi, toast, modal, navigasi
============================================================ */
'use strict';

/* ---------- Util umum ---------- */
const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
const SVGNS = 'http://www.w3.org/2000/svg';

/* Acak urutan array (Fisher–Yates) — dipakai quiz & evaluasi */
function acak(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
/* Hilangkan tag HTML → teks polos (untuk aria-label / toast) */
function teksPolos(h) { return String(h).replace(/<[^>]*>/g, ''); }
/* Tanggal hari ini format YYYY-MM-DD (waktu lokal) */
function tanggalLokal() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
/* Gulir ke atas / ke elemen (menghormati prefers-reduced-motion) */
function gerakHalus() {
  return !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
}
function keAtas() {
  try { window.scrollTo({ top: 0, behavior: gerakHalus() ? 'smooth' : 'auto' }); }
  catch (e) { window.scrollTo(0, 0); }
}
function gulirKe(el, blok) {
  if (!el) return;
  try { el.scrollIntoView({ behavior: gerakHalus() ? 'smooth' : 'auto', block: blok || 'center' }); }
  catch (e) { el.scrollIntoView(); }
}
/* Cari objek larutan berdasar id */
function solusiById(id) { return SOLUSI.find(s => s.id === id) || null; }
/* Pesan motivasi sesuai rentang skor (dipakai Quiz & Evaluasi) */
function pesanSkor(s) {
  if (s >= 90) return 'Luar biasa! Kamu benar-benar menguasai materi larutan elektrolit dan non-elektrolit. 🏆';
  if (s >= 70) return 'Bagus sekali! Sedikit lagi menuju sempurna — cek kembali soal yang keliru, ya. 💪';
  if (s >= 50) return 'Cukup baik! Pelajari kembali bagian Teori Dasar yang masih goyah, lalu coba lagi. 📚';
  if (s >= 30) return 'Semangat! Ulangi membaca Teori Dasar pelan-pelan, skormu pasti membaik. 🔁';
  return 'Jangan menyerah! Mulai lagi dari Teori Dasar dan Lab Virtual — kamu pasti bisa. 🌱';
}

/* ---------- Penyimpanan sesi ----------
   sessionStorage bila tersedia; bila gagal → cadangan variabel di memori (try/catch) */
const KUNCI = 'labv-elektrolit-sesi';
let store = null;   // data sesi aktif
let memori = null;  // cadangan di memori bila sessionStorage diblokir

function storeAwal() {
  return {
    halaman: 'beranda',
    lkpd:  { nama: '', kelas: '', absen: '', tanggal: '', alat: {}, tabel: {}, analisis: {} },
    lab:   { isi: null, elektroda: false, diuji: {} },
    quiz:  { urutan: null, tata: null, jawab: {}, pos: 0, selesai: false, skor: 0 },
    ev:    { tata: null, jawaban: {}, diperiksa: false, skor: 0 }
  };
}
function simpanStore() {
  try { sessionStorage.setItem(KUNCI, JSON.stringify(store)); }
  catch (e) { try { memori = JSON.parse(JSON.stringify(store)); } catch (e2) { /* abaikan */ } }
}
function muatStore() {
  try {
    const raw = sessionStorage.getItem(KUNCI);
    if (raw) return Object.assign(storeAwal(), JSON.parse(raw));
  } catch (e) { /* sessionStorage tidak tersedia */ }
  if (memori) {
    try { return Object.assign(storeAwal(), JSON.parse(JSON.stringify(memori))); } catch (e) { /* abaikan */ }
  }
  return null;
}

/* ---------- Toast (notifikasi, hilang otomatis; aria-live di HTML) ---------- */
function toast(pesan, tipe) {
  const box = $('#toastBox');
  if (!box) return;
  const el = document.createElement('div');
  const jenis = tipe || 'info';
  const ikon = { sukses: '✅', peringatan: '⚠️', gagal: '❌', info: 'ℹ️' }[jenis] || 'ℹ️';
  el.className = 'toast toast-' + jenis;
  el.innerHTML = '<span class="toast-ikon" aria-hidden="true">' + ikon + '</span><span class="toast-teks">' + pesan + '</span>';
  box.appendChild(el);
  while (box.children.length > 4) box.firstElementChild.remove();
  setTimeout(() => {
    el.classList.add('pergi');
    setTimeout(() => el.remove(), 450);
  }, 3400);
}

/* ---------- Modal ---------- */
let aksiModal = null;    // callback tombol "Ya"
let fokusKembali = null; // elemen yang difokus sebelum modal dibuka

function tampilkanModal(latar) {
  fokusKembali = document.activeElement;
  latar.hidden = false;
  document.body.classList.add('modal-buka');
}
function sembunyikanModal(latar) {
  latar.hidden = true;
  document.body.classList.remove('modal-buka');
  if (fokusKembali && fokusKembali.focus) { try { fokusKembali.focus(); } catch (e) { /* abaikan */ } }
  fokusKembali = null;
  aksiModal = null;
}
/* Dialog konfirmasi umum (pengganti confirm() mentah) */
function konfirmasi(judul, pesan, teksYa, teksBatal, cb) {
  const latar = $('#modalBack');
  $('#modalJudul').textContent = judul;
  $('#modalPesan').innerHTML = pesan;
  $('#modalYa').textContent = teksYa || 'Ya';
  $('#modalBatal').textContent = teksBatal || 'Batal';
  aksiModal = cb;
  tampilkanModal(latar);
  const ya = $('#modalYa');
  if (ya) ya.focus();
}

/* ---------- Navigasi antarhalaman ---------- */
const HALAMAN = ['beranda', 'teori', 'lkpd', 'quiz', 'lab', 'evaluasi', 'referensi'];
const NAMA_HAL = {
  beranda: 'Beranda', teori: 'Teori Dasar', lkpd: 'LKPD', quiz: 'Quiz',
  lab: 'Lab Virtual', evaluasi: 'Evaluasi', referensi: 'Referensi'
};

function tampilHalaman(id) {
  if (!HALAMAN.includes(id)) id = 'beranda';
  $$('.page').forEach(s => s.classList.toggle('aktif', s.id === id));
  $$('.nav-link').forEach(a => {
    if (a.dataset.goto === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  store.halaman = id;
  simpanStore();
  $('#kop').classList.remove('nav-buka');
  $('#btnHamburger').setAttribute('aria-expanded', 'false');
  keAtas();
}

function pasangNavigasi() {
  /* Delegasi: semua elemen [data-goto] → pindah halaman */
  document.addEventListener('click', e => {
    const tujuan = e.target.closest('[data-goto]');
    if (tujuan) tampilHalaman(tujuan.dataset.goto);
  });

  /* Tombol hamburger (menu HP) */
  const ham = $('#btnHamburger');
  ham.addEventListener('click', e => {
    e.stopPropagation();
    const kop = $('#kop');
    const buka = !kop.classList.contains('nav-buka');
    kop.classList.toggle('nav-buka', buka);
    ham.setAttribute('aria-expanded', String(buka));
    ham.setAttribute('aria-label', buka ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  });
  /* Klik di luar header menutup menu HP */
  document.addEventListener('click', e => {
    if (!e.target.closest('#kop')) {
      $('#kop').classList.remove('nav-buka');
      $('#btnHamburger').setAttribute('aria-expanded', 'false');
    }
  });

  /* Tombol "Sebelumnya/Selanjutnya" di bawah tiap halaman */
  HALAMAN.forEach((id, i) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const bar = document.createElement('div');
    bar.className = 'prevnext no-print';
    let html = '';
    if (i > 0) html += '<button class="btn btn-sek" data-goto="' + HALAMAN[i - 1] + '">← ' + NAMA_HAL[HALAMAN[i - 1]] + '</button>';
    html += '<span class="prevnext-indek" aria-hidden="true">' + (i + 1) + ' / ' + HALAMAN.length + '</span>';
    if (i < HALAMAN.length - 1) html += '<button class="btn btn-utama" data-goto="' + HALAMAN[i + 1] + '">' + NAMA_HAL[HALAMAN[i + 1]] + ' →</button>';
    bar.innerHTML = '<div class="prevnext-dalam">' + html + '</div>';
    sec.appendChild(bar);
  });
}
