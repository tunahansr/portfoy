"use client";

import { AnimatePresence, motion } from "motion/react";
import { BarChart3, Boxes, Wallet, Users, Factory, Wrench, UserCog } from "lucide-react";
import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/**
 * Dashboard Morphing: ERP modülleri aynı ana arayüz içinde dönüşerek gösterilir.
 * Tüm değerler örnek (illüstratif) veridir.
 */
const modules = [
  { id: "satis", label: "Satış", icon: BarChart3 },
  { id: "stok", label: "Stok", icon: Boxes },
  { id: "finans", label: "Finans", icon: Wallet },
  { id: "cari", label: "Cari", icon: Users },
  { id: "uretim", label: "Üretim", icon: Factory },
  { id: "servis", label: "Servis", icon: Wrench },
  { id: "ik", label: "İK", icon: UserCog },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

function SalesView() {
  const bars = [42, 55, 48, 63, 58, 71, 66, 80, 74, 88, 79, 92];
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-4">
      <div className="grid grid-cols-3 gap-2.5">
        {["Bugün", "Bu hafta", "Bu ay"].map((k, i) => (
          <div key={k} className="rounded-xl border border-line bg-night/60 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-dim">{k}</p>
            <div className="mt-2 h-2 rounded-full bg-line">
              <motion.div className="h-full rounded-full bg-[var(--accent)]" initial={{ width: 0 }} animate={{ width: `${45 + i * 18}%` }} transition={{ duration: 1, ease, delay: 0.1 * i }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1.5 rounded-xl border border-line bg-night/60 p-4">
        {bars.map((v, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-blue/30 to-[var(--accent)]"
            initial={{ height: 0 }}
            animate={{ height: `${v}%` }}
            transition={{ duration: 0.9, ease, delay: 0.03 * i }}
          />
        ))}
      </div>
    </div>
  );
}

function StockView() {
  const rows = [
    ["Ürün A-102", "Ana depo", 0.82],
    ["Ürün B-210", "Şube 2", 0.34],
    ["Ürün C-015", "Ana depo", 0.12],
    ["Ürün D-330", "Şube 1", 0.64],
    ["Ürün E-048", "Şube 3", 0.51],
  ] as const;
  return (
    <div className="h-full overflow-hidden rounded-xl border border-line bg-night/60">
      <div className="grid grid-cols-[1.3fr_1fr_1.2fr] border-b border-line px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] text-dim">
        <span>Ürün</span>
        <span>Depo</span>
        <span>Seviye</span>
      </div>
      {rows.map(([n, d, l], i) => (
        <motion.div
          key={n}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 * i }}
          className="grid grid-cols-[1.3fr_1fr_1.2fr] items-center border-b border-line/60 px-4 py-3 text-xs"
        >
          <span className="truncate text-text/90">{n}</span>
          <span className="truncate text-muted">{d}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 flex-1 rounded-full bg-line">
              <span className="block h-full rounded-full" style={{ width: `${l * 100}%`, background: l < 0.2 ? "var(--c-amber)" : "var(--accent)" }} />
            </span>
            {l < 0.2 && <span className="font-mono text-[9px] text-amber">KRİTİK</span>}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function FinanceView() {
  const pts = [60, 52, 58, 44, 49, 38, 42, 30, 34, 24, 28, 18];
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 300},${y}`).join(" ");
  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-3 rounded-xl border border-line bg-night/60 p-4">
      <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        {[20, 40, 60].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--c-line)" strokeWidth="0.5" />
        ))}
        <motion.path d={`${d} L300,80 L0,80 Z`} fill="var(--accent)" initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 1 }} />
        <motion.path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }} />
      </svg>
      <div className="flex flex-wrap gap-2 text-[10px] text-muted">
        {["Nakit akışı", "Tahsilat", "Ödeme planı"].map((x) => (
          <span key={x} className="rounded-full border border-line px-2.5 py-1">{x}</span>
        ))}
      </div>
    </div>
  );
}

function CariView() {
  return (
    <div className="grid h-full gap-2.5 sm:grid-cols-2">
      {["Cari kart", "Hesap hareketleri", "Vade takibi", "Mutabakat"].map((x, i) => (
        <motion.div key={x} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease, delay: 0.06 * i }} className="flex flex-col justify-between rounded-xl border border-line bg-night/60 p-3.5">
          <span className="text-xs text-text/90">{x}</span>
          <span className="mt-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, k) => (
              <span key={k} className="h-1 flex-1 rounded-full" style={{ background: k <= i + 1 ? "var(--accent)" : "var(--c-line)" }} />
            ))}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ProductionView() {
  const cols = [
    { t: "Planlandı", n: 3 },
    { t: "Üretimde", n: 2 },
    { t: "Kalite", n: 1 },
    { t: "Tamamlandı", n: 2 },
  ];
  return (
    <div className="grid h-full grid-cols-4 gap-2">
      {cols.map((c, ci) => (
        <div key={c.t} className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-night/60 p-2">
          <span className="truncate text-[10px] uppercase tracking-[0.1em] text-dim">{c.t}</span>
          {Array.from({ length: c.n }).map((_, k) => (
            <motion.span key={k} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 * (ci + k) }} className="h-8 rounded-md border border-line-strong/60 bg-surface-2" style={{ borderLeft: ci === 3 ? "2px solid var(--c-amber)" : "2px solid var(--accent)" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListView({ items }: { items: string[] }) {
  return (
    <div className="grid h-full content-start gap-2">
      {items.map((x, i) => (
        <motion.div key={x} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease, delay: 0.05 * i }} className="flex items-center justify-between rounded-xl border border-line bg-night/60 px-4 py-3 text-xs">
          <span className="text-text/90">{x}</span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? "var(--c-amber)" : "var(--accent)" }} />
        </motion.div>
      ))}
    </div>
  );
}

const views: Record<string, React.ReactNode> = {
  satis: <SalesView />,
  stok: <StockView />,
  finans: <FinanceView />,
  cari: <CariView />,
  uretim: <ProductionView />,
  servis: <ListView items={["Yeni servis kaydı", "Teknisyen ataması", "Parça talebi", "Servis raporu"]} />,
  ik: <ListView items={["Personel kartı", "İzin talepleri", "Vardiya planı", "Bordro hazırlığı"]} />,
};

export function ErpDashboard() {
  const { ref, step, set } = useAutoStep<HTMLDivElement>(modules.length, 2800);
  const active = modules[step];

  return (
    <div ref={ref}>
      <VisualFrame title="erp.karekod / dashboard" accent="blue">
        <div className="grid min-h-[22rem] grid-cols-1 sm:grid-cols-[11rem_1fr] md:min-h-[26rem]">
          <div role="tablist" aria-label="ERP modülleri" className="flex gap-1 overflow-x-auto border-b border-line p-2 [scrollbar-width:none] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            {modules.map((m, i) => {
              const Icon = m.icon;
              const sel = i === step;
              return (
                <button
                  key={m.id}
                  role="tab"
                  type="button"
                  aria-selected={sel}
                  aria-controls="erp-panel"
                  onClick={() => set(i)}
                  className={`relative flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 text-left text-xs transition-colors ${sel ? "text-text" : "text-muted hover:text-text"}`}
                >
                  {sel && <motion.span layoutId="erp-tab" className="absolute inset-0 rounded-lg bg-surface-2 ring-1 ring-line-strong" transition={{ duration: 0.45, ease }} />}
                  <Icon className="relative h-4 w-4" aria-hidden style={{ color: sel ? "var(--accent)" : undefined }} />
                  <span className="relative">{m.label}</span>
                </button>
              );
            })}
          </div>
          <div id="erp-panel" role="tabpanel" aria-label={`${active.label} modülü`} className="relative p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-base font-medium">{active.label}</p>
              <span className="font-mono text-[10px] text-dim">örnek veri</span>
            </div>
            <div className="h-[15rem] md:h-[18.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  className="h-full"
                  initial={{ opacity: 0, filter: "blur(6px)", scale: 0.985 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(6px)", scale: 1.01 }}
                  transition={{ duration: 0.45, ease }}
                >
                  {views[active.id]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </VisualFrame>
    </div>
  );
}
