#!/usr/bin/env node
/**
 * HyperFrames kompozisyonlarını yerelde render eder ve web kopyalarını üretir.
 *
 *   node motion/hyperframes/render-all.mjs              # üçünü de render et + işle
 *   node motion/hyperframes/render-all.mjs brand-intro  # yalnızca biri
 *   node motion/hyperframes/render-all.mjs --skip-render # mevcut master'lardan yeniden işle
 *
 * Akış (her proje için):
 *   1. npx hyperframes render  -> motion/hyperframes/<proje>/renders/master.mp4 (1920x1080, 30 fps)
 *   2. ffmpeg -> public/videos/<ad>.mp4  (H.264, 1280x720, ses yok, +faststart)
 *   3. ffmpeg -> public/posters/<ad>.jpg (1280 px, temsilî kare)
 *   4. ffprobe ile süre / codec / ses akışı doğrulaması
 *
 * Tarayıcı: HYPERFRAMES_BROWSER_PATH tanımlıysa o kullanılır (ör. chrome-headless-shell).
 * Tanımlı değilse /opt/pw-browsers altındaki headless shell aranır, yoksa HyperFrames'in
 * kendi seçimine bırakılır (`npx hyperframes browser ensure`).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HF_VERSION = "0.9.8";
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const videosDir = path.join(repo, "public/videos");
const postersDir = path.join(repo, "public/posters");

const PROJECTS = [
  { dir: "brand-intro", out: "brand-intro", posterAt: 9.5 },
  { dir: "api-network", out: "api-integration-network", posterAt: 3.0 },
  { dir: "pos-payments", out: "pos-payments", posterAt: 5.0 },
];

const args = process.argv.slice(2);
const skipRender = args.includes("--skip-render");
const only = args.filter((a) => !a.startsWith("--"));
const selected = only.length ? PROJECTS.filter((p) => only.includes(p.dir) || only.includes(p.out)) : PROJECTS;
if (!selected.length) {
  console.error(`Bilinmeyen proje: ${only.join(", ")}. Seçenekler: ${PROJECTS.map((p) => p.dir).join(", ")}`);
  process.exit(1);
}

function findHeadlessShell() {
  if (process.env.HYPERFRAMES_BROWSER_PATH) return process.env.HYPERFRAMES_BROWSER_PATH;
  const root = "/opt/pw-browsers";
  if (!existsSync(root)) return undefined;
  for (const d of readdirSync(root)) {
    if (!d.startsWith("chromium_headless_shell")) continue;
    const bin = path.join(root, d, "chrome-headless-shell-linux64/chrome-headless-shell");
    if (existsSync(bin)) return bin;
  }
  return undefined;
}

const env = { ...process.env, HYPERFRAMES_NO_TELEMETRY: "1", HYPERFRAMES_SKIP_SKILLS: "1" };
const browser = findHeadlessShell();
if (browser) env.HYPERFRAMES_BROWSER_PATH = browser;

function run(cmd, cmdArgs, opts = {}) {
  console.log(`$ ${cmd} ${cmdArgs.join(" ")}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", env, ...opts });
  if (r.status !== 0) {
    console.error(`Komut başarısız (${r.status}): ${cmd}`);
    process.exit(r.status ?? 1);
  }
}

function probe(file) {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,width,height", "-of", "json", file],
    { encoding: "utf8" },
  );
  return JSON.parse(r.stdout);
}

mkdirSync(videosDir, { recursive: true });
mkdirSync(postersDir, { recursive: true });

const report = [];
for (const p of selected) {
  const projectDir = path.join(here, p.dir);
  const master = path.join(projectDir, "renders/master.mp4");
  const video = path.join(videosDir, `${p.out}.mp4`);
  const poster = path.join(postersDir, `${p.out}.jpg`);

  if (!skipRender) {
    mkdirSync(path.dirname(master), { recursive: true });
    run("npx", ["--yes", `hyperframes@${HF_VERSION}`, "render", projectDir, "--quality", "high", "--fps", "30", "-o", master]);
  }
  if (!existsSync(master)) {
    console.error(`Master bulunamadı: ${master}`);
    process.exit(1);
  }

  // Web kopyası: 720p H.264, ses yok, hızlı başlatma.
  run("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", master,
    "-an",
    "-vf", "scale=1280:720:flags=lanczos",
    "-c:v", "libx264", "-preset", "slow", "-crf", "22",
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    video,
  ]);
  // Poster: temsilî kare.
  run("ffmpeg", [
    "-y", "-loglevel", "error",
    "-ss", String(p.posterAt), "-i", master,
    "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-q:v", "3",
    poster,
  ]);

  const info = probe(video);
  const vStream = info.streams.find((s) => s.codec_type === "video");
  const audio = info.streams.filter((s) => s.codec_type === "audio").length;
  const row = {
    video: path.relative(repo, video),
    duration: Number(info.format.duration).toFixed(2),
    codec: vStream?.codec_name,
    size: `${vStream?.width}x${vStream?.height}`,
    audioStreams: audio,
    mb: (statSync(video).size / 1024 / 1024).toFixed(2),
    posterKb: Math.round(statSync(poster).size / 1024),
  };
  if (row.codec !== "h264" || audio !== 0) {
    console.error("Doğrulama başarısız:", row);
    process.exit(1);
  }
  report.push(row);
}
console.table(report);
