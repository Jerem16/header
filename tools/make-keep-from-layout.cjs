const fs = require("fs");
const path = require("path");

const graph = JSON.parse(fs.readFileSync("deps.json", "utf8"));
const norm = (p) => p && path.normalize(p).replace(/\\/g, "/");

const modules = graph.modules || [];
const bySource = new Map(modules.map(m => [norm(m.source), m]));

// layouts pris en compte comme "sources"
const isSeed = (p) => /^app\/.*\/?layout\.[tj]sx?$|^app\/layout\.[tj]sx?$/.test(p);

// file d'attente + set des fichiers à garder
const queue = [];
const keep = new Set();

// initialise avec tous les layouts trouvés dans le graphe
for (const src of bySource.keys()) {
  if (isSeed(src)) {
    queue.push(src);
    keep.add(src);
  }
}

// BFS: remonte toutes les dépendances internes atteignables depuis les layouts
while (queue.length) {
  const cur = queue.shift();
  const mod = bySource.get(cur);
  if (!mod) continue;

  for (const d of (mod.dependencies || [])) {
    const r = norm(d.resolved);
    if (!r) continue;

    // ignore externes
    if (/node_modules|\b\.next\b/.test(r)) continue;

    // restreint aux dossiers du repo (ajoute ici si besoin)
    if (!/^(app|src|components|styles|lib|public)\//.test(r)) continue;

    if (!keep.has(r)) {
      keep.add(r);
      queue.push(r);
    }
  }
}

// écrit la liste triée
const out = Array.from(keep).sort().join("\n") + "\n";
fs.writeFileSync("keep-from-layout.txt", out, "utf8");
console.log(`OK  ${keep.size} fichiers gardés (keep-from-layout.txt)`);
