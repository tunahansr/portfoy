import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { profile, contactLinks } from "@/data/profile";
import { getDictionary } from "@/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";

const t = getDictionary();

export function Contact() {
  const channels = [
    { href: contactLinks.whatsappWithText(t.contact.whatsappText), label: t.contact.whatsapp, value: "WhatsApp", icon: MessageCircle, external: true, primary: true },
    { href: contactLinks.tel, label: t.contact.call, value: profile.contact.phoneDisplay, icon: Phone, external: false, primary: false },
    { href: contactLinks.mailto, label: t.contact.email, value: profile.contact.email, icon: Mail, external: false, primary: false },
  ];

  return (
    <section id="iletisim" aria-labelledby="iletisim-baslik" className="relative isolate overflow-hidden bg-graphite pb-[var(--section-y)] pt-[calc(var(--section-y)*1.1)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_20%_10%,rgba(61,123,255,0.16),transparent_65%),radial-gradient(45%_40%_at_90%_80%,rgba(255,181,71,0.10),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />

      <div className="container-x">
        <Reveal>
          <p data-reveal className="eyebrow flex items-center gap-3">
            <span className="text-cyan">08</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            {t.contact.eyebrow}
          </p>
          <h2 id="iletisim-baslik" data-reveal className="mt-6 font-display text-[length:var(--text-hero)] font-semibold leading-[0.92] tracking-[-0.04em] text-balance-safe">
            {t.contact.title[0]}
            <span className="serif-accent block pt-3 text-[0.62em] font-normal leading-[1.05] tracking-[-0.01em] text-muted">
              {t.contact.title[1]}
            </span>
          </h2>
          <p data-reveal className="mt-8 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-muted">
            {t.contact.lead}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal as="ul" className="grid content-start gap-3" stagger={0.08} y={18}>
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.label} data-reveal>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`group flex min-h-20 items-center gap-4 rounded-2xl border p-5 transition-[background-color,border-color,transform] duration-300 active:scale-[0.99] ${
                      c.primary ? "border-transparent bg-text text-graphite hover:bg-amber" : "border-line bg-surface/60 hover:border-line-strong hover:bg-surface"
                    }`}
                  >
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.primary ? "bg-graphite/10" : "bg-night text-cyan"}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-medium leading-tight">{c.label}</span>
                      <span className={`block truncate text-sm ${c.primary ? "text-graphite/70" : "text-muted"}`}>{c.value}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </li>
              );
            })}
          </Reveal>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
