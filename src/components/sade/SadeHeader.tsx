import Link from "next/link";
import { LanguageSwitch } from "@/components/navigation/LanguageSwitch";
import { EnMonogram } from "@/components/en/EnMonogram";
import { contactLinks } from "@/data/profile";

const links = [
  { href: "/#isler", label: "İşler" },
  { href: "/#hizmetler", label: "Hizmetler" },
  { href: "/#hakkimda", label: "Hakkımda" },
  { href: "/#iletisim", label: "İletişim" },
];

/** Sade (açık temalı) Türkçe site başlığı: 4 menü maddesi, dil seçici ve tek çağrı. */
export function SadeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <nav aria-label="Ana menü" className="container-x flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link href="/#top" className="flex min-h-11 items-center gap-2.5" aria-label="Tunahan ŞİRİN — sayfa başı">
          <EnMonogram className="h-8 w-8" />
          <span className="text-[0.98rem] font-semibold tracking-tight text-ink">Tunahan ŞİRİN</span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitch current="tr" tone="light" />
          <a
            href={contactLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-brand sm:inline-flex"
          >
            İletişime geç
          </a>
        </div>
      </nav>
    </header>
  );
}
