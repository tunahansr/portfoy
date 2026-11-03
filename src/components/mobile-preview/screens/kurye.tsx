"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Bike,
  Camera,
  Check,
  CircleCheck,
  Clock,
  CornerUpRight,
  MapPin,
  Navigation,
  Package,
  Power,
  Route,
  Store,
  User,
  Wallet,
} from "lucide-react";
import { demoAddresses } from "@/data/mobile-apps";
import { motion as brandMotion } from "@/lib/brand";
import { Card, HOME_H, LargeTitle, NavHeader, PrimaryButton, ScreenBody, TabBar, cn, type ScreenProps } from "../kit";
import { MapCanvas, ROUTE_COURIER } from "../MapCanvas";

function courierTabs(active: string, go: (v: string) => void, badge?: number) {
  return (
    <TabBar
      active={active}
      onSelect={(id) => go(id === "profil" ? "vardiya" : id)}
      items={[
        { id: "vardiya", label: "Vardiya", icon: Power },
        { id: "havuz", label: "Görevler", icon: Package, badge },
        { id: "rota", label: "Rota", icon: Navigation },
        { id: "profil", label: "Profil", icon: User },
      ]}
    />
  );
}

/* ───────────── Vardiya ───────────── */

export function KuryeVardiya({ state, dispatch, go, reduced }: ScreenProps) {
  const on = state.online;
  return (
    <ScreenBody withTabs>
      <LargeTitle
        kicker="İyi vardiyalar"
        title="Vardiya"
        right={
          <span
            className={cn(
              "mb-1 rounded-full px-3 py-1.5 text-[12px] font-semibold",
              on ? "bg-[#3DDC97]/15 text-[#3DDC97]" : "bg-(--p-card-2) text-(--p-muted)",
            )}
          >
            {on ? "Çevrimiçi" : "Çevrimdışı"}
          </span>
        }
      />

      <Card className="relative mx-4 overflow-hidden px-5 pb-6 pt-7 text-center">
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: on ? 1 : 0,
            background: "radial-gradient(60% 55% at 50% 38%, rgba(255,181,71,0.22), transparent 70%)",
          }}
        />
        <button
          type="button"
          data-demo="online-toggle"
          onClick={() => dispatch({ type: "setOnline", value: !on })}
          aria-pressed={on}
          aria-label={on ? "Çevrimdışı ol" : "Çevrimiçi ol"}
          className="relative mx-auto grid size-[150px] place-items-center rounded-full"
        >
          {on && !reduced ? (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-(--p-accent)"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.25, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          ) : null}
          <span
            className={cn(
              "absolute inset-0 rounded-full border transition-colors duration-500",
              on ? "border-(--p-accent)/60" : "border-(--p-line)",
            )}
          />
          <span
            className={cn(
              "grid size-[118px] place-items-center rounded-full transition-all duration-500",
              on
                ? "bg-(--p-accent) text-(--p-on-accent) shadow-[0_0_60px_-6px_rgba(255,181,71,0.75)]"
                : "bg-(--p-card-2) text-(--p-muted)",
            )}
          >
            <Power size={46} strokeWidth={2.2} />
          </span>
        </button>
        <div className="relative mt-5 text-[19px] font-semibold tracking-[-0.02em]">
          {on ? "Görev almaya hazırsın" : "Görev almak için çevrimiçi ol"}
        </div>
        <div className="relative mt-1 text-[13px] text-(--p-muted)">Bölge: Ünye merkez · Vardiya 09:00–17:00</div>
      </Card>

      <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
        {[
          { icon: Package, label: "Teslimat", value: "6" },
          { icon: Clock, label: "Aktif süre", value: "3 sa 20 dk" },
          { icon: Route, label: "Mesafe", value: "18,4 km" },
        ].map((s) => (
          <Card key={s.label} className="p-3">
            <s.icon size={16} className="text-(--p-accent-2)" />
            <div className="mt-2 text-[15px] font-semibold tracking-[-0.01em]">{s.value}</div>
            <div className="text-[11.5px] text-(--p-muted)">{s.label}</div>
          </Card>
        ))}
      </div>
      <div className="mx-4 mt-1.5 text-[10.5px] text-(--p-muted)/80">Değerler örnek veridir.</div>

      <div className="mx-4 mt-3">
        <PrimaryButton demo="open-pool" onClick={() => go("havuz")} disabled={!on}>
          <Package size={18} strokeWidth={2.3} />
          Görev havuzunu aç
        </PrimaryButton>
      </div>
      {courierTabs("vardiya", go)}
    </ScreenBody>
  );
}

