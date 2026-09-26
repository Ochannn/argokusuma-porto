# Portfolio Universe — versi 2

Paket TSX untuk proyek Next.js Argo Kusuma yang sudah ada. Tema tetap kosmik gelap dengan enam warna, bintang, dan garis interaktif. Susunan visual mengikuti pola referensi: hero menetap, story naik menutup hero, teks menyatu, lalu section proyek naik menutup story.

## 1. Salin foldernya, jangan pindahkan file satu-satu

Ekstrak ZIP. Di dalamnya ada folder `Portfolio-Universe-V2`.

Salin **folder `app` di dalam paket** ke folder utama proyek Anda, yaitu folder yang berisi `package.json` dan `public`.

Jika ditanya apakah `app/page.tsx` perlu diganti, pilih Replace. Simpan cadangan file page lama jika masih diperlukan.

Hasil yang benar:

| Lokasi | Isi / fungsi |
| --- | --- |
| `app/page.tsx` | Halaman utama baru; hanya mengimpor Portfolio |
| `app/components/portfolio/Portfolio.tsx` | Pengatur intro, lapisan section, dan scroll |
| `app/components/portfolio/IntroLoader.tsx` | Intro orbit, progress visual, zoom-out, dan lift-away |
| `app/components/portfolio/HeroSection.tsx` | Hero dan navigasi |
| `app/components/portfolio/StorySection.tsx` | Section naik dan kata-kata yang menyatu |
| `app/components/portfolio/ProjectsSection.tsx` | Slide, grid, thumbnail, swipe, dan dialog gambar |
| `app/components/portfolio/CosmicBackground.tsx` | Bintang, garis interaktif, dan respons audio |
| `app/components/portfolio/SoundController.tsx` | Musik dengan tombol dan analyser |
| `app/components/portfolio/useSmoothScroll.ts` | Smooth wheel scroll menggunakan Lenis |
| `app/components/portfolio/projects.ts` | Data proyek; edit judul, deskripsi, teknologi, gambar di sini |
| `app/components/portfolio/types.ts` | Tipe data dan enam warna universe |
| `app/components/portfolio/portfolio.module.css` | Semua tampilan, responsive layout, dan keyframes |

File `layout.tsx`, `globals.css`, `package.json`, dan isi `public` milik Anda tetap digunakan. Paket tidak menyertakan pengganti file-file tersebut. Komponen lama yang masih berada langsung di `app` tidak dipakai lagi oleh page baru; tidak harus dihapus.

Jika proyek menggunakan `src/app`, gabungkan isi folder `app` paket ke `src/app` Anda.

## 2. Pasang dependency

Buka terminal VS Code di folder proyek. Di Windows / PowerShell:

```powershell
npm.cmd install motion@13.4.4 lenis@1.3.26
```

Kemudian:

```powershell
npm.cmd run dev
```

Buka alamat Local yang ditampilkan terminal, biasanya `http://localhost:3000`. Pada macOS/Linux gunakan `npm` tanpa `.cmd`.

Tidak perlu memasang Vite. Ini adalah paket untuk proyek Next.js yang sudah Anda miliki. Source tidak bergantung pada utility Tailwind; seluruh tampilan utama berada di CSS Module.

## 3. Gambar dan musik

Gambar dan audio asli ada di komputer Anda, bukan dalam ZIP ini. Pertahankan aset di folder `public`.

| Data saat ini | File yang dicari |
| --- | --- |
| Predictive Sales System | `public/projects/TES.png` |
| Trading Intelligence | `public/projects/trading-intelligence.webp` |
| Pusat Soal | `public/projects/pusat-soal.webp` |
| Portfolio Universe | `public/projects/portfolio-universe.webp` |
| Educational Platform | `public/projects/educational-platform.webp` |
| SMC Market System | `public/projects/smc-system.webp` |
| Musik | `public/music/universe.mp3` |

Path `TES.png` disesuaikan dengan nama file yang terlihat pada screenshot VS Code Anda. Jika gambar lainnya belum tersedia, isi properti `image` pada `projects.ts` dengan nama screenshot asli Anda. Jangan memakai satu gambar untuk menggambarkan proyek berbeda jika isinya tidak sesuai.

Contoh:

```ts
image: "/projects/nama-screenshot-anda.png",
```

Tidak perlu menuliskan `/public` di string tersebut. Huruf besar/kecil harus sama, terutama saat deployment. Gunakan gambar 1920 × 1080 atau lebih agar teks dashboard terlihat jelas. Gambar ditampilkan utuh tanpa crop; tombol Perbesar menampilkan versi hampir selayar penuh. Kualitas tidak dapat melebihi resolusi file asal.

Musik baru diputar ketika pengunjung menekan **Sound off**. Browser tidak dipaksa autoplay. Jika audio gagal, muncul pesan tanpa membuat halaman crash.

## 4. Animasi yang dibuat

