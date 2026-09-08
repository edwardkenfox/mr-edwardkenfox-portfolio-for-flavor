import React from "react";
import { TitleCard, TextCard } from "../paper/PaperCard";
import { PaperPhoto } from "../paper/PaperPhoto";
import { PhotoLine } from "../paper/PhotoLine";
import { PaperSprite, Stick } from "../paper/PaperSprite";
import { GROUND_Y } from "../paper/Environment";
import * as S from "../paper/sketches";

const G = GROUND_Y;

export default function Scene4({ x0, data }) {
  const [c1, c2] = data.cards;
  return (
    <group>
      <TitleCard text={data.title} color="#a9d8e6" textColor="#1f4a5a" position={[x0 + 2.2, 3.05, -1.0]} rotation={[0, 0, -0.03]} />
      <TextCard heading={c1.heading} lines={c1.lines} w={2.6} h={1.5} position={[x0 + 4.4, 1.85, -0.7]} rotation={[0, 0, 0.02]} />
      <TextCard heading={c2.heading} lines={c2.lines} w={3.0} h={1.6} position={[x0 + 7.6, 1.85, -0.6]} rotation={[0, 0, -0.015]} />
      {data.hobbies && <TextCard heading={data.hobbies.heading} lines={data.hobbies.lines} w={2.4} h={1.5} position={[x0 + 10.5, 1.8, -0.7]} rotation={[0, 0, 0.02]} />}
      <PaperPhoto src={data.photo.src} label={data.photo.label} caption={data.photo.caption} w={1.9} h={2.1} position={[x0 + 14.2, 1.85, -0.5]} />
      {data.photos && <PhotoLine x0={x0 + 4.4} x1={x0 + 12.8} y={3.8} z={-0.35} photos={data.photos} photoW={1.05} photoH={1.2} />}

      <PaperSprite paint={S.mountain} w={4.0} h={2.4} position={[x0 + 5.5, G + 1.2, -2.3]} />
      <PaperSprite paint={S.house} w={1.6} h={1.7} position={[x0 + 14.3, G + 0.85, -2.0]} />
      <PaperSprite paint={S.surfboard} w={0.6} h={1.9} position={[x0 + 1.2, G + 0.95, -1.4]} rotation={[0, 0, -0.15]} />
      <PaperSprite paint={S.kids} w={1.3} h={1.2} position={[x0 + 10.0, G + 0.6, -1.3]} sway={0.02} seedOffset={12} />
      <PaperSprite paint={S.beerAndPan} w={1.4} h={1.0} position={[x0 + 1.6, 3.25, -1.6]} sway={0.02} seedOffset={13} />
      <Stick x={x0 + 1.6} top={3.1} bottom={G} z={-1.65} />
      <PaperSprite paint={S.sun} w={1.3} h={1.3} position={[x0 + 12.8, 5.0, -2.4]} sway={0.01} />
      <PaperSprite paint={S.cloud} w={1.6} h={0.9} position={[x0 + 8.5, 4.9, -2.3]} sway={0.01} seedOffset={6} />

      {/* foreground: the sea */}
      <PaperSprite paint={S.wave} w={6} h={0.9} position={[x0 + 4.0, G + 0.35, 2.2]} thickness={false} />
      <PaperSprite paint={S.wave} w={6} h={0.9} position={[x0 + 10.0, G + 0.3, 2.5]} thickness={false} />
      <PaperSprite paint={S.wave} w={6} h={0.9} position={[x0 + 7.0, G + 0.45, 1.6]} thickness={false} />
    </group>
  );
}
