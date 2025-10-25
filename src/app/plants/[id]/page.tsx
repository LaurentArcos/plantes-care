// server component
import Image from "next/image";

async function getPlant(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plants?id=${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch plant failed");
  const arr = await res.json();
  return arr[0];
}

export default async function PlantDetail({ params }: { params: { id: string } }) {
  const p = await getPlant(params.id);

  if (!p) return <div className="text-sm text-neutral-500">Introuvable.</div>;

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden border rounded-2xl bg-white">
        <div className="relative aspect-[16/9] bg-gray-100">
          {p.photo_url && (
            <Image src={p.photo_url} alt={p.display_name} fill className="object-cover" />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <img src={p.type_icon} className="w-6 h-6" alt="" />
            <h2 className="text-xl font-semibold">{p.display_name}</h2>
          </div>
          <div className="text-sm text-neutral-600 italic">{p.latin_name}</div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <img src={p.light_icon} className="w-5 h-5" alt="lumière" />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: p.water_drops }).map((_, i) => (
                <img key={`wf-${i}`} src={p.water_drop_full_icon} className="w-4 h-4" alt="eau" />
              ))}
              {Array.from({ length: 3 - p.water_drops }).map((_, i) => (
                <img key={`we-${i}`} src={p.water_drop_empty_icon} className="w-4 h-4" alt="eau" />
              ))}
            </div>
            {typeof p.humidity_pct_target === "number" && (
              <div className="flex items-center gap-1 text-sm">
                <img src={p.humidity_icon} className="w-4 h-4" alt="humidité" />
                <span>{p.humidity_pct_target}%</span>
              </div>
            )}
            <img src={p.indoor_icon} className="w-4 h-4" alt="lieu" />
            {p.exposure_icon && <img src={p.exposure_icon} className="w-4 h-4" alt="exposition" />}
          </div>

          <div className="mt-2 text-sm text-neutral-700">
            Lieu : {p.location_name ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
