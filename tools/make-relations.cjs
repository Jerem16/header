const fs = require("fs");
const path = require("path");

const keep = new Set(
  fs.readFileSync("KEEP.txt","utf8")
    .split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
);
const graph = JSON.parse(fs.readFileSync("deps.json","utf8"));
const norm = (p) => p && path.normalize(p).replace(/\\/g, "/");

let lines = ["source,target"];
for (const m of graph.modules || []) {
  const src = norm(m.source);
  if (!keep.has(src)) continue;
  for (const d of (m.dependencies||[])) {
    const dst = norm(d.resolved);
    if (!dst) continue;
    if (/node_modules|\b\.next\b/.test(dst)) continue; // ignore externes
    if (!keep.has(dst)) continue;
    lines.push(`${src},${dst}`);
  }
}

fs.writeFileSync("relations.csv", lines.join("\n"), "utf8");
console.log(`relations.csv  ${lines.length-1} arêtes`);
