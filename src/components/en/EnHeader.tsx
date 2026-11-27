import { LanguageSwitch } from "@/components/navigation/LanguageSwitch";
import { EnMonogram } from "./EnMonogram";

const links = [
  { href: "#pricing", label: "Pricing" },
  { href: "#demos", label: "Demos" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function EnHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <nav aria-label="Main" className="container-x flex h-[var(--header-h)] items-center justify-between gap-3">
        <a href="#top" className="flex min-h-11 items-center gap-2.5" aria-label="Tunahan Şirin — top of page">
          <EnMonogram className="h-8 w-8" />
          <span className="font-display text-[0.98rem] font-semibold tracking-tight text-ink">Tunahan Şirin</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitch current="en" tone="light" />
          <a
            href="#contact"
            className="hidden h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-deep sm:inline-flex"
          >
            Get a free demo
          </a>
        </div>
      </nav>
    </header>
  );
}
