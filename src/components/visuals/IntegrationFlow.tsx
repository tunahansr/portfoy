"use client";

import { usePacketFlow } from "@/hooks/usePacketFlow";
import { useAutoStep } from "@/hooks/useAutoStep";
import { VisualFrame } from "./VisualFrame";

/** Farklı sipariş kanallarından merkezi sisteme akan animasyonlu veri hatları. */
const sources = ["Yemeksepeti", "Trendyol Go Yemek", "Trendyol Go Market", "Migros Yemek"];
const stages = ["Webhook alındı", "İmza / yetki doğrulandı", "Şube eşlendi", "Sipariş senkronize edildi"];

export function IntegrationFlow() {
  const svgRef = usePacketFlow<SVGSVGElement>(0.28);
  const { ref, step } = useAutoStep<HTMLDivElement>(stages.length, 1600);
  const ys = [60, 140, 220, 300];

  return (
    <div ref={ref}>
      <VisualFrame title="entegrasyon.karekod / akış" accent="cyan">
        <div className="relative p-3 sm:p-5">
          <svg ref={svgRef} viewBox="0 0 640 360" className="hidden h-auto w-full sm:block" role="img" aria-label="Dört sipariş kanalından gelen siparişler entegrasyon merkezinde doğrulanıp POS ve ERP sistemine aktarılır.">
            <defs>
              <linearGradient id="int-line" x1="0" x2="1">
                <stop offset="0" stopColor="var(--c-line-strong)" />
                <stop offset="1" stopColor="var(--c-cyan)" />
              </linearGradient>
            </defs>
            {ys.map((y, i) => (
              <path key={i} id={`int-p${i}`} d={`M168 ${y} C 250 ${y}, 250 180, 318 180`} fill="none" stroke="url(#int-line)" strokeWidth="1.2" />
            ))}
            <path id="int-out" d="M430 180 C 480 180, 500 180, 548 180" fill="none" stroke="var(--c-cyan)" strokeWidth="1.2" className="flow-line" />

            {sources.map((s, i) => (
              <g key={s} transform={`translate(8 ${ys[i] - 17})`}>
                <rect width="160" height="34" rx="17" fill="var(--c-night)" stroke="var(--c-line-strong)" />
                <text x="16" y="21.5" fontSize="12" fill="var(--c-text)" fontFamily="var(--font-geist)">{s}</text>
              </g>
            ))}

            {/* Merkez */}
            <g transform="translate(318 110)">
              <rect width="112" height="140" rx="18" fill="var(--c-surface-2)" stroke="var(--c-cyan)" strokeOpacity="0.6" />
              <text x="56" y="30" textAnchor="middle" fontSize="10.5" fill="var(--c-muted)" fontFamily="var(--font-geist-mono)" letterSpacing="1.2">KAREKOD</text>
              <text x="56" y="47" textAnchor="middle" fontSize="12" fill="var(--c-text)" fontFamily="var(--font-geist)" fontWeight="600">Entegrasyon</text>
              {stages.map((_, i) => (
                <rect key={i} x="16" y={64 + i * 17} width="80" height="9" rx="4.5" fill={i <= step ? "var(--c-cyan)" : "var(--c-line)"} opacity={i <= step ? 0.9 - i * 0.12 : 1} style={{ transition: "fill .4s" }} />
              ))}
            </g>

            <g transform="translate(548 150)">
              <rect width="84" height="60" rx="14" fill="var(--c-night)" stroke="var(--c-amber)" strokeOpacity="0.7" />
              <text x="42" y="27" textAnchor="middle" fontSize="12" fill="var(--c-text)" fontFamily="var(--font-geist)" fontWeight="600">POS</text>
              <text x="42" y="44" textAnchor="middle" fontSize="11" fill="var(--c-muted)" fontFamily="var(--font-geist)">/ ERP</text>
            </g>

            {ys.map((_, i) => (
              <circle key={i} r="4" fill="var(--c-cyan)" data-packet-for={`int-p${i}`} data-offset={i * 0.27} data-speed={0.8 + i * 0.12} opacity="0" />
            ))}
            <circle r="3.5" fill="var(--c-amber)" data-packet-for="int-out" data-offset="0.5" data-speed="1.4" opacity="0" />
          </svg>

          {/* Mobil: dikey akış (SVG metinleri küçük ekranda okunmaz kalmasın diye) */}
          <div className="sm:hidden" aria-hidden>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((s) => (
                <span key={s} className="rounded-full border border-line-strong bg-night px-3 py-2 text-center text-[11px] leading-tight">{s}</span>
              ))}
            </div>
            <div className="mx-auto h-8 w-px bg-gradient-to-b from-line-strong to-cyan" />
            <div className="rounded-2xl border border-cyan/50 bg-surface-2 px-4 py-3 text-center">
              <p className="font-mono text-[10px] tracking-[0.12em] text-muted">KAREKOD</p>
              <p className="text-sm font-semibold">Entegrasyon</p>
            </div>
            <div className="mx-auto h-6 w-px bg-cyan" />
            <div className="mx-auto w-28 rounded-xl border border-amber/60 bg-night py-2 text-center text-xs font-semibold">POS / ERP</div>
          </div>

          <ol className="mt-4 grid gap-1.5 font-mono text-[11px] sm:grid-cols-2" aria-label="İşlem adımları">
            {stages.map((s, i) => (
              <li key={s} className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors duration-500 ${i <= step ? "border-cyan/40 text-text" : "border-line text-dim"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${i <= step ? "bg-cyan" : "bg-line-strong"}`} aria-hidden />
                {s}
              </li>
            ))}
          </ol>
        </div>
      </VisualFrame>
    </div>
  );
}
