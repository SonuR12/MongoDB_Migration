import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MongoDBMigrate — MongoDB Migration Tool",
  description: "Migrate MongoDB data between clusters without terminal commands. No mongodump, no mongorestore. Secure, fast, and selective database migration.",
  keywords: ["MongoDB", "migration", "database", "mongodump", "mongorestore", "Atlas", "cluster", "data transfer"],
  authors: [{ name: "MongoDBMigrate" }],
  creator: "MongoDBMigrate",
  publisher: "MongoDBMigrate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mongodbmigrate.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "MongoDBMigrate — MongoDB Migration Tool",
    description: "Migrate MongoDB data between clusters without terminal commands. No mongodump, no mongorestore. Secure, fast, and selective database migration.",
    url: 'https://mongodbmigrate.vercel.app',
    siteName: 'MongoDBMigrate',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MongoDBMigrate — MongoDB Migration Tool",
    description: "Migrate MongoDB data between clusters without terminal commands. No mongodump, no mongorestore. Secure, fast, and selective database migration.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        sizes: '512x512', 
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><TooltipProvider>{children}</TooltipProvider></body>
    </html>
  );
}
