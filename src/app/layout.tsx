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
  metadataBase: new URL("https://gta-6-countdown.supersoftware.agency"),
  title: {
    default: "GTA 6 World Countdown — GTA VI Release Time by Country",
    template: "%s | GTA 6 World Countdown",
  },
  description:
    "Track GTA 6 (Grand Theft Auto VI) launch time worldwide by country. See the official GTA VI release countdown for Pakistan, India, New Zealand and every timezone — New Zealand launches first. Live local launch clock, global compare and more.",
  applicationName: "GTA 6 World Countdown",
  keywords: [
    "GTA 6",
    "GTA VI",
    "GTA 6 countdown",
    "GTA 6 release date",
    "GTA 6 launch time",
    "GTA 6 Pakistan",
    "GTA 6 India",
    "GTA 6 New Zealand",
    "GTA 6 release time by country",
    "GTA 6 worldwide launch",
    "Grand Theft Auto 6",
    "GTA 6 release Pakistan time",
  ],
  authors: [{ name: "Abdul Rehman", url: "https://github.com/AbdulRehmanAzizSheikh" }],
  creator: "Abdul Rehman — SuperSoftware Agency",
  publisher: "SuperSoftware Agency",
  category: "gaming",
  alternates: {
    canonical: "/",
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
    url: "https://gta-6-countdown.supersoftware.agency",
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
