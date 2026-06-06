import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://football-world-cup-26.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FIFA World Cup 2026 · Groups, Fixtures & Quiz",
    template: "%s · World Cup 2026",
  },
  description:
    "Everything for FIFA World Cup 2026 — 48 nations, 12 groups, full schedule, squads, and football quizzes. Countdown to kickoff in Bangladesh Standard Time.",
  keywords: [
    "FIFA World Cup 2026",
    "World Cup Groups",
    "World Cup Fixtures",
    "Football Quiz",
    "National Teams",
    "World Cup Schedule",
  ],
  authors: [{ name: "World Cup 2026" }],
  verification: {
    google: "Y_HFm9CuKforMqO1C2lrRoppIjHYHqUxTTgPtscT6Fs",
  },
  openGraph: {
    title: "FIFA World Cup 2026",
    description: "Groups, fixtures, squads & quizzes for the 2026 World Cup.",
    type: "website",
    url: "/",
    siteName: "World Cup 2026",
    locale: "en_US",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "World Cup 2026",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileTabBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
