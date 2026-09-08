// Hand-drawn style paint functions. Each is (ctx, W, H) on a transparent canvas.
// Coordinates are given in 0..1 of the canvas via the helper `N(ctx,W,H)`.
import {
  sketchPoly, sketchStroke, sketchCircle, sketchLine, circlePts, ellipsePts, roundedRectPts,
  fillPoly, drawText, INK, FONT_EN, FONT_TITLE, rng,
} from "./canvasUtils";

const C = {
  ink: INK, white: "#fbfaf6", paper: "#f3efe4", yellow: "#f2c94c", orange: "#f0a35e", red: "#e0685c",
  pink: "#f4b6c2", blue: "#8fc1e3", deep: "#4f7fb0", green: "#9ccf8f", darkgreen: "#5a9a5a", wood: "#d9a06b",
  brown: "#8a5a3c", grey: "#b8b4ad", dark: "#4a4744", cream: "#f6e7b6", purple: "#b9a5d8", teal: "#6fb7a9",
};

const N = (W, H) => ({ x: (v) => v * W, y: (v) => v * H, s: (v) => v * Math.min(W, H) });
const P = (n, arr) => arr.map(([x, y]) => [n.x(x), n.y(y)]);
const lw = (W, H = W) => Math.max(3, Math.min(W, H) * 0.02);

// ---------- environment ----------
export function cloud(ctx, W, H) {
  const n = N(W, H);
  const pts = [];
  const bumps = [[0.2, 0.62, 0.17], [0.4, 0.45, 0.22], [0.63, 0.5, 0.2], [0.8, 0.65, 0.15]];
  for (const [cx, cy, r] of bumps) pts.push(...circlePts(n.x(cx), n.y(cy), n.s(r), 14, Math.PI).filter((p) => p[1] <= n.y(0.72)));
  pts.push([n.x(0.93), n.y(0.75)], [n.x(0.07), n.y(0.75)]);
  sketchPoly(ctx, pts, C.white, { width: lw(W, H), wobble: 3, seed: 2 });
  // face
  sketchCircle(ctx, n.x(0.42), n.y(0.55), n.s(0.015), C.ink, { width: 2, passes: 1 });
  sketchCircle(ctx, n.x(0.6), n.y(0.55), n.s(0.015), C.ink, { width: 2, passes: 1 });
  sketchStroke(ctx, [[n.x(0.45), n.y(0.64)], [n.x(0.51), n.y(0.68)], [n.x(0.57), n.y(0.64)]], { width: 3, passes: 1 });
}

export function sun(ctx, W, H) {
  const n = N(W, H);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = n.s(0.3), r2 = n.s(0.46);
    sketchStroke(ctx, [[n.x(0.5) + Math.cos(a) * r1, n.y(0.5) + Math.sin(a) * r1], [n.x(0.5) + Math.cos(a) * r2, n.y(0.5) + Math.sin(a) * r2]], { width: lw(W, H) * 1.4, color: C.orange, seed: i });
  }
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.28), C.yellow, { width: lw(W, H), seed: 3 });
  sketchStroke(ctx, [[n.x(0.42), n.y(0.47)], [n.x(0.45), n.y(0.47)]], { width: 4, passes: 1 });
  sketchStroke(ctx, [[n.x(0.55), n.y(0.47)], [n.x(0.58), n.y(0.47)]], { width: 4, passes: 1 });
  sketchStroke(ctx, [[n.x(0.44), n.y(0.56)], [n.x(0.5), n.y(0.6)], [n.x(0.56), n.y(0.56)]], { width: 3, passes: 1 });
}

export function cherryTree(ctx, W, H) {
  const n = N(W, H);
  // trunk
  sketchPoly(ctx, P(n, [[0.44, 0.98], [0.46, 0.6], [0.35, 0.45], [0.4, 0.44], [0.48, 0.55], [0.5, 0.35], [0.55, 0.35], [0.54, 0.55], [0.64, 0.42], [0.68, 0.45], [0.56, 0.62], [0.58, 0.98]]), C.wood, { width: lw(W, H), seed: 5 });
  // blossoms
  const rand = rng(21);
  const blobs = [[0.3, 0.38], [0.45, 0.25], [0.6, 0.22], [0.72, 0.36], [0.5, 0.42], [0.36, 0.52], [0.66, 0.5]];
  for (const [bx, by] of blobs) {
    for (let k = 0; k < 5; k++) {
      const px = n.x(bx) + (rand() - 0.5) * n.s(0.16), py = n.y(by) + (rand() - 0.5) * n.s(0.16);
      const r = n.s(0.045 + rand() * 0.02);
      const petals = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        petals.push(...circlePts(px + Math.cos(a) * r * 0.6, py + Math.sin(a) * r * 0.6, r * 0.5, 8).filter((_, j) => j < 5).map((p) => p));
      }
      sketchCircle(ctx, px, py, r, C.pink, { width: 2.5, wobble: 3, seed: k + bx * 100, passes: 1 });
      ctx.fillStyle = "#e07a8a";
      ctx.beginPath(); ctx.arc(px, py, r * 0.2, 0, Math.PI * 2); ctx.fill();
    }
  }
}

export function grass(ctx, W, H) {
  const n = N(W, H);
  const blades = [[0.1, 0.95, 0.2, 0.3], [0.3, 0.95, 0.35, 0.15], [0.5, 0.95, 0.5, 0.05], [0.7, 0.95, 0.68, 0.2], [0.9, 0.95, 0.82, 0.35]];
  const pts = [[n.x(0.02), n.y(0.98)]];
  for (const [bx, by, tx, ty] of blades) pts.push([n.x(bx - 0.06), n.y(by)], [n.x(tx), n.y(ty)], [n.x(bx + 0.06), n.y(by)]);
  pts.push([n.x(0.98), n.y(0.98)]);
  sketchPoly(ctx, pts, C.green, { width: lw(W, H), wobble: 2, seed: 8 });
}

