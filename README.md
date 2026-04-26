# Jardin de La Farlède

Site statique de consultation du manuel d'entretien d'un jardin méditerranéen (La Farlède, Var).
Pas de base de données, pas d'authentification — source de vérité unique : `src/data/jardin_db.json`.

## Stack

- Next.js 16 (App Router, export statique)
- TypeScript strict, Tailwind v4
- Déploiement : `out/` servi par nginx sur Raspberry Pi

## Lancer en dev

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build & export

```bash
npm run build
```

Génère le site statique dans `out/`. Chaque route produit un fichier `.html`
(ex. `out/calendrier/03.html`). Le serveur nginx doit inclure `$uri.html` dans
son `try_files` pour que les URLs sans extension fonctionnent.

## Mettre à jour les données

1. Éditer `src/data/jardin_db.json` (plantes, calendrier, etc.)
2. Ajouter les photos dans `public/photos/` (n'importe quel nom)
3. Normaliser les noms de fichiers et patcher le JSON :

```bash
node scripts/rename-photos.mjs
```

Le script renomme les photos en kebab-case ASCII et met à jour les entrées
`photos` du JSON en conséquence. Idempotent.

## Ajouter une plante

Ajouter un objet dans le tableau `plants` de `src/data/jardin_db.json`.
Les clés de `caracteristiques`, `arrosage` et `caracteristiques_decoratives`
sont libres — elles sont affichées telles quelles.

```jsonc
{
  "id": "lavande",                        // slug URL, unique, kebab-case
  "nom": "Lavande",
  "nom_scientifique": "Lavandula angustifolia",
  "famille": "Lamiacées",
  "page_manuel": 12,                      // numéro dans le manuel papier
  "type": "outdoor",                      // "outdoor" | "indoor"
  "instances": 5,                         // nombre de pieds dans le jardin
  "photos": ["lavande-1.jpg"],            // fichiers dans public/photos/
  "caracteristiques": {
    "Exposition": "Plein soleil",
    "Sol": "Drainant, calcaire toléré",
    "Rusticité": "Jusqu'à -15 °C"
  },
  "arrosage": {                           // clés capitalisées exactement ainsi
    "Printemps": "1×/semaine si sec",
    "Été": "Aucun (sécheresse naturelle)",
    "Automne": "Pluies suffisantes",
    "Hiver": "Aucun"
  },
  "caracteristiques_decoratives": {
    "Floraison": "Juin-juillet",
    "Couleur": "Violet-bleu"
  },
  "taille_nettoyage": "Tailler après floraison, jamais dans le vieux bois.",
  "calendrier_saisonnier": {              // clés en minuscules
    "printemps": ["Taille légère si besoin", "Engrais organique léger"],
    "ete": ["Floraison", "Récolte tiges en début de floraison"],
    "automne": ["Taille post-florale", "Paillage"],
    "hiver": ["Repos", "Aucune intervention"]
  },
  "a_surveiller": [
    "Excès d'humidité en hiver : pourriture racinaire."
  ],
  "specificite_ou_conseils": [
    "Très attractive pour les abeilles.",
    "Distiller les tiges pour huile essentielle maison."
  ]
}
```

Puis relancer `node scripts/rename-photos.mjs` si des photos ont été ajoutées,
et `npm run build` pour regénérer le site.

## Déploiement

Build effectué sur la machine de dev, déploiement par rsync SSH vers le Pi.
Adapter `PI_HOST`, `PI_USER` et `PI_PATH` selon l'environnement.

```bash
#!/usr/bin/env bash
set -euo pipefail

PI_HOST="raspberrypi.local"
PI_USER="laurent"
PI_PATH="/var/www/plantes-care"

npm run build

rsync -avz --delete \
  --exclude='.DS_Store' \
  out/ \
  "${PI_USER}@${PI_HOST}:${PI_PATH}/"

echo "✓ Déployé sur ${PI_HOST}:${PI_PATH}"
```

Configuration nginx minimale sur le Pi :

```nginx
server {
    root /var/www/plantes-care;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/index.html =404;
    }
}
```
