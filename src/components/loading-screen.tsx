"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      // small delay so transition feels smooth
      setFade(true);
      window.setTimeout(() => setVisible(false), 700);
    };

    if (document.readyState === "complete") {
      const t = window.setTimeout(finish, 600);
      return () => window.clearTimeout(t);
    }

    const onLoad = () => {
      window.setTimeout(finish, 400);
    };
    window.addEventListener("load", onLoad);
    // fallback in case load is slow/hangs
    const fallback = window.setTimeout(finish, 5000);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Loading"
      aria-busy="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#04050a] transition-opacity duration-700 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.18),transparent_35%)]" />
      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <img
          src="/gta6/gta6-logo.png"
          alt="GTA VI"
          className="h-20 sm:h-28 w-auto drop-shadow-[0_0_30px_rgba(236,72,153,0.35)]"
        />
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">Grand Theft Auto VI</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-semibold accent-text">Loading</h1>
        </div>
        <div className="mt-2 w-56 sm:w-72 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-600 animate-[loadingbar_1.2s_ease-in-out_infinite]" />
        </div>
        <p className="text-xs sm:text-sm text-white/60">Preparing Vice City…</p>
      </div>
      <style jsx>{`
        @keyframes loadingbar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
}
