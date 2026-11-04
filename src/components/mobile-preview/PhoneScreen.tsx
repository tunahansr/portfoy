"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent, type Variants } from "motion/react";
import type { DemoAction, MobileApp, MobileView } from "@/data/mobile-apps";
import { motion as brandMotion } from "@/lib/brand";
import { CANVAS_W, StatusBar, themeVars } from "./kit";
import { screenRegistry, statusToneOverride } from "./screens/registry";
import type { DemoState } from "./state";
import type { TapPoint } from "./useDemoController";

/** Sekmeli uygulamalarda ekranlar arası geçiş yumuşak (iOS sekme davranışı), diğerlerinde push. */
const TAB_APPS = new Set(["catkapi-operasyon", "erp-mobil"]);

const pushVariants: Variants = {
  enter: (d: number) =>
    d === 0 ? { x: 0, opacity: 0, scale: 0.985 } : { x: d > 0 ? CANVAS_W : -CANVAS_W * 0.3, opacity: d > 0 ? 1 : 0.7, scale: 1 },
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) =>
    d === 0 ? { x: 0, opacity: 0, scale: 1 } : { x: d > 0 ? -CANVAS_W * 0.3 : CANVAS_W, opacity: d > 0 ? 0.6 : 1, scale: 1 },
};

const fadeVariants: Variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

const reducedVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function PhoneScreen({
  app,
  view,
  dir,
  state,
  dispatch,
  go,
  reduced,
  tap,
}: {
  app: MobileApp;
  view: MobileView;
  dir: number;
  state: DemoState;
  dispatch: (a: DemoAction) => void;
  go: (viewId: string) => void;
  reduced: boolean;
  tap: TapPoint | null;
}) {
  const Screen = screenRegistry[view.renderKey];
  const real = app.screens?.find((s) => s.viewId === view.id);
  const tone = statusToneOverride[view.renderKey] ?? app.theme;
  const tabs = TAB_APPS.has(app.id);
  const variants = reduced ? reducedVariants : tabs ? fadeVariants : pushVariants;
  const transition = reduced
    ? { duration: 0.12 }
    : tabs
      ? { duration: 0.32, ease: brandMotion.ease.out }
      : { duration: 0.5, ease: brandMotion.ease.out };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ ...themeVars(app), background: "var(--p-bg)" }}>
      <AnimatePresence initial={false} custom={dir}>
        <ScreenLayer
          key={`${app.id}:${view.id}`}
          dir={dir}
          variants={variants}
          transition={transition}
          shadow={!reduced && !tabs && dir !== 0}
          viewId={view.id}
        >
          {real ? (
            <Image src={real.src} alt={real.alt} fill sizes="(min-width: 1024px) 360px, 80vw" className="object-cover" />
          ) : (
            <Screen app={app} state={state} dispatch={dispatch} go={go} reduced={reduced} active />
          )}
        </ScreenLayer>
      </AnimatePresence>

      <StatusBar tone={tone} />

      {/* simüle dokunuş göstergesi */}
      <AnimatePresence>
        {tap ? (
          <motion.div
            key={tap.n}
            aria-hidden
            className="pointer-events-none absolute z-40"
            style={{ left: tap.x, top: tap.y }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <motion.span
              className="absolute -left-[22px] -top-[22px] size-[44px] rounded-full border-2 border-white/90"
              style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.25)" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1, 1.5], opacity: [0, 1, 0] }}
              transition={{ duration: 0.55, ease: brandMotion.ease.out, times: [0, 0.35, 1] }}
            />
            <motion.span
              className="absolute -left-[16px] -top-[16px] size-[32px] rounded-full bg-white/55 backdrop-blur-[2px]"
              style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.18)" }}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: [1.4, 0.85, 1], opacity: [0, 1, 0.9] }}
              transition={{ duration: 0.35, ease: brandMotion.ease.soft }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ScreenLayer({
  dir,
  variants,
  transition,
  shadow,
  viewId,
  children,
}: {
  dir: number;
  variants: Variants;
  transition: object;
  shadow: boolean;
  viewId: string;
  children: ReactNode;
}) {
  const present = useIsPresent();
  return (
    <motion.div
      custom={dir}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className="absolute inset-0"
      style={{ boxShadow: shadow ? "-12px 0 40px rgba(0,0,0,0.18)" : undefined }}
      data-view-active={present ? "true" : "false"}
      data-view={viewId}
      inert={!present}
    >
      {children}
    </motion.div>
  );
}
