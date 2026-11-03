/**
 * Dil yapılandırması. Şu an yalnızca Türkçe yayında.
 * İngilizce eklemek için: `dictionaries/en.ts` oluşturun (tr.ts ile aynı tip), `locales` dizisine "en" ekleyin
 * ve rotaları `app/[locale]/...` altına taşıyın. Bileşenler metinleri doğrudan `getDictionary()` üzerinden okur.
 */
export const locales = ["tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";
export const htmlLang: Record<Locale, string> = { tr: "tr" };
export const ogLocale: Record<Locale, string> = { tr: "tr_TR" };
