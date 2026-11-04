"use client";

import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { getMobileApp, mobileApps, type DemoAction, type MobileApp } from "@/data/mobile-apps";
import { CANVAS_H, CANVAS_W } from "./kit";
import { demoReducer, initialDemoState, type DemoState } from "./state";

/** Kullanıcı etkileşiminden sonra otomatik demonun yeniden başlaması için beklenen süre */
export const IDLE_RESUME_MS = 8000;
const TAP_MS = 520;
const DEFAULT_WAIT = 2100;

export interface TapPoint {
  x: number;
  y: number;
  n: number;
}

interface Ctl {
  appId: string;
  viewId: string;
  /** 1 ileri (push), -1 geri, 0 yumuşak geçiş */
  dir: number;
  step: number;
  demo: DemoState;
  tap: TapPoint | null;
  announce: string;
  tapCount: number;
}

type CtlAction =
  | { type: "app"; appId: string }
  | { type: "navigate"; viewId: string; user: boolean }
  | { type: "demo"; action: DemoAction }
  | { type: "tap"; x: number; y: number }
  | { type: "stepDone" };

function firstStepFor(app: MobileApp, viewId: string) {
  const i = app.demo.findIndex((s) => s.view === viewId);
  return i < 0 ? 0 : i;
}

function viewIndex(app: MobileApp, viewId: string) {
  return app.views.findIndex((v) => v.id === viewId);
}

function appOf(id: string) {
  return getMobileApp(id) ?? mobileApps[0];
}

function initCtl(appId: string): Ctl {
  const app = appOf(appId);
  return {
    appId: app.id,
    viewId: app.demo[0]?.view ?? app.views[0].id,
    dir: 0,
    step: 0,
    demo: initialDemoState,
    tap: null,
    announce: "",
    tapCount: 0,
  };
}

function ctlReducer(s: Ctl, a: CtlAction): Ctl {
  const app = appOf(s.appId);
  switch (a.type) {
    case "app": {
      if (a.appId === s.appId) return s;
      const next = initCtl(a.appId);
      return { ...next, announce: `${appOf(a.appId).name} seçildi. ${appOf(a.appId).views[0].title} ekranı.`, tapCount: s.tapCount };
    }
    case "navigate": {
      if (a.viewId === s.viewId) return s;
      const view = app.views.find((v) => v.id === a.viewId);
      if (!view) return s;
      const from = viewIndex(app, s.viewId);
      const to = viewIndex(app, a.viewId);
      return {
        ...s,
        viewId: a.viewId,
        dir: to >= from ? 1 : -1,
        step: firstStepFor(app, a.viewId),
        demo: view.enter ? demoReducer(s.demo, view.enter) : s.demo,
        tap: null,
        announce: a.user ? `${view.title} ekranı. ${view.description}` : s.announce,
      };
    }
    case "demo":
      return { ...s, demo: demoReducer(s.demo, a.action) };
    case "tap":
      return { ...s, tap: { x: a.x, y: a.y, n: s.tapCount + 1 }, tapCount: s.tapCount + 1 };
    case "stepDone": {
      const cur = app.demo[s.step];
      const demo = cur?.action ? demoReducer(s.demo, cur.action) : s.demo;
      const nextStep = s.step + 1;
      if (nextStep >= app.demo.length) {
        const first = app.demo[0].view;
        return { ...s, step: 0, viewId: first, dir: first === s.viewId ? s.dir : 0, demo: initialDemoState, tap: null };
      }
      const nextView = app.demo[nextStep].view;
      const from = viewIndex(app, s.viewId);
      const to = viewIndex(app, nextView);
      return {
        ...s,
        step: nextStep,
        demo,
        tap: null,
        viewId: nextView,
        dir: nextView === s.viewId ? s.dir : to >= from ? 1 : -1,
      };
    }
    default:
      return s;
  }
}

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}
const getDocVisible = () => document.visibilityState !== "hidden";
const getDocVisibleServer = () => true;

/**
 * Önizleme denetleyicisi: ekran durumu, yerel demo durumu ve otomatik oynatma.
 * Otomatik oynatma; kullanıcı etkileşiminde duraklar, 8 sn boşta kalınca devam eder,
 * ekran dışındayken / sekme gizliyken / hareket azaltıldığında çalışmaz.
 */
export function useDemoController({
  initialAppId,
  reduced,
  rootRef,
  canvasRef,
}: {
  initialAppId: string;
  reduced: boolean;
  rootRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLDivElement | null>;
}) {
  const [ctl, dispatch] = useReducer(ctlReducer, initialAppId, initCtl);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const docVisible = useSyncExternalStore(subscribeVisibility, getDocVisible, getDocVisibleServer);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const app = appOf(ctl.appId);
  const running = !reduced && playing && !hold && inView && docVisible;

  // Görünürlük
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [rootRef]);

  // Boşta kalma zamanlayıcısını temizle
  useEffect(
    () => () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    },
    [],
  );

  const markInteraction = useCallback(() => {
    setHold(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setHold(false), IDLE_RESUME_MS);
  }, []);

  // Otomatik demo adımı
  useEffect(() => {
    if (!running) return;
    const step = app.demo[ctl.step];
    if (!step) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        const pos = step.target ? locate(canvasRef.current, step.target) : null;
        if (pos) {
          dispatch({ type: "tap", x: pos.x, y: pos.y });
          timers.push(setTimeout(() => dispatch({ type: "stepDone" }), TAP_MS));
        } else {
          dispatch({ type: "stepDone" });
        }
      }, step.wait ?? DEFAULT_WAIT),
    );
    return () => timers.forEach(clearTimeout);
  }, [running, app, ctl.step, ctl.viewId, canvasRef]);

  const viewIdx = viewIndex(app, ctl.viewId);
  const navigate = useCallback((viewId: string) => dispatch({ type: "navigate", viewId, user: true }), []);
  const next = useCallback(() => {
    navigate(app.views[(viewIdx + 1) % app.views.length].id);
  }, [app, viewIdx, navigate]);
  const prev = useCallback(() => {
    navigate(app.views[(viewIdx - 1 + app.views.length) % app.views.length].id);
  }, [app, viewIdx, navigate]);
  const selectApp = useCallback((appId: string) => dispatch({ type: "app", appId }), []);
  const demoDispatch = useCallback((action: DemoAction) => dispatch({ type: "demo", action }), []);

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
    setHold(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  return {
    app,
    view: app.views[Math.max(0, viewIdx)],
    viewIdx: Math.max(0, viewIdx),
    ctl,
    running,
    playing,
    autoplayAvailable: !reduced,
    navigate,
    next,
    prev,
    selectApp,
    demoDispatch,
    togglePlay,
    markInteraction,
  };
}

/** data-demo hedefinin telefon tuvali içindeki mantıksal konumunu bulur ve hafifçe "basar". */
function locate(canvas: HTMLDivElement | null, target: string) {
  if (!canvas) return null;
  const el = canvas.querySelector<HTMLElement>(`[data-view-active="true"] [data-demo="${CSS.escape(target)}"]`);
  if (!el) return null;
  const c = canvas.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  if (c.width === 0 || c.height === 0) return null;
  const x = ((r.left + r.width / 2 - c.left) / c.width) * CANVAS_W;
  const y = ((r.top + r.height / 2 - c.top) / c.height) * CANVAS_H;
  try {
    el.animate([{ scale: "1" }, { scale: "0.95" }, { scale: "1" }], {
      duration: 320,
      easing: "cubic-bezier(0.33, 1, 0.68, 1)",
    });
  } catch {}
  return { x, y };
}
