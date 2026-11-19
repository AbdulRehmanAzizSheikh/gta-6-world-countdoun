"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { getLaunchUtcMs, getNextLaunchCountryCode } from "@/lib/launch-time";

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

function dismissKey(code: string) {
  return `gta6_launch_dismissed_${code}`;
}

function getSelectedCountryCode() {
  if (typeof window === "undefined") return getNextLaunchCountryCode();
  const saved = localStorage.getItem("gta6_country");
  if (saved && COUNTRIES.some((c) => c.code === saved)) return saved;
  return getNextLaunchCountryCode();
}

export default function LaunchFireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [countryCode, setCountryCode] = useState<string>(() => getSelectedCountryCode());
  const [launched, setLaunched] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0],
    [countryCode],
  );
  const launchMs = useMemo(() => getLaunchUtcMs(country.timeZone), [country.timeZone]);

  // Track selected country (main countdown selection) and test mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("testLaunch") === "1") setTestMode(true);

    const sync = () => {
      const code = getSelectedCountryCode();
      setCountryCode((prev) => (prev === code ? prev : code));
    };
    sync();
    const id = setInterval(sync, 1000);
    window.addEventListener("storage", sync);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Check launch for currently selected country (per-country dismissal)
  useEffect(() => {
    function isDismissedNow() {
      try {
        return localStorage.getItem(dismissKey(country.code)) === "1";
      } catch {
        return false;
      }
    }

    function check() {
      if (isDismissedNow()) {
        setShowOverlay(false);
        return;
      }
      const now = Date.now();
      if (testMode || now >= launchMs) {
        setLaunched(true);
        setShowOverlay(true);
      } else {
        setShowOverlay(false);
      }
    }

    // reset launch flag when country changes; overlay decided by check
    setLaunched(false);
    setShowOverlay(false);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [country.code, launchMs, testMode]);

  useEffect(() => {
    if (!launched || !showOverlay) return;
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
        r.vy += 0.03;
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
  }, [launched, showOverlay, country.code]);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-x-0 top-0 flex justify-center pt-6 sm:pt-10 px-4 pointer-events-none">
        <div className="pointer-events-auto liquid-glass rounded-3xl px-5 sm:px-8 py-4 sm:py-5 text-center border border-fuchsia-300/30 shadow-[0_0_60px_rgba(236,72,153,0.25)]">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-fuchsia-200/90">Launch celebration</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold accent-text">GTA 6 IS LIVE! 🎆</h2>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-fuchsia-300/40 bg-fuchsia-500/20 px-4 py-2 text-base sm:text-xl font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.25)]">
              <span className="text-xl sm:text-2xl">{country.flag}</span>
              <span>{country.name}</span>
            </div>
          </div>
          <p className="mt-3 text-sm sm:text-base text-white/90">
            Grand Theft Auto VI has officially launched in {country.flag}{" "}
            <span className="font-semibold text-white">{country.name}</span> (midnight local time).
          </p>
          <button
            type="button"
            onClick={() => {
              setShowOverlay(false);
              try {
                localStorage.setItem(dismissKey(country.code), "1");
              } catch {}
            }}
            className="mt-3 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm text-white/90 hover:bg-white/20 transition-colors"
          >
            Close celebration
          </button>
        </div>
      </div>
    </div>
  );
}
