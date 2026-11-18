import crypto from "crypto";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "00112233";

export function adminToken() {
  return crypto
    .createHmac("sha256", ADMIN_PASSWORD)
    .update("gta6-admin-v1")
    .digest("hex");
}

export function isAdminRequest(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)gta_admin=([a-f0-9]+)/);
  if (!match) return false;
  const expected = adminToken();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(match[1], "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return false;
  }
}
