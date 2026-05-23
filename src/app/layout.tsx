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
    default: "World Cup Challenge · FIFA 2026",
    template: "%s · World Cup Challenge",
  },
  description:
    "Test your football IQ across all 48 FIFA World Cup 2026 nations. Flag quizzes, captains, rankings, daily challenges and a global leaderboard.",
  keywords: [
    "FIFA World Cup 2026",
    "Football Quiz",
    "Soccer Quiz",
    "National Teams",
    "World Cup Challenge",
  ],
  authors: [{ name: "World Cup Challenge" }],
  verification: {
    google: "Y_HFm9CuKforMqO1C2lrRoppIjHYHqUxTTgPtscT6Fs",
  },
  openGraph: {
    title: "World Cup Challenge",
    description: "Test Your Football IQ — FIFA World Cup 2026 quizzes.",
    type: "website",
    url: "/",
    siteName: "World Cup Challenge",
    locale: "en_US",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "World Cup Challenge",
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
