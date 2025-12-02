import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LYRIONA - Musik Management Platform",
  description: "Die moderne Plattform für dein Musik-Management. Verwalte Noten, tracke Ziele und organisiere Termine.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LYRIONA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFD700" />
      </head>
      <body className="antialiased">
        {children}
        
        {/* Footer mit rechtlichen Links - erscheint auf ALLEN Seiten */}
        <Footer />
        
        {/* Cookie Banner - erscheint beim ersten Besuch */}
        <CookieBanner />
      </body>
    </html>
  );
}