export function flower(ctx, W, H) {
  const n = N(W, H);
  sketchStroke(ctx, [[n.x(0.5), n.y(0.98)], [n.x(0.48), n.y(0.7)], [n.x(0.5), n.y(0.45)]], { width: lw(W, H), color: C.darkgreen, seed: 3 });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    sketchPoly(ctx, ellipsePts(n.x(0.5) + Math.cos(a) * n.s(0.17), n.y(0.32) + Math.sin(a) * n.s(0.17), n.s(0.11), n.s(0.08), 16), C.pink, { width: 3, seed: i, passes: 1 });
  }
  sketchCircle(ctx, n.x(0.5), n.y(0.32), n.s(0.1), C.yellow, { width: 3, seed: 9 });
}

export function mountain(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, P(n, [[0.02, 0.95], [0.3, 0.35], [0.42, 0.5], [0.55, 0.18], [0.75, 0.55], [0.85, 0.42], [0.98, 0.95]]), C.blue, { width: lw(W, H), seed: 4 });
  sketchPoly(ctx, P(n, [[0.47, 0.35], [0.55, 0.18], [0.63, 0.35], [0.58, 0.33], [0.55, 0.38], [0.51, 0.33]]), C.white, { width: 3, seed: 5, passes: 1 });
}

export function wave(ctx, W, H) {
  const n = N(W, H);
  const pts = [];
  const k = 6;
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    pts.push([n.x(t), n.y(0.5 + Math.sin(t * Math.PI * 2 * k) * 0.12 + (Math.cos(t * Math.PI * 2 * k * 0.5) * 0.05))]);
  }
  pts.push([n.x(1), n.y(1)], [n.x(0), n.y(1)]);
  sketchPoly(ctx, pts, C.blue, { width: lw(W, H), wobble: 2, seed: 6 });
  // foam curls
  for (let i = 0; i < k; i++) {
    const x = n.x((i + 0.5) / k);
    sketchStroke(ctx, [[x - n.s(0.05), n.y(0.62)], [x, n.y(0.5)], [x + n.s(0.05), n.y(0.62)]], { width: 3, color: C.white, passes: 1, seed: i });
  }
}

// ---------- scene 1: 経歴 ----------
export function pencil(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, P(n, [[0.08, 0.45], [0.7, 0.45], [0.7, 0.55], [0.08, 0.55]]), C.yellow, { width: lw(W, H), seed: 1 });
  sketchPoly(ctx, P(n, [[0.7, 0.45], [0.9, 0.5], [0.7, 0.55]]), C.cream, { width: 3, seed: 2 });
  sketchPoly(ctx, P(n, [[0.85, 0.485], [0.9, 0.5], [0.85, 0.515]]), C.ink, { width: 2, seed: 3, passes: 1 });
  sketchPoly(ctx, P(n, [[0.02, 0.45], [0.08, 0.45], [0.08, 0.55], [0.02, 0.55]]), C.pink, { width: 3, seed: 4 });
}

export function palette(ctx, W, H) {
  const n = N(W, H);
  const pts = ellipsePts(n.x(0.5), n.y(0.5), n.s(0.44), n.s(0.36), 40);
  pts.splice(30, 6, [n.x(0.62), n.y(0.62)], [n.x(0.7), n.y(0.55)]); // thumb hole notch
  sketchPoly(ctx, pts, C.wood, { width: lw(W, H), seed: 6 });
  const dots = [[0.3, 0.38, C.red], [0.45, 0.28, C.yellow], [0.6, 0.3, C.blue], [0.72, 0.4, C.green], [0.28, 0.6, C.purple]];
  for (const [x, y, c] of dots) sketchCircle(ctx, n.x(x), n.y(y), n.s(0.06), c, { width: 2.5, passes: 1, seed: x * 10 });
  sketchCircle(ctx, n.x(0.55), n.y(0.62), n.s(0.05), "rgba(0,0,0,0)", { width: 3, passes: 1 });
}

export function jsBadge(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.1), n.y(0.1), n.x(0.8), n.y(0.8), n.s(0.08)), C.yellow, { width: lw(W, H), seed: 2 });
  drawText(ctx, ["JS"], { x: n.x(0.5), y: n.y(0.24), size: n.s(0.48), font: FONT_EN, color: C.ink, align: "center", weight: "bold" });
}

export function flagJP(ctx, W, H) {
  const n = N(W, H);
  sketchStroke(ctx, [[n.x(0.1), n.y(0.98)], [n.x(0.1), n.y(0.05)]], { width: lw(W, H), color: C.brown, seed: 1 });
  sketchPoly(ctx, P(n, [[0.12, 0.08], [0.95, 0.12], [0.92, 0.6], [0.12, 0.62]]), C.white, { width: lw(W, H), seed: 2 });
  sketchCircle(ctx, n.x(0.52), n.y(0.35), n.s(0.15), C.red, { width: 3, seed: 3, passes: 1 });
}

export function flagUA(ctx, W, H) {
  const n = N(W, H);
  sketchStroke(ctx, [[n.x(0.1), n.y(0.98)], [n.x(0.1), n.y(0.05)]], { width: lw(W, H), color: C.brown, seed: 1 });
  fillPoly(ctx, P(n, [[0.12, 0.08], [0.95, 0.12], [0.93, 0.36], [0.12, 0.35]]), C.deep);
  fillPoly(ctx, P(n, [[0.12, 0.35], [0.93, 0.36], [0.92, 0.6], [0.12, 0.62]]), C.yellow);
  sketchStroke(ctx, P(n, [[0.12, 0.08], [0.95, 0.12], [0.92, 0.6], [0.12, 0.62]]), { close: true, width: lw(W, H), seed: 2 });
}

