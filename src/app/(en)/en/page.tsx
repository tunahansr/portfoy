import { SiteHome } from "@/components/site/SiteHome";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";
import { profile } from "@/data/profile";
import { content, packagePrices } from "@/content/site";

function jsonLd() {
  const t = content.en;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": absoluteUrl("/en#service"),
    name: t.meta.title,
    description: t.meta.description,
    url: absoluteUrl("/en"),
    email: `mailto:${profile.contact.businessEmail}`,
    areaServed: "Worldwide",
    inLanguage: "en",
    makesOffer: packagePrices.map((p) => ({
      "@type": "Offer",
      name: t.packages.items[p.id].name,
      description: t.packages.items[p.id].text,
      price: p.price,
      priceCurrency: "USD",
    })),
  };
}

export default function EnglishHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd()) }} />
      <SiteHome lang="en" />
    </>
  );
}
