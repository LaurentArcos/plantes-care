// server component
import Image from "next/image";

async function getPlant(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plants?id=${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("fetch plant failed");
  const arr = await res.json();
  return arr[0];
}

export default async function PlantDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const p = await getPlant(id);

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
            <Image src={p.type_icon} width={24} height={24} alt="" unoptimized />
            <h2 className="text-xl font-semibold">{p.display_name}</h2>
          </div>
          <div className="text-sm text-neutral-600 italic">{p.latin_name}</div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Image src={p.light_icon} width={20} height={20} alt="lumière" unoptimized />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: p.water_drops }).map((_, i) => (
                <Image key={`wf-${i}`} src={p.water_drop_full_icon} width={16} height={16} alt="eau" unoptimized />
              ))}
              {Array.from({ length: 3 - p.water_drops }).map((_, i) => (
                <Image key={`we-${i}`} src={p.water_drop_empty_icon} width={16} height={16} alt="eau" unoptimized />
              ))}
            </div>
            {typeof p.humidity_pct_target === "number" && (
              <div className="flex items-center gap-1 text-sm">
                <Image src={p.humidity_icon} width={16} height={16} alt="humidité" unoptimized />
                <span>{p.humidity_pct_target}%</span>
              </div>
            )}
            <Image src={p.indoor_icon} width={16} height={16} alt="lieu" unoptimized />
            {p.exposure_icon && <Image src={p.exposure_icon} width={16} height={16} alt="exposition" unoptimized />}
          </div>

          <div className="mt-2 text-sm text-neutral-700">
            Lieu : {p.location_name ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