export function certificate(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.08), n.y(0.1), n.x(0.84), n.y(0.8), n.s(0.04)), C.cream, { width: lw(W, H), seed: 4 });
  for (let i = 0; i < 3; i++) sketchStroke(ctx, [[n.x(0.2), n.y(0.32 + i * 0.13)], [n.x(0.8 - i * 0.15), n.y(0.32 + i * 0.13)]], { width: 3, passes: 1, seed: i });
  sketchCircle(ctx, n.x(0.72), n.y(0.72), n.s(0.09), C.red, { width: 3, seed: 8, passes: 1 });
  // plug icon on top-left
  sketchPoly(ctx, roundedRectPts(n.x(0.16), n.y(0.14), n.x(0.14), n.y(0.12), 6), C.blue, { width: 2, passes: 1, seed: 1 });
}

export function flagUS(ctx, W, H) {
  const n = N(W, H);
  sketchStroke(ctx, [[n.x(0.1), n.y(0.98)], [n.x(0.1), n.y(0.05)]], { width: lw(W, H), color: C.brown, seed: 1 });
  const quad = P(n, [[0.12, 0.08], [0.95, 0.12], [0.92, 0.6], [0.12, 0.62]]);
  fillPoly(ctx, quad, C.white);
  ctx.save();
  ctx.beginPath(); ctx.moveTo(quad[0][0], quad[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(quad[i][0], quad[i][1]); ctx.closePath(); ctx.clip();
  for (let i = 0; i < 7; i++) if (i % 2 === 0) { ctx.fillStyle = C.red; ctx.fillRect(n.x(0.1), n.y(0.08 + i * 0.078), n.x(0.9), n.y(0.039)); }
  ctx.fillStyle = C.deep; ctx.fillRect(n.x(0.12), n.y(0.08), n.x(0.34), n.y(0.28));
  ctx.fillStyle = C.white;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.beginPath(); ctx.arc(n.x(0.17 + c * 0.08), n.y(0.13 + r * 0.09), n.s(0.012), 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  sketchStroke(ctx, quad, { close: true, width: lw(W, H), seed: 2 });
}

// video camera (映像学科)
export function videoCamera(ctx, W, H) {
  const n = N(W, H);
  // body
  sketchPoly(ctx, roundedRectPts(n.x(0.2), n.y(0.35), n.x(0.5), n.y(0.4), n.s(0.06)), C.dark, { width: lw(W, H), seed: 2 });
  // lens
  sketchPoly(ctx, P(n, [[0.7, 0.42], [0.92, 0.32], [0.92, 0.78], [0.7, 0.68]]), C.grey, { width: lw(W, H), seed: 3 });
  sketchCircle(ctx, n.x(0.9), n.y(0.55), n.s(0.07), C.blue, { width: 2, passes: 1, seed: 4 });
  // film reels on top
  sketchCircle(ctx, n.x(0.33), n.y(0.22), n.s(0.14), C.grey, { width: lw(W, H), seed: 5 });
  sketchCircle(ctx, n.x(0.58), n.y(0.22), n.s(0.14), C.grey, { width: lw(W, H), seed: 6 });
  sketchCircle(ctx, n.x(0.33), n.y(0.22), n.s(0.04), C.dark, { width: 2, passes: 1 });
  sketchCircle(ctx, n.x(0.58), n.y(0.22), n.s(0.04), C.dark, { width: 2, passes: 1 });
  // viewfinder + rec light
  sketchPoly(ctx, roundedRectPts(n.x(0.08), n.y(0.4), n.x(0.14), n.y(0.14), 4), C.grey, { width: 2, passes: 1, seed: 7 });
  sketchCircle(ctx, n.x(0.3), n.y(0.45), n.s(0.025), C.red, { width: 1.5, passes: 1 });
  // handle / tripod stub
  sketchStroke(ctx, [[n.x(0.45), n.y(0.75)], [n.x(0.45), n.y(0.95)]], { width: lw(W, H) * 1.5, color: C.dark, seed: 8 });
}

// ---------- scene 2: 本業 ----------
export function rocket(ctx, W, H) {
  const n = N(W, H);
  // flame
  sketchPoly(ctx, P(n, [[0.4, 0.8], [0.5, 0.98], [0.6, 0.8]]), C.orange, { width: 3, seed: 1, passes: 1 });
  sketchPoly(ctx, P(n, [[0.45, 0.8], [0.5, 0.9], [0.55, 0.8]]), C.yellow, { width: 2, seed: 2, passes: 1 });
  // fins
  sketchPoly(ctx, P(n, [[0.32, 0.6], [0.18, 0.82], [0.34, 0.78]]), C.red, { width: 3, seed: 3 });
  sketchPoly(ctx, P(n, [[0.68, 0.6], [0.82, 0.82], [0.66, 0.78]]), C.red, { width: 3, seed: 4 });
  // body
  const body = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; body.push([n.x(0.32 + 0.36 * t), n.y(0.28 - Math.sin(t * Math.PI) * 0.24)]); }
  body.push([n.x(0.68), n.y(0.8)], [n.x(0.32), n.y(0.8)]);
  sketchPoly(ctx, body, C.white, { width: lw(W, H), seed: 5 });
  sketchPoly(ctx, P(n, [[0.32, 0.28], [0.5, 0.02], [0.68, 0.28]]), C.red, { width: 3, seed: 6 });
  sketchCircle(ctx, n.x(0.5), n.y(0.45), n.s(0.09), C.blue, { width: 3, seed: 7 });
  drawText(ctx, ["Booster"], { x: n.x(0.5), y: n.y(0.6), size: n.s(0.085), font: FONT_EN, align: "center" });
}

export function patent(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, P(n, [[0.12, 0.1], [0.88, 0.1], [0.88, 0.9], [0.12, 0.9]]), C.cream, { width: lw(W, H), seed: 3 });
  drawText(ctx, ["特許"], { x: n.x(0.5), y: n.y(0.16), size: n.s(0.2), font: FONT_TITLE, align: "center" });
  for (let i = 0; i < 3; i++) sketchStroke(ctx, [[n.x(0.22), n.y(0.48 + i * 0.1)], [n.x(0.78), n.y(0.48 + i * 0.1)]], { width: 3, passes: 1, seed: i });
  // ribbon medal
  sketchCircle(ctx, n.x(0.7), n.y(0.78), n.s(0.1), C.yellow, { width: 3, seed: 9 });
  sketchPoly(ctx, P(n, [[0.66, 0.85], [0.64, 0.98], [0.7, 0.93], [0.76, 0.98], [0.74, 0.85]]), C.red, { width: 2, seed: 10, passes: 1 });
}

export function chart100(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.05), n.y(0.05), n.x(0.9), n.y(0.9), n.s(0.05)), C.white, { width: lw(W, H), seed: 3 });
  const bars = [0.25, 0.4, 0.55, 0.8];
  bars.forEach((v, i) => sketchPoly(ctx, P(n, [[0.15 + i * 0.19, 0.8], [0.29 + i * 0.19, 0.8], [0.29 + i * 0.19, 0.8 - v * 0.55], [0.15 + i * 0.19, 0.8 - v * 0.55]]), [C.blue, C.blue, C.teal, C.orange][i], { width: 3, seed: i }));
  drawText(ctx, ["100社+"], { x: n.x(0.5), y: n.y(0.08), size: n.s(0.16), font: FONT_TITLE, align: "center" });
}

