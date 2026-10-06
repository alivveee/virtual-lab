/* ============================================================
   LKPD.JS — modul Lembar Kerja Peserta Didik:
   identitas, alat-bahan, tabel pengamatan, analisis, cetak/PDF
============================================================ */
'use strict';

/* ---------- Daftar centang alat & bahan ---------- */
function renderAlat() {
  const w = $('#daftarAlat');
  if (!w) return;
  w.innerHTML = ALAT_BAHAN.map((a, i) =>
    '<div class="alat-item">' +
    '<input type="checkbox" class="alat-cek" id="alat-' + i + '" data-alat="' + i + '"' + (store.lkpd.alat[i] ? ' checked' : '') + '>' +
    '<label for="alat-' + i + '">' + a + '</label></div>'
  ).join('');
}

/* ---------- Tabel pengamatan (otomatis dari Lab Virtual + manual) ---------- */
function pilihanLKPD(s, jenis, nilai, opsi) {
  return '<select class="sel-lkpd" data-larutan="' + s.id + '" data-jenis="' + jenis + '" aria-label="' + jenis + ' untuk ' + s.nama + '">' +
    '<option value="">— pilih —</option>' +
    opsi.map(o => '<option value="' + o[0] + '"' + (nilai === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') +
    '</select>';
}
function renderTabelLKPD() {
  const tb = $('#tbodyLKPD');
  if (!tb) return;
  tb.innerHTML = SOLUSI.map(s => {
    const d = store.lkpd.tabel[s.id] || {};
    return '<tr>' +
      '<th scope="row"><span class="nama-larutan">' + s.nama + '</span><span class="rumus-kecil">' + s.rumusHTML + '</span></th>' +
      '<td>' + pilihanLKPD(s, 'nyala', d.nyala, NILAI_NYALA) + '</td>' +
      '<td>' + pilihanLKPD(s, 'gelembung', d.gelembung, NILAI_GEL) + '</td>' +
      '<td>' + pilihanLKPD(s, 'golongan', d.golongan, NILAI_GOL) + '</td></tr>';
  }).join('');
}

/* ---------- Semua isian LKPD tersimpan otomatis ---------- */
function tanganiLKPD(e) {
  const t = e.target;
  if (!t) return;
  if (t.id === 'inNama') store.lkpd.nama = t.value;
  else if (t.id === 'inKelas') store.lkpd.kelas = t.value;
  else if (t.id === 'inAbsen') store.lkpd.absen = t.value;
  else if (t.id === 'inTanggal') store.lkpd.tanggal = t.value;
  else if (t.classList.contains('ta-analisis')) store.lkpd.analisis[t.id] = t.value;
  else if (t.classList.contains('alat-cek')) store.lkpd.alat[t.dataset.alat] = t.checked;
  else if (t.classList.contains('sel-lkpd')) {
    const baris = store.lkpd.tabel[t.dataset.larutan] || {};
    if (t.value) baris[t.dataset.jenis] = t.value; else delete baris[t.dataset.jenis];
    store.lkpd.tabel[t.dataset.larutan] = baris;
  } else return;
  /* hapus tanda merah begitu pengguna mengoreksi isian */
  if (t.classList.contains('tidak-valid')) t.classList.remove('tidak-valid');
  const err = $('#err-' + t.id);
  if (err && err.textContent) err.hidden = true;
  simpanStore();
}

/* ---------- Validasi: nama, kelas, dan seluruh jawaban analisis wajib ---------- */
function validasiLKPD() {
  let ok = true, pertama = null;
  const periksa = (id, kond) => {
    const el = $('#' + id);
    if (!el) return;
    const err = $('#err-' + id);
    if (!kond) {
      el.classList.add('tidak-valid');
      if (err && err.textContent) err.hidden = false;
      ok = false;
      if (!pertama) pertama = el;
    } else {
      el.classList.remove('tidak-valid');
      if (err) err.hidden = true;
    }
  };
  periksa('inNama', $('#inNama').value.trim().length > 1);
  periksa('inKelas', $('#inKelas').value.trim().length > 0);
  ['ta1', 'ta2', 'ta3', 'ta4', 'ta5', 'ta6'].forEach(id => periksa(id, $('#' + id).value.trim().length > 0));
  if (!ok) {
    toast('⚠️ Nama, kelas, dan semua jawaban analisis wajib diisi sebelum mencetak! (lihat kolom bertanda merah)', 'peringatan');
    if (pertama) pertama.focus();
  }
  return ok;
}

/* ---------- Cetak / Simpan sebagai PDF ---------- */
function cetakLKPD() {
  if (!validasiLKPD()) return;
  const terisi = Object.keys(store.lkpd.tabel).filter(id => store.lkpd.tabel[id] && store.lkpd.tabel[id].nyala).length;
  if (terisi < 9) toast('ℹ️ Tabel pengamatan baru ' + terisi + '/9 larutan terisi — dialog cetak tetap dibuka.', 'info');
  setTimeout(() => window.print(), 450); /* beri waktu toast terbaca */
}

/* ---------- Kirim hasil uji Lab Virtual → tabel LKPD ----------
   Pencatatan ganda dicegah: baris larutan yang sama diperbarui, tidak diduplikasi */
function catatKeLKPD() {
  if (!store.lab.isi) return;
  const s = solusiById(store.lab.isi);
  if (!s) return;
  const k = KATEGORI[s.kategori];
  const sudah = !!(store.lkpd.tabel[s.id] && store.lkpd.tabel[s.id].nyala);
  store.lkpd.tabel[s.id] = { nyala: k.nyala, gelembung: k.gelembung, golongan: s.kategori };
  simpanStore();
  renderTabelLKPD();
  toast(
    sudah ? '📋 Baris <strong>' + s.nama + '</strong> di tabel LKPD <strong>diperbarui</strong> (pencatatan ganda dicegah).'
          : '📋 Hasil <strong>' + s.nama + '</strong> berhasil dicatat ke tabel LKPD!',
    'sukses'
  );
}

/* ---------- Inisialisasi modul LKPD ---------- */
function pasangLKPD() {
  const L = store.lkpd;
  $('#inNama').value = L.nama || '';
  $('#inKelas').value = L.kelas || '';
  $('#inAbsen').value = L.absen || '';
  $('#inTanggal').value = L.tanggal || tanggalLokal(); /* terisi otomatis, tetap bisa diubah */
  ['ta1', 'ta2', 'ta3', 'ta4', 'ta5', 'ta6'].forEach(id => { $('#' + id).value = L.analisis[id] || ''; });
  renderAlat();
  renderTabelLKPD();
  $('#lkpd').addEventListener('input', tanganiLKPD);
  $('#lkpd').addEventListener('change', tanganiLKPD);
  $('#btnCetak').addEventListener('click', cetakLKPD);
  $('#btnPDF').addEventListener('click', () => { if (validasiLKPD()) tampilkanModal($('#modalCetak')); });
  $('#cetakYa').addEventListener('click', () => { sembunyikanModal($('#modalCetak')); cetakLKPD(); });
  $('#cetakBatal').addEventListener('click', () => sembunyikanModal($('#modalCetak')));
}
