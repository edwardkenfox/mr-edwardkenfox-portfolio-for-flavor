import { useRef } from "react";
import * as THREE from "three";

// Same mechanism as the original: the curve is shifted along X each loop,
// and a 2-point "transition curve" bridges the last point to the next first point.
export const useScrollCurve = (initialCurve, initialPoints, shiftAmount) => {
  const curveRef = useRef(initialCurve);
  const initialCurvePointsRef = useRef(initialPoints.map((v) => v.clone()));
  const loopCounter = useRef(1);
  const transitionCurveActive = useRef(false);

  const initiateTransitionCurve = () => {
    const i = loopCounter.current;
    const pts = initialCurvePointsRef.current;
    const t = [
      pts[pts.length - 1].clone().add(new THREE.Vector3(shiftAmount * (i - 1), 0, 0)),
      pts[0].clone().add(new THREE.Vector3(shiftAmount * i, 0, 0)),
    ];
    curveRef.current.points = t;
    curveRef.current.needsUpdate = true;
  };

  const shiftCurvePoints = (direction = "forward") => {
    const k = direction === "forward" ? loopCounter.current : loopCounter.current - 1;
    curveRef.current.points = initialCurvePointsRef.current.map((p) => p.clone().add(new THREE.Vector3(shiftAmount * k, 0, 0)));
    curveRef.current.needsUpdate = true;
  };

  return {
    curveRef,
    loopCounter,
    transitionCurveActive,
    initiateTransitionCurve,
    shiftCurvePoints,
    getCurrentPoint: (progress) => curveRef.current.getPoint(progress),
  };
};
