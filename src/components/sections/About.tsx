import { getDictionary } from "@/i18n";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";

const t = getDictionary();

export function About() {
  return (
    <section id="hakkimda" aria-labelledby="hakkimda-baslik" className="section-y relative bg-graphite">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
          {/* Sol: editoryal başlık — masaüstünde yapışkan */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow={t.about.eyebrow} id="hakkimda-baslik" index="01">
              {t.about.title[0]} <br className="hidden sm:block" />
              {t.about.title[1]}{" "}
              <span className="serif-accent block pt-2 text-[0.82em] text-cyan">{t.about.titleAccent}</span>
            </SectionHeading>

            <Reveal className="mt-10">
              <figure data-reveal className="relative overflow-hidden rounded-3xl border border-line bg-night">
                <LazyVideo
                  src="/videos/brand-intro.mp4"
                  poster="/posters/brand-intro.jpg"
                  label="Tunahan Şirin kişisel marka tanıtım filmi: veri parçacıkları teknoloji çekirdeğinde birleşir."
                  className="aspect-video"
                  fallback={<div className="aspect-video bg-[radial-gradient(60%_80%_at_50%_50%,rgba(61,123,255,0.25),transparent)]" />}
                />
                <figcaption className="flex items-center justify-between gap-4 border-t border-line px-5 py-3.5 text-xs text-muted">
                  <span className="font-mono uppercase tracking-[0.14em]">Brand Intro · HyperFrames</span>
                  <span>{t.about.showreel}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Sağ: hikâye + yetkinlikler */}
          <div>
            <Reveal className="space-y-6 text-[length:var(--text-lead)] leading-relaxed text-muted">
              {t.about.story.map((p, i) => (
                <p key={i} data-reveal className={i === 0 ? "text-text" : undefined}>
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-5" y={16}>
              <div data-reveal className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-night font-display text-lg font-semibold text-cyan">
                K
              </div>
              <div data-reveal>
                <p className="font-medium">
                  <a href={profile.company.url} target="_blank" rel="noopener" className="underline decoration-line-strong underline-offset-4 hover:decoration-cyan">
                    {profile.company.name}
                  </a>
                </p>
                <p className="text-sm text-muted">
                  {t.about.companyNote} · {profile.location.city}, {profile.location.region}
                </p>
              </div>
            </Reveal>

            <h3 className="eyebrow mt-16">{t.about.capabilitiesTitle}</h3>
            <Reveal as="ol" className="mt-5 border-t border-line" stagger={0.05} y={18}>
              {t.about.capabilities.map((c, i) => (
                <li
                  key={c.name}
                  data-reveal
                  className="group grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-5 transition-colors sm:grid-cols-[3rem_minmax(0,15rem)_1fr] sm:gap-x-6"
                >
                  <span className="pt-1 font-mono text-xs text-dim transition-colors group-hover:text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg font-medium tracking-tight transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1">
                    {c.name}
                  </span>
                  <span className="col-start-2 mt-1 text-sm leading-relaxed text-muted sm:col-start-3 sm:mt-0 sm:pt-1">
                    {c.detail}
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
