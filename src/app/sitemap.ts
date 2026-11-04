import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projeler"), changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projeler/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: p.featuredOrder ? 0.8 : 0.5,
    })),
  ];
}
