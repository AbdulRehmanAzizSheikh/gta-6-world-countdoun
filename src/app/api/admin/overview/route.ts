import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { getDb, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });
  }
  try {
    const db = await getDb();
    const stats = await db.collection("stats").findOne({ _id: "global" as unknown as never });
    const [subscribers, feedbacks] = await Promise.all([
      db.collection("subscribers").find({}).sort({ subscribedAt: -1 }).toArray(),
      db.collection("feedback").find({}).sort({ createdAt: -1 }).toArray(),
    ]);
    return NextResponse.json({
      ok: true,
      visits: stats?.visits ?? 0,
      likes: stats?.likes ?? 0,
      dislikes: stats?.dislikes ?? 0,
      subscribers: subscribers.map((s) => ({ email: s.email, subscribedAt: s.subscribedAt })),
      feedbacks: feedbacks.map((f) => ({
        name: f.name ?? "Anonymous",
        email: f.email ?? "",
        message: f.message ?? "",
        createdAt: f.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
