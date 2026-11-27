"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { contactLinks } from "@/data/profile";

/** Mobilde, hero geçildikten sonra altta beliren kısa eylem çubuğu. İletişim bölümü görünürken gizlenir. */
export function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let pastHero = false;
    let atContact = false;
    const update = () => setShow(pastHero && !atContact);
    const onScroll = () => {
      pastHero = window.scrollY > 640;
      update();
    };
    const contact = document.getElementById("contact");
    const io = contact
      ? new IntersectionObserver(([e]) => {
          atContact = e.isIntersecting;
          update();
        })
      : null;
    if (contact && io) io.observe(contact);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex gap-2">
        <a href="#contact" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
          Get a free demo
        </a>
        <a
          href={contactLinks.whatsappWithText("Hi Tunahan, I'd like a free website demo for my business.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="inline-flex min-h-12 w-12 items-center justify-center rounded-full bg-[#1fa855] text-white"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
