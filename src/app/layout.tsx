import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono, Noto_Sans_Ethiopic } from 'next/font/google'
import "./globals.css";
import GlobalUI, { GlobalFooter } from "@/components/layout/GlobalUI";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
import ReferralTracker from "@/components/ReferralTracker";

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-ethiopic',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#120C0A' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "Kalsuq | Premier Fashion Store — Addis Ababa",
    template: "%s | Kalsuq Fashion"
  },
  description: "Experience premium Ethiopian fashion. Kalsuq delivers curated editorial styles, handcrafted shoes, and local craftsmanship directly to your door in Addis Ababa. Shop in ETB.",
  keywords: ["Ethiopia fashion", "Addis Ababa shoes", "Kalsuq store", "Ethiopian brands", "local craftsmanship", "ETB shopping", "African fashion"],
  authors: [{ name: "Kalsuq Creative Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kalsuq.com",
    title: "Kalsuq | Premium Ethiopian Fashion Store",
    description: "Curated fashion essentials for the modern Ethiopian lifestyle. Handcrafted quality, local soul.",
    siteName: "Kalsuq",
    images: [
      {
        url: "https://kalsuq.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kalsuq — Premium Ethiopian Fashion Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalsuq | Premium Ethiopian Fashion",
    description: "Curated fashion essentials from Addis Ababa.",
    images: ["https://kalsuq.com/og-image.jpg"],
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} ${notoEthiopic.variable} antialiased font-body bg-surface text-text-primary flex flex-col min-h-screen transition-colors duration-500 selection:bg-accent/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <ErrorBoundary>
              <GlobalUI />
              <ReferralTracker />
              <main className="flex-grow relative">{children}</main>
              <GlobalFooter />
            </ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
