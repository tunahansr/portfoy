import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { CORE, MODULES, SIDEBAR_W, TOPBAR_H, VIEWS, VIEW_IN, VIEW_OUT, WIN } from "./timing";
import { FinansView, SatisView, StokView, UretimView } from "./views";

/** Sidebar'daki aktif modül indeksinin kareye göre konumu (kayan gösterge). */
const getActiveIndex = (frame: number): number => {
  const stops: number[] = [];
  const values: number[] = [];
  VIEWS.forEach((v, i) => {
    if (i === 0) {
      stops.push(v.from);
      values.push(v.moduleIndex);
      return;
    }
    stops.push(v.from - 2, v.from + 10);
    values.push(VIEWS[i - 1].moduleIndex, v.moduleIndex);
  });
  return interpolate(frame, stops, values, { ...clamp, easing: easeInOut });
};

const ModuleIcon: React.FC<{ readonly index: number; readonly color: string }> = ({
  index,
  color,
}) => {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (index) {
    case 0:
      return (
        <svg {...common}>
          <path d="M3 16V9M8 16V5M13 16v-5M18 16V3" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M3 6.5 10 3l7 3.5v7L10 17l-7-3.5z" />
          <path d="M3 6.5 10 10l7-3.5M10 10v7" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M2 14c3-6 5-6 8-3s5 2 8-5" />
          <path d="M14 6h4v4" />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" />
          <path d="M2 17c0-3 2.5-5 5-5s5 2 5 5M13 4.5a3 3 0 0 1 0 5.5M15 12.5c1.8.6 3 2.2 3 4.5" />
        </svg>
      );
    case 4:
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="2.6" />
          <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M4.3 15.7l1.8-1.8M13.9 6.1l1.8-1.8" />
        </svg>
      );
    case 5:
      return (
        <svg {...common}>
          <path d="M12.5 3.5a4 4 0 0 0-5 5L3 13v4h4l4.5-4.5a4 4 0 0 0 5-5L14 10l-4-4z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="14" height="14" rx="3" />
          <path d="M7 8h6M7 12h4" />
        </svg>
      );
  }
};

const ROW_H = 54;
const ROW_TOP = 128;

