import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { PHONE_SCREEN, StatusBar, Tap } from "../../lib/devices";
import { CityMap, kmLeft } from "./map";
import { T } from "./timing";
import { CheckBadge, Mono, PushScreen } from "./ui";

/** Kurye uygulaması. Kareler CourierScene'e göre yereldir (global 212 = 0). */

const BG = "#0A0F1A";
const PAD = 24;

export const COURIER_T = {
  notify: 16,
  sheet: 28,
  accept: 56,
  map: 70,
} as const;

const OnlineToggle: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: colors.cyan }}>
    Çevrimiçi
    <div style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: colors.cyan, position: "relative" }}>
      <div style={{ position: "absolute", right: 3, top: 3, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.graphite }} />
    </div>
  </div>
);

const TaskScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const notify = interpolate(frame, [COURIER_T.notify, COURIER_T.notify + 12], [0, 1], { ...clamp, easing: easeOut });
  const sheet = interpolate(frame, [COURIER_T.sheet, COURIER_T.sheet + 16], [0, 1], { ...clamp, easing: easeOut });
  const accepted = frame >= COURIER_T.accept;
  const radar = (frame % 40) / 40;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: colors.text, fontFamily: font.sans }}>
      <StatusBar />
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em" }}>Görevler</div>
        <OnlineToggle />
      </div>
      {/* Görev havuzu bekleme durumu */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[0, 0.33, 0.66].map((o) => {
          const r = (radar + o) % 1;
          return (
            <div
              key={o}
              style={{
                position: "absolute",
                width: 240,
                height: 240,
                borderRadius: 120,
                border: `1.5px solid ${alpha(colors.cyan, 0.5 * (1 - r))}`,
                scale: 0.2 + r * 0.8,
              }}
            />
          );
        })}
        <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.cyan, boxShadow: `0 0 20px ${colors.cyan}` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontSize: 17, color: colors.textMuted, opacity: 1 - sheet }}>
        Görev havuzu dinleniyor
      </div>

      {/* Bildirim */}
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: 56,
          height: 76,
          borderRadius: 22,
          backgroundColor: alpha(colors.surface2, 0.96),
          border: `1px solid ${colors.lineStrong}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 16px",
          translate: `0 ${(1 - notify) * -140}px`,
          opacity: notify,
          zIndex: 6,
          boxShadow: `0 16px 40px ${alpha("#000000", 0.5)}`,
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: colors.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <path d="M4 15 V9 a7 7 0 0 1 14 0 V15 L19.5 17 H2.5 Z M9 19 a2 2 0 0 0 4 0" fill={colors.graphite} />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Yeni görev atandı</div>
          <div style={{ fontSize: 15, color: colors.textMuted }}>#1042 · Pide Salonu</div>
        </div>
      </div>

      {/* Görev kartı */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 470,
          borderRadius: "30px 30px 0 0",
          backgroundColor: colors.surface,
          borderTop: `1px solid ${colors.lineStrong}`,
          padding: "18px 24px",
          translate: `0 ${(1 - sheet) * 100}%`,
        }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.lineStrong, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em" }}>Teslimat görevi</div>
          <Mono style={{ fontSize: 15, color: colors.textDim }}>#1042</Mono>
        </div>
        <div style={{ position: "relative", marginTop: 22, paddingLeft: 34 }}>
          <div style={{ position: "absolute", left: 8, top: 10, bottom: 34, width: 2, backgroundColor: colors.lineStrong }} />
          <div style={{ position: "absolute", left: 1, top: 4, width: 16, height: 16, borderRadius: 8, border: `3px solid ${colors.textMuted}`, backgroundColor: colors.surface }} />
          <div style={{ position: "absolute", left: 1, top: 76, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.amber }} />
          <Mono style={{ fontSize: 13, color: colors.textDim, letterSpacing: "0.14em" }}>ALIŞ</Mono>
          <div style={{ fontSize: 19, fontWeight: 500, marginTop: 2 }}>Pide Salonu</div>
          <div style={{ height: 22 }} />
          <Mono style={{ fontSize: 13, color: colors.textDim, letterSpacing: "0.14em" }}>TESLİM</Mono>
          <div style={{ fontSize: 19, fontWeight: 500, marginTop: 2 }}>Müşteri adresi</div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          {[
            ["Mesafe", "1,8 km"],
            ["Tahmini", "9 dk"],
          ].map(([k, v]) => (
            <div key={k} style={{ flex: 1, borderRadius: 14, backgroundColor: colors.surface2, padding: "12px 14px" }}>
              <div style={{ fontSize: 14, color: colors.textMuted }}>{k}</div>
              <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            height: 60,
            borderRadius: 18,
            backgroundColor: accepted ? alpha(colors.cyan, 0.14) : colors.cyan,
            border: `1px solid ${colors.cyan}`,
            color: accepted ? colors.cyan : colors.graphite,
            fontSize: 18,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: interpolate(frame, [COURIER_T.accept - 3, COURIER_T.accept, COURIER_T.accept + 5], [1, 0.96, 1], clamp),
          }}
        >
          {accepted ? "Görev kabul edildi" : "Görevi kabul et"}
        </div>
      </div>
      <Tap x={PHONE_SCREEN.width / 2} y={PHONE_SCREEN.height - 74} at={COURIER_T.accept} color={colors.text} />
    </AbsoluteFill>
  );
};

const MapScreen: React.FC<{ readonly progress: number; readonly delivered: number; readonly globalFrame: number }> = ({
  progress,
  delivered,
  globalFrame,
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [COURIER_T.map + 6, COURIER_T.map + 22], [0, 1], { ...clamp, easing: easeInOut });
  const doneP = interpolate(delivered, [0, 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: colors.text, fontFamily: font.sans }}>
      <CityMap progress={progress} reveal={reveal} delivered={delivered} frame={globalFrame} />
      <StatusBar />
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: 62,
          height: 58,
          borderRadius: 18,
          backgroundColor: alpha(colors.surface, 0.94),
          border: `1px solid ${colors.lineStrong}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          fontSize: 16,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cyan }} />
          Konum paylaşılıyor
        </span>
        <Mono style={{ fontSize: 14, color: colors.textDim }}>#1042</Mono>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 250,
          borderRadius: "28px 28px 0 0",
          backgroundColor: colors.surface,
          borderTop: `1px solid ${colors.lineStrong}`,
          padding: "26px 24px",
        }}
      >
        <div style={{ position: "relative", height: 150 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - doneP }}>
            <Mono style={{ fontSize: 13, color: colors.cyan, letterSpacing: "0.16em" }}>TESLİMATA</Mono>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 44, letterSpacing: "-0.02em", marginTop: 4 }}>
              {kmLeft(progress)} km
            </div>
            <div style={{ marginTop: 12, height: 6, borderRadius: 3, backgroundColor: colors.line }}>
              <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 3, backgroundColor: colors.cyan }} />
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: doneP, display: "flex", alignItems: "center", gap: 18 }}>
            {delivered > 0 ? <CheckBadge at={T.rideEnd - T.courierFrom} size={64} /> : null}
            <div>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em" }}>
                Teslimat tamamlandı
              </div>
              <div style={{ fontSize: 16, color: colors.textMuted, marginTop: 2 }}>#1042 · Müşteri adresi</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CourierScreens: React.FC<{ readonly progress: number; readonly delivered: number; readonly globalFrame: number }> = (
  props,
) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <PushScreen inAt={-30} outAt={COURIER_T.map} background={BG}>
      <TaskScreen />
    </PushScreen>
    <PushScreen inAt={COURIER_T.map} background={BG}>
      <MapScreen {...props} />
    </PushScreen>
  </AbsoluteFill>
);
