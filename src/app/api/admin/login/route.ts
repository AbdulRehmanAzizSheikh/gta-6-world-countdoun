import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, adminToken } from "@/lib/admin";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    const given = body.password ?? "";
    let ok = false;
    try {
      ok = crypto.timingSafeEqual(Buffer.from(given), Buffer.from(ADMIN_PASSWORD));
    } catch {
      ok = false;
    }
    if (!ok) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("gta_admin", adminToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
