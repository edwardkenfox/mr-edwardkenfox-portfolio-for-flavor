import * as THREE from "three";
import { GROUND_Y } from "./paper/Environment";

export const SCENE_W = 16;
export const SCENES = 5;
export const WORLD_W = SCENE_W * SCENES; // 80
export const SHEET_GAP = 8;               // blank gap holding the single sheet
export const SHIFT_X_AMOUNT = WORLD_W + SHEET_GAP; // 88

export const CAM_Y = 1.7;
export const CAM_Z = 8.6;
export const HERO_Z = 0.9;
export const HERO_Y = GROUND_Y + 0.02;

// gentle camera path: mostly straight with a little breathing in y/z
export const initialCameraPoints = [
  new THREE.Vector3(2.2, CAM_Y, CAM_Z),
  new THREE.Vector3(9.0, CAM_Y + 0.2, CAM_Z + 0.3),
  new THREE.Vector3(17.0, CAM_Y, CAM_Z),
  new THREE.Vector3(25.0, CAM_Y + 0.3, CAM_Z - 0.3),
  new THREE.Vector3(33.0, CAM_Y, CAM_Z),
  new THREE.Vector3(41.0, CAM_Y + 0.2, CAM_Z + 0.2),
  new THREE.Vector3(49.0, CAM_Y, CAM_Z),
  new THREE.Vector3(57.0, CAM_Y + 0.3, CAM_Z - 0.4),
  new THREE.Vector3(65.0, CAM_Y, CAM_Z),
  new THREE.Vector3(73.0, CAM_Y + 0.2, CAM_Z + 0.2),
  new THREE.Vector3(79.0, CAM_Y, CAM_Z),
];

export const cameraCurve = new THREE.CatmullRomCurve3(initialCameraPoints);
cameraCurve.curveType = "centripetal";

const PITCH = -0.05;
export const rotationTargets = [
  { progress: 0, rotation: new THREE.Euler(PITCH, -0.12, 0) },
  { progress: 0.18, rotation: new THREE.Euler(PITCH - 0.02, 0.04, 0.004) },
  { progress: 0.38, rotation: new THREE.Euler(PITCH, -0.06, -0.003) },
  { progress: 0.58, rotation: new THREE.Euler(PITCH + 0.02, 0.05, 0.004) },
  { progress: 0.78, rotation: new THREE.Euler(PITCH, -0.05, -0.003) },
  { progress: 1, rotation: new THREE.Euler(PITCH, 0.02, 0) },
];

// progress thresholds where the hero swaps vehicle (one per scene)
export const VEHICLE_THRESHOLDS = [
  { threshold: 0, name: "bicycle" },
  { threshold: 0.19, name: "rocket" },
  { threshold: 0.39, name: "bagelCycle" },
  { threshold: 0.59, name: "enoden" },
  { threshold: 0.79, name: "armchair" },
];
