/* ============================================================
   QUIZ.JS — modul Quiz Interaktif (10 soal, umpan balik langsung,
   progres, skor 0–100, reset dengan soal/opsi teracak)
============================================================ */
'use strict';

/* Pastikan urutan soal + urutan opsi tersimpan (stabil saat halaman berpindah) */
function pastikanQuizState() {
  const q = store.quiz;
  if (!Array.isArray(q.urutan) || q.urutan.length !== QUIZ.length ||
      !Array.isArray(q.tata) || q.tata.length !== QUIZ.length) {
    q.urutan = acak(QUIZ.map((_, i) => i));        /* urutan soal diacak */
    q.tata = QUIZ.map(() => acak([0, 1, 2, 3]));   /* urutan opsi tiap soal diacak */
    q.jawab = {}; q.pos = 0; q.selesai = false; q.skor = 0;
    simpanStore();
  }
}
/* Apakah soal (indeks asli) terjawab benar? */
function soalBenar(qIdx) {
  const q = store.quiz;
  if (!q.jawab.hasOwnProperty(qIdx)) return false;
  return !!QUIZ[qIdx].opts[q.jawab[qIdx]].benar;
}
function hitungBenarQuiz() {
  return Object.keys(store.quiz.jawab).filter(k => soalBenar(+k)).length;
}

/* ---------- Render satu soal / layar hasil ---------- */
function renderQuiz() {
  const box = $('#quizBox');
  if (!box) return;
  const q = store.quiz;
  if (q.selesai) { box.innerHTML = layarHasilQuiz(); return; }

  const total = QUIZ.length, pos = q.pos;
  const qIdx = q.urutan[pos];
  const soal = QUIZ[qIdx];
  const dijawab = q.jawab.hasOwnProperty(qIdx);
  const benarS = dijawab && !!soal.opts[q.jawab[qIdx]].benar;

  /* Titik progres: benar (hijau) / salah (merah) / sekarang (biru) / belum (abu) */
  let titik = '';
  for (let i = 0; i < total; i++) {
    let cls = 'titik';
    if (i < pos) cls += soalBenar(q.urutan[i]) ? ' titik-benar' : ' titik-salah';
    else if (i === pos && dijawab) cls += benarS ? ' titik-benar' : ' titik-salah';
    else if (i === pos) cls += ' titik-kini';
    titik += '<span class="' + cls + '" aria-hidden="true"></span>';
  }
  const persen = Math.round(((pos + (dijawab ? 1 : 0)) / total) * 100);

  /* Opsi: tata letak dari q.tata; jawaban disimpan sebagai INDEKS ASLI agar tetap
     valid meski urutan tampilan berubah saat sesi dipulihkan */
  const opsiHtml = q.tata[qIdx].map((orig, d) => {
    const o = soal.opts[orig];
    let cls = 'opsi', attr = '';
    if (dijawab) {
      attr = ' disabled';
      if (o.benar) cls += ' benar';
      else if (q.jawab[qIdx] === orig) cls += ' salah';
      else cls += ' redup';
    }
    return '<button type="button" class="' + cls + '" data-orig="' + orig + '"' + attr + '>' +
      '<span class="opsi-huruf" aria-hidden="true">' + String.fromCharCode(65 + d) + '</span>' +
      '<span class="opsi-teks">' + o.t + '</span></button>';
  }).join('');

  /* Umpan balik langsung setelah memilih */
  const komentar = dijawab
    ? '<div class="komentar ' + (benarS ? 'komentar-benar' : 'komentar-salah') + '">' +
      (benarS ? '🎉 <strong>Benar!</strong> ' : '💡 <strong>Kurang tepat.</strong> ') + soal.bahas + '</div>'
    : '';
  const tombol = dijawab
    ? '<div class="aksi-tengah"><button id="btnLanjut" class="btn btn-utama">' +
      (pos === total - 1 ? '🏁 Lihat Skor' : 'Soal Berikutnya ➡️') + '</button></div>'
    : '';

  box.innerHTML =
    '<div class="quiz-progres kartu">' +
      '<div class="quiz-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + persen + '" aria-label="Progres quiz">' +
        '<div style="width:' + persen + '%"></div></div>' +
      '<p class="quiz-pos">Soal <strong>' + (pos + 1) + '</strong> dari ' + total + '</p>' +
      '<div class="quiz-titik" aria-hidden="true">' + titik + '</div>' +
    '</div>' +
    '<div class="kartu quiz-isi">' +
      '<h3 class="quiz-teks">' + soal.q + '</h3>' +
      '<div class="quiz-opsi">' + opsiHtml + '</div>' + komentar + tombol +
    '</div>';
}

