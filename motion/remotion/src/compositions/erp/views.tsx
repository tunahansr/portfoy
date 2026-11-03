import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { formatTr, polylineLength, smoothPoints, toPath, type Point } from "../../lib/paths";

/**
 * Modül görünümleri. Tüm sayılar gösterim amaçlı arayüz verisidir
 * (pencerede "Örnek veri" etiketi), gerçek müşteri/iş verisi değildir.
 * İçerik alanı: 876 x 684 px.
 */

const CONTENT_W = 876;

const card: React.CSSProperties = {
  position: "absolute",
  backgroundColor: alpha(colors.surface2, 0.7),
  border: `1px solid ${colors.line}`,
  borderRadius: 16,
};

const ViewHeader: React.FC<{ readonly title: string; readonly meta: string; readonly right?: React.ReactNode }> = ({
  title,
  meta,
  right,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: CONTENT_W,
      height: 48,
      display: "flex",
      alignItems: "baseline",
      gap: 16,
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.015em" }}>{title}</div>
    <div style={{ fontFamily: font.mono, fontSize: 15, color: colors.textDim, letterSpacing: "0.04em" }}>
      {meta}
    </div>
    <div style={{ flex: 1 }} />
    {right}
  </div>
);

const Pill: React.FC<{ readonly active?: boolean; readonly children: React.ReactNode }> = ({ active, children }) => (
  <span
    style={{
      fontFamily: font.mono,
      fontSize: 15,
      padding: "6px 12px",
      borderRadius: 8,
      color: active ? colors.text : colors.textDim,
      backgroundColor: active ? colors.surface2 : "transparent",
      border: `1px solid ${active ? colors.lineStrong : colors.line}`,
      marginLeft: 8,
    }}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Satış                                                               */
/* ------------------------------------------------------------------ */

const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const SALES = [42, 55, 48, 63, 58, 71, 66, 78, 74, 86, 81, 94];
const COLLECT = [36, 44, 46, 52, 55, 60, 63, 66, 71, 75, 78, 84];

const KPI = [
  { label: "Açık sipariş", value: 128, prefix: "", suffix: "" },
  { label: "Bekleyen teklif", value: 34, prefix: "", suffix: "" },
  { label: "Tahsilat oranı", value: 92, prefix: "%", suffix: "" },
];

export const SatisView: React.FC = () => {
  const frame = useCurrentFrame();
  const chartW = CONTENT_W;
  const chartTop = 218;
  const chartH = 466;
  const plot = { left: 40, right: chartW - 40, top: 96, bottom: chartH - 64 };
  const slot = (plot.right - plot.left) / SALES.length;
  const barW = 34;
  const yFor = (v: number) => plot.bottom - (v / 100) * (plot.bottom - plot.top);

  const linePts: Point[] = COLLECT.map((v, i) => ({ x: plot.left + slot * (i + 0.5), y: yFor(v) }));
  const dense = smoothPoints(linePts, 12);
  const len = polylineLength(dense);
  const draw = interpolate(frame, [22, 58], [0, 1], { ...clamp, easing: easeInOut });
  const headIdx = Math.min(dense.length - 1, Math.floor(draw * (dense.length - 1)));
  const head = dense[headIdx];

  return (
    <>
      <ViewHeader
        title="Satış özeti"
        meta="SON 12 AY"
        right={
          <div>
            <Pill active>Ay</Pill>
            <Pill>Çeyrek</Pill>
            <Pill>Yıl</Pill>
          </div>
        }
      />
      {KPI.map((k, i) => {
        const p = interpolate(frame, [4 + i * 4, 26 + i * 4], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={k.label}
            style={{
              ...card,
              left: i * (280 + 18),
              top: 72,
              width: 280,
              height: 128,
              padding: "20px 24px",
              opacity: p,
              translate: `0 ${(1 - p) * 16}px`,
            }}
          >
            <div style={{ fontSize: 18, color: colors.textMuted }}>{k.label}</div>
            <div
              style={{
                marginTop: 8,
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {k.prefix}
              {formatTr(k.value * p)}
            </div>
          </div>
        );
      })}
      <div style={{ ...card, left: 0, top: chartTop, width: chartW, height: chartH }}>
        <div style={{ position: "absolute", left: 28, top: 24, fontSize: 21, fontWeight: 500 }}>Aylık satış</div>
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 28,
            display: "flex",
            gap: 22,
            fontFamily: font.mono,
            fontSize: 15,
            color: colors.textMuted,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colors.blue }} /> Satış
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: colors.cyan }} /> Tahsilat
          </span>
        </div>
        <svg width={chartW} height={chartH} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="erp-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.blue} stopOpacity={0.9} />
              <stop offset="100%" stopColor={colors.blue} stopOpacity={0.25} />
            </linearGradient>
            <linearGradient id="erp-bar-hi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.cyan} stopOpacity={1} />
              <stop offset="100%" stopColor={colors.blue} stopOpacity={0.35} />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1={plot.left}
              x2={plot.right}
              y1={yFor(g * 100)}
              y2={yFor(g * 100)}
              stroke={colors.line}
              strokeDasharray={g === 0 ? undefined : "2 6"}
            />
          ))}
          {SALES.map((v, i) => {
            const p = interpolate(frame, [10 + i * 2, 30 + i * 2], [0, 1], { ...clamp, easing: easeOut });
            const h = (plot.bottom - yFor(v)) * p;
            const x = plot.left + slot * i + (slot - barW) / 2;
            const isLast = i === SALES.length - 1;
            return (
              <g key={MONTHS[i]}>
                <rect
                  x={x}
                  y={plot.bottom - h}
                  width={barW}
                  height={h}
                  rx={6}
                  fill={isLast ? "url(#erp-bar-hi)" : "url(#erp-bar)"}
                />
                <text
                  x={x + barW / 2}
                  y={plot.bottom + 34}
                  textAnchor="middle"
                  fontFamily={font.mono}
                  fontSize={15}
                  fill={isLast ? colors.text : colors.textDim}
                >
                  {MONTHS[i]}
                </text>
              </g>
            );
          })}
          <path
            d={toPath(dense)}
            fill="none"
            stroke={colors.cyan}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - draw)}
          />
          {draw > 0.01 ? (
            <g>
              <circle cx={head.x} cy={head.y} r={14} fill={alpha(colors.cyan, 0.18)} />
              <circle cx={head.x} cy={head.y} r={6} fill={colors.cyan} />
            </g>
          ) : null}
        </svg>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Stok                                                                */
