/**
 * Kişisel bilgiler ve iletişim — sitenin her yerinde buradan okunur.
 * İsim, telefon, e-posta veya link değişikliği için sadece bu dosyayı düzenleyin.
 */
export const profile = {
  name: "Tunahan Şirin",
  firstName: "Tunahan",
  title: "Full Stack Software Developer · Software Architect · Technology Entrepreneur",
  shortTitle: "Yazılım Mimarı & Full Stack Geliştirici",
  company: {
    name: "Karekod Bilişim",
    url: "https://karekodbilisim.com",
  },
  location: {
    city: "Ünye",
    region: "Ordu",
    country: "Türkiye",
    countryCode: "TR",
  },
  contact: {
    phoneDisplay: "0 542 153 17 77",
    phoneE164: "+905421531777",
    email: "bilgi@karekodbilisim.com",
    whatsapp: "https://wa.me/905421531777",
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
