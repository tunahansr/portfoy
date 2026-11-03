"use client";

import { AnimatePresence, motion } from "motion/react";
import { Activity, CalendarDays, ChartColumn, ChevronDown, Clock, Package, Store, MapPin, User } from "lucide-react";
import { demoCouriers, demoPackages, type OpsFilter } from "@/data/mobile-apps";
import { motion as brandMotion } from "@/lib/brand";
import { Card, LargeTitle, Pill, ScreenBody, TabBar, cn, type ScreenProps } from "../kit";

const STATUS: Record<Exclude<OpsFilter, "hepsi">, { label: string; color: string }> = {
  musait: { label: "Müsait", color: "#3DDC97" },
  yolda: { label: "Yolda", color: "#FFB547" },
  molada: { label: "Molada", color: "#8F9BB0" },
};

function opsTabs(active: string, go: (v: string) => void) {
  return (
    <TabBar
      active={active}
      onSelect={go}
      items={[
        { id: "canli", label: "Canlı", icon: Activity },
        { id: "paketler", label: "Paketler", icon: Package, badge: 2 },
        { id: "vardiya", label: "Vardiya", icon: CalendarDays },
        { id: "rapor", label: "Rapor", icon: ChartColumn },
      ]}
    />
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 pt-2">
      <div className="grid size-7 place-items-center rounded-[8px] bg-(--p-accent) text-[13px] font-black text-[#1A1206]">Ç</div>
      <div className="text-[13px] font-semibold tracking-[-0.01em] text-(--p-muted)">Çatkapı Express · Operasyon</div>
    </div>
  );
}

/* ───────────── Canlı durum ───────────── */

