/** TŞ monogramı: bir veri düğümü + bağlantı çizgisi olarak çizilmiş özgün işaret. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" stroke="var(--c-line-strong)" strokeWidth="1.5" />
      <path d="M8 10.5h11M13.5 10.5V23" stroke="var(--c-text)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17.5 17.2c1-.9 2.3-1.3 3.6-1.1 1.6.3 2.6 1.4 2.4 2.7-.4 2.5-6.3 1.6-6.4 4.2 0 1.1 1 1.9 2.6 2 1.3 0 2.5-.4 3.4-1.2" stroke="var(--c-cyan)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="10.5" r="2" fill="var(--c-amber)" />
    </svg>
  );
}
