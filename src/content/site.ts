/**
 * TR ve EN sitenin ortak içeriği (aynı tasarım, aynı bölümler). 2026-11-27.
 * KURAL: Müşterilerle gizlilik sözleşmeleri var. Hiçbir yerde marka, müşteri veya ürün adı yazılmaz;
 * ürünler yaptıkları işle anlatılır. Ekran görüntülerindeki veriler örnektir. Uydurma rakam/yorum yok.
 * Ödeme: yalnızca Garanti BBVA hesabına banka havalesi (TR: TL havale/EFT/FAST, yurt dışı: SWIFT).
 * Banka hesap bilgisi sitede yayınlanmaz; faturayla yazılı iletilir.
 */
export type Lang = "tr" | "en";

export const packagePrices = [
  { id: "qr", price: 99 },
  { id: "starter", price: 249 },
  { id: "business", price: 449, popular: true },
  { id: "booking", price: 599 },
  { id: "store", price: 799 },
  { id: "redesign", price: 199, from: true },
] as const;

const tr = {
  meta: {
    title: "Tunahan ŞİRİN — Yazılım geliştirici",
    description:
      "İşletmeler için web siteleri, online mağazalar, mobil uygulamalar, ERP ve entegrasyon yazılımları. Sabit fiyat, önce ücretsiz demo.",
  },
  nav: [
    { href: "#urunler", label: "Ürünler" },
    { href: "#paketler", label: "Paketler" },
    { href: "#odeme", label: "Ödeme" },
    { href: "#iletisim", label: "İletişim" },
  ],
  cta: "İletişime geç",
  hero: {
    kicker: "Tunahan ŞİRİN · Yazılım geliştirici",
    title: "Web sitesinden ERP'ye, işletmenin ihtiyacı olan yazılımı geliştiriyorum.",
    lead: "Kurumsal site, online mağaza, mobil uygulama, işletme yazılımı ve entegrasyonlar. Tasarımdan sunucuya kadar her katmanı tek kişi olarak kuruyor ve yayında tutuyorum.",
    primary: "Ürünlerimi incele",
    secondary: "WhatsApp'tan yaz",
    code: [
      ["c", "// bugün üzerinde çalıştıklarım"],
      ["k", "const ", "v", "yetkinlikler", "p", " = {"],
      ["i", "  web: ", "s", "[\"kurumsal site\", \"e-ticaret\", \"randevu\"],"],
      ["i", "  mobil: ", "s", "[\"iOS\", \"Android\"],"],
      ["i", "  erp: ", "s", "[\"satış\", \"stok\", \"finans\", \"üretim\"],"],
      ["i", "  entegrasyon: ", "s", "[\"pazaryeri\", \"POS\", \"WhatsApp\"],"],
      ["i", "  altyapı: ", "s", "[\"Linux\", \"Docker\", \"DNS\", \"e-posta\"],"],
      ["p", "};"],
      ["f", "yayınla", "p", "(yetkinlikler); ", "c", "// ✓ canlıda"],
    ] as string[][],
  },
  products: {
    eyebrow: "Ürünler",
    title: "Geliştirdiğim ve işletmelerde çalışan yazılımlar.",
    nda: "Müşterilerimle gizlilik sözleşmelerim olduğu için marka ve müşteri adı paylaşmıyorum. Ürünleri yaptıkları işle anlatıyorum; ekran görüntülerindeki veriler örnektir.",
    items: [
      {
        tag: "ERP",
        title: "Modüler işletme yönetim sistemi",
        text: "Satıştan üretime, finanstan insan kaynaklarına kadar işletmenin tüm akışını tek çatıda toplar.",
        points: ["Satış, stok, finans, cari, üretim, servis ve İK modülleri", "Her müşteriye bağımsız veritabanı", "Lisansa göre açılıp kapanan modüller"],
      },
      {
        tag: "Entegrasyon",
        title: "Pazaryeri sipariş entegrasyonu",
        text: "Farklı yemek ve market platformlarından gelen siparişleri tek ekranda, tek akışta yönetir.",
        points: ["Siparişi onaylama, reddetme ve teslim etme tek panelden", "Webhook ile anlık sipariş senkronizasyonu", "Yeni kanal = yeni adaptör; loglama ve hata yönetimi"],
      },
      {
        tag: "Teslimat",
        title: "Sipariş ve kurye platformu",
        text: "Siparişin oluşturulmasından kapıya teslimine kadar tüm süreci kapsar.",
        points: ["Müşteri ve kurye mobil uygulamaları (App Store ve Google Play'de yayında)", "Bayi ve operasyon paneli, kurye havuzu", "Canlı konum ve bildirimler"],
      },
      {
        tag: "POS",
        title: "Restoran POS ve mali cihaz entegrasyonu",
        text: "Masadan kasaya, satış operasyonunu kesintisiz yürütür.",
        points: ["Masa ve sipariş yönetimi, parçalı ödeme", "Mali POS cihazlarıyla doğrudan iletişim", "Bağlantı koptuğunda çalışmaya devam eden yapı"],
      },
      {
        tag: "Restoran",
        title: "QR menü ve masadan sipariş",
        text: "Misafir masadaki QR kodu okutur, menüyü görür ve siparişi verir; sipariş mutfağa anında düşer.",
        points: ["Dijital menü ve rezervasyon", "POS ile gerçek zamanlı iletişim", "Modüler ürün yapısı"],
      },
      {
        tag: "Servis",
        title: "Bakım ve teknik servis takibi",
        text: "Cihaz envanterini, dolum ve bakım tarihlerini ve saha servis kayıtlarını takip eder.",
        points: ["Son kullanım ve bakım hatırlatıcıları", "Müşteri ve konum ilişkilendirme", "Servis kayıtları ve raporlama"],
      },
      {
        tag: "Donanım",
        title: "Araç teşhis paneli",
        text: "Araçtan canlı veri okur, arıza kodlarını gösterir ve kodlama yapılmasını sağlar.",
        points: ["Motor, hız, sıcaklık ve voltaj verileri canlı", "Arıza kodları ve yedekleme", "Kodlama ve önce/sonra karşılaştırma"],
      },
    ],
  },
  screens: {
    eyebrow: "Gerçek ekranlar",
    title: "Ürünlerden birkaç ekran.",
    items: [
      { src: "/work/entegrasyon-siparisler.jpg", w: 1440, h: 900, caption: "Pazaryeri entegrasyonu · Farklı kanallardan gelen siparişler tek listede." },
      { src: "/work/siparis-kurye-paneli.jpg", w: 1600, h: 1000, caption: "Sipariş ve kurye platformu · Kurye, ödeme ve teslim durumu." },
      { src: "/work/obd-panel-canli-veri.jpg", w: 1600, h: 1000, caption: "Araç teşhis paneli · Canlı motor verileri." },
    ],
  },
  packages: {
    eyebrow: "Paketler",
    title: "Küçük işletmeler için sabit fiyatlı paketler.",
    intro: "Fiyatlar ABD doları cinsindendir. Türkiye'deki işler için TL teklif veririm. ERP, entegrasyon ve mobil uygulama gibi özel projelerde yazılı, sabit teklif hazırlarım.",
    from: "başlangıç",
    oneTime: "tek sefer",
    popular: "En çok tercih edilen",
    items: {
      qr: { name: "QR Menü", text: "Masadaki QR kodla açılan dijital menü.", time: "2 gün" },
      starter: { name: "Başlangıç Sitesi", text: "İşletmeyi ve iletişim bilgilerini anlatan tek sayfalık site.", time: "5 gün" },
      business: { name: "Kurumsal Site", text: "5 sayfaya kadar site, alan adı ve 1 yıl barındırma dahil.", time: "7 gün" },
      booking: { name: "Randevu Sitesi", text: "Müşterilerin online randevu veya masa ayırttığı site.", time: "10 gün" },
      store: { name: "Online Mağaza", text: "Ürün kataloğu, sepet, kartla ödeme ve sipariş bildirimleri.", time: "14 gün" },
      redesign: { name: "Site Yenileme", text: "Eski veya bozuk sitenin modern ve hızlı hale getirilmesi.", time: "5–7 gün" },
    },
    time: "Teslim",
    care: { name: "Bakım Planı", price: "$29 / ay", text: "Küçük değişiklikler, yedekleme, güncellemeler ve erişilebilirlik takibi." },
  },
  steps: {
    eyebrow: "Nasıl çalışıyorum",
    title: "Önce görürsün, sonra ödersin.",
    items: [
      { title: "Görüşme", text: "İhtiyacı yazılı olarak netleştiririz." },
      { title: "Ücretsiz demo", text: "Paketlerde sitenin çalışan bir demosunu ücretsiz hazırlarım." },
      { title: "Geliştirme", text: "Onayından sonra geliştiririm, ara sürümleri paylaşırım." },
      { title: "Yayın ve bakım", text: "Canlıya alırım; istersen bakımını da üstlenirim." },
    ],
  },
  payment: {
    eyebrow: "Ödeme planı",
    title: "Banka havalesiyle, aşamalı ve faturalı.",
    intro: "Ödemeler Garanti BBVA hesabıma banka havalesiyle yapılır. Hesap bilgileri faturayla birlikte yazılı olarak iletilir. Her ödeme için fatura kesilir.",
    plans: [
      { title: "Paketler", lines: ["Demo ücretsiz", "%50 demo onayında", "%50 yayından önce"] },
      { title: "Özel yazılım", lines: ["%30 sözleşmede", "%40 ara teslimde", "%30 yayında"] },
      { title: "Bakım planı", lines: ["Aylık veya yıllık", "Yıllık ödemede tek havale", "İstediğin zaman sonlandırılır"] },
    ],
    methods: [
      { title: "Türkiye'den", text: "TL ile havale, EFT veya FAST." },
      { title: "Yurt dışından", text: "USD veya EUR ile uluslararası banka transferi (SWIFT)." },
    ],
  },
  contact: {
    title: "Bir projen mi var? Birkaç cümleyle anlat, en kısa sürede dönüş yapayım.",
    whatsapp: "WhatsApp'tan yaz",
    email: "E-posta gönder",
    whatsappText: "Merhaba Tunahan Bey, bir proje hakkında görüşmek istiyorum.",
  },
  footer: { nda: "Projeler gizlilik sözleşmeleri kapsamındadır; marka ve müşteri adları paylaşılmaz." },
};

