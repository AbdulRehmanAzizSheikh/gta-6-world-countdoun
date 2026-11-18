import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { PUBLIC_BASE } from "@/lib/display";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!isDbConfigured()) return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });
  try {
    const db = await getDb();
    await db.collection("stats").updateOne(
      { _id: "global" as unknown as never },
      { $inc: { visits: 1 } },
      { upsert: true },
    );
    const stats = await db.collection("stats").findOne({ _id: "global" as unknown as never });
    return NextResponse.json({ ok: true, visits: PUBLIC_BASE.visits + (stats?.visits ?? 0) });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
