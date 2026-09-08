import React from "react";
import { TitleCard, TextCard } from "../paper/PaperCard";
import { PaperSprite, Stick } from "../paper/PaperSprite";
import { GROUND_Y } from "../paper/Environment";
import * as S from "../paper/sketches";

const G = GROUND_Y;

export default function Scene3({ x0, data }) {
  const [c1, c2] = data.cards;
  return (
    <group>
      <TitleCard text={data.title} color="#f7d98c" textColor="#5a4410" position={[x0 + 2.4, 3.05, -1.0]} rotation={[0, 0, 0.03]} />
      <TextCard heading={c1.heading} lines={c1.lines} w={2.7} h={1.5} position={[x0 + 4.6, 2.0, -0.7]} rotation={[0, 0, -0.02]} />
      <TextCard heading={c2.heading} lines={c2.lines} w={2.9} h={1.55} position={[x0 + 9.2, 2.0, -0.6]} rotation={[0, 0, 0.02]} url={c2.url} />

      <PaperSprite paint={S.robot} w={1.3} h={1.7} position={[x0 + 1.3, G + 0.85, -1.5]} sway={0.02} seedOffset={7} />
      <PaperSprite paint={S.bagel} w={1.0} h={1.0} position={[x0 + 7.0, 3.45, -1.6]} rotation={[0, 0, 0.3]} sway={0.03} seedOffset={8} />
      <Stick x={x0 + 7.0} top={3.3} bottom={G} z={-1.65} />
      <PaperSprite paint={S.bagel} w={0.7} h={0.7} position={[x0 + 12.2, 3.3, -1.4]} rotation={[0, 0, -0.4]} sway={0.03} seedOffset={9} />
      <PaperSprite paint={S.oven} w={1.5} h={1.5} position={[x0 + 12.6, G + 0.75, -1.8]} />
      <PaperSprite paint={S.instagram} w={0.8} h={0.8} position={[x0 + 10.9, 3.35, -1.7]} sway={0.04} seedOffset={10} />
      <PaperSprite paint={S.cloud} w={1.6} h={0.9} position={[x0 + 5.0, 4.8, -2.1]} sway={0.01} seedOffset={4} />
      <PaperSprite paint={S.cloud} w={1.3} h={0.75} position={[x0 + 14.5, 4.5, -2.0]} sway={0.01} seedOffset={5} />

      <PaperSprite paint={S.grass} w={0.9} h={0.55} position={[x0 + 3.8, G + 0.27, 2.0]} />
      <PaperSprite paint={S.grass} w={0.8} h={0.5} position={[x0 + 10.4, G + 0.25, 1.8]} />
      <PaperSprite paint={S.flower} w={0.45} h={0.7} position={[x0 + 14.2, G + 0.35, 2.2]} sway={0.05} seedOffset={11} />
    </group>
  );
}
