"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Overview = {
  ok: boolean;
  visits: number;
  likes: number;
  dislikes: number;
  display?: { visits: number; likes: number; dislikes: number };
  subscribers: { email: string; subscribedAt: string }[];
  feedbacks: { name: string; email: string; message: string; createdAt: string }[];
};

function fmt(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"loading" | "locked" | "inside" | "error">("loading");
  const [data, setData] = useState<Overview | null>(null);
  const [loginError, setLoginError] = useState(false);

  async function load() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (res.status === 401) {
        setState("locked");
        return;
      }
      const d = await res.json();
      if (d?.ok) {
        setData(d);
        setState("inside");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(false);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      load();
    } else {
      setLoginError(true);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setState("locked");
    setData(null);
  }

  return (
    <main className="relative min-h-screen text-white">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/gta6/cover-art.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/70 via-[#04050a]/85 to-[#04050a]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-fuchsia-200/80">GTA VI World Countdown</p>
            <h1 className="mt-1 text-2xl sm:text-4xl font-semibold">🛠️ Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="liquid-chip rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/90 hover:text-white">
              ← Back to site
            </Link>
            {state === "inside" && (
              <button onClick={logout} className="liquid-chip rounded-full px-3 py-1.5 text-xs sm:text-sm text-rose-200 hover:text-rose-100">
                Logout
              </button>
            )}
          </div>
        </header>

        {state === "loading" && (
          <div className="liquid-glass rounded-3xl p-8 text-center text-white/90">Loading…</div>
        )}

        {state === "locked" && (
          <form onSubmit={login} className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-4">
            <div className="text-center">
              <div className="text-4xl">🔒</div>
              <h2 className="mt-2 text-xl font-semibold">Admin access</h2>
              <p className="mt-1 text-sm text-white/80">Enter the admin password to view stats, subscribers & feedback.</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/45 outline-none focus:bg-white/15"
            />
            {loginError && <p className="text-sm text-rose-300">Wrong password.</p>}
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-600 py-3 text-sm font-semibold hover:opacity-90">
              Unlock panel
            </button>
          </form>
        )}

        {state === "error" && (
          <div className="liquid-glass rounded-3xl p-8 text-center">
            <p className="text-rose-200 font-medium">Couldn&apos;t load admin data.</p>
            <button onClick={load} className="mt-3 liquid-chip rounded-full px-4 py-2 text-sm">Retry</button>
          </div>
        )}

        {state === "inside" && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total visits", value: data.visits, icon: "👁️" },
                { label: "Likes", value: data.likes, icon: "👍" },
                { label: "Dislikes", value: data.dislikes, icon: "👎" },
                { label: "Subscribers", value: data.subscribers.length, icon: "📧" },
              ].map((s) => (
                <div key={s.label} className="liquid-glass rounded-2xl p-4 sm:p-5">
                  <div className="text-2xl">{s.icon}</div>
                  <div className="mt-2 text-2xl sm:text-3xl font-bold">{s.value.toLocaleString()}</div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {data.display && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs sm:text-sm text-white/70">
                <span className="font-semibold text-white/85">Public site par dikh rahe hain:</span>{" "}
                👁️ {data.display.visits.toLocaleString()} visits · 👍 {data.display.likes.toLocaleString()} likes · 👎{" "}
                {data.display.dislikes.toLocaleString()} dislikes
              </div>
            )}

            <section className="liquid-glass rounded-3xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">📧 Subscribers ({data.subscribers.length})</h2>
              </div>
              {data.subscribers.length === 0 ? (
                <p className="mt-3 text-white/70">No subscribers yet.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/60 border-b border-white/10">
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2">Subscribed at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.subscribers.map((s, i) => (
                        <tr key={s.email + i} className="border-b border-white/5">
                          <td className="py-2 pr-4 text-white/60">{i + 1}</td>
                          <td className="py-2 pr-4 font-medium text-cyan-100 break-all">{s.email}</td>
                          <td className="py-2 text-white/80">{fmt(s.subscribedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="liquid-glass rounded-3xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold">💬 Feedback ({data.feedbacks.length})</h2>
              {data.feedbacks.length === 0 ? (
                <p className="mt-3 text-white/70">No feedback yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {data.feedbacks.map((f, i) => (
                    <li key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/65">
                        <span className="font-semibold text-white">{f.name}</span>
                        {f.email && <span className="break-all">{f.email}</span>}
                        <span>{fmt(f.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm sm:text-base text-white/95 whitespace-pre-wrap">{f.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