/* ───────────── Görev havuzu ───────────── */

export function KuryeHavuz({ dispatch, go, reduced, active }: ScreenProps) {
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <ScreenBody withTabs>
      <LargeTitle
        kicker="Ünye merkez"
        title="Görev havuzu"
        right={
          <span className="mb-1 flex items-center gap-1.5 rounded-full bg-(--p-accent)/15 px-3 py-1.5 text-[12px] font-semibold text-(--p-accent)">
            <span className="size-1.5 animate-[pulse-soft_1.4s_ease-in-out_infinite] rounded-full bg-(--p-accent)" />1 yeni
          </span>
        }
      />
      <motion.div
        initial={reduced ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: brandMotion.ease.out }}
        className="mx-4 rounded-[24px] border border-(--p-accent)/40 bg-(--p-card) p-4 shadow-[0_20px_50px_-20px_rgba(255,181,71,0.45)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-(--p-accent)">Yeni teslimat</div>
            <div className="mt-0.5 text-[20px] font-bold tracking-[-0.02em]">2,4 km · ~14 dk</div>
          </div>
          <div className="relative grid size-[56px] place-items-center">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r={R} fill="none" stroke="var(--p-line)" strokeWidth="4" />
              <motion.circle
                cx="28"
                cy="28"
                r={R}
                fill="none"
                stroke="var(--p-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: reduced || !active ? C * 0.3 : C * 0.85 }}
                transition={{ duration: reduced ? 0 : 20, ease: "linear" }}
              />
            </svg>
            <span className="absolute flex flex-col items-center leading-none">
              <span className="text-[15px] font-bold tabular-nums">18</span>
              <span className="text-[9px] font-semibold text-(--p-muted)">sn</span>
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-0">
          <Stop icon={Store} label="Restoran" title="Köfteci Usta" sub="Ünye merkez · hazır" accent />
          <div className="ml-[15px] h-4 border-l-2 border-dashed border-(--p-line)" />
          <Stop icon={MapPin} label="Müşteri" title={demoAddresses.customer} sub="Kapıda teslim" />
        </div>
        <div className="mt-4 flex gap-2.5">
          <button type="button" className="h-[50px] flex-1 rounded-[16px] bg-(--p-card-2) text-[15px] font-semibold text-(--p-muted)">
            Geç
          </button>
          <button
            type="button"
            data-demo="accept-task"
            onClick={() => {
              dispatch({ type: "acceptTask" });
              go("detay");
            }}
            className="h-[50px] flex-[2] rounded-[16px] bg-(--p-accent) text-[15.5px] font-semibold text-(--p-on-accent)"
          >
            Kabul et
          </button>
        </div>
      </motion.div>

      <div className="mx-5 mt-5 text-[13px] font-semibold text-(--p-muted)">Sırada</div>
      {[
        { from: "Deniz Pide", to: "Sahil Cd.", km: "3,1 km" },
        { from: "Tatlı Durağı", to: "Çarşı içi", km: "1,6 km" },
      ].map((t) => (
        <div key={t.from} className="mx-4 mt-2 flex items-center gap-3 rounded-[18px] bg-(--p-card) p-3.5 opacity-70">
          <div className="grid size-9 place-items-center rounded-full bg-(--p-card-2)">
            <Package size={16} className="text-(--p-muted)" />
          </div>
          <div className="flex-1 text-[14px]">
            <div className="font-semibold">{t.from}</div>
            <div className="text-[12px] text-(--p-muted)">{t.to}</div>
          </div>
          <span className="text-[13px] font-semibold tabular-nums text-(--p-muted)">{t.km}</span>
        </div>
      ))}
      {courierTabs("havuz", go, 1)}
    </ScreenBody>
  );
}

