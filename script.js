// GANTI dengan Web App URL yang kamu dapat dari Apps Script tadi
const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbz-FZJP9YsXr2Jk-f-lFvUMAKoSa4S5xeDAuO7uZZZSwCypsCD4s0CLgOxb6fH1Vg_0YA/exec";

// Tampilkan tanggal hari ini otomatis
const namaHari = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const namaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const sekarang = new Date();
document.getElementById("tanggal-hari-ini").textContent =
  namaHari[sekarang.getDay()] +
  ", " +
  sekarang.getDate() +
  " " +
  namaBulan[sekarang.getMonth()] +
  " " +
  sekarang.getFullYear();

// Ambil elemen-elemen yang kita butuhkan
const form = document.getElementById("form-absen");
const btnSubmit = document.getElementById("btn-submit");
const pesanStatus = document.getElementById("pesan-status");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // mencegah halaman reload saat submit

  const nama = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();

  if (!nama || !kelas) {
    tampilkanPesan("Nama dan kelas wajib diisi.", "gagal");
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Mengirim...";

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    mode: "no-cors", // wajib, karena Apps Script tidak mengirim header CORS
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ nama: nama, kelas: kelas }),
  })
    .then(function () {
      tampilkanPesan("Absen berhasil, " + nama + "! Terima kasih.", "sukses");
      form.reset();
    })
    .catch(function () {
      tampilkanPesan(
        "Gagal mengirim. Cek koneksi internet, lalu coba lagi.",
        "gagal",
      );
    })
    .finally(function () {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Catat kehadiran";
    });
});

function tampilkanPesan(teks, jenis) {
  pesanStatus.textContent = teks;
  pesanStatus.className = jenis;
}