1. Intro: enam garis muncul, orbit bergerak, headline naik per baris, progress visual 0–100, lalu layar mengecil dan naik keluar. Tombol Masuk ke portfolio melewati waktu tunggu tetapi tetap menjalankan transisi.
2. Hero: headline naik melalui mask, identitas dan caption muncul bertahap. Hero menetap di belakang saat story masuk.
3. Story: panel bersudut melengkung naik dari bawah menutup hero. Kata-kata menyebar secara deterministik lalu menyatu mengikuti scroll. Garis dan kalimat penutup menyusul.
4. Work: panel proyek naik di atas story; hero dan story tidak langsung menghilang atau diganti halaman.
5. Carousel: slide bergeser dengan crossfade, arah maju/mundur sesuai kontrol, thumbnail aktif mengikuti pilihan. Tidak ada autoplay agar pengunjung bisa membaca karya.
6. Dialog: gambar ditampilkan besar dengan navigasi proyek. Escape/Tutup mengembalikan fokus ke tombol Perbesar.
7. Latar: bintang berkelip, partikel menyusuri enam garis, pointer memengaruhi garis, klik membuat gelombang, audio memberi energi pada garis.
8. Smooth scroll: wheel diberi interpolasi Lenis; touch tetap native untuk respons yang natural.

Persentase intro adalah timeline visual pembuka, bukan pengukuran download aset.

## 5. Mengubah bagian tertentu

- Nama dan headline: `HeroSection.tsx`.
- Kalimat intro: `IntroLoader.tsx`.
- Waktu intro: `duration` di `IntroLoader.tsx` (3200 ms + jeda 700 ms, lalu transisi 1,65 detik).
- Kalimat story: `statement` di `StorySection.tsx`.
- Panjang perjalanan story: `.storyTrack` di CSS (desktop 280svh, mobile 250svh).
- Kecepatan kata menyatu: mapping `[0, 0.42]` di `StorySection.tsx`.
- Intensitas scroll halus: `duration: 1.05` di `useSmoothScroll.ts`.
- Data proyek: `projects.ts`.
- Warna utama: variabel pada `.portfolio` dan `THREAD_COLORS` pada `types.ts`.

Jangan memberi `transform`, `overflow: hidden`, atau `overflow: auto` pada parent `.main`/container di layout. Properti tersebut dapat mengubah perilaku sticky. Jangan membungkus paket dengan scroll library kedua karena paket sudah memakai Lenis.

## 6. Responsive dan aksesibilitas

- Mobile: headline disesuaikan, deskripsi proyek vertikal, thumbnail bergeser horizontal, dan swipe hanya aktif jika gerakan dominan horizontal.
- Keyboard: Tab menuju kontrol, panah kiri/kanan di showcase/dialog berpindah proyek, Escape menutup dialog.
- Reduced motion: gerakan besar dan canvas berhenti, cerita langsung terbaca, scroll menggunakan perilaku native.
- Jika isi story terlalu tinggi untuk viewport (misalnya landscape pendek atau teks diperbesar), panel beralih ke alur biasa agar tidak memotong tulisan.
- Canvas berhenti memperbarui saat tab tersembunyi dan dibatasi frame rate serta kepadatan piksel pada perangkat kecil.

## 7. Jika muncul error

**Cannot find module `./projects`:** semua file dalam `app/components/portfolio` harus ikut disalin. Import tidak memakai ekstensi `.ts`.

**Cannot resolve CSS:** nama yang benar adalah `portfolio.module.css`, bukan `portofolio.module.css`. Jangan rename atau memindahkan file dari folder komponen.

**Cannot find module `lenis`:** jalankan perintah instalasi di langkah 2 dari folder yang berisi `package.json`.

**Halaman lama tetap muncul:** pastikan `app/page.tsx` sudah diganti dan mengimpor `./components/portfolio/Portfolio`. Bila perlu hentikan server dengan Ctrl+C, lalu jalankan lagi `npm.cmd run dev`.

**Gambar tidak tampil:** sesuaikan path `image` dengan file nyata di `public/projects`.

**Musik tidak tampil/berbunyi:** gunakan tombol Sound dan pastikan file ada di `public/music/universe.mp3`.

## Validasi

- TypeScript strict: lolos.
- Build produksi Next.js 16.3.6 menggunakan webpack: lolos, halaman berhasil diprerender.
- Lima pengujian komponen berbasis DOM: lolos untuk navigasi, wrap-around, keyboard scoped, grid selection, dialog, scroll lock, fokus kembali, fallback gambar, pemisahan swipe horizontal/vertikal, skip intro satu kali, dan pembersihan timer intro.
- Source diformat dengan Prettier.
- Browser referensi berhasil diperiksa langsung. Implementasi ini mengikuti pola visual dan interaksi yang diamati serta permintaan Anda; bukan klaim bahwa setiap detail timing identik dengan source asli.
- Browser pengujian tidak dapat mengakses server lokal lingkungan pengerjaan. Tampilan akhir desktop/mobile, animasi scroll secara visual, perilaku native dialog lintas browser, dan musik/screenshot asli belum terverifikasi pada browser proyek Anda. Pengujian DOM bukan pengganti pemeriksaan visual.
