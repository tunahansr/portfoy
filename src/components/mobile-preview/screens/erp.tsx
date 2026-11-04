"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Mail,
  Phone,
  ScanBarcode,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { demoApprovals, demoStock } from "@/data/mobile-apps";
import { motion as brandMotion } from "@/lib/brand";
import { Card, LargeTitle, Pill, ScreenBody, TabBar, cn, type ScreenProps } from "../kit";

function erpTabs(active: string, go: (v: string) => void, pending: number) {
  return (
    <TabBar
      active={active}
      onSelect={go}
      items={[
        { id: "dashboard", label: "Özet", icon: LayoutDashboard },
        { id: "stok", label: "Stok", icon: Boxes },
        { id: "cari", label: "Cari", icon: Users },
        { id: "onay", label: "Onay", icon: ClipboardCheck, badge: pending || undefined },
      ]}
    />
  );
}

function ErpTop() {
  return (
    <div className="flex items-center justify-between px-5 pt-2">
      <div className="flex items-center gap-2">
        <div className="grid size-7 place-items-center rounded-[8px] bg-(--p-accent) text-[12px] font-black text-white">K</div>
        <div className="leading-tight">
          <div className="text-[12.5px] font-bold tracking-[0.02em]">KAREKOD ERP</div>
          <div className="text-[11px] text-(--p-muted)">Demo şirket · Merkez</div>
        </div>
      </div>
      <span className="relative grid size-9 place-items-center rounded-full bg-(--p-card) shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <Bell size={17} />
      </span>
    </div>
  );
}

/* ───────────── Özet panel ───────────── */

const SALES = [22, 28, 25, 34, 31, 40, 37, 46, 43, 52];

export function ErpDashboard({ state, go, reduced }: ScreenProps) {
  const W = 300;
  const H = 70;
  const max = Math.max(...SALES);
  const pts = SALES.map((v, i) => [(i / (SALES.length - 1)) * W, H - (v / max) * (H - 6)] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const pending = demoApprovals.length - state.approved.length;
  const gid = `erp-area-${useId().replace(/:/g, "")}`;
  return (
    <ScreenBody withTabs>
      <ErpTop />
      <LargeTitle kicker="Salı, 3 Kasım" title="Günaydın" />
      <div
        className="relative mx-4 overflow-hidden rounded-[24px] p-5 text-white shadow-[0_20px_40px_-18px_rgba(61,123,255,0.8)]"
        style={{ background: "radial-gradient(90% 90% at 100% 0%, #45E0F066, transparent 55%), linear-gradient(140deg, #3D7BFF, #2552C9)" }}
      >
        <div className="flex items-center justify-between text-[13px] text-white/80">
          <span>Bugünkü satış</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">Örnek veri</span>
        </div>
        <div className="mt-1 text-[34px] font-bold tracking-[-0.03em] tabular-nums">₺48.250</div>
        <div className="flex items-center gap-1 text-[12.5px] text-white/85">
          <TrendingUp size={14} />
          Dünden yüksek
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={`url(#${gid})`} />
          <motion.path
            d={line}
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: brandMotion.ease.inOut }}
          />
          <circle cx={pts[pts.length - 1][0] - 3} cy={pts[pts.length - 1][1]} r="4" fill="#fff" />
        </svg>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-2.5">
        {[
          { label: "Açık sipariş", value: "23", tone: "#3D7BFF", to: "dashboard" },
          { label: "Kritik stok", value: "7", tone: "#E5484D", to: "stok" },
          { label: "Tahsilat bekleyen", value: "₺12.400", tone: "#0E9F8E", to: "cari" },
          { label: "Onay bekleyen", value: String(pending), tone: "#B7791F", to: "onay" },
        ].map((k) => (
          <button key={k.label} type="button" onClick={() => go(k.to)} className="text-left">
            <Card className="p-3.5">
              <div className="flex items-center justify-between">
                <span className="size-2 rounded-full" style={{ background: k.tone }} />
                <ArrowUpRight size={14} className="text-(--p-muted)" />
              </div>
              <div className="mt-2 text-[22px] font-bold tracking-[-0.03em] tabular-nums">{k.value}</div>
              <div className="text-[12px] text-(--p-muted)">{k.label}</div>
            </Card>
          </button>
        ))}
      </div>
      {erpTabs("dashboard", go, pending)}
    </ScreenBody>
  );
}

/* ───────────── Stok sorgu ───────────── */

