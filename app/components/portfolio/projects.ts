export type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  image: string;
  accent: string;
};
/* =========================================================
   PROJECT DATA
========================================================= */
export const projects: Project[] = [
  {
    id: 1,
    title: "EduNationScience",
    category: "EDUCATION / WEB PLATFORM",
    year: "2026",
    description:
      "Platform pendidikan berbasis web untuk mendukung pembelajaran, latihan, dan kompetisi olimpiade tingkat SD, SMP, dan SMA melalui sistem yang terstruktur, responsif, dan mudah digunakan.",
    technologies: [
      // isi sendiri
    ],
    image: "/projects/edunation.png",
    accent: "#3b82f6",
  },
  {
    id: 2,
    title: "CV Halona",
    category: "COMPANY PROFILE / PRODUCT WEBSITE",
    year: "2026",
    description:
      "Website company profile untuk CV Halona yang menampilkan informasi perusahaan, layanan maklon, katalog produk perbekalan kesehatan rumah tangga, ulasan pelanggan, serta media komunikasi untuk mendukung kebutuhan calon klien dan pelanggan.",
    technologies: [
      // isi sendiri
    ],
    image: "/projects/cvhalona.png",
    accent: "#22c55e",
  },
  {
    id: 3,
    title: "CV Syavir Jaya Utama",
    category: "BUSINESS SYSTEM / WEB APPLICATION",
    year: "2026",
    description:
      "Aplikasi web terintegrasi untuk mendukung operasional CV Syavir Jaya Utama, mulai dari pengelolaan data master, transaksi pesanan, pengiriman, retur, hingga laporan keuangan, serta dilengkapi website company profile untuk memperkenalkan layanan distribusi IBC, jurigen, dan pallet.",
    technologies: [
      // isi sendiri
    ],
    image: "/projects/cvsyavir.png",
    accent: "#2563eb",
  },
  {
    id: 4,
    title: "Pusat Skripsi",
    category: "SERVICE PLATFORM / WEB APPLICATION",
    year: "2026",
    description:
      "Platform layanan akademik berbasis web yang menyediakan katalog paket layanan, sistem pemesanan, konsultasi, tiket pelanggan, pengelolaan akun, serta informasi layanan dalam satu sistem yang terintegrasi.",
    technologies: ["Next.js", "React", "Tailwind"],
    image: "/projects/pusatskripsi.png",
    accent: "#f59e0b",
  },
  {
    id: 5,
    title: "Belajar Mudah",
    category: "EDUCATION / MOBILE APPLICATION",
    year: "2026",
    description:
      "Aplikasi mobile edukasi berbasis Android yang dirancang untuk membantu siswa mengakses materi pembelajaran, mengerjakan kuis, mengelola tugas, dan mengatur jadwal belajar dalam satu aplikasi yang sederhana dan mudah digunakan.",
    technologies: [
      // isi sendiri
    ],
    image: "/projects/belajarmuda.png",
    accent: "#1687f8",
  },
  // {
  //   id: 6,
  //   title: "SMC Market System",
  //   category: "FINTECH / AUTOMATION",
  //   year: "2026",
  //   description:
  //     "Eksperimen sistem market analysis dan automation dengan Smart Money Concept, structure detection, divergence, dan risk management.",
  //   technologies: ["MQL5", "Trading", "SMC", "Automation"],
  //   image: "/projects/smc-system.webp",
  //   accent: "#ef4444",
  // },
];
