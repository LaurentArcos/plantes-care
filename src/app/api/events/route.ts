import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from") ?? "1970-01-01";
  const to   = url.searchParams.get("to")   ?? "2100-01-01";
  const [rows] = await db.query(
    "SELECT * FROM vw_ui_care_events WHERE due_date BETWEEN ? AND ? ORDER BY due_date, id",
    [from, to]
  );
  return NextResponse.json(rows);
}
