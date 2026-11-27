import type { Metadata } from "next";
import { SadeHome } from "@/components/sade/SadeHome";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { "tr-TR": "/", en: "/en", "x-default": "/" } },
};

export default function HomePage() {
  return <SadeHome />;
}