/* ------------------------------------------------------------------ */

const STOCK = [
  { code: "STK-1042", name: "Çelik profil 40×40", depot: "Merkez", qty: 1240, level: 0.78 },
  { code: "STK-1107", name: "Galvaniz sac 1 mm", depot: "Merkez", qty: 312, level: 0.42 },
  { code: "STK-1188", name: "Paslanmaz vida M6", depot: "Şube 2", qty: 86, level: 0.12 },
  { code: "STK-1203", name: "Alüminyum köşebent", depot: "Merkez", qty: 640, level: 0.6 },
  { code: "STK-1251", name: "Toz boya RAL 7016", depot: "Şube 2", qty: 54, level: 0.16 },
  { code: "STK-1290", name: "Kaynak teli 0,8 mm", depot: "Merkez", qty: 905, level: 0.7 },
];

const COLS = [
  { label: "KOD", x: 28 },
  { label: "ÜRÜN", x: 172 },
  { label: "DEPO", x: 470 },
  { label: "MİKTAR", x: 590 },
  { label: "SEVİYE", x: 704 },
];

export const StokView: React.FC = () => {
  const frame = useCurrentFrame();
  const rowH = 76;
  return (
    <>
      <ViewHeader
        title="Stok durumu"
        meta="2 DEPO"
        right={
          <div>
            <Pill active>Tüm depolar</Pill>
            <Pill>Kritik seviye</Pill>
          </div>
        }
      />
      <div style={{ ...card, left: 0, top: 72, width: CONTENT_W, height: 612, overflow: "hidden" }}>
        {COLS.map((c) => (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: c.x,
              top: 22,
              fontFamily: font.mono,
              fontSize: 14,
              letterSpacing: "0.12em",
              color: colors.textDim,
            }}
          >
            {c.label}
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 58, height: 1, backgroundColor: colors.line }} />
        {STOCK.map((r, i) => {
          const p = interpolate(frame, [4 + i * 3, 20 + i * 3], [0, 1], { ...clamp, easing: easeOut });
          const fill = interpolate(frame, [12 + i * 3, 34 + i * 3], [0, r.level], { ...clamp, easing: easeOut });
          const critical = r.level < 0.2;
          const barColor = critical ? colors.danger : colors.cyan;
          return (
            <div
              key={r.code}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 60 + i * rowH,
                height: rowH,
                borderBottom: `1px solid ${alpha(colors.line, 0.7)}`,
                opacity: p,
                translate: `${(1 - p) * 40}px 0`,
                fontSize: 20,
                backgroundColor: critical ? alpha(colors.danger, 0.04) : "transparent",
              }}
            >
              <div style={{ position: "absolute", left: COLS[0].x, top: 26, fontFamily: font.mono, fontSize: 16, color: colors.textMuted }}>
                {r.code}
              </div>
              <div style={{ position: "absolute", left: COLS[1].x, top: 24 }}>{r.name}</div>
              <div style={{ position: "absolute", left: COLS[2].x, top: 24, color: colors.textMuted }}>{r.depot}</div>
              <div
                style={{
                  position: "absolute",
                  left: COLS[3].x,
                  top: 24,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTr(r.qty)} <span style={{ color: colors.textDim, fontSize: 16 }}>ad.</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: COLS[4].x,
                  top: 34,
                  width: 140,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.line,
                }}
              >
                <div
                  style={{
                    width: `${fill * 100}%`,
                    height: "100%",
                    borderRadius: 4,
                    backgroundColor: barColor,
                    boxShadow: critical ? `0 0 12px ${alpha(colors.danger, 0.5)}` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 28,
            bottom: 26,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 18,
            color: colors.textMuted,
            opacity: interpolate(frame, [28, 40], [0, 1], clamp),
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />2 ürün kritik seviyede
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Finans                                                              */
/* ------------------------------------------------------------------ */

const INFLOW = [38, 46, 41, 55, 52, 61, 58, 66, 63, 72, 70, 79];
const OUTFLOW = [34, 37, 40, 39, 45, 44, 49, 47, 52, 50, 55, 54];

const FIN_TILES = [
  { label: "Gelen", value: 486200, color: colors.cyan },
  { label: "Giden", value: 352900, color: colors.blue },
  { label: "Net", value: 133300, color: colors.amber },
];

export const FinansView: React.FC = () => {
  const frame = useCurrentFrame();
  const w = CONTENT_W;
  const h = 484;
  const plot = { left: 40, right: w - 40, top: 84, bottom: h - 60 };
  const xFor = (i: number) => plot.left + (i / (INFLOW.length - 1)) * (plot.right - plot.left);
  const yFor = (v: number) => plot.bottom - (v / 90) * (plot.bottom - plot.top);
  const inPts = smoothPoints(INFLOW.map((v, i) => ({ x: xFor(i), y: yFor(v) })), 12);
  const outPts = smoothPoints(OUTFLOW.map((v, i) => ({ x: xFor(i), y: yFor(v) })), 12);
  const inLen = polylineLength(inPts);
  const outLen = polylineLength(outPts);
  const draw = interpolate(frame, [8, 42], [0, 1], { ...clamp, easing: easeInOut });
  const areaPath = `${toPath(inPts)} L${plot.right} ${plot.bottom} L${plot.left} ${plot.bottom} Z`;
  const headIdx = Math.min(inPts.length - 1, Math.floor(draw * (inPts.length - 1)));
  const head = inPts[headIdx];

  return (
    <>
      <ViewHeader title="Nakit akışı" meta="SON 12 HAFTA" right={<Pill active>TRY</Pill>} />
      {FIN_TILES.map((t, i) => {
        const p = interpolate(frame, [2 + i * 4, 22 + i * 4], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={t.label}
            style={{
              ...card,
              left: i * (280 + 18),
              top: 72,
              width: 280,
              height: 112,
              padding: "18px 24px",
              opacity: p,
              translate: `0 ${(1 - p) * 14}px`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: colors.textMuted }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.color }} />
              {t.label}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 38,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₺{formatTr(Math.round((t.value * p) / 100) * 100)}
            </div>
          </div>
        );
      })}
      <div style={{ ...card, left: 0, top: 200, width: w, height: h }}>
        <div style={{ position: "absolute", left: 28, top: 24, fontSize: 21, fontWeight: 500 }}>Haftalık akış</div>
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 28,
            display: "flex",
            gap: 22,
            fontFamily: font.mono,
            fontSize: 15,
            color: colors.textMuted,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: colors.cyan }} /> Gelen
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: colors.blue }} /> Giden
          </span>
        </div>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="erp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.cyan} stopOpacity={0.22} />
              <stop offset="100%" stopColor={colors.cyan} stopOpacity={0} />
            </linearGradient>
            <clipPath id="erp-reveal">
              <rect x={0} y={0} width={plot.left + (plot.right - plot.left) * draw} height={h} />
            </clipPath>
          </defs>
          {[0, 0.33, 0.66, 1].map((g) => (
            <line
              key={g}
              x1={plot.left}
              x2={plot.right}
              y1={plot.bottom - g * (plot.bottom - plot.top)}
              y2={plot.bottom - g * (plot.bottom - plot.top)}
              stroke={colors.line}
              strokeDasharray={g === 0 ? undefined : "2 6"}
            />
          ))}
          <path d={areaPath} fill="url(#erp-area)" clipPath="url(#erp-reveal)" />
          <path
            d={toPath(outPts)}
            fill="none"
            stroke={colors.blue}
            strokeWidth={2.5}
            strokeDasharray={outLen}
            strokeDashoffset={outLen * (1 - draw)}
            opacity={0.85}
          />
          <path
            d={toPath(inPts)}
            fill="none"
            stroke={colors.cyan}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={inLen}
            strokeDashoffset={inLen * (1 - draw)}
          />
          {draw > 0.01 ? (
            <g>
              <line x1={head.x} x2={head.x} y1={plot.top - 10} y2={plot.bottom} stroke={alpha(colors.cyan, 0.25)} />
              <circle cx={head.x} cy={head.y} r={14} fill={alpha(colors.cyan, 0.18)} />
              <circle cx={head.x} cy={head.y} r={6} fill={colors.cyan} />
            </g>
          ) : null}
          {Array.from({ length: 12 }).map((_, i) => (
            <text
              key={i}
              x={xFor(i)}
              y={plot.bottom + 34}
              textAnchor="middle"
              fontFamily={font.mono}
              fontSize={14}
              fill={colors.textDim}
            >
              {`H${i + 1}`}
            </text>
          ))}
        </svg>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Üretim                                                              */
/* ------------------------------------------------------------------ */

const STAGES = ["Planlandı", "Üretimde", "Kalite kontrol", "Sevke hazır"];
const STAGE_W = (CONTENT_W - 3 * 16) / 4;
const CARD_H = 112;
const slotY = (i: number) => 64 + i * (CARD_H + 12);

type Job = { id: string; name: string; stage: number; slot: number; progress: number };
const JOBS: Job[] = [
  { id: "İE-2390", name: "Dolap gövdesi", stage: 0, slot: 0, progress: 0 },
  { id: "İE-2394", name: "Raf ayağı", stage: 0, slot: 1, progress: 0 },
  { id: "İE-2386", name: "Çelik kapı kasası", stage: 1, slot: 0, progress: 0.6 },
  { id: "İE-2379", name: "Masa iskeleti", stage: 2, slot: 0, progress: 0.9 },
  { id: "İE-2371", name: "Depo rafı", stage: 3, slot: 0, progress: 1 },
];

const JobCard: React.FC<{
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly highlight?: number;
  readonly success?: number;
}> = ({ id, name, progress, highlight = 0, success = 0 }) => {
  const accent = success > 0 ? colors.amber : colors.cyan;
  return (
    <div
      style={{
        width: STAGE_W - 24,
        height: CARD_H,
        borderRadius: 12,
        padding: "16px 16px",
        backgroundColor: highlight > 0 ? colors.surface2 : colors.surface,
        border: `1px solid ${highlight > 0 ? alpha(accent, 0.35 + 0.4 * highlight) : colors.line}`,
        boxShadow:
          highlight > 0
            ? `0 18px 40px ${alpha("#000000", 0.45)}, 0 0 ${24 + success * 20}px ${alpha(accent, 0.18 + success * 0.25)}`
            : "none",
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 14, color: highlight > 0 ? accent : colors.textDim }}>{id}</div>
      <div style={{ marginTop: 6, fontSize: 19, fontWeight: 500 }}>{name}</div>
      <div style={{ marginTop: 14, height: 5, borderRadius: 3, backgroundColor: colors.line }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 3,
            backgroundColor: progress >= 1 ? (success > 0 ? colors.amber : colors.textMuted) : colors.blue,
          }}
        />
      </div>
    </div>
  );
};

