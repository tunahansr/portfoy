import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { getDictionary } from "@/i18n";

/**
 * Hiçbir rotaya uymayan adresler için 404. Site iki kök layout'tan oluştuğu için
 * (TR: app/(site), EN: app/(en)) tek bir layout'tan 404 üretilemez; bu sayfa ikisinden bağımsızdır.
 */
const t = getDictionary();

export const metadata: Metadata = {
  title: `404 · ${t.notFound.title}`,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${fontVariables} antialiased`}>
      <body className="min-h-svh">
        <main className="container-x flex min-h-svh flex-col justify-center py-16">
          <p className="font-mono text-sm text-cyan">404</p>
          <h1 className="mt-4 font-display text-[length:var(--text-display)] font-semibold tracking-[-0.03em]">{t.notFound.title}</h1>
          <p className="mt-4 max-w-lg text-muted">{t.notFound.text}</p>
          <p className="mt-2 max-w-lg text-dim" lang="en">This page could not be found.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" prefetch={false} className="inline-flex min-h-12 w-fit items-center rounded-full bg-text px-6 font-medium text-graphite hover:bg-cyan">
              {t.notFound.home}
            </Link>
            <Link href="/en" prefetch={false} lang="en" className="inline-flex min-h-12 w-fit items-center rounded-full border border-line-strong px-6 hover:border-cyan">
              English
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
