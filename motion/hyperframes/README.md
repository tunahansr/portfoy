# HyperFrames kompozisyonları

**HyperFrames = HTML/GSAP tabanlı, deterministik render edilen sinematik tanıtım videoları (sitede optimize MP4 + poster olarak gömülür).**

Her video düz HTML + CSS + GSAP ile yazılır. HyperFrames CLI, duraklatılmış zaman çizelgesini (timeline) kare kare ileri sararak Chrome'da yakalar ve MP4'e çevirir; aynı kaynak her render'da aynı kareleri üretir (`Date.now()`, tohumsuz `Math.random()`, ağ isteği veya zamanlayıcı yok). Site bu videoları canlı oynatmaz: `public/videos/*.mp4` (720p, sessiz, `+faststart`) ve `public/posters/*.jpg` olarak gömer. Remotion tarafı (`motion/remotion/`) ise sitede etkileşimli oynatılan React kompozisyonlarıdır.

## Kompozisyonlar

| Klasör | Video | Süre | İçerik |
| --- | --- | --- | --- |
| `brand-intro/` | `public/videos/brand-intro.mp4` | 10 sn | Karanlık sahnede tohumlu (deterministik) ışık/veri parçacıkları belirir, dönen bir teknoloji çekirdeğinde birleşir; çekirdek tek bir amber dalgayla "ateşlenir". Çekirdeğin etrafındaki yörüngelerde veri akışları ERP, POS, API, Mobil, Kurye ve Altyapı etiketleriyle döner. Kamera çekirdeği yukarı alır; "Tunahan Şirin", "Fikirleri çalışan sistemlere dönüştürüyorum." ve "Karekod Bilişim" belirir. |
| `api-network/` | `public/videos/api-integration-network.mp4` | 10 sn | Yemeksepeti, Trendyol Go Yemek, Trendyol Go Market ve Migros Yemek (logo değil, nötr metin etiketleri) sipariş paketlerini "Karekod Entegrasyon" merkezine yollar. Paket merkezde webhook → doğrulama → şube eşleme → sipariş senkronizasyonu adımlarından geçip "POS / ERP"ye iletilir; log paneli temsili `POST /webhooks 200` satırları akıtır. Kapanış: "Tüm sipariş kanalları. Tek merkez." |
| `pos-payments/` | `public/videos/pos-payments.mp4` | 10 sn | Masa 4 sipariş ekranı, iki parçalı ödeme (Kart + Nakit), PC-Link hattı üzerinden WebSocket mesajlarıyla "Mali POS · Hugin" cihazına (genel bir çizim, gerçek cihaz görseli değil) gönderim, amber "Fiş onaylandı" anı; ardından offline-first akış: Bağlantı yok → Kuyrukta → Senkronize (Cloud-Link). Kapanış: "Masadan mali cihaza kesintisiz akış." |

Ekrandaki tutarlar ve log satırları temsilîdir; gerçek müşteri, istatistik veya performans verisi içermez.

Her projenin yapısı:

```
<proje>/
  index.html            kök kompozisyon (süre, fps, sahne host'ları)
  compositions/*.html   sahneler (<template> içinde stil + markup + GSAP timeline)
  assets/fonts/         Bricolage Grotesque, Geist, Geist Mono, Instrument Serif (woff2, latin + latin-ext, OFL-1.1)
  assets/vendor/        gsap.min.js (3.15, render ağdan bağımsız olsun diye)
  hyperframes.json, meta.json, package.json   CLI scaffold dosyaları
```

Renkler `src/lib/brand.ts` ile aynıdır: zemin graphite/night, sistem ve veri akışı mavi/cyan, mimari/altyapı violet, amber yalnızca enerji ve başarı anlarında.

## Komutlar

Repo kökünden:

```bash
npm run motion:hf:render        # üç videoyu render eder, web kopyası + poster üretir, ffprobe ile doğrular
node motion/hyperframes/render-all.mjs brand-intro     # tek proje
node motion/hyperframes/render-all.mjs --skip-render   # mevcut master'lardan yalnızca MP4/poster üret
```

Bir proje üzerinde çalışırken (proje klasöründe):

```bash
npx hyperframes@0.9.8 lint            # statik kontrol
npx hyperframes@0.9.8 check --json    # lint + runtime + layout + kontrast denetimi (kapı)
npx hyperframes@0.9.8 snapshot --at 1,4,8   # belirli anların PNG'leri (.hyperframes/artifacts/snapshots)
npx hyperframes@0.9.8 preview         # tarayıcıda Studio önizleme
npx hyperframes@0.9.8 render --quality high -o renders/master.mp4
```

`render-all.mjs` şu adımları izler: `hyperframes render` → `renders/master.mp4` (1920×1080, 30 fps) → ffmpeg ile `public/videos/<ad>.mp4` (H.264 High, 1280×720, CRF 22, ses izi yok, `-movflags +faststart`) → `public/posters/<ad>.jpg` (1280 px temsilî kare) → ffprobe ile codec/süre/ses kontrolü.

### Gereksinimler

- Node 22+, FFmpeg/FFprobe.
- Chrome: HyperFrames sabitlenmiş bir Chrome kullanır (`npx hyperframes browser ensure`). İndirilemeyen ortamlarda `HYPERFRAMES_BROWSER_PATH` ile mevcut bir `chrome-headless-shell` gösterilebilir; `render-all.mjs` bu değişkeni, yoksa `/opt/pw-browsers/chromium_headless_shell-*` altındaki ikiliyi kullanır. Headless shell, hızlı `beginframe` yakalama yolunu açar.
- Telemetri script içinde kapalıdır (`HYPERFRAMES_NO_TELEMETRY=1`); bulut render veya HeyGen hesabı gerekmez.

## Düzenleme notları

- Zamanlanan her öğe `class="clip"`, `data-start`, `data-duration` taşır; her sahne tek bir duraklatılmış GSAP timeline'ı `window.__timelines["<id>"]` altında kaydeder.
- Canvas/SVG ile çizilen kısımlar (parçacıklar, yörüngeler, paketler) timeline'a bağlı bir saat tween'inin `onUpdate`'inden, yalnızca `t`'ye bağlı saf bir `draw(t)` fonksiyonuyla çizilir.
- Fontlar her sahnede `@font-face` ile `assets/fonts/` dosyalarına bağlanır; Türkçe karakterler (ş ğ ı İ ö ü ç) ve ₺ latin + latin-ext alt kümeleriyle karşılanır.
- `.hyperframes/` (snapshot, yerel geçmiş) ve `renders/` git'e girmez; kaynak, fontlar ve vendored GSAP commit edilir.
