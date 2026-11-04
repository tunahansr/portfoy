import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, colors } from "./brand";

type BackdropProps = {
  readonly glow?: string;
  readonly glowPosition?: string;
  readonly gridSize?: number;
};

/**
 * Grafit zemin + gece mavisi ışık + maskelenmiş ince ızgara.
 * Gren/noise kullanılmaz: hem deterministik hem de video boyutunu şişirmez.
 */
export const Backdrop: React.FC<BackdropProps> = ({
  glow = colors.blue,
  glowPosition = "72% 18%",
  gridSize = 80,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.graphite }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${glowPosition}, ${alpha(
            colors.night,
            1,
          )} 0%, ${alpha(colors.graphite, 0)} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 45% 40% at ${glowPosition}, ${alpha(
            glow,
            0.09,
          )} 0%, ${alpha(glow, 0)} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${alpha(colors.line, 0.55)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(
            colors.line,
            0.55,
          )} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: `radial-gradient(ellipse 60% 55% at ${glowPosition}, black 0%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(ellipse 60% 55% at ${glowPosition}, black 0%, transparent 75%)`,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
