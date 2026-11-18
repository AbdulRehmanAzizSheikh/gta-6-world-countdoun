import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gta-vi-countdown.supersoftware.agency"),
  title: {
    default: "GTA 6 Countdown — GTA VI World Launch Time by Country | GTA 6 Release Date",
    template: "%s | GTA 6 World Countdown",
  },
  description:
    "GTA 6 countdown, GTA VI release time by country, GTA 6 launch date 19 November 2026 — track the Grand Theft Auto VI worldwide launch live. Pakistan, India, New Zealand, USA and every timezone. New Zealand launches first at midnight local time.",
  applicationName: "GTA 6 World Countdown",
  keywords: [
    "gta 6 countdown",
    "gta vi countdown",
    "gta 6 countdown timer",
    "gta 6 release date",
    "gta 6 launch date",
    "gta 6 launch time",
    "gta 6 release time by country",
    "gta 6 release time",
    "gta 6 release time Pakistan",
    "gta 6 Pakistan",
    "gta 6 India time",
    "gta 6 New Zealand time",
    "gta 6 USA release time",
    "gta 6 worldwide release",
    "gta 6 worldwide launch",
    "gta 6 launch countdown",
    "gta vi release date",
    "gta vi launch time",
    "grand theft auto 6 countdown",
    "grand theft auto vi countdown",
    "gta 6 kab aayegi",
    "gta 6 kab launch hogi",
    "gta 6 world countdown",
    "rockstar gta 6 release",
    "gta 6 news",
    "gta 6 release date and time",
  ],
  authors: [{ name: "Abdul Rehman", url: "https://github.com/AbdulRehmanAzizSheikh" }],
  creator: "Abdul Rehman — SuperSoftware Agency",
  publisher: "SuperSoftware Agency",
  category: "gaming",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "UGk1yEQxQWjQOVFSpdnF1-6LZLXhpyfr8JiXEmiWux8",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "GTA 6 World Countdown — GTA VI Release Time by Country",
    description:
      "Track GTA 6 launch time worldwide by country. Default view: Pakistan, first-launch reference: New Zealand. Live local countdown for every timezone.",
    url: "https://gta-vi-countdown.supersoftware.agency",
    siteName: "GTA 6 World Countdown",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 World Countdown — GTA VI Release Time by Country",
    description:
      "Track GTA 6 launch time worldwide by country. Default: Pakistan. First launch: New Zealand. Live local countdown for every timezone.",
    creator: "@SuperSoftwareAgency",
  },
};

export const viewport: Viewport = {
  themeColor: "#04050a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
