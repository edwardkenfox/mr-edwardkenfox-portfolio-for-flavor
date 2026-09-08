import React, { useEffect, useState } from "react";
import Experience from "./Experience/Experience";
import IntroScreen from "./components/IntroScreen";
import content from "./content.json";

// every string in content.json, so document.fonts.load fetches the kanji subsets we actually draw
function collectText(v, out = []) {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => collectText(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => collectText(x, out));
  return out;
}
const ALL_TEXT = Array.from(new Set(collectText(content).join(""))).join("");

const FONTS = ['32px "Yomogi"', '32px "Zen Kurenaido"', '32px "Patrick Hand"'];

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    const timeout = new Promise((r) => setTimeout(r, 4000)); // offline fallback
    Promise.race([Promise.all(FONTS.map((f) => document.fonts.load(f, ALL_TEXT))).catch(() => {}), timeout]).then(() => setFontsReady(true));
  }, []);
  return (
    <>
      <IntroScreen ready={fontsReady} />
      {fontsReady && <Experience />}
    </>
  );
}
