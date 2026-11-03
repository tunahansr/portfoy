"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/** Masadaki QR → telefonda menü → sepet → mutfak/POS fişi. */
const steps = ["QR okutuldu", "Menüden seçim", "Masadan sipariş", "POS'a düştü"];

// Deterministik QR benzeri desen (gerçek bir QR kodu değildir, dekoratiftir)
const cells = Array.from({ length: 21 * 21 }, (_, i) => {
  const x = i % 21;
  const y = Math.floor(i / 21);
  const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  if (finder) {
    const lx = x > 13 ? x - 14 : x;
    const ly = y > 13 ? y - 14 : y;
    return lx === 0 || ly === 0 || lx === 6 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
  }
  return ((x * 7 + y * 13 + x * y) % 5) < 2;
});

export function QrMenu() {
  const { ref, step, set } = useAutoStep<HTMLDivElement>(steps.length, 2200);
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div ref={ref}>
      <VisualFrame title="qr-menu / masa-7" accent="cyan">
        <div className="grid items-center gap-5 p-5 sm:grid-cols-3">
          <div className="mx-auto w-32 rounded-2xl bg-text p-2.5 sm:w-full sm:max-w-[9.5rem]" aria-hidden>
            <div className="grid grid-cols-[repeat(21,1fr)] gap-0">
              {cells.map((on, i) => (
                <span key={i} className={`aspect-square ${on ? "bg-graphite" : ""}`} />
              ))}
            </div>
            <p className="mt-1.5 text-center font-mono text-[9px] font-medium text-graphite">MASA 7</p>
          </div>

          <div className="mx-auto w-40 rounded-[1.6rem] border border-line-strong bg-night p-2" aria-hidden>
            <div className="h-56 overflow-hidden rounded-[1.2rem] bg-surface p-2.5">
              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div key="scan" className="flex h-full flex-col items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span className="h-14 w-14 rounded-xl border-2 border-dashed border-cyan/70" />
                    <span className="text-[10px] text-muted">Menü açılıyor…</span>
                  </motion.div>
                ) : (
                  <motion.div key="menu" className="space-y-1.5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease }}>
                    <p className="text-[10px] font-semibold">Ana yemekler</p>
                    {["Izgara köfte", "Tavuk şiş", "Pide", "Salata"].map((m, i) => (
                      <div key={m} className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[10px] ${step >= 1 && i === 0 ? "bg-cyan/15 text-text ring-1 ring-cyan/50" : "bg-night text-muted"}`}>
                        <span>{m}</span>
                        <span className="h-3.5 w-3.5 rounded-full border border-line-strong" />
                      </div>
                    ))}
                    {step >= 2 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 rounded-md bg-cyan py-1.5 text-center text-[10px] font-semibold text-graphite">
                        Siparişi gönder
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[12rem]" aria-hidden>
            <div className={`rounded-xl border p-3 font-mono text-[10.5px] transition-colors duration-500 ${step === 3 ? "border-amber/60 bg-amber/10" : "border-line bg-night/60"}`}>
              <p className="text-dim">POS · MUTFAK</p>
              <AnimatePresence>
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 space-y-1 text-text/90">
                    <p>Masa 7 · yeni sipariş</p>
                    <p className="text-muted">1× Izgara köfte</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {step !== 3 && <p className="mt-2 text-dim">Sipariş bekleniyor</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto border-t border-line p-3 [scrollbar-width:none]" role="tablist" aria-label="QR sipariş adımları">
          {steps.map((s, i) => (
            <button key={s} type="button" role="tab" aria-selected={i === step} onClick={() => set(i)} className={`min-h-9 shrink-0 rounded-full border px-3 text-[11px] transition-colors ${i === step ? "border-cyan/60 bg-cyan/10 text-text" : "border-line text-muted hover:text-text"}`}>
              {String(i + 1).padStart(2, "0")} · {s}
            </button>
          ))}
        </div>
      </VisualFrame>
    </div>
  );
}
