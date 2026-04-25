// Renomme les photos en kebab-case ASCII et patche data/jardin_db.json en
// conséquence. Idempotent : peut être relancé sans casser quoi que ce soit.
//
// Usage : node scripts/rename-photos.mjs
//
// Hypothèse : exécuté depuis la racine du projet Next.js, avec
//   - data/jardin_db.json
//   - public/photos/  (contenant les fichiers originaux)

import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const JSON_PATH = 'src/data/jardin_db.json';
const PHOTOS_DIR = 'public/photos';

/**
 * Slugifie un nom de fichier : conserve l'extension, normalise le reste.
 * "Olivier 1.JPG" -> "olivier-1.jpg"
 * "cyprès de Provence.jpg" -> "cypres-de-provence.jpg"
 */
function slugify(filename) {
  const dot = filename.lastIndexOf('.');
  const base = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot) : '';
  const slug = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug + ext.toLowerCase();
}

// --- Lecture & patch du JSON ---
if (!existsSync(JSON_PATH)) {
  console.error(`✗ ${JSON_PATH} introuvable.`);
  process.exit(1);
}

const db = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
const renames = new Map(); // old -> new (basenames seuls)

for (const plant of db.plants) {
  if (!Array.isArray(plant.photos)) continue;
  plant.photos = plant.photos.map((p) => {
    const next = slugify(p);
    if (next !== p) renames.set(p, next);
    return next;
  });
}

// Détection de collisions (deux noms slugifiés qui collapsent au même résultat)
const newNames = new Set();
const collisions = [];
for (const [, next] of renames) {
  if (newNames.has(next)) collisions.push(next);
  newNames.add(next);
}
if (collisions.length) {
  console.warn(`⚠ Collisions de noms slugifiés : ${[...new Set(collisions)].join(', ')}`);
  console.warn('  → Renomme manuellement les fichiers concernés avant de continuer.');
}

// --- Renommage sur disque ---
let renamed = 0;
let alreadyOk = 0;
let missing = 0;

if (!existsSync(PHOTOS_DIR)) {
  console.warn(`⚠ ${PHOTOS_DIR} n'existe pas — patch JSON uniquement.`);
} else {
  const present = new Set(readdirSync(PHOTOS_DIR));
  for (const [oldName, newName] of renames) {
    if (present.has(oldName)) {
      renameSync(join(PHOTOS_DIR, oldName), join(PHOTOS_DIR, newName));
      renamed++;
    } else if (present.has(newName)) {
      alreadyOk++; // déjà renommé lors d'une exécution précédente
    } else {
      console.warn(`  ⚠ fichier introuvable : ${oldName}`);
      missing++;
    }
  }
}

writeFileSync(JSON_PATH, JSON.stringify(db, null, 2) + '\n', 'utf8');

console.log(`✓ JSON patché : ${renames.size} entrée(s) photo réécrite(s)`);
console.log(`✓ Disque : ${renamed} renommée(s), ${alreadyOk} déjà ok, ${missing} manquante(s)`);
