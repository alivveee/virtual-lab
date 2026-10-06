/* ============================================================
   DATA.JS — Seluruh data materi & soal Laboratorium Virtual
   Topik: Larutan Elektrolit dan Non-Elektrolit (Kimia SMA Kelas X)
============================================================ */
'use strict';

/* ---------- Data 9 larutan uji (konsentrasi sama: 0,1 M) ---------- */
/* kategori: 'kuat' | 'lemah' | 'non' */
const SOLUSI = [
  { id:'h2o',    nama:'Air Suling',        rumusHTML:'H<sub>2</sub>O',                 rumusSVG:'H\u2082O',        warna:'#dbeeff', permukaan:'#b3dcff', kategori:'non',
    persamaan:'H<sub>2</sub>O \u21CC H<sup>+</sup> + OH<sup>\u2212</sup> <em>(terionisasi sangat sedikit sekali)</em>',
    penjelasan:'Air suling murni hanya terionisasi sangat sedikit sekali, sehingga jumlah ionnya terlalu sedikit untuk menyalakan lampu. Pada uji nyala sederhana, air murni digolongkan non-elektrolit.' },
  { id:'nacl',   nama:'Larutan NaCl',      rumusHTML:'NaCl',                           rumusSVG:'NaCl',           warna:'#a5d8ff', permukaan:'#91cdff', kategori:'kuat',
    persamaan:'NaCl \u2192 Na<sup>+</sup> + Cl<sup>\u2212</sup>',
    penjelasan:'NaCl adalah senyawa ion (garam). Saat larut dalam air terjadi <strong>disosiasi sempurna</strong> (\u03B1 \u2248 1) menghasilkan ion Na<sup>+</sup> dan Cl<sup>\u2212</sup> sangat banyak \u2192 lampu <strong>terang</strong> dan <strong>banyak gelembung</strong>.' },
  { id:'hcl',    nama:'Larutan HCl',       rumusHTML:'HCl',                            rumusSVG:'HCl',            warna:'#ffec99', permukaan:'#ffe066', kategori:'kuat',
    persamaan:'HCl \u2192 H<sup>+</sup> + Cl<sup>\u2212</sup>',
    penjelasan:'HCl adalah <strong>asam kuat</strong> (senyawa kovalen polar) yang <strong>terionisasi sempurna</strong> (\u03B1 \u2248 1). Ion H<sup>+</sup> dan Cl<sup>\u2212</sup> sangat banyak \u2192 daya hantar besar \u2192 lampu terang.' },
  { id:'naoh',   nama:'Larutan NaOH',      rumusHTML:'NaOH',                           rumusSVG:'NaOH',           warna:'#c3fae8', permukaan:'#a7f3d0', kategori:'kuat',
    persamaan:'NaOH \u2192 Na<sup>+</sup> + OH<sup>\u2212</sup>',
    penjelasan:'NaOH adalah <strong>basa kuat</strong> yang terdisosiasi sempurna (\u03B1 \u2248 1) menjadi Na<sup>+</sup> dan OH<sup>\u2212</sup>. Ion banyak \u2192 lampu terang, gelembung banyak.' },
  { id:'asetat', nama:'Larutan CH\u2083COOH', rumusHTML:'CH<sub>3</sub>COOH',          rumusSVG:'CH\u2083COOH',   warna:'#ffd8a8', permukaan:'#ffc078', kategori:'lemah',
    persamaan:'CH<sub>3</sub>COOH \u21CC CH<sub>3</sub>COO<sup>\u2212</sup> + H<sup>+</sup>',
    penjelasan:'Asam asetat <strong>terionisasi sebagian</strong> (0 < \u03B1 < 1; panah \u21CC = reversibel). Ion yang terbentuk sedikit \u2192 arus kecil \u2192 lampu <strong>redup</strong> dan <strong>gelembung sedikit</strong>.' },
  { id:'nh3',    nama:'Larutan NH\u2083 (aq)', rumusHTML:'NH<sub>3</sub> (aq)',        rumusSVG:'NH\u2083',       warna:'#d0bfff', permukaan:'#b197fc', kategori:'lemah',
    persamaan:'NH<sub>3</sub> + H<sub>2</sub>O \u21CC NH<sub>4</sub><sup>+</sup> + OH<sup>\u2212</sup>',
    penjelasan:'Amonia (basa lemah) terionisasi <strong>sebagian</strong> (0 < \u03B1 < 1). Ion sedikit \u2192 daya hantar kecil \u2192 lampu redup, gelembung sedikit.' },
  { id:'gula',   nama:'Larutan Gula',      rumusHTML:'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>',  rumusSVG:'C\u2086H\u2081\u2082O\u2086', warna:'#fcc2d7', permukaan:'#faa2c1', kategori:'non',
    persamaan:'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(aq) \u2192 C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(aq) <em>(tetap molekul, tidak terionisasi)</em>',
    penjelasan:'Gula larut sebagai <strong>molekul netral</strong> dan tidak membentuk ion (\u03B1 = 0). Tidak ada pembawa muatan \u2192 larutan tidak menghantarkan listrik \u2192 lampu <strong>padam</strong>.' },
  { id:'etanol', nama:'Larutan Etanol',    rumusHTML:'C<sub>2</sub>H<sub>5</sub>OH',  rumusSVG:'C\u2082H\u2085OH', warna:'#99e9f2', permukaan:'#66d9e8', kategori:'non',
    persamaan:'C<sub>2</sub>H<sub>5</sub>OH(aq) \u2192 C<sub>2</sub>H<sub>5</sub>OH(aq) <em>(tetap molekul, tidak terionisasi)</em>',
    penjelasan:'Etanol larut sebagai molekul netral tanpa membentuk ion (\u03B1 = 0) sehingga tidak ada arus yang mengalir \u2014 lampu padam.' },
  { id:'urea',   nama:'Larutan Urea',      rumusHTML:'CO(NH<sub>2</sub>)<sub>2</sub>', rumusSVG:'CO(NH\u2082)\u2082', warna:'#e9ecef', permukaan:'#ced4da', kategori:'non',
    persamaan:'CO(NH<sub>2</sub>)<sub>2</sub>(aq) \u2192 CO(NH<sub>2</sub>)<sub>2</sub>(aq) <em>(tetap molekul, tidak terionisasi)</em>',
    penjelasan:'Urea larut sebagai molekul netral dan tidak terionisasi (\u03B1 = 0) \u2192 tidak ada ion \u2192 lampu padam.' }
];

