import CountdownApp from "@/components/countdown-app";
import BackgroundSlideshow from "@/components/background-slideshow";
import TopBar from "@/components/top-bar";



export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <BackgroundSlideshow />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://gta-vi-countdown.supersoftware.agency/#website",
                name: "GTA 6 World Countdown",
                url: "https://gta-vi-countdown.supersoftware.agency",
                description:
                  "Track GTA 6 (Grand Theft Auto VI) launch time worldwide by country — live countdown for Pakistan, New Zealand, India and every timezone.",
                inLanguage: "en",
                publisher: { "@id": "https://gta-vi-countdown.supersoftware.agency/#org" },
              },
              {
                "@type": "Organization",
                "@id": "https://gta-vi-countdown.supersoftware.agency/#org",
                name: "SuperSoftware Agency",
                url: "https://supersoftware.agency",
                logo: {
                  "@type": "ImageObject",
                  url: "https://gta-vi-countdown.supersoftware.agency/brand/icon.png",
                },
                email: "hello@supersoftware.agency",
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 World Countdown",
                url: "https://gta-vi-countdown.supersoftware.agency",
                applicationCategory: "GameApplication",
                operatingSystem: "Web",
                description:
                  "Live GTA 6 (Grand Theft Auto VI) release countdown by country and timezone, with New Zealand first-launch reference.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                author: { "@id": "https://gta-vi-countdown.supersoftware.agency/#org" },
              },
              {
                "@type": "FAQPage",
                "@id": "https://gta-vi-countdown.supersoftware.agency/#faq",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is the GTA 6 release date?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "GTA 6 (Grand Theft Auto VI) releases on 19 November 2026 at midnight local time in every region, on PlayStation 5 and Xbox Series X|S, as confirmed by Rockstar Games.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What time does GTA 6 launch in Pakistan?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "GTA 6 launches at midnight local time on 19 November 2026 — that is 12:00 AM PKT (GMT+5) on 19 November 2026 in Pakistan.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What time does GTA 6 launch in India?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "GTA 6 launches at midnight local time on 19 November 2026 — 12:00 AM IST (GMT+5:30) in India.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Which country gets GTA 6 first?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "New Zealand gets GTA 6 first. It hits midnight local (NZDT, GMT+13) before any other region — 11:00 AM GMT on 18 November 2026. This is the earliest official GTA 6 launch window in the world.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What time does GTA 6 launch worldwide?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "GTA 6 uses a rolling midnight-local release: every country unlocks the game at 12:00 AM local time on 19 November 2026. New Zealand unlocks first (11:00 AM GMT, 18 Nov), then Australia, Asia, Europe, and the Americas last.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is GTA 6 coming to PC?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Rockstar has not announced a PC release yet. Official platforms are PlayStation 5 and Xbox Series X|S with free next-gen streaming on Xbox Cloud.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />
      <TopBar />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="liquid-glass rounded-[2rem] overflow-hidden relative border-white/20 min-h-[420px] sm:min-h-[460px] lg:min-h-[500px]">
            <img
              src="/gta6/cover-art.jpg"
              alt="Official GTA VI cover artwork with Jason and Lucia"
              className="absolute inset-0 h-full w-full object-cover object-[70%_25%] sm:object-[75%_20%] lg:object-[80%_15%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04050a]/95 via-[#04050a]/80 sm:via-[#04050a]/60 to-[#04050a]/10 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04050a] via-[#04050a]/30 to-transparent" />

            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="liquid-chip rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/95">
                    Official GTA VI artwork
                  </span>
                  <span className="liquid-chip rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/95">
                    Liquid glass
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4 sm:gap-5">
                  <div className="liquid-glass-soft rounded-2xl p-2 sm:p-3 shrink-0">
                    <img src="/gta6/gta6-logo.png" alt="GTA VI logo" className="h-12 sm:h-16 w-auto" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/90">
                      Grand Theft Auto VI
                    </p>
                    <h1 className="mt-1 text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[0.98] tracking-tight">
                      <span className="accent-text">World Countdown</span>
                    </h1>
                  </div>
                </div>

                <p className="mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-white/95">
                  Track exactly how long is left until GTA 6 launches in your country. Default view is{" "}
                  <span className="font-semibold text-white">Pakistan</span>, and the first-launch reference is{" "}
                  <span className="font-semibold text-white">New Zealand</span> — the first place on Earth to hit
                  midnight on launch day, 19 November 2026.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="liquid-chip rounded-2xl px-4 py-3">
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/75">Default country</div>
                    <div className="mt-1 text-base sm:text-lg font-semibold">🇵🇰 Pakistan</div>
                  </div>
                  <div className="liquid-chip rounded-2xl px-4 py-3">
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/75">First launch</div>
                    <div className="mt-1 text-base sm:text-lg font-semibold">🇳🇿 New Zealand</div>
                  </div>
                  <div className="liquid-chip rounded-2xl px-4 py-3">
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/75">Release</div>
                    <div className="mt-1 text-base sm:text-lg font-semibold">19 Nov 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <CountdownApp />

        <section aria-labelledby="faq-heading" className="liquid-glass-soft rounded-[1.75rem] p-5 sm:p-7 mt-6 sm:mt-8">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-white">
            GTA 6 Countdown — Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Everything about the Grand Theft Auto VI release date, launch time and rollout worldwide.
          </p>
          <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
            {[
              {
                q: "What is the GTA 6 release date?",
                a: "GTA 6 (Grand Theft Auto VI) releases on 19 November 2026 at midnight local time in every region, on PS5 and Xbox Series X|S, per Rockstar Games.",
              },
              {
                q: "What time does GTA 6 launch in Pakistan?",
                a: "Midnight local time — 12:00 AM PKT (GMT+5) on 19 November 2026. You can track the live countdown for Pakistan on this page.",
              },
              {
                q: "What time does GTA 6 launch in India?",
                a: "Midnight local time — 12:00 AM IST (GMT+5:30) on 19 November 2026.",
              },
              {
                q: "Which country gets GTA 6 first?",
                a: "New Zealand — it hits 12:00 AM NZDT (GMT+13) before anyone else: 11:00 AM GMT on 18 November 2026, the earliest official GTA 6 launch worldwide.",
              },
              {
                q: "What is the worldwide GTA 6 launch schedule?",
                a: "A rolling midnight-local unlock: New Zealand → Australia → Asia → Europe → Americas. Every country gets the game at 12:00 AM its own time on 19 November 2026.",
              },
              {
                q: "Is GTA 6 out on PC yet?",
                a: "Not announced. GTA 6 is officially on PS5 and Xbox Series X|S, with Xbox Cloud streaming also supported.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="rounded-2xl border border-white/10 bg-white/5 p-4 open:bg-white/10 transition-colors">
                <summary className="cursor-pointer font-semibold text-white/95 marker:text-fuchsia-300">
                  {q}
                </summary>
                <p className="mt-2 text-white/85 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

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
                GTA VI fan countdown for <span className="text-white/95">gta-vi-countdown.supersoftware.agency</span>.
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
