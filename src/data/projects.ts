/**
 * PORTFÖY VERİ MODELİ — tek kaynak.
 *
 * Bir proje eklemek / güncellemek / kaldırmak için sadece bu dizideki nesneyi düzenleyin.
 * Ana sayfa (Selected Work + Arşiv), /projeler/[slug] detay sayfaları, sitemap ve
 * schema.org verisi otomatik olarak buradan üretilir.
 *
 * DÜRÜSTLÜK KURALLARI
 *  - `status` alanı yalnızca doğrulanmış durum için doldurulur. Boş bırakılırsa sitede durum rozeti
 *    gösterilmez (yanlış "yayında" iddiası oluşmasın diye).
 *  - `preview: "concept"` → gerçek ekran görüntüsü olmadığı için arayüz ürün tanımına göre çizilmiş
 *    konsept önizlemedir; sitede bu açıkça belirtilir. Gerçek ekran eklenince `screens` doldurulur
 *    ve `preview: "real"` yapılır.
 *  - Metinlerde doğrulanmamış rakam, müşteri adı veya başarı iddiası kullanılmaz.
 *  - "KARPİN" ürünü hiçbir yerde "KARPİN ERP" olarak adlandırılmaz.
 */

export const categories = [
  { id: "saas", label: "SaaS" },
  { id: "erp", label: "ERP" },
  { id: "mobil", label: "Mobil" },
  { id: "pos", label: "POS" },
  { id: "entegrasyon", label: "Entegrasyon" },
  { id: "altyapi", label: "Altyapı" },
  { id: "otomasyon", label: "Otomasyon" },
  { id: "arge", label: "Ar-Ge" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type ProjectStatus = "yayinda" | "gelistirme" | "prototip" | "planlanan";

export const statusLabels: Record<ProjectStatus, string> = {
  yayinda: "Kullanımda",
  gelistirme: "Geliştirme aşamasında",
  prototip: "Prototip",
  planlanan: "Planlanan",
};

/** Her öne çıkan projenin kendine ait görsel/animasyon bileşeni vardır. */
export type ProjectVisual =
  | "erp-dashboard"
  | "integration-flow"
  | "mobile-yedinizmi"
  | "courier-ops"
  | "pos-terminal"
  | "qr-menu"
  | "fire-safety"
  | "service-desk"
  | "tenant-platform"
  | "none";

export type Accent = "blue" | "cyan" | "violet" | "amber";

export interface Project {
  slug: string;
  name: string;
  /** Kısa, tek cümlelik konumlandırma. */
  tagline: string;
  /** Kart/arşiv için 1-2 cümle özet. */
  summary: string;
  categories: CategoryId[];
  /** Ana sayfadaki Selected Work bölümünde sıralı gösterilir; yoksa sadece arşivde. */
  featuredOrder?: number;
  status?: ProjectStatus;
  purpose?: string;
  problem?: string;
  audience?: string[];
  features: string[];
  /** Alt uygulamalar (ör. Yedinizmi: müşteri, kurye, panel). */
  subApps?: { name: string; description: string }[];
  /** Gerçek kullanım senaryoları — adım adım anlatım. */
  scenarios?: { title: string; steps: string[] }[];
  tech: string[];
  visual: ProjectVisual;
  accent: Accent;
  preview: "concept" | "real" | "none";
  /** Gerçek ekran görüntüleri: /public/projects/<slug>/... */
  screens?: { src: string; alt: string }[];
  /** Motion composition çıktıları (motion/ klasöründen render edilir). */
  media?: {
    video?: string; // /videos/*.mp4
    poster?: string; // /posters/*.jpg
    engine?: "remotion" | "hyperframes";
    /** Remotion Player ile tarayıcıda etkileşimli oynatılacak composition id'si */
    remotionId?: "KarekodErpShowcase" | "YedinizmiMobileExperience";
  };
  /** Mobil önizleme sistemindeki uygulama id'leri */
  mobileApps?: string[];
}

export const projects: Project[] = [
  {
    slug: "karekod-erp",
    name: "KAREKOD ERP",
    tagline: "Modüler, çok kiracılı kurumsal kaynak planlama sistemi.",
    summary:
      "Satıştan üretime, finanstan insan kaynaklarına kadar işletmenin tüm akışını tek çatıda toplayan; her müşteriye bağımsız veritabanı sunan web ve mobil odaklı ERP.",
    categories: ["erp", "saas"],
    featuredOrder: 1,
    purpose:
      "Farklı sektörlerdeki işletmelerin kendi süreçlerine uyarlanabilen, tek kod tabanından yönetilen bir ERP platformu sunmak.",
    problem:
      "Hazır ERP paketleri ya sektöre uymuyor ya da her müşteri için ayrı kurulum ve bakım yükü oluşturuyor. Modül eklemek, alan özelleştirmek ve güncelleme dağıtmak pahalı ve riskli hale geliyor.",
    audience: [
      "KOBİ'ler ve çok şubeli işletmeler",
      "Üretim, servis ve ticaret yapan firmalar",
      "Kendi sürecine göre modül seçmek isteyen yöneticiler",
    ],
    features: [
      "Müşteri bazlı bağımsız veritabanı",
      "Merkezi lisans ve modül yönetimi",
      "Satış, stok, finans, cari, üretim, servis ve İK modülleri",
      "Dinamik dashboard",
      "Sektöre uyarlanabilir modüller",
      "Form metadata ve özelleştirilebilir alanlar",
      "Tenant ve domain yönetimi",
      "Test ve kademeli güncelleme süreçleri",
    ],
    tech: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma"],
    visual: "erp-dashboard",
    accent: "blue",
    preview: "concept",
    media: {
      engine: "remotion",
      remotionId: "KarekodErpShowcase",
      video: "/videos/karekod-erp-showcase.mp4",
      poster: "/posters/karekod-erp-showcase.jpg",
    },
    mobileApps: ["erp-mobil"],
  },
  {
    slug: "karekod-entegrasyon",
    name: "Karekod Entegrasyon Platformu",
    tagline: "Dağınık sipariş kanallarını tek merkezde birleştiren API platformu.",
    summary:
      "Restoran ve marketlerin Yemeksepeti, Trendyol Go ve Migros Yemek gibi kanallardan gelen siparişlerini tek ekranda, tek akışta yönetmesini sağlayan modüler entegrasyon altyapısı.",
    categories: ["entegrasyon", "saas"],
    featuredOrder: 2,
    purpose:
      "Her pazaryeri için ayrı tablet ve panel takibini ortadan kaldırıp siparişleri işletmenin kendi sistemine düzenli şekilde akıtmak.",
    problem:
      "Her sipariş kanalının farklı API'si, farklı durum kodları ve farklı şube tanımı var. Elle takip edilen paneller sipariş kaçırmaya, gecikmeye ve hatalı stok/menü bilgisine yol açıyor.",
    audience: ["Restoranlar ve zincir işletmeler", "Marketler", "POS ve ERP sağlayıcıları"],
    features: [
      "Yemeksepeti entegrasyonu",
      "Trendyol Go Yemek ve Trendyol Go Market entegrasyonu",
      "Migros Yemek entegrasyonu",
      "Modüler entegrasyon altyapısı (yeni kanal = yeni adaptör)",
      "Webhook işleme",
      "Sipariş senkronizasyonu",
      "Şube eşleme",
      "Yetkilendirme, loglama ve hata yönetimi",
    ],
    tech: ["REST API", "Webhook", "Adapter mimarisi"],
    visual: "integration-flow",
    accent: "cyan",
    preview: "concept",
    media: {
      engine: "hyperframes",
      video: "/videos/api-integration-network.mp4",
      poster: "/posters/api-integration-network.jpg",
    },
  },
  {
    slug: "yedinizmi",
    name: "Yedinizmi",
    tagline: "Restoran, müşteri ve kuryeyi aynı akışta buluşturan teslimat ekosistemi.",
    summary:
      "Müşteri ve kurye mobil uygulamaları, restoran/bayi paneli ve yönetici paneliyle siparişin oluşturulmasından kapıya teslimine kadar tüm süreci kapsayan dijital sipariş platformu.",
    categories: ["mobil", "saas"],
    featuredOrder: 3,
    purpose:
      "Yerel işletmelere kendi sipariş ve teslimat operasyonlarını yönetebilecekleri uçtan uca bir dijital altyapı sağlamak.",
    problem:
      "Sipariş, restoran onayı ve kurye ataması farklı kanallarda (telefon, mesaj, kağıt) yürüdüğünde müşteri siparişin nerede olduğunu bilemiyor, işletme ise operasyonu ölçemiyor.",
    audience: ["Son kullanıcı müşteriler", "Kuryeler", "Restoran ve bayiler", "Platform yöneticileri"],
    subApps: [
      { name: "Müşteri uygulaması", description: "Menü, sepet, sipariş ve canlı takip." },
      { name: "Kurye uygulaması", description: "Görev havuzu, teslimat adımları ve konum paylaşımı." },
      { name: "Restoran / bayi paneli", description: "Gelen siparişleri onaylama ve hazırlık durumu." },
      { name: "Yönetici paneli", description: "Kurye havuzu, operasyon ve bildirim yönetimi." },
    ],
    features: [
      "Sipariş oluşturma",
      "Sipariş takibi",
      "Canlı konum",
      "Kurye atama",
      "Kurye havuzu",
      "Operasyon yönetimi",
      "Bildirimler",
    ],
    tech: ["Mobil uygulama", "Web panel", "Konum servisleri", "Push bildirim"],
    visual: "mobile-yedinizmi",
    accent: "amber",
    preview: "concept",
    media: {
      engine: "remotion",
      remotionId: "YedinizmiMobileExperience",
      video: "/videos/yedinizmi-mobile-experience.mp4",
      poster: "/posters/yedinizmi-mobile-experience.jpg",
    },
    mobileApps: ["yedinizmi-musteri", "yedinizmi-kurye"],
  },
  {
    slug: "catkapi-express",
    name: "Çatkapı Express",
    tagline: "Kurye ve teslimat operasyonları için platform ve işletme markası.",
    summary:
      "Kurye organizasyonu, paket takibi, vardiya planlama ve canlı durum ekranlarıyla teslimat operasyonunu sahada yöneten platform.",
    categories: ["mobil", "saas"],
    featuredOrder: 4,
    purpose: "Kurye ekibinin günlük operasyonunu, vardiyalarını ve teslimat performansını tek yerden yönetmek.",
    problem:
      "Yoğun saatlerde hangi kuryenin nerede olduğu, hangi paketin beklediği ve vardiyada kimin olduğu anlık görülemediğinde teslimatlar gecikiyor.",
    audience: ["Kurye operasyon yöneticileri", "Kuryeler", "Restoran ve işletmeler"],
    features: [
      "Kurye organizasyonu",
      "Paket teslimat takibi",
      "Restoran ve işletme operasyonları",
      "Vardiya yönetimi",
      "Canlı durum ekranları",
      "Operasyonel raporlama",
    ],
    tech: ["Web panel", "Mobil arayüz", "Gerçek zamanlı durum"],
    visual: "courier-ops",
    accent: "amber",
    preview: "concept",
    mobileApps: ["catkapi-operasyon"],
  },
  {
    slug: "restoran-pos-hugin",
    name: "Restoran POS & Hugin Entegrasyonu",
    tagline: "Masadan mali cihaza kesintisiz satış akışı.",
    summary:
      "Masa ve sipariş yönetiminden parçalı ödemeye, Hugin mali POS cihazlarıyla PC-Link ve Cloud-Link iletişimine kadar restoran satış operasyonunu kapsayan POS ekosistemi.",
    categories: ["pos", "entegrasyon"],
    featuredOrder: 5,
    purpose: "Restoranın garson, kasa ve yönetim süreçlerini tek POS akışında toplamak ve mali cihazla doğrudan konuşmak.",
    problem:
      "Sipariş ekranı ile mali cihaz arasında elle tutar girmek hata ve zaman kaybı demek. İnternet kesildiğinde satış durmamalı, hesap bölündüğünde ödeme doğru kapanmalı.",
    audience: ["Restoran ve kafeler", "Garson, kasiyer ve yöneticiler"],
    features: [
      "Masa ve sipariş yönetimi",
      "Garson / kasiyer / yönetici arayüzleri",
      "PWA",
      "Offline-first yaklaşım",
      "Parçalı ödeme",
      "Mali POS cihaz entegrasyonu",
      "Hugin PC-Link ve Cloud-Link",
      "WebSocket tabanlı iletişim",
    ],
    tech: ["PWA", "WebSocket", "Offline-first", "Hugin PC-Link", "Hugin Cloud-Link"],
    visual: "pos-terminal",
    accent: "amber",
    preview: "concept",
    media: {
      engine: "hyperframes",
      video: "/videos/pos-payments.mp4",
      poster: "/posters/pos-payments.jpg",
    },
  },
  {
    slug: "qr-menu",
    name: "QR Menü & Restoran Yönetimi",
    tagline: "Masadaki QR koddan mutfağa giden gerçek zamanlı sipariş.",
    summary:
      "QR tabanlı dijital menü, masadan sipariş, rezervasyon akışları ve POS ile gerçek zamanlı iletişim kuran modüler restoran yönetimi.",
    categories: ["saas", "pos"],
    featuredOrder: 6,
    purpose: "Misafirin menüye ve siparişe telefonundan ulaşmasını, siparişin doğrudan POS'a düşmesini sağlamak.",
    problem:
      "Basılı menüler güncellenemiyor; garson beklemek ve siparişi yeniden girmek hem misafiri hem ekibi yavaşlatıyor.",
    audience: ["Restoran ve kafeler", "Restoran misafirleri"],
    features: [
      "QR tabanlı dijital menü",
      "Masa üzerinden sipariş",
      "Rezervasyon akışları",
      "Restoran yönetimi",
      "Gerçek zamanlı POS iletişimi",
      "Modüler ürün yapısı",
    ],
    tech: ["Web uygulaması", "Gerçek zamanlı iletişim", "POS entegrasyonu"],
    visual: "qr-menu",
    accent: "cyan",
    preview: "concept",
  },
  {
    slug: "yangin-guvenligi-bakim",
    name: "Yangın Güvenliği & Bakım Takip",
    tagline: "Her söndürücünün dolum, bakım ve son kullanım tarihi kontrol altında.",
    summary:
      "Yangın söndürme cihazlarının envanterini, lot bilgilerini, müşteri ve konum ilişkisini, dolum/bakım tarihlerini ve teknik servis operasyonlarını takip eden yazılım.",
    categories: ["saas", "otomasyon"],
    featuredOrder: 7,
    purpose: "Yangın güvenliği servis firmalarının sahadaki yüzlerce cihazı tarih ve konum bazlı eksiksiz takip etmesini sağlamak.",
    problem:
      "Dolum ve bakım tarihleri defterde veya tabloda tutulduğunda süresi geçen cihaz gözden kaçabiliyor; bu hem müşteri için güvenlik riski hem servis firması için kaybedilen iş demek.",
    audience: ["Yangın güvenliği servis firmaları", "Teknik servis personeli", "Kurumsal müşteriler"],
    features: [
      "Cihaz envanteri",
      "Dolum ve bakım tarihleri",
      "Son kullanım tarihi takibi",
      "Lot bilgileri",
      "Müşteri / konum ilişkilendirme",
      "Teknik servis kayıtları",
      "Hatırlatıcılar",
      "Raporlama",
    ],
    scenarios: [
      {
        title: "Periyodik bakım ziyareti",
        steps: [
          "Teknisyen müşterinin konumunu açar; o konumdaki cihazlar listelenir.",
          "Her cihazın bakımı yapılır, yapılan işlem ve tarih kayda geçer.",
          "Bir sonraki bakım tarihi otomatik hesaplanır.",
        ],
      },
      {
        title: "Dolum ve son kullanım uyarısı",
        steps: [
          "Dolum veya son kullanım tarihi yaklaşan cihazlar hatırlatıcı listesine düşer.",
          "Servis firması müşteriyi önceden bilgilendirir ve ziyaret planlar.",
          "Dolumu yapılan cihazın lot ve tarih bilgisi güncellenir.",
        ],
      },
      {
        title: "Müşteri raporu",
        steps: [
          "Müşteri ve konum bazında cihaz durumu filtrelenir.",
          "Bakımı yapılan, yaklaşan ve süresi geçen cihazlar raporlanır.",
        ],
      },
    ],
    tech: ["Web uygulaması", "Hatırlatıcı servisleri", "Raporlama"],
    visual: "fire-safety",
    accent: "amber",
    preview: "concept",
  },
  {
    slug: "esyp-karekod-platform",
    name: "ESYP / Karekod Platform",
    tagline: "Çok kiracılı uygulamaların altında çalışan tenant yönetim katmanı.",
    summary:
      "Yeni müşteri için veritabanı oluşturmaktan domain bağlamaya kadar tenant yaşam döngüsünü otomatikleştiren altyapı ve yönetim platformu.",
    categories: ["altyapi", "saas"],
    featuredOrder: 8,
    purpose: "Çok kiracılı ürünlerde her yeni müşterinin kurulumunu elle yapılan bir iş olmaktan çıkarıp tekrarlanabilir bir sürece dönüştürmek.",
    problem:
      "Her yeni müşteri için veritabanı açmak, şemayı hazırlamak, domain tanımlamak ve modülleri etkinleştirmek elle yapıldığında yavaş ve hataya açık.",
    audience: ["SaaS ürün ekipleri", "Sistem yöneticileri"],
    features: [
      "Tenant provisioning",
      "Veritabanı oluşturma ve yönetme",
      "Domain yönetimi",
      "Provisioning jobs",
      "Yönetim API'leri",
      "Docker tabanlı geliştirme altyapısı",
      "PostgreSQL",
    ],
    tech: ["PostgreSQL", "Docker", "REST API", "Job kuyruğu"],
    visual: "tenant-platform",
    accent: "violet",
    preview: "concept",
  },
  {
    slug: "teknik-servis-destek",
    name: "Teknik Servis & Destek Yönetimi",
    tagline: "Talep, saha ve personel takibi tek akışta.",
    summary:
      "Destek talepleri, servis kayıtları, müşteri ve firma takibi, personel atama ve saha servis operasyonlarını yöneten sistem.",
    categories: ["saas"],
    features: [
      "Destek talepleri",
      "Servis kayıtları",
      "Müşteri ve firma takibi",
      "Personel atama",
      "Saha servis operasyonları",
      "Durum takibi",
      "Raporlama",
    ],
    tech: ["Web uygulaması"],
    visual: "service-desk",
    accent: "blue",
    preview: "concept",
  },
  {
    slug: "karekod-mail",
    name: "Karekod Mail / Mailcow",
    tagline: "Kurumsal e-posta altyapısı ve mail hosting.",
    summary:
      "Mailcow ve SOGo üzerine kurulu, SMTP relay ve DKIM/SPF/DMARC yapılandırmalarıyla teslim edilebilirliği gözeten kurumsal e-posta altyapısı.",
    categories: ["altyapi"],
    features: [
      "Mailcow",
      "SOGo web arayüzü",
      "SMTP relay",
      "DKIM, SPF, DMARC",
      "Linux sunucu yönetimi",
      "Kurumsal mail hosting",
    ],
    tech: ["Mailcow", "SOGo", "Postfix/SMTP", "Linux", "Docker", "DNS"],
    visual: "none",
    accent: "violet",
    preview: "none",
  },
  {
    slug: "scada-ekran-kayit",
    name: "SCADA Ekran Kayıt Sistemi",
    tagline: "Fabrika SCADA ekranlarını IP kamera altyapısına bağlayan çözüm.",
    summary:
      "SCADA bilgisayarlarının görüntüsünü Screen2IP ile RTSP akışına dönüştürüp kapalı devre ağ üzerinden NVR'a 7/24 kaydeden altyapı.",
    categories: ["altyapi", "otomasyon"],
    problem:
      "SCADA ekranlarında olan biten geriye dönük izlenemediğinde arıza ve olay analizinde kritik bilgi kayboluyor.",
    features: [
      "Screen2IP ile ekran yakalama",
      "RTSP akışı",
      "Sabit IP yapılandırması",
      "Kapalı devre ağ",
      "NVR kayıt sistemi",
      "7/24 ekran kaydı",
    ],
    tech: ["Screen2IP", "RTSP", "NVR", "Ağ yapılandırması"],
    visual: "none",
    accent: "cyan",
    preview: "none",
  },
  {
    slug: "wokgo",
    name: "Wokgo",
    tagline: "Restoran dijital sipariş ve yönetim çözümleri.",
    summary: "Restoranlar için dijital sipariş ve yönetim çözümleri.",
    categories: ["saas"],
    features: ["Dijital sipariş", "Restoran yönetimi"],
    tech: [],
    visual: "none",
    accent: "amber",
    preview: "none",
  },
  {
    slug: "karpin",
    name: "KARPİN",
    tagline: "İşletme yönetim yazılımı.",
    summary: "İşletmelerin günlük yönetim süreçleri için geliştirilen yazılım.",
    categories: ["saas"],
    features: ["İşletme yönetimi"],
    tech: [],
    visual: "none",
    accent: "blue",
    preview: "none",
  },
  {
    slug: "doviz-kiosk",
    name: "Döviz Kiosk Ekranı",
    tagline: "SQL Server'dan beslenen canlı kur ekranı.",
    summary:
      "SQL Server veri bağlantısıyla canlı kur verilerini gösteren, TV ve kiosk ekranlarına uyumlu, kendini otomatik yenileyen gösterim.",
    categories: ["otomasyon"],
    features: ["SQL Server veri bağlantısı", "Canlı kur verileri", "Responsive TV/kiosk ekranı", "Otomatik yenileme"],
    tech: ["SQL Server", "Web arayüzü"],
    visual: "none",
    accent: "amber",
    preview: "none",
  },
  {
    slug: "isg-egitim",
    name: "İSG Eğitim Platformu",
    tagline: "Konu bazlı, animasyonlu iş sağlığı ve güvenliği eğitimleri.",
    summary:
      "Mikro eğitimler ve animasyonlu İSG videolarıyla cihaz/oturum bazlı, kontrollü erişimli öğrenme platformu.",
    categories: ["saas"],
    features: [
      "Konu bazlı mikro eğitimler",
      "Animasyonlu iş sağlığı ve güvenliği videoları",
      "Cihaz / oturum bazlı öğrenme",
      "Eğitim içeriklerine kontrollü erişim",
    ],
    tech: ["Web uygulaması", "Video"],
    visual: "none",
    accent: "cyan",
    preview: "none",
  },
  {
    slug: "whatsapp-otomasyon",
    name: "WhatsApp & İş Süreci Otomasyonları",
    tagline: "Mesajlaşmayı iş akışlarına bağlayan otomasyonlar.",
    summary:
      "WhatsApp Cloud API ve webhook tabanlı mesajlaşma ile otomatik yanıtlar, iş akışları ve harici servis entegrasyonları.",
    categories: ["otomasyon", "entegrasyon"],
    features: [
      "WhatsApp Cloud API",
      "Webhook tabanlı mesajlaşma",
      "Otomatik yanıt ve iş akışları",
      "Harici servis entegrasyonları",
    ],
    tech: ["WhatsApp Cloud API", "Webhook"],
    visual: "none",
    accent: "cyan",
    preview: "none",
  },
  {
    slug: "ag-sunucu-altyapi",
    name: "Ağ ve Sunucu Altyapıları",
    tagline: "Yazılımların üzerinde koştuğu ağ, sunucu ve güvenlik katmanı.",
    summary:
      "Fortinet, VLAN/VPN, Linux sunucular, Docker, Plesk, DNS, mail altyapıları ile kamera ve ağ sistemlerinin kurulum ve yönetimi.",
    categories: ["altyapi"],
    features: [
      "Fortinet güvenlik duvarı",
      "VLAN / VPN",
      "Linux sunucular",
      "Docker",
      "Plesk",
      "DNS",
      "Mail altyapıları",
      "Kamera ve ağ sistemleri",
    ],
    tech: ["Fortinet", "Linux", "Docker", "Plesk", "DNS"],
    visual: "none",
    accent: "violet",
    preview: "none",
  },
  {
    slug: "diger-calismalar",
    name: "Diğer Çalışmalar",
    tagline: "Özel yazılımlar, prototipler ve araştırmalar.",
    summary:
      "Ders programı, özel yazılım geliştirme projeleri, QR kontrollü otomasyon prototipleri, yapay zekâ tabanlı otomasyon araştırmaları ve mobil PWA yönetim arayüzleri.",
    categories: ["arge"],
    features: [
      "Ders Programı",
      "Özel yazılım geliştirme projeleri",
      "QR kontrollü otomasyon prototipleri",
      "Yapay zekâ tabanlı otomasyon araştırmaları",
      "Entegrasyon teknolojileri",
      "Mobil PWA yönetim arayüzleri",
    ],
    tech: [],
    visual: "none",
    accent: "violet",
    preview: "none",
  },
];

export const featuredProjects = projects
  .filter((p) => p.featuredOrder !== undefined)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
