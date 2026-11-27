import { EnHero } from "@/components/en/EnHero";
import { EnIndustries } from "@/components/en/EnIndustries";
import { EnPricing } from "@/components/en/EnPricing";
import { EnDemos } from "@/components/en/EnDemos";
import { EnSteps } from "@/components/en/EnSteps";
import { EnWhyMe } from "@/components/en/EnWhyMe";
import { EnFaq } from "@/components/en/EnFaq";
import { EnContact } from "@/components/en/EnContact";
import { MobileCta } from "@/components/en/MobileCta";
import { carePlan, faq, packages } from "@/data/en-offer";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";
import { profile } from "@/data/profile";

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": absoluteUrl("/en#service"),
        name: "Tunahan Şirin — Websites for small businesses",
        url: absoluteUrl("/en"),
        email: `mailto:${profile.contact.businessEmail}`,
        areaServed: "Worldwide",
        inLanguage: "en",
        makesOffer: [...packages, carePlan].map((p) => ({
          "@type": "Offer",
          name: p.name,
          description: p.summary,
          price: p.price,
          priceCurrency: "USD",
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

export default function EnglishHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd()) }} />
      <EnHero />
      <EnIndustries />
      <EnPricing />
      <EnDemos />
      <EnSteps />
      <EnWhyMe />
      <EnFaq />
      <EnContact />
      <MobileCta />
    </>
  );
}
