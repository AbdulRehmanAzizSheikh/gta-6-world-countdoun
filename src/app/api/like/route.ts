import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { bumpDisplay, bumpReal } from "@/lib/display";

export const dynamic = "force-dynamic";

// Body: { type: "like" | "dislike", action: "add" | "remove" }
// Like/Dislike: real counter (admin) + public display counter (seeded).
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
    await bumpReal(field, delta);
    const d = await bumpDisplay(field, delta);
    return NextResponse.json({ ok: true, likes: d.likes, dislikes: d.dislikes });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
