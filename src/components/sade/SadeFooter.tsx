import { contactLinks, profile } from "@/data/profile";

export function SadeFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="container-x flex flex-col gap-3 py-10 text-sm text-ink-dim sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profile.name}</p>
        <div className="flex gap-5">
          <a href={contactLinks.mailto} className="hover:text-ink">{profile.contact.email}</a>
          <a href={contactLinks.tel} className="hover:text-ink">{profile.contact.phoneDisplay}</a>
        </div>
      </div>
    </footer>
  );
}
