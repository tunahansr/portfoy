import { content, type Lang } from "@/content/site";
import { contactLinks, profile } from "@/data/profile";

export function SiteFooter({ lang }: { lang: Lang }) {
  const email = lang === "tr" ? profile.contact.email : profile.contact.businessEmail;
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="container-x flex max-w-[1240px] flex-col gap-3 py-10 text-sm text-ink-dim md:flex-row md:items-center md:justify-between">
        <p>© 2026 {lang === "tr" ? profile.name : "Tunahan Şirin"} · {content[lang].footer.nda}</p>
        <div className="flex gap-5">
          <a href={lang === "tr" ? contactLinks.mailto : contactLinks.businessMailto} className="hover:text-ink">{email}</a>
          <a href={contactLinks.tel} className="hover:text-ink">{profile.contact.phoneDisplay}</a>
        </div>
      </div>
    </footer>
  );
}
