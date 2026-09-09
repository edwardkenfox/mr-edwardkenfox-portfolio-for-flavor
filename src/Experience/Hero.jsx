import React, { useMemo, useRef, useState, useEffect } from "react";
import { assetUrl } from "../assetUrl";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PaperSprite } from "./paper/PaperSprite";
import * as S from "./paper/sketches";
import { makeCanvas, makeTexture, sketchCircle } from "./paper/canvasUtils";
import { HERO_Y, HERO_Z, VEHICLE_THRESHOLDS } from "./curve";
import { DEBUG } from "./debug";

function heroDebug(text) {
  let d = document.getElementById("dbg2");
  if (!d) { d = document.createElement("div"); d.id = "dbg2"; d.style.cssText = "position:fixed;left:8px;bottom:48px;font:14px monospace;color:#900;background:#fffc;padding:4px;z-index:200;pointer-events:none"; document.body.appendChild(d); }
  d.textContent = text;
}

// wheels: positions as fractions of the sprite (x from left, y from top, r relative to min(w,h))
const bikeWheels = (paint) => S.BICYCLE_WHEELS.map((w) => ({ ...w, paint }));
const VEHICLES = {
  bicycle: { paint: S.bicycleFrame, w: 1.7, h: 1.2, seatY: 0.62, headY: 1.62, wheels: bikeWheels(S.wheel) },
  rocket: { paint: S.rocket, w: 1.1, h: 1.9, seatY: 0.95, headY: 1.9 * (1 - 0.45) + 0.05, hideBody: true, headScale: 0.34, headZ: 0.13 },
  bagelCycle: { paint: S.bicycleFrame, w: 1.7, h: 1.2, seatY: 0.62, headY: 1.62, wheels: bikeWheels(S.bagel) },
  enoden: { paint: S.enoden, w: 2.6, h: 1.3, seatY: 1.25, headY: 2.15, wheels: S.ENODEN_WHEELS.map((w) => ({ ...w, paint: S.trainWheel })) },
  armchair: { paint: S.armchair, w: 1.5, h: 1.3, seatY: 0.6, headY: 1.55 },
};

// world-space wheel placement for a vehicle sprite of size w x h sitting on y=0
function wheelPlacement(v, wh) {
  const r = wh.r * Math.min(v.w, v.h);
  return { x: (wh.x - 0.5) * v.w, y: (1 - wh.y) * v.h, r };
}

// circular photo head with white paper rim; falls back to a doodled fox
function useHeadTexture(src) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!src) return;
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => setImg(im); im.onerror = () => setImg(null); im.src = assetUrl(src);
  }, [src]);
  return useMemo(() => {
    const px = 512;
    const c = makeCanvas(px, px);
    const ctx = c.getContext("2d");
    if (img) {
      sketchCircle(ctx, px / 2, px / 2, px * 0.47, "#fbfaf6", { width: 6, wobble: 4, seed: 2 });
      ctx.save();
      ctx.beginPath(); ctx.arc(px / 2, px / 2, px * 0.41, 0, Math.PI * 2); ctx.clip();
      const s = Math.max(px / img.width, px / img.height) * 0.86;
      ctx.drawImage(img, px / 2 - (img.width * s) / 2, px / 2 - (img.height * s) / 2, img.width * s, img.height * s);
      ctx.restore();
    } else {
      S.foxHead(ctx, px, px);
    }
    return makeTexture(c);
  }, [img]);
}

