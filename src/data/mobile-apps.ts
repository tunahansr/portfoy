/**
 * MOBİL UYGULAMA ÖNİZLEME VERİSİ — tek kaynak.
 *
 * Her uygulama; ekran tanımları (`views`), otomatik demo senaryosu (`demo`) ve
 * telefon içinde kullanılan yerel örnek içerikten oluşur. Ekranların çizimi
 * `src/components/mobile-preview/screens` altında, `renderKey` ile eşleşen
 * bileşenlerde yapılır.
 *
 * DÜRÜSTLÜK KURALLARI
 *  - Henüz gerçek ekran görüntüsü yoktur; tüm arayüzler ürün tanımına göre çizilmiş
 *    KONSEPT önizlemelerdir ve sitede "Konsept önizleme" etiketiyle gösterilir.
 *  - Restoran, kişi, adres ve fiyatlar bilerek jenerik / temsilidir. Gerçek bir
 *    backend'e bağlanılmaz; tüm durum tarayıcıdaki yerel demo durumudur.
 *
 * GERÇEK EKRAN EKLEMEK
 *  1. Görseli `/public/projects/<slug>/<dosya>.png` altına koyun (390×844 oranında dikey).
 *  2. İlgili uygulamanın `screens` dizisine `{ src, alt, viewId }` ekleyin.
 *     `viewId` verilen ekranda konsept çizim yerine gerçek görsel gösterilir.
 *  3. Tüm ekranlar doğrulandığında `preview: "real"` ve `verified: true` yapın.
 */

export type MobileAppId = "yedinizmi-musteri" | "yedinizmi-kurye" | "catkapi-operasyon" | "erp-mobil";

export type ScreenRenderKey =
  | "musteri.kesfet"
  | "musteri.menu"
  | "musteri.sepet"
  | "musteri.onay"
  | "musteri.takip"
  | "musteri.bildirim"
  | "kurye.vardiya"
  | "kurye.havuz"
  | "kurye.detay"
  | "kurye.rota"
  | "kurye.teslim"
  | "ops.canli"
  | "ops.paketler"
  | "ops.vardiya"
  | "ops.rapor"
  | "erp.dashboard"
  | "erp.stok"
  | "erp.cari"
  | "erp.onay";

export type OpsFilter = "hepsi" | "musait" | "yolda" | "molada";

/** Telefon içindeki yerel demo durumunu değiştiren eylemler (gerçek API çağrısı yoktur). */
export type DemoAction =
  | { type: "reset" }
  | { type: "selectRestaurant"; id: string }
  | { type: "cartAdd"; itemId: string }
  | { type: "cartRemove"; itemId: string }
  | { type: "seedCart" }
  | { type: "placeOrder" }
  | { type: "trackAdvance" }
  | { type: "readNotification" }
  | { type: "setOnline"; value: boolean }
  | { type: "acceptTask" }
  | { type: "navAdvance" }
  | { type: "deliver" }
  | { type: "opsFilter"; value: OpsFilter }
  | { type: "togglePackage"; id: string }
  | { type: "stockQuery"; value: string }
  | { type: "approve"; id: string };

export interface MobileView {
  id: string;
  /** Ekran listesinde ve erişilebilir etikette görünen ad */
  title: string;
  /** Ekranın ne gösterdiğine dair kısa açıklama (yan panelde) */
  description: string;
  renderKey: ScreenRenderKey;
  /** Kullanıcı ekrana elle geldiğinde ekranın anlamlı görünmesi için uygulanan eylem */
  enter?: DemoAction;
}

/**
 * Otomatik demo adımı: ekran gösterilir → `wait` ms beklenir → `target` (data-demo
 * değeri) üzerinde simüle dokunuş → `action` uygulanır → sonraki adıma geçilir.
 */
export interface DemoStep {
  view: string;
  target?: string;
  action?: DemoAction;
  wait?: number;
}

export type AppAccent = "amber" | "blue" | "cyan";

export interface MobileApp {
  id: MobileAppId;
  name: string;
  /** Sekmede tek satırlık açıklama */
  description: string;
  /** İlgili proje (src/data/projects.ts) */
  projectSlug: string;
  accent: AppAccent;
  /** Hex renkler — telefon içi arayüz ve parıltı için */
  accentHex: string;
  secondaryHex: string;
  theme: "light" | "dark";
  preview: "concept" | "real";
  /** Ekranlar gerçek üründen doğrulandı mı */
  verified: boolean;
  note?: string;
  views: MobileView[];
  demo: DemoStep[];
  /** Gerçek ekran görüntüleri (ileride). `viewId` verilirse o ekranda konsept yerine gösterilir. */
  screens?: { src: string; alt: string; viewId?: string }[];
}