export function building(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, P(n, [[0.2, 0.98], [0.2, 0.2], [0.8, 0.2], [0.8, 0.98]]), C.grey, { width: lw(W, H), seed: 2 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) sketchPoly(ctx, P(n, [[0.28 + c * 0.17, 0.28 + r * 0.17], [0.38 + c * 0.17, 0.28 + r * 0.17], [0.38 + c * 0.17, 0.38 + r * 0.17], [0.28 + c * 0.17, 0.38 + r * 0.17]]), C.cream, { width: 2, passes: 1, seed: r * 3 + c });
  sketchPoly(ctx, P(n, [[0.44, 0.98], [0.44, 0.84], [0.56, 0.84], [0.56, 0.98]]), C.brown, { width: 2, passes: 1 });
}

// ---------- scene 3: 副業とベーグル ----------
export function robot(ctx, W, H) {
  const n = N(W, H);
  sketchStroke(ctx, [[n.x(0.5), n.y(0.22)], [n.x(0.5), n.y(0.1)]], { width: 3, passes: 1 });
  sketchCircle(ctx, n.x(0.5), n.y(0.08), n.s(0.04), C.red, { width: 2, passes: 1 });
  sketchPoly(ctx, roundedRectPts(n.x(0.25), n.y(0.22), n.x(0.5), n.y(0.4), n.s(0.06)), C.blue, { width: lw(W, H), seed: 3 });
  sketchCircle(ctx, n.x(0.4), n.y(0.4), n.s(0.05), C.white, { width: 2, seed: 4, passes: 1 });
  sketchCircle(ctx, n.x(0.6), n.y(0.4), n.s(0.05), C.white, { width: 2, seed: 5, passes: 1 });
  sketchStroke(ctx, [[n.x(0.4), n.y(0.52)], [n.x(0.6), n.y(0.52)]], { width: 3, passes: 1 });
  sketchPoly(ctx, roundedRectPts(n.x(0.3), n.y(0.64), n.x(0.4), n.y(0.3), n.s(0.05)), C.grey, { width: lw(W, H), seed: 6 });
  drawText(ctx, ["AI"], { x: n.x(0.5), y: n.y(0.7), size: n.s(0.16), font: FONT_EN, align: "center", weight: "bold" });
  sketchStroke(ctx, [[n.x(0.3), n.y(0.72)], [n.x(0.15), n.y(0.85)]], { width: lw(W, H), seed: 7 });
  sketchStroke(ctx, [[n.x(0.7), n.y(0.72)], [n.x(0.85), n.y(0.85)]], { width: lw(W, H), seed: 8 });
}

export function bagel(ctx, W, H) {
  const n = N(W, H);
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.45), C.wood, { width: lw(W, H), wobble: 4, seed: 11 });
  // shading crust
  ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = C.brown;
  ctx.beginPath(); ctx.arc(n.x(0.5), n.y(0.5), n.s(0.45), Math.PI * 0.1, Math.PI * 0.9); ctx.arc(n.x(0.5), n.y(0.5), n.s(0.3), Math.PI * 0.9, Math.PI * 0.1, true); ctx.fill(); ctx.restore();
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.16), "rgba(0,0,0,0)", { width: lw(W, H), wobble: 3, seed: 12 });
  // sesame
  const rand = rng(31);
  for (let i = 0; i < 14; i++) {
    const a = rand() * Math.PI * 2, r = n.s(0.22 + rand() * 0.18);
    sketchPoly(ctx, ellipsePts(n.x(0.5) + Math.cos(a) * r, n.y(0.5) + Math.sin(a) * r, n.s(0.02), n.s(0.012), 8), C.cream, { width: 1.5, passes: 1, seed: i });
  }
}

