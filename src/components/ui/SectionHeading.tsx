import { Reveal } from "@/components/motion/Reveal";

interface Props {
  eyebrow: string;
  id: string;
  index?: string;
  children: React.ReactNode;
  intro?: string;
  className?: string;
  size?: "display" | "title";
}

/** Bölüm başlığı: numaralı eyebrow + büyük editoryal başlık + isteğe bağlı giriş metni. */
export function SectionHeading({ eyebrow, id, index, children, intro, className = "", size = "display" }: Props) {
  return (
    <Reveal as="header" className={className}>
      <p data-reveal className="eyebrow flex items-center gap-3">
        {index && <span className="text-cyan">{index}</span>}
        <span className="h-px w-8 bg-line-strong" aria-hidden />
        {eyebrow}
      </p>
      <h2
        id={id}
        data-reveal
        className={`mt-5 font-display font-semibold leading-[0.98] tracking-[-0.03em] text-balance-safe ${
          size === "display" ? "text-[length:var(--text-display)]" : "text-[length:var(--text-title)]"
        }`}
      >
        {children}
      </h2>
      {intro && (
        <p data-reveal className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
