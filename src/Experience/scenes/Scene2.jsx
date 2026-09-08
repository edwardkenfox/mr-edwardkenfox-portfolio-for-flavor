import React from "react";
import { TitleCard, TextCard, Handwriting } from "../paper/PaperCard";
import { PaperSprite, Stick } from "../paper/PaperSprite";
import { GROUND_Y } from "../paper/Environment";
import * as S from "../paper/sketches";

const G = GROUND_Y;

export default function Scene2({ x0, data }) {
  const [c1, c2] = data.cards;
  return (
    <group>
      <TitleCard text={data.title} color="#f6c9a0" textColor="#5a3a1a" position={[x0 + 2.2, 3.05, -1.0]} rotation={[0, 0, -0.04]} />
      <TextCard heading={c1.heading} lines={c1.lines} w={2.9} h={1.8} position={[x0 + 4.6, 1.9, -0.7]} rotation={[0, 0, 0.02]} />
      <TextCard heading={c2.heading} lines={c2.lines} w={2.6} h={1.5} position={[x0 + 8.2, 2.0, -0.8]} rotation={[0, 0, -0.02]} />
      <Handwriting lines={data.recenoNote} size={0.15} w={3.6} h={1.4} position={[x0 + 12.4, 2.0, -0.9]} rotation={[0, 0, 0.02]} />

      <PaperSprite paint={S.patent} w={1.1} h={1.3} position={[x0 + 1.2, G + 0.65, -1.4]} rotation={[0, 0, 0.05]} />
      <PaperSprite paint={S.chart100} w={1.5} h={1.2} position={[x0 + 10.6, 3.35, -1.6]} sway={0.02} seedOffset={5} />
      <Stick x={x0 + 10.6} top={3.1} bottom={G} z={-1.65} />
      <PaperSprite paint={S.building} w={1.4} h={2.4} position={[x0 + 14.3, G + 1.2, -2.0]} />
      <PaperSprite paint={S.armchair} w={1.0} h={0.9} position={[x0 + 12.4, G + 0.45, -1.3]} />
      <PaperSprite paint={S.sun} w={1.6} h={1.6} position={[x0 + 7.0, 4.6, -2.2]} sway={0.01} />
      <PaperSprite paint={S.cloud} w={1.5} h={0.85} position={[x0 + 13.0, 4.8, -2.1]} sway={0.01} seedOffset={3} />

      <PaperSprite paint={S.grass} w={0.9} h={0.55} position={[x0 + 2.4, G + 0.27, 2.1]} />
      <PaperSprite paint={S.flower} w={0.45} h={0.7} position={[x0 + 9.0, G + 0.35, 1.7]} sway={0.05} seedOffset={6} />
      <PaperSprite paint={S.grass} w={0.8} h={0.5} position={[x0 + 13.6, G + 0.25, 2.2]} />
    </group>
  );
}
