/**
 * /en sayfasındaki gerçek fotoğraflar (Unsplash / Pexels lisanslı). Dosyalar: public/en/photos/.
 * Kaynak ve fotoğrafçı bilgisi public/en/photos/credits.json ile aynıdır; sayfa altında kredi olarak gösterilir.
 */
import credits from "../../public/en/photos/credits.json";

export type PhotoSlot = "hero" | "cafe" | "restaurant" | "petshop" | "salon" | "realestate" | "phone-menu";

interface Credit {
  file: string;
  source: string;
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
  license: string;
  alt: string;
}

const list = credits as Credit[];

export function photo(slot: PhotoSlot) {
  const c = list.find((x) => x.file.replace(/\.\w+$/, "") === slot);
  if (!c) throw new Error(`Missing photo credit for ${slot}`);
  return { src: `/en/photos/${c.file}`, alt: c.alt, credit: c };
}

export const photoCredits = list;
