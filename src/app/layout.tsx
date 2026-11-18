import type { Metadata } from "next";
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
  title: "GTA 6 World Countdown",
  description:
    "Worldwide GTA VI countdown with New Zealand first-launch reference and official local launch time for your selected country.",
  metadataBase: new URL("https://gta-6-countdown.supersoftware.agency"),
  openGraph: {
    title: "GTA 6 World Countdown",
    description:
      "Track GTA VI launch worldwide. Default view: Pakistan, with New Zealand first-launch reference.",
    url: "https://gta-6-countdown.supersoftware.agency",
    siteName: "GTA 6 World Countdown",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 World Countdown",
    description:
      "Track GTA VI launch worldwide. Default view: Pakistan, with New Zealand first-launch reference.",
  },
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
