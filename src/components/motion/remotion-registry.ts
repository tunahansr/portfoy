import type { ComponentType } from "react";

/** Site içinde @remotion/player ile oynatılabilen composition'lar (kaynak: motion/remotion). */
export type RemotionId = "KarekodErpShowcase" | "YedinizmiMobileExperience";

export interface RemotionMeta {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

/** Composition'lar yalnızca ihtiyaç anında ayrı chunk olarak yüklenir. */
export async function loadRemotionComposition(id: RemotionId): Promise<{ component: AnyComponent; meta: RemotionMeta }> {
  switch (id) {
    case "KarekodErpShowcase": {
      const m = await import("@motion/remotion/src/compositions/KarekodErpShowcase");
      return { component: m.KarekodErpShowcase, meta: m.KAREKOD_ERP_SHOWCASE };
    }
    case "YedinizmiMobileExperience": {
      const m = await import("@motion/remotion/src/compositions/YedinizmiMobileExperience");
      return { component: m.YedinizmiMobileExperience, meta: m.YEDINIZMI_MOBILE_EXPERIENCE };
    }
  }
}
