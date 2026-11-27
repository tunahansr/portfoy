import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Gerçek ekran görüntüleri galerisi. Mobilde yatay kaydırmalı (scroll-snap),
 * geniş ekranda ilk görsel büyük, diğerleri altında. Animasyon yok; reduced-motion güvenli.
 */
export function ScreenGallery({ project, priority = false }: { project: Project; priority?: boolean }) {
  const screens = project.screens ?? [];
  if (!screens.length) return null;

  return (
    <div
      className="-mx-[var(--gutter,1rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter,1rem)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0"
      role="list"
      aria-label={`${project.name} ekran görüntüleri`}
    >
      {screens.map((s, i) => {
        const mobile = s.device === "mobile";
        return (
          <figure
            key={s.src}
            role="listitem"
            className={`shrink-0 snap-center overflow-hidden rounded-2xl border border-line bg-night ${
              mobile ? "w-[62%] sm:w-auto" : "w-[88%] sm:w-auto"
            } ${i === 0 && !mobile ? "sm:col-span-2" : ""}`}
          >
            <a href={s.src} target="_blank" rel="noopener" className="block">
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                priority={priority && i === 0}
                sizes={i === 0 && !mobile ? "(min-width: 1024px) 58vw, 88vw" : "(min-width: 1024px) 29vw, 62vw"}
                className="h-auto w-full"
              />
            </a>
          </figure>
        );
      })}
    </div>
  );
}
