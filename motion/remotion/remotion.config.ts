import fs from "node:fs";
import { Config } from "@remotion/cli/config";

/**
 * Komutlar repo kökünden `npm run motion:remotion:*` ile çalışır ve bu dosya
 * `--config` ile verilir.
 *
 * Tarayıcı: REMOTION_BROWSER_EXECUTABLE ortam değişkeni (tam Chromium/Chrome yolu)
 * ya da (varsa) önceden kurulu Chromium kullanılır; ikisi de yoksa Remotion kendi headless shell'ini indirir.
 */
const preinstalled = "/opt/pw-browsers/chromium";
const browser =
  process.env.REMOTION_BROWSER_EXECUTABLE ?? (fs.existsSync(preinstalled) ? preinstalled : null);
if (browser) {
  // Tam Chromium (headless shell değil) "chrome-for-testing" modunda başlatılmalı.
  Config.setBrowserExecutable(browser);
  Config.setChromeMode("chrome-for-testing");
}

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
