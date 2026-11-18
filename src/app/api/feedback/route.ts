import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });
  try {
    const body = (await req.json()) as { name?: string; email?: string; message?: string };
    const name = body.name?.trim().slice(0, 120) || "Anonymous";
    const email = body.email?.trim().toLowerCase().slice(0, 254) || "";
    const message = body.message?.trim().slice(0, 2000) || "";
    if (message.length < 3) {
      return NextResponse.json({ ok: false, error: "message-too-short" }, { status: 400 });
    }
    const db = await getDb();
    await db.collection("feedback").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
