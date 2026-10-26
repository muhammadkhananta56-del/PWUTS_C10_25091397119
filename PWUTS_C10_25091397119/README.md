# Step Clean — Aplikasi Pemesanan Jasa Cuci Sepatu

**Mata Kuliah:** Pemrograman Web (UTS)  
**Nama Mahasiswa:** M. Khananta Putra Sani  
**NIM:** 25091397119  
**Kode Kelompok:** C10  
**GitHub:** [muhammadkhananta56-del](https://github.com/muhammadkhananta56-del)  
**Teknologi:** HTML, CSS, JavaScript, jQuery/AJAX, PHP Native, dan MySQL

## 1. Deskripsi Proyek

Step Clean merupakan aplikasi web pemesanan jasa cuci sepatu yang dikembangkan untuk memenuhi tugas Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web. Aplikasi ini dirancang untuk memudahkan pelanggan dalam melihat pilihan layanan, melakukan pemesanan, serta memeriksa informasi pesanan menggunakan nomor pesanan.

Pengembangan aplikasi memanfaatkan HTML, CSS, dan JavaScript untuk membangun antarmuka pengguna. jQuery/AJAX digunakan untuk mendukung navigasi dan pemuatan konten halaman, sedangkan PHP dan MySQL digunakan untuk memproses serta menyimpan data pemesanan.

Fitur pembeda individu pada proyek ini adalah **form booking bertahap yang dilengkapi ringkasan transaksi**, sehingga pelanggan dapat memeriksa informasi pesanan sebelum mengirimkan formulir.

## 2. Fitur Aplikasi

Berikut fitur utama yang tersedia pada aplikasi Step Clean:

- **Halaman Beranda:** menampilkan halaman utama aplikasi Step Clean.
- **Halaman Layanan:** menampilkan pilihan layanan cuci sepatu beserta informasi harga.
- **Form Booking Bertahap:** menyediakan tahapan pengisian informasi layanan, sepatu, pelanggan, dan serah-terima.
- **Ringkasan Transaksi:** menampilkan ringkasan pesanan dan estimasi biaya sebelum pemesanan dikirim.
- **Validasi Formulir:** memeriksa kelengkapan input wajib agar formulir tidak dikirim dalam kondisi yang belum lengkap.
- **Pemrosesan Data dengan PHP:** memvalidasi permintaan pemesanan di sisi server dan memproses penyimpanan data.
- **Database MySQL:** digunakan untuk menyimpan data yang berkaitan dengan pemesanan.
- **Nomor Pesanan:** menghasilkan nomor pesanan setelah booking berhasil diproses.
- **Tracking Pesanan:** memungkinkan pelanggan mencari informasi pesanan berdasarkan nomor pesanan.
- **Navigasi jQuery/AJAX:** mendukung pemuatan konten halaman tanpa harus memuat ulang seluruh halaman utama.

## 3. Struktur Folder Proyek

Struktur utama proyek adalah sebagai berikut:

```text
PWUTS_C10_25091397119/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── booking.js
│       └── tracking.js
├── pages/
│   ├── beranda.html
│   ├── layanan.html
│   ├── booking.html
│   └── tracking.html
└── backend/
    ├── config.php
    ├── booking.php
    ├── tracking.php
    └── database.sql
```

## 4. Teknologi yang Digunakan

| Teknologi | Penggunaan |
|---|---|
| HTML | Menyusun struktur halaman web. |
| CSS | Mengatur tata letak dan tampilan antarmuka. |
| JavaScript | Menambahkan interaksi pada halaman. |
| jQuery/AJAX | Mendukung navigasi dan pemuatan konten secara dinamis. |
| PHP Native | Memproses permintaan booking dan tracking di sisi server. |
| MySQL | Menyimpan data aplikasi. |
| XAMPP | Menyediakan lingkungan server lokal untuk menjalankan aplikasi. |

## 5. Persiapan dan Cara Menjalankan Aplikasi

### Persyaratan

- XAMPP atau lingkungan lokal yang menyediakan Apache, PHP, dan MySQL/MariaDB.
- Browser web modern.

### Langkah menjalankan aplikasi

1. Pastikan folder proyek berada di direktori web server, misalnya:

   `C:\xampp\htdocs\PWUTS_C10_25091397119`

2. Buka XAMPP Control Panel, kemudian jalankan **Apache** dan **MySQL**.
3. Buka phpMyAdmin melalui alamat:

   `http://localhost/phpmyadmin/`

4. Impor file `backend/database.sql` untuk menyiapkan database dan tabel aplikasi.
5. Periksa file `backend/config.php`. Sesuaikan konfigurasi koneksi database, termasuk host, nama database, username, dan password, dengan lingkungan lokal.
6. Buka aplikasi melalui browser:

   `http://localhost/PWUTS_C10_25091397119/`

7. Coba fitur navigasi, lakukan pemesanan menggunakan data uji, lalu gunakan nomor pesanan yang dihasilkan untuk menguji fitur tracking.

**Catatan:** Aplikasi harus dijalankan melalui web server lokal. Membuka file `index.html` secara langsung menggunakan alamat `file://` tidak dapat menggantikan lingkungan PHP dan AJAX yang dibutuhkan aplikasi.

## 6. Alur Pemesanan

Alur pemesanan pada aplikasi Step Clean adalah sebagai berikut:

1. Pelanggan memilih layanan cuci sepatu dan mengisi informasi sepatu.
2. Pelanggan melengkapi informasi kontak dan metode serah-terima.
3. Aplikasi menampilkan ringkasan transaksi beserta estimasi biaya.
4. Pelanggan memeriksa informasi yang dimasukkan dan menyetujui pemesanan.
5. Formulir dikirim ke backend untuk diproses.
6. Jika data valid dan database dapat diakses, sistem menyimpan data pemesanan dan menghasilkan nomor pesanan.
7. Pelanggan dapat menggunakan nomor pesanan tersebut pada halaman **Tracking / Cek Pesanan** untuk mencari informasi pesanan.

## 7. Status Pengujian

Pengujian dilakukan secara bertahap pada lingkungan lokal. Tabel berikut membedakan fitur yang telah dilaporkan berhasil diuji, pemeriksaan sintaks, dan hal-hal yang masih memerlukan verifikasi lebih lanjut.

| No. | Pengujian | Status |
|---|---|---|
| 1 | Booking berhasil diproses | Berhasil diuji |
| 2 | Data booking tersimpan di database MySQL | Berhasil diuji |
| 3 | Nomor pesanan ditampilkan setelah booking berhasil | Berhasil diuji |
| 4 | Tracking menggunakan nomor pesanan | Berhasil diuji |
| 5 | Form booking menolak input wajib yang kosong | Berhasil diuji |
| 6 | Pemeriksaan sintaks file PHP | Lolos pemeriksaan sintaks |
| 7 | Pemeriksaan sintaks file JavaScript | Lolos pemeriksaan sintaks |
| 8 | Seluruh navigasi AJAX pada berbagai kondisi browser | Belum diverifikasi secara menyeluruh |
| 9 | Tampilan pada perangkat mobile, tablet, dan desktop | Belum diverifikasi secara menyeluruh |
| 10 | Pemeriksaan menyeluruh terhadap console browser dan log PHP | Belum diverifikasi secara menyeluruh |
| 11 | Deployment backend PHP dan MySQL ke server online | Belum dilakukan |

**Keterangan:** Pemeriksaan sintaks tidak sama dengan pengujian fungsional secara menyeluruh. Status pengujian perlu diperbarui apabila verifikasi tambahan telah dilakukan.

## 8. Catatan dan Batasan Aplikasi

Beberapa informasi dan fitur masih memiliki batasan sebagai berikut:

- Harga layanan Fast Clean, Deep Clean, dan Premium Care serta estimasi durasi merupakan data contoh, bukan harga resmi yang telah dikonfirmasi.
- Informasi alamat toko, kontak resmi, jam operasional, wilayah jemput/antar, dan tarif jemput/antar masih perlu dilengkapi.
- Tanggal pilihan pelanggan merupakan tanggal preferensi dan bukan jaminan jadwal layanan.
- Biaya jemput/antar belum dimasukkan ke dalam total transaksi karena tarif resminya belum tersedia.
- Fitur login dan dashboard admin, pembayaran online, otomatisasi WhatsApp, Google Maps, serta pengiriman notifikasi otomatis belum termasuk dalam implementasi ini.
- Aplikasi dikembangkan untuk keperluan akademik dan belum dinyatakan siap digunakan sebagai layanan produksi.
- Sebelum digunakan secara nyata, sistem perlu dievaluasi lebih lanjut dari sisi keamanan, perlindungan data pelanggan, pencatatan aktivitas, dan pencadangan database.

## 9. Repository GitHub

Kode sumber proyek disimpan pada repository berikut:

**[Buka Repository Step Clean di GitHub](https://github.com/muhammadkhananta56-del/PWUTS_C10_25091397119)**

Repository digunakan untuk menyimpan dan mendokumentasikan kode sumber proyek. Pastikan seluruh file yang diperlukan telah diunggah dan perubahan terakhir sudah disimpan melalui commit.

Perlu diperhatikan bahwa **GitHub Pages hanya digunakan untuk menyajikan konten statis dan tidak menjalankan PHP maupun MySQL**. Oleh karena itu, fitur booking dan tracking yang memerlukan backend harus dijalankan melalui XAMPP atau server hosting yang mendukung PHP dan MySQL.

## 10. Kesesuaian Implementasi dengan Fokus UTS

Bagian-bagian proyek yang mendukung implementasi aplikasi web adalah:

| Komponen | File |
|---|---|
| Halaman utama | `index.html` |
| Navigasi dan pemuatan konten AJAX | `assets/js/app.js` |
| Halaman beranda | `pages/beranda.html` |
| Halaman layanan | `pages/layanan.html` |
| Halaman booking | `pages/booking.html` |
| Interaksi booking | `assets/js/booking.js` |
| Halaman tracking | `pages/tracking.html` |
| Interaksi tracking | `assets/js/tracking.js` |
| Pemrosesan booking di sisi server | `backend/booking.php` |
| Pemrosesan tracking di sisi server | `backend/tracking.php` |
| Konfigurasi koneksi database | `backend/config.php` |
| Struktur database | `backend/database.sql` |
| Dokumentasi proyek | `README.md` |

## 11. Penutup

Step Clean merupakan implementasi aplikasi web pemesanan jasa cuci sepatu yang menggabungkan antarmuka web, navigasi AJAX, formulir transaksi bertahap, pemrosesan data menggunakan PHP, dan penyimpanan MySQL.

Dokumentasi ini disusun untuk menjelaskan tujuan, fitur, struktur folder, cara menjalankan aplikasi, serta status pengujiannya. Pengembangan dan pengujian lanjutan tetap diperlukan untuk memastikan seluruh kebutuhan pada instruksi UTS terpenuhi.

