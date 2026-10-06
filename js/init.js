/* ============================================================
   INIT.JS — tombol umum (modal, ESC), Reset Semua Data, inisialisasi
============================================================ */
'use strict';

/* ---------- Reset Semua Data (dengan dialog konfirmasi) ---------- */
function resetSemua() {
  try { sessionStorage.removeItem(KUNCI); } catch (e) { /* abaikan */ }
  memori = null;
  store = storeAwal();
  /* --- bersihkan UI LKPD --- */
  ['inNama', 'inKelas', 'inAbsen'].forEach(id => { const el = $('#' + id); if (el) el.value = ''; });
  const tgl = $('#inTanggal'); if (tgl) tgl.value = tanggalLokal();
  $$('#lkpd .ta-analisis').forEach(t => { t.value = ''; });
  $$('#lkpd .tidak-valid').forEach(el => el.classList.remove('tidak-valid'));
  $$('#lkpd .err').forEach(p => { p.hidden = true; });
  renderAlat();
  renderTabelLKPD();
  /* --- bersihkan UI Lab Virtual --- */
  angkatVisual();
  kosongkanVisual();
  perbaruiPanel();
  perbaruiKendali();
  perbaruiProgres();
  /* --- reset Quiz (urutan diacak ulang) --- */
  pastikanQuizState();
  store.quiz.urutan = acak(QUIZ.map((_, i) => i));
  store.quiz.tata = QUIZ.map(() => acak([0, 1, 2, 3]));
  store.quiz.jawab = {}; store.quiz.pos = 0; store.quiz.selesai = false; store.quiz.skor = 0;
  simpanStore();
  renderQuiz();
  /* --- reset Evaluasi (tata letak diacak ulang) --- */
  buatTataEval();
  renderEval();
  /* --- kembali ke Beranda --- */
  tampilHalaman('beranda');
  toast('🧹 Semua data berhasil dihapus (LKPD, Lab, Quiz, Evaluasi). Kembali ke Beranda!', 'sukses');
}

/* ---------- Tombol umum: modal konfirmasi, ESC, reset data ---------- */
function pasangTombolUmum() {
  const mintaReset = () => konfirmasi(
    'Reset Semua Data',
    'Yakin ingin menghapus semua data? Seluruh isian <strong>LKPD</strong>, hasil <strong>Lab Virtual</strong>, <strong>Quiz</strong>, dan <strong>Evaluasi</strong> akan dihapus dan kamu kembali ke Beranda.',
    'Ya, Hapus', 'Batal', resetSemua
  );
  $('#btnResetKop').addEventListener('click', mintaReset);
  $('#btnResetBawah').addEventListener('click', mintaReset);
  /* tombol Ya/Batal pada modal konfirmasi umum */
  $('#modalYa').addEventListener('click', () => {
    const cb = aksiModal;
    sembunyikanModal($('#modalBack'));
    if (cb) cb();
  });
  $('#modalBatal').addEventListener('click', () => sembunyikanModal($('#modalBack')));
  $('#modalBack').addEventListener('click', e => { if (e.target.id === 'modalBack') sembunyikanModal($('#modalBack')); });
  $('#modalCetak').addEventListener('click', e => { if (e.target.id === 'modalCetak') sembunyikanModal($('#modalCetak')); });
  /* ESC menutup modal yang terbuka */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!$('#modalCetak').hidden) sembunyikanModal($('#modalCetak'));
      else if (!$('#modalBack').hidden) sembunyikanModal($('#modalBack'));
    }
  });
}

/* ---------- Inisialisasi seluruh aplikasi ---------- */
function initAplikasi() {
  store = muatStore() || storeAwal();
  pasangNavigasi();
  pasangLKPD();
  pasangQuiz();
  pasangLab();
  pasangEvaluasi();
  pasangTombolUmum();
  tampilHalaman(HALAMAN.includes(store.halaman) ? store.halaman : 'beranda');
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAplikasi);
} else {
  initAplikasi();
}
