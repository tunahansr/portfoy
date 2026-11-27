import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { Archive } from "@/components/sections/Archive";

const t = getDictionary();

export const metadata: Metadata = {
  title: "Projeler",
  description: "ERP, POS, SaaS, mobil, entegrasyon, altyapı ve otomasyon projelerinin kategori filtreli arşivi.",
  alternates: { canonical: "/projeler" },
};

export default function ProjectsPage() {
  return (
    <section className="container-x pb-[var(--section-y)] pt-[calc(var(--header-h)+4rem)]">
      <p className="eyebrow">{t.archive.eyebrow}</p>
      <h1 className="hero-rise mt-5 font-display text-[length:var(--text-hero)] font-semibold leading-[0.92] tracking-[-0.04em]">{t.archive.title}</h1>
      <div className="mt-14">
        <Archive />
      </div>
    </section>
  );
}