/* ---------- Sifat tiap golongan ---------- */
const KATEGORI = {
  kuat:  { nama:'Elektrolit Kuat',  emoji:'\uD83D\uDCA1', nyala:'terang', nyalaLabel:'Terang',    gelembung:'banyak', gelembungLabel:'Banyak',    nGelembung:12, nIon:8,
           deskripsi:'Terionisasi sempurna (\u03B1 \u2248 1) \u2014 ion sangat banyak, lampu menyala terang.' },
  lemah: { nama:'Elektrolit Lemah', emoji:'\uD83D\uDD05', nyala:'redup',  nyalaLabel:'Redup',     gelembung:'sedikit',gelembungLabel:'Sedikit',   nGelembung:5,  nIon:4,
           deskripsi:'Terionisasi sebagian (0 < \u03B1 < 1) \u2014 ion sedikit, lampu menyala redup.' },
  non:   { nama:'Non-Elektrolit',   emoji:'\uD83D\uDEAB', nyala:'padam',   nyalaLabel:'Padam',     gelembung:'tidak',  gelembungLabel:'Tidak Ada', nGelembung:0,  nIon:0,
           deskripsi:'Tidak terionisasi (\u03B1 = 0) \u2014 tidak ada ion, lampu padam.' }
};

/* ---------- Daftar alat & bahan untuk LKPD ---------- */
const ALAT_BAHAN = [
  'Gelas kimia 250 mL',
  'Elektroda karbon/grafit (2 buah)',
  'Baterai 9 V sebagai sumber arus',
  'Lampu pijar kecil + soket dan kabel penghubung',
  '9 botol reagen larutan uji 0,1 M (air suling, NaCl, HCl, NaOH, CH\u2083COOH, NH\u2083, gula, etanol, urea)',
  'Pipet tetes',
  'Batang pengaduk',
  'Air pembilas untuk membersihkan gelas'
];

