import Link from "next/link";
import { getDictionary } from "@/i18n";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

const t = getDictionary();
const infraSlugs = ["ag-sunucu-altyapi", "karekod-mail", "scada-ekran-kayit", "erp-platform"];

export function Architecture() {
  const infra = infraSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  return (
    <section id="mimari" aria-labelledby="mimari-baslik" className="section-y relative overflow-hidden bg-night">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[40rem] w-[40rem] rounded-full bg-violet/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t.architecture.eyebrow} id="mimari-baslik" index="05" intro={t.architecture.intro}>
          {t.architecture.title}
        </SectionHeading>
        <div className="mt-14">
          <ArchitectureDiagram />
        </div>

        {/* Infrastructure & Engineering — teknik şartname düzeni */}
        <div className="mt-24 border-t border-line pt-14">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:items-end">
            <h3 className="font-display text-[length:var(--text-title)] font-semibold leading-tight tracking-[-0.02em]">{t.architecture.infraTitle}</h3>
            <p className="max-w-xl text-muted">{t.architecture.infraIntro}</p>
          </div>
          <Reveal className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-4" stagger={0.06} y={16}>
            {infra.map((p, i) => (
              <Link key={p.slug} href={`/projeler/${p.slug}`} data-reveal className="group flex flex-col bg-night p-6 transition-colors hover:bg-surface">
                <span className="font-mono text-[11px] text-violet">SPEC-{String(i + 1).padStart(2, "0")}</span>
                <h4 className="mt-3 font-display text-lg font-medium leading-snug tracking-tight">{p.name}</h4>
                <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-muted">
                  {p.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-dim" aria-hidden>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto pt-6 text-xs text-dim transition-colors group-hover:text-text">Detay →</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