export function ErpStok({ state, dispatch, go, reduced }: ScreenProps) {
  const q = state.stockQuery.trim().toLocaleLowerCase("tr");
  const hit =
    q.length > 0 &&
    (demoStock.query.toLocaleLowerCase("tr").includes(q) || demoStock.name.toLocaleLowerCase("tr").includes(q));
  const total = demoStock.warehouses.reduce((a, w) => a + w.qty, 0);
  const pending = demoApprovals.length - state.approved.length;
  return (
    <ScreenBody withTabs>
      <ErpTop />
      <LargeTitle title="Stok sorgu" />
      <div className="mx-4 flex gap-2">
        <label
          data-demo="stock-search"
          className="flex h-[48px] flex-1 items-center gap-2.5 rounded-[14px] bg-(--p-card) px-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-(--p-accent) focus-within:ring-2"
        >
          <Search size={18} className="text-(--p-muted)" />
          <span className="sr-only">Stok kodu veya ürün adı</span>
          <input
            value={state.stockQuery}
            onChange={(e) => dispatch({ type: "stockQuery", value: e.target.value })}
            placeholder="Stok kodu veya ürün adı"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-(--p-muted)"
            style={{ outline: "none" }}
            data-phone-input
          />
        </label>
        <span className="grid size-[48px] place-items-center rounded-[14px] bg-(--p-accent) text-white">
          <ScanBarcode size={20} />
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {hit ? (
          <motion.div
            key="hit"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: brandMotion.ease.out }}
          >
            <Card className="mx-4 mt-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[12px] text-(--p-muted)">{demoStock.query}</div>
                  <div className="text-[17px] font-semibold tracking-[-0.01em]">{demoStock.name}</div>
                </div>
                <Pill className="bg-[#0E9F8E]/12 text-[#0B7F72]">Stokta</Pill>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[34px] font-bold tracking-[-0.03em] tabular-nums">{total}</span>
                <span className="text-[14px] text-(--p-muted)">{demoStock.unit} toplam</span>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {demoStock.warehouses.map((w, i) => (
                  <div key={w.name}>
                    <div className="flex justify-between text-[13px]">
                      <span className="font-medium">{w.name}</span>
                      <span className="tabular-nums text-(--p-muted)">
                        {w.qty} {demoStock.unit}
                      </span>
                    </div>
                    <div className="mt-1.5 h-[7px] overflow-hidden rounded-full bg-(--p-card-2)">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: w.qty / w.max < 0.35 ? "#E5484D" : "var(--p-accent)" }}
                        initial={reduced ? false : { width: 0 }}
                        animate={{ width: `${(w.qty / w.max) * 100}%` }}
                        transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: brandMotion.ease.out }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="mx-4 mt-3 flex items-center justify-between p-4 text-[13.5px]">
              <span className="text-(--p-muted)">Şube depo kritik seviyede</span>
              <span className="font-semibold text-(--p-accent)">Transfer öner</span>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-3"
          >
            <div className="px-1 pb-2 text-[12.5px] font-semibold text-(--p-muted)">Son aramalar</div>
            {[demoStock.query, "STK-0127", "STK-0904"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => dispatch({ type: "stockQuery", value: s })}
                className="flex w-full items-center gap-3 border-b border-(--p-line) px-1 py-3 text-left text-[14px]"
              >
                <Search size={15} className="text-(--p-muted)" />
                <span className="font-mono">{s}</span>
              </button>
            ))}
            {q.length > 0 ? <div className="px-1 pt-4 text-[13px] text-(--p-muted)">Bu demoda yalnızca {demoStock.query} kaydı var.</div> : null}
          </motion.div>
        )}
      </AnimatePresence>
      {erpTabs("stok", go, pending)}
    </ScreenBody>
  );
}

/* ───────────── Cari kart ───────────── */

