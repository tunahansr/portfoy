import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Backdrop } from "../lib/Backdrop";
import { colors } from "../lib/brand";
import { font } from "../lib/fonts";
import { DashboardWindow } from "./erp/Dashboard";
import { ChapterColumn, Eyebrow, TenantScene, TitleScene } from "./erp/scenes";

/** Site içindeki <Player> ve Root.tsx aynı meta veriyi kullanır. */
export const KAREKOD_ERP_SHOWCASE = {
  id: "KarekodErpShowcase",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 360,
} as const;

/**
 * KAREKOD ERP ürün showcase'i (12 sn):
 * 0–9 sn  modül görünümleri arasında "dashboard morph" (Satış → Stok → Finans → Üretim)
 * 8–10 sn pencere küçülüp merkezi yönetim düğümüne dönüşür, kiracılar ve veritabanları
 * 10–12 sn kapanış başlığı
 */
export const KarekodErpShowcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: font.sans, color: colors.text, backgroundColor: colors.graphite }}>
      <Backdrop glowPosition="66% 42%" />
      <Sequence name="Bölümler" durationInFrames={8.5 * fps}>
        <ChapterColumn />
      </Sequence>
      <Sequence name="ERP penceresi" durationInFrames={9 * fps}>
        <DashboardWindow />
      </Sequence>
      <Sequence name="Çok kiracılı mimari" from={8 * fps}>
        <TenantScene />
      </Sequence>
      <Sequence name="Künye" durationInFrames={10.5 * fps}>
        <Eyebrow />
      </Sequence>
      <Sequence name="Kapanış" from={10 * fps}>
        <TitleScene />
      </Sequence>
    </AbsoluteFill>
  );
};
