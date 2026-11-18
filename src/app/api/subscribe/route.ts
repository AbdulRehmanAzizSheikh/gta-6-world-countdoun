import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
    }
    const db = await getDb();
    await db.collection("subscribers").updateOne(
      { email },
      { $setOnInsert: { email, subscribedAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 503 });
  }
}
