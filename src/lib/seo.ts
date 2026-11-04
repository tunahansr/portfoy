import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { getDictionary } from "@/i18n";

export const absoluteUrl = (path = "/") => `${profile.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** schema.org: Person + WebSite (ana sayfa). Şahsi site: şirket ve adres bilgisi yayınlanmaz. */
export function personJsonLd() {
  const t = getDictionary();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: profile.name,
        jobTitle: "Full Stack Software Developer, Software Architect",
        description: t.meta.description,
        url: absoluteUrl("/"),
        email: `mailto:${profile.contact.email}`,
        telephone: profile.contact.phoneE164,
        knowsAbout: t.about.capabilities.map((c) => c.name),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: profile.name,
        inLanguage: "tr-TR",
        publisher: { "@id": absoluteUrl("/#person") },
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": absoluteUrl(`/projeler/${project.slug}#work`),
        name: project.name,
        headline: project.tagline,
        description: project.summary,
        url: absoluteUrl(`/projeler/${project.slug}`),
        inLanguage: "tr-TR",
        author: { "@id": absoluteUrl("/#person") },
        keywords: [...project.tech, ...project.categories].join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Projeler", item: absoluteUrl("/projeler") },
          { "@type": "ListItem", position: 3, name: project.name, item: absoluteUrl(`/projeler/${project.slug}`) },
        ],
      },
    ],
  };
}

export const allProjectPaths = () => projects.map((p) => `/projeler/${p.slug}`);

/** JSON-LD'yi <script> içine güvenle gömmek için */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
