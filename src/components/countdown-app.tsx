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
  shimmer,
}: {
  label: string;
  value: string;
  accent?: boolean;
  shimmer?: boolean;
}) {
  return (
    <div className="liquid-glass-soft rounded-[1.35rem] p-3 sm:p-4 text-center relative overflow-hidden">
      {accent && (
        <div className="absolute inset-x-4 top-2 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />
      )}
      <div
        className={`font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl leading-none tracking-wide text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)] ${shimmer ? "animate-pulse" : ""}`}
      >
        {value}
      </div>
      <div className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/90">
        {label}
      </div>
    </div>
  );
}

function CountryFacts({ country, now }: { country: CountryOption; now: number | null }) {
  const launchMs = useMemo(() => getLaunchUtcMs(country.timeZone), [country.timeZone]);
  const loading = now === null;
  const d = !loading ? diffParts(launchMs - now!) : { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };
  const localLaunch = formatInZone(launchMs, country.timeZone, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const localNow =
    now !== null && now > 0
      ? formatInZone(now, country.timeZone, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "Loading…";

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CountdownBlock label="Days" value={String(d.days)} accent shimmer={loading} />
        <CountdownBlock label="Hours" value={pad(d.hours)} shimmer={loading} />
        <CountdownBlock label="Minutes" value={pad(d.minutes)} shimmer={loading} />
        <CountdownBlock label="Seconds" value={pad(d.seconds)} shimmer={loading} />
      </div>

      {d.done ? (
        <div className="liquid-glass rounded-2xl p-5 text-center border border-emerald-300/30">
          <p className="text-lg sm:text-xl font-semibold text-emerald-200">
            GTA VI is officially live in {country.name}.
          </p>
          <p className="mt-1 text-sm text-white/95">Local unlock time: {localLaunch}</p>
        </div>
      ) : (
        <div className="liquid-glass rounded-2xl p-4 sm:p-5">
          <div className="grid sm:grid-cols-[1fr_auto] gap-4 sm:gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">
                Official launch in {country.name}
              </p>
              <p className="mt-2 text-base sm:text-lg font-semibold leading-snug text-white">
                {localLaunch}
              </p>
              <p className="mt-2 text-sm text-white/90">
                Rockstar&apos;s announced release: midnight local time, 19 Nov 2026.
              </p>
            </div>
            <div className="sm:text-right sm:min-w-[190px] sm:pl-4 sm:border-l border-white/10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Current time there</p>
              <p className="mt-2 font-mono text-sm sm:text-base text-cyan-100">{localNow}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CountdownApp() {
  const [selectedCode, setSelectedCode] = useState(DEFAULT_COUNTRY_CODE);
  const [compareCode, setCompareCode] = useState("IN");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const selected =
    COUNTRIES.find((c) => c.code === selectedCode) ??
    COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY_CODE)!;
  const reference =
    COUNTRIES.find((c) => c.code === REFERENCE_COUNTRY_CODE) ?? COUNTRIES[0];
  const compare =
    COUNTRIES.find((c) => c.code === compareCode) ??
    COUNTRIES.find((c) => c.code === "IN")!;

  const referenceLaunchMs = useMemo(
    () => getLaunchUtcMs(reference.timeZone),
    [reference.timeZone],
  );
  const selectedLaunchMs = useMemo(
    () => getLaunchUtcMs(selected.timeZone),
    [selected.timeZone],
  );
  const compareLaunchMs = useMemo(
    () => getLaunchUtcMs(compare.timeZone),
    [compare.timeZone],
  );
  const refDiff = now !== null && now > 0 ? diffParts(referenceLaunchMs - now) : { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };

  const nzLocalLaunch = formatInZone(referenceLaunchMs, reference.timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const nzLaunchInSelected = formatInZone(referenceLaunchMs, selected.timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const selectedNow =
    now !== null && now > 0
      ? formatInZone(now, selected.timeZone, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "Loading…";
  const selectedLocalLaunchShort = formatInZone(selectedLaunchMs, selected.timeZone, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const compareLocalLaunchShort = formatInZone(compareLaunchMs, compare.timeZone, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const compareDiffHours =
    Math.round(((compareLaunchMs - selectedLaunchMs) / 3600000) * 10) / 10;

  const hoursDiff =
    Math.round(((selectedLaunchMs - referenceLaunchMs) / 3600000) * 10) / 10;

  return (
    <div className="relative">
      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 lg:gap-6 items-start">
        <div className="space-y-5">
          <div className="liquid-glass rounded-[1.75rem] p-5 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="liquid-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live official local-time countdown
              </span>
              <span className="liquid-chip inline-flex items-center rounded-full px-3 py-1.5 text-xs text-white/85">
                Default: Pakistan 🇵🇰
              </span>
              <span className="liquid-chip inline-flex items-center rounded-full px-3 py-1.5 text-xs text-white/85">
                First launch: New Zealand 🇳🇿
              </span>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-white/85 mb-2" htmlFor="country">
                  Select your country / region
                </label>
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <select
                    id="country"
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="w-full md:max-w-xl rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm sm:text-base text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl focus:border-white/35 focus:bg-white/15"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#111523] text-white">
                        {c.flag} {c.name}
                        {c.code === REFERENCE_COUNTRY_CODE ? " — First launch" : ""}
                        {c.code === DEFAULT_COUNTRY_CODE ? " — Default" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="text-sm text-white/90">
                    Selected: <span className="text-white font-medium">{selected.flag} {selected.name}</span>
                  </div>
                </div>
              </div>

              <CountryFacts country={selected} now={now} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="liquid-glass-soft rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Selected country launch</p>
              <p className="mt-2 text-lg font-semibold text-white">{selected.flag} {selected.name}</p>
              <p className="mt-3 text-sm text-white/95 leading-relaxed">
                Official local launch: <span className="text-white font-medium">{selectedLocalLaunchShort}</span>
              </p>
              <p className="mt-3 text-sm text-cyan-100/90 leading-relaxed">
                {hoursDiff === 0
                  ? "This region aligns with the New Zealand reference in this comparison."
                  : hoursDiff > 0
                    ? `This is about ${hoursDiff} hours after New Zealand's first local midnight launch.`
                    : `This is about ${Math.abs(hoursDiff)} hours before New Zealand in absolute time.`}
              </p>
            </div>
            <div className="liquid-glass-soft rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Important</p>
              <ul className="mt-3 space-y-2.5 text-sm text-white/95 leading-relaxed">
                <li>• GTA VI console release date: <span className="text-white">19 November 2026</span>.</li>
                <li>• Rockstar&apos;s stated rollout: <span className="text-white">midnight local time</span> in each region.</li>
                <li>• <span className="text-white">New Zealand</span> reaches local midnight first, so it gets the earliest official launch.</li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <div className="liquid-glass rounded-[1.75rem] p-5 sm:p-6 border-white/25">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-fuchsia-200/80">
                  From / First launch reference — in your time
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {reference.flag} {reference.name} → {selected.flag} {selected.name}
                </h2>
              </div>
              <span className="liquid-chip rounded-full px-2.5 py-1 text-xs text-emerald-100">
                Earliest
              </span>
            </div>
            <p className="mt-3 text-sm text-white/95 leading-relaxed">
              Countdown to New Zealand&apos;s official launch stays the same everywhere in real time, but the clock shown
              below is in <span className="text-white font-medium">{selected.name}</span> time, so you can see exactly when
              it happens locally for you.
            </p>

            <div className="mt-4 grid grid-cols-2 min-[420px]:grid-cols-4 gap-2">
              {[
                { l: "Days", v: String(refDiff.days) },
                { l: "Hrs", v: pad(refDiff.hours) },
                { l: "Min", v: pad(refDiff.minutes) },
                { l: "Sec", v: pad(refDiff.seconds) },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl bg-white/10 border border-white/15 p-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <div className="font-[family-name:var(--font-display)] text-2xl leading-none text-white">{x.v}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/85">{x.l}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 rounded-2xl bg-white/8 border border-white/12 p-4 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/80">NZ launch in your time</div>
                <div className="mt-1 text-white font-medium leading-snug">{nzLaunchInSelected}</div>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/80">NZ local launch</div>
                <div className="mt-1 text-white font-medium leading-snug">{nzLocalLaunch}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 border-t border-white/10 pt-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                    Your time now ({selected.name})
                  </div>
                  <div className="mt-1 font-mono text-cyan-100">{selectedNow}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/80">Current time in NZ</div>
                  <div className="mt-1 font-mono text-cyan-100">
                    {now !== null && now > 0
                      ? formatInZone(now, reference.timeZone, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                      : "Loading…"}
                  </div>
                </div>
              </div>
            </div>
            {refDiff.done && (
              <p className="mt-3 text-sm text-emerald-300 font-semibold">New Zealand launch moment has arrived.</p>
            )}
          </div>

          <div className="liquid-glass-soft rounded-2xl p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Compare countries</p>
            <p className="mt-1 text-sm text-white/95">
              Compare your country with any other region (e.g. Pakistan vs India) and see both local launch times.
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="text-[11px] uppercase tracking-[0.18em] text-white/80" htmlFor="compare-country">
                Your country
              </label>
              <label className="text-[11px] uppercase tracking-[0.18em] text-white/80" htmlFor="compare-with">
                Compare with
              </label>
              <select
                id="compare-country"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none backdrop-blur-xl focus:bg-white/15"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#111523] text-white">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <select
                id="compare-with"
                value={compareCode}
                onChange={(e) => setCompareCode(e.target.value)}
                className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none backdrop-blur-xl focus:bg-white/15"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#111523] text-white">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/95">{selected.flag} {selected.name}</span>
                <span className="text-right font-medium text-white/95">{selectedLocalLaunchShort}</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/95">{compare.flag} {compare.name}</span>
                <span className="text-right font-medium text-white/95">{compareLocalLaunchShort}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-white/95">Difference</span>
                <span className="text-right font-semibold text-cyan-100">
                  {compareDiffHours === 0
                    ? "Same live moment"
                    : compareDiffHours > 0
                      ? `${compare.name}: ${compareDiffHours}h later`
                      : `${compare.name}: ${Math.abs(compareDiffHours)}h earlier`}
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/80 leading-relaxed">
              Each region is shown at its own local midnight unlock (19 Nov 2026). Platform/store timing can vary slightly.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
