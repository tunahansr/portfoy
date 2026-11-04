import { defaultLocale, type Locale } from "./config";
import { tr, type Dictionary } from "./dictionaries/tr";

const dictionaries: Record<Locale, Dictionary> = { tr };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary, Locale };
