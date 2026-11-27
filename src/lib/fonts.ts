import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

/** Tüm kök layout'larda (TR, EN, global 404) ortak yazı tipleri. */
const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"], display: "swap" });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz", "wdth"],
});
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable} ${bricolage.variable} ${instrument.variable}`;
