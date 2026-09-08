import React, { useEffect, useState } from "react";
import Experience from "./Experience/Experience";
import IntroScreen from "./components/IntroScreen";

const FONTS = ['32px "Yomogi"', '32px "Zen Kurenaido"', '32px "Patrick Hand"'];

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    const timeout = new Promise((r) => setTimeout(r, 4000)); // offline fallback
    Promise.race([Promise.all(FONTS.map((f) => document.fonts.load(f))).catch(() => {}), timeout]).then(() => setFontsReady(true));
  }, []);
  return (
    <>
      <IntroScreen ready={fontsReady} />
      {fontsReady && <Experience />}
    </>
  );
}
