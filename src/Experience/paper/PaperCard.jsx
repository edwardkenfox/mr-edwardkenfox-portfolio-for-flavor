import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  makeCanvas, makeTexture, paperFill, roundedRectPts, sketchStroke, drawText, measureTextBlock,
  FONT_JP, FONT_TITLE, INK,
} from "./canvasUtils";

const PX = 220; // canvas pixels per world unit
const DEPTH = 0.06;

// ExtrudeGeometry UV generator that maps the front cap to 0..1 of the bbox
function bboxUV(minX, minY, w, h) {
  return {
    generateTopUV: (g, v, a, b, c) => [
      new THREE.Vector2((v[a * 3] - minX) / w, (v[a * 3 + 1] - minY) / h),
      new THREE.Vector2((v[b * 3] - minX) / w, (v[b * 3 + 1] - minY) / h),
      new THREE.Vector2((v[c * 3] - minX) / w, (v[c * 3 + 1] - minY) / h),
    ],
    generateSideWallUV: () => [new THREE.Vector2(0.01, 0.01), new THREE.Vector2(0.01, 0.01), new THREE.Vector2(0.01, 0.01), new THREE.Vector2(0.01, 0.01)],
  };
}

export function useCardGeometry(w, h, radius = 0.08) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const r = Math.min(radius, w / 2, h / 2);
    const x = -w / 2, y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false, UVGenerator: bboxUV(x, y, w, h), curveSegments: 6 });
    geo.translate(0, 0, -DEPTH);
    return geo;
  }, [w, h, radius]);
}

/**
 * Generic paper card: `paint(ctx, W, H)` draws the front face.
 * Hover lifts the card toward the camera; `url` opens a link on click.
 */
export function PaperCard({ w = 2, h = 1.4, paint, radius = 0.08, position = [0, 0, 0], rotation = [0, 0, 0], hoverLift = 0.5, url, sideColor = "#d9d2c3", seed = 1, shadow = false, children, ...rest }) {
  const geo = useCardGeometry(w, h, radius);
  const mats = useMemo(() => {
    const c = makeCanvas(Math.round(w * PX), Math.round(h * PX));
    const ctx = c.getContext("2d");
    paint(ctx, c.width, c.height);
    const tex = makeTexture(c);
    return [
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5 }),
      new THREE.MeshBasicMaterial({ color: sideColor }),
    ];
  }, [w, h, paint, sideColor]);

  const ref = useRef();
  const hovered = useRef(false);
  const baseZ = position[2];
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered.current ? baseZ + hoverLift : baseZ;
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, target, 1 - Math.pow(0.9, Math.min(delta, 0.5) * 60));
  });

  return (
    <mesh
      ref={ref}
      geometry={geo}
      material={mats}
      position={position}
      rotation={rotation}
      onPointerEnter={(e) => { e.stopPropagation(); hovered.current = true; if (url) document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { hovered.current = false; document.body.style.cursor = "auto"; }}
      onClick={(e) => { if (url) { e.stopPropagation(); window.open(url, "_blank", "noopener"); } }}
      {...rest}
    >
      {shadow && (
        <mesh position={[0.07, -0.09, -0.08]}>
          <planeGeometry args={[w * 1.02, h * 1.02]} />
          <meshBasicMaterial color="#000" transparent opacity={0.13} depthWrite={false} />
        </mesh>
      )}
      {children}
    </mesh>
  );
}

