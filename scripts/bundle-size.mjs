import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const buildDir = ".next";

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : path;
  }))).flat();
}

function sizes(buffer) {
  return { raw: buffer.length, gzip: gzipSync(buffer, { level: 9 }).length };
}

const kib = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const chunks = new Map();
const totals = { js: { raw: 0, gzip: 0 }, css: { raw: 0, gzip: 0 } };

for (const path of await filesIn(join(buildDir, "static"))) {
  const kind = path.endsWith(".js") ? "js" : path.endsWith(".css") ? "css" : null;
  if (!kind) continue;
  const size = sizes(await readFile(path));
  chunks.set(`/_next/${relative(buildDir, path)}`, size);
  totals[kind].raw += size.raw;
  totals[kind].gzip += size.gzip;
}

console.log("All emitted browser assets (includes deferred chunks):");
console.table(Object.fromEntries(Object.entries(totals).map(([kind, size]) => [
  kind, { raw: kib(size.raw), gzip: kib(size.gzip) },
])));

const appDir = join(buildDir, "server/app");
const routes = {};
for (const path of (await filesIn(appDir)).filter((path) => path.endsWith(".html")).sort()) {
  const html = await readFile(path, "utf8");
  const urls = new Set([...html.matchAll(/<script\b[^>]*>/gi)]
    .filter(([tag]) => !/\bnomodule\b/i.test(tag))
    .map(([tag]) => /\bsrc="([^"]+)"/.exec(tag)?.[1])
    .filter((url) => url && chunks.has(url)));
  const total = [...urls].reduce((total, url) => total + chunks.get(url).gzip, 0);
  const route = `/${relative(appDir, path).replace(/\.html$/, "").replace(/^index$/, "")}`;
  routes[route] = { "initial JS gzip": kib(total), scripts: urls.size };
}

console.log("Prerendered routes, modern browsers (excludes legacy nomodule scripts).");
console.log("Shared chunks are counted once per route; external scripts and later imports are excluded.");
console.table(routes);
