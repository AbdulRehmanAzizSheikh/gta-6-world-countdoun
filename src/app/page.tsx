import CountdownApp from "@/components/countdown-app";
import BackgroundSlideshow from "@/components/background-slideshow";

const viceCityArt = "/gta6/vice-city-postcard.jpg";
const viLogo = "/gta6/gta6-logo.png";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <BackgroundSlideshow />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="liquid-glass rounded-[2rem] p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="liquid-chip rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/90">
                    Official GTA VI artwork
                  </span>
                  <span className="liquid-chip rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/90">
                    Liquid glass UI
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4 sm:gap-5">
                  <div className="liquid-glass-soft rounded-2xl p-2 sm:p-3 shrink-0">
                    <img src={viLogo} alt="GTA VI logo" className="h-12 sm:h-16 w-auto" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-white/95">
                      Grand Theft Auto VI
                    </p>
                    <h1 className="mt-1 text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight text-balance">
                      <span className="accent-text">World Countdown</span>
                    </h1>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-white/95">
                  Check how long is left until GTA 6 officially launches in your selected country.
                  Default view is <span className="font-semibold text-white">Pakistan</span>, and the{" "}
                  <span className="font-semibold text-white">from / first-launch reference</span> is{" "}
                  <span className="font-semibold text-white">New Zealand</span> because it reaches
                  midnight local time first on 19 November 2026.
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <div className="liquid-chip rounded-2xl px-4 py-2.5">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/80">Default country</div>
                    <div className="mt-1 text-sm sm:text-base font-medium">🇵🇰 Pakistan</div>
                  </div>
                  <div className="liquid-chip rounded-2xl px-4 py-2.5">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/80">From / first launch</div>
                    <div className="mt-1 text-sm sm:text-base font-medium">🇳🇿 New Zealand</div>
                  </div>
                  <div className="liquid-chip rounded-2xl px-4 py-2.5">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/80">Release</div>
                    <div className="mt-1 text-sm sm:text-base font-medium">19 Nov 2026 • Midnight local</div>
                  </div>
                </div>
              </div>

              <div className="liquid-glass-soft rounded-[1.5rem] overflow-hidden">
                <div className="relative h-44 sm:h-52 lg:h-64">
                  <img
                    src={viceCityArt}
                    alt="Official GTA VI Vice City postcard artwork"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/95">Official artwork</p>
                    <p className="mt-1 text-lg sm:text-xl font-semibold">Vice City, State of Leonida</p>
                    <p className="mt-1 text-sm text-white/95">Rockstar Games media artwork</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <CountdownApp />

        <footer className="mt-6 sm:mt-8 liquid-glass-soft rounded-[1.75rem] p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="liquid-glass rounded-2xl p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">About the developer</p>
              <p className="mt-2 text-base sm:text-xl font-semibold text-white">Abdul Rehman</p>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/95">
                Full-stack web & software developer and founder of <span className="text-white font-medium">SuperSoftware Agency</span>.
                Builds fast, modern web experiences with Next.js and TypeScript — including this GTA VI world
                countdown (default: Pakistan, first-launch reference: New Zealand).
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/85">
                <span className="rounded-full border border-white/15 px-2.5 py-1">Next.js / React</span>
                <span className="rounded-full border border-white/15 px-2.5 py-1">TypeScript</span>
                <span className="rounded-full border border-white/15 px-2.5 py-1">Tailwind CSS</span>
                <span className="rounded-full border border-white/15 px-2.5 py-1">Full-stack</span>
              </div>
              <a
                href="https://github.com/AbdulRehmanAzizSheikh"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm sm:text-base text-cyan-100 hover:text-white transition-colors"
              >
                github.com/AbdulRehmanAzizSheikh ↗
              </a>
              <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed border-t border-white/10 pt-3">
                GTA VI fan countdown for <span className="text-white/95">gta-6-countdown.supersoftware.agency</span>.
                Not affiliated with Rockstar Games. Timing basis: Rockstar&apos;s announced console release on 19
                November 2026 at midnight local time. Images shown are official Rockstar Games GTA VI artwork/media.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="liquid-glass rounded-2xl p-4 sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Developer Contact</p>
                <p className="mt-2 text-base font-semibold text-white">Abdul Rehman</p>
                <a
                  href="mailto:mail@abdulrehman.sbs"
                  className="mt-2 inline-block text-sm text-cyan-100 hover:text-white transition-colors break-all"
                >
                  mail@abdulrehman.sbs
                </a>
              </div>
              <div className="liquid-glass rounded-2xl p-4 sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Company / Agency</p>
                <p className="mt-2 text-base font-semibold text-white">SuperSoftware Agency</p>
                <a
                  href="mailto:hello@supersoftware.agency"
                  className="mt-2 inline-block text-sm text-pink-100 hover:text-white transition-colors break-all"
                >
                  hello@supersoftware.agency
                </a>
                <p className="mt-1 text-xs text-white/80">Web & software development</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
