import React, { useMemo } from "react";
import * as THREE from "three";
import { makeCanvas, makeTexture, paperFill, notebookLines, rng } from "./canvasUtils";

export const GROUND_Y = -0.9;   // top surface of the floor
export const WALL_Z = -2.6;     // notebook wall
export const FLOOR_DEPTH = 9;   // how far the floor extends toward the camera

// tileable notebook paper (lines every ~0.5 world units)
function notebookTex(unitsPerTile = 4, px = 1024) {
  const c = makeCanvas(px, px);
  const ctx = c.getContext("2d");
  paperFill(ctx, px, px, "#f4f1ea", 3);
  notebookLines(ctx, px, px, { spacing: px / (unitsPerTile * 2), offset: 0, lineColor: "#a9c1dc" });
  return makeTexture(c, { repeat: [1, 1] });
}

// tileable green paper (grass floor) with faint lines
function grassTex(px = 1024) {
  const c = makeCanvas(px, px);
  const ctx = c.getContext("2d");
  paperFill(ctx, px, px, "#bfe0b1", 9);
  notebookLines(ctx, px, px, { spacing: px / 6, lineColor: "#8fbf8f" });
  const rand = rng(5);
  ctx.strokeStyle = "#7fae7a";
  ctx.lineWidth = 2;
  for (let i = 0; i < 260; i++) {
    const x = rand() * px, y = rand() * px;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rand() - 0.5) * 8, y - 8 - rand() * 8); ctx.stroke();
  }
  return makeTexture(c, { repeat: [1, 1] });
}

function pathTex(px = 512) {
  const c = makeCanvas(px, px);
  const ctx = c.getContext("2d");
  paperFill(ctx, px, px, "#e6cfae", 4);
  ctx.strokeStyle = "#c9ad86"; ctx.lineWidth = 3;
  for (let x = 0; x < px; x += px / 4) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, px); ctx.stroke(); }
  return makeTexture(c, { repeat: [1, 1] });
}

/**
 * Notebook wall + green floor + sandy path, spanning `width` world units from x=0.
 * Colour of the floor per scene can be overridden by `floorColor` bands.
 */
export function Environment({ width, floorBands = [] }) {
  const wall = useMemo(() => { const t = notebookTex(); t.repeat.set(width / 4, 20 / 4); return t; }, [width]);
  const grassT = useMemo(() => { const t = grassTex(); t.repeat.set(width / 4, FLOOR_DEPTH / 4); return t; }, [width]);
  const path = useMemo(() => { const t = pathTex(); t.repeat.set(width / 2, 1); return t; }, [width]);
  // red margin line like a notebook
  return (
    <group>
      <mesh position={[width / 2, GROUND_Y + 10, WALL_Z]}>
        <planeGeometry args={[width + 40, 20]} />
        <meshBasicMaterial map={wall} />
      </mesh>
      {/* red vertical margin lines every 16 units */}
      {Array.from({ length: Math.ceil(width / 16) + 1 }).map((_, i) => (
        <mesh key={i} position={[i * 16 - 1.5, GROUND_Y + 10, WALL_Z + 0.01]}>
          <planeGeometry args={[0.04, 20]} />
          <meshBasicMaterial color="#e39a9a" />
        </mesh>
      ))}
      {/* floor */}
      <mesh position={[width / 2, GROUND_Y, WALL_Z + FLOOR_DEPTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 40, FLOOR_DEPTH]} />
        <meshBasicMaterial map={grassT} />
      </mesh>
      {floorBands.map((b, i) => (
        <mesh key={"band" + i} position={[b.x, GROUND_Y + 0.005, WALL_Z + FLOOR_DEPTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[b.w, FLOOR_DEPTH]} />
          <meshBasicMaterial color={b.color} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* sandy path strip */}
      <mesh position={[width / 2, GROUND_Y + 0.01, WALL_Z + 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 40, 0.9]} />
        <meshBasicMaterial map={path} />
      </mesh>
      {/* floor front edge (paper thickness) */}
      <mesh position={[width / 2, GROUND_Y - 0.15, WALL_Z + FLOOR_DEPTH]}>
        <planeGeometry args={[width + 40, 0.3]} />
        <meshBasicMaterial color="#8fb98a" />
      </mesh>
    </group>
  );
}
