"use client";

import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/** Çatkapı Express canlı operasyon ekranı (örnek veri). Durumlar deterministik döngüyle değişir. */
const couriers = ["Kurye 01", "Kurye 02", "Kurye 03", "Kurye 04", "Kurye 05", "Kurye 06"];
const statusCycle = ["Müsait", "Restoranda", "Yolda", "Teslim etti", "Molada"] as const;
const statusColor: Record<(typeof statusCycle)[number], string> = {
  Müsait: "var(--c-cyan)",
  Restoranda: "var(--c-blue)",
  Yolda: "var(--c-amber)",
  "Teslim etti": "var(--c-text)",
  Molada: "var(--c-dim)",
};
const shifts = [
  [0.0, 0.5],
  [0.1, 0.6],
  [0.35, 0.85],
  [0.45, 1.0],
  [0.2, 0.7],
  [0.5, 1.0],
];

export function CourierOps() {
  const { ref, step } = useAutoStep<HTMLDivElement>(20, 1400);

  return (
    <div ref={ref}>
      <VisualFrame title="catkapi / canlı operasyon" accent="amber">
        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow mb-3 !text-[10px]">Canlı durum</p>
            <ul className="grid gap-1.5" aria-label="Kurye durumları (örnek)">
              {couriers.map((c, i) => {
                const st = statusCycle[(i * 2 + step) % statusCycle.length];
                return (
                  <li key={c} className="flex items-center justify-between rounded-lg border border-line bg-night/60 px-3 py-2.5 text-xs">
                    <span className="text-text/90">{c}</span>
                    <span className="flex items-center gap-2 text-muted">
                      <span className="h-1.5 w-1.5 rounded-full transition-colors duration-500" style={{ background: statusColor[st] }} />
                      <span className="w-20 text-right transition-opacity duration-300">{st}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="grid content-start gap-4">
            <div>
              <p className="eyebrow mb-3 !text-[10px]">Vardiya planı</p>
              <div className="space-y-1.5 rounded-lg border border-line bg-night/60 p-3">
                {shifts.map(([a, b], i) => (
                  <div key={i} className="relative h-3.5 rounded-sm bg-surface">
                    <span className="absolute inset-y-0 rounded-sm bg-amber/70" style={{ left: `${a * 100}%`, width: `${(b - a) * 100}%` }} />
                  </div>
                ))}
                <div className="flex justify-between pt-1 font-mono text-[9px] text-dim">
                  <span>10:00</span>
                  <span>16:00</span>
                  <span>22:00</span>
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3 !text-[10px]">Paket akışı</p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                {["Bekliyor", "Yolda", "Teslim"].map((k, i) => (
                  <div key={k} className="rounded-lg border border-line bg-night/60 px-2 py-3">
                    <div className="mx-auto flex h-10 items-end justify-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className="w-1.5 rounded-sm transition-[height] duration-700" style={{ height: `${20 + (((j + i + step) * 37) % 80)}%`, background: i === 2 ? "var(--c-cyan)" : "var(--c-amber)" }} />
                      ))}
                    </div>
                    <span className="mt-2 block text-muted">{k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="border-t border-line px-4 py-2 text-right font-mono text-[10px] text-dim">örnek veri · operasyon ekranı konsepti</p>
      </VisualFrame>
    </div>
  );
}
