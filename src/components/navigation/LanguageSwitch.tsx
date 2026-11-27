import Link from "next/link";

type Props = { current: "tr" | "en"; tone?: "dark" | "light"; className?: string };

/**
 * TR / EN dil seçici. İki dil ayrı kök layout'ta olduğundan geçiş tam sayfa yüklemesidir;
 * bu yüzden düz <a> davranışı (prefetch kapalı) yeterli.
 */
export function LanguageSwitch({ current, tone = "dark", className = "" }: Props) {
  const base =
    tone === "dark"
      ? { wrap: "border-line text-muted", active: "bg-text text-graphite", idle: "hover:text-text" }
      : { wrap: "border-ink/15 text-ink/60", active: "bg-ink text-paper", idle: "hover:text-ink" };
  const items = [
    { code: "tr", label: "TR", href: "/", lang: "tr", title: "Türkçe" },
    { code: "en", label: "EN", href: "/en", lang: "en", title: "English" },
  ] as const;
  return (
    <div
      role="group"
      aria-label={current === "tr" ? "Dil seçimi" : "Language"}
      className={`flex h-10 items-center rounded-full border p-1 text-xs font-medium ${base.wrap} ${className}`}
    >
      {items.map((i) =>
        i.code === current ? (
          <span key={i.code} aria-current="true" title={i.title} className={`flex h-8 min-w-9 items-center justify-center rounded-full px-2 ${base.active}`}>
            {i.label}
          </span>
        ) : (
          <Link
            key={i.code}
            href={i.href}
            prefetch={false}
            hrefLang={i.lang}
            lang={i.lang}
            title={i.title}
            className={`flex h-8 min-w-9 items-center justify-center rounded-full px-2 transition-colors ${base.idle}`}
          >
            {i.label}
          </Link>
        ),
      )}
    </div>
  );
}
