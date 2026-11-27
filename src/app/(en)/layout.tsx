import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { profile } from "@/data/profile";
import { motionPrefInitScript } from "@/lib/motion-pref";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/site/SiteHeader";
import { content } from "@/content/site";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * İngilizce kök layout (/en): yurt dışındaki küçük işletmeler için açık temalı satış sayfası.
 * Türkçe site app/(site)/layout.tsx altındadır; iki dil arasında geçiş tam sayfa yüklemesidir.
 */
const title = content.en.meta.title;
const description = content.en.meta.description;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: "%s · Tunahan Şirin" },
  description,
  authors: [{ name: profile.name, url: `${profile.siteUrl}/en` }],
  creator: profile.name,
  alternates: { canonical: "/en", languages: { en: "/en", "tr-TR": "/", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    siteName: "Tunahan Şirin",
    title,
    description,
    images: [{ url: "/en/photos/hero.jpg", width: 1600, height: 900, alt: "Two smiling café workers behind the counter" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/en/photos/hero.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionPrefInitScript }} />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-5 py-3 font-medium text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader lang="en" />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter lang="en" />
        </MotionProvider>
      </body>
    </html>
  );
}
