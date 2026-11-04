"use client";

import { useRef, useState } from "react";
import { Smartphone, Server, ChefHat, Bike, MapPinCheck } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/components/motion/MotionProvider";
import { getDictionary } from "@/i18n";

const t = getDictionary();
const icons = [Smartphone, Server, ChefHat, Bike, MapPinCheck];

/**
 * Data Journey: bir siparişin müşteri uygulamasından teslimata yolculuğu.
 * Masaüstü: bölüm sabitlenir (pin), kaydırma ilerlemesi paketi hat üzerinde taşır.
 * Mobil / hareket azaltılmış: dikey zaman çizelgesi, kaydırmayla dolan çizgi (pin yok).
 */
export function DataJourney() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { reduced } = useMotionPref();
  const steps = t.journey.steps;

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track-fill]");
        const packet = root.current!.querySelector<HTMLElement>("[data-packet]");
        const st = ScrollTrigger.create({
          trigger: root.current!.querySelector("[data-pin]"),
          start: "top top+=80",
          end: "+=1600",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (track) track.style.transform = `scaleX(${p})`;
            if (packet) packet.style.left = `${p * 100}%`;
            setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
          },
        });
        return () => st.kill();
      });
      mm.add("(max-width: 1023px)", () => {
        const fill = root.current!.querySelector<HTMLElement>("[data-vfill]");
        const st = ScrollTrigger.create({
          trigger: root.current!.querySelector("[data-vlist]"),
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
          onUpdate: (self) => {
            if (fill) fill.style.transform = `scaleY(${self.progress})`;
            setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999)));
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  const all = reduced; // hareket azaltılmışsa tüm adımlar aktif görünür

  return (
    <section ref={root} id="yolculuk" aria-labelledby="yolculuk-baslik" className="relative bg-graphite">
      <div data-pin className="container-x section-y lg:flex lg:min-h-[calc(100svh-80px)] lg:flex-col lg:justify-center lg:py-16">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-cyan">04</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {t.journey.eyebrow}
        </p>
        <h2 id="yolculuk-baslik" className="mt-5 font-display text-[length:var(--text-display)] font-semibold leading-[0.98] tracking-[-0.03em]">
          {t.journey.title}
        </h2>
        <p className="mt-5 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted">{t.journey.intro}</p>

        {/* Masaüstü yatay hat */}
        <div className="relative mt-16 hidden lg:block">
          <div className="relative h-px bg-line">
            <div data-track-fill className="absolute inset-0 origin-left bg-gradient-to-r from-cyan via-blue to-amber" style={{ transform: all ? "scaleX(1)" : "scaleX(0)" }} />
            <span data-packet aria-hidden className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_24px_6px_rgba(255,181,71,0.35)]" style={{ left: all ? "100%" : "0%" }} />
          </div>
          <ol className="mt-10 grid grid-cols-5 gap-6">
            {steps.map((s, i) => {
              const Icon = icons[i];
              const on = all || i <= active;
              return (
                <li key={s.id} className={`transition-colors duration-500 ${on ? "" : "[&_h3]:text-muted"}`} aria-current={i === active && !all ? "step" : undefined}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors duration-500 ${i === active && !all ? "border-amber/70 bg-amber/10 text-amber" : on ? "border-cyan/50 text-cyan" : "border-line text-dim"}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-4 font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-display text-lg font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobil / tablet dikey zaman çizelgesi */}
        <ol data-vlist className="relative mt-12 grid gap-8 pl-10 lg:hidden">
          <span aria-hidden className="absolute bottom-2 left-[1.05rem] top-2 w-px bg-line" />
          <span aria-hidden data-vfill className="absolute bottom-2 left-[1.05rem] top-2 w-px origin-top bg-gradient-to-b from-cyan to-amber" style={{ transform: all ? "scaleY(1)" : "scaleY(0)" }} />
          {steps.map((s, i) => {
            const Icon = icons[i];
            const on = all || i <= active;
            return (
              <li key={s.id} className="relative">
                <span className={`absolute -left-10 top-0 flex h-9 w-9 items-center justify-center rounded-xl border bg-graphite transition-colors duration-500 ${on ? "border-cyan/60 text-cyan" : "border-line text-dim"}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-medium">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
