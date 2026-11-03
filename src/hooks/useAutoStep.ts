"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPref } from "@/components/motion/MotionProvider";

/**
 * Görünür alandayken `count` adım arasında otomatik ilerleyen sayaç.
 * Hareket azaltıldığında veya sekme gizliyken durur; kullanıcı `set` ile elle seçince
 * `pauseAfterInteract` ms boyunca otomatik ilerleme bekler.
 */
export function useAutoStep<T extends HTMLElement>(count: number, interval = 2600, pauseAfterInteract = 9000) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const pausedUntil = useRef(0);
  const { reduced } = useMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduced || count < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden || Date.now() < pausedUntil.current) return;
      setStep((s) => (s + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [inView, reduced, count, interval]);

  const set = (i: number) => {
    pausedUntil.current = Date.now() + pauseAfterInteract;
    setStep(((i % count) + count) % count);
  };

  return { ref, step, set, inView, reduced };
}
