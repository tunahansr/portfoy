import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { categories, getProject, projects, statusLabels } from "@/data/projects";
import { contactLinks } from "@/data/profile";
import { getDictionary } from "@/i18n";
import { projectJsonLd, serializeJsonLd } from "@/lib/seo";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { accentVar } from "@/components/visuals/VisualFrame";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Reveal } from "@/components/motion/Reveal";
import { RemotionShowcase } from "@/components/motion/RemotionShowcase";

const t = getDictionary();
const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projeler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/projeler/${p.slug}` },
    openGraph: { type: "article", title: p.name, description: p.summary, url: `/projeler/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projeler/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const accent = accentVar[p.accent];
  const hasVisual = p.visual !== "none";

  return (
    <article style={{ "--accent": accent } as React.CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectJsonLd(p)) }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70svh]" style={{ background: `radial-gradient(60% 60% at 70% 20%, color-mix(in oklab, ${accent} 14%, transparent), transparent 70%)` }} />

      <header className="container-x pb-12 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
        <Link href="/projeler" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-text">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {t.project.back}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-dim">
          <span style={{ color: accent }}>{p.categories.map(catLabel).join(" · ")}</span>
          {p.status && <span className="rounded-full border border-line px-2.5 py-0.5 text-[10px] text-muted">{statusLabels[p.status]}</span>}
        </div>
        <h1 className="hero-rise mt-5 max-w-[18ch] font-display text-[length:var(--text-hero)] font-semibold leading-[0.92] tracking-[-0.04em] text-balance-safe">
          {p.name}
        </h1>
        <p className="hero-rise serif-accent mt-6 max-w-3xl text-[clamp(1.35rem,2.6vw,2.2rem)] leading-snug text-muted" style={{ "--d": 150 } as React.CSSProperties}>
          {p.tagline}
        </p>
        <p className="hero-rise mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-text/85" style={{ "--d": 250 } as React.CSSProperties}>
          {p.summary}
        </p>
      </header>

      {(hasVisual || p.media) && (
        <section aria-label="Ürün önizlemesi" className="container-x">
          <div className="grid gap-8">
            {p.media?.remotionId && <RemotionShowcase id={p.media.remotionId} poster={p.media.poster} label={`${p.name} ürün showcase'i`} />}
            {hasVisual && (
              <div className="mx-auto w-full max-w-5xl">
                <ProjectVisual project={p} />
                {p.preview === "concept" && (
                  <p className="mt-3 text-xs text-dim">
                    <span className="font-mono uppercase tracking-[0.12em] text-muted">{t.work.labels.concept}</span> — {t.work.labels.conceptNote}
                  </p>
                )}
              </div>
            )}
            {p.media?.video && p.media.engine === "hyperframes" && (
              <figure className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-night">
                <LazyVideo src={p.media.video} poster={p.media.poster} label={`${p.name} tanıtım animasyonu`} className="aspect-video" fallback={null} />
                <figcaption className="border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">Motion film · HyperFrames</figcaption>
              </figure>
            )}
          </div>
        </section>
      )}

      <div className="container-x section-y grid gap-16 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-28">
            {p.audience && (
              <div>
                <h2 className="eyebrow">{t.work.labels.audience}</h2>
                <ul className="mt-3 space-y-2 text-muted">
                  {p.audience.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {p.tech.length > 0 && (
              <div>
                <h2 className="eyebrow">{t.work.labels.tech}</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map((x) => (
                    <li key={x} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[11px]">{x}</li>
                  ))}
                </ul>
              </div>
            )}
            <a href={contactLinks.whatsappWithText(`Merhaba, ${p.name} benzeri bir sistem hakkında görüşmek istiyorum.`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-text px-5 font-medium text-graphite transition-colors hover:bg-amber">
              <MessageCircle className="h-4 w-4" aria-hidden /> Benzer bir proje konuşalım
            </a>
          </div>
        </aside>

        <div className="space-y-16 lg:col-span-8">
          {(p.problem || p.purpose) && (
            <Reveal className="grid gap-10 md:grid-cols-2">
              {p.problem && (
                <div data-reveal>
                  <h2 className="eyebrow">{t.work.labels.problem}</h2>
                  <p className="mt-3 text-lg leading-relaxed">{p.problem}</p>
                </div>
              )}
              {p.purpose && (
                <div data-reveal>
                  <h2 className="eyebrow">{t.work.labels.purpose}</h2>
                  <p className="mt-3 text-lg leading-relaxed text-muted">{p.purpose}</p>
                </div>
              )}
            </Reveal>
          )}

          <section aria-labelledby="kapsam">
            <h2 id="kapsam" className="font-display text-[length:var(--text-title)] font-semibold tracking-[-0.02em]">{t.work.labels.features}</h2>
            <Reveal as="ol" className="mt-6 border-t border-line" stagger={0.04} y={14}>
              {p.features.map((f, i) => (
                <li key={f} data-reveal className="grid grid-cols-[3rem_1fr] border-b border-line py-4">
                  <span className="font-mono text-xs leading-7 text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg">{f}</span>
                </li>
              ))}
            </Reveal>
          </section>

          {p.subApps && (
            <section aria-labelledby="uygulamalar">
              <h2 id="uygulamalar" className="font-display text-[length:var(--text-title)] font-semibold tracking-[-0.02em]">{t.project.subApps}</h2>
              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {p.subApps.map((a) => (
                  <div key={a.name} className="bg-graphite p-6">
                    <h3 className="font-display text-lg font-medium">{a.name}</h3>
                    <p className="mt-2 text-sm text-muted">{a.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.scenarios && (
            <section aria-labelledby="senaryolar">
              <h2 id="senaryolar" className="font-display text-[length:var(--text-title)] font-semibold tracking-[-0.02em]">{t.project.scenarios}</h2>
              <div className="mt-6 space-y-8">
                {p.scenarios.map((s, si) => (
                  <div key={s.title} className="rounded-2xl border border-line bg-surface/50 p-6">
                    <p className="font-mono text-xs text-[var(--accent)]">SENARYO {String(si + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-display text-xl font-medium">{s.title}</h3>
                    <ol className="mt-4 space-y-3">
                      {s.steps.map((st, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[10px] text-text">{i + 1}</span>
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.preview === "none" && <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-dim">{t.project.noMaterial}</p>}
        </div>
      </div>

      <nav aria-label="Proje gezinmesi" className="border-t border-line">
        <Link href={`/projeler/${next.slug}`} className="group container-x flex items-center justify-between gap-6 py-14">
          <span>
            <span className="eyebrow">{t.project.next}</span>
            <span className="mt-3 block font-display text-[length:var(--text-title)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[var(--accent)]">{next.name}</span>
          </span>
          <ArrowRight className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:translate-x-2" aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
