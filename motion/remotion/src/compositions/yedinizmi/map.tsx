import React from "react";
import { alpha, colors } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { pointAt, polylineLength, toPath, type Point } from "../../lib/paths";
import { PHONE_SCREEN } from "../../lib/devices";

/**
 * Stilize şehir haritası (deterministik SVG): kıyı şeridi, ana ve ara yollar,
 * restorandan teslimat adresine rota ve hareket eden kurye noktası.
 * Gerçek bir harita/adres değildir.
 */

export const ROUTE: Point[] = [
  { x: 300, y: 520 },
  { x: 300, y: 420 },
  { x: 190, y: 420 },
  { x: 190, y: 300 },
  { x: 90, y: 300 },
  { x: 90, y: 196 },
];
export const ROUTE_LEN = polylineLength(ROUTE);

const W = PHONE_SCREEN.width;
const H = PHONE_SCREEN.height;

const MAJOR_H = [196, 420, 640];
const MINOR_H = [300, 520, 760];
const MAJOR_V = [90, 300];
const MINOR_V = [190, 380];

type MapProps = {
  /** Kuryenin rota üzerindeki ilerlemesi 0..1 */
  readonly progress: number;
  /** Rota çiziminin görünürlüğü 0..1 */
  readonly reveal: number;
  /** Teslimat anı (0..1) — hedef pinde amber vurgu */
  readonly delivered: number;
  /** Deterministik nabız için kare */
  readonly frame: number;
};

export const CityMap: React.FC<MapProps> = ({ progress, reveal, delivered, frame }) => {
  const courier = pointAt(ROUTE, progress);
  const pulse = (Math.sin(frame / 5) + 1) / 2;
  const start = ROUTE[0];
  const end = ROUTE[ROUTE.length - 1];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <rect width={W} height={H} fill="#0B111D" />
      {/* Deniz */}
      <path
        d={`M0 0 H${W} V112 C${W - 60} 128 ${W - 120} 98 ${W - 190} 120 S 90 150 0 132 Z`}
        fill="#0D1E33"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${-20 + i * 18} ${70 + i * 18} C 80 ${60 + i * 18}, 160 ${86 + i * 18}, 260 ${70 + i * 18} S 380 ${
            62 + i * 18
          } 440 ${74 + i * 18}`}
          fill="none"
          stroke={alpha(colors.blue, 0.12)}
          strokeWidth={1.2}
        />
      ))}
      <text x={150} y={100} fontFamily={font.mono} fontSize={13} letterSpacing="0.3em" fill={alpha(colors.textDim, 0.8)}>
        KARADENİZ
      </text>
      {/* Park */}
      <rect x={206} y={548} width={162} height={76} rx={14} fill="#0F1D22" />
      <rect x={20} y={444} width={54} height={180} rx={12} fill="#0F1D22" />
      {/* Ara yollar */}
      {MINOR_H.map((y) => (
        <line key={`mh${y}`} x1={0} x2={W} y1={y} y2={y} stroke="#151E2E" strokeWidth={7} />
      ))}
      {MINOR_V.map((x) => (
        <line key={`mv${x}`} x1={x} x2={x} y1={150} y2={H} stroke="#151E2E" strokeWidth={7} />
      ))}
      {/* Ana yollar */}
      {MAJOR_H.map((y) => (
        <line key={`Mh${y}`} x1={0} x2={W} y1={y} y2={y} stroke="#1B2638" strokeWidth={13} />
      ))}
      {MAJOR_V.map((x) => (
        <line key={`Mv${x}`} x1={x} x2={x} y1={140} y2={H} stroke="#1B2638" strokeWidth={13} />
      ))}
      <line x1={0} x2={W} y1={700} y2={560} stroke="#1B2638" strokeWidth={13} />

      {/* Rota: tamamı kesikli, katedilen kısım dolu */}
      <path
        d={toPath(ROUTE)}
        fill="none"
        stroke={alpha(colors.cyan, 0.35)}
        strokeWidth={5}
        strokeDasharray="2 10"
        strokeLinecap="round"
        opacity={reveal}
      />
      <path
        d={toPath(ROUTE)}
        fill="none"
        stroke={colors.cyan}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={ROUTE_LEN}
        strokeDashoffset={ROUTE_LEN * (1 - progress)}
        style={{ filter: `drop-shadow(0 0 6px ${alpha(colors.cyan, 0.6)})` }}
      />

      {/* Restoran pini */}
      <g transform={`translate(${start.x} ${start.y})`} opacity={reveal}>
        <circle r={18} fill={colors.surface2} stroke={colors.textMuted} strokeWidth={2} />
        <path d="M-6 -6 V6 M-2 -6 V-1 M-10 -6 V-1 M-10 -1 H-2 M5 -6 C9 -4 9 2 5 3 V6" stroke={colors.text} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </g>
      {/* Hedef pini */}
      <g transform={`translate(${end.x} ${end.y})`} opacity={reveal}>
        <circle r={26 + delivered * 18} fill={alpha(colors.amber, 0.18 * (1 - delivered * 0.5))} />
        <circle r={18} fill={delivered > 0.5 ? colors.amber : colors.surface2} stroke={colors.amber} strokeWidth={2} />
        <path
          d="M-7 1 L0 -6 L7 1 M-5 -1 V7 H5 V-1"
          stroke={delivered > 0.5 ? colors.graphite : colors.amber}
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
        />
      </g>
      {/* Kurye */}
      {reveal > 0.5 && delivered < 1 ? (
        <g transform={`translate(${courier.x} ${courier.y})`}>
          <circle r={22 + pulse * 8} fill={alpha(colors.cyan, 0.16 * (1 - pulse * 0.6))} />
          <circle r={11} fill={colors.cyan} stroke={colors.graphite} strokeWidth={3} />
        </g>
      ) : null}
    </svg>
  );
};

/** "1,8 km" biçimi */
export const kmLeft = (progress: number): string => (1.8 * (1 - progress)).toFixed(1).replace(".", ",");
export const minLeft = (progress: number): number => Math.max(1, Math.ceil(9 * (1 - progress)));
