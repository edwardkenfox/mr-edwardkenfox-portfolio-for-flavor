import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import normalizeWheel from "normalize-wheel";
import Scene from "./Scene";
import { debugState } from "./debug";

const Experience = () => {
  const camera = useRef();
  const cameraGroup = useRef();
  const scrollProgress = useRef(0);
  const targetScrollProgress = useRef(0);
  const baseScrollSpeed = 0.0075;
  const scrollSpeedMultiplier = useRef(1);
  const lerpFactor = 0.1;
  const dragging = useRef(false);
  const lastY = useRef(null);
  const mousePositionOffset = useRef(new THREE.Vector3());
  const mouseRotationOffset = useRef(new THREE.Euler());

  useEffect(() => {
    const onWheel = (e) => {
      const n = normalizeWheel(e);
      debugState.wheel++; debugState.lastDeltaY = Math.round(n.pixelY);
      targetScrollProgress.current += Math.sign(n.pixelY) * baseScrollSpeed * scrollSpeedMultiplier.current * Math.min(Math.abs(n.pixelY) / 100, 1);
    };
    const onMove = (e) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = (e.clientY / window.innerHeight) * 2 - 1;
      mousePositionOffset.current.set(mx * 0.05, my * 0.05, 0);
      mouseRotationOffset.current.set(my * 0.04, mx * 0.04, 0);
      if (dragging.current && lastY.current !== null) {
        const dy = e.clientY - lastY.current;
        targetScrollProgress.current += Math.sign(dy) * baseScrollSpeed * 0.25 * scrollSpeedMultiplier.current * Math.min(Math.abs(dy) / 10, 1);
      }
      lastY.current = e.clientY;
    };
    const onDown = () => { dragging.current = true; };
    const onUp = () => { dragging.current = false; };
    const onTouchStart = (e) => { dragging.current = true; lastY.current = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (!dragging.current || lastY.current === null) return;
      const dy = e.touches[0].clientY - lastY.current;
      targetScrollProgress.current += Math.sign(dy) * baseScrollSpeed * 0.35 * scrollSpeedMultiplier.current * Math.min(Math.abs(dy) / 8, 1);
      lastY.current = e.touches[0].clientY;
    };
    const onTouchEnd = () => { dragging.current = false; lastY.current = null; };
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") targetScrollProgress.current += 0.03 * scrollSpeedMultiplier.current;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") targetScrollProgress.current -= 0.03 * scrollSpeedMultiplier.current;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Canvas flat dpr={[1, 2]} gl={{ antialias: true }} style={{ width: "100vw", height: "100vh" }}>
      <color attach="background" args={["#f4f1ea"]} />
      <Scene
        cameraGroup={cameraGroup}
        camera={camera}
        scrollProgress={scrollProgress}
        targetScrollProgress={targetScrollProgress}
        lerpFactor={lerpFactor}
        mousePositionOffset={mousePositionOffset}
        mouseRotationOffset={mouseRotationOffset}
        scrollSpeedMultiplier={scrollSpeedMultiplier}
      />
      <group ref={cameraGroup} position={[1, 1.5, 8.6]}>
        <PerspectiveCamera ref={camera} makeDefault fov={35} near={0.1} far={200} />
      </group>
    </Canvas>
  );
};

export default Experience;