function Stop({
  icon: Icon,
  label,
  title,
  sub,
  accent,
}: {
  icon: typeof Store;
  label: string;
  title: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full",
          accent ? "bg-(--p-accent) text-(--p-on-accent)" : "bg-(--p-accent-2)/20 text-(--p-accent-2)",
        )}
      >
        <Icon size={15} strokeWidth={2.4} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--p-muted)">{label}</div>
        <div className="truncate text-[15px] font-semibold">{title}</div>
        <div className="text-[12px] text-(--p-muted)">{sub}</div>
      </div>
    </div>
  );
}

/* ───────────── Görev detayı ───────────── */

export function KuryeDetay({ app, go }: ScreenProps) {
  return (
    <ScreenBody>
      <NavHeader title="Görev #Y-2041" subtitle="Kabul edildi · 09:41" onBack={() => go("havuz")} />
      <div className="mx-4 mt-1 overflow-hidden rounded-[22px]">
        <MapCanvas
          tone="dark"
          route={ROUTE_COURIER}
          progress={0}
          reduced
          accent={app.accentHex}
          accent2={app.secondaryHex}
          height={230}
          viewBox="30 56 330 350"
          fit="meet"
        />
      </div>
      <Card className="mx-4 mt-3 p-4">
        <Stop icon={Store} label="1 · Teslim al" title="Köfteci Usta" sub="Ünye merkez · Paket hazır" accent />
        <div className="ml-[15px] h-5 border-l-2 border-dashed border-(--p-line)" />
        <Stop icon={MapPin} label="2 · Teslim et" title={demoAddresses.customer} sub="Kapı önünde teslim · zile basın" />
      </Card>
      <Card className="mx-4 mt-3 flex items-center justify-between p-4 text-[14px]">
        <div className="flex items-center gap-2.5">
          <Package size={18} className="text-(--p-accent-2)" />
          <div>
            <div className="font-semibold">2 ürün · Orta paket</div>
            <div className="text-[12px] text-(--p-muted)">Ödeme kapıda kartla</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-(--p-muted)">
          <Wallet size={15} />
          <span className="text-[13px]">Örnek</span>
        </div>
      </Card>
      <div className="absolute inset-x-0 bottom-0 px-4" style={{ paddingBottom: HOME_H }}>
        <PrimaryButton demo="start-route" onClick={() => go("rota")}>
          <Navigation size={18} strokeWidth={2.3} />
          Rotayı başlat
        </PrimaryButton>
      </div>
    </ScreenBody>
  );
}

/* ───────────── Navigasyon ───────────── */

