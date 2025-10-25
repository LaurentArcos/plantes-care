// server component
import Image from "next/image";

type UIPlant = {
  plant_id: number;
  display_name: string;
  common_name: string;
  latin_name: string;
  location_name: string | null;
  indoor: 0|1|null;
  exposure: "N"|"E"|"S"|"W"|"NE"|"SE"|"SW"|"NW"|"none"|null;
  light_icon: string;
  type_icon: string;
  water_drops: number; // 1..3
  water_drop_full_icon: string;
  water_drop_empty_icon: string;
  humidity_pct_target: number | null;
  humidity_icon: string;
  temperature_icon: string;
  indoor_icon: string;
  exposure_icon: string | null;
  photo_url: string;
};

async function getPlants(): Promise<UIPlant[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plants`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch plants failed");
  return res.json();
}

export default async function PlantsPage() {
  const plants = await getPlants();

  return (
    <div className="grid gap-6">
      <section className="p-4 md:p-5 bg-white border rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-semibold">Plantes</h2>
          {/* bouton + plus tard */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {plants.map(p => (
            <a key={p.plant_id} href={`/plants/${p.plant_id}`} className="overflow-hidden border rounded-2xl bg-white hover:shadow-md transition">
              {/* photo */}
              <div className="relative aspect-[16/10] bg-gray-100">
                {p.photo_url && (
                  <Image
                    src={p.photo_url}
                    alt={p.display_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>

              {/* contenu */}
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <img src={p.type_icon} alt="" className="w-5 h-5" />
                  <div className="font-medium">{p.display_name}</div>
                </div>
                <div className="text-xs text-neutral-600 italic">{p.latin_name}</div>

                {/* ligne d’icônes */}
                <div className="mt-2 flex items-center gap-3">
                  <img src={p.light_icon} alt="lumière" className="w-5 h-5" />

                  {/* gouttes */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: p.water_drops }).map((_, i) => (
                      <img key={`wf-${i}`} src={p.water_drop_full_icon} className="w-4 h-4" alt="eau" />
                    ))}
                    {Array.from({ length: 3 - p.water_drops }).map((_, i) => (
                      <img key={`we-${i}`} src={p.water_drop_empty_icon} className="w-4 h-4" alt="eau" />
                    ))}
                  </div>

                  {/* humidité cible */}
                  {typeof p.humidity_pct_target === "number" && (
                    <div className="flex items-center gap-1 text-xs">
                      <img src={p.humidity_icon} className="w-4 h-4" alt="humidité" />
                      <span>{p.humidity_pct_target}%</span>
                    </div>
                  )}

                  {/* indoor / expo */}
                  <img src={p.indoor_icon} className="w-4 h-4" alt="lieu" />
                  {p.exposure_icon && <img src={p.exposure_icon} className="w-4 h-4" alt="exposition" />}
                </div>

                <div className="mt-1 text-xs text-neutral-600">
                  {p.location_name ?? "—"}
                </div>
              </div>
            </a>
          ))}

          {plants.length === 0 && (
            <div className="text-sm text-neutral-500">Aucune plante.</div>
          )}
        </div>
      </section>
    </div>
  );
}
