// dev-only on-screen debug overlay (removed from production by import.meta.env.DEV checks)
export const DEBUG = import.meta.env.DEV && typeof location !== "undefined" && /[?&]debug/.test(location.search);
export const debugState = { wheel: 0, lastDeltaY: 0, frames: 0, fpsAt: 0, fps: 0, frameStart: 0, jsMs: 0, renderMs: 0 };
export function debugOverlay(text) {
  if (!DEBUG) return;
  let d = document.getElementById("dbg");
  if (!d) { d = document.createElement("div"); d.id = "dbg"; d.style.cssText = "position:fixed;left:8px;bottom:8px;font:14px monospace;color:#000;background:#fff8;padding:4px;z-index:200;pointer-events:none;white-space:pre"; document.body.appendChild(d); }
  d.textContent = text;
}
