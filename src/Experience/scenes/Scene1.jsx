import React from "react";
import { TitleCard, TextCard, Handwriting } from "../paper/PaperCard";
import { PaperSprite, Stick } from "../paper/PaperSprite";
import { GROUND_Y } from "../paper/Environment";
import * as S from "../paper/sketches";

const G = GROUND_Y;

export default function Scene1({ x0, data }) {
  const [c1, c2, c3] = data.cards;
  return (
    <group>
      <TitleCard text={data.title} color="#b9b1d6" position={[x0 + 1.8, 3.2, -1.0]} rotation={[0, 0, 0.04]} />
      <TextCard heading={c1.heading} lines={c1.lines} w={2.7} h={1.75} position={[x0 + 4.2, 1.85, -0.8]} rotation={[0, 0, -0.02]} />
      <TextCard heading={c2.heading} lines={c2.lines} w={3.1} h={2.0} position={[x0 + 8.0, 1.95, -0.6]} rotation={[0, 0, 0.015]} />
      <TextCard heading={c3.heading} lines={c3.lines} w={2.7} h={1.75} position={[x0 + 12.2, 1.85, -0.8]} rotation={[0, 0, -0.0]} />
      <Handwriting lines={[data.footnote]} size={0.12} w={4.2} h={0.6} position={[x0 + 16.6, 1.0, -0.9]} rotation={[0, 0, -0.03]} />

      {/* props */}
      <PaperSprite paint={S.cherryTree} w={3.0} h={3.2} position={[x0 + 0.9, G + 1.6, -1.9]} />
      <PaperSprite paint={S.pencil} w={1.6} h={0.5} position={[x0 + 5.3, 3.15, -1.6]} rotation={[0, 0, 0.35]} sway={0.03} seedOffset={1} />
      <PaperSprite paint={S.videoCamera} w={1.3} h={1.0} position={[x0 + 10.4, 3.15, -1.7]} sway={0.03} seedOffset={2} />
      <Stick x={x0 + 10.4} top={3.0} bottom={G} z={-1.75} />
      <PaperSprite paint={S.jsBadge} w={0.8} h={0.8} position={[x0 + 12.4, 3.3, -1.6]} rotation={[0, 0, -0.1]} sway={0.04} seedOffset={3} />
      <PaperSprite paint={S.flagJP} w={0.8} h={1.4} position={[x0 + 13.6, G + 0.7, -1.4]} />
      <PaperSprite paint={S.flagUS} w={0.8} h={1.4} position={[x0 + 14.5, G + 0.7, -1.3]} />
      <PaperSprite paint={S.certificate} w={1.1} h={0.85} position={[x0 + 11.6, G + 0.45, -1.2]} rotation={[0, 0, 0.05]} />

      {/* sky */}
      <PaperSprite paint={S.cloud} w={1.8} h={1.0} position={[x0 + 6.5, 4.6, -2.0]} sway={0.01} />
      <PaperSprite paint={S.cloud} w={1.4} h={0.8} position={[x0 + 13.5, 4.9, -2.1]} sway={0.01} seedOffset={2} />

      {/* foreground */}
      <PaperSprite paint={S.grass} w={0.9} h={0.55} position={[x0 + 3.0, G + 0.27, 1.9]} />
      <PaperSprite paint={S.flower} w={0.45} h={0.7} position={[x0 + 6.4, G + 0.35, 1.6]} sway={0.05} seedOffset={4} />
      <PaperSprite paint={S.grass} w={0.9} h={0.55} position={[x0 + 9.2, G + 0.27, 2.3]} />
      <PaperSprite paint={S.grass} w={0.7} h={0.45} position={[x0 + 14.8, G + 0.22, 1.7]} />
    </group>
  );
}
