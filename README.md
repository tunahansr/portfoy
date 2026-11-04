# Tunahan ŞİRİN — Portföy

**Beyond Code — The Systems I Build.** ERP, POS, SaaS, API entegrasyonları, mobil uygulamalar ve altyapı sistemleri geliştiren Tunahan ŞİRİN için animasyon odaklı, etkileşimli ve mobil öncelikli kişisel portföy.

## Hızlı başlangıç

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Node.js 22+ önerilir (HyperFrames CLI için zorunlu).

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run typecheck` | Route tiplerini üretir + TypeScript kontrolü |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright: 8 ekran genişliği, işlev, SEO ve axe erişilebilirlik testleri (önce `npm run build`) |
| `npm run qa` | Hepsi sırayla |
| `npm run motion:remotion:studio` | Remotion Studio (composition önizleme/düzenleme) |
| `npm run motion:remotion:render` | Remotion videolarını ve posterlerini `public/` altına yeniden üretir |
| `npm run motion:hf:render` | HyperFrames videolarını ve posterlerini `public/` altına yeniden üretir |

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın.

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yayında evet | Canonical adres (sitemap, Open Graph, schema.org). Tanımlı değilse `http://localhost:3000` kullanılır. |
| `RESEND_API_KEY` | Form için | İletişim formunun e-posta göndermesi için [Resend](https://resend.com) anahtarı. **Yalnızca sunucuda** okunur. |
| `CONTACT_FROM_EMAIL` | Form için | Resend'de doğrulanmış gönderici, ör. `Portföy <form@alan-adiniz.com>` |
| `CONTACT_TO_EMAIL` | Hayır | Alıcı; varsayılan `tunaha.srn@gmail.com` |

Form anahtarları tanımlı değilken `/api/contact` 503 döner ve form ziyaretçiye mesajını **WhatsApp veya e-posta ile hazır şekilde gönderme** seçeneği sunar; mesaj kaybolmaz. WhatsApp, telefon ve e-posta butonları her zaman doğrudan çalışır.

## Klasör yapısı

```
src/
  app/                      Rotalar: /, /projeler, /projeler/[slug], /api/contact, sitemap, robots, OG görselleri
  components/
    navigation/             Header + mobil menü (odak tuzağı, Esc)
    layout/                 Footer
    hero/                   Açılış sahnesi (canvas çekirdek), değişen kelime, perspektifli ürün kartları
    sections/               Hakkımda, Seçili İşler, Mobil, Data Journey, Mimari, Arşiv, Süreç
    projects/               Proje bölümü (chapter), kinetik başlık, proje indeksi
    visuals/                Projeye özel etkileşimli görseller (ERP, entegrasyon, POS, kurye, QR, yangın, tenant, servis)
    mobile-preview/         Telefon çerçevesi + uygulama içi demo sistemi
    contact/                İletişim finali + form
    motion/                 MotionProvider (hareket tercihi, Lenis), Reveal, Remotion oynatıcı
    ui/                     Ortak küçük bileşenler
  data/
    profile.ts              İsim, unvan, şirket, iletişim — TEK KAYNAK
    projects.ts             Tüm projeler — TEK KAYNAK (ana sayfa, arşiv, detay, sitemap buradan üretilir)
    mobile-apps.ts          Mobil önizleme uygulamaları ve ekranları
  i18n/                     Dil yapılandırması + Türkçe sözlük (İngilizce eklemeye hazır)
  lib/                      Marka token'ları, GSAP kurulumu, SEO yardımcıları, OG görsel üretici
  hooks/                    useAutoStep, usePacketFlow
motion/
  remotion/                 Remotion composition kaynakları (README içeride)
  hyperframes/              HyperFrames composition kaynakları (README içeride)
public/
  videos/  posters/         Render edilmiş, web için optimize edilmiş videolar ve poster görselleri
tests/                      Playwright testleri
.claude/skills/             Kurulu HyperFrames ve Remotion ajan skill'leri (skills-lock.json)
```

## İçerik güncelleme

- **İletişim / isim değişikliği:** `src/data/profile.ts`
- **Proje ekle / güncelle / kaldır:** `src/data/projects.ts` içinde tek nesne. `featuredOrder` verilirse Seçili İşler'de görünür; `visual` alanı projeye özel görseli seçer.
- **Proje durumu:** `status` alanı (`yayinda`, `gelistirme`, `prototip`, `planlanan`) yalnızca doğrulanmış durum için doldurulmalı. Boşsa sitede rozet gösterilmez.
- **Gerçek ekran görüntüsü:** dosyayı `public/projects/<slug>/` altına koyun, projede `screens` alanına ekleyin ve `preview: "real"` yapın. Mobil uygulamalar için `src/data/mobile-apps.ts` içindeki `screens` alanı kullanılır.
- **Metinler:** `src/i18n/dictionaries/tr.ts`

## Animasyon mimarisi

| Katman | Araç | Kullanım |
| --- | --- | --- |
| Gerçek zamanlı site etkileşimleri | GSAP + ScrollTrigger | Kaydırma belirişleri, kinetik başlıklar, Data Journey sabitleme, süreç çizgisi |
| Bileşen durum geçişleri | Motion for React | Sekmeler, filtreler, ekran geçişleri, menü |
| Hafif sürekli hareket | CSS / SVG / Canvas 2D | Hero çekirdeği, veri hatları, mikro etkileşimler |
| Yumuşak kaydırma | Lenis | Yalnızca masaüstü + hareket açıkken |
| Ürün showcase videoları (parametrik, tarayıcıda oynatılabilir) | **Remotion** | KAREKOD ERP Showcase, Yedinizmi Mobile Experience |
| Sinematik tanıtım filmleri (HTML → deterministik MP4) | **HyperFrames** | Personal Brand Intro, API Integration Network, POS & Payments |

Hareket azaltma: sistemin `prefers-reduced-motion` ayarı otomatik uygulanır; header'daki **Hareketi azalt** düğmesi ziyaretçinin kendi tercihini kaydeder. Bu durumda otomatik oynatma, scroll animasyonları ve sürekli hareket kapanır; içerik eksiksiz kalır.

## Lisans notu

Remotion, 3 kişiden büyük şirketler için ticari lisans gerektirir (bkz. remotion.dev/license). Bireysel kullanımda ücretsizdir.