export function oven(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.1), n.y(0.15), n.x(0.8), n.y(0.75), n.s(0.05)), C.grey, { width: lw(W, H), seed: 2 });
  sketchPoly(ctx, roundedRectPts(n.x(0.2), n.y(0.38), n.x(0.6), n.y(0.4), n.s(0.03)), C.dark, { width: 3, seed: 3 });
  sketchPoly(ctx, roundedRectPts(n.x(0.26), n.y(0.45), n.x(0.48), n.y(0.26), n.s(0.03)), C.orange, { width: 2, passes: 1, seed: 4 });
  for (let i = 0; i < 3; i++) sketchCircle(ctx, n.x(0.3 + i * 0.2), n.y(0.26), n.s(0.035), C.white, { width: 2, passes: 1, seed: i });
}

export function instagram(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.12), n.y(0.12), n.x(0.76), n.y(0.76), n.s(0.18)), C.pink, { width: lw(W, H), seed: 2 });
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.18), "rgba(0,0,0,0)", { width: lw(W, H), seed: 3 });
  sketchCircle(ctx, n.x(0.72), n.y(0.28), n.s(0.04), C.ink, { width: 2, passes: 1 });
}

// ---------- scene 4: プライベート ----------
export function enoden(ctx, W, H) {
  const n = N(W, H);
  // body two-tone: cream top, green bottom (Enoden livery)
  const body = roundedRectPts(n.x(0.04), n.y(0.22), n.x(0.92), n.y(0.6), n.s(0.06));
  sketchPoly(ctx, body, C.cream, { width: lw(W, H), seed: 2 });
  ctx.save(); ctx.beginPath(); ctx.rect(n.x(0.04), n.y(0.55), n.x(0.92), n.y(0.28)); ctx.clip();
  fillPoly(ctx, body, "#4f8f5a"); ctx.restore();
  sketchStroke(ctx, [[n.x(0.05), n.y(0.55)], [n.x(0.95), n.y(0.55)]], { width: 3, passes: 1 });
  // windows
  for (let i = 0; i < 4; i++) sketchPoly(ctx, roundedRectPts(n.x(0.1 + i * 0.21), n.y(0.3), n.x(0.15), n.y(0.18), n.s(0.02)), C.blue, { width: 3, seed: i + 5 });
  // doors lines
  sketchStroke(ctx, [[n.x(0.3), n.y(0.24)], [n.x(0.3), n.y(0.8)]], { width: 2, passes: 1 });
  sketchStroke(ctx, [[n.x(0.72), n.y(0.24)], [n.x(0.72), n.y(0.8)]], { width: 2, passes: 1 });
  // roof + pantograph
  sketchPoly(ctx, P(n, [[0.08, 0.22], [0.92, 0.22], [0.86, 0.14], [0.14, 0.14]]), C.grey, { width: 3, seed: 9 });
  sketchStroke(ctx, [[n.x(0.4), n.y(0.14)], [n.x(0.5), n.y(0.04)], [n.x(0.6), n.y(0.14)]], { width: 3, passes: 1 });
  // headlight + wheels
  sketchCircle(ctx, n.x(0.9), n.y(0.62), n.s(0.03), C.yellow, { width: 2, passes: 1 });
}

export function surfboard(ctx, W, H) {
  const n = N(W, H);
  const pts = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([n.x(0.5 + Math.sin(t * Math.PI) * 0.16 * (t < 0.5 ? 1 : 1.1)), n.y(0.03 + t * 0.94)]); }
  for (let i = 40; i >= 0; i--) { const t = i / 40; pts.push([n.x(0.5 - Math.sin(t * Math.PI) * 0.16 * (t < 0.5 ? 1 : 1.1)), n.y(0.03 + t * 0.94)]); }
  sketchPoly(ctx, pts, C.teal, { width: lw(W, H), seed: 5 });
  sketchStroke(ctx, [[n.x(0.5), n.y(0.12)], [n.x(0.5), n.y(0.88)]], { width: 3, color: C.white, passes: 1 });
  sketchPoly(ctx, P(n, [[0.48, 0.95], [0.5, 0.88], [0.52, 0.95]]), C.dark, { width: 2, passes: 1 });
}

export function beerAndPan(ctx, W, H) {
  const n = N(W, H);
  // pan
  sketchCircle(ctx, n.x(0.32), n.y(0.6), n.s(0.22), C.dark, { width: lw(W, H), seed: 2 });
  sketchCircle(ctx, n.x(0.32), n.y(0.6), n.s(0.16), C.orange, { width: 2, passes: 1, seed: 3 });
  sketchStroke(ctx, [[n.x(0.52), n.y(0.55)], [n.x(0.72), n.y(0.5)]], { width: lw(W, H) * 1.6, color: C.brown, seed: 4 });
  // beer
  sketchPoly(ctx, roundedRectPts(n.x(0.66), n.y(0.3), n.x(0.2), n.y(0.45), n.s(0.03)), C.yellow, { width: lw(W, H), seed: 5 });
  sketchPoly(ctx, P(n, [[0.64, 0.32], [0.62, 0.22], [0.7, 0.18], [0.78, 0.2], [0.86, 0.18], [0.9, 0.26], [0.88, 0.32]]), C.white, { width: 3, seed: 6 });
  sketchStroke(ctx, [[n.x(0.86), n.y(0.4)], [n.x(0.95), n.y(0.42)], [n.x(0.95), n.y(0.62)], [n.x(0.86), n.y(0.64)]], { width: lw(W, H), seed: 7 });
}

