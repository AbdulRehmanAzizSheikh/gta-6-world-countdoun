import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { PUBLIC_BASE, withPublicBase } from "@/lib/display";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ configured: false, ...PUBLIC_BASE, subscribers: 0 });
  }
  try {
    const db = await getDb();
    const stats = await db.collection("stats").findOne({ _id: "global" as unknown as never });
    const subscribers = await db.collection("subscribers").countDocuments();
    return NextResponse.json({
      configured: true,
      ...withPublicBase({ visits: stats?.visits ?? 0, likes: stats?.likes ?? 0, dislikes: stats?.dislikes ?? 0 }),
      subscribers,
    });
  } catch {
    return NextResponse.json({ configured: true, error: true, ...PUBLIC_BASE, subscribers: 0 }, { status: 503 });
  }
}
