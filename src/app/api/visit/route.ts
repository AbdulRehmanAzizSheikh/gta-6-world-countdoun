import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { bumpDisplay, bumpReal } from "@/lib/display";

export const dynamic = "force-dynamic";

// Visit: real counter (admin) + public display counter (seeded).
export async function POST() {
  if (!isDbConfigured()) return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });
  try {
    await bumpReal("visits", 1);
    const d = await bumpDisplay("visits", 1);
    return NextResponse.json({ ok: true, visits: d.visits });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
