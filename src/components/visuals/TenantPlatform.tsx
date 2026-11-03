"use client";

import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/** Tenant provisioning job'u: yeni müşteri için veritabanı → şema → domain → modüller. */
const jobs = [
  { cmd: "tenant.create", out: "tenant: firma-a" },
  { cmd: "db.provision", out: "postgres: tenant_firma_a oluşturuldu" },
  { cmd: "db.migrate", out: "şema güncel" },
  { cmd: "domain.attach", out: "firma-a.ornek.com → tenant" },
  { cmd: "modules.enable", out: "satış, stok, finans aktif" },
];

export function TenantPlatform() {
  const { ref, step } = useAutoStep<HTMLDivElement>(jobs.length + 2, 1300);

  return (
    <div ref={ref}>
      <VisualFrame title="esyp / provisioning-jobs" accent="violet">
        <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_1fr]">
          <div className="rounded-xl border border-line bg-night p-4 font-mono text-[11.5px] leading-relaxed" aria-label="Provisioning job çıktısı (örnek)">
            {jobs.map((j, i) => {
              const state = i < step ? "done" : i === step ? "run" : "wait";
              return (
                <div key={j.cmd} className={`flex items-start gap-2 py-1 transition-opacity duration-300 ${state === "wait" ? "opacity-60" : "opacity-100"}`}>
                  <span className="mt-0.5 w-4 shrink-0">
                    {state === "done" ? <Check className="h-3.5 w-3.5 text-violet" aria-hidden /> : state === "run" ? <Loader2 className="h-3.5 w-3.5 animate-spin text-amber" aria-hidden /> : <span className="text-dim">·</span>}
                  </span>
                  <span className="min-w-0">
                    <span className="text-text">{j.cmd}</span>
                    {state === "done" && <span className="block truncate text-dim">→ {j.out}</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative flex items-center justify-center" aria-hidden>
            <div className="grid grid-cols-3 gap-3">
              {["Firma A", "Firma B", "Firma C"].map((n, i) => {
                const active = i === 0 ? step >= 2 : true;
                return (
                  <div key={n} className="flex flex-col items-center gap-2">
                    <motion.svg viewBox="0 0 40 48" className="h-14 w-12" animate={{ opacity: active ? 1 : 0.25, y: i === 0 && step === 1 ? -4 : 0 }}>
                      <ellipse cx="20" cy="8" rx="17" ry="6" fill="none" stroke={i === 0 ? "var(--c-violet)" : "var(--c-line-strong)"} />
                      <path d="M3 8v30c0 3.3 7.6 6 17 6s17-2.7 17-6V8" fill="none" stroke={i === 0 ? "var(--c-violet)" : "var(--c-line-strong)"} />
                      <path d="M3 22c0 3.3 7.6 6 17 6s17-2.7 17-6" fill="none" stroke="var(--c-line-strong)" />
                    </motion.svg>
                    <span className="text-[10px] text-muted">{n}</span>
                  </div>
                );
              })}
            </div>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-violet/50 px-3 py-1 font-mono text-[10px] text-violet">her tenant · ayrı veritabanı</span>
          </div>
        </div>
      </VisualFrame>
    </div>
  );
}
