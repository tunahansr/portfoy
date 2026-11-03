"use client";

import { useEffect, useRef } from "react";
import { useMotionPref } from "@/components/motion/MotionProvider";

/**
 * Açılış sahnesi: karanlıkta beliren veri parçacıkları → teknoloji çekirdeğinde birleşme →
 * çekirdeğin etrafında sistemleri temsil eden yörüngeler ve veri paketleri.
 *
 * Performans: 2D canvas (WebGL/Three.js gerekmez), DPR sınırlı, mobilde ~1/3 parçacık,
 * ekran dışındayken ve sekme gizliyken durur. Hareket azaltıldığında tek statik kare çizilir.
 * Sahne içerik erişimini engellemez: metinler SSR ile hemen görünür, canvas arka plandadır.
 */

interface Props {
  nodes: string[];
  coreLabel: string;
}

// Deterministik sözde rastgele (hydration ve tekrar üretilebilirlik için)
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORS = {
  cyan: [69, 224, 240],
  blue: [61, 123, 255],
  violet: [139, 108, 255],
  amber: [255, 181, 71],
  text: [243, 245, 248],
} as const;

const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function HeroCore({ nodes, coreLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduced } = useMotionPref();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isSmall = window.matchMedia("(max-width: 767px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75);
    const rand = mulberry32(7);
    const COUNT = isSmall ? 260 : 820;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let R = 0; // ana yörünge yarıçapı

    type P = { sx: number; sy: number; a: number; r: number; orbit: number; speed: number; size: number; delay: number; hue: number };
    const particles: P[] = [];
    for (let i = 0; i < COUNT; i++) {
      const ring = rand();
      particles.push({
        sx: rand(),
        sy: rand(),
        a: rand() * Math.PI * 2,
        r: ring < 0.55 ? 0.08 + rand() * 0.22 : 0.35 + rand() * 0.75, // çekirdek kümesi + dağınık halo
        orbit: rand() < 0.5 ? 1 : -1,
        speed: 0.04 + rand() * 0.12,
        size: 0.4 + rand() * 1.3,
        delay: rand() * 0.5,
        hue: rand(),
      });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const desktop = w >= 1024;
      cx = desktop ? w * 0.7 : w * 0.5;
      cy = desktop ? h * 0.48 : Math.min(h * 0.27, 260);
      // Mobilde düğüm etiketleri ekran kenarından taşmasın: (yarı genişlik − etiket payı) / yörünge katsayısı
      R = desktop ? Math.min(w * 0.2, h * 0.34) : Math.min((w / 2 - 52) / 1.32, h * 0.16);
    };
    resize();

    let pointerX = 0;
    let pointerY = 0;
    let px = 0;
    let py = 0;
    const onPointer = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const INTRO = 2.6; // saniye: dağınık → çekirdek
    let start = performance.now();
    let raf = 0;
    let running = false;

    const draw = (time: number) => {
      const t = (time - start) / 1000;
      const intro = reduced ? 1 : Math.min(1, t / INTRO);
      const settle = easeOutExpo(intro);
      px += (pointerX - px) * 0.04;
      py += (pointerY - py) * 0.04;
      const ox = coarse ? 0 : px * 14;
      const oy = coarse ? 0 : py * 10;

      ctx.clearRect(0, 0, w, h);

      // Çekirdek ışığı
      const coreR = R * 0.62;
      const glow = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, coreR * 2.4);
      glow.addColorStop(0, `rgba(61,123,255,${0.22 * settle})`);
      glow.addColorStop(0.4, `rgba(69,224,240,${0.07 * settle})`);
      glow.addColorStop(1, "rgba(7,9,13,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Yörünge halkaları (perspektifli elips)
      const tilt = 0.36;
      const rot = reduced ? 0.4 : t * 0.06;
      ctx.lineWidth = 1;
      for (let k = 0; k < 3; k++) {
        const rr = R * (1 + k * 0.32);
        ctx.strokeStyle = `rgba(${COLORS.text.join(",")},${(0.09 - k * 0.022) * settle})`;
        ctx.beginPath();
        ctx.ellipse(cx + ox * (1 + k * 0.2), cy + oy * (1 + k * 0.2), rr, rr * tilt, -0.18, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Parçacıklar
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const local = reduced ? 1 : Math.max(0, Math.min(1, (intro - p.delay * 0.6) / (1 - p.delay * 0.6)));
        const k = easeInOut(local);
        const ang = p.a + (reduced ? 0 : t * p.speed * p.orbit);
        const rr = p.r * R * (p.r < 0.32 ? 0.9 : 1.25);
        const tx = cx + ox * (0.6 + p.r) + Math.cos(ang) * rr;
        const ty = cy + oy * (0.6 + p.r) + Math.sin(ang) * rr * (p.r < 0.32 ? 0.92 : tilt + 0.1);
        const x = p.sx * w * (1 - k) + tx * k;
        const y = p.sy * h * (1 - k) + ty * k;
        const c = p.hue < 0.62 ? COLORS.cyan : p.hue < 0.92 ? COLORS.blue : COLORS.amber;
        const alpha = (0.18 + 0.62 * (1 - p.r * 0.6)) * (0.35 + 0.65 * Math.min(1, t * 1.5 + (reduced ? 1 : 0)));
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
        ctx.fillRect(x, y, p.size, p.size);
      }

      // Çekirdek: iç içe dönen altıgen çerçeve
      if (settle > 0.05) {
        ctx.save();
        ctx.translate(cx + ox, cy + oy);
        for (let ring = 0; ring < 2; ring++) {
          const sr = coreR * (0.42 + ring * 0.2) * settle;
          ctx.rotate(ring === 0 ? rot * 1.4 : -rot * 2.2);
          ctx.strokeStyle = ring === 0 ? `rgba(69,224,240,${0.75 * settle})` : `rgba(61,123,255,${0.5 * settle})`;
          ctx.lineWidth = ring === 0 ? 1.4 : 1;
          ctx.beginPath();
          for (let s = 0; s <= 6; s++) {
            const a = (s / 6) * Math.PI * 2;
            const xx = Math.cos(a) * sr;
            const yy = Math.sin(a) * sr;
            if (s === 0) ctx.moveTo(xx, yy);
            else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = `rgba(243,245,248,${0.9 * settle})`;
        ctx.beginPath();
        ctx.arc(cx + ox, cy + oy, 3.2 * settle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sistem düğümleri + veri paketleri
      const nodeAlpha = reduced ? 1 : Math.max(0, Math.min(1, (t - INTRO * 0.7) / 0.9));
      if (nodeAlpha > 0) {
        const fontPx = w < 400 ? 10 : 11;
        ctx.font = `500 ${fontPx}px ${getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace"}, monospace`;
        ctx.textBaseline = "middle";
        for (let n = 0; n < nodes.length; n++) {
          const a = (n / nodes.length) * Math.PI * 2 + rot * 0.6 - Math.PI / 2;
          const nr = R * 1.32;
          const nx = cx + ox * 1.3 + Math.cos(a) * nr;
          const ny = cy + oy * 1.3 + Math.sin(a) * nr * tilt * 1.55;
          const depth = 0.55 + 0.45 * ((Math.sin(a) + 1) / 2);
          const accent = n === 1 || n === 4 ? COLORS.amber : n === 5 ? COLORS.violet : COLORS.cyan;

          // bağlantı
          ctx.strokeStyle = `rgba(${accent.join(",")},${0.16 * nodeAlpha * depth})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + ox, cy + oy);
          ctx.lineTo(nx, ny);
          ctx.stroke();

          // paket (çekirdeğe akan veri)
          if (!reduced) {
            const f = ((t * 0.32 + n * 0.17) % 1 + 1) % 1;
            const pxp = nx + (cx + ox - nx) * f;
            const pyp = ny + (cy + oy - ny) * f;
            ctx.fillStyle = `rgba(${accent.join(",")},${0.9 * nodeAlpha * (1 - f * 0.6)})`;
            ctx.beginPath();
            ctx.arc(pxp, pyp, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          // düğüm
          ctx.fillStyle = `rgba(10,16,34,${0.92 * nodeAlpha})`;
          const label = nodes[n];
          const tw = ctx.measureText(label).width;
          const bw = tw + 18;
          const bh = 22;
          ctx.beginPath();
          ctx.roundRect(nx - bw / 2, ny - bh / 2, bw, bh, 11);
          ctx.fill();
          ctx.strokeStyle = `rgba(${accent.join(",")},${0.55 * nodeAlpha * depth})`;
          ctx.stroke();
          ctx.fillStyle = `rgba(243,245,248,${nodeAlpha * (0.6 + 0.4 * depth)})`;
          ctx.fillText(label, nx - tw / 2, ny + 0.5);
        }

        // çekirdek etiketi
        ctx.fillStyle = `rgba(163,173,189,${0.85 * nodeAlpha})`;
        const lw = ctx.measureText(coreLabel.toUpperCase()).width;
        ctx.fillText(coreLabel.toUpperCase(), cx + ox - lw / 2, cy + oy + coreR * 0.75);
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (running) raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      draw(performance.now());
    } else {
      start = performance.now();
      startLoop();
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) startLoop();
      else stopLoop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);
    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduced, nodes, coreLabel]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full animate-[fade-in_1.2s_ease-out_both]"
    />
  );
}
