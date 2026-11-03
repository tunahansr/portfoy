import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";

/** Uygulama ekranları arasında iOS benzeri "push" geçişi. Kareler yereldir. */
export const PushScreen: React.FC<{
  readonly inAt: number;
  readonly outAt?: number;
  readonly background: string;
  readonly children: React.ReactNode;
}> = ({ inAt, outAt = 100000, background, children }) => {
  const frame = useCurrentFrame();
  if (frame < inAt - 1 || frame > outAt + 16) return null;
  const x = interpolate(frame, [inAt, inAt + 14, outAt, outAt + 14], [100, 0, 0, -28], {
    ...clamp,
    easing: easeInOut,
  });
  const shade = interpolate(frame, [outAt, outAt + 14], [0, 0.5], clamp);
  return (
    <AbsoluteFill style={{ translate: `${x}% 0`, backgroundColor: background }}>
      {children}
      {shade > 0 ? <AbsoluteFill style={{ backgroundColor: alpha("#000000", shade) }} /> : null}
    </AbsoluteFill>
  );
};

/** Animasyonlu onay işareti (daire + tik) */
export const CheckBadge: React.FC<{
  readonly at: number;
  readonly size?: number;
  readonly color?: string;
}> = ({ at, size = 120, color = colors.amber }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: easeOut });
  const draw = interpolate(frame, [at + 6, at + 18], [0, 1], { ...clamp, easing: easeInOut });
  const halo = interpolate(frame, [at + 4, at + 30], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size,
          border: `2px solid ${alpha(color, 0.5 * (1 - halo))}`,
          scale: 1 + halo * 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size,
          backgroundColor: color,
          scale: pop,
          boxShadow: `0 0 ${size * 0.5}px ${alpha(color, 0.45)}`,
        }}
      />
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M36 62 L53 78 L86 44"
          fill="none"
          stroke={colors.graphite}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
    </div>
  );
};

export const Mono: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span style={{ fontFamily: font.mono, letterSpacing: "0.04em", ...style }}>{children}</span>
);

/** Basit yemek görseli yerine geçen tipografik karo */
export const FoodTile: React.FC<{ readonly letter: string; readonly hue: string; readonly size: number }> = ({
  letter,
  hue,
  size,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 18,
      background: `radial-gradient(circle at 30% 25%, ${alpha(hue, 0.9)} 0%, ${alpha(hue, 0.35)} 45%, ${alpha(
        colors.graphite,
        0.9,
      )} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font.serif,
      fontSize: size * 0.62,
      color: alpha(colors.text, 0.92),
      flexShrink: 0,
      overflow: "hidden",
    }}
  >
    {letter}
  </div>
);
