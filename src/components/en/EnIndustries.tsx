import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { photo, type PhotoSlot } from "@/data/en-photos";

const items: { slot: PhotoSlot; title: string; text: string }[] = [
  { slot: "cafe", title: "Cafés", text: "QR menu, opening hours and a map so people walk in." },
  { slot: "restaurant", title: "Restaurants", text: "Menu, table bookings and WhatsApp orders." },
  { slot: "petshop", title: "Pet shops", text: "Products, services and an online store." },
  { slot: "salon", title: "Salons & barbers", text: "Prices, gallery and online appointments." },
  { slot: "realestate", title: "Estate agents", text: "Listings, team and quick enquiries." },
];

export function EnIndustries() {
  return (
    <section aria-labelledby="industries-title" className="border-y border-ink/10 bg-card py-16 sm:py-20">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="industries-title" className="max-w-2xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
            Made for the businesses on your high street
          </h2>
          <p className="max-w-md text-ink-soft">
            Every site is designed around what your customers need to do: find you, check your menu or prices, and get in touch.
          </p>
        </div>
        <Reveal as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {items.map((it, i) => {
            const p = photo(it.slot);
            return (
              <li key={it.slot} data-reveal className={`group ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
                <div className={`relative overflow-hidden rounded-2xl bg-paper-2 ${i === 4 ? "aspect-[2/1] lg:aspect-[3/4]" : "aspect-[3/4]"}`}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-4 pt-16">
                    <h3 className="font-display text-lg font-semibold text-white">{it.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-white/85">{it.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
