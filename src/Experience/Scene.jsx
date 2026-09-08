import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { cameraCurve, initialCameraPoints, SHIFT_X_AMOUNT, rotationTargets, WORLD_W, SHEET_GAP } from "./curve";
import { useScrollCurve } from "./hooks/useScrollCurve";
import { Environment } from "./paper/Environment";
import { Hero } from "./Hero";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import Scene3 from "./scenes/Scene3";
import Scene4 from "./scenes/Scene4";
import Scene5 from "./scenes/Scene5";
import SingleSheet from "./scenes/SingleSheet";
import content from "../content.json";
import { debugState, debugOverlay, DEBUG } from "./debug";

// During the transition curve (end of scene 5 -> start of scene 1 of the next loop)
// the world is moved forward once the camera has passed the last props of scene 5
// and before the first props of scene 1 come into view.
const WORLD_SWAP_T = 0.2;
const SHEET_FORWARD_TRIGGER = 0.5;
const SHEET_BACK_TRIGGER = 0.35;

const Scene = ({ cameraGroup, camera, scrollProgress, targetScrollProgress, lerpFactor, mousePositionOffset, mouseRotationOffset, scrollSpeedMultiplier }) => {
  const cam = useScrollCurve(cameraCurve, initialCameraPoints, SHIFT_X_AMOUNT);
  const worldRef = useRef();
  const sheetRef = useRef();
  const [rotQ] = useState(() => new THREE.Quaternion().setFromEuler(rotationTargets[0].rotation));

  const setLoop = (ref, k) => { if (ref.current) ref.current.position.x = SHIFT_X_AMOUNT * k; };

  const lerpedRotation = (p) => {
    const q = new THREE.Quaternion();
    if (cam.transitionCurveActive.current) {
      q.slerpQuaternions(new THREE.Quaternion().setFromEuler(rotationTargets.at(-1).rotation), new THREE.Quaternion().setFromEuler(rotationTargets[0].rotation), p);
      return q;
    }
    for (let i = 0; i < rotationTargets.length - 1; i++) {
      const a = rotationTargets[i], b = rotationTargets[i + 1];
      if (p >= a.progress && p <= b.progress) {
        q.slerpQuaternions(new THREE.Quaternion().setFromEuler(a.rotation), new THREE.Quaternion().setFromEuler(b.rotation), (p - a.progress) / (b.progress - a.progress));
        return q;
      }
    }
    return q.setFromEuler(rotationTargets.at(-1).rotation);
  };

  useFrame((state, delta) => {
    if (DEBUG) {
      debugState.frameStart = performance.now();
      debugState.frames++;
      const now = performance.now();
      if (now - debugState.fpsAt > 500) { debugState.fps = Math.round((debugState.frames * 1000) / (now - debugState.fpsAt)); debugState.frames = 0; debugState.fpsAt = now; const inf = state.gl.info; debugOverlay(`p=${scrollProgress.current.toFixed(3)} target=${targetScrollProgress.current.toFixed(3)} cam=${cameraGroup.current.position.x.toFixed(1)} fps=${debugState.fps} wheel=${debugState.wheel} dy=${debugState.lastDeltaY}\ncalls=${inf.render.calls} tris=${inf.render.triangles} tex=${inf.memory.textures} geo=${inf.memory.geometries} prog=${inf.programs ? inf.programs.length : '?'}`); }
    }
    // frame-rate independent smoothing (same feel at 60fps, converges at low fps too)
    const k = 1 - Math.pow(1 - lerpFactor, Math.min(delta, 0.5) * 60);
    const k5 = 1 - Math.pow(0.95, Math.min(delta, 0.5) * 60);
    let p = THREE.MathUtils.lerp(scrollProgress.current, targetScrollProgress.current, k);
    if (p >= 1) {
      if (cam.transitionCurveActive.current) { cam.transitionCurveActive.current = false; cam.shiftCurvePoints("forward"); cam.loopCounter.current++; }
      else { cam.transitionCurveActive.current = true; cam.initiateTransitionCurve(); }
      scrollProgress.current -= 1; targetScrollProgress.current -= 1; p -= 1;
    } else if (p < 0) {
      if (cam.transitionCurveActive.current) { cam.transitionCurveActive.current = false; cam.shiftCurvePoints("backward"); }
      else { cam.loopCounter.current--; cam.transitionCurveActive.current = true; cam.initiateTransitionCurve(); }
      scrollProgress.current += 1; targetScrollProgress.current += 1; p += 1;
    }
    scrollProgress.current = p;
    scrollSpeedMultiplier.current = cam.transitionCurveActive.current ? (p <= 0.95 ? 5 : 1) : 1;

    const n = cam.loopCounter.current;
    if (cam.transitionCurveActive.current) {
      setLoop(worldRef, p >= WORLD_SWAP_T ? n : n - 1);
      setLoop(sheetRef, n);
    } else {
      setLoop(worldRef, n - 1);
      if (p >= SHEET_FORWARD_TRIGGER) setLoop(sheetRef, n);
      else if (p <= SHEET_BACK_TRIGGER) setLoop(sheetRef, n - 1);
    }

    const base = cam.getCurrentPoint(p);
    const g = cameraGroup.current;
    g.position.x = THREE.MathUtils.lerp(g.position.x, base.x, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, base.y, k);
    g.position.z = THREE.MathUtils.lerp(g.position.z, base.z, k);
    camera.current.position.x = THREE.MathUtils.lerp(camera.current.position.x, mousePositionOffset.current.x, k);
    camera.current.position.y = THREE.MathUtils.lerp(camera.current.position.y, -mousePositionOffset.current.y, k);
    rotQ.slerp(lerpedRotation(p), k5);
    g.quaternion.copy(rotQ);
    camera.current.rotation.x = THREE.MathUtils.lerp(camera.current.rotation.x, -mouseRotationOffset.current.x, k);
    camera.current.rotation.y = THREE.MathUtils.lerp(camera.current.rotation.y, -mouseRotationOffset.current.y, k);
  });

  return (
    <Suspense fallback={null}>
      <group ref={worldRef}>
        <Environment width={WORLD_W} floorBands={[
          { x: 24, w: 16, color: "#cfe3f0" },   // scene 2: sky-blue floor (rocket pad)
          { x: 56, w: 16, color: "#e8dcc4" },   // scene 4: sandy beach
          { x: 72, w: 16, color: "#efe5d8" },   // scene 5: wooden floor
        ]} />
        <Scene1 x0={0} data={content.scene1} />
        <Scene2 x0={16} data={content.scene2} />
        <Scene3 x0={32} data={content.scene3} />
        <Scene4 x0={48} data={content.scene4} />
        <Scene5 x0={64} data={content.scene5} />
      </group>
      <group ref={sheetRef}>
        {/* starts in the gap before scene 1; shifted forward by one world width mid-scroll so it sits in the gap after scene 5 */}
        <SingleSheet x0={-SHEET_GAP} data={content.singleSheet} scrollProgress={scrollProgress} />
      </group>
      <Hero scrollProgress={scrollProgress} cameraGroup={cameraGroup} photo={content.hero.photo} transitionActive={cam.transitionCurveActive} />
    </Suspense>
  );
};

export default Scene;
