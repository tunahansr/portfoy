"use client";

import { motion } from "motion/react";
import { WifiOff, Check } from "lucide-react";
import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/** POS ekranı ↔ mali cihaz: sipariş, parçalı ödeme, WebSocket mesajı, fiş onayı, offline kuyruk. */
const steps = [
  { id: "order", label: "Masa 4 siparişi açık" },
  { id: "split", label: "Parçalı ödeme: 2 kişi" },
  { id: "send", label: "WebSocket → mali cihaz" },
  { id: "receipt", label: "Mali fiş onaylandı" },
  { id: "offline", label: "Bağlantı yok → kuyrukta" },
];
const items = [
  ["Lahmacun", 2],
  ["Ayran", 2],
  ["Künefe", 1],
] as const;
const tables = Array.from({ length: 12 }, (_, i) => i + 1);

export function PosTerminal() {
  const { ref, step, set } = useAutoStep<HTMLDivElement>(steps.length, 2300);
  const s = steps[step].id;
  const sending = s === "send";
  const done = s === "receipt";
  const offline = s === "offline";

  return (
    <div ref={ref}>
      <VisualFrame title="pos.restoran / masa-4" accent="amber">
        <div className="grid gap-4 p-4 md:grid-cols-[1.35fr_auto_0.9fr] md:items-center">
          {/* POS ekranı */}
          <div className="rounded-xl border border-line bg-night/60 p-3">
            <div className="grid grid-cols-6 gap-1.5" aria-hidden>
              {tables.map((n) => (
                <span key={n} className={`flex aspect-square items-center justify-center rounded-md text-[10px] ${n === 4 ? "bg-amber/20 text-amber ring-1 ring-amber/60" : n % 3 === 0 ? "bg-surface-2 text-muted" : "bg-surface text-dim"}`}>
                  {n}
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              {items.map(([n, q]) => (
                <div key={n} className="flex justify-between rounded-md bg-surface px-2.5 py-1.5">
                  <span className="text-text/90">{n}</span>
                  <span className="font-mono text-muted">×{q}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {["Kişi 1", "Kişi 2"].map((p, i) => (
                <motion.span
                  key={p}
                  animate={{ y: s === "split" ? -2 : 0 }}
                  className={`rounded-md border px-2 py-2 text-center text-[11px] ${step >= 1 && step <= 3 ? "border-amber/50 text-text" : "border-line text-muted"}`}
                >
                  {p} · {i === 0 ? "Kart" : "Nakit"}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bağlantı */}
          <div className="flex items-center justify-center gap-2 md:flex-col" aria-hidden>
            <span className="font-mono text-[10px] text-dim">{offline ? "kuyruk" : "ws://"}</span>
            <div className="relative h-px w-24 overflow-hidden bg-line md:h-24 md:w-px">
              {sending && (
                <motion.span
                  className="absolute left-0 top-0 h-full w-6 bg-amber md:h-6 md:w-full"
                  initial={{ x: "-100%", y: 0 }}
                  animate={{ x: ["-100%", "400%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            {offline ? <WifiOff className="h-4 w-4 text-danger" /> : <span className="font-mono text-[10px] text-dim">PC-Link</span>}
          </div>

          {/* Mali cihaz */}
          <div className="mx-auto w-full max-w-[13rem]">
            <div className="rounded-[1.4rem] border border-line-strong bg-surface-2 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className={`rounded-lg p-3 font-mono text-[11px] transition-colors duration-500 ${done ? "bg-amber/15 text-amber" : "bg-night text-muted"}`}>
                <p className="text-[10px] tracking-[0.14em] text-dim">MALİ POS</p>
                <p className="mt-1.5 min-h-[2.6em]">
                  {done ? (
                    <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Fiş onaylandı</span>
                  ) : sending ? (
                    "Ödeme bekleniyor…"
                  ) : offline ? (
                    "Kuyruktaki işlem senkronize edilecek"
                  ) : (
                    "Hazır"
                  )}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="h-5 rounded bg-surface" />
                ))}
              </div>
            </div>
            <p className="mt-2 text-center font-mono text-[10px] text-dim">Hugin · PC-Link / Cloud-Link</p>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto border-t border-line p-3 [scrollbar-width:none]" role="tablist" aria-label="POS akış adımları">
          {steps.map((st, i) => (
            <button
              key={st.id}
              type="button"
              role="tab"
              aria-selected={i === step}
              onClick={() => set(i)}
              className={`min-h-9 shrink-0 rounded-full border px-3 text-[11px] transition-colors ${i === step ? "border-amber/60 bg-amber/10 text-text" : "border-line text-muted hover:text-text"}`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </VisualFrame>
    </div>
  );
}
