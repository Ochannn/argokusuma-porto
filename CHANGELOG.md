# Perubahan versi 2

- Struktur dipindahkan ke `app/components/portfolio`; satu entry `app/page.tsx` untuk mencegah import ke file lama.
- Intro baru dengan orbit, enam garis, headline bermask, timeline, dan transisi zoom-out/lift-away.
- Hero sticky, story sticky dalam track scroll, dan section proyek dengan overlap satu viewport.
- Story word assembly dibuat deterministik dan memiliki fallback untuk reduced motion atau konten yang terlalu tinggi.
- Smooth wheel scrolling melalui Lenis; touch tetap native.
- Showcase tetap besar dan utuh dengan informasi di luar gambar, slide/grid, swipe, keyboard, thumbnail, dan dialog.
- Cosmic canvas serta SoundController kini lengkap dalam satu paket. Audio menggunakan path yang terlihat di proyek pengguna.
- Nama aset `TES.png` mengikuti screenshot pengguna.
- Semua tampilan menggunakan CSS Module yang terisolasi; tidak membutuhkan utility Tailwind.
- Source diformat dan diuji pada harness Next.js.
