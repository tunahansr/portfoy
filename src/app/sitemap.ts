import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Proje detay sayfaları gizlilik sözleşmeleri nedeniyle yayında kapalı; yalnızca ana sayfalar listelenir. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/en"), changeFrequency: "monthly", priority: 0.9 },
  ];
}
