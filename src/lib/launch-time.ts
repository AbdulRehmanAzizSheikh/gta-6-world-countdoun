import { COUNTRIES, DEFAULT_COUNTRY_CODE } from "@/lib/countries";

export const LAUNCH = { year: 2026, month: 10, day: 19, hour: 0, minute: 0 }; // month 0-indexed (Nov)

export function zonedWallTimeToUtcMs(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
) {
  let guess = Date.UTC(year, monthIndex, day, hour, minute, 0);
  for (let i = 0; i < 4; i++) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(new Date(guess));
    const map: Record<string, string> = {};
    for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
    let h = Number(map.hour);
    if (h === 24) h = 0;
    const asUtc = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      h,
      Number(map.minute),
      Number(map.second),
    );
    const want = Date.UTC(year, monthIndex, day, hour, minute, 0);
    const diff = want - asUtc;
    guess += diff;
    if (diff === 0) break;
  }
  return guess;
}

export function getLaunchUtcMs(timeZone: string) {
  return zonedWallTimeToUtcMs(LAUNCH.year, LAUNCH.month, LAUNCH.day, LAUNCH.hour, LAUNCH.minute, timeZone);
}

export function getNextLaunchCountryCode(now = Date.now()) {
  let best: { code: string; launchMs: number } | null = null;
  for (const c of COUNTRIES) {
    const launchMs = getLaunchUtcMs(c.timeZone);
    if (launchMs > now) {
      if (!best || launchMs < best.launchMs) best = { code: c.code, launchMs };
    }
  }
  if (best) return best.code;
  // all launched: fall back to default or first
  return COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY_CODE)?.code ?? COUNTRIES[0]?.code ?? "NZ";
}