/* ---------- 10 soal QUIZ (pilihan ganda) ---------- */
const QUIZ = [
  { q:'Zat yang apabila dilarutkan dalam air menghasilkan ion-ion sehingga larutannya dapat menghantarkan arus listrik disebut \u2026',
    opts:[ { t:'elektrolit', benar:true }, { t:'non-elektrolit' }, { t:'katalis' }, { t:'zat terlarut' } ],
    bahas:'Elektrolit terionisasi dalam pelarut air membentuk ion bermuatan; ion-lah yang membawa arus listrik dalam larutan.' },

  { q:'Larutan berikut yang termasuk <strong>elektrolit kuat</strong> adalah \u2026',
    opts:[ { t:'CH<sub>3</sub>COOH 0,1 M' }, { t:'NaOH 0,1 M', benar:true }, { t:'gula (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>) 0,1 M' }, { t:'urea 0,1 M' } ],
    bahas:'NaOH adalah basa kuat yang terdisosiasi sempurna (\u03B1 \u2248 1) menjadi Na<sup>+</sup> dan OH<sup>\u2212</sup>, sehingga termasuk elektrolit kuat.' },

  { q:'Persamaan ionisasi yang benar untuk asam asetat dalam air adalah \u2026',
    opts:[ { t:'CH<sub>3</sub>COOH \u2192 CH<sub>3</sub>COO<sup>\u2212</sup> + H<sup>+</sup> (sempurna)' },
           { t:'CH<sub>3</sub>COOH \u21CC CH<sub>3</sub>COO<sup>\u2212</sup> + H<sup>+</sup>', benar:true },
           { t:'CH<sub>3</sub>COOH \u2192 Na<sup>+</sup> + Cl<sup>\u2212</sup>' },
           { t:'CH<sub>3</sub>COOH tidak dapat larut dalam air' } ],
    bahas:'Asam asetat terionisasi hanya <strong>sebagian</strong> dan reversibel, sehingga persamaannya memakai panah dua arah (\u21CC).' },

  { q:'Saat larutan <strong>elektrolit lemah</strong> diuji dengan rangkaian uji elektrolit, lampu akan \u2026',
    opts:[ { t:'menyala terang dan banyak gelembung' }, { t:'menyala redup dan gelembung sedikit', benar:true },
           { t:'padam dan tidak ada gelembung' }, { t:'menyala terang tanpa gelembung' } ],
    bahas:'Ion pada elektrolit lemah sedikit (0 < \u03B1 < 1) sehingga arus yang mengalir kecil: lampu redup dan gelembung hanya sedikit.' },

  { q:'Larutan gula (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>) tidak menghantarkan arus listrik karena \u2026',
    opts:[ { t:'gula tidak dapat larut dalam air' }, { t:'gula terionisasi sempurna' },
           { t:'gula larut sebagai molekul netral, tidak membentuk ion', benar:true }, { t:'air menghalangi arus listrik' } ],
    bahas:'Gula memang larut, tetapi sebagai <strong>molekul netral</strong> (\u03B1 = 0) \u2014 tidak ada ion pembawa muatan, sehingga lampu padam.' },

  { q:'Pada konsentrasi yang sama (0,1 M), jumlah ion dalam larutan elektrolit kuat dibandingkan larutan elektrolit lemah adalah \u2026',
    opts:[ { t:'sama banyak' }, { t:'jauh lebih banyak', benar:true }, { t:'jauh lebih sedikit' }, { t:'tidak ada ion sama sekali' } ],
    bahas:'Elektrolit kuat terionisasi sempurna (\u03B1 \u2248 1), sedangkan elektrolit lemah hanya sebagian (0 < \u03B1 < 1) \u2014 jumlah ionnya jauh lebih sedikit.' },

  { q:'Penguraian senyawa NaCl menjadi ion Na<sup>+</sup> dan Cl<sup>\u2212</sup> ketika larut dalam air disebut \u2026',
    opts:[ { t:'ionisasi' }, { t:'disosiasi (elektrolitik)', benar:true }, { t:'hidrolisis' }, { t:'oksidasi' } ],
    bahas:'Senyawa <strong>ion</strong> seperti NaCl <strong>terurai</strong> (disosiasi) menjadi ion-ionnya; ionisasi berlaku bagi senyawa kovalen polar seperti HCl.' },

  { q:'Gelembung gas yang muncul di sekitar elektroda pada uji elektrolit menandakan \u2026',
    opts:[ { t:'larutan mendidih karena panas' }, { t:'terjadi reaksi elektrolisis di elektroda karena ion bergerak menuju elektroda', benar:true },
           { t:'seluruh pelarut menguap' }, { t:'lampu memanaskan larutan' } ],
    bahas:'Ion yang bergerak menuju elektroda mengalami reaksi (elektrolisis) dan melepaskan gas \u2014 itulah gelembung yang terlihat. Makin banyak ion, makin banyak gelembung.' },

  { q:'Derajat ionisasi (\u03B1) larutan elektrolit kuat bernilai \u2026',
    opts:[ { t:'\u03B1 = 0' }, { t:'0 < \u03B1 < 1' }, { t:'mendekati 1 (\u03B1 \u2248 1)', benar:true }, { t:'\u03B1 lebih dari 1' } ],
    bahas:'Elektrolit kuat terionisasi <strong>sempurna</strong>, hampir seluruh zat berubah menjadi ion, sehingga \u03B1 mendekati 1.' },

  { q:'Berdasarkan uji nyala lampu sederhana, air suling murni digolongkan sebagai \u2026',
    opts:[ { t:'elektrolit kuat' }, { t:'elektrolit lemah' }, { t:'non-elektrolit (lampu padam)', benar:true }, { t:'basa kuat' } ],
    bahas:'Ionisasi air murni sangat sedikit sekali sehingga ionnya terlalu sedikit untuk menyalakan lampu \u2014 pada uji sederhana, air suling digolongkan non-elektrolit.' }
];

