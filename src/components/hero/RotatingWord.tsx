"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionPref } from "@/components/motion/MotionProvider";

/** Hero'daki değişen kelime. Ekran okuyucu tüm listeyi tek seferde okur; animasyon aria-hidden. */
export function RotatingWord({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const { reduced } = useMotionPref();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduced, words.length, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-grid align-bottom">
      <span className="sr-only">{words.join(", ")}</span>
      {/* En uzun kelime görünmez yer tutucu: satır zıplamasını (CLS) engeller */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
      </span>
      <span aria-hidden className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            className="inline-block text-gradient-system"
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-105%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
