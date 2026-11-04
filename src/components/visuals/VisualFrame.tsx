import type { Accent } from "@/data/projects";

export const accentVar: Record<Accent, string> = {
  blue: "var(--c-blue)",
  cyan: "var(--c-cyan)",
  violet: "var(--c-violet)",
  amber: "var(--c-amber)",
};

interface Props {
  title: string;
  accent: Accent;
  children: React.ReactNode;
  className?: string;
  /** Konsept önizleme etiketi göster */
  concept?: boolean;
  toolbar?: React.ReactNode;
}

/** Proje görselleri için ortak "uygulama penceresi" çerçevesi. */
export function VisualFrame({ title, accent, children, className = "", concept = true, toolbar }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] border border-line-strong/70 bg-surface shadow-[0_50px_120px_-50px_var(--glow)] ${className}`}
      style={{ "--glow": `color-mix(in oklab, ${accentVar[accent]} 55%, transparent)`, "--accent": accentVar[accent] } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line bg-night/70 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="truncate font-mono text-[11px] text-muted">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {toolbar}
          {concept && (
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
              Konsept
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
