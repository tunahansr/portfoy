import Link from "next/link";
import { contactLinks, profile } from "@/data/profile";
import { photoCredits } from "@/data/en-photos";
import { EnMonogram } from "./EnMonogram";

export function EnFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper pb-20 sm:pb-0">
      <div className="container-x grid gap-8 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <EnMonogram className="h-9 w-9" />
            <div>
              <p className="font-display text-lg font-semibold text-ink">Tunahan Şirin</p>
              <p className="text-sm text-ink-dim">Websites for small businesses</p>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-dim">Contact</p>
          <ul className="grid gap-2 text-sm">
            <li>
              <a href={contactLinks.businessMailto} className="text-ink-soft hover:text-ink">{profile.contact.businessEmail}</a>
            </li>
            <li>
              <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-ink">WhatsApp</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-dim">More</p>
          <ul className="grid gap-2 text-sm">
            <li>
              <a href="/demo/" className="text-ink-soft hover:text-ink">All demo websites</a>
            </li>
            <li>
              <Link href="/" prefetch={false} hrefLang="tr" lang="tr" className="text-ink-soft hover:text-ink">Türkçe site</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-ink/10 py-6 text-xs text-ink-dim">
        <p>© 2026 {profile.name}. All prices in US dollars.</p>
        <p className="mt-2 leading-relaxed">
          Photos:{" "}
          {photoCredits.map((c, i) => (
            <span key={c.file}>
              <a href={c.photoUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                {c.photographer}
              </a>{" "}
              on {c.source}
              {i < photoCredits.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
