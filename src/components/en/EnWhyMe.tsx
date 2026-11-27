import { BadgeDollarSign, MessageSquareText, Rocket, Smartphone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { storeApps } from "@/data/en-apps";

const reasons = [
  {
    icon: Rocket,
    title: "Fast delivery",
    text: "Most websites go live within 7 days of your approval. A QR menu takes about 2 days.",
  },
  {
    icon: BadgeDollarSign,
    title: "Fair, fixed prices",
    text: "Clear packages in US dollars. You know the full price before any work starts.",
  },
  {
    icon: MessageSquareText,
    title: "You talk to the developer",
    text: "No agency, no account managers. I design and build your site myself and reply in writing.",
  },
  {
    icon: Smartphone,
    title: "Apps live in the stores",
    text: "I also build and run my own mobile apps, published on the App Store and Google Play.",
  },
];

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-ink"
    >
      {label}
    </a>
  );
}

export function EnWhyMe() {
  const apps = storeApps.filter((a) => a.appStore || a.googlePlay);
  return (
    <section aria-labelledby="why-title" className="bg-ink py-20 text-white sm:py-28">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Why work with me</p>
          <h2 id="why-title" className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em]">
            A real developer, not a template shop
          </h2>
          <p className="mt-4 text-white/75">
            I&apos;m Tunahan Şirin, a full-stack developer. Besides websites for small businesses, I build ordering, delivery and point-of-sale software
            that businesses use every day.
          </p>
        </div>
        <Reveal as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {reasons.map((r) => (
            <li key={r.title} data-reveal className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <r.icon className="h-6 w-6 text-gold" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{r.text}</p>
            </li>
          ))}
        </Reveal>
        {apps.length > 0 && (
          <Reveal className="mt-6 grid gap-4 md:grid-cols-2">
            {apps.map((a) => (
              <div key={a.name} data-reveal className="flex flex-col gap-4 rounded-2xl border border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/55">Published app</p>
                  <p className="mt-1 font-display text-xl font-semibold">{a.name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.appStore && <StoreLink href={a.appStore} label="App Store" />}
                  {a.googlePlay && <StoreLink href={a.googlePlay} label="Google Play" />}
                </div>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
