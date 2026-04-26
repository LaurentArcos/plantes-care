import { getAllPlantes } from '@/lib/jardin';
import PlantesGrid from './PlantesGrid';

export const metadata = { title: 'Plantes · Jardin' };

export default function PlantesPage() {
  const plantes = getAllPlantes();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Plantes</h1>
      <PlantesGrid plantes={plantes} />
    </div>
  );
}
