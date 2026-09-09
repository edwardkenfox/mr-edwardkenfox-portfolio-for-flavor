// Turns a root-relative asset path from content.json ("/photos/x.jpg") into a URL that also
// works when the site is served from a sub-path (GitHub Pages).
export function assetUrl(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}
