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

function formatLocalLaunch(ms: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(ms);
}

export default function TopLaunchCountries() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const top10 = useMemo(() => {
    return COUNTRIES.map((c) => {
      const launchMs = getLaunchUtcMs(c.timeZone);
      return { ...c, launchMs, localLaunch: formatLocalLaunch(launchMs, c.timeZone) };
    })
      .sort((a, b) => a.launchMs - b.launchMs || a.name.localeCompare(b.name))
      .slice(0, 10);
  }, []);

  if (now === null) {
    return (
      <section className="liquid-glass-soft rounded-[1.75rem] p-4 sm:p-5 mb-6 sm:mb-8">
        <p className="text-sm text-white/70">Loading top launch countries…</p>
      </section>
    );
  }

  return (
    <section className="liquid-glass-soft rounded-[1.75rem] p-4 sm:p-5 mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">Top 10 Countries — First to Launch</h2>
        <span className="text-xs sm:text-sm text-white/70">Earliest local midnight (19 Nov 2026)</span>
      </div>
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {top10.map((c, i) => {
          const live = now >= c.launchMs;
          return (
            <div
              key={c.code}
              className={`flex items-center gap-3 rounded-2xl border px-3.5 sm:px-4 py-2.5 min-w-[15rem] max-w-full flex-1 sm:flex-none sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] xl:w-auto xl:min-w-[16rem] ${
                live
                  ? "border-emerald-300/30 bg-emerald-500/10"
                  : "border-white/12 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
                #{i + 1}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="font-semibold text-white truncate">{c.name}</span>
                  {live && (
                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-emerald-400/20 text-emerald-200 px-2 py-0.5">
                      Live
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] sm:text-xs text-white/75 leading-snug">{c.localLaunch}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
