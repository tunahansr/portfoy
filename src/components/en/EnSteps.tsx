import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { steps } from "@/data/en-offer";
import { photo } from "@/data/en-photos";

export function EnSteps() {
  const p = photo("phone-menu");
  return (
    <section id="how-it-works" aria-labelledby="steps-title" className="py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="relative order-last aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-paper-2 lg:order-first lg:aspect-[4/5]">
          <Image src={p.src} alt={p.alt} fill loading="lazy" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">How it works</p>
          <h2 id="steps-title" className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
            Three steps. No risk on your side.
          </h2>
          <Reveal as="ol" className="mt-10 grid gap-4" stagger={0.1}>
            {steps.map((s, i) => (
              <li key={s.title} data-reveal className="flex gap-5 rounded-2xl border border-ink/10 bg-card p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
          <a
            href="#contact"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            Start with a free demo
          </a>
        </div>
      </div>
    </section>
  );
}