export const CONCEPT_LABEL = "Konsept önizleme";

/* ───────────────────────── ÖRNEK İÇERİK (jenerik) ───────────────────────── */

export const demoRestaurants = [
  { id: "kofteci-usta", name: "Köfteci Usta", cuisine: "Izgara · Köfte", eta: "20–30 dk", rating: "4,8", icon: "beef", tone: "#E8743B" },
  { id: "deniz-pide", name: "Deniz Pide", cuisine: "Pide · Lahmacun", eta: "25–35 dk", rating: "4,7", icon: "pizza", tone: "#D9A23A" },
  { id: "mahalle-burger", name: "Mahalle Burger", cuisine: "Burger · Patates", eta: "15–25 dk", rating: "4,6", icon: "sandwich", tone: "#B65B3E" },
  { id: "tatli-duragi", name: "Tatlı Durağı", cuisine: "Tatlı · Kahve", eta: "15–20 dk", rating: "4,9", icon: "ice-cream", tone: "#C77A9A" },
] as const;

export const demoMenu = [
  { id: "izgara-kofte", name: "Izgara Köfte Porsiyon", detail: "Pilav, közlenmiş biber, domates", price: 220 },
  { id: "kofte-ekmek", name: "Köfte Ekmek", detail: "Yarım ekmek, soğan, yeşillik", price: 150 },
  { id: "piyaz", name: "Piyaz", detail: "Tahinli, yumurtalı", price: 70 },
  { id: "ayran", name: "Ayran", detail: "300 ml", price: 30 },
] as const;

export const demoAddresses = {
  restaurant: "Köfteci Usta · Merkez",
  customer: "Merkez Mah.",
  customerShort: "Ev · Merkez",
} as const;

export const demoCouriers = [
  { id: "k1", name: "Ahmet K.", status: "yolda", detail: "2 paket · 1,2 km" },
  { id: "k2", name: "Selin D.", status: "musait", detail: "Merkez noktada" },
  { id: "k3", name: "Mert Y.", status: "yolda", detail: "1 paket · 3,4 km" },
  { id: "k4", name: "Zeynep Ö.", status: "molada", detail: "Mola · 12 dk" },
  { id: "k5", name: "Emre T.", status: "musait", detail: "Merkez noktada" },
  { id: "k6", name: "Burak A.", status: "yolda", detail: "1 paket · 0,8 km" },
] as const satisfies readonly { id: string; name: string; status: Exclude<OpsFilter, "hepsi">; detail: string }[];

export const demoPackages = [
  { id: "P-1042", from: "Köfteci Usta", to: "Merkez Mah.", status: "Yolda", courier: "Ahmet K.", minutes: 12 },
  { id: "P-1043", from: "Deniz Pide", to: "Sahil Cd.", status: "Hazırlanıyor", courier: "Atanmadı", minutes: 4 },
  { id: "P-1044", from: "Mahalle Burger", to: "Çarşı içi", status: "Yolda", courier: "Mert Y.", minutes: 18 },
  { id: "P-1045", from: "Tatlı Durağı", to: "Merkez", status: "Teslim edildi", courier: "Burak A.", minutes: 26 },
] as const;

export const demoStock = {
  query: "STK-0381",
  name: "Kablo Kanalı 40×60",
  unit: "adet",
  warehouses: [
    { name: "Merkez depo", qty: 240, max: 300 },
    { name: "Şube depo", qty: 36, max: 120 },
    { name: "Yoldaki sevkiyat", qty: 50, max: 120 },
  ],
} as const;

export const demoApprovals = [
  { id: "st-118", title: "Satın alma talebi", ref: "#ST-118", detail: "Depo · 12 kalem", amount: "₺14.600" },
  { id: "iz-042", title: "İzin talebi", ref: "#IZ-042", detail: "Satış ekibi · 2 gün", amount: "" },
  { id: "fy-207", title: "Fiyat değişikliği", ref: "#FY-207", detail: "8 ürün · liste güncelleme", amount: "" },
] as const;

/* ───────────────────────── UYGULAMALAR ───────────────────────── */

