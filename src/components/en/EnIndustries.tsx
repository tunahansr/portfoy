import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { photo, type PhotoSlot } from "@/data/en-photos";

const items: { slot: PhotoSlot; title: string; text: string }[] = [
  { slot: "cafe", title: "Business websites", text: "Who you are, what you offer and how to reach you." },
  { slot: "petshop", title: "Online stores", text: "Products, payments and orders in one place." },
  { slot: "salon", title: "Booking websites", text: "Online appointments, prices and a gallery." },
  { slot: "restaurant", title: "Menus & ordering", text: "Digital menus, QR codes, table bookings and WhatsApp orders." },
  { slot: "realestate", title: "Custom software & apps", text: "Dashboards, mobile apps and integrations for how you work." },
];

export function EnIndustries() {
  return (
    <section aria-labelledby="industries-title" className="border-y border-ink/10 bg-card py-16 sm:py-20">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="industries-title" className="max-w-2xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
            Everything your business needs online
          </h2>
          <p className="max-w-md text-ink-soft">
            From a simple business website to an online store or a custom app. Pick what you need today and grow from there.
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
