"use client";

import { useEffect, useRef } from "react";
import { useMotionPref } from "@/components/motion/MotionProvider";

/**
 * SVG path'leri boyunca veri paketlerini hareket ettirir (requestAnimationFrame).
 * `[data-packet-for="<pathId>"]` öğeleri ilgili `<path id>` üzerinde ilerler.
 * Görünür değilken veya hareket azaltıldığında durur (paketler gizlenir).
 */
export function usePacketFlow<T extends SVGSVGElement>(speed = 0.22) {
  const ref = useRef<T>(null);
  const { reduced } = useMotionPref();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const packets = Array.from(svg.querySelectorAll<SVGGraphicsElement>("[data-packet-for]"));
    const items = packets
      .map((el) => {
        const path = svg.querySelector<SVGPathElement>(`#${el.dataset.packetFor}`);
        if (!path) return null;
        return { el, path, len: path.getTotalLength(), offset: Number(el.dataset.offset ?? 0), dur: Number(el.dataset.speed ?? 1) };
      })
      .filter(Boolean) as { el: SVGGraphicsElement; path: SVGPathElement; len: number; offset: number; dur: number }[];

    if (reduced) {
      items.forEach((i) => i.el.setAttribute("opacity", "0"));
      return;
    }

    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      for (const it of items) {
        const f = (t * speed * it.dur + it.offset) % 1;
        const p = it.path.getPointAtLength(f * it.len);
        it.el.setAttribute("transform", `translate(${p.x} ${p.y})`);
        it.el.setAttribute("opacity", String(Math.min(1, Math.min(f, 1 - f) * 8)));
      }
      if (running) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(svg);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced, speed]);

  return ref;
}
