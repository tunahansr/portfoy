"use client";

import { useEffect, useId } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { motion as brandMotion } from "@/lib/brand";

export type Pt = readonly [number, number];

/** Rotalar sokak ızgarasının üzerinden geçer (viewBox 390×420). */
export const ROUTE_CUSTOMER: Pt[] = [
  [70, 336],
  [70, 252],
  [200, 252],
  [200, 152],
  [318, 152],
];
export const ROUTE_COURIER: Pt[] = [
  [70, 380],
  [70, 252],
  [138, 252],
  [200, 152],
  [318, 152],
  [318, 96],
];

function routeLengths(route: Pt[]) {
  const segs: number[] = [];
  for (let i = 1; i < route.length; i++) {
    segs.push(Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]));
  }
  return { segs, total: segs.reduce((a, b) => a + b, 0) };
}

export function pointAt(route: Pt[], t: number): Pt {
  const { segs, total } = routeLengths(route);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const f = segs[i] === 0 ? 0 : Math.min(1, d / segs[i]);
      return [route[i][0] + (route[i + 1][0] - route[i][0]) * f, route[i][1] + (route[i + 1][1] - route[i][1]) * f];
    }
    d -= segs[i];
  }
  return route[route.length - 1];
}

const toPath = (route: Pt[]) => route.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

const palettes = {
  light: {
    ground: "#ECE6DA",
    block: "#E3DCCD",
    park: "#CFE3C0",
    sea: "#BFDDE8",
    seaLine: "#A9CFDD",
    road: "#FFFFFF",
    roadEdge: "#D9D1C2",
    major: "#FFF4D9",
    label: "#8A8173",
    routeBase: "#1A1206",
  },
  dark: {
    ground: "#0E131C",
    block: "#121925",
    park: "#10251E",
    sea: "#0A1A2A",
    seaLine: "#12324A",
    road: "#1F2838",
    roadEdge: "#151C2A",
    major: "#2A3346",
    label: "#5C677A",
    routeBase: "#000000",
  },
} as const;

export function MapCanvas({
  tone,
  route,
  progress,
  reduced,
  accent,
  accent2,
  height = 420,
  courierIcon = true,
  className,
  viewBox = "0 0 390 420",
  fit = "slice",
}: {
  tone: "light" | "dark";
  route: Pt[];
  /** 0 → 1, kuryenin rota üzerindeki konumu */
  progress: number;
  reduced: boolean;
  accent: string;
  accent2: string;
  height?: number;
  courierIcon?: boolean;
  className?: string;
  /** Haritanın görünen bölgesi (çizim alanı 0 0 390 420) */
  viewBox?: string;
  fit?: "slice" | "meet";
}) {
  const p = palettes[tone];
  const id = useId().replace(/:/g, "");
  const mv = useMotionValue(progress);

  useEffect(() => {
    if (reduced) {
      mv.set(progress);
      return;
    }
    const controls = animate(mv, progress, { duration: 2.4, ease: brandMotion.ease.inOut });
    return () => controls.stop();
  }, [progress, reduced, mv]);

  const cx = useTransform(mv, (t) => pointAt(route, t)[0]);
  const cy = useTransform(mv, (t) => pointAt(route, t)[1]);
  const start = route[0];
  const end = route[route.length - 1];
  const d = toPath(route);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={`xMidYMid ${fit}`}
      className={className}
      style={{ width: "100%", height, display: "block", background: p.ground }}
      aria-hidden
    >
      <defs>
        <pattern id={`dots-${id}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill={p.label} opacity="0.18" />
        </pattern>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-200" y="-200" width="790" height="820" fill={p.ground} />
      <rect width="390" height="420" fill={`url(#dots-${id})`} />
      {/* deniz */}
      <path d="M0 0H390V58C300 82 230 52 150 70S40 80 0 64Z" fill={p.sea} />
      <path d="M0 64C40 80 80 66 150 70S300 82 390 58" fill="none" stroke={p.seaLine} strokeWidth="2" />
      {/* bloklar */}
      {[
        [84, 166, 102, 72],
        [214, 166, 92, 72],
        [84, 266, 102, 66],
        [214, 266, 92, 66],
        [334, 166, 70, 72],
        [0, 166, 56, 72],
        [0, 266, 56, 66],
        [334, 266, 70, 66],
        [84, 360, 102, 70],
        [334, 360, 70, 70],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={p.block} />
      ))}
      <rect x="214" y="360" width="92" height="70" rx="10" fill={p.park} />
      <rect x="84" y="96" width="102" height="42" rx="8" fill={p.block} />
      <rect x="214" y="96" width="92" height="42" rx="8" fill={p.park} />
      {/* yollar */}
      <g fill="none" strokeLinecap="round">
        <g stroke={p.roadEdge} strokeWidth="16">
          <path d="M-10 82C110 100 250 70 400 92" />
          <path d="M-10 152H400M-10 252H400M-10 346H400" />
          <path d="M70 70V430M200 76V430M318 84V430" />
          <path d="M120 430L262 152" />
        </g>
        <g stroke={p.road} strokeWidth="12">
          <path d="M-10 82C110 100 250 70 400 92" stroke={p.major} />
          <path d="M-10 152H400M-10 252H400M-10 346H400" />
          <path d="M70 70V430M200 76V430M318 84V430" />
          <path d="M120 430L262 152" />
        </g>
      </g>
      <text x="236" y="76" fontSize="9" fill={p.label} fontFamily="inherit" letterSpacing="1.2">
        SAHİL YOLU
      </text>
      <text x="96" y="246" fontSize="8.5" fill={p.label} fontFamily="inherit" letterSpacing="1">
        MERKEZ
      </text>
      {/* rota */}
      <path d={d} fill="none" stroke={p.routeBase} strokeOpacity={tone === "light" ? 0.12 : 0.6} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} fill="none" stroke={accent2} strokeOpacity="0.55" strokeWidth="4" strokeDasharray="1 9" strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ pathLength: mv }}
      />
      {/* başlangıç (restoran) */}
      <g transform={`translate(${start[0]} ${start[1]})`}>
        <circle r="11" fill={tone === "light" ? "#fff" : "#0B0F16"} stroke={accent} strokeWidth="3" />
        <circle r="4" fill={accent} />
      </g>
      {/* hedef (müşteri) */}
      <g transform={`translate(${end[0]} ${end[1] - 2})`}>
        <path d="M0 4C-9-5-13-11-13-17a13 13 0 0 1 26 0c0 6-4 12-13 21Z" fill={tone === "light" ? "#17140F" : "#F3F5F8"} />
        <circle cy="-17" r="5" fill={tone === "light" ? "#fff" : "#0B0F16"} />
      </g>
      {/* kurye */}
      <motion.g style={{ x: cx, y: cy }}>
        <circle r="26" fill={`url(#glow-${id})`} />
        <circle r="13" fill={accent} stroke={tone === "light" ? "#fff" : "#0B0F16"} strokeWidth="3" />
        {courierIcon ? (
          <g transform="translate(-7 -7) scale(0.58)" fill="none" stroke="#1A1206" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
          </g>
        ) : null}
      </motion.g>
    </svg>
  );
}
