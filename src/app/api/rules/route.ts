import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const sql = `
    SELECT
      r.id,
      r.kind,
      r.rrule,
      r.every_days,
      r.month_mask,
      r.week_hint,
      r.amount_ml,
      r.method,
      r.notes,
      r.active,
      r.created_at,
      r.updated_at,
      p.id         AS plant_id,
      COALESCE(p.nickname, s.common_name) AS plant_label,
      s.id         AS species_id,
      s.common_name AS species_label
    FROM care_rules r
    LEFT JOIN plants  p ON p.id = r.plant_id
    LEFT JOIN species s ON s.id = r.species_id
    ORDER BY r.kind, r.id
  `;
  const [rows] = await db.query(sql);
  return NextResponse.json(rows);
}