export function OpsCanli({ state, dispatch, go, reduced }: ScreenProps) {
  const filter = state.opsFilter;
  const list = demoCouriers.filter((c) => filter === "hepsi" || c.status === filter);
  const counts = (s: Exclude<OpsFilter, "hepsi">) => demoCouriers.filter((c) => c.status === s).length;
  return (
    <ScreenBody withTabs>
      <Brand />
      <LargeTitle
        title="Canlı durum"
        right={
          <span className="mb-1 flex items-center gap-1.5 rounded-full bg-[#3DDC97]/12 px-3 py-1.5 text-[12px] font-semibold text-[#3DDC97]">
            <span className="size-1.5 animate-[pulse-soft_1.4s_ease-in-out_infinite] rounded-full bg-[#3DDC97]" />
            Canlı
          </span>
        }
      />
      <div className="mx-4 grid grid-cols-3 gap-2.5">
        {(Object.keys(STATUS) as Exclude<OpsFilter, "hepsi">[]).map((s) => (
          <Card key={s} className="p-3.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-(--p-muted)">
              <span className="size-2 rounded-full" style={{ background: STATUS[s].color }} />
              {STATUS[s].label}
            </div>
            <div className="mt-1.5 text-[30px] font-bold leading-none tracking-[-0.03em] tabular-nums">{counts(s)}</div>
          </Card>
        ))}
      </div>

      <div className="mx-4 mt-4 flex gap-1 rounded-[14px] bg-(--p-card) p-1">
        {(["hepsi", "musait", "yolda", "molada"] as OpsFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            data-demo={`filter-${f}`}
            onClick={() => dispatch({ type: "opsFilter", value: f })}
            className={cn(
              "relative h-9 flex-1 rounded-[10px] text-[13px] font-semibold transition-colors",
              filter === f ? "text-[#1A1206]" : "text-(--p-muted)",
            )}
          >
            {filter === f ? (
              <motion.span
                layoutId="ops-filter"
                className="absolute inset-0 rounded-[10px] bg-(--p-accent)"
                transition={{ duration: reduced ? 0 : 0.35, ease: brandMotion.ease.out }}
              />
            ) : null}
            <span className="relative">{f === "hepsi" ? "Hepsi" : STATUS[f].label}</span>
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 flex flex-col gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((c) => (
            <motion.div
              key={c.id}
              layout={!reduced}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: brandMotion.ease.out }}
              className="flex items-center gap-3 rounded-[18px] bg-(--p-card) p-3"
            >
              <div className="relative grid size-10 place-items-center rounded-full bg-(--p-card-2) text-[13px] font-bold">
                {c.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-(--p-card)"
                  style={{ background: STATUS[c.status].color }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-semibold">{c.name}</div>
                <div className="text-[12px] text-(--p-muted)">{c.detail}</div>
              </div>
              <Pill style={{ background: `${STATUS[c.status].color}22`, color: STATUS[c.status].color }}>
                {STATUS[c.status].label}
              </Pill>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {opsTabs("canli", go)}
    </ScreenBody>
  );
}

/* ───────────── Paket listesi ───────────── */

const PKG_COLOR: Record<string, string> = {
  Yolda: "#FFB547",
  Hazırlanıyor: "#45E0F0",
  "Teslim edildi": "#3DDC97",
};

export function OpsPaketler({ state, dispatch, go, reduced }: ScreenProps) {
  return (
    <ScreenBody withTabs>
      <Brand />
      <LargeTitle title="Paketler" />
      <div className="mx-4 flex gap-2 text-[13px] font-semibold">
        <span className="rounded-full bg-(--p-text) px-3.5 py-[7px] text-(--p-bg)">Açık · 3</span>
        <span className="rounded-full bg-(--p-card) px-3.5 py-[7px] text-(--p-muted)">Tamamlanan · 1</span>
      </div>
      <div className="mx-4 mt-3 flex flex-col gap-2">
        {demoPackages.map((p) => {
          const open = state.openPackage === p.id;
          const color = PKG_COLOR[p.status] ?? "#A3ADBD";
          return (
            <button
              key={p.id}
              type="button"
              data-demo={`package-${p.id}`}
              onClick={() => dispatch({ type: "togglePackage", id: p.id })}
              aria-expanded={open}
              className={cn(
                "rounded-[18px] bg-(--p-card) p-3.5 text-left transition-colors",
                open && "ring-1 ring-(--p-accent)/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-(--p-muted)">#{p.id}</span>
                <Pill style={{ background: `${color}22`, color }}>{p.status}</Pill>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[14.5px] font-semibold">
                {p.from}
                <span className="text-(--p-muted)">→</span>
                {p.to}
              </div>
              <div className="mt-1 flex items-center justify-between text-[12px] text-(--p-muted)">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {p.courier}
                </span>
                <span className="flex items-center gap-1 tabular-nums">
                  <Clock size={12} />
                  {p.minutes} dk
                  <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
                </span>
              </div>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: brandMotion.ease.out }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex flex-col gap-2 border-t border-(--p-line) pt-3 text-[12.5px]">
                      <div className="flex items-center gap-2">
                        <Store size={13} className="text-(--p-accent)" />
                        <span className="flex-1">Restoran onayı</span>
                        <span className="text-(--p-muted)">09:37</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-(--p-muted)" />
                        <span className="flex-1">Önerilen kurye: Selin D. (müsait)</span>
                        <span className="rounded-full bg-(--p-accent) px-2.5 py-1 text-[11.5px] font-semibold text-[#1A1206]">Ata</span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
      {opsTabs("paketler", go)}
    </ScreenBody>
  );
}

/* ───────────── Vardiya planı ───────────── */

const HOURS = [10, 12, 14, 16, 18, 20, 22];
const SHIFTS: { name: string; blocks: [number, number, "aktif" | "mola" | "plan"][] }[] = [
  { name: "Ahmet K.", blocks: [[10, 15, "aktif"], [15, 15.5, "mola"], [15.5, 18, "aktif"]] },
  { name: "Selin D.", blocks: [[11, 17, "aktif"]] },
  { name: "Mert Y.", blocks: [[12, 16, "aktif"], [16, 16.5, "mola"], [16.5, 20, "plan"]] },
  { name: "Zeynep Ö.", blocks: [[10, 13, "aktif"], [13, 13.5, "mola"], [13.5, 16, "aktif"]] },
  { name: "Emre T.", blocks: [[16, 23, "plan"]] },
  { name: "Burak A.", blocks: [[17, 24, "plan"]] },
];

export function OpsVardiya({ go, reduced }: ScreenProps) {
  const start = 10;
  const end = 24;
  const pct = (h: number) => ((h - start) / (end - start)) * 100;
  const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  return (
    <ScreenBody withTabs>
      <Brand />
      <LargeTitle title="Vardiya planı" />
      <div className="mx-4 flex gap-1.5">
        {days.map((d, i) => (
          <div
            key={d}
            className={cn(
              "flex h-[54px] flex-1 flex-col items-center justify-center rounded-[14px] text-[11.5px] font-semibold",
              i === 1 ? "bg-(--p-accent) text-[#1A1206]" : "bg-(--p-card) text-(--p-muted)",
            )}
          >
            {d}
            <span className="text-[15px] font-bold">{2 + i}</span>
          </div>
        ))}
      </div>

      <Card className="mx-4 mt-3 px-3 pb-3 pt-3">
        <div className="relative ml-[72px] h-4 text-[10px] text-(--p-muted)">
          {HOURS.map((h) => (
            <span key={h} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${pct(h)}%` }}>
              {h}
            </span>
          ))}
        </div>
        <div className="mt-1 flex flex-col gap-2">
          {SHIFTS.map((s, row) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="w-[64px] shrink-0 truncate text-[12px] font-medium">{s.name}</span>
              <div className="relative h-[24px] flex-1 rounded-[7px] bg-(--p-card-2)">
                {s.blocks.map(([a, b, kind], i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-y-[3px] rounded-[5px]"
                    style={{
                      left: `${pct(a)}%`,
                      width: `${pct(b) - pct(a)}%`,
                      originX: 0,
                      background:
                        kind === "aktif"
                          ? "var(--p-accent)"
                          : kind === "mola"
                            ? "#8F9BB0"
                            : "repeating-linear-gradient(135deg, rgba(255,181,71,0.35) 0 4px, rgba(255,181,71,0.15) 4px 8px)",
                    }}
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 + row * 0.06, ease: brandMotion.ease.out }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3 text-[11px] text-(--p-muted)">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-[2px] bg-(--p-accent)" />
            Aktif
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-[2px] bg-[#8F9BB0]" />
            Mola
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-[2px] bg-(--p-accent)/40" />
            Planlı
          </span>
        </div>
      </Card>

      <Card className="mx-4 mt-3 flex items-center gap-3 p-4">
        <div className="grid size-10 place-items-center rounded-full bg-(--p-accent)/15 text-(--p-accent)">
          <Clock size={18} />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">Yoğun saat: 19:00–21:00</div>
          <div className="text-[12px] text-(--p-muted)">Planlı kapasite 4 kurye · örnek plan</div>
        </div>
      </Card>
      {opsTabs("vardiya", go)}
    </ScreenBody>
  );
}

/* ───────────── Günlük rapor ───────────── */

const HOURLY = [4, 7, 12, 9, 6, 5, 8, 11, 16, 19, 14, 9, 5];

export function OpsRapor({ go, reduced }: ScreenProps) {
  const max = Math.max(...HOURLY);
  const W = 326;
  const H = 150;
  const bw = W / HOURLY.length;
  const peak = HOURLY.indexOf(max);
  const line = HOURLY.map((v, i) => {
    const avg = 18 + Math.round((v / max) * 9);
    return `${i ? "L" : "M"}${i * bw + bw / 2} ${H - (avg / 30) * H}`;
  }).join(" ");
  return (
    <ScreenBody withTabs>
      <Brand />
      <LargeTitle
        title="Günlük rapor"
        right={<span className="mb-1 rounded-full bg-(--p-card-2) px-3 py-1.5 text-[11.5px] font-semibold text-(--p-muted)">Örnek veri</span>}
      />
      <div className="mx-4 grid grid-cols-3 gap-2.5">
        {[
          { label: "Paket", value: String(HOURLY.reduce((a, b) => a + b, 0)) },
          { label: "Ort. teslim", value: "23 dk" },
          { label: "Aktif kurye", value: "6" },
        ].map((k) => (
          <Card key={k.label} className="p-3.5">
            <div className="text-[11.5px] font-semibold text-(--p-muted)">{k.label}</div>
            <div className="mt-1 text-[22px] font-bold tracking-[-0.03em] tabular-nums">{k.value}</div>
          </Card>
        ))}
      </div>

      <Card className="mx-4 mt-3 p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[14px] font-semibold">Saatlik paket</div>
          <div className="text-[11.5px] text-(--p-muted)">10:00–23:00</div>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 22}`} className="mt-3 w-full" aria-hidden>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--p-line)" strokeDasharray="2 4" />
          ))}
          {HOURLY.map((v, i) => {
            const h = (v / max) * (H - 8);
            return (
              <motion.rect
                key={i}
                x={i * bw + 3}
                width={bw - 6}
                rx="4"
                fill={i === peak ? "var(--p-accent)" : "rgba(255,181,71,0.32)"}
                initial={reduced ? false : { y: H, height: 0 }}
                animate={{ y: H - h, height: h }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.04, ease: brandMotion.ease.out }}
              />
            );
          })}
          <motion.path
            d={line}
            fill="none"
            stroke="#E9EEF5"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: brandMotion.ease.inOut }}
          />
          {HOURLY.map((_, i) =>
            i % 3 === 0 ? (
              <text key={i} x={i * bw + bw / 2} y={H + 16} fontSize="10" textAnchor="middle" fill="var(--p-muted)">
                {10 + i}
              </text>
            ) : null,
          )}
        </svg>
        <div className="mt-2 flex gap-4 text-[11px] text-(--p-muted)">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-[2px] bg-(--p-accent)" />
            Paket / saat
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-3 rounded bg-[#E9EEF5]" />
            Ort. teslim süresi
          </span>
        </div>
      </Card>

      <Card className="mx-4 mt-3 p-1.5">
        {[
          { n: "Ahmet K.", v: 14 },
          { n: "Mert Y.", v: 12 },
          { n: "Selin D.", v: 11 },
        ].map((r, i) => (
          <div key={r.n} className={cn("flex items-center gap-3 px-2.5 py-2.5 text-[13.5px]", i > 0 && "border-t border-(--p-line)")}>
            <span className="w-4 font-mono text-[12px] text-(--p-muted)">{i + 1}</span>
            <span className="flex-1 font-medium">{r.n}</span>
            <span className="tabular-nums text-(--p-muted)">{r.v} paket</span>
          </div>
        ))}
      </Card>
      {opsTabs("rapor", go)}
    </ScreenBody>
  );
}
