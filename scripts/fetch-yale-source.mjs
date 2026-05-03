import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const base = "https://www.art.yale.edu";
const outDir = join(process.cwd(), "public", "source-cache");

const seedPaths = [
  "/",
  "/about",
  "/apply",
  "/events",
  "/exhibitions",
  "/publications",
  "/news",
  "/faculty",
  "/graduate-study-areas",
  "/painting-printmaking",
  "/photography",
  "/graphic-design",
  "/sculpture",
];

const normalizePath = (path) => {
  if (path === "/") return "home";
  return path.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9-]+/gi, "-") || "home";
};

const extractLinks = (html) => {
  return [...html.matchAll(/href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    .map((href) => new URL(href, base).pathname)
    .filter((path) => !path.includes(".") && !path.startsWith("/assets"))
    .filter((path) => !path.startsWith("/users") && !path.startsWith("/login"));
};

await mkdir(outDir, { recursive: true });

const queue = [...seedPaths];
const seen = new Set();
const manifest = [];

while (queue.length && seen.size < 40) {
  const path = queue.shift();
  if (!path || seen.has(path)) continue;
  seen.add(path);

  const url = new URL(path, base).href;
  const response = await fetch(url);
  const html = await response.text();
  const filename = `${normalizePath(path)}.html`;

  await writeFile(join(outDir, filename), html, "utf8");
  manifest.push({ path, url, status: response.status, bytes: html.length, filename });

  for (const link of extractLinks(html)) {
    if (!seen.has(link) && queue.length < 80) queue.push(link);
  }
}

await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Fetched ${manifest.length} public pages into ${outDir}`);