export const mobileApps: MobileApp[] = [
  {
    id: "yedinizmi-musteri",
    name: "Yedinizmi Müşteri",
    description: "Restoran keşfi, sepet, sipariş ve canlı kurye takibi.",
    projectSlug: "yedinizmi",
    accent: "amber",
    accentHex: "#FFB547",
    secondaryHex: "#45E0F0",
    theme: "light",
    preview: "concept",
    verified: true,
    views: [
      {
        id: "kesfet",
        title: "Keşfet",
        description: "Yakındaki restoranlar teslimat süresi ve puanla listelenir; bir restorana dokunmak menüsünü açar.",
        renderKey: "musteri.kesfet",
      },
      {
        id: "menu",
        title: "Restoran menüsü",
        description: "Ürünler tek dokunuşla sepete eklenir; alttaki sepet çubuğu tutarı anlık günceller.",
        renderKey: "musteri.menu",
      },
      {
        id: "sepet",
        title: "Sepet",
        description: "Adetler düzenlenir, ara toplam ve teslimat bilgisi siparişten önce netleşir.",
        renderKey: "musteri.sepet",
        enter: { type: "seedCart" },
      },
      {
        id: "onay",
        title: "Sipariş onayı",
        description: "Teslimat adresi ve ödeme yöntemi son kez gözden geçirilip sipariş verilir.",
        renderKey: "musteri.onay",
        enter: { type: "seedCart" },
      },
      {
        id: "takip",
        title: "Canlı takip",
        description: "Sipariş Alındı → Hazırlanıyor → Yolda → Teslim edildi adımlarıyla ilerler; kurye haritada rotada hareket eder.",
        renderKey: "musteri.takip",
        enter: { type: "placeOrder" },
      },
      {
        id: "bildirim",
        title: "Bildirim",
        description: "Teslimat tamamlandığında anlık bildirim gelir; tek dokunuşla sipariş özetine dönülür.",
        renderKey: "musteri.bildirim",
      },
    ],
    demo: [
      { view: "kesfet", target: "restaurant-kofteci-usta", action: { type: "selectRestaurant", id: "kofteci-usta" } },
      { view: "menu", target: "add-izgara-kofte", action: { type: "cartAdd", itemId: "izgara-kofte" }, wait: 1600 },
      { view: "menu", target: "add-ayran", action: { type: "cartAdd", itemId: "ayran" }, wait: 900 },
      { view: "menu", target: "go-cart", wait: 900 },
      { view: "sepet", target: "checkout" },
      { view: "onay", target: "place-order", action: { type: "placeOrder" } },
      { view: "takip", action: { type: "trackAdvance" }, wait: 2400 },
      { view: "takip", action: { type: "trackAdvance" }, wait: 2400 },
      { view: "takip", action: { type: "trackAdvance" }, wait: 3200 },
      { view: "takip", wait: 1800 },
      { view: "bildirim", target: "notification", action: { type: "readNotification" }, wait: 2400 },
    ],
  },
  {
    id: "yedinizmi-kurye",
    name: "Yedinizmi Kurye",
    description: "Vardiya, görev havuzu, rota ve teslim onayı.",
    projectSlug: "yedinizmi",
    accent: "amber",
    accentHex: "#FFB547",
    secondaryHex: "#45E0F0",
    theme: "dark",
    preview: "concept",
    verified: true,
    views: [
      {
        id: "vardiya",
        title: "Vardiya",
        description: "Kurye çevrimiçi olduğunda görev havuzuna dahil olur; vardiya süresi ve günlük özet görünür.",
        renderKey: "kurye.vardiya",
      },
      {
        id: "havuz",
        title: "Görev havuzu",
        description: "Yeni teslimat talebi mesafe ve süre bilgisiyle düşer; kurye süre dolmadan kabul eder.",
        renderKey: "kurye.havuz",
        enter: { type: "setOnline", value: true },
      },
      {
        id: "detay",
        title: "Görev detayı",
        description: "Restoran ve müşteri adresleri sırayla gösterilir; paket teslim alınınca rota başlar.",
        renderKey: "kurye.detay",
        enter: { type: "acceptTask" },
      },
      {
        id: "rota",
        title: "Navigasyon",
        description: "Rota harita üzerinde çizilir; sıradaki dönüş ve kalan mesafe üstte sabit durur.",
        renderKey: "kurye.rota",
        enter: { type: "acceptTask" },
      },
      {
        id: "teslim",
        title: "Teslim onayı",
        description: "Teslimat kodu doğrulanır ve paket teslim edildi olarak işaretlenir.",
        renderKey: "kurye.teslim",
        enter: { type: "acceptTask" },
      },
    ],
    demo: [
      { view: "vardiya", target: "online-toggle", action: { type: "setOnline", value: true }, wait: 1800 },
      { view: "vardiya", target: "open-pool", wait: 1400 },
      { view: "havuz", target: "accept-task", action: { type: "acceptTask" }, wait: 2400 },
      { view: "detay", target: "start-route", wait: 2600 },
      { view: "rota", action: { type: "navAdvance" }, wait: 1400 },
      { view: "rota", target: "arrived", wait: 3000 },
      { view: "teslim", target: "confirm-delivery", action: { type: "deliver" }, wait: 2200 },
      { view: "teslim", wait: 2600 },
    ],
  },
  {
    id: "catkapi-operasyon",
    name: "Çatkapı Express Operasyon",
    description: "Canlı kurye durumu, paketler, vardiya ve günlük rapor.",
    projectSlug: "catkapi-express",
    accent: "amber",
    accentHex: "#FFB547",
    secondaryHex: "#A3ADBD",
    theme: "dark",
    preview: "concept",
    verified: true,
    views: [
      {
        id: "canli",
        title: "Canlı durum",
        description: "Ekipteki her kuryenin anlık durumu: müsait, yolda veya molada. Filtreyle tek duruma odaklanılır.",
        renderKey: "ops.canli",
      },
      {
        id: "paketler",
        title: "Paket listesi",
        description: "Açık paketler restoran, adres, kurye ve geçen süreyle izlenir; satıra dokununca ayrıntı açılır.",
        renderKey: "ops.paketler",
      },
      {
        id: "vardiya",
        title: "Vardiya planı",
        description: "Günün vardiyaları zaman çizelgesinde; yoğun saatlerdeki kapasite tek bakışta görülür.",
        renderKey: "ops.vardiya",
      },
      {
        id: "rapor",
        title: "Günlük rapor",
        description: "Saatlik paket dağılımı ve ortalama teslim süresi. Grafikteki değerler temsilidir.",
        renderKey: "ops.rapor",
      },
    ],
    demo: [
      { view: "canli", target: "filter-yolda", action: { type: "opsFilter", value: "yolda" }, wait: 2000 },
      { view: "canli", target: "tab-paketler", action: { type: "opsFilter", value: "hepsi" }, wait: 1800 },
      { view: "paketler", target: "package-P-1043", action: { type: "togglePackage", id: "P-1043" }, wait: 1800 },
      { view: "paketler", target: "tab-vardiya", wait: 1800 },
      { view: "vardiya", target: "tab-rapor", wait: 2600 },
      { view: "rapor", target: "tab-canli", wait: 3200 },
    ],
  },
  {
    id: "erp-mobil",
    name: "KAREKOD ERP Mobil",
    description: "Özet panel, stok sorgu, cari kart ve onaylar.",
    projectSlug: "karekod-erp",
    accent: "blue",
    accentHex: "#3D7BFF",
    secondaryHex: "#45E0F0",
    theme: "light",
    preview: "concept",
    verified: false,
    note: "Doğrulanmış ekranlar eklendiğinde güncellenecek",
    views: [
      {
        id: "dashboard",
        title: "Özet panel",
        description: "Günün satış, açık sipariş ve kritik stok göstergeleri tek ekranda; değerler örnek veridir.",
        renderKey: "erp.dashboard",
      },
      {
        id: "stok",
        title: "Stok sorgu",
        description: "Stok kodu veya adıyla arama; depolara göre miktar ve doluluk anında görünür.",
        renderKey: "erp.stok",
        enter: { type: "stockQuery", value: demoStock.query },
      },
      {
        id: "cari",
        title: "Cari kart",
        description: "Cari bakiye, vade durumu ve son hareketler sahada da erişilebilir.",
        renderKey: "erp.cari",
      },
      {
        id: "onay",
        title: "Onay bekleyenler",
        description: "Satın alma, izin ve fiyat talepleri mobilden onaylanır.",
        renderKey: "erp.onay",
      },
    ],
    demo: [
      { view: "dashboard", target: "tab-stok", wait: 2600 },
      { view: "stok", target: "stock-search", action: { type: "stockQuery", value: demoStock.query }, wait: 1200 },
      { view: "stok", target: "tab-cari", wait: 2600 },
      { view: "cari", target: "tab-onay", wait: 2600 },
      { view: "onay", target: "approve-st-118", action: { type: "approve", id: "st-118" }, wait: 1800 },
      { view: "onay", target: "tab-dashboard", wait: 2200 },
    ],
  },
];

export function getMobileApp(id: string): MobileApp | undefined {
  return mobileApps.find((a) => a.id === id);
}
