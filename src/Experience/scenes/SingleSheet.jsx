import React, { useMemo } from "react";
import { PaperCard, TitleCard, TextCard } from "../paper/PaperCard";
import { PaperSprite, Stick } from "../paper/PaperSprite";
import { paperFill, notebookLines } from "../paper/canvasUtils";
import * as S from "../paper/sketches";
import { SHEET_GAP } from "../curve";

// The blank page shown while the world loops around. Holds the music easter egg.
export default function SingleSheet({ x0, data }) {
  const cx = x0 + SHEET_GAP / 2 - 0.5;
  const sheetPaint = useMemo(() => (ctx, W, H) => {
    paperFill(ctx, W, H, "#f8f6f0", 17);
    notebookLines(ctx, W, H, { spacing: W / 14, lineColor: "#bcd0e6", marginX: W * 0.12 });
  }, []);
  return (
    <group>
      <PaperCard w={6.4} h={7.2} radius={0.05} paint={sheetPaint} position={[cx, 1.6, -1.8]} rotation={[0, 0, 0.01]} hoverLift={0} sideColor="#e3ded2" />
      <TitleCard text={data.sign.join("\n")} color="#efe0c2" textColor="#4a3b22" w={1.9} h={1.3} position={[cx - 2.0, 3.2, -1.1]} rotation={[0, 0, -0.05]} />
      <PaperSprite paint={S.musicNote} w={1.0} h={1.1} position={[cx + 0.3, 3.5, -1.2]} sway={0.05} seedOffset={20} />
      <PaperSprite paint={S.headphones} w={1.1} h={0.9} position={[cx + 2.0, 3.3, -1.2]} sway={0.03} seedOffset={21} />
      {data.cards.map((c, i) => (
        <TextCard key={i} heading={c.heading} lines={c.lines} w={2.1} h={1.4} position={[cx - 2.4 + i * 2.4, 1.5, -1.0 + i * 0.05]} rotation={[0, 0, (i - 1) * 0.03]} />
      ))}
      <Stick x={cx + 0.3} top={3.0} bottom={-3} z={-1.25} />
    </group>
  );
}
