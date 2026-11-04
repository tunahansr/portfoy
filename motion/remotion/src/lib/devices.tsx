import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeOut } from "./brand";
import { font } from "./fonts";

/**
 * Cihaz çerçeveleri: modern telefon (dinamik ada, yuvarlak köşeler, yan tuşlar)
 * ve yatay tablet. Ekran içeriği children olarak verilir; ekran koordinatları
 * çerçevenin iç alanına göredir.
 */

export const PHONE = { width: 428, height: 880, bezel: 12, radius: 66 } as const;
export const PHONE_SCREEN = {
  width: PHONE.width - PHONE.bezel * 2,
  height: PHONE.height - PHONE.bezel * 2,
} as const;

export const StatusBar: React.FC<{ readonly tint?: string }> = ({ tint = colors.text }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 34px 0 40px",
      fontFamily: font.sans,
      fontWeight: 600,
      fontSize: 18,
      color: tint,
      zIndex: 5,
    }}
  >
    <span>12:30</span>
    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <svg width="20" height="13" viewBox="0 0 20 13">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 5} y={9 - i * 3} width="3.4" height={4 + i * 3} rx="1" fill={tint} />
        ))}
      </svg>
      <svg width="28" height="14" viewBox="0 0 28 14">
        <rect x="0.75" y="0.75" width="23" height="12.5" rx="3.5" fill="none" stroke={tint} strokeOpacity={0.5} strokeWidth="1.5" />
        <rect x="3" y="3" width="16" height="8" rx="2" fill={tint} />
        <rect x="25" y="4.5" width="2" height="5" rx="1" fill={tint} fillOpacity={0.5} />
      </svg>
    </span>
  </div>
);

type PhoneFrameProps = {
  readonly children: React.ReactNode;
  readonly screenColor?: string;
  readonly style?: React.CSSProperties;
};

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, screenColor = colors.night, style }) => (
  <div
    style={{
      position: "absolute",
      width: PHONE.width,
      height: PHONE.height,
      ...style,
    }}
  >
    {/* Yan tuşlar */}
    <div style={{ position: "absolute", left: -4, top: 170, width: 5, height: 46, borderRadius: 3, backgroundColor: "#1A2130" }} />
    <div style={{ position: "absolute", left: -4, top: 236, width: 5, height: 76, borderRadius: 3, backgroundColor: "#1A2130" }} />
    <div style={{ position: "absolute", right: -4, top: 250, width: 5, height: 104, borderRadius: 3, backgroundColor: "#1A2130" }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: PHONE.radius,
        background: "linear-gradient(145deg, #2A3344 0%, #121722 38%, #0B0F17 70%, #222B3A 100%)",
        boxShadow: `0 50px 100px ${alpha("#000000", 0.6)}, 0 0 0 1px ${alpha("#FFFFFF", 0.06)}, inset 0 0 0 1.5px ${alpha(
          "#FFFFFF",
          0.08,
        )}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: PHONE.bezel,
        top: PHONE.bezel,
        width: PHONE_SCREEN.width,
        height: PHONE_SCREEN.height,
        borderRadius: PHONE.radius - PHONE.bezel,
        overflow: "hidden",
        backgroundColor: screenColor,
      }}
    >
      {children}
      {/* Dinamik ada */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 13,
          width: 118,
          height: 34,
          marginLeft: -59,
          borderRadius: 20,
          backgroundColor: "#000000",
          zIndex: 10,
        }}
      />
      {/* Ev göstergesi */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 9,
          width: 140,
          height: 5,
          marginLeft: -70,
          borderRadius: 3,
          backgroundColor: alpha(colors.text, 0.55),
          zIndex: 10,
        }}
      />
    </div>
  </div>
);

export const TABLET = { width: 940, height: 620, bezel: 18, radius: 40 } as const;

export const TabletFrame: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div style={{ position: "absolute", width: TABLET.width, height: TABLET.height, ...style }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: TABLET.radius,
        background: "linear-gradient(150deg, #283142 0%, #10151F 45%, #0B0F17 75%, #1F2836 100%)",
        boxShadow: `0 50px 100px ${alpha("#000000", 0.6)}, 0 0 0 1px ${alpha("#FFFFFF", 0.06)}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: TABLET.width / 2 - 4,
        top: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#05070B",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: TABLET.bezel,
        top: TABLET.bezel,
        right: TABLET.bezel,
        bottom: TABLET.bezel,
        borderRadius: TABLET.radius - TABLET.bezel,
        overflow: "hidden",
        backgroundColor: colors.surface,
      }}
    >
      {children}
    </div>
  </div>
);

/** Parmak dokunuşu: küçük nokta + genişleyen halka. `at` = dokunma karesi (yerel). */
export const Tap: React.FC<{ readonly x: number; readonly y: number; readonly at: number; readonly color?: string }> = ({
  x,
  y,
  at,
  color = colors.text,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -8 || t > 16) return null;
  const press = interpolate(t, [-8, 0, 6], [0, 1, 0], clamp);
  const ring = interpolate(t, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 20, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: alpha(color, 0.35 * press),
          scale: 0.7 + press * 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -40,
          top: -40,
          width: 80,
          height: 80,
          borderRadius: 40,
          border: `2px solid ${alpha(color, 0.6 * (1 - ring))}`,
          scale: 0.4 + ring * 0.8,
        }}
      />
    </div>
  );
};
