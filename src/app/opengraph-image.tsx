import { renderOg, ogSize } from "@/lib/og";

export const alt = "Tunahan ŞİRİN — Fikirleri çalışan sistemlere dönüştürüyorum.";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Beyond Code — The Systems I Build",
    title: "Fikirleri çalışan sistemlere dönüştürüyorum.",
    subtitle: "ERP · POS · SaaS · API entegrasyonları · Mobil · Altyapı",
  });
}
