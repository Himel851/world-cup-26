import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Navbar } from "@/components/layout/Navbar";
import { SiteAtmosphere } from "@/components/layout/SiteAtmosphere";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { GOOGLE_SITE_VERIFICATION, NEXT_PUBLIC_GA_MEASUREMENT_ID } from "@/config/global-variables";
import { createPageMetadata, SITE_NAME, SITE_URL, WC26_KEYWORDS } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = NEXT_PUBLIC_GA_MEASUREMENT_ID;

const defaultMeta = createPageMetadata({
  title: "FIFA World Cup 2026 · Groups, Fixtures & Quiz",
  description:
    "Everything for FIFA World Cup 2026 — 48 nations, 12 groups, full schedule, squads, Best XI builder, and football quizzes. Countdown to kickoff.",
  path: "/",
  absoluteTitle: true,
  keywords: [
    ...WC26_KEYWORDS,
    "World Cup Groups",
    "World Cup Fixtures",
    "Football Quiz",
    "Best XI",
    "National Teams",
    "World Cup Schedule",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FIFA World Cup 2026 · Groups, Fixtures & Quiz",
    template: `%s · ${SITE_NAME}`,
  },
  description: defaultMeta.description,
  keywords: defaultMeta.keywords,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true },
    verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  openGraph: defaultMeta.openGraph,
  twitter: defaultMeta.twitter,
  alternates: defaultMeta.alternates,
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
          <SiteAtmosphere>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileTabBar />
          </SiteAtmosphere>
        </ThemeProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
