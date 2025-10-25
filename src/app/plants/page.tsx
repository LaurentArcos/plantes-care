// server component
import Image from "next/image";
import Link from "next/link";

type UIPlant = {
  plant_id: number;
  display_name: string;
  common_name: string;
  latin_name: string;
  location_name: string | null;
  indoor: 0 | 1 | null;
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {plants.map((p) => (
            <Link
              key={p.plant_id}
              href={{ pathname: "/plants/[id]", query: { id: String(p.plant_id) } }}
              className="overflow-hidden border rounded-2xl bg-white hover:shadow-md transition"
            >
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

              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Image src={p.type_icon} alt="" width={20} height={20} unoptimized />
                  <div className="font-medium">{p.display_name}</div>
                </div>
                <div className="text-xs text-neutral-600 italic">{p.latin_name}</div>

                <div className="mt-2 flex items-center gap-3">
                  <Image src={p.light_icon} alt="lumière" width={20} height={20} unoptimized />

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: p.water_drops }).map((_, i) => (
                      <Image key={`wf-${i}`} src={p.water_drop_full_icon} width={16} height={16} alt="eau" unoptimized />
                    ))}
                    {Array.from({ length: 3 - p.water_drops }).map((_, i) => (
                      <Image key={`we-${i}`} src={p.water_drop_empty_icon} width={16} height={16} alt="eau" unoptimized />
                    ))}
                  </div>

                  {typeof p.humidity_pct_target === "number" && (
                    <div className="flex items-center gap-1 text-xs">
                      <Image src={p.humidity_icon} width={16} height={16} alt="humidité" unoptimized />
                      <span>{p.humidity_pct_target}%</span>
                    </div>
                  )}

                  <Image src={p.indoor_icon} width={16} height={16} alt="lieu" unoptimized />
                  {p.exposure_icon && <Image src={p.exposure_icon} width={16} height={16} alt="exposition" unoptimized />}
                </div>

                <div className="mt-1 text-xs text-neutral-600">
                  {p.location_name ?? "—"}
                </div>
              </div>
            </Link>
          ))}

          {plants.length === 0 && (
            <div className="text-sm text-neutral-500">Aucune plante.</div>
          )}
        </div>
      </section>
    </div>
  );
}
