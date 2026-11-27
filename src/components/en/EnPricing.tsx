import { Check, Clock, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { carePlan, packages, type OfferPackage } from "@/data/en-offer";
import { PackageLink } from "./PackageLink";

function Price({ p, light = false }: { p: OfferPackage; light?: boolean }) {
  return (
    <p className="mt-5 flex items-baseline gap-1.5">
      {p.pricePrefix && <span className={`text-sm ${light ? "text-white/70" : "text-ink-dim"}`}>{p.pricePrefix}</span>}
      <span className={`font-display text-[2.6rem] font-semibold leading-none tracking-[-0.03em] ${light ? "text-white" : "text-ink"}`}>${p.price}</span>
      <span className={`text-sm ${light ? "text-white/70" : "text-ink-dim"}`}>{p.priceNote}</span>
    </p>
  );
}

function Card({ p }: { p: OfferPackage }) {
  const pop = !!p.popular;
  return (
    <li
      data-reveal
      className={`relative flex flex-col rounded-3xl p-6 sm:p-7 ${
        pop ? "bg-ink text-white shadow-[0_30px_70px_-30px_rgba(17,21,28,0.65)] ring-2 ring-brand lg:-my-3" : "border border-ink/10 bg-card"
      }`}
    >
      {pop && (
        <span className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
          <Star className="h-3.5 w-3.5" aria-hidden /> Most popular
        </span>
      )}
      <h3 className={`font-display text-xl font-semibold ${pop ? "text-white" : "text-ink"}`}>{p.name}</h3>
      <p className={`mt-1 text-sm ${pop ? "text-white/70" : "text-ink-dim"}`}>{p.idealFor}</p>
      <Price p={p} light={pop} />
      <p className={`mt-4 text-[0.95rem] leading-relaxed ${pop ? "text-white/85" : "text-ink-soft"}`}>{p.summary}</p>
      <p className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${pop ? "bg-white/10 text-white" : "bg-paper-2 text-ink"}`}>
        <Clock className="h-3.5 w-3.5" aria-hidden /> {p.delivery}
      </p>
      <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.12em] ${pop ? "text-white/60" : "text-ink-dim"}`}>What&apos;s included</p>
      <ul className="mt-3 grid gap-2.5 text-[0.95rem]">
        {p.includes.map((x) => (
          <li key={x} className="flex gap-2.5">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${pop ? "text-gold" : "text-leaf"}`} aria-hidden />
            <span className={pop ? "text-white/90" : "text-ink-soft"}>{x}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-7">
        <PackageLink
          id={p.id}
          className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors ${
            pop ? "bg-brand text-white hover:bg-white hover:text-ink" : "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white"
          }`}
        >
          Get a free demo
          <span className="sr-only"> for {p.name}</span>
        </PackageLink>
      </div>
    </li>
  );
}

export function EnPricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Pricing</p>
          <h2 id="pricing-title" className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
            Simple packages. Prices you know up front.
          </h2>
          <p className="mt-4 text-ink-soft">All prices in US dollars. No hidden fees. You see a free demo of your own site before you pay anything.</p>
        </div>

        <Reveal as="ul" className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.06}>
          {packages.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </Reveal>

        <Reveal className="mt-6">
          <div className="grid gap-6 rounded-3xl border border-ink/10 bg-paper-2 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr_auto] lg:items-center lg:gap-10">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-leaf">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Add-on
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{carePlan.name}</h3>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-ink">${carePlan.price}</span>
                <span className="text-sm text-ink-dim">{carePlan.priceNote}</span>
              </p>
              <p className="mt-2 text-sm text-ink-soft">{carePlan.summary}</p>
            </div>
            <ul className="grid gap-2.5 text-[0.95rem] sm:grid-cols-2">
              {carePlan.includes.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden />
                  <span className="text-ink-soft">{x}</span>
                </li>
              ))}
              <li className="flex gap-2.5 sm:col-span-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-dim" aria-hidden />
                <span className="text-ink-dim">{carePlan.delivery}</span>
              </li>
            </ul>
            <PackageLink
              id="care"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              Add the Care Plan
            </PackageLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
