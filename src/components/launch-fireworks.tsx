"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, REFERENCE_COUNTRY_CODE } from "@/lib/countries";

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

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  gravity: number;
  fade: number;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
};

const COLORS = ["#ff4fd8", "#ffd166", "#7cf7ff", "#a78bfa", "#34d399", "#fb7185", "#60a5fa", "#f97316"];

export default function LaunchFireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [launched, setLaunched] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const nz = useMemo(
    () => COUNTRIES.find((c) => c.code === REFERENCE_COUNTRY_CODE) ?? COUNTRIES[0],
    [],
  );
  const launchMs = useMemo(() => getLaunchUtcMs(nz.timeZone), [nz.timeZone]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("testLaunch") === "1") setTestMode(true);
    }
  }, []);

  useEffect(() => {
    function check() {
      const now = Date.now();
      if (testMode || now >= launchMs) {
        setLaunched(true);
        setShowOverlay(true);
      }
    }
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [launchMs, testMode]);

  useEffect(() => {
    if (!launched) return;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const canvas = canvasEl;
    const ctx = ctx2d;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const rockets: Rocket[] = [];
    const particles: Particle[] = [];
    let lastSpawn = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnRocket() {
      const x = Math.random() * w * 0.8 + w * 0.1;
      const targetY = Math.random() * h * 0.35 + h * 0.1;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      rockets.push({
        x,
        y: h + 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 3 + 7),
        targetY,
        color,
        exploded: false,
      });
    }

    function explode(r: Rocket) {
      const count = 50 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = Math.random() * 3.5 + 1.2;
        particles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          color: r.color,
          size: Math.random() * 2.2 + 1,
          gravity: 0.04 + Math.random() * 0.03,
          fade: 0.012 + Math.random() * 0.01,
        });
      }
      // secondary sparkle ring sometimes
      if (Math.random() > 0.5) {
        const c2 = COLORS[Math.floor(Math.random() * COLORS.length)];
        for (let i = 0; i < 24; i++) {
          const angle = (Math.PI * 2 * i) / 24;
          const speed = Math.random() * 1.8 + 0.6;
          particles.push({
            x: r.x,
            y: r.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 1,
            color: c2,
            size: Math.random() * 1.5 + 0.8,
            gravity: 0.03,
            fade: 0.016,
          });
        }
      }
    }

    function tick(ts: number) {
      if (!running) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (ts - lastSpawn > 450) {
        spawnRocket();
        if (Math.random() > 0.6) spawnRocket();
        lastSpawn = ts;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.03; // slight gravity
        // trail
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (r.vy >= -1 || r.y <= r.targetY) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= p.fade;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(tick);
    }

    ctx.clearRect(0, 0, w, h);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [launched]);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-x-0 top-0 flex justify-center pt-6 sm:pt-10 px-4 pointer-events-none">
        <div className="pointer-events-auto liquid-glass rounded-3xl px-5 sm:px-8 py-4 sm:py-5 text-center border border-fuchsia-300/30 shadow-[0_0_60px_rgba(236,72,153,0.25)]">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-fuchsia-200/90">First in the world</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold accent-text">GTA 6 IS LIVE! 🎆</h2>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-fuchsia-300/40 bg-fuchsia-500/20 px-4 py-2 text-base sm:text-xl font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.25)]">
              <span className="text-xl sm:text-2xl">{nz.flag}</span>
              <span>{nz.name}</span>
            </div>
          </div>
          <p className="mt-3 text-sm sm:text-base text-white/90">
            Grand Theft Auto VI has officially launched in {nz.flag} <span className="font-semibold text-white">{nz.name}</span> — the first country to hit midnight on 19 November 2026.
          </p>
          <button
            type="button"
            onClick={() => setShowOverlay(false)}
            className="mt-3 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm text-white/90 hover:bg-white/20 transition-colors"
          >
            Close celebration
          </button>
        </div>
      </div>
    </div>
  );
}
