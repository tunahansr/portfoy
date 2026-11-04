import { getDictionary } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Archive } from "./Archive";

const t = getDictionary();

export function ArchiveSection() {
  return (
    <section id="arsiv" aria-labelledby="arsiv-baslik" className="section-y bg-graphite">
      <div className="container-x">
        <SectionHeading eyebrow={t.archive.eyebrow} id="arsiv-baslik" index="06" size="display">
          {t.archive.title}
        </SectionHeading>
        <div className="mt-12">
          <Archive />
        </div>
      </div>
    </section>
  );
}
