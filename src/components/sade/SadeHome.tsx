import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { contactLinks, profile } from "@/data/profile";

/**
 * Sade ana sayfa (2026-11-27 ön çalışması): 6 bölüm, tek vurgu rengi, ölçülü hareket.
 * Kural: uydurma rakam/yorum yok; yalnızca gerçek ekran görüntüleri ve gerçek mağaza linkleri.
 */

const work = [
  {
    name: "Pazaryeri Entegrasyon Platformu",
    kind: "Web paneli · API",
    problem: "Yemeksepeti, Trendyol Go ve Migros siparişleri ayrı ekranlarda takip ediliyordu.",
    solution: "Tüm kanallardan gelen siparişler tek panelde onaylanıyor, reddediliyor ve teslim ediliyor.",
    image: { src: "/work/entegrasyon-siparisler.jpg", width: 1440, height: 900, alt: "Entegrasyon platformunda farklı pazaryerlerinden gelen sipariş listesi" },
  },
  {
    name: "Yedinizmi Bayi ve Operasyon Paneli",
    kind: "Web paneli · Mobil uygulama",
    problem: "Restoran, kurye ve operasyon ekibi aynı siparişi farklı yerlerden izliyordu.",
    solution: "Sipariş, kurye ataması ve ödeme durumu tek operasyon ekranında; kurye tarafı mobil uygulamada.",
    image: { src: "/work/yedinizmi-bayi-siparisler.jpg", width: 1600, height: 1000, alt: "Yedinizmi bayi panelinde sipariş, kurye ve ödeme durumları" },
  },
  {
    name: "OBD Araç Paneli",
    kind: "Araç teşhis yazılımı · Donanım",
    problem: "Araçtan canlı veri okumak ve kodlama yapmak için ayrı, karmaşık araçlar gerekiyordu.",
    solution: "Motor devri, hız, sıcaklık ve voltaj tek ekranda canlı izleniyor; kodlama aynı panelden yapılıyor.",
    image: { src: "/work/obd-panel-canli-veri.jpg", width: 1600, height: 1000, alt: "OBD panelinde aracın canlı motor verileri" },
  },
];

const apps = [
  { name: "Yedinizmi Kurye", appStore: "https://apps.apple.com/tr/app/yedi-ni-zmi-kurye/id6766636356", googlePlay: "https://play.google.com/store/apps/details?id=com.tunahansrn.yedinizmikurye" },
  { name: "ÇatKapı Kurye", appStore: "https://apps.apple.com/tr/app/%C3%A7atkapi-kurye/id6786336405", googlePlay: "https://play.google.com/store/apps/details?id=com.tunahansrn.catkapiexpresskurye" },
];

const services = [
  { title: "Web sitesi ve online mağaza", text: "Tanıtım sitesi, randevu sitesi, e-ticaret ve QR menü. Hızlı, mobil uyumlu, yönetimi kolay." },
  { title: "İşletme yazılımı", text: "ERP, POS ve sipariş sistemleri. Satış, stok ve finans tek yerden yönetilir." },
  { title: "Mobil uygulama", text: "Müşteri, kurye ve saha ekipleri için App Store ve Google Play'de yayınlanan uygulamalar." },
  { title: "Entegrasyon ve sunucu", text: "Pazaryeri, ödeme ve WhatsApp entegrasyonları; sunucu, alan adı ve e-posta kurulumu." },
];

const steps = [
  { title: "Görüşme", text: "İhtiyacı ve hedefi birlikte netleştiririz." },
  { title: "Önizleme", text: "Kodlamaya başlamadan ekranları görürsün." },
  { title: "Geliştirme", text: "Kısa aralıklarla çalışan sürümü paylaşırım." },
  { title: "Yayın ve destek", text: "Canlıya alır, sonrasında da yanında olurum." },
];

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-brand">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em] text-ink text-balance-safe">
        {children}
      </h2>
    </div>
  );
}

