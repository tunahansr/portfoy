import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { allDemosUrl, demoSites } from "@/data/en-demos";

export function EnDemos() {
  return (
    <section id="demos" aria-labelledby="demos-title" className="border-y border-ink/10 bg-card py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Demo gallery</p>
            <h2 id="demos-title" className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
              See what your website could look like
            </h2>
            <p className="mt-4 text-ink-soft">
              Free concept websites I designed for independent local businesses. Open any of them on your phone. Menus, products and prices
              on these demos are examples.
            </p>
          </div>
          <a
            href={allDemosUrl}
            className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            All demos <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <Reveal as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4" stagger={0.05}>
          {demoSites.map((d) => (
            <li key={d.slug} data-reveal className="min-w-0">
              <a
                href={d.url}
                target="_blank"
                rel="noopener"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper transition-shadow hover:shadow-[0_20px_50px_-28px_rgba(17,21,28,0.5)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-ink/10 bg-paper-2">
                  <Image
                    src={d.image}
                    alt={`Homepage of the ${d.name} demo website`}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-dim">{d.category}</p>
                    <h3 className="mt-0.5 font-display text-[0.95rem] font-semibold leading-snug text-ink sm:text-base">{d.name}</h3>
                    <p className="mt-1 flex items-start gap-1 text-xs leading-snug text-ink-dim">
                      <MapPin className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden /> {d.location}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-brand sm:mt-0">
                    View demo <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
