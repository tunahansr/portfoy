"use client";

import { useEffect, useId, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { contactLinks, profile } from "@/data/profile";
import { allPackageOptions, type PackageId } from "@/data/en-offer";
import { PACKAGE_EVENT } from "./PackageLink";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error" } | { kind: "fallback"; text: string };
type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOT_SURE = "Not sure yet";

/**
 * English enquiry form → /api/contact (lang: "en"). If the email provider is not configured
 * (503) or unreachable, the visitor gets one-tap WhatsApp / email buttons with the message
 * already filled in, so no enquiry is lost.
 */
export function EnContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const [pkg, setPkg] = useState<string>(NOT_SURE);
  const id = useId();

  useEffect(() => {
    const onPick = (e: Event) => {
      const pid = (e as CustomEvent<PackageId>).detail;
      const found = allPackageOptions.find((o) => o.id === pid);
      if (found) setPkg(found.label);
    };
    window.addEventListener(PACKAGE_EVENT, onPick);
    return () => window.removeEventListener(PACKAGE_EVENT, onPick);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const errs: Errors = {};
    if (!data.name?.trim()) errs.name = "Please enter your name.";
    if (!emailRe.test(data.email ?? "")) errs.email = "Please enter a valid email address.";
    if ((data.message ?? "").trim().length < 20) errs.message = "Please write a little more (at least 20 characters).";
    if (!data.consent) errs.consent = "Please tick this box so I can reply to you.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setState({ kind: "sending" });
    const summary = [
      `Hi Tunahan, I'd like a free demo.`,
      `Name: ${data.name}`,
      data.business && `Business: ${data.business}`,
      `Email: ${data.email}`,
      data.phone && `Phone / WhatsApp: ${data.phone}`,
      `Package: ${data.topic}`,
      "",
      data.message,
    ]
      .filter((x) => x !== undefined && x !== "")
      .join("\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang: "en" }),
      });
      if (res.ok) {
        setState({ kind: "success" });
        form.reset();
        setPkg(NOT_SURE);
      } else if (res.status === 422) {
        setState({ kind: "error" });
      } else {
        setState({ kind: "fallback", text: summary });
      }
    } catch {
      setState({ kind: "fallback", text: summary });
    }
  }

  const field =
    "mt-2 block w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink-dim/80 transition-colors focus:border-brand focus:outline-none aria-[invalid=true]:border-[#d93636]";
  const label = "text-sm font-medium text-ink";
  const err = "mt-1.5 text-xs text-[#c42b2b]";

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-3xl border border-ink/10 bg-card p-5 shadow-[0_30px_70px_-45px_rgba(17,21,28,0.5)] sm:p-8" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="font-display text-xl font-semibold text-ink">Request your free demo</h3>
      <p className="mt-1 text-sm text-ink-dim">Takes one minute. No payment details needed.</p>

      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>Your name</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
          {errors.name && <p id={`${id}-name-err`} className={err}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-business`} className={label}>Business name <span className="font-normal text-ink-dim">(optional)</span></label>
          <input id={`${id}-business`} name="business" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>Email</label>
          <input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" required className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
          {errors.email && <p id={`${id}-email-err`} className={err}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={label}>WhatsApp / phone <span className="font-normal text-ink-dim">(optional)</span></label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-topic`} className={label}>Package</label>
          <select id={`${id}-topic`} name="topic" className={`${field} appearance-none`} value={pkg} onChange={(e) => setPkg(e.target.value)}>
            <option>{NOT_SURE}</option>
            {allPackageOptions.map((o) => (
              <option key={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className={label}>About your business</label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            required
            placeholder="e.g. We're a small café in Bristol. We need a menu with a QR code and a simple website. Current site: none."
            className={`${field} resize-y`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-err` : undefined}
          />
          {errors.message && <p id={`${id}-message-err`} className={err}>{errors.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
            <input type="checkbox" name="consent" value="1" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--c-brand)]" aria-invalid={!!errors.consent} />
            <span>I agree that my details are used only to reply to this enquiry.</span>
          </label>
          {errors.consent && <p className={err}>{errors.consent}</p>}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
        >
          {state.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          {state.kind === "sending" ? "Sending…" : "Send request"}
        </button>
        <div role="status" aria-live="polite" className="text-sm">
          {state.kind === "success" && (
            <p className="flex items-center gap-2 font-medium text-leaf">
              <Check className="h-4 w-4" aria-hidden /> Thank you! I&apos;ll reply by email soon.
            </p>
          )}
          {state.kind === "error" && <p className="text-[#c42b2b]">Please check the form and try again.</p>}
        </div>
      </div>

      {state.kind === "fallback" && (
        <div className="mt-6 rounded-2xl border border-gold/60 bg-gold/10 p-5 text-sm" role="alert">
          <p className="text-ink">The form couldn&apos;t send your message right now. Send it with one tap instead, it&apos;s already written for you:</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a href={contactLinks.whatsappWithText(state.text)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1fa855] px-5 font-semibold text-white">
              Send on WhatsApp
            </a>
            <a
              href={`${contactLinks.businessMailto}?subject=${encodeURIComponent("Free demo request")}&body=${encodeURIComponent(state.text)}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/20 px-5 font-medium text-ink"
            >
              Send by email
            </a>
          </div>
        </div>
      )}
      <p className="mt-6 text-xs text-ink-dim">
        Prefer email? Write to <a className="underline underline-offset-2 hover:text-ink" href={contactLinks.businessMailto}>{profile.contact.businessEmail}</a>
      </p>
    </form>
  );
}
