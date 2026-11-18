"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MusicPlayer from "@/components/music-player";

type Stats = { visits: number; likes: number; dislikes: number; subscribers: number; configured?: boolean };

const emptyStats: Stats = { visits: 0, likes: 0, dislikes: 0, subscribers: 0 };

export default function TopBar() {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [vote, setVote] = useState<"none" | "like" | "dislike">("none");
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbState, setFbState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [navHidden, setNavHidden] = useState(false);

  // Smart navbar — global listeners: ANY upward scroll (mouse wheel, trackpad,
  // touch-drag, keyboard, scrollbar) from ANY position brings the navbar back instantly.
  useEffect(() => {
    let touchY: number | null = null;
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let raf = 0;
    let pending: boolean | null = null;

    const apply = () => {
      raf = 0;
      if (pending !== null) {
        setNavHidden(pending);
        pending = null;
      }
    };
    const queue = (hide: boolean) => {
      pending = hide;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };
    const hideIfDeep = () => queue(window.scrollY > 60);

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) queue(false); // scrolling up — show navbar
      else hideIfDeep(); // scrolling down — hide when page is deep enough
    };
    const onScroll = () => {
      // Fallback for keyboard, scrollbar drags and programmatic scrolls
      const y = window.scrollY;
      if (y <= 40 || y < lastY - 2) queue(false);
      else if (y > lastY + 2) queue(true);
      lastY = y;
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? null;
      if (y === null || touchY === null) return;
      if (y > touchY + 6) queue(false); // finger moved down => scrolling up
      if (y < touchY - 6) hideIfDeep(); // finger moved up => scrolling down
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") queue(false);
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "End") hideIfDeep();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem("gta6_vote") ?? "none") as "none" | "like" | "dislike";
    setVote(stored);
    const savedEmail = localStorage.getItem("gta6_email");
    if (savedEmail) setEmail(savedEmail);
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setStats({ visits: d.visits ?? 0, likes: d.likes ?? 0, dislikes: d.dislikes ?? 0, subscribers: d.subscribers ?? 0, configured: d.configured }))
      .catch(() => {});
    if (!sessionStorage.getItem("gta6_visited")) {
      sessionStorage.setItem("gta6_visited", "1");
      fetch("/api/visit", { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          if (d?.ok) setStats((s) => ({ ...s, visits: d.visits ?? s.visits + 1 }));
        })
        .catch(() => {});
    }
  }, []);

  async function castVote(type: "like" | "dislike") {
    const prev = vote;
    let action: "add" | "remove" = "add";
    let next: "none" | "like" | "dislike" = type;
    if (prev === type) {
      action = "remove";
      next = "none";
    }
    setVote(next);
    localStorage.setItem("gta6_vote", next);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, action }),
      });
      const d = await res.json();
      if (d?.ok) setStats((s) => ({ ...s, likes: d.likes, dislikes: d.dislikes }));
    } catch {}
    if (prev !== "none" && prev !== type) {
      // switching: remove old vote
      try {
        const res = await fetch("/api/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: prev, action: "remove" }),
        });
        const d = await res.json();
        if (d?.ok) setStats((s) => ({ ...s, likes: d.likes, dislikes: d.dislikes }));
      } catch {}
    }
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      setSubState(d?.ok ? "done" : "error");
      if (d?.ok) {
        localStorage.setItem("gta6_email", email);
        setStats((s) => ({ ...s, subscribers: s.subscribers + 1 }));
        setTimeout(() => {
          setSubscribeOpen(false);
          setEmail("");
          setSubState("idle");
        }, 1800);
      }
    } catch {
      setSubState("error");
    }
  }

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    setFbState("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fbName, email: fbEmail, message: fbMessage }),
      });
      const d = await res.json();
      if (d?.ok) {
        setFbState("done");
        setTimeout(() => {
          setFeedbackOpen(false);
          setFbMessage("");
          setFbState("idle");
        }, 1600);
      } else {
        setFbState("error");
      }
    } catch {
      setFbState("error");
    }
  }

  return (
    <>
      <div
        className={`sticky top-4 sm:top-5 z-40 px-1 sm:px-2 transition-all duration-300 ease-out will-change-transform ${
          navHidden
            ? "-translate-y-[140%] opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-1.5">
          <div className="liquid-glass rounded-2xl px-2 sm:px-3 py-1.5 flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-2 text-[10px] sm:text-xs">
            {/* Line 1: brand + stats + votes + feedback + subscribe */}
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 min-w-0">
              <Link href="/" className="flex items-center gap-1 sm:gap-1.5 font-semibold text-white shrink-0" aria-label="Home — GTA 6 World Countdown">
                <img src="/brand/icon.png" alt="SuperSoftware Agency" className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg" />
              </Link>

              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs text-white/90 shrink-0" title="Total site visits">
                👁️ <span className="font-semibold text-white">{stats.visits.toLocaleString()}</span>
              </span>

              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => castVote("like")}
                  aria-pressed={vote === "like"}
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 sm:px-2.5 py-0.5 sm:py-1 transition-all ${vote === "like" ? "bg-emerald-400/25 border-emerald-300/40 text-emerald-100" : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15"}`}
                >
                  👍 <span className="font-semibold">{stats.likes.toLocaleString()}</span>
                </button>
                <button
                  onClick={() => castVote("dislike")}
                  aria-pressed={vote === "dislike"}
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 sm:px-2.5 py-0.5 sm:py-1 transition-all ${vote === "dislike" ? "bg-rose-400/25 border-rose-300/40 text-rose-100" : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15"}`}
                >
                  👎 <span className="font-semibold">{stats.dislikes.toLocaleString()}</span>
                </button>
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-white/90 hover:bg-white/15 transition-colors"
                  aria-label="Send feedback"
                >
                  💬<span className="hidden sm:inline">Feedback</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSubscribeOpen(true)}
                className="ml-auto h-7 sm:h-8 rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-600 px-3 sm:px-4 text-[10px] sm:text-xs font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap inline-flex items-center gap-1 shrink-0 justify-center"
              >
                ✉️ <span>Subscribe</span>
              </button>
            </div>

            {/* Line 2 (mobile) / right side (desktop): music stretches to fill */}
            <div className="flex items-center gap-1.5 w-full lg:flex-1 lg:min-w-0">
              <MusicPlayer />
            </div>
          </div>
        </div>
      </div>

      {subscribeOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Subscribe to launch alerts">
          <form onSubmit={subscribe} className="liquid-glass rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">✉️ Launch alerts</h3>
              <button type="button" onClick={() => { setSubscribeOpen(false); setSubState("idle"); }} className="text-white/70 hover:text-white text-xl leading-none" aria-label="Close">×</button>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Get an email the moment GTA 6 officially launches — worldwide timezone breakdown included.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Your email address"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white placeholder-white/45 outline-none focus:border-white/35 focus:bg-white/15"
              autoFocus
            />
            {subState === "error" && (
              <p className="text-xs text-rose-300">Subscribe failed — please check the email and try again.</p>
            )}
            <button
              type="submit"
              disabled={subState === "loading"}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-600 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {subState === "done" ? "Subscribed ✓" : subState === "loading" ? "Subscribing…" : "Subscribe to launch alerts"}
            </button>
            <p className="text-[10px] text-white/50 text-center">No spam. Unsubscribe anytime.</p>
          </form>
        </div>
      )}

      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={submitFeedback} className="liquid-glass rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">💬 Send feedback</h3>
              <button type="button" onClick={() => setFeedbackOpen(false)} className="text-white/70 hover:text-white text-xl leading-none" aria-label="Close">×</button>
            </div>
            <input
              value={fbName}
              onChange={(e) => setFbName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/45 outline-none focus:bg-white/15"
            />
            <input
              type="email"
              value={fbEmail}
              onChange={(e) => setFbEmail(e.target.value)}
              placeholder="Email (optional)"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/45 outline-none focus:bg-white/15"
            />
            <textarea
              required
              minLength={3}
              value={fbMessage}
              onChange={(e) => setFbMessage(e.target.value)}
              placeholder="What do you think? Suggestions, bugs, anything…"
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/45 outline-none focus:bg-white/15"
            />
            <button
              type="submit"
              disabled={fbState === "loading"}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-600 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {fbState === "done" ? "Thanks! Received ✓" : fbState === "loading" ? "Sending…" : fbState === "error" ? "Failed — try again" : "Send feedback"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