export const UretimView: React.FC = () => {
  const frame = useCurrentFrame();
  // Hareketli iş emri: her aşamada kısa bekleme, sonra bir sonraki kolona geçiş.
  const stagePos = interpolate(frame, [10, 19, 22, 31, 34, 43], [0, 1, 1, 2, 2, 3], {
    ...clamp,
    easing: easeInOut,
  });
  const slotPos = interpolate(stagePos, [0, 1], [2, 1], clamp);
  const progress = interpolate(stagePos, [0, 1, 2, 3], [0.05, 0.45, 0.85, 1], clamp);
  const success = interpolate(frame, [41, 47], [0, 1], clamp);
  const lift = Math.sin((stagePos % 1) * Math.PI);
  const appear = interpolate(frame, [2, 16], [0, 1], { ...clamp, easing: easeOut });

  return (
    <>
      <ViewHeader title="Üretim hattı" meta="İŞ EMİRLERİ" right={<Pill active>Bu hafta</Pill>} />
      {STAGES.map((s, i) => {
        const p = interpolate(frame, [i * 3, 16 + i * 3], [0, 1], { ...clamp, easing: easeOut });
        const isTarget = i === 3;
        return (
          <div
            key={s}
            style={{
              ...card,
              left: i * (STAGE_W + 16),
              top: 72,
              width: STAGE_W,
              height: 612,
              opacity: p,
              translate: `0 ${(1 - p) * 20}px`,
              borderColor: isTarget && success > 0 ? alpha(colors.amber, 0.25 * success + 0.0) : colors.line,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 600 }}>{s}</span>
              <span style={{ fontFamily: font.mono, fontSize: 14, color: colors.textDim }}>
                {JOBS.filter((j) => j.stage === i).length + (Math.round(stagePos) === i ? 1 : 0)}
              </span>
            </div>
            {JOBS.filter((j) => j.stage === i).map((j) => (
              <div key={j.id} style={{ position: "absolute", left: 12, top: slotY(j.slot) }}>
                <JobCard id={j.id} name={j.name} progress={j.progress} />
              </div>
            ))}
          </div>
        );
      })}
      {/* Kolonlar arasında ilerleyen iş emri */}
      <div
        style={{
          position: "absolute",
          left: 12 + stagePos * (STAGE_W + 16),
          top: 72 + slotY(slotPos) - lift * 14,
          opacity: appear,
          scale: 1 + lift * 0.04,
          zIndex: 2,
        }}
      >
        <JobCard id="İE-2381" name="Raf sistemi" progress={progress} highlight={1} success={success} />
      </div>
    </>
  );
};
