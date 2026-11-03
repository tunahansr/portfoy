import type { ComponentType } from "react";
import type { ScreenRenderKey } from "@/data/mobile-apps";
import type { ScreenProps } from "../kit";
import { MusteriBildirim, MusteriKesfet, MusteriMenu, MusteriOnay, MusteriSepet, MusteriTakip } from "./musteri";
import { KuryeDetay, KuryeHavuz, KuryeRota, KuryeTeslim, KuryeVardiya } from "./kurye";
import { OpsCanli, OpsPaketler, OpsRapor, OpsVardiya } from "./ops";
import { ErpCari, ErpDashboard, ErpOnay, ErpStok } from "./erp";

export const screenRegistry: Record<ScreenRenderKey, ComponentType<ScreenProps>> = {
  "musteri.kesfet": MusteriKesfet,
  "musteri.menu": MusteriMenu,
  "musteri.sepet": MusteriSepet,
  "musteri.onay": MusteriOnay,
  "musteri.takip": MusteriTakip,
  "musteri.bildirim": MusteriBildirim,
  "kurye.vardiya": KuryeVardiya,
  "kurye.havuz": KuryeHavuz,
  "kurye.detay": KuryeDetay,
  "kurye.rota": KuryeRota,
  "kurye.teslim": KuryeTeslim,
  "ops.canli": OpsCanli,
  "ops.paketler": OpsPaketler,
  "ops.vardiya": OpsVardiya,
  "ops.rapor": OpsRapor,
  "erp.dashboard": ErpDashboard,
  "erp.stok": ErpStok,
  "erp.cari": ErpCari,
  "erp.onay": ErpOnay,
};

/** Durum çubuğu metin rengi: ekran arka planına göre (varsayılan uygulama teması) */
export const statusToneOverride: Partial<Record<ScreenRenderKey, "light" | "dark">> = {
  "musteri.bildirim": "dark",
};
