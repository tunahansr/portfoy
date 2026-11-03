"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Bike,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  CreditCard,
  House,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Star,
  User,
  type LucideIcon,
  Beef,
  Pizza,
  Sandwich,
  IceCreamCone,
  CupSoda,
  Salad,
  Banknote,
} from "lucide-react";
import { demoAddresses, demoMenu, demoRestaurants } from "@/data/mobile-apps";
import { motion as brandMotion } from "@/lib/brand";
import { Card, NavHeader, PrimaryButton, ScreenBody, TabBar, cn, type ScreenProps, HOME_H } from "../kit";
import { cartCount, cartTotal, formatTL } from "../state";
import { MapCanvas, ROUTE_CUSTOMER } from "../MapCanvas";

const restaurantIcons: Record<string, LucideIcon> = {
  beef: Beef,
  pizza: Pizza,
  sandwich: Sandwich,
  "ice-cream": IceCreamCone,
};
const menuIcons: Record<string, LucideIcon> = {
  "izgara-kofte": Beef,
  "kofte-ekmek": Sandwich,
  piyaz: Salad,
  ayran: CupSoda,
};

function customerTabs(active: string, go: (v: string) => void, badge?: number) {
  return (
    <TabBar
      active={active}
      onSelect={(id) => go(id === "siparis" ? "takip" : id === "ara" || id === "profil" ? "kesfet" : id)}
      items={[
        { id: "kesfet", label: "Keşfet", icon: House },
        { id: "ara", label: "Ara", icon: Search },
        { id: "siparis", label: "Siparişler", icon: Receipt, badge },
        { id: "profil", label: "Profil", icon: User },
      ]}
    />
  );
}

function RestaurantArt({ tone, icon, size = 64, radius = 16 }: { tone: string; icon: string; size?: number; radius?: number }) {
  const Icon = restaurantIcons[icon] ?? Beef;
  return (
    <div
      className="relative grid shrink-0 place-items-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `radial-gradient(120% 90% at 20% 15%, ${tone}55, transparent 60%), linear-gradient(145deg, ${tone}, ${tone}cc 55%, #2a1a10)`,
      }}
    >
      <div className="absolute -bottom-3 -right-3 size-10 rounded-full bg-white/15" />
      <Icon size={size * 0.42} color="#fff" strokeWidth={1.8} />
    </div>
  );
}

/* ───────────── Keşfet ───────────── */

