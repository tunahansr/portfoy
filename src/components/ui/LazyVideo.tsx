"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useMotionPref } from "@/components/motion/MotionProvider";

interface Props {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  /** Video dosyası yoksa / yüklenemezse gösterilecek statik içerik */
  fallback?: React.ReactNode;
  loop?: boolean;
}

/**
 * Optimize gömülü video: sessiz, inline, `preload="none"`; görünür alana girince yüklenir ve oynar,
 * çıkınca durur. Hareket azaltıldığında otomatik oynamaz (poster + oynat düğmesi).
 */
export function LazyVideo({ src, poster, label, className = "", fallback, loop = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const { reduced } = useMotionPref();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          if (!reduced && !userPaused) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced, userPaused]);

  if (failed) return <>{fallback}</>;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        playsInline
        loop={loop}
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Videoyu durdur" : "Videoyu oynat"}
        className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-graphite/70 text-text backdrop-blur transition-opacity hover:border-cyan focus-visible:opacity-100 ${playing ? "md:opacity-0 md:group-hover:opacity-100" : ""}`}
      >
        {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}
