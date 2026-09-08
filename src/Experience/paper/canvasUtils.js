import * as THREE from "three";

export const FONT_JP = '"Zen Kurenaido", "Yomogi", sans-serif';
export const FONT_TITLE = '"Yomogi", "Zen Kurenaido", sans-serif';
export const FONT_EN = '"Patrick Hand", "Yomogi", sans-serif';

export const INK = "#3a3530";
export const PAPER = "#f6f3ec";

// deterministic pseudo random so textures are stable across re-renders
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function makeTexture(canvas, { repeat } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

// ---- sketchy drawing helpers -------------------------------------------

export function wobblePoints(pts, amp, rand) {
  return pts.map(([x, y]) => [x + (rand() - 0.5) * amp, y + (rand() - 0.5) * amp]);
}

// stroke a polyline twice with slight jitter -> hand drawn feel
export function sketchStroke(ctx, pts, { close = false, width = 4, color = INK, wobble = 2, seed = 1, passes = 2 } = {}) {
  const rand = rng(seed);
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  for (let p = 0; p < passes; p++) {
    const w = wobblePoints(pts, wobble, rand);
    ctx.lineWidth = width * (p === 0 ? 1 : 0.6);
    ctx.globalAlpha = p === 0 ? 1 : 0.55;
    ctx.beginPath();
    ctx.moveTo(w[0][0], w[0][1]);
    for (let i = 1; i < w.length; i++) ctx.lineTo(w[i][0], w[i][1]);
    if (close) ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

export function fillPoly(ctx, pts, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// filled + sketched polygon
export function sketchPoly(ctx, pts, fill, opts = {}) {
  if (fill) fillPoly(ctx, pts, fill);
  sketchStroke(ctx, pts, { close: true, ...opts });
}

export function circlePts(cx, cy, r, n = 40, start = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = start + (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

export function ellipsePts(cx, cy, rx, ry, n = 48) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
}

export function roundedRectPts(x, y, w, h, r, seg = 6) {
  const pts = [];
  const corner = (cx, cy, a0) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  corner(x + w - r, y + r, -Math.PI / 2);
  corner(x + w - r, y + h - r, 0);
  corner(x + r, y + h - r, Math.PI / 2);
  corner(x + r, y + r, Math.PI);
  return pts;
}

export function sketchCircle(ctx, cx, cy, r, fill, opts = {}) {
  sketchPoly(ctx, circlePts(cx, cy, r), fill, opts);
}

export function sketchLine(ctx, x1, y1, x2, y2, opts = {}) {
  sketchStroke(ctx, [[x1, y1], [x2, y2]], opts);
}

// paper fill with subtle fibre noise
export function paperFill(ctx, w, h, color = PAPER, seed = 7) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  const rand = rng(seed);
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < (w * h) / 900; i++) {
    ctx.fillStyle = rand() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(rand() * w, rand() * h, 2, 2);
  }
  ctx.restore();
}

// draw a "paper texture" fill on an arbitrary path: caller sets clip
export function notebookLines(ctx, w, h, { spacing = 48, offset = 0, marginX = null, lineColor = "#9db7d6", marginColor = "#e08a8a" } = {}) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  for (let y = offset; y < h; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  if (marginX !== null) {
    ctx.strokeStyle = marginColor;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(marginX, 0);
    ctx.lineTo(marginX, h);
    ctx.stroke();
  }
  ctx.restore();
}

// ---- text ---------------------------------------------------------------

// wrap by characters (works for Japanese) with simple ascii word awareness
export function wrapLine(ctx, text, maxWidth) {
  const out = [];
  let cur = "";
  const tokens = text.split(/(\s+|(?<=[^\x00-\x7F])|(?=[^\x00-\x7F]))/).filter((t) => t !== "");
  for (const tk of tokens) {
    const test = cur + tk;
    if (ctx.measureText(test).width > maxWidth && cur !== "") {
      out.push(cur.trimEnd());
      cur = tk.trimStart();
    } else {
      cur = test;
    }
  }
  if (cur) out.push(cur.trimEnd());
  return out;
}

export function drawText(ctx, lines, { x, y, size = 40, font = FONT_JP, color = INK, lineHeight = 1.45, align = "left", maxWidth = Infinity, weight = "" } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`.trim();
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  let cy = y;
  const all = [];
  for (const l of lines) all.push(...(maxWidth === Infinity ? [l] : wrapLine(ctx, l, maxWidth)));
  for (const l of all) {
    ctx.fillText(l, x, cy);
    cy += size * lineHeight;
  }
  ctx.restore();
  return cy - y; // height consumed
}

export function measureTextBlock(ctx, lines, { size = 40, font = FONT_JP, lineHeight = 1.45, maxWidth = Infinity, weight = "" } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`.trim();
  let n = 0;
  let w = 0;
  for (const l of lines) {
    const ls = maxWidth === Infinity ? [l] : wrapLine(ctx, l, maxWidth);
    n += ls.length;
    for (const s of ls) w = Math.max(w, ctx.measureText(s).width);
  }
  ctx.restore();
  return { height: n * size * lineHeight, width: w };
}
