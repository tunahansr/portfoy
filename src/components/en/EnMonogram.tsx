import { Monogram } from "@/components/ui/Monogram";

/** Açık zemin için monogram: koyu tema değişkenleri yerel olarak ezilir. */
export function EnMonogram({ className = "" }: { className?: string }) {
  return (
    <span
      className="inline-flex"
      style={{ ["--c-text" as string]: "var(--c-ink)", ["--c-line-strong" as string]: "#d9d3c8", ["--c-cyan" as string]: "var(--c-brand)" }}
    >
      <Monogram className={className} />
    </span>
  );
}
