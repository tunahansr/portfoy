"use client";

import type { PackageId } from "@/data/en-offer";

export const PACKAGE_EVENT = "en:select-package";

/** "#contact" bağlantısı; tıklanınca formdaki paket seçimini doldurur. */
export function PackageLink({ id, className, children }: { id: PackageId; className?: string; children: React.ReactNode }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(PACKAGE_EVENT, { detail: id }))}
    >
      {children}
    </a>
  );
}
