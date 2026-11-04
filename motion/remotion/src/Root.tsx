import React from "react";
import { Composition, Folder } from "remotion";
import { KarekodErpShowcase } from "./compositions/KarekodErpShowcase";
import { YedinizmiMobileExperience } from "./compositions/YedinizmiMobileExperience";

/**
 * Meta veriler (id, boyut, fps, süre) composition dosyalarındaki
 * KAREKOD_ERP_SHOWCASE / YEDINIZMI_MOBILE_EXPERIENCE nesneleriyle aynı tutulmalı;
 * site @remotion/player'ı o nesnelerle kurar.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Portfoy">
      <Composition
        id="KarekodErpShowcase"
        component={KarekodErpShowcase}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="YedinizmiMobileExperience"
        component={YedinizmiMobileExperience}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1350}
      />
    </Folder>
  );
};
