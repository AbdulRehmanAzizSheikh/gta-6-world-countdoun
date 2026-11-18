import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — GTA 6 World Countdown",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