export function KuryeRota({ app, state, go, reduced }: ScreenProps) {
  const near = state.navStage >= 1;
  return (
    <ScreenBody className="!pt-0 !bg-[#0E131C]">
      <div className="absolute inset-x-0 top-[110px] bg-[#0E131C]" style={{ bottom: 0 }}>
        <MapCanvas
          tone="dark"
          route={ROUTE_COURIER}
          progress={near ? 0.9 : 0.12}
          reduced={reduced}
          accent={app.accentHex}
          accent2={app.secondaryHex}
          height={560}
          viewBox="30 50 330 440"
        />
      </div>
      <div className="absolute inset-x-3 top-[58px] flex items-center gap-3 rounded-[22px] bg-[#0E7A55] p-4 text-white shadow-[0_16px_40px_-14px_rgba(0,0,0,0.6)]">
        <CornerUpRight size={34} strokeWidth={2.6} />
        <div className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={near ? "b" : "a"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <div className="text-[24px] font-bold leading-none tracking-[-0.02em]">{near ? "80 m" : "350 m"}</div>
              <div className="mt-1 text-[14px] text-white/85">{near ? "Sağa dön · Merkez Mah." : "Sağa dön · Sahil yolu"}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-(--p-bg)/95 px-5 pt-4 backdrop-blur-xl"
        style={{ paddingBottom: HOME_H }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[24px] font-bold tracking-[-0.02em] tabular-nums">{near ? "1 dk" : "6 dk"}</div>
            <div className="text-[13px] text-(--p-muted)">
              {near ? "0,1 km" : "1,9 km"} · {demoAddresses.customer}
            </div>
          </div>
          <div className="grid size-11 place-items-center rounded-full bg-(--p-card-2)">
            <Bike size={20} className="text-(--p-accent)" />
          </div>
        </div>
        <button
          type="button"
          data-demo="arrived"
          onClick={() => go("teslim")}
          className={cn(
            "mt-4 flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] text-[16px] font-semibold transition-colors",
            near ? "bg-(--p-accent) text-(--p-on-accent)" : "bg-(--p-card-2) text-(--p-text)",
          )}
        >
          <MapPin size={18} strokeWidth={2.3} />
          Adrese vardım
        </button>
      </div>
    </ScreenBody>
  );
}

/* ───────────── Teslim onayı ───────────── */

export function KuryeTeslim({ state, dispatch, go, reduced }: ScreenProps) {
  const done = state.delivered;
  return (
    <ScreenBody>
      <NavHeader title="Teslim onayı" subtitle="Görev #Y-2041" onBack={() => go("rota")} />
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: brandMotion.ease.out }}
            className="flex flex-col items-center px-8 pt-20 text-center"
          >
            <div className="relative grid size-[120px] place-items-center">
              <span className="absolute inset-0 rounded-full bg-[#3DDC97]/15" />
              <span className="absolute inset-4 rounded-full bg-[#3DDC97]/25" />
              <CircleCheck size={64} className="relative text-[#3DDC97]" strokeWidth={2} />
            </div>
            <div className="mt-6 text-[26px] font-bold tracking-[-0.03em]">Teslimat tamamlandı</div>
            <div className="mt-2 text-[14.5px] leading-relaxed text-(--p-muted)">
              Müşteriye bildirim gönderildi. Yeni görevler için havuzu kontrol edebilirsin.
            </div>
            <div className="mt-8 w-full">
              <PrimaryButton onClick={() => go("havuz")}>Görev havuzuna dön</PrimaryButton>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 pt-2">
            <Card className="p-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-(--p-muted)">Teslimat kodu</div>
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {["4", "8", "2", "7"].map((d, i) => (
                  <div
                    key={i}
                    className="grid h-[62px] place-items-center rounded-[16px] border border-(--p-accent)/50 bg-(--p-card-2) text-[26px] font-bold tabular-nums"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#3DDC97]">
                <Check size={15} strokeWidth={3} />
                Kod müşteri ile eşleşti
              </div>
            </Card>
            <Card className="mt-3 p-1.5">
              {[
                { icon: Package, t: "Paket sağlam teslim edildi", on: true },
                { icon: Camera, t: "Kapı fotoğrafı ekle (isteğe bağlı)", on: false },
              ].map((r, i) => (
                <div key={r.t} className={cn("flex items-center gap-3 px-2.5 py-3.5", i > 0 && "border-t border-(--p-line)")}>
                  <r.icon size={18} className="text-(--p-muted)" />
                  <span className="flex-1 text-[14px] font-medium">{r.t}</span>
                  <span
                    className={cn(
                      "grid size-[22px] place-items-center rounded-[7px] border-2",
                      r.on ? "border-(--p-accent) bg-(--p-accent)" : "border-(--p-line)",
                    )}
                  >
                    {r.on ? <Check size={13} strokeWidth={3.2} color="#1A1206" /> : null}
                  </span>
                </div>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {!done ? (
        <div className="absolute inset-x-0 bottom-0 px-4" style={{ paddingBottom: HOME_H }}>
          <PrimaryButton demo="confirm-delivery" onClick={() => dispatch({ type: "deliver" })}>
            <CircleCheck size={19} strokeWidth={2.3} />
            Teslim edildi olarak işaretle
          </PrimaryButton>
        </div>
      ) : null}
    </ScreenBody>
  );
}
