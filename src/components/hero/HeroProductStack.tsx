/**
 * Hero'da çekirdeğin çevresinde beliren perspektifli ürün arayüzleri (yalnızca geniş ekran).
 * Ürün tanımlarına göre çizilmiş konsept arayüzlerdir; sayılar örnek veridir.
 */
export function HeroProductStack() {
  const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden [perspective:1400px] lg:block">
      {/* ERP dashboard kartı */}
      <div
        className="hero-rise absolute bottom-[12%] right-[4%] w-[clamp(15rem,22vw,21rem)] [transform:rotateY(-16deg)_rotateX(6deg)] xl:right-[6%]"
        style={d(1500)}
      >
        <div className="rounded-2xl border border-line-strong/80 bg-surface/90 p-4 shadow-[0_40px_80px_-30px_rgba(61,123,255,0.45)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">KAREKOD ERP · Satış</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
          </div>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {[38, 52, 44, 66, 58, 74, 62, 86, 70, 92].map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-blue/40 to-cyan/90"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Stok", "Cari", "Finans"].map((m) => (
              <span key={m} className="rounded-md border border-line bg-night px-2 py-1.5 text-center font-mono text-[10px] text-muted">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* POS sipariş fişi */}
      <div
        className="hero-rise absolute right-[30%] top-[16%] w-[clamp(11rem,14vw,13.5rem)] [transform:rotateY(14deg)_rotateX(-4deg)]"
        style={d(1700)}
      >
        <div className="rounded-xl border border-line-strong/80 bg-surface/90 p-3.5 shadow-[0_30px_60px_-25px_rgba(255,181,71,0.35)]">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="text-muted">Masa 4</span>
            <span className="text-amber">Ödendi</span>
          </div>
          <div className="mt-2.5 space-y-1.5 text-[11px] text-muted">
            <div className="flex justify-between"><span>2× Pide</span><span className="text-text/80">—</span></div>
            <div className="flex justify-between"><span>1× Ayran</span><span className="text-text/80">—</span></div>
          </div>
          <div className="mt-2.5 h-px bg-line" />
          <p className="mt-2 font-mono text-[10px] text-dim">Mali POS · PC-Link</p>
        </div>
      </div>

      {/* Kurye durum hapı */}
      <div className="hero-rise absolute right-[38%] top-[58%] [transform:rotateY(10deg)]" style={d(1900)}>
        <div className="flex items-center gap-2.5 rounded-full border border-line-strong/80 bg-surface/90 py-2 pl-2 pr-4 shadow-[0_20px_40px_-20px_rgba(69,224,240,0.4)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber/15">
            <span className="h-2 w-2 rounded-full bg-amber" />
          </span>
          <span className="text-[11px] text-text/90">Kurye yolda</span>
          <span className="font-mono text-[10px] text-dim">canlı konum</span>
        </div>
      </div>
    </div>
  );
}
