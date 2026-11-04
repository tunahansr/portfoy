import { getProject, projects } from "@/data/projects";
import { colors } from "@/lib/brand";
import { renderOg, ogSize } from "@/lib/og";

export const alt = "Proje önizlemesi — Tunahan ŞİRİN";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({
    eyebrow: "Proje",
    title: p?.name ?? "Proje",
    subtitle: p?.tagline ?? "",
    accent: p ? colors[p.accent] : colors.cyan,
  });
}
