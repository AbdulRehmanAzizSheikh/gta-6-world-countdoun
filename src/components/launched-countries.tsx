"use client";

import { useEffect, useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

const LAUNCH = { year: 2026, month: 10, day: 19, hour: 0, minute: 0 }; // month 0-indexed (Nov)

function zonedWallTimeToUtcMs(
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

function getLaunchUtcMs(timeZone: string) {
  return zonedWallTimeToUtcMs(LAUNCH.year, LAUNCH.month, LAUNCH.day, LAUNCH.hour, LAUNCH.minute, timeZone);
}

export default function LaunchedCountries() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const launched = useMemo(() => {
    if (now === null) return [];
    return COUNTRIES.map((c) => ({ ...c, launchMs: getLaunchUtcMs(c.timeZone) }))
      .filter((c) => now >= c.launchMs)
      .sort((a, b) => a.launchMs - b.launchMs);
  }, [now]);

  if (now === null) {
    return (
      <section className="liquid-glass-soft rounded-[1.75rem] p-4 sm:p-5 mt-6 sm:mt-8">
        <p className="text-sm text-white/70">Loading launched countries…</p>
      </section>
    );
  }

  return (
    <section className="liquid-glass-soft rounded-[1.75rem] p-4 sm:p-5 mt-6 sm:mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          Launched Countries
        </h2>
        <span className="text-xs sm:text-sm text-white/70">
          {launched.length} / {COUNTRIES.length} live
        </span>
      </div>
      {launched.length === 0 ? (
        <p className="text-sm text-white/80">
          No country has launched yet. New Zealand will be first at midnight local (19 Nov 2026).
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {launched.map((c) => (
            <span
              key={c.code}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1.5 text-xs sm:text-sm text-white/95"
              title={`Launched at local midnight in ${c.name}`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="font-medium">{c.name}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
