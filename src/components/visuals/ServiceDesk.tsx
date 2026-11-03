"use client";

import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/** Teknik servis talebinin yaşam döngüsü: talep → atama → sahada → çözüldü → raporlandı. */
const stages = ["Talep açıldı", "Personel atandı", "Sahada", "Çözüldü", "Raporlandı"];
const tickets = ["#1042 Yazıcı arızası", "#1043 Ağ bağlantısı", "#1044 Periyodik bakım"];

export function ServiceDesk() {
  const { ref, step } = useAutoStep<HTMLDivElement>(stages.length, 1800);
  return (
    <div ref={ref}>
      <VisualFrame title="servis / talepler" accent="blue">
        <div className="space-y-2.5 p-4">
          {tickets.map((tk, i) => {
            const s = Math.min(stages.length - 1, (step + i * 2) % stages.length);
            return (
              <div key={tk} className="rounded-xl border border-line bg-night/60 p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text/90">{tk}</span>
                  <span className="text-muted">{stages[s]}</span>
                </div>
                <div className="mt-2.5 grid grid-cols-5 gap-1" aria-hidden>
                  {stages.map((_, k) => (
                    <span key={k} className="h-1 rounded-full transition-colors duration-500" style={{ background: k <= s ? (s === stages.length - 1 ? "var(--c-amber)" : "var(--c-blue)") : "var(--c-line)" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="border-t border-line px-4 py-2 text-right font-mono text-[10px] text-dim">örnek talepler</p>
      </VisualFrame>
    </div>
  );
}
