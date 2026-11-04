import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

/**
 * Fontlar @remotion/google-fonts ile yüklenir: render sırasında delayRender ile
 * beklenir, site içindeki @remotion/player'da da FontFace olarak eklenir.
 * Türkçe karakterler (ş ğ ı İ) için "latin-ext" alt kümesi şart.
 */
const subsets: ("latin" | "latin-ext")[] = ["latin", "latin-ext"];

const display = loadBricolage("normal", {
  weights: ["500", "700", "800"],
  subsets,
});
const sans = loadGeist("normal", { weights: ["400", "500", "600"], subsets });
const mono = loadGeistMono("normal", { weights: ["400", "500"], subsets });
const serif = loadInstrumentSerif("normal", { weights: ["400"], subsets });
const serifItalic = loadInstrumentSerif("italic", { weights: ["400"], subsets });

export const font = {
  display: `"${display.fontFamily}", system-ui, sans-serif`,
  sans: `"${sans.fontFamily}", system-ui, sans-serif`,
  mono: `"${mono.fontFamily}", ui-monospace, monospace`,
  serif: `"${serif.fontFamily}", "${serifItalic.fontFamily}", Georgia, serif`,
} as const;
