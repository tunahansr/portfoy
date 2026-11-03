import { featuredProjects } from "@/data/projects";
import { getDictionary } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectChapter } from "@/components/projects/ProjectChapter";
import { WorkIndex } from "@/components/projects/WorkIndex";

const t = getDictionary();

export function SelectedWork() {
  return (
    <section id="isler" aria-labelledby="isler-baslik" className="relative bg-graphite pt-[var(--section-y)]">
      <div className="container-x pb-14">
        <SectionHeading eyebrow={t.work.eyebrow} id="isler-baslik" index="02" intro={t.work.intro}>
          {t.work.title}
        </SectionHeading>
      </div>
      <WorkIndex items={featuredProjects.map((p) => ({ slug: p.slug, name: p.name }))} />
      {featuredProjects.map((p, i) => (
        <ProjectChapter key={p.slug} project={p} index={i} total={featuredProjects.length} />
      ))}
    </section>
  );
}
