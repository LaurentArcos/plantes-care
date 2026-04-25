import { getAllPlantes, getCurrentMoisKey, getMois, metadata } from '@/lib/jardin';

export default function Home() {
  const mois = getMois(getCurrentMoisKey())!;
  return (
    <pre className="p-4 text-xs">
      {JSON.stringify({
        jardin: metadata.jardin.nom,
        nb_plantes: getAllPlantes().length,
        mois_courant: mois.mois,
        actions_ce_mois: mois.actions.length,
      }, null, 2)}
    </pre>
  );
}