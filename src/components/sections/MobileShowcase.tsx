import { getDictionary } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { MobilePreview } from "@/components/mobile-preview";
import { realMobileApps } from "@/data/mobile-apps";
const t = getDictionary();

export function MobileShowcase() {
  // Gerçek ekranı olmayan mobil uygulama gösterilmez; hiç yoksa bölüm tamamen gizlenir.
  if (!realMobileApps.length) return null;
  return (
    <section id="mobil" aria-labelledby="mobil-baslik" className="section-y relative overflow-hidden bg-night">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(255,181,71,0.07),transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t.mobile.eyebrow} id="mobil-baslik" index="03" intro={t.mobile.intro}>
          {t.mobile.title}
        </SectionHeading>
        <div className="mt-14">
          <MobilePreview variant="showcase" appIds={realMobileApps.map((a) => a.id)} />
        </div>
      </div>
    </section>
  );
}
