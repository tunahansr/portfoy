"use client";

import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { CANVAS_H, CANVAS_W, cn } from "./kit";

/**
 * Toplam yükseklik / genişlik oranı (çerçeve + ekran). Ekran 390×844 mantıksal pikseldir;
 * genişlik, yükseklik sınırına (min(720px, 74svh)) göre hesaplanır, kapsayıcıyı asla aşmaz.
 */
const FRAME_RATIO = 2.05;
export const PHONE_MAX_HEIGHT = "min(720px, 74svh)";

export interface PhoneFrameProps {
  children?: ReactNode;
  className?: string;
  /** Cihaz bölgesi için erişilebilir ad */
  label?: string;
  style?: CSSProperties;
}

/**
 * Titanyum çerçeveli, dinamik adalı modern telefon. İçerik 390×844 mantıksal pikselde
 * tasarlanır ve CSS ölçeğiyle her boyutta birebir aynı görünür.
 */
export const PhoneFrame = forwardRef<HTMLDivElement, PhoneFrameProps>(function PhoneFrame(
  { children, className, label, style },
  canvasRef,
) {
  const screenRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Ölçek: CSS (tan(atan2())) ile hesaplanır; desteklemeyen tarayıcılar için ResizeObserver yedeği.
  useEffect(() => {
    const screen = screenRef.current;
    const inner = innerRef.current;
    if (!screen || !inner || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) inner.style.setProperty("--phone-scale", String(w / CANVAS_W));
    });
    ro.observe(screen);
    return () => ro.disconnect();
  }, []);

  const setInner = (el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (typeof canvasRef === "function") canvasRef(el);
    else if (canvasRef) canvasRef.current = el;
  };

  return (
    <div
      className={cn("relative mx-auto select-none", className)}
      style={{
        width: `min(100%, calc(${PHONE_MAX_HEIGHT} / ${FRAME_RATIO}))`,
        containerType: "inline-size",
        ...style,
      }}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      {/* yan tuşlar (çerçeve sınırı içinde kalır) */}
      <span aria-hidden className="absolute left-0 top-[18%] h-[3.2%] w-[1.4cqw] rounded-l-[1cqw] bg-gradient-to-r from-[#3a3d44] to-[#8c9099]" />
      <span aria-hidden className="absolute left-0 top-[24.5%] h-[6.5%] w-[1.4cqw] rounded-l-[1cqw] bg-gradient-to-r from-[#3a3d44] to-[#8c9099]" />
      <span aria-hidden className="absolute left-0 top-[32.5%] h-[6.5%] w-[1.4cqw] rounded-l-[1cqw] bg-gradient-to-r from-[#3a3d44] to-[#8c9099]" />
      <span aria-hidden className="absolute right-0 top-[27%] h-[10%] w-[1.4cqw] rounded-r-[1cqw] bg-gradient-to-l from-[#3a3d44] to-[#8c9099]" />

      {/* titanyum gövde */}
      <div
        className="relative mx-[0.8cqw] p-[1.1cqw]"
        style={{
          borderRadius: "16.5cqw",
          background:
            "linear-gradient(145deg, #9a9ea6 0%, #4b4f57 18%, #2a2d33 40%, #5d616a 62%, #2b2e34 80%, #8d919a 100%)",
          boxShadow:
            "inset 0 0 0 0.25cqw rgba(255,255,255,0.18), inset 0 0.5cqw 1cqw rgba(255,255,255,0.12), 0 2cqw 6cqw -1cqw rgba(0,0,0,0.65), 0 0 0 0.2cqw rgba(0,0,0,0.6)",
        }}
      >
        {/* siyah çerçeve (bezel) */}
        <div className="relative bg-[#030304] p-[2.4cqw]" style={{ borderRadius: "15.4cqw", boxShadow: "inset 0 0 0 0.3cqw #15161a" }}>
          {/* ekran */}
          <div
            ref={screenRef}
            className="relative isolate overflow-hidden bg-black"
            style={{
              aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
              borderRadius: "12.8cqw",
              clipPath: "inset(0 round 12.8cqw)",
              containerType: "inline-size",
            }}
          >
            <div
              ref={setInner}
              className="absolute left-0 top-0 origin-top-left overflow-hidden font-sans antialiased"
              style={
                {
                  width: CANVAS_W,
                  height: CANVAS_H,
                  "--phone-scale": "tan(atan2(100cqw, 390px))",
                  transform: "scale(var(--phone-scale, 0.8))",
                } as CSSProperties
              }
            >
              {children}
              {/* dinamik ada */}
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-[11px] z-50 h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black">
                <span className="absolute right-[22px] top-1/2 size-[11px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2c3a5a,#0a0d16_60%)] shadow-[0_0_0_1.5px_#0b0c10]" />
              </div>
              {/* ana ekran çubuğu */}
              <div aria-hidden className="pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-current opacity-80 mix-blend-difference" style={{ color: "#fff" }} />
            </div>
            {/* cam yansıması */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[60]"
              style={{
                borderRadius: "inherit",
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 22%, transparent 38%, transparent 70%, rgba(255,255,255,0.04) 100%)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
