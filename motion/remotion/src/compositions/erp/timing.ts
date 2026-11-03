/**
 * KarekodErpShowcase zaman çizelgesi (30 fps, kare cinsinden).
 * Görünümler hafifçe üst üste biner: çıkan panel solarken giren panel yükselir.
 */
export const MODULES = ["Satış", "Stok", "Finans", "Cari", "Üretim", "Servis", "İK"] as const;

export type ViewKey = "satis" | "stok" | "finans" | "uretim";

export type ViewSpec = {
  readonly key: ViewKey;
  readonly moduleIndex: number;
  readonly from: number;
  readonly duration: number;
  readonly title: string;
  readonly description: string;
};

export const VIEWS: readonly ViewSpec[] = [
  {
    key: "satis",
    moduleIndex: 0,
    from: 10,
    duration: 94,
    title: "Satış",
    description: "Tekliften faturaya kadar satış akışı tek ekranda.",
  },
  {
    key: "stok",
    moduleIndex: 1,
    from: 96,
    duration: 58,
    title: "Stok",
    description: "Depo bazlı stok seviyeleri ve kritik uyarılar.",
  },
  {
    key: "finans",
    moduleIndex: 2,
    from: 146,
    duration: 58,
    title: "Finans",
    description: "Nakit akışı, tahsilat ve ödemeler bir arada.",
  },
  {
    key: "uretim",
    moduleIndex: 4,
    from: 196,
    duration: 64,
    title: "Üretim",
    description: "İş emirleri planlamadan sevkiyata kadar izlenir.",
  },
];

/** Görünüm geçiş süresi (kare) */
export const VIEW_IN = 14;
export const VIEW_OUT = 10;

export const DASHBOARD_END = 270;
export const TENANT_FROM = 240;
export const TITLE_FROM = 300;

/** Pencere geometrisi (1920x1080 sahnede) */
export const WIN = { left: 620, top: 130, width: 1180, height: 820 } as const;
export const SIDEBAR_W = 232;
export const TOPBAR_H = 64;

/** Çok kiracılı sahnedeki merkez düğüm */
export const CORE = { cx: 1250, cy: 252, width: 540, height: 150 } as const;
