"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/components/motion/MotionProvider";
import { getDictionary } from "@/i18n";

const t = getDictionary();

/**
 * Çalışma süreci: masaüstünde yükselen "merdiven" kompozisyonu; adımları birleştiren çizgi
 * kaydırmayla çizilir. Son adım (Sürekli İyileştirme) başa dönen bir döngü olarak işaretlenir.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotionPref();
  const steps = t.process.steps;

  useGSAP(
    () => {
      if (!root.current) return;
      const path = root.current.querySelector<SVGPathElement>("[data-process-line]");
      const wrap = path?.closest("div");
      // Çizgiyi adım işaretlerinin gerçek merkezlerinden geçir (yalnızca xl merdiven düzeninde görünür)
      const layout = () => {
        if (!path || !wrap) return;
        const base = wrap.getBoundingClientRect();
        const pts = Array.from(wrap.querySelectorAll<HTMLElement>("[data-dot]")).map((d) => {
          const r = d.getBoundingClientRect();
          return `${r.left - base.left + r.width / 2},${r.top - base.top + r.height / 2}`;
        });
        path.setAttribute("d", `M${pts.join(" L")}`);
      };
      layout();
      if (reduced) return;
      if (path && path.getTotalLength() > 0) {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 45%", scrub: 0.6 } },
        );
      }
      gsap.from(root.current.querySelectorAll("[data-step]"), {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current.querySelector("ol"), start: "top 80%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="surec" aria-labelledby="surec-baslik" className="section-y relative overflow-hidden bg-graphite">
      <div className="container-x">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-cyan">07</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {t.process.eyebrow}
        </p>
        <h2 id="surec-baslik" className="mt-5 max-w-4xl font-display text-[length:var(--text-display)] font-semibold leading-[0.98] tracking-[-0.03em]">
          {t.process.title}
        </h2>

        <div className="relative mt-16">
          <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible xl:block">
            <defs>
              <linearGradient id="process-grad" x1="0" x2="1">
                <stop offset="0" stopColor="var(--c-cyan)" />
                <stop offset="0.7" stopColor="var(--c-blue)" />
                <stop offset="1" stopColor="var(--c-amber)" />
              </linearGradient>
            </defs>
            <path data-process-line fill="none" stroke="url(#process-grad)" strokeWidth="1.5" />
          </svg>
          <ol className="relative grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {steps.map((s, i) => (
              <li
                key={s.title}
                data-step
                className="relative border-t border-line pt-5 xl:border-t-0 xl:pt-0"
                style={{ "--stair": `${(steps.length - 1 - i) * 2.2}rem` } as React.CSSProperties}
              >
                <div className="xl:mt-[var(--stair)]">
                  <span data-dot className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs ${i === steps.length - 1 ? "border-amber/70 bg-graphite text-amber" : "border-line-strong bg-graphite text-cyan"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-12 font-mono text-xs text-dim">↺ Sürekli iyileştirme, keşfi yeniden besler.</p>
        </div>
      </div>
    </section>
  );
}
