import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Valentine Link 💝 — Персонализирани покани за Св. Валентин",
  description:
    "Създай и сподели уникална, персонализирана покана за Св. Валентин. Най-сладкият начин да поканиш някого да бъде твоят Валентин!",
  keywords: ["валентин", "покана", "любов", "романтика", "споделяем линк"],
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
