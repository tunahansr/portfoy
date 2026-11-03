import Link from "next/link";
import { getDictionary } from "@/i18n";

const t = getDictionary();

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="font-mono text-sm text-cyan">404</p>
      <h1 className="mt-4 font-display text-[length:var(--text-display)] font-semibold tracking-[-0.03em]">{t.notFound.title}</h1>
      <p className="mt-4 max-w-lg text-muted">{t.notFound.text}</p>
      <Link href="/" className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-text px-6 font-medium text-graphite hover:bg-cyan">
        {t.notFound.home}
      </Link>
    </section>
  );
}
