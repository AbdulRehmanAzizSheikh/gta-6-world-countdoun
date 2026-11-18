"use client";

import { useEffect, useRef, useState } from "react";
import { loadUploadedAudio, saveUploadedAudio } from "@/lib/audio-store";

type Track = { id: string; name: string; src: string };

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [presets, setPresets] = useState<Track[]>([]);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [trackId, setTrackId] = useState<string>("");
  const [customName, setCustomName] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isCustom = trackId === "custom" && !!customUrl;
  const activePreset = presets.find((p) => p.id === trackId) ?? presets[0];
  const currentName = isCustom
    ? (customName ?? "My upload")
    : activePreset?.name ?? "No tracks";
  const src = isCustom ? customUrl! : (activePreset?.src ?? "");
  const hasSource = !!src;

  // Load dynamic track list (all audio files in /public/music)
  useEffect(() => {
    fetch("/api/music", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const tracks: Track[] = Array.isArray(d?.tracks) ? d.tracks : [];
        setPresets(tracks);
        const saved = localStorage.getItem("gta6_track");
        if (saved === "custom") {
          setTrackId("custom");
        } else if (saved && tracks.some((t) => t.id === saved)) {
          setTrackId(saved);
        } else if (tracks.length > 0) {
          setTrackId(tracks[0].id);
        } else {
          setTrackId("");
        }
      })
      .catch(() => setPresets([]));
  }, []);

  // Restore saved prefs
  useEffect(() => {
    const v = localStorage.getItem("gta6_volume");
    const m = localStorage.getItem("gta6_muted");
    if (v !== null) setVolume(Math.min(1, Math.max(0, Number(v))));
    if (m !== null) setMuted(m === "1");
    // Restore uploaded audio (IndexedDB)
    loadUploadedAudio().then((saved) => {
      if (saved) {
        setCustomName(saved.name);
        setCustomUrl(saved.url);
        if (localStorage.getItem("gta6_track") === "custom") setTrackId("custom");
      }
    });
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
    setCurrentTime(0);
    setDuration(0);
    if (!src) {
      a.removeAttribute("src");
      a.load();
      setPlaying(false);
      return;
    }
    a.src = src;
    a.loop = false;
    a.volume = volume;
    a.muted = muted;
    if (playing) {
      a.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Audio progress events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onMeta = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    const onEnded = () => {
      // auto-advance to next preset if available
      if (presets.length > 0) {
        const idx = presets.findIndex((p) => p.id === trackId);
        if (idx >= 0 && idx < presets.length - 1) {
          setTrackId(presets[idx + 1].id);
          setPlaying(true);
          return;
        }
        if (idx === presets.length - 1) {
          setTrackId(presets[0].id);
          setPlaying(true);
          return;
        }
      }
      setPlaying(false);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("ended", onEnded);
    };
  }, [presets, trackId]);

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
    if (!a || !src) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = volume;
      a.muted = muted;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  function seekTo(time: number) {
    const a = audioRef.current;
    if (!a) return;
    const d = Number.isFinite(a.duration) ? a.duration : duration;
    const t = Math.min(Math.max(0, time), d || 0);
    a.currentTime = t;
    setCurrentTime(t);
  }

  function skip(delta: number) {
    const a = audioRef.current;
    if (!a) return;
    seekTo((a.currentTime || 0) + delta);
  }

  function prevTrack() {
    if (presets.length === 0) return;
    const idx = presets.findIndex((p) => p.id === trackId);
    if (idx <= 0) setTrackId(presets[presets.length - 1].id);
    else setTrackId(presets[idx - 1].id);
  }

  function nextTrack() {
    if (presets.length === 0) return;
    const idx = presets.findIndex((p) => p.id === trackId);
    if (idx === -1 || idx >= presets.length - 1) setTrackId(presets[0].id);
    else setTrackId(presets[idx + 1].id);
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
    saveUploadedAudio(file.name.replace(/\.[^.]+$/, ""), file);
    window.setTimeout(() => {
      const a = audioRef.current;
      if (a) {
        a.src = url;
        a.volume = volume;
        a.muted = muted;
        a.loop = false;
        a.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 0);
    e.target.value = "";
  }

  return (
    <div
      ref={dropdownRef}
      className="relative flex flex-col gap-3 sm:gap-4 w-full rounded-2xl border border-white/15 bg-white/10 px-3 sm:px-5 py-3 sm:py-4 text-[10px] sm:text-xs"
    >
      <audio ref={audioRef} preload="metadata" />

      {/* Row 1: left (upload + volume) | center (transport) | right (track select) */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between w-full min-w-0">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 lg:flex-1 order-2 lg:order-1">
          <label
            className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-full bg-fuchsia-500/15 border border-fuchsia-400/25 text-fuchsia-100 hover:bg-fuchsia-500/25 cursor-pointer transition-colors whitespace-nowrap shrink-0"
            title="Apna audio upload karo — sirf tumhare device pe chalega"
          >
            <span aria-hidden>📁</span>
            <span className="font-medium hidden sm:inline">Upload Music</span>
            <span className="font-medium sm:hidden">Upload</span>
            <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
          </label>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => {
                const a = audioRef.current;
                setMuted((m) => {
                  const next = !m;
                  if (a) a.muted = next;
                  return next;
                });
              }}
              aria-label={muted ? "Unmute" : "Mute"}
              className="h-9 w-9 rounded-full border border-white/15 bg-white/10 flex items-center justify-center text-sm text-white/90 hover:bg-white/20 transition-colors shrink-0"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => {
                const a = audioRef.current;
                const v = Number(e.target.value) / 100;
                setVolume(v);
                if (v > 0 && muted) setMuted(false);
                if (a) {
                  a.volume = v;
                  if (v > 0) a.muted = false;
                }
              }}
              aria-label="Volume"
              className="w-24 sm:w-32 md:w-40 h-1.5 accent-fuchsia-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Center: transport buttons */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 order-1 lg:order-2 lg:flex-1 py-1">
          <button
            onClick={prevTrack}
            disabled={presets.length === 0}
            aria-label="Previous track"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/15 bg-white/10 flex items-center justify-center text-white/90 hover:bg-white/20 disabled:opacity-40 transition-colors"
            title="Previous"
          >
            ⏮
          </button>
          <button
            onClick={() => skip(-5)}
            disabled={!hasSource}
            aria-label="Back 5 seconds"
            className="h-9 px-3 sm:h-10 sm:px-3.5 rounded-full border border-white/15 bg-white/10 text-[11px] sm:text-xs font-medium text-white/90 hover:bg-white/20 disabled:opacity-40 transition-colors"
            title="-5s"
          >
            −5s
          </button>
          <button
            onClick={togglePlay}
            disabled={!hasSource}
            aria-label={playing ? "Pause music" : "Play music"}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-amber-400 via-fuchsia-500 to-violet-600 flex items-center justify-center text-base sm:text-lg text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-lg shadow-fuchsia-900/30 mx-1"
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button
            onClick={() => skip(5)}
            disabled={!hasSource}
            aria-label="Forward 5 seconds"
            className="h-9 px-3 sm:h-10 sm:px-3.5 rounded-full border border-white/15 bg-white/10 text-[11px] sm:text-xs font-medium text-white/90 hover:bg-white/20 disabled:opacity-40 transition-colors"
            title="+5s"
          >
            +5s
          </button>
          <button
            onClick={nextTrack}
            disabled={presets.length === 0}
            aria-label="Next track"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/15 bg-white/10 flex items-center justify-center text-white/90 hover:bg-white/20 disabled:opacity-40 transition-colors"
            title="Next"
          >
            ⏭
          </button>
        </div>

        {/* Right: track selection */}
        <div className="flex items-center justify-end min-w-0 lg:flex-1 order-3">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="flex items-center gap-2 max-w-full lg:max-w-[18rem] h-9 sm:h-10 px-3.5 sm:px-4 rounded-full border border-white/15 bg-white/10 text-white/90 hover:text-white hover:bg-white/15 transition-colors truncate text-left"
          >
            <span className="truncate">🎵 {currentName}</span>
            <span aria-hidden className="text-[10px] opacity-70 shrink-0">▾</span>
          </button>
        </div>
      </div>

      {/* Row 2: seek slider (neeche) + running time */}
      <div className="flex flex-col gap-1.5 w-full px-1 sm:px-2 pt-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seekTo(Number(e.target.value))}
          disabled={!hasSource || !Number.isFinite(duration) || duration <= 0}
          aria-label="Seek"
          className="w-full h-1.5 accent-fuchsia-500 cursor-pointer disabled:opacity-40"
        />
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-white/70 tabular-nums px-0.5">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <span>{duration > 0 ? `${Math.min(100, Math.round((currentTime / duration) * 100))}%` : "0%"}</span>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Choose track"
          className="absolute left-0 top-full mt-2 z-50 w-64 sm:w-80 max-w-[92vw] rounded-2xl border border-white/15 bg-[#0f1320]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-1.5 max-h-72 overflow-y-auto"
        >
          <p className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-[0.2em] text-fuchsia-200/80">
            Music
          </p>
          {presets.length === 0 && !customUrl && (
            <p className="px-2.5 py-2 text-xs text-white/60">No tracks in /music</p>
          )}
          {presets.map((p) => (
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
