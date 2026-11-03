"use client";

import { useCallback, useId, useMemo, useRef, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Info, Pause, Play } from "lucide-react";
import { CONCEPT_LABEL, mobileApps, type MobileApp } from "@/data/mobile-apps";
import { useMotionPref } from "@/components/motion/MotionProvider";
import { PhoneFrame } from "./PhoneFrame";
import { PhoneScreen } from "./PhoneScreen";
import { cn } from "./kit";
import { useDemoController } from "./useDemoController";

export interface MobilePreviewProps {
  /** Gösterilecek uygulamalar (varsayılan: tümü) */
  appIds?: string[];
  initialAppId?: string;
  variant?: "showcase" | "compact";
  className?: string;
}

const ACCENT_GLOW: Record<MobileApp["accent"], string> = {
  amber: "rgba(255,181,71,0.34)",
  blue: "rgba(61,123,255,0.38)",
  cyan: "rgba(69,224,240,0.32)",
};

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getDesktop = () => window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
const getDesktopServer = () => false;

/** Uygulama için gösterilecek etiket: gerçek ekran yoksa "Konsept önizleme". */
export function previewLabel(app: MobileApp) {
  return app.preview === "real" && app.verified ? "Gerçek ekranlar" : CONCEPT_LABEL;
}

export function MobilePreview({ appIds, initialAppId, variant = "showcase", className }: MobilePreviewProps) {
  const { reduced } = useMotionPref();
  const apps = useMemo(() => {
    const list = appIds?.length ? mobileApps.filter((a) => appIds.includes(a.id)) : mobileApps;
    return list.length ? list : mobileApps;
  }, [appIds]);
  const startId = initialAppId && apps.some((a) => a.id === initialAppId) ? initialAppId : apps[0].id;

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const c = useDemoController({ initialAppId: startId, reduced, rootRef, canvasRef });
  const { app, view, viewIdx, ctl } = c;

  const uid = useId();
  const panelId = `${uid}-panel`;
  const descId = `${uid}-desc`;
  const label = previewLabel(app);

  /* ── 3D eğim (yalnızca masaüstü + hareket açık + showcase) ── */
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktop, getDesktopServer);
  const tilt = variant === "showcase" && desktop && !reduced;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 20, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 120, damping: 20, mass: 0.6 });

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 7);
    rx.set(-py * 5);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  /* ── Etkileşim: otomatik demoyu duraklat ── */
  const onPointerDownCapture = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-no-hold]")) return;
    c.markInteraction();
  };
  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-no-hold]")) return;
    if (e.key === "Tab" || e.key === "Shift") return;
    c.markInteraction();
  };

  const onPhoneKey = (e: KeyboardEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      c.next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      c.prev();
    }
  };

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const swipe = Math.abs(info.offset.x) > 56 || Math.abs(info.velocity.x) > 500;
      if (!swipe) return;
      if (info.offset.x < 0) c.next();
      else c.prev();
    },
    [c],
  );

  /* ── Telefon ── */
  const phone = (
    <div className="relative" style={{ perspective: tilt ? 1600 : undefined }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] inset-y-[8%] -z-10 rounded-full blur-3xl transition-[background] duration-700"
        style={{ background: `radial-gradient(closest-side, ${ACCENT_GLOW[app.accent]}, transparent)` }}
      />
      <motion.div
        style={
          tilt
            ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }
            : undefined
        }
      >
        <motion.div
          className="relative cursor-grab touch-pan-y active:cursor-grabbing"
          style={tilt ? { rotateY: -9, rotateX: 4 } : undefined}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragSnapToOrigin
          dragMomentum={false}
          onDragStart={c.markInteraction}
          onDragEnd={onDragEnd}
        >
          <div
            role="group"
            aria-roledescription="telefon önizlemesi"
            aria-label={`${app.name}, ${view.title} ekranı (${label}). Ekranlar arasında sol ve sağ ok tuşlarıyla gezinebilirsiniz.`}
            aria-describedby={descId}
            tabIndex={0}
            onKeyDown={onPhoneKey}
            className="rounded-[18%/8.5%] outline-offset-4"
          >
            <PhoneFrame ref={canvasRef}>
              <PhoneScreen
                app={app}
                view={view}
                dir={ctl.dir}
                state={ctl.demo}
                dispatch={c.demoDispatch}
                go={c.navigate}
                reduced={reduced}
                tap={ctl.tap}
              />
            </PhoneFrame>
          </div>
        </motion.div>
      </motion.div>
      {/* zemin gölgesi */}
      <div
        aria-hidden
        className="pointer-events-none mx-auto mt-3 h-4 w-[58%] rounded-[50%] bg-black/60 blur-xl"
      />
    </div>
  );

  /* ── Kontroller ── */
  const controls = (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={c.prev}
        aria-label="Önceki ekran"
        className="grid size-11 place-items-center rounded-full border border-line bg-surface/80 text-text transition-colors hover:border-line-strong hover:bg-surface-2"
      >
        <ChevronLeft size={18} />
      </button>
      <div className="flex h-11 items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3" role="group" aria-label="Ekranlar">
        {app.views.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => c.navigate(v.id)}
            aria-label={`${v.title} ekranına git`}
            aria-current={i === viewIdx ? "step" : undefined}
            className="group grid h-11 place-items-center px-[3px]"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all duration-300",
                i === viewIdx ? "w-5 bg-text" : "w-1.5 bg-dim group-hover:bg-muted",
              )}
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={c.next}
        aria-label="Sonraki ekran"
        className="grid size-11 place-items-center rounded-full border border-line bg-surface/80 text-text transition-colors hover:border-line-strong hover:bg-surface-2"
      >
        <ChevronRight size={18} />
      </button>
      {c.autoplayAvailable ? (
        <button
          type="button"
          data-no-hold
          onClick={c.togglePlay}
          aria-label={c.playing ? "Otomatik demoyu duraklat" : "Otomatik demoyu başlat"}
          aria-pressed={!c.playing}
          className="relative grid size-11 place-items-center rounded-full border border-line bg-surface/80 text-text transition-colors hover:border-line-strong hover:bg-surface-2"
        >
          {c.playing ? <Pause size={16} /> : <Play size={16} />}
          {c.running ? (
            <span className="absolute right-[9px] top-[9px] size-1.5 animate-[pulse-soft_1.6s_ease-in-out_infinite] rounded-full bg-amber" />
          ) : null}
        </button>
      ) : null}
    </div>
  );

  const conceptNote = (
    <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface/60 p-3.5 text-[13px] leading-relaxed text-muted">
      <Info size={16} className="mt-0.5 shrink-0 text-dim" />
      <p>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text">{label}</span>
        <br />
        {app.preview === "real"
          ? "Görseller üründen alınmış ekranlardır."
          : "Gerçek ekran görüntüsü yerine ürün akışına göre çizilmiş arayüz. Veriler yereldir ve temsilidir."}
        {app.note ? (
          <>
            <br />
            <span className="text-dim">{app.note}.</span>
          </>
        ) : null}
      </p>
    </div>
  );

  /* ── Uygulama seçici (tablist) ── */
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const i = apps.findIndex((a) => a.id === app.id);
    const n =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? apps.length - 1
          : e.key === "ArrowRight" || e.key === "ArrowDown"
            ? (i + 1) % apps.length
            : (i - 1 + apps.length) % apps.length;
    c.selectApp(apps[n].id);
    const btn = e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[n];
    btn?.focus();
  };

  const tablist = (compact: boolean) =>
    apps.length > 1 ? (
      <div
        role="tablist"
        aria-label="Uygulama seçimi"
        aria-orientation={compact ? "horizontal" : undefined}
        onKeyDown={onTabKey}
        className={cn(
          compact
            ? "flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden",
        )}
      >
        {apps.map((a) => {
          const on = a.id === app.id;
          return (
            <button
              key={a.id}
              type="button"
              role="tab"
              id={`${uid}-tab-${a.id}`}
              aria-selected={on}
              aria-controls={panelId}
              tabIndex={on ? 0 : -1}
              onClick={() => c.selectApp(a.id)}
              className={cn(
                "group relative shrink-0 rounded-2xl border text-left transition-colors",
                compact || variant === "compact"
                  ? "min-h-11 px-4 py-2.5 text-[13px] font-medium"
                  : "min-h-11 px-4 py-2.5 text-[13px] font-medium lg:w-full lg:px-5 lg:py-4",
                on ? "border-line-strong bg-surface-2 text-text" : "border-line bg-surface/40 text-muted hover:border-line-strong hover:text-text",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full transition-opacity"
                  style={{ background: a.accentHex, opacity: on ? 1 : 0.35 }}
                />
                <span className={cn("whitespace-nowrap", variant === "showcase" && !compact && "lg:text-[15px] lg:font-semibold")}>
                  {a.name}
                </span>
              </span>
              {variant === "showcase" && !compact ? (
                <span className="mt-1 hidden pl-3.5 text-[13px] font-normal leading-snug text-dim lg:block">{a.description}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    ) : null;

  const live = (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {ctl.announce}
    </div>
  );

  /* ── COMPACT ── */
  if (variant === "compact") {
    return (
      <div
        ref={rootRef}
        className={cn("flex w-full min-w-0 flex-col items-center gap-4", className)}
        onPointerDownCapture={onPointerDownCapture}
        onKeyDownCapture={onKeyDownCapture}
      >
        {apps.length > 1 ? <div className="flex w-full justify-center">{tablist(true)}</div> : null}
        <div id={panelId} role={apps.length > 1 ? "tabpanel" : undefined} className="w-full min-w-0">
          {phone}
        </div>
        {controls}
        <p id={descId} className="max-w-sm text-center text-[13px] leading-relaxed text-muted">
          <span className="font-medium text-text">{view.title}</span> · {view.description}
        </p>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-dim">
          {label}
          {app.note ? ` · ${app.note}` : ""}
        </span>
        {live}
      </div>
    );
  }

  /* ── SHOWCASE ── */
  return (
    <div
      ref={rootRef}
      className={cn(
        "grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,clamp(280px,27vw,370px))_minmax(0,1fr)] lg:items-center lg:gap-12 xl:gap-16",
        className,
      )}
      onPointerDownCapture={onPointerDownCapture}
      onKeyDownCapture={onKeyDownCapture}
    >
      {/* sol: uygulama seçici */}
      <div className="min-w-0 lg:self-center">
        <div className="eyebrow mb-3 hidden lg:block">Uygulamalar</div>
        {tablist(false)}
      </div>

      {/* orta: telefon */}
      <div
        id={panelId}
        role={apps.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={apps.length > 1 ? `${uid}-tab-${app.id}` : undefined}
        className="flex min-w-0 flex-col items-center gap-5"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className="w-full max-w-[340px] lg:max-w-none">{phone}</div>
        {controls}
      </div>

      {/* sağ: ekran listesi + açıklama */}
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <div className="eyebrow mb-2">
            Ekran {viewIdx + 1} / {app.views.length}
          </div>
          <h3 className="font-display text-[1.45rem] font-semibold leading-tight tracking-[-0.02em] text-text">{view.title}</h3>
          <p id={descId} className="mt-2 text-[15px] leading-relaxed text-muted">
            {view.description}
          </p>
        </div>
        <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-1" aria-label={`${app.name} ekranları`}>
          {app.views.map((v, i) => {
            const on = i === viewIdx;
            return (
              <li key={v.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => c.navigate(v.id)}
                  onKeyDown={onPhoneKey}
                  aria-current={on ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-[13.5px] transition-colors",
                    on ? "border-line-strong bg-surface-2 text-text" : "border-transparent text-muted hover:bg-surface/60 hover:text-text",
                  )}
                >
                  <span
                    className={cn("font-mono text-[11px] tabular-nums", on ? "" : "text-dim")}
                    style={on ? { color: app.accentHex } : undefined}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-tight">{v.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
        {conceptNote}
      </div>
      {live}
    </div>
  );
}
