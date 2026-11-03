"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useMotionPref } from "./MotionProvider";
import { loadRemotionComposition, type RemotionId } from "./remotion-registry";

type Loaded = Awaited<ReturnType<typeof loadRemotionComposition>>;

/**
 * Remotion composition'ını tarayıcıda @remotion/player ile oynatır (etkileşimli: oynat/durdur, sarma).
 * Player ve composition yalnızca bölüm görünür olunca yüklenir (lazy). Öncesinde poster gösterilir.
 * Hareket azaltıldığında otomatik oynamaz.
 */
export function RemotionShowcase({ id, poster, label }: { id: RemotionId; poster?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mod, setMod] = useState<Loaded | null>(null);
  const [Player, setPlayer] = useState<typeof import("@remotion/player").Player | null>(null);
  const [requested, setRequested] = useState(false);
  const { reduced } = useMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRequested(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!requested) return;
    let alive = true;
    Promise.all([import("@remotion/player"), loadRemotionComposition(id)]).then(([p, m]) => {
      if (!alive) return;
      setPlayer(() => p.Player);
      setMod(m);
    });
    return () => {
      alive = false;
    };
  }, [requested, id]);

  const ratio = mod ? `${mod.meta.width} / ${mod.meta.height}` : "16 / 9";

  return (
    <figure ref={ref} className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-night">
      <div className="relative w-full" style={{ aspectRatio: ratio, maxHeight: "78svh" }}>
        {Player && mod ? (
          <Player
            component={mod.component}
            durationInFrames={mod.meta.durationInFrames}
            fps={mod.meta.fps}
            compositionWidth={mod.meta.width}
            compositionHeight={mod.meta.height}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
            autoPlay={!reduced}
            initiallyMuted
            acknowledgeRemotionLicense
            clickToPlay
            spaceKeyToPlayOrPause
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" loading="lazy" />
            )}
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-graphite/70 backdrop-blur" aria-hidden>
              <Play className="h-5 w-5" />
            </span>
          </div>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
        <span>{label}</span>
        <span>Remotion · etkileşimli oynatıcı</span>
      </figcaption>
    </figure>
  );
}
