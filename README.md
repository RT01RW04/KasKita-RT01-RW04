# KasKita PWA 3.0.7 — Lintas Platform

Aplikasi pembukuan kas RT, dikembangkan oleh **BolangCorp**. Ini adalah paket situs statis yang siap diunggah ke repositori GitHub. Aplikasi menggunakan satu iuran bulanan per warga dengan tarif awal Rp10.000, dapat diubah pada **Akun → Pengaturan → Kas & pembayaran**.

## Isi utama

- `index.html` dan file JavaScript/CSS: aplikasi.
- `manifest.json`, `sw.js` dan `icons/`: pemasangan PWA dan cache offline.
- `Panduan-Instalasi-KasKita-Lintas-Platform.pdf`: panduan instalasi dan penggunaan.
- `assets/`: font dan pustaka aplikasi yang diperlukan (beserta lisensinya).
- `compat.js` dan `sumber/`: penyesuaian browser lama dan sumber yang mudah diedit. File JavaScript di akar adalah hasil transpile; hosting tidak memerlukan proses build.
- `netlify.toml`: konfigurasi opsional untuk Netlify.

Paket ini **tidak berisi foto buku asli, daftar nama warga, transaksi, file cadangan, APK, ataupun kunci signing**. Pengguna dapat mengisi warga sendiri atau memulihkan cadangan JSON yang aman. Jangan pernah mengunggah cadangan data warga, kunci, atau informasi pribadi ke repo publik.

## Unggah ke GitHub

1. Ekstrak ZIP di komputer/HP. Pastikan `index.html` terlihat di tingkat teratas folder hasil ekstraksi.
2. Buat repo baru di GitHub. Pilih visibilitas sesuai kebutuhan dan ketentuan layanan GitHub; **jangan memasukkan data pribadi ke repo publik**.
3. Pada repo, pilih **Add file → Upload files**. Unggah **seluruh isi folder hasil ekstraksi**, termasuk folder `assets` dan `icons`, bukan file ZIP-nya. Pastikan `index.html` berada di akar repo, bukan di dalam folder tambahan.
4. Masukkan pesan commit lalu pilih **Commit changes**. Pastikan file `sw.js`, `manifest.json`, dan PDF juga ada di akar repo. File tersembunyi `.nojekyll` disertakan; jika tidak terlihat saat memilih file, buat lewat **Add file → Create new file** dengan nama `.nojekyll` atau unggah melalui Git.

### Publikasi dengan GitHub Pages (opsional)

1. Di repo buka **Settings → Pages**.
2. Di **Build and deployment**, pilih **Deploy from a branch**, pilih branch tempat file diunggah (biasanya `main`), pilih **/ (root)**, lalu simpan.
3. Tunggu deployment selesai. Buka alamat HTTPS yang ditampilkan oleh GitHub pada halaman Pages. Ketersediaan dan visibilitas Pages bergantung pada jenis repo dan paket GitHub Anda. Repositori tanpa Pages hanyalah tempat penyimpanan kode, bukan situs PWA yang berjalan.
4. Buka alamat tersebut saat online terlebih dahulu. Setelah halaman dan cache selesai dimuat, pasang dari menu browser: Android Chrome → Instal/Tambahkan ke layar utama; iPhone Safari → Bagikan → Tambahkan ke Layar Utama.

### Alternatif Netlify

Hubungkan repo GitHub ke Netlify, atau unggah isi folder hasil ekstraksi via Netlify Drop. Tidak perlu build command; publish directory `.`. Gunakan HTTPS yang diberikan Netlify.

## Data, akses, dan keamanan

- Data buku kas tersimpan **lokal pada browser/perangkat dan asal situs**. Tidak otomatis tersinkron antarperangkat, browser, APK, GitHub Pages, atau Netlify. Buat cadangan JSON sebelum pindah perangkat/alamat atau menghapus data browser. Pemulihan **mengganti** data yang sudah ada pada tujuan.
- Situs HTTPS diperlukan untuk service worker dan kamera (localhost bisa digunakan untuk pengujian lokal). WhatsApp/Drive membutuhkan internet. WhatsApp dibuka untuk pengiriman manual oleh pengurus. Google Drive membutuhkan konfigurasi OAuth Client ID dan izin akun Google.
- Login hanyalah pengunci lokal, bukan autentikasi server. Ganti password awal saat pertama masuk; siapa pun dengan akses penuh ke perangkat atau cadangan mungkin dapat membaca/mengubah data.
- Migrasi data lama mempertahankan transaksi dan saldo. Kas sosial/jimpitan/donasi lama bukan status lunas iuran tunggal; status pembayaran tunggal menggunakan kas wajib lama. Perkiraan semua bulan yang belum dibayar menggunakan tarif saat ini, termasuk bulan lampau.
- Untuk panduan lengkap dan akun awal, buka [Panduan KasKita PWA (PDF)](Panduan-Instalasi-KasKita-Lintas-Platform.pdf).

## Uji lokal

Dari akar folder repo:

```sh
python3 -m http.server 8000
```

Buka `http://localhost:8000/`. Pengujian HTTPS publik dan izin kamera pada perangkat nyata tetap disarankan.

## Instalasi lintas platform

- **Android 8 dan lebih baru:** buka alamat HTTPS di Chrome terbaru yang tersedia untuk perangkat → menu → Instal aplikasi / Tambahkan ke layar utama.
- **iPhone/iPad iOS 12 dan lebih baru:** Safari → Bagikan → Tambahkan ke Layar Utama. iOS 12 menerima penyesuaian sintaks dan fallback, tetapi belum diuji pada perangkat asli; kamera PWA, ekspor/unduhan, penyimpanan dan berbagi dapat terbatas. Buka Safari, atau gunakan tautan file dan Bagikan → Simpan ke File bila tersedia. Data Safari dan aplikasi layar utama bisa terpisah.
- **Windows:** Chrome atau Edge → ikon instal di bilah alamat; Edge juga menyediakan menu Aplikasi → Instal situs ini sebagai aplikasi.
- **Mac:** Chrome/Edge dengan opsi instal; Safari → File → Tambahkan ke Dock memerlukan macOS Sonoma 14 atau lebih baru. Pada Mac lama gunakan browser yang masih didukung atau akses situs sebagai halaman biasa.

Menu, dukungan dan perilaku bisa berbeda berdasarkan perangkat dan versi browser. Gunakan HTTPS, buka secara online sekali, dan uji fitur penting sebelum dipakai. Semua fitur tidak dijamin pada iOS 12; tidak ada klaim uji perangkat fisik. Petunjuk lengkap ada pada PDF.

### Mengubah kode sumber

Sunting berkas di `sumber/`, lalu dari akar repo jalankan `npm ci` dan `npm run build:legacy` untuk membuat ulang JavaScript di akar (target Babel iOS 12 dan Chrome 65). `node_modules` tidak diperlukan untuk menjalankan atau mengunggah situs. Setelah mengubah aset PWA, ubah nama cache di `sumber/sw.js`, lalu build lagi. Pustaka pihak ketiga disertakan di `assets/` bersama lisensinya.
