import Image from "next/image";
import { ArrowRight, Check, Lock, Mail, MessageCircle, Phone } from "lucide-react";
import { content, packagePrices, type Lang } from "@/content/site";
import { contactLinks, profile } from "@/data/profile";
import { sectionIds } from "./ids";

/**
 * TR ve EN ana sayfa: aynı tasarım, aynı bölümler, içerik src/content/site.ts'den.
 * Hareket: yalnızca CSS (hero-rise + kod satırları); prefers-reduced-motion globals.css'te kapatılır.
 */

const tokenClass: Record<string, string> = {
  c: "text-[#7d8799]",
  k: "text-[#c792ea]",
  v: "text-[#82aaff]",
  p: "text-[#d6deeb]",
  i: "text-[#addb67]",
  s: "text-[#ecc48d]",
  f: "text-[#82aaff]",
};

function CodePanel({ lines, file }: { lines: string[][]; file: string }) {
  return (
    <div className="hero-rise overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-[0_40px_120px_-40px_rgba(31,94,255,0.55)]" style={{ ["--d" as string]: 200 }}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-white/50">{file}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.9] sm:text-[13.5px]" aria-hidden>
        {lines.map((line, i) => (
          <div key={i} className="code-line flex" style={{ ["--d" as string]: 400 + i * 140 }}>
            <span className="mr-5 w-4 shrink-0 select-none text-right text-white/25">{i + 1}</span>
            <span className="whitespace-pre">
              {Array.from({ length: line.length / 2 }, (_, j) => (
                <span key={j} className={tokenClass[line[j * 2]]}>{line[j * 2 + 1]}</span>
              ))}
              {i === lines.length - 1 && <span className="caret ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-[#82aaff]" />}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function Title({ id, eyebrow, children, dark = false }: { id: string; eyebrow: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`font-mono text-xs uppercase tracking-[0.16em] ${dark ? "text-[#82aaff]" : "text-brand"}`}>{eyebrow}</p>
      <h2 id={id} className={`mt-3 text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em] text-balance-safe ${dark ? "text-white" : "text-ink"}`}>
        {children}
      </h2>
    </div>
  );
}

export function SiteHome({ lang }: { lang: Lang }) {
  const t = content[lang];
  const ids = sectionIds[lang];
  const wa = contactLinks.whatsappWithText(t.contact.whatsappText);
  const email = lang === "tr" ? contactLinks.mailto : contactLinks.businessMailto;

  return (
    <>
      {/* 1 · Giriş (koyu, kod paneli) */}
      <section className="relative overflow-hidden bg-[#070a14] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(31,94,255,0.22),transparent_70%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(70%_70%_at_50%_40%,black,transparent)]" />
        <div className="container-x relative grid max-w-[1240px] items-center gap-12 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <p className="hero-rise font-mono text-xs uppercase tracking-[0.16em] text-[#82aaff]" style={{ ["--d" as string]: 0 }}>
              {t.hero.kicker}
            </p>
            <h1 className="hero-rise mt-5 text-[clamp(2.1rem,4vw,3.3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-balance-safe" style={{ ["--d" as string]: 80 }}>
              {t.hero.title}
            </h1>
            <p className="hero-rise mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-white/70" style={{ ["--d" as string]: 160 }}>
              {t.hero.lead}
            </p>
            <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: 240 }}>
              <a href={`#${ids.products}`} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-ink transition-colors hover:bg-[#dbe6ff]">
                {t.hero.primary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-7 font-medium text-white transition-colors hover:border-white/50">
                <MessageCircle className="h-4 w-4" aria-hidden />
                {t.hero.secondary}
              </a>
            </div>
          </div>
          <CodePanel lines={t.hero.code} file={lang === "tr" ? "yetkinlikler.ts" : "skills.ts"} />
        </div>
      </section>

      {/* 2 · Ürünler */}
      <section id={ids.products} aria-labelledby="products-title" className="py-20 sm:py-28">
        <div className="container-x max-w-[1240px]">
          <Title id="products-title" eyebrow={t.products.eyebrow}>{t.products.title}</Title>
          <p className="mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-ink/10 bg-card px-4 py-3.5 text-sm leading-relaxed text-ink-soft">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink" aria-hidden />
            {t.products.nda}
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.products.items.map((p, i) => (
              <li key={p.title} className={`flex flex-col rounded-2xl border border-ink/10 bg-card p-6 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(17,21,28,0.4)] sm:p-7 ${i === 0 ? "lg:col-span-2" : ""}`}>
                <span className="w-fit rounded-md bg-ink px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-paper">{p.tag}</span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{p.text}</p>
                <ul className="mt-5 grid gap-2 border-t border-ink/10 pt-5 text-sm text-ink-soft">
                  {p.points.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · Gerçek ekranlar (koyu) */}
      <section id={ids.screens} aria-labelledby="screens-title" className="bg-[#070a14] py-20 sm:py-28">
        <div className="container-x max-w-[1240px]">
          <Title id="screens-title" eyebrow={t.screens.eyebrow} dark>{t.screens.title}</Title>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {t.screens.items.map((s, i) => (
              <figure key={s.src} className={i === 0 ? "lg:col-span-2" : ""}>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image src={s.src} width={s.w} height={s.h} alt={s.caption} sizes={i === 0 ? "(min-width:1024px) 1200px, 100vw" : "(min-width:1024px) 600px, 100vw"} className="h-auto w-full" />
                </div>
                <figcaption className="mt-3 text-sm text-white/60">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Paketler */}
      <section id={ids.packages} aria-labelledby="packages-title" className="py-20 sm:py-28">
        <div className="container-x max-w-[1240px]">
          <Title id="packages-title" eyebrow={t.packages.eyebrow}>{t.packages.title}</Title>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{t.packages.intro}</p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packagePrices.map((p) => {
              const item = t.packages.items[p.id];
              const popular = "popular" in p && p.popular;
              return (
                <li key={p.id} className={`relative flex flex-col rounded-2xl border bg-card p-6 sm:p-7 ${popular ? "border-brand shadow-[0_20px_50px_-30px_rgba(31,94,255,0.6)]" : "border-ink/10"}`}>
                  {popular && <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">{t.packages.popular}</span>}
                  <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    {"from" in p && p.from && <span className="text-sm text-ink-dim">{t.packages.from}</span>}
                    <span className="text-3xl font-semibold tracking-tight text-ink">${p.price}</span>
                    <span className="text-sm text-ink-dim">{t.packages.oneTime}</span>
                  </p>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{item.text}</p>
                  <p className="mt-5 border-t border-ink/10 pt-4 font-mono text-xs text-ink-dim">
                    {t.packages.time}: {item.time}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-ink/10 bg-paper-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h3 className="text-lg font-semibold text-ink">{t.packages.care.name}</h3>
              <p className="mt-1 text-ink-soft">{t.packages.care.text}</p>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-ink">{t.packages.care.price}</p>
          </div>
        </div>
      </section>

      {/* 5 · Süreç */}
      <section id={ids.steps} aria-labelledby="steps-title" className="border-t border-ink/10 bg-card py-20 sm:py-28">
        <div className="container-x max-w-[1240px]">
          <Title id="steps-title" eyebrow={t.steps.eyebrow}>{t.steps.title}</Title>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.items.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ink pt-5">
                <span className="font-mono text-xs text-ink-dim">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · Ödeme planı */}
      <section id={ids.payment} aria-labelledby="payment-title" className="border-t border-ink/10 py-20 sm:py-28">
        <div className="container-x max-w-[1240px]">
          <Title id="payment-title" eyebrow={t.payment.eyebrow}>{t.payment.title}</Title>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{t.payment.intro}</p>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {t.payment.plans.map((p) => (
              <div key={p.title} className="rounded-2xl border border-ink/10 bg-card p-6 sm:p-7">
                <h3 className="text-lg font-semibold text-ink">{p.title}</h3>
                <ol className="mt-4 grid gap-3">
                  {p.lines.map((l, i) => (
                    <li key={l} className="flex items-center gap-3 text-ink-soft">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper-2 font-mono text-xs text-ink">{i + 1}</span>
                      {l}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {t.payment.methods.map((m) => (
              <div key={m.title} className="rounded-2xl bg-paper-2 p-6">
                <p className="font-semibold text-ink">{m.title}</p>
                <p className="mt-1 text-ink-soft">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · İletişim */}
      <section id={ids.contact} aria-labelledby="contact-title" className="bg-[#070a14] py-20 text-white sm:py-28">
        <div className="container-x max-w-[1240px]">
          <h2 id="contact-title" className="max-w-3xl text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-balance-safe">
            {t.contact.title}
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-ink transition-colors hover:bg-[#dbe6ff]">
              <MessageCircle className="h-4 w-4" aria-hidden /> {t.contact.whatsapp}
            </a>
            <a href={contactLinks.tel} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-7 font-medium transition-colors hover:border-white/50">
              <Phone className="h-4 w-4" aria-hidden /> {profile.contact.phoneDisplay}
            </a>
            <a href={email} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-7 font-medium transition-colors hover:border-white/50">
              <Mail className="h-4 w-4" aria-hidden /> {t.contact.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
