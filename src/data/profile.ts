/**
 * Kişisel bilgiler ve iletişim — sitenin her yerinde buradan okunur.
 * Bu, Tunahan ŞİRİN'in şahsi sitesidir: şirket adı ve adres bilinçli olarak gösterilmez.
 * İsim, telefon, e-posta veya link değişikliği için sadece bu dosyayı düzenleyin.
 */
export const profile = {
  name: "Tunahan ŞİRİN",
  firstName: "Tunahan",
  title: "Full Stack Software Developer · Software Architect · Technology Entrepreneur",
  shortTitle: "Yazılım Mimarı & Full Stack Geliştirici",
  contact: {
    phoneDisplay: "0 541 899 21 60",
    phoneE164: "+905418992160",
    email: "tunaha.srn@gmail.com",
    whatsapp: "https://wa.me/905418992160",
  },
  /**
   * Site canonical adresi (sitemap, OG, schema.org). Yayın alan adı henüz kesinleşmediği için
   * NEXT_PUBLIC_SITE_URL ortam değişkeninden okunur; tanımlı değilse yerel adres kullanılır.
   */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  social: [] as { label: string; url: string }[],
} as const;

export const contactLinks = {
  tel: `tel:${profile.contact.phoneE164}`,
  mailto: `mailto:${profile.contact.email}`,
  whatsapp: profile.contact.whatsapp,
  whatsappWithText: (text: string) =>
    `${profile.contact.whatsapp}?text=${encodeURIComponent(text)}`,
} as const;
