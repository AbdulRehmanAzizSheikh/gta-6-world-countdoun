"use client";

import { useEffect, useMemo, useState } from "react";
import { COUNTRIES, REFERENCE_COUNTRY_CODE, DEFAULT_COUNTRY_CODE } from "@/lib/countries";
import { getLaunchUtcMs, getNextLaunchCountryCode } from "@/lib/launch-time";

export default function HeroCountdown() {
  const [selectedCode, setSelectedCode] = useState(REFERENCE_COUNTRY_CODE);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Restore last hero selection (default: next country launching soon)
  useEffect(() => {
    const c = localStorage.getItem("gta6_hero_country");
    if (c && COUNTRIES.some((x) => x.code === c)) {
      setSelectedCode(c);
    } else {
      const next = getNextLaunchCountryCode();
      if (next && COUNTRIES.some((x) => x.code === next)) {
        setSelectedCode(next);
        localStorage.setItem("gta6_hero_country", next);
      }
    }
  }, []);

  function changeCountry(code: string) {
    setSelectedCode(code);
    localStorage.setItem("gta6_hero_country", code);
  }

  const selected =
    COUNTRIES.find((c) => c.code === selectedCode) ??
    COUNTRIES.find((c) => c.code === REFERENCE_COUNTRY_CODE)!;

  const launchMs = useMemo(
    () => getLaunchUtcMs(selected.timeZone),
    [selected.timeZone],
  );

  const localLaunchShort = new Intl.DateTimeFormat("en-US", {
    timeZone: selected.timeZone,
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(launchMs);

  const diff = now === null ? null : launchMs - now;
  const live = diff !== null && diff <= 0;
  const abs = diff === null ? 0 : Math.max(0, diff);

  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1000);

  const metrics = [
    { label: "DAYS", value: days },
    { label: "HRS", value: hours },
    { label: "MIN", value: minutes },
    { label: "SEC", value: seconds },
  ];

  return (
    <div className="liquid-glass rounded-3xl border border-white/25 p-4 sm:p-4 lg:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/85 whitespace-nowrap">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Hero — Live
        </p>
        <select
          aria-label="Hero countdown country"
          title={selected.name}
          value={selectedCode}
          onChange={(e) => changeCountry(e.target.value)}
          className="min-w-0 max-w-[60%] sm:max-w-[12rem] truncate rounded-xl border border-white/20 bg-white/10 px-2 py-1.5 text-xs text-white outline-none backdrop-blur-xl focus:border-white/40"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} className="bg-[#111523] text-white">
              {c.flag} {c.name}
              {c.code === REFERENCE_COUNTRY_CODE ? " — First" : ""}
              {c.code === DEFAULT_COUNTRY_CODE ? " — Default" : ""}
            </option>
          ))}
        </select>
      </div>

      {live ? (
        <p className="mt-3 text-center text-xl sm:text-2xl font-extrabold accent-text">GTA 6 IS LIVE 🎉</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-white/15 bg-[#04050a]/55 px-1 py-2 sm:py-2.5 backdrop-blur-md"
            >
              <div className="text-base sm:text-2xl font-extrabold tabular-nums leading-none text-white">
                {String(m.value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/75">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-[10px] sm:text-[11px] leading-snug text-white/85">
        {selected.flag} <span className="font-semibold text-white">{selected.name}</span> launches on{" "}
        <span className="font-semibold text-white">{localLaunchShort}</span> — midnight local, 19 Nov 2026.
      </p>
    </div>
  );
}