/* ---------- Data EVALUASI (10 soal) ----------
   Struktur: 5 PG (single choice) + 2 kelompokkan + 1 urutkan + 2 jawaban ganda (checkbox) */
const EVAL = {
  pg: [
    { id:'e1', q:'Larutan berikut yang termasuk <strong>elektrolit kuat</strong> adalah \u2026',
      opts:[ { t:'CH<sub>3</sub>COOH 0,1 M' }, { t:'NaOH 0,1 M', benar:true }, { t:'C<sub>2</sub>H<sub>5</sub>OH 0,1 M' }, { t:'CO(NH<sub>2</sub>)<sub>2</sub> 0,1 M' } ],
      bahas:'NaOH adalah basa kuat yang terdisosiasi sempurna (\u03B1 \u2248 1). CH\u2083COOH = elektrolit lemah; etanol dan urea = non-elektrolit.' },
    { id:'e2', q:'Persamaan disosiasi yang benar untuk NaOH dalam air adalah \u2026',
      opts:[ { t:'NaOH \u2192 Na<sup>+</sup> + OH<sup>\u2212</sup>', benar:true },
             { t:'NaOH \u2192 NaOH(aq), tidak terionisasi' },
             { t:'NaOH \u2192 Na<sup>+</sup> + O<sup>2\u2212</sup> + H<sup>+</sup>' },
             { t:'NaOH \u21CC Na<sub>2</sub><sup>+</sup> + OH<sup>\u2212</sup>' } ],
      bahas:'Sebagai basa kuat, NaOH terdisosiasi <strong>sempurna</strong> (panah satu arah) menjadi Na<sup>+</sup> dan OH<sup>\u2212</sup> dengan perbandingan 1 : 1.' },
    { id:'e3', q:'Derajat ionisasi (\u03B1) larutan elektrolit lemah memenuhi \u2026',
      opts:[ { t:'\u03B1 = 0' }, { t:'0 < \u03B1 < 1', benar:true }, { t:'\u03B1 = 1' }, { t:'\u03B1 > 1' } ],
      bahas:'Elektrolit lemah terionisasi <strong>sebagian</strong>: tidak nol (ada ion terbentuk) tetapi tidak sempurna \u2014 jadi 0 < \u03B1 < 1.' },
    { id:'e4', q:'Senyawa non-elektrolit umumnya tersusun atas ikatan \u2026',
      opts:[ { t:'ion' }, { t:'kovalen (saat larut tetap menjadi molekul netral)', benar:true }, { t:'logam' }, { t:'hidrogen' } ],
      bahas:'Non-elektrolit tersusun atas senyawa <strong>kovalen</strong>; saat larut ia tetap sebagai molekul netral sehingga tidak ada ion pembawa arus.' },
    { id:'e5', q:'Gelembung gas pada percobaan uji elektrolit terjadi karena \u2026',
      opts:[ { t:'molekul pelarut mendidih' }, { t:'terjadi reaksi di elektroda (elektrolisis) yang menghasilkan gas', benar:true },
             { t:'lampu memanaskan seluruh larutan' }, { t:'zat terlarut menguap semuanya' } ],
      bahas:'Ion yang bergerak menuju elektroda mengalami reaksi elektrolisis dan membentuk gas \u2014 inilah sumber gelembung di sekitar elektroda.' }
  ],

  /* Soal kelompokkan/cocokkan (drag & drop + ketuk + dropdown) */
  kelompok: [
    { id:'e6', judul:'Mengelompokkan Larutan', jenis:'Kelompokkan (Drag & Drop)',
      instruksi:'Masukkan setiap larutan 0,1 M ke dalam kelompok yang tepat: <strong>seret</strong> rumusnya ke kotak tujuan, <strong>ketuk</strong> lalu pilih kotaknya, atau gunakan <strong>dropdown</strong> di sebelahnya.',
      bins:[ { id:'kuat',  label:'Elektrolit Kuat',  emoji:'\uD83D\uDCA1' },
             { id:'lemah', label:'Elektrolit Lemah', emoji:'\uD83D\uDD05' },
             { id:'non',   label:'Non-Elektrolit',   emoji:'\uD83D\uDEAB' } ],
      items:[ { id:'nacl',   t:'NaCl',                 benar:'kuat' },
              { id:'hcl',    t:'HCl',                  benar:'kuat' },
              { id:'asetat', t:'CH<sub>3</sub>COOH',   benar:'lemah' },
              { id:'nh3',    t:'NH<sub>3</sub>',       benar:'lemah' },
              { id:'gula',   t:'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>', benar:'non' },
              { id:'etanol', t:'C<sub>2</sub>H<sub>5</sub>OH',             benar:'non' } ],
      bahas:'Elektrolit kuat: NaCl, HCl. Elektrolit lemah: CH\u2083COOH, NH\u2083. Non-elektrolit: gula (C\u2086H\u2081\u2082O\u2086) dan etanol (C\u2082H\u2085OH) \u2014 keduanya larut sebagai molekul netral.' },
    { id:'e7', judul:'Mencocokkan Nyala Lampu', jenis:'Cocokkan (Drag & Drop)',
      instruksi:'Cocokkan setiap larutan 0,1 M dengan <strong>kondisi nyala lampu</strong> saat diuji dengan rangkaian uji elektrolit.',
      bins:[ { id:'terang', label:'Terang', emoji:'\uD83D\uDCA1' },
             { id:'redup',  label:'Redup',  emoji:'\uD83D\uDD05' },
             { id:'padam',  label:'Padam',  emoji:'\uD83C\uDF11' } ],
      items:[ { id:'naoh',   t:'NaOH',                 benar:'terang' },
              { id:'hcl2',  t:'HCl',                  benar:'terang' },
              { id:'asetat2', t:'CH<sub>3</sub>COOH', benar:'redup' },
              { id:'gula2', t:'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>', benar:'padam' } ],
      bahas:'NaOH dan HCl = elektrolit kuat \u2192 lampu <strong>terang</strong>; CH\u2083COOH = elektrolit lemah \u2192 <strong>redup</strong>; gula = non-elektrolit \u2192 <strong>padam</strong>.' }
  ],

  /* Soal urutkan daya hantar (drag untuk mengurutkan + tombol naik/turun) */
  urut: { id:'e8', judul:'Mengurutkan Daya Hantar', jenis:'Urutkan (Drag & Tombol)',
    instruksi:'Urutkan larutan 0,1 M berikut dari daya hantar listrik <strong>TERBESAR</strong> (atas) ke <strong>TERKECIL</strong> (bawah). Seret itemnya atau gunakan tombol \u25B2/\u25BC.',
    items:[ { id:'hcl',   t:'HCl 0,1 M' },
            { id:'asetat', t:'CH<sub>3</sub>COOH 0,1 M' },
            { id:'gula',  t:'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> 0,1 M' } ],
    benar:[ 'hcl', 'asetat', 'gula' ],
    bahas:'HCl terionisasi sempurna (\u03B1 \u2248 1) \u2192 daya hantar terbesar; CH\u2083COOH hanya sebagian (0 < \u03B1 < 1) \u2192 sedang; gula tidak terionisasi (\u03B1 = 0) \u2192 terkecil.' },

  /* Soal jawaban ganda (checkbox, jawaban benar lebih dari satu) */
  multi: [
    { id:'e9', q:'Pilih <strong>semua</strong> larutan yang termasuk <strong>elektrolit kuat</strong>! (jawaban benar lebih dari satu)',
      opts:[ { t:'NaCl 0,1 M', benar:true }, { t:'CH<sub>3</sub>COOH 0,1 M' },
             { t:'H<sub>2</sub>SO<sub>4</sub> 0,1 M', benar:true }, { t:'C<sub>2</sub>H<sub>5</sub>OH 0,1 M' } ],
      bahas:'NaCl (garam) dan H\u2082SO\u2084 (asam kuat) terionisasi sempurna \u2014 keduanya elektrolit kuat. CH\u2083COOH elektrolit lemah; etanol non-elektrolit.' },
    { id:'e10', q:'Pilih <strong>semua</strong> pernyataan yang benar tentang <strong>elektrolit lemah</strong>! (jawaban benar lebih dari satu)',
      opts:[ { t:'Derajat ionisasinya memenuhi 0 < \u03B1 < 1', benar:true },
             { t:'Lampu pada rangkaian uji menyala terang' },
             { t:'Hanya sebagian molekul yang terionisasi', benar:true },
             { t:'Umumnya tersusun atas ikatan ion' } ],
      bahas:'Elektrolit lemah: \u03B1 antara 0 dan 1, terionisasi sebagian, lampu menyala <strong>redup</strong>, dan umumnya berupa senyawa <strong>kovalen polar</strong> (bukan ikatan ion).' }
  ]
};

/* Nilai pilihan untuk tabel LKPD */
const NILAI_NYALA = [ ['terang','Terang'], ['redup','Redup'], ['padam','Padam'] ];
const NILAI_GEL   = [ ['banyak','Banyak'], ['sedikit','Sedikit'], ['tidak','Tidak Ada'] ];
const NILAI_GOL   = [ ['kuat','Elektrolit Kuat'], ['lemah','Elektrolit Lemah'], ['non','Non-Elektrolit'] ];
