"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getDictionary } from "@/i18n";

const t = getDictionary();
type Node = (typeof t.architecture.nodes)[number];

/** Diyagram üzerindeki konumlar (% cinsinden, 100 × 64 koordinat alanı) */
const pos: Record<string, [number, number]> = {
  clients: [50, 7],
  gateway: [30, 23],
  realtime: [70, 23],
  services: [30, 39],
  integrations: [14, 31],
  devices: [86, 39],
  data: [50, 49],
  infra: [50, 59],
};
const H = 64;

function edges(nodes: readonly Node[]) {
  const out: [string, string][] = [];
  nodes.forEach((n) => n.links.forEach((l) => out.push([n.id, l])));
  return out;
}

export function ArchitectureDiagram() {
  const nodes = t.architecture.nodes;
  const [sel, setSel] = useState<string>("gateway");
  const all = useMemo(() => edges(nodes), [nodes]);
  const current = nodes.find((n) => n.id === sel)!;
  const related = new Set(all.filter(([a, b]) => a === sel || b === sel).flat());

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const n = nodes[(i + 1) % nodes.length];
      setSel(n.id);
      document.getElementById(`arch-${n.id}`)?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = nodes[(i - 1 + nodes.length) % nodes.length];
      setSel(n.id);
      document.getElementById(`arch-${n.id}`)?.focus();
    }
  };

  const Detail = (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">Katman</p>
        <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">{current.label}</h3>
        <p className="mt-3 leading-relaxed text-muted">{current.text}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {current.tech.map((x) => (
            <li key={x} className="rounded-md border border-line bg-night px-2.5 py-1 font-mono text-[11px] text-text/85">
              {x}
            </li>
          ))}
        </ul>
        {current.links.length > 0 && (
          <p className="mt-5 text-sm text-dim">
            Bağlandığı katmanlar:{" "}
            {current.links.map((l, i) => (
              <span key={l} className="text-muted">
                {nodes.find((n) => n.id === l)?.label}
                {i < current.links.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
      {/* Masaüstü diyagram */}
      <div className="relative hidden aspect-[100/64] rounded-3xl border border-line bg-[radial-gradient(70%_60%_at_50%_45%,rgba(139,108,255,0.10),transparent_70%)] lg:block">
        <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {all.map(([a, b]) => {
            const [x1, y1] = pos[a];
            const [x2, y2] = pos[b];
            const on = a === sel || b === sel;
            return (
              <line
                key={`${a}-${b}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={on ? "var(--c-violet)" : "var(--c-line-strong)"}
                strokeWidth={on ? 1.6 : 1}
                vectorEffect="non-scaling-stroke"
                className={on ? "flow-line" : undefined}
                style={{ transition: "stroke .4s" }}
              />
            );
          })}
        </svg>
        <div role="listbox" aria-label={t.architecture.hint} aria-activedescendant={`arch-${sel}`}>
          {nodes.map((n, i) => {
            const [x, y] = pos[n.id];
            const on = n.id === sel;
            const rel = related.has(n.id);
            return (
              <button
                key={n.id}
                id={`arch-${n.id}`}
                type="button"
                role="option"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setSel(n.id)}
                onMouseEnter={() => setSel(n.id)}
                onFocus={() => setSel(n.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm transition-[background-color,border-color,color,box-shadow] duration-300 ${
                  on
                    ? "border-violet bg-violet/15 text-text shadow-[0_0_40px_-6px_rgba(139,108,255,0.6)]"
                    : rel
                      ? "border-violet/50 bg-surface text-text"
                      : "border-line bg-surface/90 text-muted hover:text-text"
                }`}
                style={{ left: `${x}%`, top: `${(y / H) * 100}%` }}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobil / tablet: katman yığını */}
      <div className="lg:hidden">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.architecture.hint}>
          {nodes.map((n) => {
            const on = n.id === sel;
            return (
              <button
                key={n.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSel(n.id)}
                className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${on ? "border-violet bg-violet/15 text-text" : related.has(n.id) ? "border-violet/40 text-text" : "border-line text-muted"}`}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-surface/70 p-6 lg:self-center" aria-live="polite">
        {Detail}
      </div>
    </div>
  );
}
