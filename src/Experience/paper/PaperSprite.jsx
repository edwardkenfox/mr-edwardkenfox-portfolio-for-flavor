import React, { useMemo, useRef, forwardRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { makeCanvas, makeTexture } from "./canvasUtils";

const PX = 200;

/**
 * Flat paper cutout. `paint(ctx, W, H)` draws onto a transparent canvas.
 * A darker copy is placed just behind to fake paper thickness / shadow.
 * `sway` adds a gentle idle sway (rotation z) like paper on a stick.
 */
export const PaperSprite = forwardRef(function PaperSprite(
  { paint, w = 1, h = 1, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, thickness = true, sway = 0, swaySpeed = 1, seedOffset = 0, side = THREE.DoubleSide, children, ...rest },
  ref
) {
  const tex = useMemo(() => {
    const c = makeCanvas(Math.round(w * PX), Math.round(h * PX));
    const ctx = c.getContext("2d");
    paint(ctx, c.width, c.height);
    return makeTexture(c);
  }, [paint, w, h]);

  const local = useRef();
  const group = ref || local;
  useFrame((s) => {
    if (!sway || !group.current) return;
    const t = s.clock.elapsedTime * swaySpeed + seedOffset;
    group.current.rotation.z = rotation[2] + Math.sin(t) * sway;
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} {...rest}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.5} side={side} />
      </mesh>
      {thickness && (
        <mesh position={[0.02, -0.03, -0.05]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.5} color="#6f6555" side={side} />
        </mesh>
      )}
      {children}
    </group>
  );
});

/** thin wooden stick that holds paper puppets (like the original) */
export function Stick({ x = 0, top = 0, bottom = -3, z = -0.02, color = "#b8845a", width = 0.035 }) {
  const h = top - bottom;
  return (
    <mesh position={[x, bottom + h / 2, z]}>
      <boxGeometry args={[width, h, width]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
