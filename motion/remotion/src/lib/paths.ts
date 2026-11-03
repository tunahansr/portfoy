/**
 * Deterministik grafik yardımcıları: veri noktalarından yumuşak polyline
 * üretir ve uzunluğunu hesaplar (DOM ölçümü gerekmez, Player + render aynı).
 */
export type Point = { x: number; y: number };

/** Kosinüs ara değerleme ile noktaları yoğunlaştırır. */
export const smoothPoints = (pts: Point[], steps = 10): Point[] => {
  const out: Point[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const mu = (1 - Math.cos(t * Math.PI)) / 2;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * mu });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export const toPath = (pts: Point[]): string =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

export const polylineLength = (pts: Point[]): number => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len;
};

/** Polyline üzerinde 0..1 arası ilerlemeye karşılık gelen nokta ve yön. */
export const pointAt = (pts: Point[], progress: number): Point & { angle: number } => {
  const total = polylineLength(pts);
  let target = Math.max(0, Math.min(1, progress)) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (target <= seg || i === pts.length - 1) {
      const t = seg === 0 ? 0 : Math.min(1, target / seg);
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        angle: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    target -= seg;
  }
  const last = pts[pts.length - 1];
  return { ...last, angle: 0 };
};

/** Kübik bezier üzerinde nokta. */
export const cubicAt = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};

/** Türkçe binlik ayıracıyla sayı biçimi (deterministik, Intl'e bağlı değil). */
export const formatTr = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
