import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, statusLabels, type Project } from "@/data/projects";
import { getDictionary } from "@/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { accentVar } from "@/components/visuals/VisualFrame";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { KineticTitle } from "./KineticTitle";

const t = getDictionary();
const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

/** Selected Work içinde tek bir projenin sinematik "bölümü". */
export function ProjectChapter({ project, index, total }: { project: Project; index: number; total: number }) {
  const flip = index % 2 === 1;
  const accent = accentVar[project.accent];
  const titleId = `proje-${project.slug}-baslik`;

  return (
    <article
      id={`proje-${project.slug}`}
      aria-labelledby={titleId}
      className="relative scroll-mt-28 border-t border-line py-[clamp(4rem,9vw,8rem)]"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{ background: `radial-gradient(50% 45% at ${flip ? "20%" : "80%"} 55%, color-mix(in oklab, ${accent} 10%, transparent), transparent 70%)` }}
      />
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-dim">
          <span style={{ color: accent }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          <span className="uppercase tracking-[0.14em]">{project.categories.map(catLabel).join(" · ")}</span>
          {project.status && (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
              {statusLabels[project.status]}
            </span>
          )}
        </div>

        <KineticTitle
          id={titleId}
          text={project.name}
          className="mt-5 max-w-[16ch] font-display text-[length:var(--text-display)] font-semibold leading-[0.95] tracking-[-0.035em] text-balance-safe"
        />
        <p className="serif-accent mt-4 max-w-2xl text-[clamp(1.25rem,2.4vw,2rem)] leading-snug text-muted">{project.tagline}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className={`space-y-8 lg:col-span-5 ${flip ? "lg:order-2" : ""}`} stagger={0.07} y={20}>
            {project.problem && (
              <div data-reveal>
                <h4 className="eyebrow">{t.work.labels.problem}</h4>
                <p className="mt-2.5 leading-relaxed text-text/90">{project.problem}</p>
              </div>
            )}
            {project.purpose && (
              <div data-reveal>
                <h4 className="eyebrow">{t.work.labels.purpose}</h4>
                <p className="mt-2.5 leading-relaxed text-muted">{project.purpose}</p>
              </div>
            )}
            {project.audience && (
              <div data-reveal>
                <h4 className="eyebrow">{t.work.labels.audience}</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.audience.map((a) => (
                    <li key={a} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div data-reveal>
              <h4 className="eyebrow">{t.work.labels.features}</h4>
              <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm text-muted sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {project.features.slice(0, 8).map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {project.tech.length > 0 && (
              <div data-reveal>
                <h4 className="eyebrow">{t.work.labels.tech}</h4>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((x) => (
                    <li key={x} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-text/85">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div data-reveal>
              <Link
                href={`/projeler/${project.slug}`}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-medium transition-colors hover:border-[var(--accent)]"
              >
                {t.work.labels.detail}
                <span className="sr-only">: {project.name}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className={`order-first min-w-0 lg:col-span-7 ${flip ? "lg:order-1" : "lg:order-none"}`}>
            <div className="lg:sticky lg:top-36">
              <ProjectVisual project={project} />
              {project.preview === "concept" && (
                <p className="mt-3 text-xs text-dim">
                  <span className="font-mono uppercase tracking-[0.12em] text-muted">{t.work.labels.concept}</span> — {t.work.labels.conceptNote}
                </p>
              )}
              {project.media?.video && project.media.engine === "hyperframes" && (
                <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-night">
                  <LazyVideo
                    src={project.media.video}
                    poster={project.media.poster}
                    label={`${project.name} tanıtım animasyonu`}
                    className="aspect-video"
                    fallback={null}
                  />
                  <figcaption className="border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                    Motion film · HyperFrames
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