// sticky-note title: coloured square with a glue band, a curled corner, a push pin and a soft shadow
export function TitleCard({ text, color = "#b9b1d6", textColor = "#2f2a44", w = 2.0, h = 1.9, pinColor = "#e0685c", ...rest }) {
  const paint = useMemo(() => (ctx, W, H) => {
    paperFill(ctx, W, H, color, 11);
    const cx = W / 2, cy = H * 0.55;
    const lines = text.split("\n");
    const size = Math.min(W / (Math.max(...lines.map((l) => l.length)) * 0.95 + 1.2), H * 0.3);
    drawText(ctx, lines, { x: cx, y: cy - (lines.length * size * 1.25) / 2, size, font: FONT_TITLE, color: textColor, lineHeight: 1.25, align: "center" });
    // curled bottom-right corner: cut the corner away (transparent) and draw the folded flap
    const c = Math.min(W, H) * 0.17;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.moveTo(W + 2, H - c); ctx.lineTo(W + 2, H + 2); ctx.lineTo(W - c, H + 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.save();
    const fg = ctx.createLinearGradient(W - c, H, W - c * 0.2, H - c * 0.2);
    fg.addColorStop(0, "#ffffff"); fg.addColorStop(1, color);
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.moveTo(W, H - c); ctx.lineTo(W - c, H); ctx.lineTo(W - c * 0.92, H - c * 0.92); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1.5; ctx.stroke();
    // soft shadow the flap casts onto the note
    ctx.globalAlpha = 0.18; ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.moveTo(W - c * 0.92, H - c * 0.92); ctx.lineTo(W - c * 1.15, H - c * 0.55); ctx.lineTo(W - c * 0.55, H - c * 1.15); ctx.closePath(); ctx.fill();
    ctx.restore();
    // push pin at the top centre
    const px = W / 2, py = H * 0.085, pr = Math.min(W, H) * 0.045;
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.arc(px + pr * 0.5, py + pr * 0.7, pr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    sketchCircleLocal(ctx, px, py, pr, pinColor);
    ctx.save(); ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.beginPath(); ctx.arc(px - pr * 0.3, py - pr * 0.3, pr * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }, [text, color, textColor, pinColor]);
  return <PaperCard w={w} h={h} radius={0.02} paint={paint} sideColor={color} shadow {...rest} />;
}

function sketchCircleLocal(ctx, cx, cy, r, fill) {
  const pts = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore();
  sketchStroke(ctx, pts, { close: true, width: 2.5, seed: 8, passes: 1 });
}

// white notebook-paper card with heading + body lines, sketched border
export function TextCard({ heading, lines = [], w = 2.6, h = 1.7, fontSize = 0.11, headingSize = 0.15, bg = "#f9f7f1", ...rest }) {
  // grow the card so long text never overflows (h is treated as a minimum)
  const hFit = useMemo(() => {
    const c = makeCanvas(8, 8);
    const ctx = c.getContext("2d");
    const W = Math.round(w * PX), pad = 0.1 * PX;
    let px = pad;
    if (heading) px += measureTextBlock(ctx, [heading], { size: headingSize * PX, font: FONT_TITLE, lineHeight: 1.3, maxWidth: W - pad * 2 }).height + 14;
    px += measureTextBlock(ctx, lines, { size: fontSize * PX, font: FONT_JP, lineHeight: 1.5, maxWidth: W - pad * 2 }).height + pad;
    return Math.max(h, Math.ceil((px / PX) * 20) / 20);
  }, [heading, lines, w, h, fontSize, headingSize]);
  const paint = useMemo(() => (ctx, W, H) => {
    paperFill(ctx, W, H, bg, 5);
    const pad = 0.1 * PX;
    sketchStroke(ctx, roundedRectPts(pad * 0.6, pad * 0.6, W - pad * 1.2, H - pad * 1.2, 18), { close: true, width: 4, wobble: 3, seed: 9 });
    let y = pad;
    if (heading) {
      y += drawText(ctx, [heading], { x: pad, y, size: headingSize * PX, font: FONT_TITLE, lineHeight: 1.3, maxWidth: W - pad * 2 });
      ctx.font = `${headingSize * PX}px ${FONT_TITLE}`;
      const tw = Math.min(W - pad * 2, ctx.measureText(heading).width);
      sketchStroke(ctx, [[pad, y - 4], [pad + tw, y - 2]], { width: 3, seed: 4, passes: 1, color: "#c9784f" });
      y += 14;
    }
    drawText(ctx, lines, { x: pad, y, size: fontSize * PX, font: FONT_JP, lineHeight: 1.5, maxWidth: W - pad * 2 });
  }, [heading, lines, fontSize, headingSize, bg]);
  return <PaperCard w={w} h={hFit} paint={paint} {...rest} />;
}

// free-floating handwriting directly on the notebook (no card): transparent plane
export function Handwriting({ lines, size = 0.16, w = 4, h = 1.6, color = INK, font = FONT_JP, align = "left", position = [0, 0, 0], rotation = [0, 0, 0], url }) {
  const tex = useMemo(() => {
    const c = makeCanvas(Math.round(w * PX), Math.round(h * PX));
    const ctx = c.getContext("2d");
    const x = align === "center" ? c.width / 2 : 8;
    drawText(ctx, lines, { x, y: 8, size: size * PX, font, color, lineHeight: 1.45, align, maxWidth: c.width - 16 });
    return makeTexture(c);
  }, [lines, size, w, h, color, font, align]);
  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerEnter={() => { if (url) document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { if (url) document.body.style.cursor = "auto"; }}
      onClick={(e) => { if (url) { e.stopPropagation(); window.open(url, "_blank", "noopener"); } }}
    >
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.05} depthWrite={false} />
    </mesh>
  );
}

export { PX };
