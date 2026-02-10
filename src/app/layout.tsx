import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "datememaybe.net — Покана за среща, на която не могат да ти откажат",
  description:
    "Създай персонализирана линк-покана за среща, на която половинката ти не може да каже „не". Буквално. 😏",
  keywords: ["покана", "среща", "любов", "романтика", "споделяем линк", "date me maybe"],
  icons: {
    icon: "/favicon.svg",
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
