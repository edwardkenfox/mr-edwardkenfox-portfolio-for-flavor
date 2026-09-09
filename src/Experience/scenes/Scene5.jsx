import React from "react";
import { TitleCard, TextCard, Handwriting } from "../paper/PaperCard";
import { PaperSprite, Stick } from "../paper/PaperSprite";
import { GROUND_Y } from "../paper/Environment";
import * as S from "../paper/sketches";

const G = GROUND_Y;

export default function Scene5({ x0, data }) {
  const [c1, c2] = data.cards;
  // keep everything left of x0+11 so the loop seam (world swap) is never visible
  return (
    <group>
      <TitleCard text={data.title} color="#c9dfc2" textColor="#25412a" w={2.8} h={1.9} position={[x0 + 1.6, 3.2, -1.0]} rotation={[0, 0, 0.03]} />
      <TextCard heading={c1.heading} lines={c1.lines} w={2.9} h={1.55} position={[x0 + 4.6, 2.0, -0.7]} rotation={[0, 0, -0.02]} />
      <TextCard heading={c2.heading} lines={c2.lines} w={2.7} h={1.5} position={[x0 + 7.5, 2.0, -0.6]} rotation={[0, 0, 0.02]} />

      <PaperSprite paint={S.dashboard} w={1.5} h={1.4} position={[x0 + 1.3, 3.2, -1.6]} sway={0.02} seedOffset={14} />
      <Stick x={x0 + 1.3} top={2.6} bottom={G} z={-1.65} />
      <PaperSprite paint={S.roomSet} w={3.2} h={2.4} position={[x0 + 9.3, G + 1.2, -1.9]} />
      <PaperSprite paint={S.sparkle} w={1.0} h={1.0} position={[x0 + 10.6, 1.9, -1.4]} sway={0.03} seedOffset={15} />
      <PaperSprite paint={S.cloud} w={1.5} h={0.85} position={[x0 + 6.4, 4.4, -2.1]} sway={0.01} seedOffset={7} />

      <PaperSprite paint={S.grass} w={0.9} h={0.55} position={[x0 + 3.2, G + 0.27, 2.1]} />
      <PaperSprite paint={S.flower} w={0.45} h={0.7} position={[x0 + 8.2, G + 0.35, 1.8]} sway={0.05} seedOffset={16} />
      <PaperSprite paint={S.grass} w={0.8} h={0.5} position={[x0 + 10.4, G + 0.25, 2.3]} />
    </group>
  );
}
