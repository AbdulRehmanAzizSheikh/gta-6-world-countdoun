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
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [trackId, setTrackId] = useState(PRESETS[0].id);
  const [customName, setCustomName] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [hint, setHint] = useState(false);

  const isCustom = trackId === "custom" && !!customUrl;
  const src = isCustom ? customUrl! : PRESETS.find((p) => p.id === trackId)?.src ?? PRESETS[0].src;

  useEffect(() => {
    const v = localStorage.getItem("gta6_volume");
    const m = localStorage.getItem("gta6_muted");
    const t = localStorage.getItem("gta6_track");
    if (v !== null) setVolume(Math.min(1, Math.max(0, Number(v))));
    if (m !== null) setMuted(m === "1");
    if (t && PRESETS.some((p) => p.id === t)) setTrackId(t);
  }, []);

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
    setHint(true);
    setTimeout(() => setHint(false), 2500);
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
      className="relative flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/15 bg-white/10 pl-1 pr-1 sm:pr-2 py-1 shrink-0"
      title="Music — presets are free-to-use (Kevin MacLeod, CC BY 4.0). Your uploaded songs play only on YOUR device, never uploaded anywhere."
    >
      <audio ref={audioRef} preload="none" />

      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-amber-400 via-fuchsia-500 to-violet-600 flex items-center justify-center text-[13px] sm:text-sm text-white hover:opacity-90 transition-opacity"
      >
        {playing ? "⏸" : "▶"}
      </button>

      <select
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
        aria-label="Choose track"
        className="hidden min-[480px]:block max-w-[104px] sm:max-w-[130px] lg:max-w-[150px] h-7 sm:h-8 bg-transparent border-0 text-[10px] sm:text-xs text-white/90 outline-none [&>option]:bg-[#111523] cursor-pointer"
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            🎵 {p.name}
          </option>
        ))}
        {customUrl && <option value="custom">📁 {customName ?? "My upload"}</option>}
      </select>

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

      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="text-sm sm:text-base text-white/85 hover:text-white transition-colors"
      >
        {muted || volume === 0 ? "🔇" : "🔊"}
      </button>

      <label
        className="cursor-pointer text-sm sm:text-base text-white/85 hover:text-white transition-colors"
        title="Upload your own music — stays on your device only, never sent to any server"
        aria-label="Upload your own music (local only)"
      >
        📁
        <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
      </label>

      {hint && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-emerald-300/30 bg-emerald-500/20 px-3 py-1 text-[10px] text-emerald-100 z-50">
          Your song plays locally ✓
        </span>
      )}
    </div>
  );
}
