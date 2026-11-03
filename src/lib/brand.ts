/**
 * Marka tasarım token'ları — site, Remotion ve HyperFrames composition'ları
 * aynı renk ve hareket dilini paylaşsın diye tek kaynakta tutulur.
 *
 * Renk kullanım kuralı (rastgele dağıtılmaz):
 *  - graphite / night  : zemin
 *  - blue / cyan       : sistem, veri akışı, etkileşim (birincil vurgu)
 *  - violet            : sadece mimari / altyapı bölgeleri
 *  - amber             : enerji, "canlı" durum, başarı anı, birincil CTA ışığı
 */
export const colors = {
  graphite: "#07090D",
  night: "#0A1022",
  surface: "#0F1521",
  surface2: "#151C2B",
  line: "#1F2838",
  lineStrong: "#2C374C",
  text: "#F3F5F8",
  textMuted: "#A3ADBD",
  textDim: "#808A9B",
  blue: "#3D7BFF",
  cyan: "#45E0F0",
  violet: "#8B6CFF",
  amber: "#FFB547",
  danger: "#FF6B6B",
} as const;

export const fonts = {
  display: "Bricolage Grotesque",
  serif: "Instrument Serif",
  sans: "Geist",
  mono: "Geist Mono",
} as const;

/** Hareket token'ları (saniye). GSAP / Motion / CSS aynı değerleri kullanır. */
export const motion = {
  duration: { xs: 0.15, sm: 0.3, md: 0.6, lg: 0.9, xl: 1.4 },
  // cubic-bezier karşılıkları
  ease: {
    out: [0.16, 1, 0.3, 1] as const, // expo-out benzeri: girişler
    inOut: [0.65, 0, 0.35, 1] as const, // sahne geçişleri
    soft: [0.33, 1, 0.68, 1] as const, // mikro etkileşimler
  },
  gsapEase: { out: "expo.out", inOut: "power3.inOut", soft: "power2.out" },
  stagger: 0.06,
} as const;

export type BrandColor = keyof typeof colors;
