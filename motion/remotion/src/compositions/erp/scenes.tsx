import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { cubicAt, type Point } from "../../lib/paths";
import { CORE, MODULES, VIEWS, VIEW_IN, VIEW_OUT } from "./timing";

/* ------------------------------------------------------------------ */
/* Sol editoryal kolon: bölüm numarası + modül adı                     */
/* ------------------------------------------------------------------ */

const Chapter: React.FC<{
  readonly index: number;
  readonly title: string;
  readonly description: string;
  readonly duration: number;
}> = ({ index, title, description, duration }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, VIEW_IN + 4], [0, 1], { ...clamp, easing: easeOut });
  const outP = interpolate(frame, [duration - VIEW_OUT, duration], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 388, width: 440 }}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 20,
            letterSpacing: "0.14em",
            color: colors.cyan,
            opacity: inP * (1 - outP),
          }}
        >
          {String(index + 1).padStart(2, "0")} <span style={{ color: colors.textDim }}>/ 04 — MODÜL</span>
        </div>
        <div style={{ overflow: "hidden", height: 150, marginTop: 10 }}>
          <div
            style={{
              fontFamily: font.serif,
              fontSize: 140,
              lineHeight: "150px",
              letterSpacing: "-0.02em",
              translate: `0 ${(1 - inP) * 100 - outP * 100}%`,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            lineHeight: 1.35,
            color: colors.textMuted,
            maxWidth: 420,
            opacity: inP * (1 - outP),
            translate: `0 ${(1 - inP) * 14}px`,
          }}
        >
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Bölüm ilerleme çubuğu: 4 segment */
const ChapterProgress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 120, top: 760, display: "flex", gap: 10 }}>
      {VIEWS.map((v) => {
        const p = interpolate(frame, [v.from, v.from + v.duration - 6], [0, 1], clamp);
        return (
          <div key={v.key} style={{ width: 92, height: 3, borderRadius: 2, backgroundColor: colors.line }}>
            <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 2, backgroundColor: colors.cyan }} />
          </div>
        );
      })}
    </div>
  );
};

export const ChapterColumn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity:
          interpolate(frame, [10, 30], [0, 1], clamp) * (1 - interpolate(frame, [232, 248], [0, 1], clamp)),
      }}
    >
      {VIEWS.map((v, i) => (
        <Sequence key={v.key} name={`Bölüm · ${v.title}`} from={v.from} durationInFrames={v.duration}>
          <Chapter index={i} title={v.title} description={v.description} duration={v.duration} />
        </Sequence>
      ))}
      <ChapterProgress />
    </AbsoluteFill>
  );
};

/** Sol üstte kalıcı küçük künye */
export const Eyebrow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 84,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: font.mono,
        fontSize: 18,
        letterSpacing: "0.16em",
        color: colors.textMuted,
        opacity: interpolate(frame, [4, 20], [0, 1], clamp) * (1 - interpolate(frame, [298, 312], [0, 1], clamp)),
      }}
    >
      <span style={{ width: 28, height: 1, backgroundColor: colors.textDim }} />
      KAREKOD ERP <span style={{ color: colors.textDim }}>· ÜRÜN ÖNİZLEME</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Çok kiracılı mimari                                                 */
/* ------------------------------------------------------------------ */

const TENANTS = [
  { name: "Firma A", key: "firma_a", cx: 880, modules: ["Satış", "Stok", "Finans"] },
  { name: "Firma B", key: "firma_b", cx: 1250, modules: ["Üretim", "Stok", "Servis"] },
  { name: "Firma C", key: "firma_c", cx: 1620, modules: ["Satış", "Cari", "İK"] },
];
const TENANT_TOP = 560;
const TENANT_W = 330;
const TENANT_H = 300;

