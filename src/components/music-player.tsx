"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [
  { id: "miami-viceroy", name: "Miami Viceroy", src: "/music/miami-viceroy.mp3" },
  { id: "miami-nights", name: "Miami Nights", src: "/music/miami-nights.mp3" },
  { id: "chill-wave", name: "Chill Wave", src: "/music/chill-wave.mp3" },
  { id: "neon-laser-horizon", name: "Neon Laser Horizon", src: "/music/neon-laser-horizon.mp3" },
  { id: "retrofuture-nasty", name: "RetroFuture Nasty", src: "/music/retrofuture-nasty.mp3" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [trackId, setTrackId] = useState(PRESETS[0].id);
  const [customName, setCustomName] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isCustom = trackId === "custom" && !!customUrl;
  const currentName = isCustom ? (customName ?? "My upload") : PRESETS.find((p) => p.id === trackId)?.name ?? PRESETS[0].name;
  const src = isCustom ? customUrl! : PRESETS.find((p) => p.id === trackId)?.src ?? PRESETS[0].src;

  // Restore saved prefs
  useEffect(() => {
    const v = localStorage.getItem("gta6_volume");
    const m = localStorage.getItem("gta6_muted");
    const t = localStorage.getItem("gta6_track");
    if (v !== null) setVolume(Math.min(1, Math.max(0, Number(v))));
    if (m !== null) setMuted(m === "1");
    if (t && (PRESETS.some((p) => p.id === t) || t === "custom")) setTrackId(t);
  }, []);

  // Sync volume / mute + persist
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = muted;
    localStorage.setItem("gta6_volume", String(volume));
    localStorage.setItem("gta6_muted", muted ? "1" : "0");
  }, [volume, muted]);

  useEffect(() => {
    localStorage.setItem("gta6_track", trackId);
  }, [trackId]);

  // Load chosen track
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = src;
    a.loop = true;
    if (playing) {
      a.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = volume;
      a.muted = muted;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customUrl) URL.revokeObjectURL(customUrl);
    const url = URL.createObjectURL(file);
    setCustomUrl(url);
    setCustomName(file.name.replace(/\.[^.]+$/, ""));
    setTrackId("custom");
    setOpen(false);
    window.setTimeout(() => {
      const a = audioRef.current;
      if (a) {
        a.src = url;
        a.volume = volume;
        a.muted = muted;
        a.loop = true;
        a.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 0);
    e.target.value = "";
  }

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center gap-1 rounded-full border border-white/15 bg-white/10 pl-1 pr-1 py-0.5 sm:py-1 shrink-0 text-[10px] sm:text-xs"
      title="Music — presets are free-to-use (Kevin MacLeod, CC BY 4.0). Your uploaded songs play only on YOUR device, never uploaded anywhere."
    >
      <audio ref={audioRef} preload="none" />

      {/* Play / pause */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-amber-400 via-fuchsia-500 to-violet-600 flex items-center justify-center text-[12px] sm:text-sm text-white hover:opacity-90 transition-opacity"
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Current track — opens dropdown */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1 max-w-[92px] min-[480px]:max-w-[120px] sm:max-w-[150px] lg:max-w-[170px] h-7 sm:h-8 px-1.5 sm:px-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors truncate"
      >
        <span className="truncate">🎵 {currentName}</span>
        <span aria-hidden className="text-[10px] opacity-70">▾</span>
      </button>

      {/* Big, obvious upload button */}
      <label
        className="flex items-center gap-1 h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-400/25 text-fuchsia-100 hover:bg-fuchsia-500/25 hover:border-fuchsia-400/40 cursor-pointer transition-colors whitespace-nowrap"
        title="Apna MP3 yahan upload karo — sirf tumhare device pe chalega, server pe nahi"
      >
        <span aria-hidden>📁</span>
        <span className="hidden sm:inline font-medium">Upload Music</span>
        <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
      </label>

      {/* Volume */}
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        onChange={(e) => {
          const v = Number(e.target.value) / 100;
          setVolume(v);
          if (v > 0 && muted) setMuted(false);
        }}
        aria-label="Volume"
        className="w-10 min-[480px]:w-14 sm:w-16 lg:w-20 h-1 accent-fuchsia-500 cursor-pointer"
      />

      {/* Mute / unmute */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="text-sm sm:text-base text-white/85 hover:text-white transition-colors px-0.5"
      >
        {muted || volume === 0 ? "🔇" : "🔊"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Choose track"
          className="absolute left-0 top-full mt-2 z-50 w-60 sm:w-72 rounded-2xl border border-white/15 bg-[#0f1320]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-1.5"
        >
          <p className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-[0.2em] text-fuchsia-200/80">
            GTA-style synthwave
          </p>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              role="option"
              aria-selected={trackId === p.id}
              onClick={() => {
                setTrackId(p.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs sm:text-sm transition-colors ${
                trackId === p.id
                  ? "bg-fuchsia-500/20 text-fuchsia-100"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>🎵</span>
              <span className="truncate">{p.name}</span>
              {trackId === p.id && <span className="ml-auto text-fuchsia-300">✓</span>}
            </button>
          ))}

          {customUrl && (
            <button
              role="option"
              aria-selected={trackId === "custom"}
              onClick={() => {
                setTrackId("custom");
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 rounded-xl px-2.5 py-2 mt-1 border-t border-white/10 text-left text-xs sm:text-sm transition-colors ${
                trackId === "custom"
                  ? "bg-emerald-500/15 text-emerald-100"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>📁</span>
              <span className="truncate">{customName ?? "My upload"}</span>
              {trackId === "custom" && <span className="ml-auto text-emerald-400">✓</span>}
            </button>
          )}

          <label className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 mt-1 border border-fuchsia-400/20 bg-fuchsia-500/10 text-xs sm:text-sm text-fuchsia-100 hover:bg-fuchsia-500/20 cursor-pointer transition-colors">
            <span>⬆️</span>
            <span className="font-medium">Upload your music…</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-fuchsia-300/80">Local only</span>
            <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
