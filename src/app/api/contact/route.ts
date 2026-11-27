import { profile } from "@/data/profile";

/**
 * İletişim formu gönderimi.
 *
 * YAPILANDIRMA (sunucu ortam değişkenleri — asla NEXT_PUBLIC_ ile başlamaz, tarayıcıya gitmez):
 *   RESEND_API_KEY      Resend (https://resend.com) API anahtarı. Tanımlı değilse uç nokta 503 döner
 *                       ve form kullanıcıya WhatsApp / e-posta ile gönderme seçeneği sunar.
 *   CONTACT_FROM_EMAIL  Doğrulanmış gönderici, ör. "Portföy <form@alan-adiniz.com>"
 *   CONTACT_TO_EMAIL    Alıcı (varsayılan: profile.contact.email)
 *
 * Güvenlik: alan doğrulama + uzunluk sınırları, honeypot, IP başına basit hız sınırı
 * (sunucu örneği başına bellek içi; çok örnekli dağıtımda harici store önerilir).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  // Cloudflare → nginx → uygulama: önce Cloudflare'in yazdığı gerçek istemci IP'si, sonra nginx'in
  // x-real-ip'i, en son X-Forwarded-For'un en sağdaki (proxy'nin eklediği) değeri.
  const xff = req.headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || xff?.[xff.length - 1] || "unknown";
  const now = Date.now();
  // Eski kayıtları temizle, haritanın sınırsız büyümesini engelle
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    if (hits.size > 5000) hits.clear();
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot doluysa sessizce başarılı say (bota ipucu verme)
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const topic = clean(body.topic, 80);
  const message = clean(body.message, 5000);
  const business = clean(body.business, 160);
  const lang = body.lang === "en" ? "en" : "tr";
  const consent = body.consent === "1" || body.consent === true;

  if (!name || !emailRe.test(email) || message.length < 20 || !consent) {
    return Response.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  recent.push(now);
  hits.set(ip, recent);

  const to = process.env.CONTACT_TO_EMAIL || profile.contact.email;
  const html = `<h2>Portföy sitesinden yeni mesaj</h2>
<p><b>Ad:</b> ${escapeHtml(name)}<br/><b>E-posta:</b> ${escapeHtml(email)}<br/><b>Telefon:</b> ${escapeHtml(phone || "-")}<br/><b>Konu:</b> ${escapeHtml(topic || "-")}${business ? `<br/><b>İşletme:</b> ${escapeHtml(business)}` : ""}<br/><b>Dil:</b> ${lang.toUpperCase()}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: lang === "en" ? `Website enquiry (EN): ${topic || "-"} · ${business || name}` : `Proje talebi: ${topic || name}`, html }),
    });
    if (!res.ok) return Response.json({ ok: false, error: "provider_error" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "provider_unreachable" }, { status: 502 });
  }
}
