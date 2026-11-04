"use client";

import { useId, useState } from "react";
import { Loader2, Send, Check } from "lucide-react";
import { getDictionary } from "@/i18n";
import { contactLinks, profile } from "@/data/profile";

const t = getDictionary();
const f = t.contact.form;

type State = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error" } | { kind: "not-configured"; text: string };
type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * İletişim formu → /api/contact. Sunucu tarafında doğrulama, honeypot ve hız sınırı vardır.
 * E-posta sağlayıcısı (RESEND_API_KEY) tanımlı değilse API 503 döner; form bu durumda mesajı
 * WhatsApp / e-posta ile hazır gönderme seçenekleri sunar — kullanıcı mesajını kaybetmez.
 */
export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const errs: Errors = {};
    if (!data.name?.trim()) errs.name = f.validation.name;
    if (!emailRe.test(data.email ?? "")) errs.email = f.validation.email;
    if ((data.message ?? "").trim().length < 20) errs.message = f.validation.message;
    if (!data.consent) errs.consent = f.validation.consent;
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setState({ kind: "sending" });
    const summary = `${data.name}\n${data.email}${data.phone ? `\n${data.phone}` : ""}\nKonu: ${data.topic}\n\n${data.message}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setState({ kind: "success" });
        form.reset();
      } else if (res.status === 503) {
        setState({ kind: "not-configured", text: summary });
      } else if (res.status === 422) {
        setState({ kind: "error" });
      } else {
        setState({ kind: "not-configured", text: summary });
      }
    } catch {
      setState({ kind: "not-configured", text: summary });
    }
  }

  const field = "mt-2 block w-full rounded-xl border border-line bg-night/70 px-4 py-3.5 text-base text-text placeholder:text-dim transition-colors focus:border-cyan focus:outline-none aria-[invalid=true]:border-danger";
  const label = "text-sm text-muted";

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-3xl border border-line bg-surface/50 p-5 sm:p-8" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="font-display text-xl font-medium">{f.title}</h3>

      {/* Honeypot: insanlar görmez, botlar doldurur */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Web sitesi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>{f.name}</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
          {errors.name && <p id={`${id}-name-err`} className="mt-1.5 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>{f.email}</label>
          <input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" required className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
          {errors.email && <p id={`${id}-email-err`} className="mt-1.5 text-xs text-danger">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={label}>{f.phone}</label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-topic`} className={label}>{f.topic}</label>
          <select id={`${id}-topic`} name="topic" className={`${field} appearance-none`} defaultValue={f.topics[0]}>
            {f.topics.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className={label}>{f.message}</label>
          <textarea id={`${id}-message`} name="message" rows={5} required className={`${field} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-err` : undefined} />
          {errors.message && <p id={`${id}-message-err`} className="mt-1.5 text-xs text-danger">{errors.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input type="checkbox" name="consent" value="1" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--c-cyan)]" aria-invalid={!!errors.consent} />
            <span>{f.consent}</span>
          </label>
          {errors.consent && <p className="mt-1.5 text-xs text-danger">{errors.consent}</p>}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-text px-7 py-3.5 font-medium text-graphite transition-colors hover:bg-cyan disabled:opacity-60"
        >
          {state.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          {state.kind === "sending" ? f.sending : f.submit}
        </button>
        <div role="status" aria-live="polite" className="text-sm">
          {state.kind === "success" && (
            <p className="flex items-center gap-2 text-cyan">
              <Check className="h-4 w-4" aria-hidden /> {f.success}
            </p>
          )}
          {state.kind === "error" && <p className="text-danger">{f.error}</p>}
        </div>
      </div>

      {state.kind === "not-configured" && (
        <div className="mt-6 rounded-2xl border border-amber/40 bg-amber/5 p-5 text-sm" role="alert">
          <p className="text-text/90">{f.notConfigured}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a href={contactLinks.whatsappWithText(state.text)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-text px-5 font-medium text-graphite">
              {f.sendViaWhatsapp}
            </a>
            <a
              href={`mailto:${profile.contact.email}?subject=${encodeURIComponent("Proje talebi")}&body=${encodeURIComponent(state.text)}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-line-strong px-5"
            >
              {f.sendViaMail}
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
