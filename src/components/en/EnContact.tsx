import { Mail, MessageCircle } from "lucide-react";
import { contactLinks, profile } from "@/data/profile";
import { EnContactForm } from "./EnContactForm";

const waText = "Hi Tunahan, I'd like a free website demo for my business.";

export function EnContact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-ink/10 bg-paper-2 py-20 sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Contact</p>
          <h2 id="contact-title" className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
            Get your free demo
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
            Tell me a little about your business. I&apos;ll build a demo of your website and send you the link. All communication is in writing, by email or WhatsApp.
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <a
              href={contactLinks.whatsappWithText(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-[#1fa855] px-6 font-semibold text-white transition-colors hover:bg-[#178a45]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> Chat on WhatsApp
            </a>
            <a
              href={contactLinks.businessMailto}
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-card px-6 font-medium text-ink transition-colors hover:border-ink/40"
            >
              <Mail className="h-5 w-5" aria-hidden /> {profile.contact.businessEmail}
            </a>
          </div>
        </div>
        <EnContactForm />
      </div>
    </section>
  );
}
