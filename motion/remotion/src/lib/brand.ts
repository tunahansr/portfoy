import { Easing } from "remotion";
import { colors, fonts as fontNames, motion } from "../../../../src/lib/brand";

/**
 * Remotion composition'ları sitenin marka token'larını doğrudan kullanır.
 * Tek kaynak: src/lib/brand.ts
 */
export { colors, fontNames, motion };

export const easeOut = Easing.bezier(...motion.ease.out);
export const easeInOut = Easing.bezier(...motion.ease.inOut);
export const easeSoft = Easing.bezier(...motion.ease.soft);

/** interpolate() için kenar sabitleme seçeneği */
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Hex rengi alfa ile rgba'ya çevirir. */
export const alpha = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
