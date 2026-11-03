/**
 * YedinizmiMobileExperience zaman çizelgesi (30 fps, kare cinsinden, global).
 */
export const T = {
  customerFrom: 0,
  customerDur: 132,
  restaurantFrom: 108,
  restaurantDur: 128,
  courierFrom: 212,
  trackingFrom: 296,
  /** Kuryenin rota üzerindeki hareketi */
  rideStart: 312,
  rideEnd: 392,
  outroFrom: 404,
  total: 450,
} as const;

export const STEPS = [
  { from: 0, label: "Müşteri", eyebrow: "01 — MÜŞTERİ UYGULAMASI", caption: "Müşteri siparişini verir." },
  { from: 110, label: "Restoran", eyebrow: "02 — RESTORAN PANELİ", caption: "Restoran onaylar, hazırlar." },
  { from: 214, label: "Kurye", eyebrow: "03 — KURYE UYGULAMASI", caption: "Kurye görevi üstlenir." },
  { from: 300, label: "Teslimat", eyebrow: "04 — CANLI TAKİP", caption: "Canlı konumla kapıya kadar." },
  { from: 404, label: "Teslimat", eyebrow: "YEDİNİZMİ", caption: "Tek akış: müşteri, restoran, kurye." },
] as const;

/** Sahne (1080x1350) içindeki cihaz alanı */
export const STAGE = { top: 232, bottom: 1112, centerX: 540 } as const;
