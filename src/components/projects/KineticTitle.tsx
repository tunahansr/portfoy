"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/components/motion/MotionProvider";

/**
 * Büyük proje isimleri için kinetik tipografi: kelimeler maske içinden yükselir,
 * kaydırma ilerledikçe hafif yatay kayma (scrub) uygulanır. Metin her zaman gerçek metindir.
 */
export function KineticTitle({ text, as = "h3", className = "", id }: { text: string; as?: "h2" | "h3"; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { reduced } = useMotionPref();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const words = ref.current.querySelectorAll<HTMLElement>("[data-w]");
      gsap.from(words, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
      // Hafif yatay kayma yalnızca geniş ekranda (mobilde metin kenara taşmasın)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ref.current,
          { x: 12 },
          { x: -12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [reduced] },
  );

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span data-w className="inline-block">
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
