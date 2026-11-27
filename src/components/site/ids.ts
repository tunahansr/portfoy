import type { Lang } from "@/content/site";

export const sectionIds = {
  tr: { products: "urunler", screens: "ekranlar", packages: "paketler", steps: "surec", payment: "odeme", contact: "iletisim" },
  en: { products: "products", screens: "screens", packages: "packages", steps: "process", payment: "payment", contact: "contact" },
} satisfies Record<Lang, Record<string, string>>;