const Cylinder: React.FC<{ readonly fill: number }> = ({ fill }) => {
  const w = 76;
  const h = 96;
  const ry = 11;
  return (
    <svg width={w + 4} height={h + 2 * ry + 4} viewBox={`-2 -2 ${w + 4} ${h + 2 * ry + 4}`}>
      <defs>
        <linearGradient id="erp-db" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={colors.blue} stopOpacity={0.35} />
          <stop offset="60%" stopColor={colors.cyan} stopOpacity={0.18} />
          <stop offset="100%" stopColor={colors.blue} stopOpacity={0.3} />
        </linearGradient>
      </defs>
      <path
        d={`M0 ${ry} L0 ${h + ry} A${w / 2} ${ry} 0 0 0 ${w} ${h + ry} L${w} ${ry}`}
        fill="url(#erp-db)"
        stroke={colors.cyan}
        strokeWidth={1.5}
      />
      {[0.36, 0.68].map((t) => (
        <path
          key={t}
          d={`M0 ${ry + h * t} A${w / 2} ${ry} 0 0 0 ${w} ${ry + h * t}`}
          fill="none"
          stroke={alpha(colors.cyan, 0.5)}
          strokeWidth={1.2}
        />
      ))}
      <ellipse cx={w / 2} cy={ry} rx={w / 2} ry={ry} fill={colors.surface2} stroke={colors.cyan} strokeWidth={1.5} />
      <ellipse cx={w / 2} cy={ry} rx={(w / 2) * fill} ry={ry * fill} fill={alpha(colors.cyan, 0.35)} />
    </svg>
  );
};

