import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { TABLET, Tap } from "../../lib/devices";
import { Mono } from "./ui";

/** Restoran / bayi paneli (tablet). Kareler sahneye göre yereldir. */

const SCREEN_W = TABLET.width - TABLET.bezel * 2; // 904
const GAP = 16;
const COL_W = (SCREEN_W - 48 - GAP * 2) / 3;
const COL_TOP = 84;
const SLOT0 = 58;
const CARD_H = 176;
const SLOT1 = SLOT0 + CARD_H + 12;

export const PANEL_T = {
  arrive: 14,
  accept: 40,
  toPreparing: [44, 56] as const,
  prepare: [56, 80] as const,
  toReady: [80, 92] as const,
  courier: 94,
};

const COLUMNS = ["Yeni", "Hazırlanıyor", "Hazır"];

const StaticOrder: React.FC<{ readonly id: string; readonly items: string; readonly chip: string; readonly chipColor: string }> = ({
  id,
  items,
  chip,
  chipColor,
}) => (
  <div
    style={{
      width: COL_W - 24,
      height: CARD_H - 40,
      borderRadius: 14,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.line}`,
      padding: "16px 16px",
    }}
  >
    <Mono style={{ fontSize: 15, color: colors.textDim }}>{id}</Mono>
    <div style={{ fontSize: 18, marginTop: 8, color: colors.textMuted }}>{items}</div>
    <span
      style={{
        display: "inline-block",
        marginTop: 14,
        fontSize: 14,
        padding: "4px 10px",
        borderRadius: 999,
        color: chipColor,
        backgroundColor: alpha(chipColor, 0.1),
      }}
    >
      {chip}
    </span>
  </div>
);

export const RestaurantPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = interpolate(
    frame,
    [PANEL_T.toPreparing[0], PANEL_T.toPreparing[1], PANEL_T.toReady[0], PANEL_T.toReady[1]],
    [0, 1, 1, 2],
    { ...clamp, easing: easeInOut },
  );
  const arrive = interpolate(frame, [PANEL_T.arrive, PANEL_T.arrive + 14], [0, 1], { ...clamp, easing: easeOut });
  const prep = interpolate(frame, [PANEL_T.prepare[0], PANEL_T.prepare[1]], [0, 1], { ...clamp, easing: easeInOut });
  const lift = Math.sin((stage % 1) * Math.PI);
  const ring = interpolate(frame, [PANEL_T.arrive + 6, PANEL_T.arrive + 30], [0, 1], { ...clamp, easing: easeOut });
  const toast = interpolate(frame, [PANEL_T.arrive, PANEL_T.arrive + 10, PANEL_T.accept, PANEL_T.accept + 8], [0, 1, 1, 0], clamp);
  const phase = stage < 0.5 ? 0 : stage < 1.5 ? 1 : 2;
  const courierOn = frame >= PANEL_T.courier;
  const cardX = 24 + stage * (COL_W + GAP) + 12;
  const cardY = COL_TOP + SLOT0 - lift * 16 - (1 - arrive) * 60;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.surface, color: colors.text, fontFamily: font.sans }}>
      {/* Üst çubuk */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 14,
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: colors.amber,
            color: colors.graphite,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 19,
          }}
        >
          Y
        </div>
        <span style={{ fontSize: 21, fontWeight: 600 }}>Pide Salonu</span>
        <Mono style={{ fontSize: 14, color: colors.textDim }}>RESTORAN PANELİ</Mono>
        <div style={{ flex: 1 }} />
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: colors.textMuted }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.amber }} />
          Siparişe açık
        </span>
      </div>

      {COLUMNS.map((c, i) => {
        const count = (i === 0 ? 0 : 1) + (phase === i ? 1 : 0);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: 24 + i * (COL_W + GAP),
              top: COL_TOP,
              width: COL_W,
              height: 584 - COL_TOP - 20,
              borderRadius: 16,
              backgroundColor: alpha(colors.surface2, 0.6),
              border: `1px solid ${colors.line}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 16,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              <span>{c}</span>
              <Mono style={{ fontSize: 14, color: colors.textDim, fontWeight: 400 }}>{frame < PANEL_T.arrive && i === 0 ? 0 : count}</Mono>
            </div>
            {i === 1 ? (
              <div style={{ position: "absolute", left: 12, top: SLOT1 }}>
                <StaticOrder id="#1039" items="Lahmacun × 3" chip="Hazırlanıyor" chipColor={colors.blue} />
              </div>
            ) : null}
            {i === 2 ? (
              <div style={{ position: "absolute", left: 12, top: SLOT1 }}>
                <StaticOrder id="#1036" items="Kaşarlı pide × 2" chip="Kurye yolda" chipColor={colors.cyan} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Hareketli sipariş kartı #1042 */}
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: COL_W - 24,
          height: CARD_H,
          opacity: arrive,
          scale: 1 + lift * 0.03,
          zIndex: 3,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 16,
            border: `2px solid ${alpha(colors.amber, 0.7 * (1 - ring))}`,
            scale: 1 + ring * 0.08,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            backgroundColor: colors.surface2,
            border: `1px solid ${phase === 0 ? alpha(colors.amber, 0.6) : alpha(colors.cyan, 0.45)}`,
            boxShadow: `0 20px 40px ${alpha("#000000", 0.45)}`,
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono style={{ fontSize: 16, color: colors.text, fontWeight: 500 }}>#1042</Mono>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 999,
                color: phase === 0 ? colors.graphite : colors.cyan,
                backgroundColor: phase === 0 ? colors.amber : alpha(colors.cyan, 0.12),
              }}
            >
              {phase === 0 ? "Yeni" : phase === 1 ? "Hazırlanıyor" : "Hazır"}
            </span>
          </div>
          <div style={{ fontSize: 17, marginTop: 10 }}>Kıymalı pide × 1</div>
          <div style={{ fontSize: 17, color: colors.textMuted, marginTop: 2 }}>Ayran × 1 · ₺210</div>
          {phase === 0 ? (
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <div
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 10,
                  backgroundColor: colors.amber,
                  color: colors.graphite,
                  fontWeight: 600,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: interpolate(frame, [PANEL_T.accept - 3, PANEL_T.accept, PANEL_T.accept + 5], [1, 0.95, 1], clamp),
                }}
              >
                Onayla
              </div>
              <div
                style={{
                  width: 86,
                  height: 42,
                  borderRadius: 10,
                  border: `1px solid ${colors.lineStrong}`,
                  color: colors.textMuted,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Reddet
              </div>
            </div>
          ) : phase === 1 ? (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textMuted }}>
                <span>Hazırlık</span>
                <span>{Math.max(1, Math.round(12 * (1 - prep)))} dk</span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: colors.line }}>
                <div style={{ width: `${prep * 100}%`, height: "100%", borderRadius: 3, backgroundColor: colors.cyan }} />
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                color: courierOn ? colors.cyan : colors.textMuted,
                opacity: interpolate(frame, [PANEL_T.courier - 4, PANEL_T.courier + 6], [0.4, 1], clamp),
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: courierOn ? colors.cyan : colors.textDim }} />
              {courierOn ? "Kurye atandı" : "Kurye bekleniyor"}
            </div>
          )}
        </div>
      </div>

      {/* Yeni sipariş bildirimi */}
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 76,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 12,
          backgroundColor: colors.amber,
          color: colors.graphite,
          fontSize: 16,
          fontWeight: 600,
          opacity: toast,
          translate: `0 ${(1 - toast) * -16}px`,
          zIndex: 4,
          boxShadow: `0 12px 30px ${alpha(colors.amber, 0.3)}`,
        }}
      >
        Yeni sipariş · #1042
      </div>
      <Tap x={24 + 12 + (COL_W - 24 - 94) / 2} y={COL_TOP + SLOT0 + 128} at={PANEL_T.accept} />
    </AbsoluteFill>
  );
};
