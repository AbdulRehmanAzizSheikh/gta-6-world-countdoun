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

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function LaunchedCountries() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const upcoming = useMemo(() => {
    if (now === null) return [];
    return COUNTRIES.map((c) => ({ ...c, launchMs: getLaunchUtcMs(c.timeZone) }))
      .filter((c) => c.launchMs > now)
      .sort((a, b) => a.launchMs - b.launchMs || a.name.localeCompare(b.name));
  }, [now]);

  if (now === null) {
    return (
      <section className="liquid-glass-soft rounded-[1.75rem] p-4 sm:p-5 mt-6 sm:mt-8 mb-6 sm:mb-8">
        <p className="text-sm text-white/70">Loading countries…</p>
      </section>
    );
  }

  return (
    <section className="liquid-glass-soft rounded-[1.75rem] p-4 sm:p-5 mt-6 sm:mt-8 mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          Launch Countdowns by Country
        </h2>
        <span className="text-xs sm:text-sm text-white/70">
          {upcoming.length} / {COUNTRIES.length} remaining
        </span>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-white/80">GTA 6 has launched in all listed countries.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {upcoming.map((c) => (
            <div
              key={c.code}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-xs sm:text-sm text-white/95"
              title={`${c.name} local launch countdown`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="font-medium">{c.name}</span>
              <span className="text-cyan-100 tabular-nums font-semibold whitespace-nowrap">
                {formatRemaining(c.launchMs - now)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