export function house(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, P(n, [[0.18, 0.95], [0.18, 0.5], [0.82, 0.5], [0.82, 0.95]]), C.cream, { width: lw(W, H), seed: 2 });
  sketchPoly(ctx, P(n, [[0.1, 0.52], [0.5, 0.15], [0.9, 0.52]]), C.red, { width: lw(W, H), seed: 3 });
  sketchPoly(ctx, P(n, [[0.42, 0.95], [0.42, 0.7], [0.58, 0.7], [0.58, 0.95]]), C.brown, { width: 3, seed: 4 });
  sketchPoly(ctx, P(n, [[0.24, 0.58], [0.36, 0.58], [0.36, 0.68], [0.24, 0.68]]), C.blue, { width: 3, seed: 5 });
  sketchPoly(ctx, P(n, [[0.64, 0.58], [0.76, 0.58], [0.76, 0.68], [0.64, 0.68]]), C.blue, { width: 3, seed: 6 });
}

export function kids(ctx, W, H) {
  const n = N(W, H);
  const kid = (cx, sc, shirt, seed) => {
    sketchCircle(ctx, n.x(cx), n.y(0.3), n.s(0.13 * sc), C.cream, { width: lw(W, H), seed });
    sketchPoly(ctx, P(n, [[cx - 0.1 * sc, 0.45], [cx + 0.1 * sc, 0.45], [cx + 0.12 * sc, 0.75], [cx - 0.12 * sc, 0.75]]), shirt, { width: lw(W, H), seed: seed + 1 });
    sketchStroke(ctx, [[n.x(cx - 0.05 * sc), n.y(0.75)], [n.x(cx - 0.05 * sc), n.y(0.95)]], { width: lw(W, H), seed: seed + 2 });
    sketchStroke(ctx, [[n.x(cx + 0.05 * sc), n.y(0.75)], [n.x(cx + 0.05 * sc), n.y(0.95)]], { width: lw(W, H), seed: seed + 3 });
    sketchCircle(ctx, n.x(cx - 0.04 * sc), n.y(0.28), 2.5, C.ink, { width: 1, passes: 1 });
    sketchCircle(ctx, n.x(cx + 0.04 * sc), n.y(0.28), 2.5, C.ink, { width: 1, passes: 1 });
    sketchStroke(ctx, [[n.x(cx - 0.04 * sc), n.y(0.35)], [n.x(cx), n.y(0.38)], [n.x(cx + 0.04 * sc), n.y(0.35)]], { width: 2, passes: 1 });
  };
  kid(0.32, 1, C.blue, 1);
  kid(0.68, 0.8, C.yellow, 10);
}

// ---------- scene 5: Re:CENO ----------
export function armchair(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.12), n.y(0.2), n.x(0.76), n.y(0.4), n.s(0.08)), C.teal, { width: lw(W, H), seed: 2 }); // back
  sketchPoly(ctx, roundedRectPts(n.x(0.08), n.y(0.5), n.x(0.84), n.y(0.28), n.s(0.06)), C.teal, { width: lw(W, H), seed: 3 }); // seat
  sketchPoly(ctx, roundedRectPts(n.x(0.04), n.y(0.42), n.x(0.14), n.y(0.36), n.s(0.05)), C.teal, { width: 3, seed: 4 });
  sketchPoly(ctx, roundedRectPts(n.x(0.82), n.y(0.42), n.x(0.14), n.y(0.36), n.s(0.05)), C.teal, { width: 3, seed: 5 });
  sketchStroke(ctx, [[n.x(0.18), n.y(0.78)], [n.x(0.14), n.y(0.95)]], { width: lw(W, H), color: C.brown, seed: 6 });
  sketchStroke(ctx, [[n.x(0.82), n.y(0.78)], [n.x(0.86), n.y(0.95)]], { width: lw(W, H), color: C.brown, seed: 7 });
  sketchPoly(ctx, roundedRectPts(n.x(0.3), n.y(0.28), n.x(0.4), n.y(0.24), n.s(0.05)), C.cream, { width: 3, seed: 8 }); // cushion
}

export function roomSet(ctx, W, H) {
  const n = N(W, H);
  // rug
  sketchPoly(ctx, ellipsePts(n.x(0.5), n.y(0.85), n.s(0.45), n.s(0.1), 30), C.pink, { width: 3, seed: 1 });
  // sofa
  sketchPoly(ctx, roundedRectPts(n.x(0.1), n.y(0.5), n.x(0.5), n.y(0.3), n.s(0.05)), C.blue, { width: lw(W, H), seed: 2 });
  sketchPoly(ctx, roundedRectPts(n.x(0.12), n.y(0.36), n.x(0.46), n.y(0.18), n.s(0.05)), C.blue, { width: 3, seed: 3 });
  // lamp
  sketchStroke(ctx, [[n.x(0.78), n.y(0.8)], [n.x(0.78), n.y(0.3)]], { width: lw(W, H), color: C.brown, seed: 4 });
  sketchPoly(ctx, P(n, [[0.66, 0.32], [0.9, 0.32], [0.84, 0.14], [0.72, 0.14]]), C.yellow, { width: 3, seed: 5 });
  // plant
  sketchPoly(ctx, P(n, [[0.62, 0.8], [0.7, 0.8], [0.69, 0.66], [0.63, 0.66]]), C.orange, { width: 3, seed: 6 });
  for (let i = 0; i < 3; i++) sketchPoly(ctx, ellipsePts(n.x(0.66 + (i - 1) * 0.06), n.y(0.55 - Math.abs(i - 1) * 0.02), n.s(0.035), n.s(0.08), 12), C.green, { width: 2, seed: i + 7, passes: 1 });
  // price tag
  sketchPoly(ctx, P(n, [[0.3, 0.2], [0.5, 0.2], [0.5, 0.32], [0.3, 0.32], [0.26, 0.26]]), C.cream, { width: 3, seed: 10 });
  drawText(ctx, ["¥"], { x: n.x(0.4), y: n.y(0.2), size: n.s(0.1), font: FONT_EN, align: "center" });
}

