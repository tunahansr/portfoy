import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Gizlilik sözleşmeleri: marka/müşteri adı içeren proje detay sayfaları yayında kapalı (2026-11-27).
  async redirects() {
    return [
      { source: "/projeler", destination: "/#urunler", permanent: false },
      { source: "/projeler/:slug*", destination: "/#urunler", permanent: false },
    ];
  },
  partialPrefetching: true,
  experimental: {
    // İki kök layout (TR + EN) olduğu için eşleşmeyen adreslerde app/global-not-found.tsx kullanılır.
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
