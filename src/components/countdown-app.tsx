"use client";

import { useEffect, useMemo, useState } from "react";
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  REFERENCE_COUNTRY_CODE,
  type CountryOption,
} from "@/lib/countries";

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
  return zonedWallTimeToUtcMs(
    LAUNCH.year,
    LAUNCH.month,
    LAUNCH.day,
    LAUNCH.hour,
    LAUNCH.minute,
    timeZone,
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function diffParts(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, done: ms <= 0 };
}

function formatInZone(ms: number, timeZone: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    ...options,
  }).format(new Date(ms));
}

function CountdownBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="panel relative overflow-hidden rounded-2xl p-4 sm:p-5 text-center">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${accent ? "sunset" : "bg-white/10"}`}
      />
      <div className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-wide text-glow">
        {value}
      </div>
      <div className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.28em] text-white/60">
        {label}
      </div>
    </div>
  );
}

function CountryFacts({ country, now }: { country: CountryOption; now: number }) {
  const launchMs = useMemo(() => getLaunchUtcMs(country.timeZone), [country.timeZone]);
  const d = diffParts(launchMs - now);
  const localLaunch = formatInZone(launchMs, country.timeZone, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const localNow = formatInZone(now, country.timeZone, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <CountdownBlock label="Days" value={String(d.days)} accent />
        <CountdownBlock label="Hours" value={pad(d.hours)} />
        <CountdownBlock label="Minutes" value={pad(d.minutes)} />
        <CountdownBlock label="Seconds" value={pad(d.seconds)} />
      </div>

      {d.done ? (
        <div className="panel rounded-2xl p-5 text-center border border-emerald-400/30">
          <p className="text-lg sm:text-xl font-semibold text-emerald-300">
            GTA VI is officially live in {country.name}.
          </p>
          <p className="mt-1 text-sm text-white/70">
            Local unlock time: {localLaunch}
          </p>
        </div>
      ) : (
        <div className="panel rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                Official launch in {country.name}
              </p>
              <p className="mt-1 text-lg sm:text-xl font-semibold text-white">
                {localLaunch}
              </p>
              <p className="mt-1 text-sm text-white/65">
                Based on Rockstar&apos;s midnight local-time release on 19 Nov 2026.
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                Current time there
              </p>
              <p className="mt-1 font-mono text-base sm:text-lg text-cyan-200">
                {localNow}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CountdownApp() {
  const [selectedCode, setSelectedCode] = useState(DEFAULT_COUNTRY_CODE);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const selected =
    COUNTRIES.find((c) => c.code === selectedCode) ??
    COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY_CODE)!;
  const reference =
    COUNTRIES.find((c) => c.code === REFERENCE_COUNTRY_CODE) ?? COUNTRIES[0];

  const referenceLaunchMs = useMemo(
    () => getLaunchUtcMs(reference.timeZone),
    [reference.timeZone],
  );
  const selectedLaunchMs = useMemo(
    () => getLaunchUtcMs(selected.timeZone),
    [selected.timeZone],
  );
  const refDiff = diffParts(referenceLaunchMs - now);

  const nzLocalLaunch = formatInZone(referenceLaunchMs, reference.timeZone, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const selectedLocalLaunchShort = formatInZone(selectedLaunchMs, selected.timeZone, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  const hoursDiff =
    Math.round(((selectedLaunchMs - referenceLaunchMs) / 3600000) * 10) / 10;

  return (
    <div className="relative">
      <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-start">
        <div className="space-y-5">
          <div className="panel rounded-3xl p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Official local-time release tracking
                </span>
                <span className="inline-flex items-center rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-100">
                  Default: Pakistan
                </span>
              </div>

              <label className="block text-sm text-white/70 mb-2" htmlFor="country">
                Select country / region
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select
                  id="country"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full sm:max-w-md rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-base text-white outline-none ring-0 focus:border-fuchsia-400/60 focus:bg-black/55"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#120b1d]">
                      {c.flag} {c.name}
                      {c.code === REFERENCE_COUNTRY_CODE ? " — First launch" : ""}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-white/60">
                  Showing official launch countdown for <span className="text-white font-medium">{selected.flag} {selected.name}</span>
                </div>
              </div>

              <div className="mt-6">
                <CountryFacts country={selected} now={now} />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Selected country</p>
              <p className="mt-2 text-xl font-semibold">{selected.flag} {selected.name}</p>
              <p className="mt-2 text-sm text-white/70">
                Official local launch: <span className="text-white">{selectedLocalLaunchShort}</span>
              </p>
              <p className="mt-2 text-sm text-cyan-200/90">
                {hoursDiff === 0
                  ? "Launches at the same moment as New Zealand's local midnight window? (same region time)."
                  : hoursDiff > 0
                    ? `Launches ${hoursDiff} hours after New Zealand's first local midnight launch.`
                    : `Launches ${Math.abs(hoursDiff)} hours before this reference in absolute time.`}
              </p>
            </div>
            <div className="panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">How this countdown works</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75 leading-relaxed">
                <li>• GTA VI console release is set for <span className="text-white">19 November 2026</span>.</li>
                <li>• Rockstar states release at <span className="text-white">midnight local time</span> in all regions.</li>
                <li>• <span className="text-white">New Zealand</span> reaches local midnight first, so it gets the earliest launch.</li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <div className="panel rounded-3xl p-5 sm:p-6 border-fuchsia-400/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,rgba(255,79,216,0.5),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(53,231,255,0.35),transparent_45%)]" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/80">
                    From / First launch reference
                  </p>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">
                    {reference.flag} {reference.name}
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 border border-emerald-300/30 px-3 py-1 text-xs text-emerald-200">
                  Earliest
                </span>
              </div>
              <p className="mt-3 text-sm text-white/75">
                New Zealand hits midnight local time first, so this is the world&apos;s earliest official GTA VI launch moment.
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { l: "D", v: String(refDiff.days) },
                  { l: "H", v: pad(refDiff.hours) },
                  { l: "M", v: pad(refDiff.minutes) },
                  { l: "S", v: pad(refDiff.seconds) },
                ].map((x) => (
                  <div key={x.l} className="rounded-xl bg-black/30 border border-white/10 p-2 text-center">
                    <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">{x.v}</div>
                    <div className="text-[10px] tracking-[0.2em] text-white/50">{x.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-black/25 border border-white/10 p-3 text-sm">
                <div className="text-white/50 text-xs uppercase tracking-[0.18em]">NZ local launch</div>
                <div className="mt-1 text-white font-medium">{nzLocalLaunch}</div>
                <div className="mt-2 text-white/50 text-xs uppercase tracking-[0.18em]">Time right now in NZ</div>
                <div className="mt-1 font-mono text-cyan-200">
                  {formatInZone(now, reference.timeZone, {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
              {refDiff.done && (
                <p className="mt-3 text-emerald-300 font-semibold">New Zealand launch moment has arrived.</p>
              )}
            </div>
          </div>

          <div className="panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">Quick compare</p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/70">Pakistan (default)</span>
                <span className="text-right font-medium">
                  {formatInZone(getLaunchUtcMs("Asia/Karachi"), "Asia/Karachi", {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/70">New Zealand (first)</span>
                <span className="text-right font-medium">
                  {formatInZone(referenceLaunchMs, reference.timeZone, {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-white/70">Your selected: {selected.name}</span>
                <span className="text-right font-medium text-fuchsia-100">
                  {formatInZone(selectedLaunchMs, selected.timeZone, {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/45 leading-relaxed">
              Times shown as each region&apos;s local clock at unlock (midnight local, 19 Nov 2026). Store/platform rollout details can vary; always check your console store.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
