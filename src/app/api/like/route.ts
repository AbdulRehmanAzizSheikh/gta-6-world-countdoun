import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { withPublicBase } from "@/lib/display";

export const dynamic = "force-dynamic";

// Body: { type: "like" | "dislike", action: "add" | "remove" }
export async function POST(req: Request) {
  if (!isDbConfigured())
    return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });
  try {
    const body = (await req.json()) as { type?: string; action?: string };
    const type = body.type;
    const action = body.action;
    if (!["like", "dislike"].includes(type ?? "") || !["add", "remove"].includes(action ?? "")) {
      return NextResponse.json({ ok: false, error: "invalid-payload" }, { status: 400 });
    }
    const field = type === "like" ? "likes" : "dislikes";
    const delta = action === "add" ? 1 : -1;
    const db = await getDb();
    await db.collection("stats").updateOne(
      { _id: "global" as unknown as never },
      { $inc: { [field]: delta } },
      { upsert: true },
    );
    await db.collection("stats").updateOne(
      { _id: "global" as unknown as never, [field]: { $lt: 0 } } as never,
      { $set: { [field]: 0 } },
    );
    const stats = await db.collection("stats").findOne({ _id: "global" as unknown as never });
    return NextResponse.json({
      ok: true,
      ...withPublicBase({
        likes: Math.max(0, stats?.likes ?? 0),
        dislikes: Math.max(0, stats?.dislikes ?? 0),
      }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
