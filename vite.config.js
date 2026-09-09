import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the site under /<repo-name>/. The workflow sets VITE_BASE to that path;
// everywhere else (local dev, Vercel) the site lives at the root.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
});
