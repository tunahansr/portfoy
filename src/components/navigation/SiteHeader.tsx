"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Pause, Play, ArrowUpRight, Phone, Mail, MessageCircle } from "lucide-react";
import { getDictionary } from "@/i18n";
import { profile, contactLinks } from "@/data/profile";
import { useMotionPref } from "@/components/motion/MotionProvider";
import { Monogram } from "@/components/ui/Monogram";

const t = getDictionary();

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { reduced, toggle } = useMotionPref();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>("a,button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-line/70 bg-graphite/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Ana menü" className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href="/" className="group flex min-h-11 items-center gap-3" aria-label={`${profile.name} — ana sayfa`}>
            <Monogram className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="font-display text-[0.98rem] font-semibold tracking-tight">{profile.name}</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {t.nav.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={reduced}
              className="hidden h-10 items-center gap-2 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-line-strong hover:text-text sm:flex"
            >
              {reduced ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
              <span>{reduced ? t.nav.motionOff : t.nav.motionOn}</span>
            </button>
            <Link
              href="/#iletisim"
              className="group hidden h-10 items-center gap-1.5 rounded-full bg-text px-4 text-sm font-medium text-graphite transition-colors hover:bg-amber md:flex"
            >
              {t.nav.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <button
              ref={buttonRef}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text lg:hidden"
              aria-expanded={open}
              aria-controls="mobil-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobil-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.55, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] flex flex-col overflow-y-auto bg-graphite lg:hidden"
          >
            <ul className="container-x flex flex-col pt-6">
              {[...t.nav.items, { href: "/#iletisim", label: "İletişim" }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.12 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center justify-between py-3 font-display text-[clamp(1.6rem,7vw,2.4rem)] font-medium tracking-tight"
                  >
                    {item.label}
                    <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="container-x mt-auto grid gap-3 py-8">
              <a href={contactLinks.whatsappWithText(t.contact.whatsappText)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-2xl bg-text px-5 font-medium text-graphite">
                <MessageCircle className="h-5 w-5" aria-hidden /> {t.contact.whatsapp}
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={contactLinks.tel} className="flex min-h-12 items-center gap-2 rounded-2xl border border-line px-4 text-sm">
                  <Phone className="h-4 w-4" aria-hidden /> {t.contact.call}
                </a>
                <a href={contactLinks.mailto} className="flex min-h-12 items-center gap-2 rounded-2xl border border-line px-4 text-sm">
                  <Mail className="h-4 w-4" aria-hidden /> E-posta
                </a>
              </div>
              <button
                type="button"
                onClick={toggle}
                aria-pressed={reduced}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line text-sm text-muted"
              >
                {reduced ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
                {reduced ? t.nav.motionOff : t.nav.motionOn}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
