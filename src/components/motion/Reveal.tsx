"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "./MotionProvider";

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "ul" | "ol" | "header" | "article";
  /** Çocuklar içinde `[data-reveal]` olanlar sırayla görünür; yoksa kapsayıcının kendisi. */
  stagger?: number;
  y?: number;
  start?: string;
};

/**
 * Kaydırma ile beliriş (GSAP ScrollTrigger). İçerik SSR'da görünürdür; animasyon yalnızca
 * istemcide ve hareket açıkken uygulanır, bir kez oynar, unmount'ta temizlenir.
 */
export function Reveal({ as = "div", stagger = 0.08, y = 28, start = "top 85%", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotionPref();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
      const targets = items.length ? Array.from(items) : [el];
      // Zaten görünür alandaysa (ör. sayfa ortasından yükleme) animasyonsuz bırak
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) return;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} {...rest}>
      {children}
    </Tag>
  );
}
