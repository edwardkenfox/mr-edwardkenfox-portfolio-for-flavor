import React, { useMemo } from "react";
import { PaperPhoto } from "./PaperPhoto";
import { PaperSprite } from "./PaperSprite";
import { sketchPoly, roundedRectPts, sketchStroke } from "./canvasUtils";

// wooden clothespin, drawn on a transparent canvas
function clothespin(ctx, W, H) {
  sketchPoly(ctx, roundedRectPts(W * 0.15, H * 0.05, W * 0.7, H * 0.9, W * 0.12), "#d9a06b", { width: 3, seed: 3 });
  sketchStroke(ctx, [[W * 0.5, H * 0.1], [W * 0.5, H * 0.55]], { width: 2, passes: 1, color: "#8a5a3c" });
  sketchStroke(ctx, [[W * 0.2, H * 0.42], [W * 0.8, H * 0.42]], { width: 4, passes: 1, color: "#6f6555" });
}

/**
 * A string stretched between two points with small polaroids pinned to it.
 * photos: [{ src, caption }]
 */
export function PhotoLine({ x0, x1, y, z = -0.4, photos = [], photoW = 1.15, photoH = 1.3 }) {
  const n = photos.length;
  const xs = useMemo(() => photos.map((_, i) => x0 + ((i + 1) / (n + 1)) * (x1 - x0)), [x0, x1, n]);
  return (
    <group>
      {/* the string */}
      <mesh position={[(x0 + x1) / 2, y, z]}>
        <boxGeometry args={[x1 - x0, 0.025, 0.025]} />
        <meshBasicMaterial color="#6f6555" />
      </mesh>
      {[x0, x1].map((x, i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial color="#8a5a3c" />
        </mesh>
      ))}
      {photos.map((p, i) => (
        <group key={i}>
          <PaperPhoto src={p.src} label={p.caption} caption={p.caption} w={photoW} h={photoH} tilt={(i % 2 ? 1 : -1) * 0.05} position={[xs[i], y - photoH / 2 + 0.02, z]} hoverLift={0.35} />
          <PaperSprite paint={clothespin} w={0.14} h={0.34} position={[xs[i], y + 0.02, z + 0.08]} thickness={false} />
        </group>
      ))}
    </group>
  );
}
