import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = process.env.APP_URL || "https://datememaybe.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "datememaybe.net — Покана за среща, на която не могат да ти откажат",
  description:
    "Създай персонализирана линк-покана за среща, на която половинката ти не може да каже \"не\". Буквално.",
  keywords: ["покана", "среща", "любов", "романтика", "споделяем линк", "date me maybe"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "datememaybe.net — Покана за среща, на която не могат да ти откажат",
    description:
      "Създай персонализирана линк-покана за среща, на която половинката ти не може да каже \"не\". Буквално.",
    siteName: "Date Me Maybe",
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "datememaybe.net — Покана за среща, на която не могат да ти откажат",
    description:
      "Създай персонализирана линк-покана за среща, на която половинката ти не може да каже \"не\". Буквално.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
