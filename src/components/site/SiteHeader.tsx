import Link from "next/link";
import { LanguageSwitch } from "@/components/navigation/LanguageSwitch";
import { EnMonogram } from "@/components/en/EnMonogram";
import { content, type Lang } from "@/content/site";
import { contactLinks, profile } from "@/data/profile";

/** TR ve EN için ortak başlık: 4 menü maddesi, dil seçici ve tek çağrı. */
export function SiteHeader({ lang }: { lang: Lang }) {
  const t = content[lang];
  const home = lang === "tr" ? "/" : "/en";
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <nav aria-label={lang === "tr" ? "Ana menü" : "Main"} className="container-x flex h-[var(--header-h)] max-w-[1240px] items-center justify-between gap-3">
        <Link href={home} prefetch={false} className="flex min-h-11 items-center gap-2.5">
          <EnMonogram className="h-8 w-8" />
          <span className="text-[0.98rem] font-semibold tracking-tight text-ink">{lang === "tr" ? profile.name : "Tunahan Şirin"}</span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {t.nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitch current={lang} tone="light" />
          <a
            href={contactLinks.whatsappWithText(t.contact.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-brand sm:inline-flex"
          >
            {t.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
