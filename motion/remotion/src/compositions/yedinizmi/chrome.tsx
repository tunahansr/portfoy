import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { alpha, clamp, colors, easeInOut, easeOut } from "../../lib/brand";
import { font } from "../../lib/fonts";
import { STEPS, T } from "./timing";

/** Üst künye: marka + "Konsept önizleme" etiketi */
export const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 72,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: p,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: 40, letterSpacing: "-0.035em" }}>
          Yedinizmi
        </span>
        <span style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.amber, display: "inline-block" }} />
      </div>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 18,
          letterSpacing: "0.08em",
          color: colors.textMuted,
          padding: "8px 14px",
          borderRadius: 999,
          border: `1px solid ${colors.lineStrong}`,
        }}
      >
        Konsept önizleme
      </span>
    </div>
  );
};

/** 4 adımlı akış çubuğu: Müşteri → Restoran → Kurye → Teslimat */
export const StepRail: React.FC = () => {
  const frame = useCurrentFrame();
  const left = 80;
  const width = 920;
  const steps = STEPS.slice(0, 4);
  const fill = interpolate(
    frame,
    [0, steps[1].from, steps[2].from, steps[3].from, T.rideEnd],
    [0.06, 0.25, 0.5, 0.75, 1],
    { ...clamp, easing: easeInOut },
  );
  return (
    <div style={{ position: "absolute", left, top: 150, width, opacity: interpolate(frame, [4, 20], [0, 1], clamp) }}>
      <div style={{ position: "relative", height: 3, borderRadius: 2, backgroundColor: colors.line }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 3,
            width: `${fill * 100}%`,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${colors.cyan}, ${colors.amber})`,
          }}
        />
      </div>
      <div style={{ display: "flex", marginTop: 16 }}>
        {steps.map((s, i) => {
          const active = frame >= s.from;
          return (
            <div
              key={s.label}
              style={{
                flex: 1,
                fontFamily: font.mono,
                fontSize: 18,
                letterSpacing: "0.06em",
                color: active ? colors.text : colors.textDim,
              }}
            >
              <span style={{ color: active ? colors.amber : colors.textDim }}>{String(i + 1).padStart(2, "0")}</span>{" "}
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Caption: React.FC<{ readonly eyebrow: string; readonly text: string; readonly duration: number; readonly last: boolean }> = ({
  eyebrow,
  text,
  duration,
  last,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: easeOut });
  const outP = last ? 0 : interpolate(frame, [duration - 10, duration], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1140 }}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 18,
            letterSpacing: "0.16em",
            color: last ? colors.amber : colors.cyan,
            opacity: inP * (1 - outP),
          }}
        >
          {eyebrow}
        </div>
        <div style={{ overflow: "hidden", height: 74, marginTop: 8 }}>
          <div
            style={{
              fontFamily: font.serif,
              fontSize: 60,
              lineHeight: "74px",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              translate: `0 ${(1 - inP) * 100 - outP * 100}%`,
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => (
  <>
    {STEPS.map((s, i) => {
      const next = STEPS[i + 1];
      const duration = (next ? next.from : T.total) - s.from;
      return (
        <Sequence key={s.eyebrow} name={`Altyazı · ${s.label}`} from={s.from} durationInFrames={duration}>
          <Caption eyebrow={s.eyebrow} text={s.caption} duration={duration} last={!next} />
        </Sequence>
      );
    })}
  </>
);

/** Zeminde yavaş nefes alan amber/cyan ışık */
export const Glow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 450;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 50% 32% at ${40 + t * 20}% 52%, ${alpha(colors.amber, 0.07)} 0%, transparent 70%), radial-gradient(ellipse 45% 30% at ${
          70 - t * 20
        }% 62%, ${alpha(colors.cyan, 0.06)} 0%, transparent 70%)`,
      }}
    />
  );
};
