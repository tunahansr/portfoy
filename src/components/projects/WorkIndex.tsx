"use client";

import { useEffect, useState } from "react";

/**
 * "Project Universe" gezinme şeridi: Selected Work boyunca yapışkan durur, aktif projeyi gösterir.
 * Mobilde yatay kaydırılabilir çip listesi (sayfa yatay taşmaz; şerit kendi içinde kayar).
 */
export function WorkIndex({ items }: { items: { slug: string; name: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(`proje-${i.slug}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace("proje-", ""));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    const btn = document.querySelector<HTMLElement>(`[data-index-slug="${active}"]`);
    const bar = btn?.parentElement?.parentElement;
    if (btn && bar && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: btn.offsetLeft - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav aria-label="Seçili projeler" className="sticky top-[var(--header-h)] z-30 border-y border-line bg-graphite/85 backdrop-blur-md">
      <div className="container-x overflow-x-auto [scrollbar-width:none]">
        <ol className="flex w-max gap-1 py-2">
          {items.map((it, i) => {
            const on = it.slug === active;
            return (
              <li key={it.slug}>
                <a
                  href={`#proje-${it.slug}`}
                  data-index-slug={it.slug}
                  aria-current={on ? "true" : undefined}
                  className={`flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-xs transition-colors ${on ? "bg-surface-2 text-text" : "text-muted hover:text-text"}`}
                >
                  <span className={`font-mono text-[10px] ${on ? "text-cyan" : "text-dim"}`}>{String(i + 1).padStart(2, "0")}</span>
                  {it.name}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
