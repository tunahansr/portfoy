"use client";

import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import type { DemoAction, MobileApp } from "@/data/mobile-apps";
import type { DemoState } from "./state";

/** Telefonun mantıksal çözünürlüğü (iPhone 14/15 sınıfı) */
export const CANVAS_W = 390;
export const CANVAS_H = 844;
export const STATUS_H = 54;
export const HOME_H = 34;

export interface ScreenProps {
  app: MobileApp;
  state: DemoState;
  dispatch: (action: DemoAction) => void;
  go: (viewId: string) => void;
  reduced: boolean;
  /** Ekran şu an görünür ve geçişi tamamlanmış mı */
  active: boolean;
}

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Uygulama temasına göre telefon içi renk değişkenleri */
export function themeVars(app: MobileApp): CSSProperties {
  const base =
    app.id === "erp-mobil"
      ? { bg: "#F2F4F9", card: "#FFFFFF", card2: "#E9EDF5", text: "#0C1424", muted: "#5B6578", line: "#DEE3EC" }
      : app.theme === "light"
        ? { bg: "#F7F4EF", card: "#FFFFFF", card2: "#F0EBE3", text: "#17140F", muted: "#6F675C", line: "#E7E0D5" }
        : app.id === "catkapi-operasyon"
          ? { bg: "#0B0D11", card: "#14171D", card2: "#1B1F27", text: "#F3F5F8", muted: "#9AA3B2", line: "#252A34" }
          : { bg: "#090C12", card: "#121722", card2: "#192030", text: "#F3F5F8", muted: "#98A2B3", line: "#222A3A" };
  return {
    "--p-bg": base.bg,
    "--p-card": base.card,
    "--p-card-2": base.card2,
    "--p-text": base.text,
    "--p-muted": base.muted,
    "--p-line": base.line,
    "--p-accent": app.accentHex,
    "--p-accent-2": app.secondaryHex,
    "--p-on-accent": app.accent === "blue" ? "#FFFFFF" : "#1A1206",
  } as CSSProperties;
}

/* ───────────── Durum çubuğu ───────────── */

export function StatusBar({ tone }: { tone: "light" | "dark" }) {
  const c = tone === "light" ? "#0B0D12" : "#FFFFFF";
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[54px] items-center justify-between pl-[42px] pr-[30px] pt-[4px]"
      style={{ color: c }}
      aria-hidden
    >
      <span className="text-[17px] font-semibold tracking-[-0.01em] tabular-nums">09:41</span>
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c}>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c}>
          <path d="M8 2.4c2.2 0 4.2.8 5.7 2.2l1.2-1.3A10 10 0 0 0 8 .6 10 10 0 0 0 1.1 3.3l1.2 1.3A8.2 8.2 0 0 1 8 2.4Z" />
          <path d="M8 5.8c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.6 6.6 0 0 0 8 4a6.6 6.6 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Z" />
          <path d="M8 9.2c.5 0 .9.2 1.2.5L8 11 6.8 9.7c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke={c} strokeOpacity="0.4" />
          <rect x="2" y="2" width="18" height="9" rx="2.5" fill={c} />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill={c} fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

/* ───────────── Başlık ───────────── */

export function NavHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="flex h-[52px] items-center gap-2 px-4">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 grid size-9 place-items-center rounded-full bg-(--p-card) text-(--p-text) shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          aria-label="Geri"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[17px] font-semibold tracking-[-0.015em] text-(--p-text)">{title}</div>
        {subtitle ? <div className="truncate text-[12px] text-(--p-muted)">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function LargeTitle({ kicker, title, right }: { kicker?: string; title: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between px-5 pb-3 pt-2">
      <div>
        {kicker ? <div className="text-[13px] font-medium text-(--p-muted)">{kicker}</div> : null}
        <div className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-(--p-text)">{title}</div>
      </div>
      {right}
    </div>
  );
}

/* ───────────── Alt sekme çubuğu ───────────── */

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export function TabBar({
  items,
  active,
  onSelect,
}: {
  items: TabItem[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 border-t border-(--p-line) bg-(--p-bg)/90 backdrop-blur-xl"
      style={{ paddingBottom: HOME_H - 6 }}
    >
      <div className="flex h-[56px] items-stretch px-2">
        {items.map((t) => {
          const on = t.id === active;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              data-demo={`tab-${t.id}`}
              onClick={() => onSelect(t.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-[3px] text-[10.5px] font-medium transition-colors",
                on ? "text-(--p-accent)" : "text-(--p-muted)",
              )}
              aria-current={on ? "page" : undefined}
            >
              <Icon size={23} strokeWidth={on ? 2.3 : 1.8} />
              <span>{t.label}</span>
              {t.badge ? (
                <span className="absolute right-[calc(50%-20px)] top-[5px] grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#FF4D4F] px-1 text-[10px] font-semibold text-white">
                  {t.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── Küçük yapı taşları ───────────── */

export function Card({ className, children, style }: { className?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className={cn("rounded-[20px] bg-(--p-card) shadow-[0_1px_0_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.18)]", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function Pill({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold", className)}
      style={style}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  demo,
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  demo?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      data-demo={demo}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] bg-(--p-accent) text-[16px] font-semibold tracking-[-0.01em] text-(--p-on-accent) shadow-[0_10px_24px_-10px_var(--p-accent)] transition-transform active:scale-[0.98] disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Ekran gövdesi: durum çubuğu boşluğu + isteğe bağlı alt sekme boşluğu */
export function ScreenBody({
  children,
  withTabs,
  className,
}: {
  children: ReactNode;
  withTabs?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden bg-(--p-bg) text-(--p-text)", className)}
      style={{ paddingTop: STATUS_H, paddingBottom: withTabs ? 56 + HOME_H - 6 : 0 }}
    >
      {children}
    </div>
  );
}