const en: typeof tr = {
  meta: {
    title: "Tunahan Şirin — Software developer",
    description:
      "Websites, online stores, mobile apps, ERP and integration software for businesses. Fixed prices, free demo first.",
  },
  nav: [
    { href: "#products", label: "Products" },
    { href: "#packages", label: "Packages" },
    { href: "#payment", label: "Payment" },
    { href: "#contact", label: "Contact" },
  ],
  cta: "Get in touch",
  hero: {
    kicker: "Tunahan Şirin · Software developer",
    title: "From websites to ERP, I build the software your business needs.",
    lead: "Business websites, online stores, mobile apps, business software and integrations. I design, build and run every layer myself, from the interface to the server.",
    primary: "See my products",
    secondary: "Chat on WhatsApp",
    code: [
      ["c", "// what I work on"],
      ["k", "const ", "v", "skills", "p", " = {"],
      ["i", "  web: ", "s", "[\"business sites\", \"e-commerce\", \"booking\"],"],
      ["i", "  mobile: ", "s", "[\"iOS\", \"Android\"],"],
      ["i", "  erp: ", "s", "[\"sales\", \"stock\", \"finance\", \"production\"],"],
      ["i", "  integrations: ", "s", "[\"marketplaces\", \"POS\", \"WhatsApp\"],"],
      ["i", "  infra: ", "s", "[\"Linux\", \"Docker\", \"DNS\", \"email\"],"],
      ["p", "};"],
      ["f", "deploy", "p", "(skills); ", "c", "// ✓ live"],
    ],
  },
  products: {
    eyebrow: "Products",
    title: "Software I've built that runs in real businesses.",
    nda: "I work under confidentiality agreements with my clients, so I don't share brand or client names. Each product is described by what it does; data in the screenshots is sample data.",
    items: [
      {
        tag: "ERP",
        title: "Modular business management system",
        text: "Brings a company's whole flow together in one place, from sales to production and finance to HR.",
        points: ["Sales, stock, finance, accounts, production, service and HR modules", "A separate database for every client", "Modules switched on and off by licence"],
      },
      {
        tag: "Integration",
        title: "Marketplace order integration",
        text: "Manages orders from different food and grocery platforms on one screen, in one flow.",
        points: ["Accept, reject and complete orders from one panel", "Real-time order sync via webhooks", "New channel = new adapter; logging and error handling"],
      },
      {
        tag: "Delivery",
        title: "Ordering and courier platform",
        text: "Covers the whole journey, from placing an order to delivery at the door.",
        points: ["Customer and courier mobile apps (live on the App Store and Google Play)", "Partner and operations panel, courier pool", "Live location and notifications"],
      },
      {
        tag: "POS",
        title: "Restaurant POS and fiscal device integration",
        text: "Runs sales from the table to the till without interruption.",
        points: ["Tables and orders, split payments", "Direct communication with fiscal POS devices", "Keeps working when the connection drops"],
      },
      {
        tag: "Restaurant",
        title: "QR menu and table ordering",
        text: "Guests scan the QR code on the table, see the menu and order; the kitchen gets it instantly.",
        points: ["Digital menu and reservations", "Real-time link to the POS", "Modular product structure"],
      },
      {
        tag: "Service",
        title: "Maintenance and field service tracking",
        text: "Tracks equipment inventory, refill and maintenance dates and field service records.",
        points: ["Expiry and maintenance reminders", "Linked to clients and locations", "Service records and reports"],
      },
      {
        tag: "Hardware",
        title: "Vehicle diagnostics panel",
        text: "Reads live data from the vehicle, shows fault codes and handles coding.",
        points: ["Live engine, speed, temperature and voltage data", "Fault codes and backups", "Coding with before/after comparison"],
      },
    ],
  },
  screens: {
    eyebrow: "Real screens",
    title: "A few screens from the products.",
    items: [
      { src: "/work/entegrasyon-siparisler.jpg", w: 1440, h: 900, caption: "Marketplace integration · Orders from different channels in one list." },
      { src: "/work/siparis-kurye-paneli.jpg", w: 1600, h: 1000, caption: "Ordering and courier platform · Courier, payment and delivery status." },
      { src: "/work/obd-panel-canli-veri.jpg", w: 1600, h: 1000, caption: "Vehicle diagnostics panel · Live engine data." },
    ],
  },
  packages: {
    eyebrow: "Packages",
    title: "Fixed-price packages for small businesses.",
    intro: "Prices are in US dollars. For custom projects like ERP, integrations and mobile apps, I prepare a fixed quote in writing.",
    from: "from",
    oneTime: "one-time",
    popular: "Most popular",
    items: {
      qr: { name: "QR Menu", text: "A digital menu guests open from a QR code on the table.", time: "2 days" },
      starter: { name: "Starter Website", text: "A one-page site with who you are and how to reach you.", time: "5 days" },
      business: { name: "Business Website", text: "Up to 5 pages, with domain and 1 year of hosting.", time: "7 days" },
      booking: { name: "Booking Website", text: "Customers book appointments or tables online.", time: "10 days" },
      store: { name: "Online Store", text: "Product catalogue, cart, card payments and order alerts.", time: "14 days" },
      redesign: { name: "Website Redesign", text: "An old or broken site made modern and fast.", time: "5–7 days" },
    },
    time: "Delivery",
    care: { name: "Care Plan", price: "$29 / month", text: "Small changes, backups, updates and uptime monitoring." },
  },
  steps: {
    eyebrow: "How I work",
    title: "You see it first, then you pay.",
    items: [
      { title: "Brief", text: "We agree on what you need, in writing." },
      { title: "Free demo", text: "For packages, I build a working demo of your site for free." },
      { title: "Build", text: "After your approval I build it and share progress." },
      { title: "Launch & care", text: "I put it live and can look after it afterwards." },
    ],
  },
  payment: {
    eyebrow: "Payment plan",
    title: "Bank transfer, in stages, with an invoice.",
    intro: "Payments are made by bank transfer to my Garanti BBVA account. Bank details are sent in writing with the invoice. Every payment is invoiced.",
    plans: [
      { title: "Packages", lines: ["Demo is free", "50% when you approve the demo", "50% before launch"] },
      { title: "Custom software", lines: ["30% on signing", "40% at the midpoint delivery", "30% at launch"] },
      { title: "Care plan", lines: ["Monthly or yearly", "One transfer for a year", "Cancel anytime"] },
    ],
    methods: [
      { title: "From abroad", text: "International bank transfer (SWIFT) in USD or EUR." },
      { title: "From Turkey", text: "Bank transfer in TRY (havale, EFT or FAST)." },
    ],
  },
  contact: {
    title: "Have a project? Tell me in a few sentences and I'll get back to you soon.",
    whatsapp: "Chat on WhatsApp",
    email: "Send an email",
    whatsappText: "Hi Tunahan, I'd like to talk about a project.",
  },
  footer: { nda: "Projects are covered by confidentiality agreements; brand and client names are not shared." },
};

export const content = { tr, en };
export type SiteContent = typeof tr;
