"use client";

import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/**
 * Yangın söndürücü envanteri: dolum/bakım/son kullanım zaman çizelgesi ve durumlar.
 * Seçilen filtreye göre liste dönüşür. Tüm kayıtlar örnektir.
 */
const devices = [
  { id: "YS-0142", type: "6 kg KKT", loc: "Merkez ofis · Zemin kat", lot: "L-2318", next: 0.18, status: "yaklasiyor" },
  { id: "YS-0143", type: "6 kg KKT", loc: "Merkez ofis · 1. kat", lot: "L-2318", next: 0.72, status: "guncel" },
  { id: "YS-0211", type: "5 kg CO₂", loc: "Depo · Elektrik pano", lot: "L-1904", next: -0.05, status: "gecti" },
  { id: "YS-0307", type: "50 kg KKT", loc: "Üretim alanı", lot: "L-2201", next: 0.46, status: "guncel" },
  { id: "YS-0308", type: "6 lt Köpük", loc: "Mutfak", lot: "L-2240", next: 0.09, status: "yaklasiyor" },
] as const;

const filters = [
  { id: "hepsi", label: "Tüm cihazlar" },
  { id: "yaklasiyor", label: "Bakımı yaklaşan" },
  { id: "gecti", label: "Süresi geçen" },
] as const;

const statusMeta = {
  guncel: { label: "Güncel", color: "var(--c-cyan)" },
  yaklasiyor: { label: "Bakım yaklaşıyor", color: "var(--c-amber)" },
  gecti: { label: "Süresi geçti", color: "var(--c-danger)" },
} as const;

export function FireSafety() {
  const { ref, step, set } = useAutoStep<HTMLDivElement>(filters.length, 3000);
  const f = filters[step].id;
  const list = devices.filter((d) => f === "hepsi" || d.status === f);

  return (
    <div ref={ref}>
      <VisualFrame title="yangin-takip / envanter" accent="amber">
        <div className="flex gap-1.5 overflow-x-auto border-b border-line p-3 [scrollbar-width:none]" role="tablist" aria-label="Cihaz filtresi">
          {filters.map((x, i) => (
            <button key={x.id} type="button" role="tab" aria-selected={i === step} onClick={() => set(i)} className={`min-h-9 shrink-0 rounded-full border px-3 text-[11px] transition-colors ${i === step ? "border-amber/60 bg-amber/10 text-text" : "border-line text-muted hover:text-text"}`}>
              {x.label}
            </button>
          ))}
        </div>
        <ul className="min-h-[19rem] divide-y divide-line/70 p-1" aria-live="polite">
          {list.map((d) => {
            const m = statusMeta[d.status];
            return (
              <li key={d.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 px-3 py-3.5 sm:grid-cols-[7rem_1fr_9rem]">
                <div>
                  <p className="font-mono text-xs text-text">{d.id}</p>
                  <p className="text-[11px] text-dim">{d.type}</p>
                </div>
                <div className="order-3 col-span-2 sm:order-none sm:col-span-1">
                  <p className="truncate text-xs text-muted">{d.loc} · Lot {d.lot}</p>
                  <div className="relative mt-2 h-1.5 rounded-full bg-line" aria-hidden>
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.max(3, Math.min(1, d.next) * 100)}%`, background: m.color }} />
                  </div>
                </div>
                <span className="flex items-center justify-end gap-2 text-[11px]" style={{ color: m.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} aria-hidden />
                  {m.label}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line px-4 py-2 text-right font-mono text-[10px] text-dim">örnek kayıtlar · çubuk: sonraki bakıma kalan süre</p>
      </VisualFrame>
    </div>
  );
}
