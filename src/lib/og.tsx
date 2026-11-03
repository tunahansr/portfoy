import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { colors } from "@/lib/brand";

export const ogSize = { width: 1200, height: 630 };

async function fonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [display, sans] = await Promise.all([
    readFile(join(dir, "BricolageGrotesque-SemiBold.ttf")),
    readFile(join(dir, "Geist-Regular.ttf")),
  ]);
  return [
    { name: "Display", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
  ];
}

/** Ortak Open Graph görseli: koyu zemin, çekirdek/yörünge motifi, büyük başlık. */
export async function renderOg({ eyebrow, title, subtitle, accent = colors.cyan }: { eyebrow: string; title: string; subtitle: string; accent?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: `radial-gradient(circle at 78% 42%, ${colors.night} 0%, ${colors.graphite} 62%)`, color: colors.text, fontFamily: "Sans", position: "relative" }}>
        <div style={{ position: "absolute", right: 90, top: 120, width: 360, height: 360, borderRadius: 999, border: `1.5px solid ${colors.lineStrong}`, display: "flex" }} />
        <div style={{ position: "absolute", right: 150, top: 180, width: 240, height: 240, borderRadius: 999, border: `1.5px solid ${accent}`, opacity: 0.6, display: "flex" }} />
        <div style={{ position: "absolute", right: 262, top: 292, width: 16, height: 16, borderRadius: 999, background: colors.amber, display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: colors.textMuted }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: colors.amber, display: "flex" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
          <div style={{ fontFamily: "Display", fontSize: title.length > 28 ? 68 : 88, lineHeight: 1, letterSpacing: -2.5 }}>{title}</div>
          <div style={{ marginTop: 26, fontSize: 30, lineHeight: 1.3, color: colors.textMuted }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: colors.textDim }}>
          <span>Tunahan Şirin · Karekod Bilişim</span>
          <span style={{ color: accent }}>Ünye, Ordu</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
