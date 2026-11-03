"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories, projects, type CategoryId } from "@/data/projects";
import { accentVar } from "@/components/visuals/VisualFrame";
import { getDictionary } from "@/i18n";

const t = getDictionary();
const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

/** Kategori filtreli çalışma arşivi: kart ızgarası yerine editoryal satır listesi. */
export function Archive({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const list = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, projects.filter((p) => p.categories.includes(c.id)).length])), []);
  const H = headingLevel === 2 ? "h3" : "h4";

  return (
    <div>
      <div role="group" aria-label="Kategori filtresi" className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none]">
        <div className="flex w-max gap-2 pb-1">
          {[{ id: "all" as const, label: t.archive.all }, ...categories].map((c) => {
            const on = filter === c.id;
            const n = c.id === "all" ? projects.length : counts[c.id];
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c.id)}
                className={`relative flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "border-text text-graphite" : "border-line text-muted hover:border-line-strong hover:text-text"}`}
              >
                {on && <motion.span layoutId="archive-pill" className="absolute inset-0 rounded-full bg-text" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />}
                <span className="relative">{c.label}</span>
                <span className={`relative font-mono text-[10px] ${on ? "text-graphite/60" : "text-dim"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-dim" aria-live="polite">
        {t.archive.count(list.length)}
      </p>

      <ul className="mt-3 border-t border-line">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-line"
            >
              <Link
                href={`/projeler/${p.slug}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_12rem_auto] md:gap-x-8"
                style={{ "--accent": accentVar[p.accent] } as React.CSSProperties}
              >
                <H className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-medium tracking-tight transition-colors group-hover:text-[var(--accent)]">
                  {p.name}
                </H>
                <ArrowUpRight className="h-5 w-5 text-dim transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text md:order-last" aria-hidden />
                <p className="col-span-2 text-sm text-muted md:col-span-1">{p.tagline}</p>
                <p className="col-span-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dim md:col-span-1">
                  {p.categories.map(catLabel).join(" · ")}
                </p>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {list.length === 0 && <p className="py-10 text-muted">{t.archive.empty}</p>}
    </div>
  );
}
