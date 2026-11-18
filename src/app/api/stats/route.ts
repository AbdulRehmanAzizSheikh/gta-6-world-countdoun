import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { getDisplayStats } from "@/lib/display";

export const dynamic = "force-dynamic";

// Public-facing counters (seeded "display" dataset in MongoDB).
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ configured: false, visits: 0, likes: 0, dislikes: 0, subscribers: 0 });
  }
  try {
    const d = await getDisplayStats();
    return NextResponse.json({ configured: true, ...d });
  } catch {
    return NextResponse.json({ configured: true, error: true, visits: 0, likes: 0, dislikes: 0 }, { status: 503 });
  }
}