export function ErpCari({ state, go }: ScreenProps) {
  const pending = demoApprovals.length - state.approved.length;
  return (
    <ScreenBody withTabs>
      <ErpTop />
      <LargeTitle title="Cari kart" />
      <Card className="mx-4 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-[14px] bg-(--p-accent)/12 text-[15px] font-bold text-(--p-accent)">ÖT</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-semibold">Örnek Ticaret Ltd.</div>
            <div className="font-mono text-[12px] text-(--p-muted)">C-0214 · Müşteri</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[12px] text-(--p-muted)">Bakiye</div>
            <div className="text-[20px] font-bold tracking-[-0.02em] tabular-nums">₺18.750</div>
          </div>
          <div>
            <div className="text-[12px] text-(--p-muted)">Vade durumu</div>
            <div className="text-[15px] font-semibold text-[#0B7F72]">Gecikme yok</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[12px] text-(--p-muted)">
            <span>Risk limiti kullanımı</span>
            <span className="tabular-nums">%62</span>
          </div>
          <div className="mt-1.5 h-[7px] rounded-full bg-(--p-card-2)">
            <div className="h-full w-[62%] rounded-full bg-(--p-accent)" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { i: Phone, t: "Ara" },
            { i: Mail, t: "E-posta" },
            { i: FileText, t: "Ekstre" },
          ].map((a) => (
            <span key={a.t} className="flex h-[44px] items-center justify-center gap-1.5 rounded-[12px] bg-(--p-card-2) text-[13px] font-semibold">
              <a.i size={15} />
              {a.t}
            </span>
          ))}
        </div>
      </Card>
      <div className="mx-5 mt-4 text-[13px] font-semibold text-(--p-muted)">Son hareketler</div>
      <Card className="mx-4 mt-2 p-1.5">
        {[
          { t: "Satış faturası", r: "FTR-2310", v: "+₺6.420", d: "Bugün" },
          { t: "Tahsilat · Havale", r: "THS-0981", v: "−₺10.000", d: "Dün" },
          { t: "Satış faturası", r: "FTR-2297", v: "+₺4.180", d: "29 Eki" },
        ].map((m, i) => (
          <div key={m.r} className={cn("flex items-center gap-3 px-2.5 py-3", i > 0 && "border-t border-(--p-line)")}>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">{m.t}</div>
              <div className="font-mono text-[11.5px] text-(--p-muted)">
                {m.r} · {m.d}
              </div>
            </div>
            <span className={cn("text-[14px] font-semibold tabular-nums", m.v.startsWith("−") && "text-[#0B7F72]")}>{m.v}</span>
          </div>
        ))}
      </Card>
      {erpTabs("cari", go, pending)}
    </ScreenBody>
  );
}

/* ───────────── Onay bekleyenler ───────────── */

export function ErpOnay({ state, dispatch, go, reduced }: ScreenProps) {
  const pending = demoApprovals.length - state.approved.length;
  return (
    <ScreenBody withTabs>
      <ErpTop />
      <LargeTitle
        title="Onaylar"
        right={<span className="mb-1 rounded-full bg-(--p-accent)/12 px-3 py-1.5 text-[12px] font-semibold text-(--p-accent)">{pending} bekliyor</span>}
      />
      <div className="mx-4 flex flex-col gap-2.5">
        {demoApprovals.map((a) => {
          const ok = state.approved.includes(a.id);
          return (
            <motion.div key={a.id} layout={!reduced} transition={{ duration: 0.35, ease: brandMotion.ease.out }}>
              <Card className={cn("p-4 transition-opacity", ok && "opacity-80")}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[15.5px] font-semibold">{a.title}</div>
                    <div className="text-[12.5px] text-(--p-muted)">
                      <span className="font-mono">{a.ref}</span> · {a.detail}
                    </div>
                  </div>
                  {a.amount ? <span className="text-[15px] font-semibold tabular-nums">{a.amount}</span> : null}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {ok ? (
                    <motion.div
                      key="ok"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex h-[44px] items-center justify-center gap-2 rounded-[12px] bg-[#0E9F8E]/12 text-[14px] font-semibold text-[#0B7F72]"
                    >
                      <Check size={17} strokeWidth={2.8} />
                      Onaylandı
                    </motion.div>
                  ) : (
                    <motion.div key="actions" exit={{ opacity: 0 }} className="mt-3 flex gap-2">
                      <span className="flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-(--p-card-2) text-[14px] font-semibold text-(--p-muted)">
                        <X size={16} />
                        Reddet
                      </span>
                      <button
                        type="button"
                        data-demo={`approve-${a.id}`}
                        onClick={() => dispatch({ type: "approve", id: a.id })}
                        className="flex h-[44px] flex-[1.4] items-center justify-center gap-1.5 rounded-[12px] bg-(--p-accent) text-[14px] font-semibold text-white"
                      >
                        <Check size={16} strokeWidth={2.6} />
                        Onayla
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {erpTabs("onay", go, pending)}
    </ScreenBody>
  );
}