/* ---------- Layar skor akhir ---------- */
function layarHasilQuiz() {
  const q = store.quiz, s = q.skor, benar = hitungBenarQuiz();
  const em = s >= 90 ? '🏆' : s >= 70 ? '🎉' : s >= 50 ? '👍' : s >= 30 ? '💪' : '🌱';
  return '<div class="kartu quiz-hasil">' +
    '<div class="skor-emoji" aria-hidden="true">' + em + '</div>' +
    '<h3>Skor Akhir Quiz</h3>' +
    '<p class="skor-angka">' + s + '<span>/100</span></p>' +
    '<p class="skor-rincian">' + benar + ' dari ' + QUIZ.length + ' soal benar</p>' +
    '<p class="skor-pesan">' + pesanSkor(s) + '</p>' +
    '<div class="modal-aksi">' +
      '<button id="btnUlangiQuiz" class="btn btn-utama">🔄 Ulangi Quiz</button>' +
      '<button class="btn btn-sek" data-goto="lab">🔬 Lanjut ke Lab Virtual</button>' +
    '</div></div>';
}

/* ---------- Aksi quiz ---------- */
function jawabQuiz(orig) {
  const q = store.quiz, qIdx = q.urutan[q.pos];
  if (q.jawab.hasOwnProperty(qIdx)) return; /* soal sudah terkunci */
  q.jawab[qIdx] = orig;
  simpanStore();
  renderQuiz();
}
function lanjutQuiz() {
  const q = store.quiz, total = QUIZ.length;
  const qIdx = q.urutan[q.pos];
  if (!q.jawab.hasOwnProperty(qIdx)) return;
  q.pos += 1;
  if (q.pos >= total) {
    q.skor = hitungBenarQuiz() * 10;
    q.selesai = true;
    toast('🏁 Quiz selesai! Skormu: ' + q.skor + '/100', 'sukses');
  }
  simpanStore();
  renderQuiz();
  keAtas();
}
/* Reset: soal & opsi diacak ulang — quiz bisa diulang berkali-kali */
function ulangiQuiz() {
  store.quiz.urutan = acak(QUIZ.map((_, i) => i));
  store.quiz.tata = QUIZ.map(() => acak([0, 1, 2, 3]));
  store.quiz.jawab = {};
  store.quiz.pos = 0;
  store.quiz.selesai = false;
  store.quiz.skor = 0;
  simpanStore();
  renderQuiz();
  toast('🔄 Quiz diacak ulang dari awal. Semangat, kamu pasti bisa!', 'info');
}

/* ---------- Inisialisasi modul quiz ---------- */
function pasangQuiz() {
  pastikanQuizState();
  const box = $('#quizBox');
  box.addEventListener('click', e => {
    const opsi = e.target.closest('button.opsi');
    if (opsi && !opsi.disabled) { jawabQuiz(+opsi.dataset.orig); return; }
    if (e.target.closest('#btnLanjut')) { lanjutQuiz(); return; }
    if (e.target.closest('#btnUlangiQuiz')) { ulangiQuiz(); return; }
  });
  $('#btnResetQuiz').addEventListener('click', ulangiQuiz);
  renderQuiz();
}