export function SadeHome() {
  return (
    <>
      {/* 1 · Giriş */}
      <section id="top" className="border-b border-ink/10">
        <div className="container-x max-w-[1200px] pb-20 pt-16 sm:pb-28 sm:pt-24">
          <p className="hero-rise text-sm font-medium text-ink-dim" style={{ ["--d" as string]: 0 }}>
            Tunahan ŞİRİN · Yazılım geliştirici
          </p>
          <h1
            className="hero-rise mt-5 max-w-4xl text-[clamp(2.3rem,5.6vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink text-balance-safe"
            style={{ ["--d" as string]: 80 }}
          >
            İşletmeler için web siteleri, mobil uygulamalar ve özel yazılımlar geliştiriyorum.
          </h1>
          <p className="hero-rise mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-ink-soft" style={{ ["--d" as string]: 160 }}>
            Tanıtım sitesinden sipariş ve kurye sistemine kadar; işini kolaylaştıran yazılımı baştan sona tek kişi olarak
            tasarlıyor, geliştiriyor ve yayında tutuyorum.
          </p>
          <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: 240 }}>
            <a href="#isler" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-paper transition-colors hover:bg-brand">
              İşlerimi gör
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-card px-7 text-base font-medium text-ink transition-colors hover:border-ink/40">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp&apos;tan yaz
            </a>
          </div>
        </div>
      </section>

      {/* 2 · Seçili işler */}
      <section id="isler" aria-labelledby="isler-baslik" className="py-20 sm:py-28">
        <div className="container-x max-w-[1200px]">
          <SectionTitle id="isler-baslik" eyebrow="Seçili işler">Gerçek işletmelerde çalışan sistemler.</SectionTitle>
          <div className="mt-12 grid gap-16 sm:mt-16 sm:gap-24">
            {work.map((w, i) => (
              <article key={w.name} className={`grid items-center gap-8 lg:gap-14 ${i % 2 ? "lg:grid-cols-[1fr_1.35fr] lg:[&>figure]:order-2" : "lg:grid-cols-[1.35fr_1fr]"}`}>
                <figure className="overflow-hidden rounded-2xl border border-ink/10 bg-card shadow-[0_24px_60px_-36px_rgba(17,21,28,0.45)]">
                  <Image src={w.image.src} width={w.image.width} height={w.image.height} alt={w.image.alt} sizes="(min-width:1024px) 640px, 100vw" className="h-auto w-full" />
                </figure>
                <div>
                  <p className="text-sm text-ink-dim">{w.kind}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{w.name}</h3>
                  <dl className="mt-6 grid gap-5 text-[0.98rem] leading-relaxed">
                    <div>
                      <dt className="text-sm font-medium text-ink">Sorun</dt>
                      <dd className="mt-1 text-ink-soft">{w.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-ink">Çözüm</dt>
                      <dd className="mt-1 text-ink-soft">{w.solution}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 rounded-2xl border border-ink/10 bg-card p-6 sm:p-8">
            <p className="text-sm text-ink-dim">Mobil uygulamalar · Mağazalarda yayında</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {apps.map((a) => (
                <li key={a.name} className="flex flex-col gap-3 rounded-xl bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-ink">{a.name}</span>
                  <span className="flex gap-4 text-sm">
                    <a href={a.appStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-soft hover:text-brand">App Store <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></a>
                    <a href={a.googlePlay} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-soft hover:text-brand">Google Play <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/projeler" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-brand">
            Tüm projeler <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* 3 · Hizmetler */}
      <section id="hizmetler" aria-labelledby="hizmetler-baslik" className="border-y border-ink/10 bg-card py-20 sm:py-28">
        <div className="container-x max-w-[1200px]">
          <SectionTitle id="hizmetler-baslik" eyebrow="Hizmetler">Neler yapıyorum?</SectionTitle>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {services.map((s, i) => (
              <li key={s.title} className="bg-card p-7 sm:p-9">
                <span className="text-sm tabular-nums text-ink-dim">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 · Hakkımda */}
      <section id="hakkimda" aria-labelledby="hakkimda-baslik" className="py-20 sm:py-28">
        <div className="container-x grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionTitle id="hakkimda-baslik" eyebrow="Hakkımda">Kod yazmak işin başlangıcı; asıl iş sistemin gerçek hayatta çalışması.</SectionTitle>
          <div className="grid gap-5 text-[1.05rem] leading-relaxed text-ink-soft">
            <p>
              Veritabanından API&apos;ye, mobil uygulamadan mali POS cihazıyla konuşan entegrasyona ve sunucuya kadar uçtan uca
              çalışıyorum. Her katmanı bildiğim için sistemin bütününü daha sağlam kurabiliyorum.
            </p>
            <p>
              Her projeyi işletmenin gerçek akışıyla birlikte geliştiriyorum. Karşında bir ajans değil, işi baştan sona
              yapan kişi var.
            </p>
            <p className="text-sm text-ink-dim">Next.js · React · TypeScript · Node.js · PostgreSQL · SQL Server · Docker · Linux</p>
          </div>
        </div>
      </section>

      {/* 5 · Süreç */}
      <section aria-labelledby="surec-baslik" className="border-t border-ink/10 py-20 sm:py-28">
        <div className="container-x max-w-[1200px]">
          <SectionTitle id="surec-baslik" eyebrow="Nasıl çalışıyorum">Dört adımda, sürprizsiz.</SectionTitle>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ink pt-5">
                <span className="text-sm tabular-nums text-ink-dim">Adım {i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · İletişim */}
      <section id="iletisim" aria-labelledby="iletisim-baslik" className="bg-ink py-20 text-paper sm:py-28">
        <div className="container-x max-w-[1200px]">
          <h2 id="iletisim-baslik" className="max-w-3xl text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-balance-safe">
            Bir projen mi var? Birkaç cümleyle anlat, en kısa sürede dönüş yapayım.
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-7 font-semibold text-ink transition-colors hover:bg-white">
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp&apos;tan yaz
            </a>
            <a href={contactLinks.tel} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-paper/25 px-7 font-medium transition-colors hover:border-paper/60">
              <Phone className="h-4 w-4" aria-hidden /> {profile.contact.phoneDisplay}
            </a>
            <a href={contactLinks.mailto} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-paper/25 px-7 font-medium transition-colors hover:border-paper/60">
              <Mail className="h-4 w-4" aria-hidden /> E-posta gönder
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
