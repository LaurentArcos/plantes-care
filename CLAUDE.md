# Projet plantes-care

Site Next.js statique pour consulter le manuel d'entretien d'un jardin
méditerranéen (La Farlède). Pas de DB, pas d'auth, pas de tracking de tâches.
Source de vérité unique : src/data/jardin_db.json.

## Stack
- Next.js 16 (App Router, --src-dir, Turbopack)
- TypeScript strict, Tailwind v4
- Déploiement futur : static export (`output: 'export'`)

## Conventions
- Imports via alias @/* (mappé vers src/*)
- Couche data : src/lib/jardin.ts (helpers synchrones, pas de fetch)
- Types : src/types/jardin.ts
- Photos : public/photos/, noms en kebab-case ASCII
- Couleurs de catégories : utiliser inline style depuis le JSON
  (categories[key].color), pas d'extension Tailwind

## À ne pas faire
- Pas de base de données, pas d'API routes, pas de mutation
- Pas de tracking "tâche faite"
- Pas de gestion par instance (3 lauriers = 1 fiche, pas 3)

## Routes prévues
- /                       Home avec mois courant
- /plantes                Grille (✅ fait)
- /plantes/[id]           Fiche détail (à faire)
- /calendrier             Index 12 mois (à faire)
- /calendrier/[mois]      Détail mois (à faire)
- /interieur              4 saisons (à faire)