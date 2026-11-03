import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { profile, contactLinks } from "@/data/profile";
import { getDictionary } from "@/i18n";
import { Monogram } from "@/components/ui/Monogram";

const t = getDictionary();

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-line bg-graphite">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Monogram className="h-9 w-9" />
            <div>
              <p className="font-display text-lg font-semibold">{profile.name}</p>
              <p className="text-sm text-muted">{profile.shortTitle}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            <a href={profile.company.url} target="_blank" rel="noopener" className="text-text underline decoration-line-strong underline-offset-4 hover:decoration-cyan">
              {profile.company.name}
            </a>{" "}
            · {profile.location.city}, {profile.location.region}, {profile.location.country}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Bölümler</p>
          <ul className="grid gap-2 text-sm">
            {t.nav.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-muted transition-colors hover:text-text">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/projeler" className="text-muted transition-colors hover:text-text">
                Tüm projeler
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">İletişim</p>
          <ul className="grid gap-2 text-sm">
            <li>
              <a href={contactLinks.tel} className="text-muted hover:text-text">{profile.contact.phoneDisplay}</a>
            </li>
            <li>
              <a href={contactLinks.mailto} className="text-muted hover:text-text">{profile.contact.email}</a>
            </li>
            <li>
              <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text">WhatsApp</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-line py-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}. {t.footer.rights}
        </p>
        <p className="hidden md:block">{t.footer.builtWith}</p>
        <a href="#icerik" className="inline-flex min-h-11 items-center gap-1.5 text-muted hover:text-text">
          <ArrowUp className="h-3.5 w-3.5" aria-hidden /> {t.footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
