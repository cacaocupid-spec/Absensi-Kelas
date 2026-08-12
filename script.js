// GANTI dengan Web App URL dari Apps Script kamu
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

// Elemen-elemen yang kita butuhkan
const tombolPeran = document.querySelectorAll(".opsi-peran");
const inputPeran = document.getElementById("peran");
const labelKelasMapel = document.getElementById("label-kelas-mapel");
const inputKelasMapel = document.getElementById("kelasMapel");
const form = document.getElementById("form-presensi");
const btnSubmit = document.getElementById("btn-submit");
const teksTombol = document.getElementById("teks-tombol");
const pesanStatus = document.getElementById("pesan-status");

// Logika toggle Guru / Murid
tombolPeran.forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    // Hapus class 'aktif' dari semua tombol, lalu kasih ke yang diklik
    tombolPeran.forEach(function (t) {
      t.classList.remove("aktif");
    });
    tombol.classList.add("aktif");

    const peranTerpilih = tombol.getAttribute("data-peran");
    inputPeran.value = peranTerpilih;

    // Sesuaikan label & placeholder field kedua tergantung peran
    if (peranTerpilih === "Guru") {
      labelKelasMapel.textContent = "Mata pelajaran / Jabatan";
      inputKelasMapel.placeholder = "Contoh: Guru Matematika";
    } else {
      labelKelasMapel.textContent = "Kelas";
      inputKelasMapel.placeholder = "Contoh: 5B";
    }
  });
});

// Submit form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const peran = inputPeran.value;
  const nama = document.getElementById("nama").value.trim();
  const kelasMapel = inputKelasMapel.value.trim();

  if (!nama || !kelasMapel) {
    tampilkanPesan("Semua kolom wajib diisi.", "gagal");
    return;
  }

  btnSubmit.disabled = true;
  teksTombol.textContent = "Mengirim...";

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ peran: peran, nama: nama, kelasMapel: kelasMapel }),
  })
    .then(function () {
      tampilkanPesan("Presensi berhasil dicatat, " + nama + "!", "sukses");
      form.reset();
      inputPeran.value = "Murid"; // reset toggle ke default
      tombolPeran.forEach(function (t) {
        t.classList.remove("aktif");
      });
      tombolPeran[0].classList.add("aktif");
      labelKelasMapel.textContent = "Kelas";
      inputKelasMapel.placeholder = "Contoh: 5B";
    })
    .catch(function () {
      tampilkanPesan(
        "Gagal mengirim. Cek koneksi internet, lalu coba lagi.",
        "gagal",
      );
    })
    .finally(function () {
      btnSubmit.disabled = false;
      teksTombol.textContent = "Catat kehadiran";
    });
});

function tampilkanPesan(teks, jenis) {
  pesanStatus.textContent = teks;
  pesanStatus.className = jenis;
}