export function Hero({ scrollProgress, cameraGroup, photo, transitionActive }) {
  const group = useRef();
  const head = useHeadTexture(photo);
  const current = useRef("bicycle");
  const vehicleRefs = useRef({});
  const wheelRefs = useRef({});
  const wheelAngle = useRef(0);
  const lastX = useRef(null);
  const bob = useRef(0);

  useFrame((state, delta) => {
    try {
      if (!group.current) return;
      const p = scrollProgress.current;
      const camX = cameraGroup.current ? cameraGroup.current.position.x : state.camera.position.x;
      // hero rides slightly left of the camera centre (less offset on narrow / portrait screens)
      const aspect = state.size.width / Math.max(1, state.size.height);
      const tx = camX - Math.min(1.3, 0.75 * aspect);
      const k = 1 - Math.pow(0.88, Math.min(delta, 0.5) * 60);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, k);
      // wheels roll with the distance travelled (forward or backward)
      const gx = group.current.position.x;
      if (lastX.current !== null) {
        const dx = gx - lastX.current;
        if (Math.abs(dx) < 5) wheelAngle.current -= dx; // radians * r ; divided per wheel below
      }
      lastX.current = gx;
      for (const wr of Object.values(wheelRefs.current)) if (wr && wr.obj) wr.obj.rotation.z = wheelAngle.current / wr.r;
      bob.current += delta;
      const t = bob.current;
      group.current.position.y = HERO_Y + Math.sin(t * 2.2) * 0.03;
      group.current.rotation.z = Math.sin(t * 1.7) * 0.02;

      // vehicle selection by progress
      let name = VEHICLE_THRESHOLDS[0].name;
      if (transitionActive && transitionActive.current) {
        // while looping around, keep the last vehicle until halfway through the blank page
        name = p < 0.55 ? VEHICLE_THRESHOLDS.at(-1).name : VEHICLE_THRESHOLDS[0].name;
      } else {
        for (let i = VEHICLE_THRESHOLDS.length - 1; i >= 0; i--) if (p >= VEHICLE_THRESHOLDS[i].threshold) { name = VEHICLE_THRESHOLDS[i].name; break; }
      }
      current.current = name;
      for (const k of Object.keys(VEHICLES)) {
        const g = vehicleRefs.current[k];
        if (!g) continue;
        const target = k === name ? 1 : 0;
        g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 1 - Math.pow(0.85, Math.min(delta, 0.5) * 60)));
        g.visible = g.scale.x > 0.02;
      }
      if (DEBUG) heroDebug(`hero x=${group.current.position.x.toFixed(2)} y=${group.current.position.y.toFixed(2)} z=${group.current.position.z.toFixed(2)} tx=${tx.toFixed(2)} delta=${delta.toFixed(3)} k=${k.toFixed(2)} v=${name} vis=${Object.keys(VEHICLES).map((n) => vehicleRefs.current[n] ? +vehicleRefs.current[n].scale.x.toFixed(2) : "-").join(",")}`);
    } catch (e) {
      heroDebug("HERO ERR: " + e.message + " " + (e.stack || "").split("\n")[1]);
    }
  });

  return (
    <group ref={group} position={[0, HERO_Y, HERO_Z]}>
      {Object.entries(VEHICLES).map(([k, v]) => (
        <group key={k} ref={(el) => (vehicleRefs.current[k] = el)} scale={k === "bicycle" ? 1 : 0}>
          <PaperSprite paint={v.paint} w={v.w} h={v.h} position={[0, v.h / 2, 0]} />
          {v.wheels && v.wheels.map((wh, i) => {
            const pl = wheelPlacement(v, wh);
            return (
              <group key={i} position={[pl.x, pl.y, 0.02]} ref={(el) => { wheelRefs.current[k + i] = el ? { obj: el, r: pl.r } : null; }}>
                <PaperSprite paint={wh.paint} w={pl.r * 2.1} h={pl.r * 2.1} thickness={false} />
              </group>
            );
          })}
          {/* rider */}
          {!v.hideBody && <PaperSprite paint={S.heroBody} w={0.7} h={0.7} position={[0.02, v.seatY + 0.3, 0.06]} thickness={false} />}
          <mesh position={[0, v.headY + 0.02, v.headZ ?? 0.12]} scale={v.headScale ?? 1}>
            <planeGeometry args={[0.86, 0.86]} />
            <meshBasicMaterial map={head} transparent alphaTest={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