export function dashboard(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, roundedRectPts(n.x(0.05), n.y(0.1), n.x(0.9), n.y(0.7), n.s(0.04)), C.white, { width: lw(W, H), seed: 2 });
  sketchStroke(ctx, [[n.x(0.5), n.y(0.8)], [n.x(0.5), n.y(0.92)]], { width: lw(W, H), seed: 3 });
  sketchStroke(ctx, [[n.x(0.35), n.y(0.93)], [n.x(0.65), n.y(0.93)]], { width: lw(W, H), seed: 4 });
  const line = [[0.15, 0.6], [0.3, 0.5], [0.45, 0.58], [0.6, 0.38], [0.75, 0.42], [0.85, 0.25]];
  sketchStroke(ctx, P(n, line), { width: lw(W, H), color: C.red, seed: 5 });
  for (const [x, y] of line) sketchCircle(ctx, n.x(x), n.y(y), n.s(0.02), C.red, { width: 1.5, passes: 1 });
  sketchStroke(ctx, [[n.x(0.15), n.y(0.7)], [n.x(0.85), n.y(0.7)]], { width: 2, passes: 1 });
}

export function sparkle(ctx, W, H) {
  const n = N(W, H);
  const star = (cx, cy, r, c, seed) => sketchPoly(ctx, [[cx, cy - r], [cx + r * 0.25, cy - r * 0.25], [cx + r, cy], [cx + r * 0.25, cy + r * 0.25], [cx, cy + r], [cx - r * 0.25, cy + r * 0.25], [cx - r, cy], [cx - r * 0.25, cy - r * 0.25]], c, { width: 3, seed, passes: 1 });
  star(n.x(0.45), n.y(0.5), n.s(0.32), C.yellow, 1);
  star(n.x(0.8), n.y(0.25), n.s(0.14), C.orange, 2);
  star(n.x(0.78), n.y(0.78), n.s(0.1), C.orange, 3);
}

// ---------- single sheet: music ----------
export function musicNote(ctx, W, H) {
  const n = N(W, H);
  sketchPoly(ctx, ellipsePts(n.x(0.35), n.y(0.78), n.s(0.16), n.s(0.11), 20), C.dark, { width: lw(W, H), seed: 1 });
  sketchPoly(ctx, ellipsePts(n.x(0.75), n.y(0.7), n.s(0.16), n.s(0.11), 20), C.dark, { width: lw(W, H), seed: 2 });
  sketchStroke(ctx, [[n.x(0.49), n.y(0.75)], [n.x(0.49), n.y(0.2)]], { width: lw(W, H) * 1.4, seed: 3 });
  sketchStroke(ctx, [[n.x(0.89), n.y(0.67)], [n.x(0.89), n.y(0.12)]], { width: lw(W, H) * 1.4, seed: 4 });
  sketchPoly(ctx, P(n, [[0.49, 0.2], [0.89, 0.12], [0.89, 0.26], [0.49, 0.34]]), C.dark, { width: 3, seed: 5 });
}

export function headphones(ctx, W, H) {
  const n = N(W, H);
  const arc = [];
  for (let i = 0; i <= 20; i++) { const a = Math.PI + (i / 20) * Math.PI; arc.push([n.x(0.5) + Math.cos(a) * n.s(0.36), n.y(0.55) + Math.sin(a) * n.s(0.36)]); }
  sketchStroke(ctx, arc, { width: lw(W, H) * 1.6, seed: 1 });
  sketchPoly(ctx, roundedRectPts(n.x(0.08), n.y(0.5), n.x(0.18), n.y(0.3), n.s(0.05)), C.red, { width: lw(W, H), seed: 2 });
  sketchPoly(ctx, roundedRectPts(n.x(0.74), n.y(0.5), n.x(0.18), n.y(0.3), n.s(0.05)), C.red, { width: lw(W, H), seed: 3 });
}

// ---------- hero ----------
export function heroBody(ctx, W, H) {
  const n = N(W, H);
  // legs
  sketchStroke(ctx, [[n.x(0.38), n.y(0.72)], [n.x(0.3), n.y(0.95)]], { width: lw(W, H) * 2.2, color: "#4a5a7a", seed: 4 });
  sketchStroke(ctx, [[n.x(0.62), n.y(0.72)], [n.x(0.7), n.y(0.95)]], { width: lw(W, H) * 2.2, color: "#4a5a7a", seed: 5 });
  // torso (rounded hoodie)
  sketchPoly(ctx, roundedRectPts(n.x(0.26), n.y(0.08), n.x(0.48), n.y(0.68), n.s(0.14)), C.orange, { width: lw(W, H), seed: 1 });
  // hoodie pocket + string
  sketchStroke(ctx, [[n.x(0.34), n.y(0.5)], [n.x(0.66), n.y(0.5)], [n.x(0.64), n.y(0.66)], [n.x(0.36), n.y(0.66)]], { close: true, width: 2, passes: 1, color: "#b46b2c" });
  sketchStroke(ctx, [[n.x(0.46), n.y(0.12)], [n.x(0.45), n.y(0.3)]], { width: 2, passes: 1, color: "#fff" });
  sketchStroke(ctx, [[n.x(0.54), n.y(0.12)], [n.x(0.55), n.y(0.3)]], { width: 2, passes: 1, color: "#fff" });
  // arms reaching forward to the handlebar
  sketchStroke(ctx, [[n.x(0.3), n.y(0.3)], [n.x(0.1), n.y(0.55)]], { width: lw(W, H) * 2.4, color: C.orange, seed: 2 });
  sketchStroke(ctx, [[n.x(0.7), n.y(0.3)], [n.x(0.9), n.y(0.55)]], { width: lw(W, H) * 2.4, color: C.orange, seed: 3 });
  sketchCircle(ctx, n.x(0.1), n.y(0.56), n.s(0.05), C.cream, { width: 2, passes: 1 });
  sketchCircle(ctx, n.x(0.9), n.y(0.56), n.s(0.05), C.cream, { width: 2, passes: 1 });
}

