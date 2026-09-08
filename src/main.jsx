import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.jsx";

function showErr(msg) {
  let d = document.getElementById("errbox");
  if (!d) { d = document.createElement("div"); d.id = "errbox"; d.style.cssText = "position:fixed;top:8px;left:8px;right:8px;font:14px monospace;color:#fff;background:#c0392b;padding:6px;z-index:300;white-space:pre-wrap"; document.body.appendChild(d); }
  d.textContent += msg + "\n";
}
if (import.meta.env.DEV) {
  window.addEventListener("error", (e) => showErr("ERR " + e.message + " @ " + e.filename + ":" + e.lineno));
  window.addEventListener("unhandledrejection", (e) => showErr("REJ " + (e.reason && (e.reason.stack || e.reason.message))));
  const origError = console.error;
  console.error = (...a) => { showErr("console.error " + a.map((x) => (x && x.stack) || String(x)).join(" ").slice(0, 400)); origError(...a); };
}
createRoot(document.getElementById("root")).render(<App />);
