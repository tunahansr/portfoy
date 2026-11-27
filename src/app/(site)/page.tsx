import type { Metadata } from "next";
import { SiteHome } from "@/components/site/SiteHome";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { "tr-TR": "/", en: "/en", "x-default": "/" } },
};

export default function HomePage() {
  return <SiteHome lang="tr" />;
}
