import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { getDictionary } from "@/i18n";
import { defaultLocale, htmlLang, ogLocale } from "@/i18n/config";
import { motionPrefInitScript } from "@/lib/motion-pref";
import { personJsonLd, serializeJsonLd } from "@/lib/seo";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"], display: "swap" });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz", "wdth"],
});
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const t = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: t.meta.title, template: t.meta.titleTemplate },
  description: t.meta.description,
  keywords: t.meta.keywords,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: ogLocale[defaultLocale],
    url: "/",
    siteName: profile.name,
    title: t.meta.title,
    description: t.meta.description,
  },
  twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07090D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={htmlLang[defaultLocale]}
      className={`${geist.variable} ${geistMono.variable} ${bricolage.variable} ${instrument.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionPrefInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd()) }}
        />
      </head>
      <body className="min-h-svh">
        <a
          href="#icerik"
          className="sr-only z-[100] rounded-full bg-text px-5 py-3 font-medium text-graphite focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="icerik" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
