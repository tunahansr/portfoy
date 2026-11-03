import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n";
import { profile } from "@/data/profile";
import { HeroCore } from "./HeroCore";
import { RotatingWord } from "./RotatingWord";
import { HeroProductStack } from "./HeroProductStack";

const t = getDictionary();

export function Hero() {
  const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-graphite pt-[var(--header-h)]"
    >
      {/* Arka plan: gece laciverti zemin + çekirdek sahnesi */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_40%,#0a1022_0%,#07090d_60%)]" />
      <div className="absolute inset-0 -z-10">
        <HeroCore nodes={t.hero.nodes} coreLabel={t.hero.coreLabel} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-graphite" />

      <HeroProductStack />

      <div className="container-x relative mt-auto grid gap-10 pb-10 pt-[min(46svh,24rem)] md:pt-[30svh] lg:pb-16 lg:pt-24">
        <div className="max-w-[min(100%,58rem)]">
          <p className="eyebrow hero-rise flex items-center gap-3" style={d(100)}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_12px_var(--c-amber)]" aria-hidden />
            {t.hero.eyebrow}
          </p>

          <h1 id="hero-title" className="mt-5 font-display font-semibold leading-[0.9] tracking-[-0.035em]">
            <span className="hero-rise serif-accent block text-[clamp(1.6rem,4vw,3.2rem)] font-normal tracking-normal text-muted" style={d(200)}>
              {t.hero.hello}
            </span>
            <span className="hero-rise block text-[length:var(--text-mega)]" style={d(320)}>
              {profile.firstName}
              <span className="text-cyan">.</span>
            </span>
          </h1>

          <p className="hero-rise mt-6 font-display text-[clamp(1.35rem,3.1vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.02em]" style={d(520)}>
            {t.hero.lineStart} <RotatingWord words={t.hero.rotating} /> <br className="hidden sm:block" />
            {t.hero.lineEnd}
          </p>

          <p className="hero-rise mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-muted" style={d(680)}>
            {t.hero.lead}
          </p>

          <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={d(820)}>
            <Link
              href="/#isler"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-text px-7 py-4 font-medium text-graphite transition-[background-color,transform] duration-300 hover:bg-cyan active:scale-[0.98]"
            >
              {t.hero.primaryCta}
              <ArrowDownRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden />
            </Link>
            <Link
              href="/#iletisim"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-line-strong px-7 py-4 font-medium text-text transition-colors duration-300 hover:border-amber hover:text-amber"
            >
              {t.hero.secondaryCta}
              <ArrowUpRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="hero-rise flex items-end justify-between gap-6 border-t border-line pt-5 text-xs text-dim" style={d(1000)}>
          <p className="font-mono uppercase tracking-[0.14em]">
            {profile.company.name} · {profile.location.city}, {profile.location.region}
          </p>
          <p className="hidden font-mono uppercase tracking-[0.14em] sm:block" aria-hidden>
            {t.hero.scroll} ↓
          </p>
        </div>
      </div>
    </section>
  );
}
