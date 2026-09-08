import React, { useEffect, useMemo, useState } from "react";
import { PaperCard, PX } from "./PaperCard";
import { paperFill, sketchStroke, roundedRectPts, drawText, FONT_TITLE, FONT_JP, rng } from "./canvasUtils";

// loads an image; resolves to null on failure so we can draw a placeholder
function useImage(src) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!src) { setImg(null); return; }
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => setImg(im);
    im.onerror = () => setImg(null);
    im.src = src;
  }, [src]);
  return img;
}

/**
 * Polaroid-style photo on paper. `src` may be null -> placeholder with label.
 * `fit`: "cover" crops to the frame.
 */
export function PaperPhoto({ src, label = "写真", caption, w = 2.2, h = 2.4, tilt = -0.04, ...rest }) {
  const img = useImage(src);
  const paint = useMemo(() => (ctx, W, H) => {
    paperFill(ctx, W, H, "#fbfaf7", 13);
    const m = 0.09 * PX;
    const fw = W - m * 2, fh = H - m * 2 - 0.34 * PX;
    ctx.save();
    ctx.beginPath(); ctx.rect(m, m, fw, fh); ctx.clip();
    if (img) {
      const s = Math.max(fw / img.width, fh / img.height);
      const dw = img.width * s, dh = img.height * s;
      ctx.drawImage(img, m + (fw - dw) / 2, m + (fh - dh) / 2, dw, dh);
    } else {
      ctx.fillStyle = "#d8dee3"; ctx.fillRect(m, m, fw, fh);
      const rand = rng(3);
      ctx.strokeStyle = "#b7c0c8"; ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(m + rand() * fw, m + rand() * fh); ctx.lineTo(m + rand() * fw, m + rand() * fh); ctx.stroke(); }
      drawText(ctx, [label, "(あとで差し替え)"], { x: W / 2, y: m + fh / 2 - 0.16 * PX, size: 0.12 * PX, font: FONT_JP, color: "#6b7680", align: "center" });
    }
    ctx.restore();
    sketchStroke(ctx, roundedRectPts(m, m, fw, fh, 4), { close: true, width: 3, wobble: 2, seed: 2, passes: 1 });
    if (caption) drawText(ctx, [caption], { x: W / 2, y: m + fh + 0.08 * PX, size: 0.15 * PX, font: FONT_TITLE, align: "center" });
    // tape on top
    ctx.save(); ctx.globalAlpha = 0.75; ctx.fillStyle = "#e9dca0";
    ctx.translate(W / 2, m * 0.5); ctx.rotate(-0.08); ctx.fillRect(-0.35 * PX, -0.05 * PX, 0.7 * PX, 0.1 * PX); ctx.restore();
  }, [img, label, caption]);
  return <PaperCard w={w} h={h} paint={paint} radius={0.02} rotation={[0, 0, tilt]} {...rest} />;
}