const TenantCard: React.FC<{
  readonly tenant: (typeof TENANTS)[number];
  readonly delay: number;
}> = ({ tenant, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [30 + delay, 48 + delay], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        position: "absolute",
        left: tenant.cx - TENANT_W / 2,
        top: TENANT_TOP,
        width: TENANT_W,
        height: TENANT_H,
        borderRadius: 20,
        backgroundColor: alpha(colors.surface, 0.92),
        border: `1px solid ${colors.lineStrong}`,
        padding: 26,
        opacity: p,
        translate: `0 ${(1 - p) * 40}px`,
        boxShadow: `0 30px 60px ${alpha("#000000", 0.4)}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em" }}>
          {tenant.name}
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 15, color: colors.textDim }}>{tenant.key}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
        <Cylinder fill={interpolate(frame, [40 + delay, 60 + delay], [0, 1], { ...clamp, easing: easeOut })} />
        <div>
          <div style={{ fontSize: 20, lineHeight: 1.3, color: colors.text }}>Bağımsız veritabanı</div>
          <div style={{ marginTop: 6, fontFamily: font.mono, fontSize: 15, color: colors.cyan }}>
            {tenant.key}_db
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
        {tenant.modules.map((m, i) => {
          const on = interpolate(frame, [38 + delay + i * 3, 46 + delay + i * 3], [0, 1], clamp);
          return (
            <span
              key={m}
              style={{
                fontSize: 17,
                padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${on > 0.5 ? alpha(colors.cyan, 0.5) : colors.line}`,
                backgroundColor: alpha(colors.cyan, 0.1 * on),
                color: on > 0.5 ? colors.text : colors.textDim,
              }}
            >
              {m}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const TenantScene: React.FC = () => {
  const frame = useCurrentFrame();
  const coreP = interpolate(frame, [12, 30], [0, 1], { ...clamp, easing: easeOut });
  const dim = interpolate(frame, [60, 78], [0, 1], { ...clamp, easing: easeInOut });
  const coreTop = CORE.cy - CORE.height / 2;
  const coreBottom = CORE.cy + CORE.height / 2;

  const curves = TENANTS.map((t) => {
    const p0: Point = { x: CORE.cx, y: coreBottom };
    const p3: Point = { x: t.cx, y: TENANT_TOP };
    const p1: Point = { x: CORE.cx, y: coreBottom + 110 };
    const p2: Point = { x: t.cx, y: TENANT_TOP - 110 };
    return { p0, p1, p2, p3 };
  });

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - dim * 0.94,
        scale: 1 - dim * 0.04,
        filter: `blur(${dim * 10}px)`,
      }}
    >
      {/* Başlık */}
      <div style={{ position: "absolute", left: 120, top: 360, width: 500 }}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 20,
            letterSpacing: "0.14em",
            color: colors.violet,
            opacity: interpolate(frame, [14, 28], [0, 1], clamp),
          }}
        >
          MİMARİ
        </div>
        <div style={{ overflow: "hidden", marginTop: 10 }}>
          <div
            style={{
              fontFamily: font.serif,
              fontSize: 112,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              translate: `0 ${interpolate(frame, [14, 34], [100, 0], { ...clamp, easing: easeOut })}%`,
            }}
          >
            Çok kiracılı
            <br />
            yapı
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 27,
            lineHeight: 1.4,
            color: colors.textMuted,
            maxWidth: 460,
            opacity: interpolate(frame, [22, 38], [0, 1], clamp),
          }}
        >
          Her müşteriye bağımsız veritabanı. Lisans ve modüller tek merkezden yönetilir.
        </div>
      </div>

      {/* Bağlantılar */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {curves.map((c, i) => {
          const draw = interpolate(frame, [24 + i * 4, 44 + i * 4], [0, 1], { ...clamp, easing: easeInOut });
          const d = `M${c.p0.x} ${c.p0.y} C${c.p1.x} ${c.p1.y} ${c.p2.x} ${c.p2.y} ${c.p3.x} ${c.p3.y}`;
          return (
            <g key={TENANTS[i].key}>
              <path
                d={d}
                fill="none"
                stroke={alpha(colors.violet, 0.7)}
                strokeWidth={2}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
              {[0, 0.5].map((offset) => {
                const t = ((frame - 40 - i * 5) / 28 + offset) % 1;
                if (frame < 40 + i * 5) return null;
                const pt = cubicAt(c.p0, c.p1, c.p2, c.p3, t);
                const fade = Math.sin(t * Math.PI);
                return (
                  <g key={offset} opacity={fade}>
                    <circle cx={pt.x} cy={pt.y} r={10} fill={alpha(colors.cyan, 0.2)} />
                    <circle cx={pt.x} cy={pt.y} r={4} fill={colors.cyan} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Merkez düğüm: lisans ve modül yönetimi */}
      <div
        style={{
          position: "absolute",
          left: CORE.cx - CORE.width / 2,
          top: coreTop,
          width: CORE.width,
          height: CORE.height,
          borderRadius: 20,
          backgroundColor: colors.surface,
          border: `1px solid ${alpha(colors.violet, 0.6)}`,
          boxShadow: `0 0 0 6px ${alpha(colors.violet, 0.06)}, 0 0 80px ${alpha(colors.violet, 0.22)}`,
          padding: "24px 28px",
          opacity: coreP,
          scale: 0.86 + coreP * 0.14,
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 15, letterSpacing: "0.14em", color: colors.violet }}>
          MERKEZİ YÖNETİM
        </div>
        <div style={{ marginTop: 8, fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Lisans & modül yönetimi
        </div>
        <div style={{ marginTop: 12, fontFamily: font.mono, fontSize: 15, color: colors.textDim, whiteSpace: "nowrap" }}>
          {MODULES.join(" · ")}
        </div>
      </div>

      {TENANTS.map((t, i) => (
        <TenantCard key={t.key} tenant={t} delay={i * 6} />
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Kapanış başlığı                                                     */
/* ------------------------------------------------------------------ */

const TITLE = "KAREKOD ERP";
const TAGLINE = ["Modüler", "Çok kiracılı", "Sektöre uyarlanabilir"];

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${alpha(colors.graphite, 0.55)} 0%, ${alpha(
            colors.graphite,
            0.85,
          )} 100%)`,
          opacity: interpolate(frame, [0, 16], [0, 1], clamp),
        }}
      />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 20,
            letterSpacing: "0.3em",
            color: colors.textMuted,
            opacity: interpolate(frame, [8, 24], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [8, 24], [10, 0], { ...clamp, easing: easeOut })}px`,
          }}
        >
          TUNAHAN ŞİRİN
        </div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 196,
            lineHeight: "210px",
            letterSpacing: "-0.035em",
          }}
        >
          {TITLE.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                translate: `0 ${interpolate(frame, [6 + i * 1.5, 26 + i * 1.5], [105, 0], {
                  ...clamp,
                  easing: easeOut,
                })}%`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div
          style={{
            margin: "26px auto 0",
            height: 2,
            width: interpolate(frame, [22, 44], [0, 260], { ...clamp, easing: easeOut }),
            backgroundColor: colors.amber,
            boxShadow: `0 0 18px ${alpha(colors.amber, 0.6)}`,
          }}
        />
        <div
          style={{
            marginTop: 30,
            fontSize: 40,
            color: colors.textMuted,
            letterSpacing: "-0.005em",
            opacity: interpolate(frame, [24, 42], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [24, 42], [14, 0], { ...clamp, easing: easeOut })}px`,
          }}
        >
          {TAGLINE.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 ? <span style={{ color: colors.cyan, margin: "0 18px" }}>·</span> : null}
              {t}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
