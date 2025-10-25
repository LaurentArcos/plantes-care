// server component
import Image from "next/image";
import Link from "next/link";

type UIPlant = {
  plant_id: number;
  display_name: string;
  latin_name: string;
  type_icon: string;
  light_icon: string;
  water_drops: number;
  water_drop_full_icon: string;
  water_drop_empty_icon: string;
  humidity_pct_target: number | null;
  humidity_icon: string;
  indoor_icon: string;
  exposure_icon: string | null;
  location_name: string | null;
  photo_url: string | null;
};

async function getPlant(id: string): Promise<UIPlant | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  // on passe limit=1 + id exact ; l’API /api/plants doit supporter ?id=xx
  const res = await fetch(`${base}/api/plants?id=${encodeURIComponent(id)}&limit=1`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch plant failed");
  const arr = await res.json();
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}

export default async function PlantDetail({ params }: { params: { id: string } }) {
  const p = await getPlant(params.id);

  if (!p) {
    return (
      <div className="p-4 bg-white border rounded-2xl">
        <div className="text-sm text-neutral-600">Introuvable.</div>
        <Link href="/plants" className="inline-block mt-3 text-sm underline text-green-700">← Retour aux plantes</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden border rounded-2xl bg-white">
        <div className="relative aspect-[16/9] bg-gray-100">
          {p.photo_url && (
            <Image src={p.photo_url} alt={p.display_name} fill className="object-cover" priority sizes="100vw" />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Image src={p.type_icon} className="w-6 h-6" alt="" width={24} height={24} unoptimized />
            <h2 className="text-xl font-semibold">{p.display_name}</h2>
          </div>
          <div className="text-sm text-neutral-600 italic">{p.latin_name}</div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Image src={p.light_icon} className="w-5 h-5" alt="lumière" width={20} height={20} unoptimized />

            <div className="flex items-center gap-0.5">
              {Array.from({ length: p.water_drops }).map((_, i) => (
                <Image key={`wf-${i}`} src={p.water_drop_full_icon} className="w-4 h-4" alt="eau" width={16} height={16} unoptimized />
              ))}
              {Array.from({ length: 3 - p.water_drops }).map((_, i) => (
                <Image key={`we-${i}`} src={p.water_drop_empty_icon} className="w-4 h-4" alt="eau" width={16} height={16} unoptimized />
              ))}
            </div>

            {typeof p.humidity_pct_target === "number" && (
              <div className="flex items-center gap-1 text-sm">
                <Image src={p.humidity_icon} className="w-4 h-4" alt="humidité" width={16} height={16} unoptimized />
                <span>{p.humidity_pct_target}%</span>
              </div>
            )}

            <Image src={p.indoor_icon} className="w-4 h-4" alt="lieu" width={16} height={16} unoptimized />
            {p.exposure_icon && <Image src={p.exposure_icon} className="w-4 h-4" alt="exposition" width={16} height={16} unoptimized />}
          </div>

          <div className="mt-2 text-sm text-neutral-700">
            Lieu : {p.location_name ?? "—"}
          </div>

          <div className="mt-4">
            <Link href="/plants" className="text-sm underline text-green-700">← Retour aux plantes</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
