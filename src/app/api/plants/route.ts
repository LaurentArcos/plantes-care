import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const sql = id
    ? "SELECT * FROM vw_ui_plants WHERE plant_id = ?"
    : "SELECT * FROM vw_ui_plants ORDER BY display_name";
  const params = id ? [id] : [];
  const [rows] = await db.query(sql, params);
  return NextResponse.json(rows);
}