export function foxHead(ctx, W, H) {
  // fallback head when no photo is provided: a simple fox face
  const n = N(W, H);
  sketchPoly(ctx, P(n, [[0.15, 0.15], [0.32, 0.45], [0.2, 0.2]]), C.orange, { width: 3, seed: 1 });
  sketchPoly(ctx, P(n, [[0.85, 0.15], [0.68, 0.45], [0.8, 0.2]]), C.orange, { width: 3, seed: 2 });
  sketchPoly(ctx, P(n, [[0.14, 0.2], [0.86, 0.2], [0.9, 0.55], [0.5, 0.92], [0.1, 0.55]]), C.orange, { width: lw(W, H), seed: 3 });
  sketchPoly(ctx, P(n, [[0.3, 0.55], [0.7, 0.55], [0.5, 0.88]]), C.white, { width: 2, passes: 1, seed: 4 });
  sketchCircle(ctx, n.x(0.36), n.y(0.48), n.s(0.035), C.ink, { width: 1, passes: 1 });
  sketchCircle(ctx, n.x(0.64), n.y(0.48), n.s(0.035), C.ink, { width: 1, passes: 1 });
  sketchCircle(ctx, n.x(0.5), n.y(0.7), n.s(0.04), C.ink, { width: 1, passes: 1 });
}

// bicycle wheel drawn alone (rotated at runtime)
export function wheel(ctx, W, H) {
  const n = N(W, H);
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.46), "rgba(0,0,0,0)", { width: lw(W, H) * 2.4, seed: 3 });
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; sketchStroke(ctx, [[n.x(0.5), n.y(0.5)], [n.x(0.5) + Math.cos(a) * n.s(0.42), n.y(0.5) + Math.sin(a) * n.s(0.42)]], { width: 3, passes: 1, seed: i }); }
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.06), C.dark, { width: 2, passes: 1 });
  // valve + reflector so the rotation is visible
  sketchPoly(ctx, roundedRectPts(n.x(0.47), n.y(0.05), n.x(0.06), n.y(0.09), 3), C.dark, { width: 1.5, passes: 1 });
  sketchCircle(ctx, n.x(0.5) + Math.cos(0.9) * n.s(0.3), n.y(0.5) + Math.sin(0.9) * n.s(0.3), n.s(0.05), C.orange, { width: 2, passes: 1 });
}

export function trainWheel(ctx, W, H) {
  const n = N(W, H);
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.45), C.dark, { width: lw(W, H) * 1.5, seed: 3 });
  sketchCircle(ctx, n.x(0.5), n.y(0.5), n.s(0.12), C.grey, { width: 2, passes: 1 });
  sketchStroke(ctx, [[n.x(0.5), n.y(0.5)], [n.x(0.5), n.y(0.12)]], { width: 4, passes: 1, color: C.grey });
}

// bicycle frame without wheels
export function bicycleFrame(ctx, W, H) {
  const n = N(W, H);
  sketchStroke(ctx, P(n, [[0.22, 0.72], [0.45, 0.4], [0.78, 0.72]]), { width: lw(W, H), color: C.deep, seed: 1 });
  sketchStroke(ctx, P(n, [[0.45, 0.4], [0.5, 0.72], [0.22, 0.72]]), { width: lw(W, H), color: C.deep, seed: 2 });
  sketchStroke(ctx, P(n, [[0.5, 0.72], [0.68, 0.38], [0.78, 0.72]]), { width: lw(W, H), color: C.deep, seed: 3 });
  sketchStroke(ctx, P(n, [[0.4, 0.34], [0.45, 0.4]]), { width: lw(W, H), color: C.ink, seed: 4 }); // seat post
  sketchPoly(ctx, P(n, [[0.32, 0.32], [0.48, 0.32], [0.46, 0.37], [0.34, 0.37]]), C.dark, { width: 3, seed: 5 });
  sketchStroke(ctx, P(n, [[0.68, 0.38], [0.72, 0.28], [0.8, 0.26]]), { width: lw(W, H), color: C.ink, seed: 6 }); // handlebar
  sketchPoly(ctx, roundedRectPts(n.x(0.8), n.y(0.3), n.x(0.14), n.y(0.12), 6), C.cream, { width: 3, seed: 7 }); // basket
}

// wheel geometry of the bicycle sprite (fractions of the 1.7 x 1.2 sprite)
export const BICYCLE_WHEELS = [
  { x: 0.22, y: 0.72, r: 0.24 },
  { x: 0.78, y: 0.72, r: 0.24 },
];
export const ENODEN_WHEELS = [0.22, 0.42, 0.62, 0.8].map((x) => ({ x, y: 0.86, r: 0.08 }));
