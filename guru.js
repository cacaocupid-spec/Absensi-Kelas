// GANTI dengan Web App URL yang sama seperti di script.js
const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbz-FZJP9YsXr2Jk-f-lFvUMAKoSa4S5xeDAuO7uZZZSwCypsCD4s0CLgOxb6fH1Vg_0YA/exec";

let semuaData = [];
let filterAktif = "hari-ini";

const statusMuat = document.getElementById("status-muat");
const tabel = document.getElementById("tabel-presensi");
const isiTabel = document.getElementById("isi-tabel");
const pesanKosong = document.getElementById("pesan-kosong");
const tombolFilter = document.querySelectorAll(".opsi-filter");

// Ambil data dari Apps Script
fetch(URL_APPS_SCRIPT)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    semuaData = data;
    statusMuat.style.display = "none";
    tabel.style.display = "table";
    renderData();
  })
  .catch(function (err) {
    statusMuat.textContent = "Gagal memuat data. Coba refresh halaman.";
  });

// Logika tombol filter
tombolFilter.forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    tombolFilter.forEach(function (t) {
      t.classList.remove("aktif");
    });
    tombol.classList.add("aktif");
    filterAktif = tombol.getAttribute("data-filter");
    renderData();
  });
});

function renderData() {
  const hariIni = formatTanggalHariIni();

  let dataTampil = semuaData;
  if (filterAktif === "hari-ini") {
    dataTampil = semuaData.filter(function (item) {
      return item.Tanggal === hariIni;
    });
  }

  // Urutkan dari yang paling baru
  dataTampil = dataTampil.slice().reverse();

  // Hitung ringkasan
  const totalMurid = dataTampil.filter(function (item) {
    return item.Peran === "Murid";
  }).length;
  const totalGuru = dataTampil.filter(function (item) {
    return item.Peran === "Guru";
  }).length;
  const totalTerlambat = dataTampil.filter(function (item) {
    return item.Status === "Terlambat";
  }).length;

  document.getElementById("angka-total").textContent = dataTampil.length;
  document.getElementById("angka-murid").textContent = totalMurid;
  document.getElementById("angka-guru").textContent = totalGuru;
  document.getElementById("angka-terlambat").textContent = totalTerlambat;

  // Isi tabel
  isiTabel.innerHTML = "";

  if (dataTampil.length === 0) {
    tabel.style.display = "none";
    pesanKosong.style.display = "block";
    return;
  }

  tabel.style.display = "table";
  pesanKosong.style.display = "none";

  dataTampil.forEach(function (item) {
    const kelasStatus = item.Status === "Terlambat" ? "terlambat" : "tepat";
    const baris = document.createElement("tr");
    baris.innerHTML =
      '<td data-label="Tanggal">' +
      item.Tanggal +
      "</td>" +
      '<td data-label="Waktu">' +
      item.Waktu +
      "</td>" +
      '<td data-label="Peran"><span class="lencana-peran ' +
      item.Peran +
      '">' +
      item.Peran +
      "</span></td>" +
      '<td data-label="Nama">' +
      item.Nama +
      "</td>" +
      '<td data-label="Kelas/Mapel">' +
      item["Kelas/Mapel"] +
      "</td>" +
      '<td data-label="Status"><span class="lencana-status ' +
      kelasStatus +
      '">' +
      item.Status +
      "</span></td>";
    isiTabel.appendChild(baris);
  });
}

function formatTanggalHariIni() {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const tanggal = String(sekarang.getDate()).padStart(2, "0");
  return tahun + "-" + bulan + "-" + tanggal;
}
