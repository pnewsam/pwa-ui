import type { Metadata, Viewport } from "next";

import { PWAProvider } from "../../../registry/components/pwa-provider/pwa-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pwaui.com"),
  title: {
    default: "PWA UI — React components for mobile-first PWAs",
    template: "%s — PWA UI",
  },
  description:
    "Documentation and examples for source-owned React components built for mobile-first PWAs.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "PWA UI",
    title: "PWA UI — React components for mobile-first PWAs",
    description: "Source-owned React components for safe areas, mobile navigation, software keyboards, installation, updates, and offline states.",
  },
  twitter: {
    card: "summary",
    title: "PWA UI",
    description: "Source-owned React components for mobile-first PWAs.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><PWAProvider>{children}</PWAProvider></body>
    </html>
  );
}
