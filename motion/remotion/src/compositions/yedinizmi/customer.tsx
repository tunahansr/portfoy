import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { PHONE_SCREEN, StatusBar, Tap } from "../../lib/devices";
import { CityMap, kmLeft, minLeft } from "./map";
import { CheckBadge, FoodTile, Mono, PushScreen } from "./ui";

const BG = "#0D1220";
const PAD = 24;
const INNER = PHONE_SCREEN.width - PAD * 2;

/* ------------------------------------------------------------------ */
/* Sipariş akışı: ana sayfa → menü → onay (yerel kareler)              */
/* ------------------------------------------------------------------ */

export const ORDER_TAPS = { restaurant: 26, addFirst: 46, addSecond: 56, cart: 70 } as const;
const MENU_IN = 32;
const CONFIRM_IN = 76;

const RESTAURANTS = [
  { name: "Pide Salonu", meta: "Pide · Lahmacun · 25 dk", letter: "P", hue: colors.amber },
  { name: "Köfte Evi", meta: "Izgara · 30 dk", letter: "K", hue: "#E0784A" },
  { name: "Burger Atölyesi", meta: "Burger · 20 dk", letter: "B", hue: colors.cyan },
];

const HomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: colors.text, fontFamily: font.sans }}>
      <StatusBar />
      <div style={{ position: "absolute", left: PAD, top: 76, width: INNER }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 17, color: colors.textMuted }}>Merhaba</span>
          <span
            style={{
              fontSize: 15,
              padding: "6px 12px",
              borderRadius: 999,
              backgroundColor: alpha(colors.amber, 0.12),
              color: colors.amber,
            }}
          >
            Ev · Ünye
          </span>
        </div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 36, letterSpacing: "-0.02em", marginTop: 4 }}>
          Bugün ne yesek?
        </div>
        <div
          style={{
            marginTop: 18,
            height: 52,
            borderRadius: 16,
            backgroundColor: colors.surface2,
            border: `1px solid ${colors.line}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            fontSize: 17,
            color: colors.textDim,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <circle cx="8" cy="8" r="6" stroke={colors.textDim} strokeWidth="1.8" fill="none" />
            <path d="M12.5 12.5 L16 16" stroke={colors.textDim} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Restoran veya yemek ara
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {["Pide", "Izgara", "Burger", "Tatlı"].map((c, i) => (
            <span
              key={c}
              style={{
                fontSize: 16,
                fontWeight: 500,
                padding: "8px 16px",
                borderRadius: 999,
                backgroundColor: i === 0 ? colors.amber : colors.surface2,
                color: i === 0 ? colors.graphite : colors.textMuted,
              }}
            >
              {c}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 26, fontSize: 19, fontWeight: 600 }}>Yakınındaki restoranlar</div>
        {RESTAURANTS.map((r, i) => {
          const p = interpolate(frame, [i * 4, 16 + i * 4], [0, 1], { ...clamp, easing: easeOut });
          const pressed = i === 0 ? interpolate(frame, [ORDER_TAPS.restaurant - 4, ORDER_TAPS.restaurant, ORDER_TAPS.restaurant + 6], [1, 0.97, 1], clamp) : 1;
          return (
            <div
              key={r.name}
              style={{
                marginTop: 14,
                height: 112,
                borderRadius: 20,
                backgroundColor: colors.surface,
                border: `1px solid ${i === 0 && frame >= ORDER_TAPS.restaurant - 4 ? alpha(colors.amber, 0.5) : colors.line}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 12,
                opacity: p,
                translate: `0 ${(1 - p) * 18}px`,
                scale: pressed,
              }}
            >
              <FoodTile letter={r.letter} hue={r.hue} size={88} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 15, color: colors.textMuted, marginTop: 4 }}>{r.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Tap x={202} y={420} at={ORDER_TAPS.restaurant} />
    </AbsoluteFill>
  );
};

const MENU = [
  { name: "Kıymalı pide", desc: "Taş fırında, tereyağlı", price: 180 },
  { name: "Kaşarlı pide", desc: "Bol kaşarlı, ince hamur", price: 170 },
  { name: "Ayran", desc: "300 ml", price: 30 },
];

const MenuScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const firstAdded = frame >= ORDER_TAPS.addFirst;
  const secondAdded = frame >= ORDER_TAPS.addSecond;
  const count = (firstAdded ? 1 : 0) + (secondAdded ? 1 : 0);
  const total = (firstAdded ? 180 : 0) + (secondAdded ? 30 : 0);
  const cartY = interpolate(frame, [ORDER_TAPS.addFirst, ORDER_TAPS.addFirst + 12], [120, 0], {
    ...clamp,
    easing: easeOut,
  });
  const bump = interpolate(frame, [ORDER_TAPS.addSecond, ORDER_TAPS.addSecond + 4, ORDER_TAPS.addSecond + 10], [1, 1.04, 1], clamp);
  const rowTop = 300;
  const rowH = 96;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: colors.text, fontFamily: font.sans }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 230,
          background: `radial-gradient(circle at 75% 20%, ${alpha(colors.amber, 0.55)} 0%, ${alpha(
            "#C2562B",
            0.35,
          )} 40%, ${BG} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 18,
          top: 40,
          fontFamily: font.serif,
          fontSize: 200,
          lineHeight: 1,
          color: alpha(colors.text, 0.12),
        }}
      >
        P
      </div>
      <StatusBar />
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 70,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: alpha("#000000", 0.35),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M10 3 L5 8 L10 13" stroke={colors.text} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: PAD, top: 156, width: INNER }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em" }}>
          Pide Salonu
        </div>
        <div style={{ fontSize: 16, color: colors.textMuted, marginTop: 4 }}>Pide · Lahmacun · 25 dk</div>
      </div>
      <div style={{ position: "absolute", left: PAD, top: 262 }}>
        <Mono style={{ fontSize: 13, color: colors.textDim, letterSpacing: "0.16em" }}>POPÜLER</Mono>
      </div>
      {MENU.map((m, i) => {
        const added = (i === 0 && firstAdded) || (i === 2 && secondAdded);
        const tapAt = i === 0 ? ORDER_TAPS.addFirst : ORDER_TAPS.addSecond;
        const pop = interpolate(frame, [tapAt, tapAt + 4, tapAt + 10], [1, 1.18, 1], clamp);
        return (
          <div
            key={m.name}
            style={{
              position: "absolute",
              left: PAD,
              top: rowTop + i * rowH,
              width: INNER,
              height: rowH - 12,
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderBottom: `1px solid ${colors.line}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 3 }}>{m.desc}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6 }}>₺{m.price}</div>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: added ? colors.amber : colors.surface2,
                border: `1px solid ${added ? colors.amber : colors.lineStrong}`,
                color: added ? colors.graphite : colors.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: added ? 18 : 24,
                fontWeight: 600,
                scale: added ? pop : 1,
              }}
            >
              {added ? "1" : "+"}
            </div>
          </div>
        );
      })}
      {/* Sepet çubuğu */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 40,
          height: 64,
          borderRadius: 20,
          backgroundColor: colors.amber,
          color: colors.graphite,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          fontSize: 18,
          fontWeight: 600,
          translate: `0 ${cartY}%`,
          opacity: firstAdded ? 1 : 0,
          scale: bump,
          boxShadow: `0 16px 40px ${alpha(colors.amber, 0.3)}`,
        }}
      >
        <span>Sepeti onayla · {count} ürün</span>
        <span>₺{total}</span>
      </div>
      <Tap x={358} y={rowTop + 42} at={ORDER_TAPS.addFirst} />
      <Tap x={358} y={rowTop + 2 * rowH + 42} at={ORDER_TAPS.addSecond} />
      <Tap x={202} y={PHONE_SCREEN.height - 72} at={ORDER_TAPS.cart} color={colors.graphite} />
    </AbsoluteFill>
  );
};

const ConfirmScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - CONFIRM_IN;
  const textP = interpolate(local, [14, 28], [0, 1], { ...clamp, easing: easeOut });
  const pulse = (Math.sin(frame / 4) + 1) / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: colors.text, fontFamily: font.sans }}>
      <StatusBar />
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center" }}>
        <CheckBadge at={CONFIRM_IN + 6} size={124} />
      </div>
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: 372,
          textAlign: "center",
          opacity: textP,
          translate: `0 ${(1 - textP) * 12}px`,
        }}
      >
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em" }}>
          Siparişin alındı
        </div>
        <Mono style={{ display: "block", marginTop: 8, fontSize: 15, color: colors.textMuted }}>#1042 · Pide Salonu</Mono>
        <div
          style={{
            marginTop: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            backgroundColor: colors.surface2,
            fontSize: 16,
            color: colors.textMuted,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.amber,
              boxShadow: `0 0 ${6 + pulse * 8}px ${colors.amber}`,
            }}
          />
          Restoran onayı bekleniyor
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: 600,
          borderRadius: 20,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.line}`,
          padding: "18px 20px",
          fontSize: 17,
          opacity: interpolate(local, [20, 32], [0, 1], clamp),
        }}
      >
        {[
          ["Kıymalı pide × 1", "₺180"],
          ["Ayran × 1", "₺30"],
        ].map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", color: colors.textMuted, marginBottom: 10 }}>
            <span>{a}</span>
            <span>{b}</span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${colors.line}`,
            paddingTop: 12,
            fontWeight: 600,
          }}
        >
          <span>Toplam</span>
          <span>₺210</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CustomerOrderScreens: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <PushScreen inAt={-30} outAt={MENU_IN} background={BG}>
      <HomeScreen />
    </PushScreen>
    <PushScreen inAt={MENU_IN} outAt={CONFIRM_IN} background={BG}>
      <MenuScreen />
    </PushScreen>
    <PushScreen inAt={CONFIRM_IN} background={BG}>
      <ConfirmScreen />
    </PushScreen>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Müşteri canlı takip ekranı                                          */
/* ------------------------------------------------------------------ */

const TRACK_STEPS = ["Onaylandı", "Hazırlandı", "Yolda", "Teslim"];

export const CustomerTrackingScreen: React.FC<{
  readonly progress: number;
  readonly delivered: number;
  readonly globalFrame: number;
}> = ({ progress, delivered, globalFrame }) => {
  const doneP = interpolate(delivered, [0, 1], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: colors.text, fontFamily: font.sans }}>
      <CityMap progress={progress} reveal={1} delivered={delivered} frame={globalFrame} />
      <StatusBar />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 280,
          borderRadius: "28px 28px 0 0",
          backgroundColor: colors.surface,
          borderTop: `1px solid ${colors.lineStrong}`,
          padding: "16px 24px",
        }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.lineStrong, margin: "0 auto 18px" }} />
        <div style={{ position: "relative", height: 110 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - doneP }}>
            <Mono style={{ fontSize: 13, color: colors.cyan, letterSpacing: "0.16em" }}>CANLI KONUM</Mono>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, marginTop: 6, letterSpacing: "-0.02em" }}>
              Kuryen yolda
            </div>
            <div style={{ fontSize: 17, color: colors.textMuted, marginTop: 4 }}>
              Tahmini varış <span style={{ color: colors.text, fontWeight: 600 }}>{minLeft(progress)} dk</span> ·{" "}
              {kmLeft(progress)} km
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: doneP,
              translate: `0 ${(1 - doneP) * 10}px`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
                backgroundColor: colors.amber,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 30px ${alpha(colors.amber, 0.5)}`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30">
                <path d="M8 15.5 L13 20.5 L22 10" stroke={colors.graphite} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em" }}>
                Teslim edildi
              </div>
              <div style={{ fontSize: 17, color: colors.textMuted, marginTop: 2 }}>Afiyet olsun!</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {TRACK_STEPS.map((s, i) => {
            const active = i < 2 || (i === 2 && progress > 0) || (i === 3 && delivered > 0.5);
            const color = i === 3 && active ? colors.amber : colors.cyan;
            return (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 2, backgroundColor: active ? color : colors.line }} />
                <div style={{ fontSize: 13, marginTop: 8, color: active ? colors.text : colors.textDim }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
