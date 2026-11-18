import CountdownApp from "@/components/countdown-app";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05030a]/30 via-[#05030a]/70 to-[#05030a]" />
        <div className="absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs sm:text-sm text-white/80 backdrop-blur">
                <span className="text-base">🌴</span>
                <span>Vice City vibes • Worldwide launch tracker</span>
              </div>
              <p className="mt-4 text-sm uppercase tracking-[0.35em] text-fuchsia-200/80">
                Grand Theft Auto VI
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] leading-[0.9] tracking-wide">
                <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text sunset text-glow">
                  GTA VI
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl text-white/95">
                  WORLD COUNTDOWN
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
                Track how long is left until GTA 6 officially launches in your selected country.
                Default view is set to <span className="text-white font-semibold">Pakistan</span>, with{" "}
                <span className="text-white font-semibold">New Zealand</span> shown as the first place in the world
                to reach launch (midnight local time, 19 November 2026).
              </p>
            </div>

            <div className="panel rounded-2xl p-4 sm:p-5 w-full lg:w-[340px]">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-xl sunset p-[2px]">
                  <div className="h-full w-full rounded-[10px] bg-[#0b0616] flex items-center justify-center font-[family-name:var(--font-display)] text-3xl">
                    VI
                  </div>
                  <span className="absolute inset-0 rounded-xl animate-[pulseRing_2.8s_ease-out_infinite] border border-fuchsia-300/50" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">Global release date</p>
                  <p className="text-xl font-semibold text-white">19 November 2026</p>
                  <p className="text-sm text-white/65">Midnight local time (regional rollout)</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                  <div className="text-white/45 uppercase tracking-[0.18em]">Default country</div>
                  <div className="mt-1 text-white font-medium">🇵🇰 Pakistan</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                  <div className="text-white/45 uppercase tracking-[0.18em]">First launch</div>
                  <div className="mt-1 text-white font-medium">🇳🇿 New Zealand</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <CountdownApp />

        <footer className="mt-10 sm:mt-14 border-t border-white/10 pt-6 text-sm text-white/55">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2 max-w-2xl">
              <p>
                Built as a GTA VI fan countdown for{" "}
                <span className="text-white/80">gta-6-countdown.supersoftware.agency</span>.
                Not affiliated with Rockstar Games.
              </p>
              <p>
                Source basis: Rockstar&apos;s announced 19 Nov 2026 release at midnight local time.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 text-sm">
              <div className="panel rounded-xl p-4 border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Developer Contact</p>
                <a
                  href="mailto:mail@abdulrehman.sbs"
                  className="mt-2 inline-block text-white hover:text-fuchsia-200 transition-colors"
                >
                  mail@abdulrehman.sbs
                </a>
              </div>
              <div className="panel rounded-xl p-4 border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Company / Agency
                </p>
                <p className="mt-2 text-white/90">SuperSoftware Agency</p>
                <a
                  href="mailto:hello@supersoftware.agency"
                  className="mt-1 inline-block text-white hover:text-cyan-200 transition-colors"
                >
                  hello@supersoftware.agency
                </a>
                <p className="mt-1 text-xs text-white/50">Software / web development</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
