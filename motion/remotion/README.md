# Remotion — ürün showcase'leri

**Rolü:** Remotion = React tabanlı, parametrik ve site içinde `@remotion/player` ile etkileşimli oynatılabilen ürün showcase'leri. HyperFrames tarafı (`motion/hyperframes`) marka/intro videolarını üretir; Remotion ise ürün arayüzlerini React ile çizip hem MP4 olarak dışa aktarır hem de sitede canlı oynatılır.

## Composition'lar

| id | Boyut | Süre | Dosya |
| --- | --- | --- | --- |
| `KarekodErpShowcase` | 1920×1080, 30 fps | 12 sn (360 kare) | `src/compositions/KarekodErpShowcase.tsx` |
| `YedinizmiMobileExperience` | 1080×1350 (4:5), 30 fps | 15 sn (450 kare) | `src/compositions/YedinizmiMobileExperience.tsx` |

- **KarekodErpShowcase:** ERP paneli React ile çizilir. Kenar çubuğunda Satış, Stok, Finans, Cari, Üretim, Servis ve İK modülleri var. Ana panel Satış → Stok → Finans → Üretim görünümleri arasında dönüşür; grafikler çizilerek gelir. Ardından pencere küçülüp merkezi “Lisans & modül yönetimi” düğümüne dönüşür ve her biri kendi veritabanına sahip Firma A/B/C kiracılarına bağlanır. Video, “KAREKOD ERP — Modüler · Çok kiracılı · Sektöre uyarlanabilir” başlığıyla kapanır. Paneldeki sayılar gösterim amaçlıdır ve pencerede “Örnek veri” etiketiyle belirtilir.
- **YedinizmiMobileExperience:** Akış sırasıyla müşteri uygulaması (restoran seçimi, sepet, sipariş), restoran paneli (onay, hazırlık, kurye ataması) ve kurye uygulamasından (görev bildirimi, kabul) oluşur. Sonrasında müşteri ve kurye ekranlarında canlı harita ve hareket eden kurye noktası gösterilir, teslim anıyla biter. Kadrajda “Konsept önizleme” etiketi var. 4:5 oran seçildi: içerik telefon ağırlıklı olduğu için dikey kadraj cihazı büyük ve okunaklı tutuyor, mobilde letterbox olmadan tam genişlikte oynuyor.

Her composition dosyası bileşenle birlikte bir meta nesnesi dışa aktarır (`KAREKOD_ERP_SHOWCASE`, `YEDINIZMI_MOBILE_EXPERIENCE`: `id`, `width`, `height`, `fps`, `durationInFrames`). Site tarafındaki kullanım:

```tsx
import { Player } from "@remotion/player";
import { KarekodErpShowcase, KAREKOD_ERP_SHOWCASE } from "@motion/remotion/src/compositions/KarekodErpShowcase";

<Player
  component={KarekodErpShowcase}
  durationInFrames={KAREKOD_ERP_SHOWCASE.durationInFrames}
  fps={KAREKOD_ERP_SHOWCASE.fps}
  compositionWidth={KAREKOD_ERP_SHOWCASE.width}
  compositionHeight={KAREKOD_ERP_SHOWCASE.height}
  loop
  autoPlay
/>;
```

## Yapı

- `src/index.ts`: `registerRoot`
- `src/Root.tsx`: composition kayıtları
- `src/compositions/erp/*`: ERP sahneleri (pencere, modül görünümleri, kiracılar, kapanış)
- `src/compositions/yedinizmi/*`: uygulama ekranları, restoran paneli, harita, akış çubuğu
- `src/lib/*`: ortak parçalar. `brand.ts` renk ve easing değerlerini `src/lib/brand.ts` dosyasından alır (tek kaynak). Ayrıca `fonts.ts`, `Backdrop.tsx`, `devices.tsx` (telefon/tablet çerçeveleri) ve `paths.ts` (deterministik grafik yardımcıları) burada.

Fontlar (Bricolage Grotesque, Geist, Geist Mono, Instrument Serif) `@remotion/google-fonts` ile `latin` + `latin-ext` alt kümeleriyle yüklenir; bu sayede Türkçe karakterler doğru görünür. Bu yöntem hem render'da hem Player'da çalışır. Tüm animasyonlar `useCurrentFrame` + `interpolate` ile yapılır; `Math.random`/`Date` kullanılmaz, yani çıktı deterministiktir.

## Komutlar (repo kökünden)

```bash
npm run motion:remotion:studio            # Remotion Studio
npm run motion:remotion:render            # iki video + iki poster
npm run motion:remotion:render:erp        # sadece public/videos/karekod-erp-showcase.mp4
npm run motion:remotion:render:yedinizmi  # sadece public/videos/yedinizmi-mobile-experience.mp4
npm run motion:remotion:posters           # public/posters/*.jpg (ERP kare 85, Yedinizmi kare 360)
```

Videolar H.264 (`yuv420p`, BT.709) olarak, CRF 20 ve `slow` preset ile, ses izi olmadan (`--muted`) üretilir. Yapılandırma dosyası `remotion.config.ts`. Tarayıcı olarak `REMOTION_BROWSER_EXECUTABLE` ortam değişkeni ya da `/opt/pw-browsers/chromium` (varsa) kullanılır; ikisi de yoksa Remotion kendi headless shell'ini indirir. Tam Chromium kullanıldığında `chrome-for-testing` modu otomatik seçilir.