export function MusteriKesfet({ state, dispatch, go }: ScreenProps) {
  const chips = ["Tümü", "Köfte", "Pide", "Burger", "Tatlı", "Kahve"];
  return (
    <ScreenBody withTabs>
      <div className="flex items-center justify-between px-5 pt-2">
        <div>
          <div className="text-[12px] font-medium text-(--p-muted)">Teslimat adresi</div>
          <div className="flex items-center gap-1 text-[15px] font-semibold">
            <MapPin size={15} className="text-(--p-accent)" strokeWidth={2.4} />
            {demoAddresses.customerShort}
            <ChevronDown size={15} className="text-(--p-muted)" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => go("bildirim")}
          aria-label="Bildirimler"
          className="relative grid size-10 place-items-center rounded-full bg-(--p-card) shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
          <Bell size={19} />
          <span className="absolute right-[10px] top-[9px] size-2 rounded-full bg-[#FF4D4F] ring-2 ring-(--p-card)" />
        </button>
      </div>

      <div className="px-5 pt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.03em]">
        Bugün ne
        <br />
        yesek?
      </div>

      <div className="mx-5 mt-4 flex h-[46px] items-center gap-2.5 rounded-[14px] bg-(--p-card) px-4 text-[15px] text-(--p-muted) shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <Search size={18} />
        Restoran veya yemek ara
      </div>

      <div className="mt-4 flex gap-2 overflow-hidden px-5">
        {chips.map((c, i) => (
          <span
            key={c}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-[7px] text-[13px] font-semibold",
              i === 0 ? "bg-(--p-text) text-(--p-bg)" : "bg-(--p-card) text-(--p-text)",
            )}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="flex items-baseline justify-between px-5 pb-2.5 pt-5">
        <div className="text-[17px] font-bold tracking-[-0.02em]">Yakınındakiler</div>
        <div className="text-[13px] font-semibold text-(--p-muted)">Tümü</div>
      </div>

      <div className="flex flex-col gap-2.5 px-4">
        {demoRestaurants.map((r) => (
          <button
            key={r.id}
            type="button"
            data-demo={`restaurant-${r.id}`}
            onClick={() => {
              dispatch({ type: "selectRestaurant", id: r.id });
              go("menu");
            }}
            className="flex items-center gap-3 rounded-[20px] bg-(--p-card) p-2.5 pr-3.5 text-left shadow-[0_1px_0_rgba(0,0,0,0.03),0_8px_24px_-14px_rgba(0,0,0,0.2)] transition-transform active:scale-[0.98]"
          >
            <RestaurantArt tone={r.tone} icon={r.icon} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-[15.5px] font-semibold tracking-[-0.01em]">{r.name}</div>
                <div className="flex items-center gap-[3px] text-[12.5px] font-semibold">
                  <Star size={12} fill="#FFB547" stroke="#FFB547" />
                  {r.rating}
                </div>
              </div>
              <div className="truncate text-[12.5px] text-(--p-muted)">{r.cuisine}</div>
              <div className="mt-1.5 flex items-center gap-2 text-[11.5px] font-medium text-(--p-muted)">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {r.eta}
                </span>
                <span className="size-[3px] rounded-full bg-(--p-muted)/60" />
                <span className="font-semibold text-[#0E8A63]">Ücretsiz teslimat</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {customerTabs("kesfet", go, state.orderPlaced && state.trackStage < 3 ? 1 : undefined)}
    </ScreenBody>
  );
}

/* ───────────── Menü ───────────── */

export function MusteriMenu({ state, dispatch, go, reduced }: ScreenProps) {
  const r = demoRestaurants.find((x) => x.id === state.restaurantId) ?? demoRestaurants[0];
  const count = cartCount(state.cart);
  const total = cartTotal(state.cart);
  return (
    <ScreenBody className="!pt-0">
      <div
        className="relative h-[214px]"
        style={{
          background: `radial-gradient(90% 80% at 80% 10%, ${r.tone}66, transparent 60%), linear-gradient(180deg, ${r.tone}40, transparent)`,
        }}
      >
        <button
          type="button"
          onClick={() => go("kesfet")}
          aria-label="Geri"
          className="absolute left-4 top-[58px] grid size-9 place-items-center rounded-full bg-(--p-card) shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div className="absolute bottom-0 left-5 translate-y-1/3">
          <RestaurantArt tone={r.tone} icon={r.icon} size={84} radius={24} />
        </div>
      </div>
      <div className="px-5 pt-10">
        <div className="text-[24px] font-bold tracking-[-0.03em]">{r.name}</div>
        <div className="mt-1 flex items-center gap-2 text-[13px] text-(--p-muted)">
          <span className="flex items-center gap-1 font-semibold text-(--p-text)">
            <Star size={13} fill="#FFB547" stroke="#FFB547" />
            {r.rating}
          </span>
          <span>·</span>
          <span>{r.eta}</span>
          <span>·</span>
          <span>Min. {formatTL(100)}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-5 border-b border-(--p-line) px-5 text-[14px] font-semibold">
        <span className="border-b-2 border-(--p-accent) pb-2.5">Popüler</span>
        <span className="pb-2.5 text-(--p-muted)">Ana yemek</span>
        <span className="pb-2.5 text-(--p-muted)">İçecek</span>
      </div>
      <div className="flex flex-col">
        {demoMenu.map((m) => {
          const q = state.cart[m.id] ?? 0;
          const Icon = menuIcons[m.id] ?? Beef;
          return (
            <div key={m.id} className="flex items-center gap-3 border-b border-(--p-line) px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold tracking-[-0.01em]">{m.name}</div>
                <div className="truncate text-[12.5px] text-(--p-muted)">{m.detail}</div>
                <div className="mt-1 text-[14px] font-semibold">{formatTL(m.price)}</div>
              </div>
              <div className="relative">
                <div className="grid size-[68px] place-items-center rounded-[16px] bg-(--p-card-2)">
                  <Icon size={28} className="text-(--p-muted)" strokeWidth={1.6} />
                </div>
                <button
                  type="button"
                  data-demo={`add-${m.id}`}
                  onClick={() => dispatch({ type: "cartAdd", itemId: m.id })}
                  aria-label={`${m.name} sepete ekle`}
                  className={cn(
                    "absolute -bottom-2 -right-2 grid size-[34px] place-items-center rounded-full text-[14px] font-bold shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)] transition-transform active:scale-90",
                    q ? "bg-(--p-accent) text-(--p-on-accent)" : "bg-(--p-card) text-(--p-text)",
                  )}
                >
                  {q ? q : <Plus size={18} strokeWidth={2.6} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {count > 0 ? (
          <motion.div
            className="absolute inset-x-0 bottom-0 px-4"
            style={{ paddingBottom: HOME_H }}
            initial={reduced ? { opacity: 0 } : { y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: brandMotion.ease.out }}
          >
            <button
              type="button"
              data-demo="go-cart"
              onClick={() => go("sepet")}
              className="flex h-[58px] w-full items-center gap-3 rounded-[20px] bg-(--p-text) px-4 text-(--p-bg) shadow-[0_16px_32px_-12px_rgba(0,0,0,0.45)]"
            >
              <span className="relative grid size-9 place-items-center rounded-full bg-(--p-accent) text-(--p-on-accent)">
                <ShoppingBag size={17} strokeWidth={2.3} />
                <motion.span
                  key={count}
                  initial={reduced ? false : { scale: 1.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-white px-1 text-[10.5px] font-bold text-[#17140F]"
                >
                  {count}
                </motion.span>
              </span>
              <span className="flex-1 text-left text-[15.5px] font-semibold">Sepete git</span>
              <span className="text-[15.5px] font-semibold tabular-nums">{formatTL(total)}</span>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ScreenBody>
  );
}

/* ───────────── Sepet ───────────── */

function Summary({ total }: { total: number }) {
  return (
    <div className="flex flex-col gap-2 text-[14px]">
      <div className="flex justify-between text-(--p-muted)">
        <span>Ara toplam</span>
        <span className="tabular-nums text-(--p-text)">{formatTL(total)}</span>
      </div>
      <div className="flex justify-between text-(--p-muted)">
        <span>Teslimat</span>
        <span className="font-semibold text-[#0E8A63]">Ücretsiz</span>
      </div>
      <div className="mt-1 flex justify-between border-t border-dashed border-(--p-line) pt-3 text-[16px] font-bold">
        <span>Toplam</span>
        <span className="tabular-nums">{formatTL(total)}</span>
      </div>
    </div>
  );
}

export function MusteriSepet({ state, dispatch, go }: ScreenProps) {
  const r = demoRestaurants.find((x) => x.id === state.restaurantId) ?? demoRestaurants[0];
  const items = demoMenu.filter((m) => (state.cart[m.id] ?? 0) > 0);
  const total = cartTotal(state.cart);
  return (
    <ScreenBody>
      <NavHeader title="Sepetim" subtitle={r.name} onBack={() => go("menu")} />
      <div className="flex flex-col gap-3 px-4 pt-2">
        <Card className="p-1.5">
          {items.length === 0 ? (
            <div className="px-3 py-6 text-center text-[14px] text-(--p-muted)">Sepetin şu an boş.</div>
          ) : (
            items.map((m, i) => {
              const Icon = menuIcons[m.id] ?? Beef;
              return (
                <div key={m.id} className={cn("flex items-center gap-3 px-2.5 py-3", i > 0 && "border-t border-(--p-line)")}>
                  <div className="grid size-12 place-items-center rounded-[14px] bg-(--p-card-2)">
                    <Icon size={22} className="text-(--p-muted)" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold">{m.name}</div>
                    <div className="text-[13px] tabular-nums text-(--p-muted)">{formatTL(m.price * (state.cart[m.id] ?? 0))}</div>
                  </div>
                  <div className="flex h-9 items-center rounded-full bg-(--p-card-2) px-1">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "cartRemove", itemId: m.id })}
                      aria-label={`${m.name} azalt`}
                      className="grid size-7 place-items-center rounded-full"
                    >
                      <Minus size={15} strokeWidth={2.4} />
                    </button>
                    <span className="w-5 text-center text-[14px] font-bold tabular-nums">{state.cart[m.id]}</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "cartAdd", itemId: m.id })}
                      aria-label={`${m.name} artır`}
                      className="grid size-7 place-items-center rounded-full bg-(--p-card)"
                    >
                      <Plus size={15} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="grid size-10 place-items-center rounded-full bg-(--p-accent)/20 text-[#B5740F]">
            <Bike size={19} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold">Tahmini teslimat</div>
            <div className="text-[12.5px] text-(--p-muted)">{r.eta} · {demoAddresses.customerShort}</div>
          </div>
        </Card>
        <Card className="p-4">
          <Summary total={total} />
        </Card>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4" style={{ paddingBottom: HOME_H }}>
        <PrimaryButton demo="checkout" onClick={() => go("onay")} disabled={items.length === 0}>
          Ödemeye geç
        </PrimaryButton>
      </div>
    </ScreenBody>
  );
}

/* ───────────── Sipariş onayı ───────────── */

export function MusteriOnay({ state, dispatch, go }: ScreenProps) {
  const total = cartTotal(state.cart);
  const count = cartCount(state.cart);
  return (
    <ScreenBody>
      <NavHeader title="Siparişi onayla" subtitle={`${count} ürün`} onBack={() => go("sepet")} />
      <div className="flex flex-col gap-3 px-4 pt-2">
        <Card className="overflow-hidden">
          <div className="h-[92px] overflow-hidden">
            <MapCanvas tone="light" route={ROUTE_CUSTOMER} progress={0} reduced accent="#FFB547" accent2="#45E0F0" height={150} courierIcon={false} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <MapPin size={18} className="text-(--p-accent)" strokeWidth={2.4} />
            <div className="flex-1">
              <div className="text-[14.5px] font-semibold">{demoAddresses.customerShort}</div>
              <div className="text-[12.5px] text-(--p-muted)">{demoAddresses.customer} · Örnek adres</div>
            </div>
            <span className="text-[13px] font-semibold text-(--p-muted)">Değiştir</span>
          </div>
        </Card>

        <Card className="p-1.5">
          {[
            { id: "kart", label: "Kapıda kartla ödeme", icon: CreditCard, on: true },
            { id: "nakit", label: "Kapıda nakit ödeme", icon: Banknote, on: false },
          ].map((o, i) => (
            <div key={o.id} className={cn("flex items-center gap-3 px-2.5 py-3", i > 0 && "border-t border-(--p-line)")}>
              <o.icon size={19} className="text-(--p-muted)" />
              <span className="flex-1 text-[14.5px] font-medium">{o.label}</span>
              <span
                className={cn(
                  "grid size-[22px] place-items-center rounded-full border-2",
                  o.on ? "border-(--p-accent) bg-(--p-accent)" : "border-(--p-line)",
                )}
              >
                {o.on ? <Check size={13} strokeWidth={3.2} color="#1A1206" /> : null}
              </span>
            </div>
          ))}
        </Card>

        <Card className="p-4">
          <Summary total={total} />
        </Card>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4" style={{ paddingBottom: HOME_H }}>
        <PrimaryButton
          demo="place-order"
          onClick={() => {
            dispatch({ type: "placeOrder" });
            go("takip");
          }}
        >
          Siparişi ver · {formatTL(total)}
        </PrimaryButton>
      </div>
    </ScreenBody>
  );
}

/* ───────────── Canlı takip ───────────── */

const STAGES = ["Alındı", "Hazırlanıyor", "Yolda", "Teslim edildi"];
const STAGE_PROGRESS = [0, 0, 0.62, 1];

export function MusteriTakip({ app, state, go, reduced, dispatch }: ScreenProps) {
  const stage = state.trackStage;
  const done = stage >= 3;
  const r = demoRestaurants.find((x) => x.id === state.restaurantId) ?? demoRestaurants[0];
  return (
    <ScreenBody className="!pt-0">
      <div className="absolute inset-x-0 top-0 h-[470px]">
        <MapCanvas
          tone="light"
          route={ROUTE_CUSTOMER}
          progress={STAGE_PROGRESS[stage]}
          reduced={reduced}
          accent={app.accentHex}
          accent2={app.secondaryHex}
          height={470}
        />
        <button
          type="button"
          onClick={() => go("kesfet")}
          aria-label="Geri"
          className="absolute left-4 top-[58px] grid size-9 place-items-center rounded-full bg-(--p-card) shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div className="absolute right-4 top-[58px] rounded-full bg-(--p-card) px-3 py-2 text-[12px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
          <span className="mr-1.5 inline-block size-2 animate-[pulse-soft_1.6s_ease-in-out_infinite] rounded-full bg-[#0E8A63] align-middle" />
          Canlı
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[30px] bg-(--p-bg) px-5 pt-3 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]"
        style={{ paddingBottom: HOME_H + 6 }}
      >
        <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-(--p-line)" />
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[13px] font-medium text-(--p-muted)">{done ? "Afiyet olsun" : "Tahmini varış"}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: brandMotion.ease.out }}
                className="text-[28px] font-bold tracking-[-0.03em]"
              >
                {done ? "Teslim edildi" : ["24 dk", "18 dk", "7 dk"][stage]}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-right text-[12px] text-(--p-muted)">
            {r.name}
            <br />
            Sipariş #Y-2041
          </div>
        </div>

        {/* durum adımları */}
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {STAGES.map((s, i) => (
            <div key={s}>
              <div className="h-[5px] overflow-hidden rounded-full bg-(--p-line)">
                <motion.div
                  className="h-full rounded-full bg-(--p-accent)"
                  initial={false}
                  animate={{ width: i <= stage ? "100%" : "0%" }}
                  transition={{ duration: reduced ? 0 : 0.6, ease: brandMotion.ease.out }}
                />
              </div>
              <div className={cn("mt-1.5 text-[11px] font-semibold leading-tight", i <= stage ? "text-(--p-text)" : "text-(--p-muted)")}>
                {s}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-(--p-card) p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="grid size-11 place-items-center rounded-full bg-[#17140F] text-[14px] font-bold text-white">AK</div>
          <div className="flex-1">
            <div className="text-[14.5px] font-semibold">Ahmet · Kuryen</div>
            <div className="flex items-center gap-1 text-[12.5px] text-(--p-muted)">
              {stage >= 2 ? <Bike size={13} /> : <Package size={13} />}
              {stage < 2 ? "Restoranda bekliyor" : done ? "Teslimatı tamamladı" : "Sana doğru geliyor"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "trackAdvance" })}
            aria-label="Kuryeyi ara (demo: durumu ilerletir)"
            className="grid size-10 place-items-center rounded-full bg-(--p-accent) text-(--p-on-accent)"
          >
            <Phone size={17} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </ScreenBody>
  );
}

/* ───────────── Bildirim ───────────── */

export function MusteriBildirim({ state, dispatch, go, reduced }: ScreenProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 50% at 15% 20%, rgba(255,181,71,0.55), transparent 60%), radial-gradient(70% 50% at 90% 75%, rgba(69,224,240,0.45), transparent 60%), linear-gradient(180deg, #1B1408, #0B1220 70%)",
      }}
    >
      <div className="pt-[86px] text-center">
        <div className="text-[18px] font-semibold text-white/80">Salı, 3 Kasım</div>
        <div className="text-[96px] font-semibold leading-none tracking-[-0.04em] text-white/95">09:41</div>
      </div>

      <div className="absolute inset-x-3 top-[330px]">
        <motion.button
          type="button"
          data-demo="notification"
          onClick={() => {
            if (state.notificationRead) go("kesfet");
            else dispatch({ type: "readNotification" });
          }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.35, ease: brandMotion.ease.out }}
          className="block w-full rounded-[24px] bg-white/18 p-3.5 text-left backdrop-blur-2xl"
          style={{ background: "rgba(245,245,250,0.16)" }}
        >
          <div className="flex items-start gap-3">
            <div className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-[#FFB547] text-[19px] font-black text-[#1A1206]">
              Y
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[13px] text-white/70">
                <span className="font-semibold uppercase tracking-[0.04em]">Yedinizmi</span>
                <span>şimdi</span>
              </div>
              <div className="text-[15px] font-semibold">Siparişin teslim edildi</div>
              <div className="text-[14px] leading-snug text-white/85">Köfteci Usta siparişin kapına ulaştı. Afiyet olsun!</div>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {state.notificationRead ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: brandMotion.ease.out }}
                className="overflow-hidden"
              >
                <div className="mt-3 border-t border-white/15 pt-3">
                  <div className="text-[13px] text-white/75">Deneyimini puanla</div>
                  <div className="mt-1.5 flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={26} fill="#FFB547" stroke="#FFB547" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.button>
        <div className="mx-auto mt-2 w-[92%] rounded-[20px] bg-white/10 px-4 py-3 text-[13px] text-white/70 backdrop-blur-xl">
          <span className="font-semibold uppercase tracking-[0.04em]">Yedinizmi</span> · Kuryen yola çıktı
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[54px] flex justify-between px-12">
        {[ShoppingBag, Bell].map((I, i) => (
          <span key={i} className="grid size-[50px] place-items-center rounded-full bg-white/12 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.12)" }}>
            <I size={21} />
          </span>
        ))}
      </div>
    </div>
  );
}
