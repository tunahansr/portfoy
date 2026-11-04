"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_STORAGE_KEY as STORAGE_KEY } from "@/lib/motion-pref";

type MotionPref = "system" | "reduce" | "full";

interface MotionContextValue {
  /** Hareket azaltılmış mı (sistem tercihi veya kullanıcı seçimi) */
  reduced: boolean;
  pref: MotionPref;
  setPref: (p: MotionPref) => void;
  toggle: () => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getSystem = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getSystemServer = () => false;

function readStoredPref(): MotionPref {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "reduce" || v === "full") return v;
  } catch {}
  return "system";
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const systemReduced = useSyncExternalStore(subscribeSystem, getSystem, getSystemServer);
  const [pref, setPrefState] = useState<MotionPref>("system");

  useEffect(() => {
    // localStorage yalnızca istemcide okunabilir; ilk boyamada <head> script'i sınıfı zaten ayarlar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefState(readStoredPref());
  }, []);

  const reduced = pref === "reduce" || (pref === "system" && systemReduced);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
    gsap.globalTimeline.timeScale(1);
  }, [reduced]);

  // Lenis yumuşak kaydırma: yalnızca hareket açıkken ve masaüstü işaretçide.
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -64 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  const setPref = useCallback((p: MotionPref) => {
    setPrefState(p);
    try {
      if (p === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, p);
    } catch {}
  }, []);

  const toggle = useCallback(() => setPref(reduced ? "full" : "reduce"), [reduced, setPref]);

  const value = useMemo(() => ({ reduced, pref, setPref, toggle }), [reduced, pref, setPref, toggle]);
  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotionPref() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotionPref must be used within MotionProvider");
  return ctx;
}
