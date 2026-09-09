import React, { useMemo } from "react";
import * as THREE from "three";
import { makeCanvas, makeTexture, paperFill, rng } from "./canvasUtils";

export const GROUND_Y = -0.9;   // top surface of the floor
export const WALL_Z = -2.6;     // notebook wall
export const FLOOR_DEPTH = 9;   // how far the floor extends toward the camera

// ink line with a soft bleed: blurred wide pass + crisp slightly wobbly pass
function inkLine(ctx, x0, y0, x1, y1, color, width, seed) {
  const r = rng(seed);
  ctx.save();
  ctx.strokeStyle = color; ctx.lineCap = "round";
  ctx.filter = "blur(2.5px)"; ctx.globalAlpha = 0.35; ctx.lineWidth = width * 2.6;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.filter = "none"; ctx.globalAlpha = 0.85; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x0, y0);
  const steps = 24;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    ctx.lineTo(x0 + (x1 - x0) * t + (r() - 0.5) * 0.6, y0 + (y1 - y0) * t + (r() - 0.5) * 1.4);
  }
  ctx.stroke();
  ctx.restore();
}

// paper grain: fibres, speckles and a few very faint stains
function paperGrain(ctx, w, h, seed, strength = 1) {
  const r = rng(seed);
  ctx.save();
  for (let i = 0; i < (w * h) / 600; i++) {
    ctx.globalAlpha = 0.05 * strength;
    ctx.fillStyle = r() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
  ctx.strokeStyle = "#8a7a60"; ctx.lineWidth = 1;
  for (let i = 0; i < (w * h) / 9000; i++) {
    ctx.globalAlpha = 0.07 * strength;
    const l = 6 + r() * 18, a = r() * Math.PI, x = l + r() * (w - 2 * l), y = l + r() * (h - 2 * l);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const rad = 80 + r() * 220;
    const x = rad + r() * (w - 2 * rad), y = rad + r() * (h - 2 * rad); // keep stains away from tile edges so the tile stays seamless
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, "rgba(120,90,40,0.06)"); grad.addColorStop(1, "rgba(120,90,40,0)");
    ctx.globalAlpha = strength; ctx.fillStyle = grad; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  ctx.restore();
}

// tileable notebook paper: 8 world units per tile, lines every 0.5 units
function notebookTex(unitsPerTile = 8, px = 2048) {
  const c = makeCanvas(px, px);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#f3efe6"; ctx.fillRect(0, 0, px, px);
  paperGrain(ctx, px, px, 3);
  const spacing = px / (unitsPerTile * 2);
  for (let y = 0; y < px; y += spacing) inkLine(ctx, -10, y, px + 10, y, "#8fb0d4", 2.2, 100 + y);
  return makeTexture(c, { repeat: [1, 1] });
}

// the red margin line, drawn with the same bleed (tiles vertically)
function marginTex(px = 64) {
  const c = makeCanvas(px, 512);
  const ctx = c.getContext("2d");
  inkLine(ctx, px / 2, -10, px / 2, 522, "#d9807f", 2.6, 7);
  const t = makeTexture(c, { repeat: [1, 1] });
  return t;
}

// tileable green paper (grass floor) with faint lines
function grassTex(px = 1024) {
  const c = makeCanvas(px, px);
  const ctx = c.getContext("2d");
  paperFill(ctx, px, px, "#bfe0b1", 9);
  paperGrain(ctx, px, px, 5, 0.8);
  for (let y = 0; y < px; y += px / 6) inkLine(ctx, -10, y, px + 10, y, "#8fbf8f", 2, 200 + y);
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
const LOOP_OFFSETS = [-88, 0, 88];
const EXTRA = 60; // planes extend one seam beyond the world on both sides

export function Environment({ width, floorBands = [] }) {
  const wall = useMemo(() => { const t = notebookTex(); t.repeat.set((width + EXTRA) / 8, 20 / 8); return t; }, [width]);
  const margin = useMemo(() => { const t = marginTex(); t.repeat.set(1, 20 / 4); return t; }, []);
  const grassT = useMemo(() => { const t = grassTex(); t.repeat.set((width + EXTRA) / 4, FLOOR_DEPTH / 4); return t; }, [width]);
  const path = useMemo(() => { const t = pathTex(); t.repeat.set((width + EXTRA) / 2, 1); return t; }, [width]);
  // red margin line like a notebook
  return (
    <group>
      <mesh position={[width / 2, GROUND_Y + 10, WALL_Z]}>
        <planeGeometry args={[width + EXTRA, 20]} />
        <meshBasicMaterial map={wall} />
      </mesh>
      {/* red vertical margin lines every 16 units */}
      {LOOP_OFFSETS.flatMap((off) => Array.from({ length: Math.ceil(width / 16) }, (_, i) => off + i * 16 - 1.5))
        .filter((x) => x > -EXTRA / 2 && x < width + EXTRA / 2)
        .map((x) => (
        <mesh key={x} position={[x, GROUND_Y + 10, WALL_Z + 0.01]}>
          <planeGeometry args={[0.25, 20]} />
          <meshBasicMaterial map={margin} transparent depthWrite={false} />
        </mesh>
      ))}
      {/* floor */}
      <mesh position={[width / 2, GROUND_Y, WALL_Z + FLOOR_DEPTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + EXTRA, FLOOR_DEPTH]} />
        <meshBasicMaterial map={grassT} />
      </mesh>
      {LOOP_OFFSETS.flatMap((off) => floorBands.map((b) => ({ ...b, x: b.x + off }))).map((b, i) => (
        <mesh key={"band" + i} position={[b.x, GROUND_Y + 0.005, WALL_Z + FLOOR_DEPTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[b.w, FLOOR_DEPTH]} />
          <meshBasicMaterial color={b.color} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* sandy path strip */}
      <mesh position={[width / 2, GROUND_Y + 0.01, WALL_Z + 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + EXTRA, 0.9]} />
        <meshBasicMaterial map={path} />
      </mesh>
      {/* floor front edge (paper thickness) */}
      <mesh position={[width / 2, GROUND_Y - 0.15, WALL_Z + FLOOR_DEPTH]}>
        <planeGeometry args={[width + EXTRA, 0.3]} />
        <meshBasicMaterial color="#8fb98a" />
      </mesh>
    </group>
  );
}