const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const active = getActiveIndex(frame);
  const nearest = Math.round(active);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_W,
        backgroundColor: alpha(colors.graphite, 0.6),
        borderRight: `1px solid ${colors.line}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 22,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: `linear-gradient(135deg, ${colors.blue}, ${colors.cyan})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 20,
            color: colors.graphite,
          }}
        >
          K
        </div>
        <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Karekod ERP
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 96,
          fontFamily: font.mono,
          fontSize: 14,
          letterSpacing: "0.16em",
          color: colors.textDim,
        }}
      >
        MODÜLLER
      </div>
      {/* Kayan aktif gösterge */}
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: ROW_TOP + active * ROW_H,
          height: ROW_H - 8,
          borderRadius: 10,
          backgroundColor: colors.surface2,
          border: `1px solid ${colors.lineStrong}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -1,
            top: 12,
            bottom: 12,
            width: 3,
            borderRadius: 2,
            backgroundColor: colors.cyan,
            boxShadow: `0 0 12px ${alpha(colors.cyan, 0.6)}`,
          }}
        />
      </div>
      {MODULES.map((m, i) => {
        const isActive = i === nearest;
        return (
          <div
            key={m}
            style={{
              position: "absolute",
              left: 28,
              top: ROW_TOP + i * ROW_H,
              height: ROW_H - 8,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 21,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? colors.text : colors.textMuted,
            }}
          >
            <ModuleIcon index={i} color={isActive ? colors.cyan : colors.textDim} />
            {m}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 26,
          bottom: 26,
          fontFamily: font.mono,
          fontSize: 14,
          color: colors.textDim,
          letterSpacing: "0.04em",
        }}
      >
        tenant · firma_a
      </div>
    </div>
  );
};

const Topbar: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.round(getActiveIndex(frame));
  return (
    <div
      style={{
        position: "absolute",
        left: SIDEBAR_W,
        right: 0,
        top: 0,
        height: TOPBAR_H,
        borderBottom: `1px solid ${colors.line}`,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 10,
        fontSize: 19,
      }}
    >
      <span style={{ color: colors.textDim }}>Panel</span>
      <span style={{ color: colors.lineStrong }}>/</span>
      <span style={{ color: colors.text, fontWeight: 500 }}>{MODULES[active]}</span>
      <div style={{ flex: 1 }} />
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 15,
          color: colors.textDim,
          border: `1px solid ${colors.line}`,
          borderRadius: 6,
          padding: "5px 10px",
          letterSpacing: "0.04em",
        }}
      >
        Örnek veri
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: `1px solid ${colors.lineStrong}`,
          backgroundColor: colors.surface2,
          borderRadius: 999,
          padding: "6px 16px 6px 12px",
          fontSize: 17,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.cyan,
            boxShadow: `0 0 10px ${colors.cyan}`,
          }}
        />
        Firma A
      </div>
    </div>
  );
};

/** Görünüm geçişlerinde ana panelden geçen ince tarama ışığı ("morph" hissi). */
const ScanSweep: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `linear-gradient(90deg, transparent 0%, ${alpha(colors.cyan, 0.0)} 30%, ${alpha(
          colors.cyan,
          0.14,
        )} 50%, ${alpha(colors.cyan, 0)} 70%, transparent 100%)`,
        translate: `${interpolate(frame, [0, 16], [-110, 110], { ...clamp, easing: easeInOut })}% 0`,
        opacity: interpolate(frame, [0, 4, 12, 16], [0, 1, 1, 0], clamp),
      }}
    />
  );
};

const ViewShell: React.FC<{ readonly duration: number; readonly children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, VIEW_IN], [0, 1], { ...clamp, easing: easeOut });
  const outP = interpolate(frame, [duration - VIEW_OUT, duration], [0, 1], {
    ...clamp,
    easing: easeInOut,
  });
  return (
    <AbsoluteFill
      style={{
        padding: 36,
        opacity: inP * (1 - outP),
        translate: `0 ${(1 - inP) * 28 - outP * 14}px`,
        scale: 0.985 + inP * 0.015 + outP * 0.01,
        filter: `blur(${(1 - inP) * 6 + outP * 5}px)`,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </AbsoluteFill>
  );
};

const VIEW_COMPONENTS = {
  satis: SatisView,
  stok: StokView,
  finans: FinansView,
  uretim: UretimView,
} as const;

/** ERP penceresi: kamera benzeri perspektif hareketi + modül görünümleri. */
export const DashboardWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 42], [0, 1], { ...clamp, easing: easeOut });
  const exit = interpolate(frame, [238, 266], [0, 1], { ...clamp, easing: easeInOut });
  const drift = interpolate(frame, [42, 238], [0, 1], clamp);

  const winCx = WIN.left + WIN.width / 2;
  const winCy = WIN.top + WIN.height / 2;
  const rotY = (-16 + enter * 9 + drift * 4) * (1 - exit);
  const rotX = (10 - enter * 7) * (1 - exit);
  const scale = (0.93 + enter * 0.07 + drift * 0.02) * (1 - exit) + 0.36 * exit;
  const tx = exit * (CORE.cx - winCx);
  const ty = (1 - enter) * 110 + exit * (CORE.cy - winCy);

  return (
    <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: `${winCx}px ${winCy}px` }}>
      <div
        style={{
          position: "absolute",
          left: WIN.left,
          top: WIN.top,
          width: WIN.width,
          height: WIN.height,
          borderRadius: 22,
          overflow: "hidden",
          backgroundColor: colors.surface,
          border: `1px solid ${colors.lineStrong}`,
          boxShadow: `0 60px 120px ${alpha("#000000", 0.55)}, 0 0 0 1px ${alpha(
            colors.blue,
            0.08,
          )}, 0 0 140px ${alpha(colors.blue, 0.12)}`,
          transform: `translate(${tx}px, ${ty}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`,
          opacity: interpolate(frame, [0, 14], [0, 1], clamp) * (1 - interpolate(frame, [250, 266], [0, 1], clamp)),
        }}
      >
        <Sidebar />
        <Topbar />
        <div
          style={{
            position: "absolute",
            left: SIDEBAR_W,
            top: TOPBAR_H,
            right: 0,
            bottom: 0,
            overflow: "hidden",
          }}
        >
          {VIEWS.map((v) => {
            const View = VIEW_COMPONENTS[v.key];
            return (
              <Sequence key={v.key} name={`Görünüm · ${v.title}`} from={v.from} durationInFrames={v.duration}>
                <ViewShell duration={v.duration}>
                  <View />
                </ViewShell>
              </Sequence>
            );
          })}
          {VIEWS.slice(1).map((v) => (
            <Sequence key={`sweep-${v.key}`} name="Tarama" from={v.from - 6} durationInFrames={16}>
              <ScanSweep />
            </Sequence>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
