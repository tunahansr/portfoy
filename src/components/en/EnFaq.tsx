import { Plus } from "lucide-react";
import { faq } from "@/data/en-offer";

export function EnFaq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">FAQ</p>
          <h2 id="faq-title" className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
            Questions, answered
          </h2>
          <p className="mt-4 text-ink-soft">
            Anything else? Ask me on WhatsApp or by email. I reply in writing.
          </p>
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faq.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-5 w-5 shrink-0 text-ink-dim transition-transform duration-300 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
