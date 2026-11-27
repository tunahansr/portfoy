import Image from "next/image";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import { photo } from "@/data/en-photos";

const facts = ["Free demo before you pay", "Fixed prices in US dollars", "Care plan after launch", "One developer, start to finish"];

export function EnHero() {
  const hero = photo("hero");
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-24 lg:pt-16">
        <div>
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-3 py-1.5 text-xs font-medium text-ink-soft" style={{ ["--d" as string]: 0 }}>
            <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden />
            For local businesses, shops and service providers
          </p>
          <h1
            className="hero-rise mt-5 font-display text-[clamp(2.25rem,5.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-balance-safe"
            style={{ ["--d" as string]: 80 }}
          >
            Websites, online stores and apps <span className="text-brand">for small businesses</span>
          </h1>
          <p className="hero-rise mt-5 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-ink-soft" style={{ ["--d" as string]: 160 }}>
            Business websites, online stores, booking sites, redesigns and custom software, designed and built by one
            developer. Fixed prices, and a free demo of your own site before you pay.
          </p>
          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: 240 }}>
            <a
              href="#contact"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgba(31,94,255,0.7)] transition-colors hover:bg-brand-deep"
            >
              Get a free demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#pricing"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-ink/15 bg-card px-7 py-3.5 text-base font-medium text-ink transition-colors hover:border-ink/35"
            >
              See prices
            </a>
          </div>
          <ul className="hero-rise mt-8 grid gap-x-6 gap-y-2.5 text-sm text-ink-soft sm:grid-cols-2" style={{ ["--d" as string]: 320 }}>
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-leaf" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-rise relative" style={{ ["--d" as string]: 120 }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-paper-2 shadow-[0_30px_80px_-40px_rgba(17,21,28,0.55)] lg:aspect-[4/5] lg:max-h-[min(640px,calc(100svh-9rem))] lg:w-full">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-paper">
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-ink">Online Store</span>
              <span className="block text-xs text-ink-dim">$799 one-time</span>
            </span>
          </div>
          <div className="absolute -top-4 right-4 rounded-2xl border border-ink/10 bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:right-6">
            <span className="block text-xs text-ink-dim">Business Website</span>
            <span className="block font-display text-lg font-semibold text-ink">$449</span>
          </div>
        </div>
      </div>
    </section>
  );
}
