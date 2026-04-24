import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mongodb-migrate.vercel.app';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MongoDBMigrate';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'MongoDB Migration Tool, made for developers. No mongodump, no mongorestore. Secure, fast, and selective database migration.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MongoDBMigrate: MongoDB Migration Tool, made for developers',
    template: `%s | ${siteName}`,
  },
  description: 'MongoDB Migration Tool, made for developers. No mongodump, no mongorestore. Secure, fast, and selective database migration.',
  applicationName: 'MongoDBMigrate',
  keywords: [
    'MongoDB Migration Tool',
    'MongoDB Migration',
    'migration',
    'database',
    'mongodump',
    'mongorestore',
    'Atlas',
    'cluster',
    'data transfer',
    'database migration',
    'MongoDB Atlas',
    'cluster migration',
    'database transfer',
    'MongoDB tool',
    'data migration',
    'NoSQL migration',
    'MongoDB backup',
    'database sync'
  ],
  authors: [{ name: 'MongoDBMigrate Team' }],
  creator: 'MongoDBMigrate',
  publisher: 'MongoDBMigrate',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: 'MongoDBMigrate: MongoDB Migration Tool, made for developers',
    description: 'MongoDB Migration Tool, made for developers. No mongodump, no mongorestore. Secure, fast, and selective database migration.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MongoDBMigrate: MongoDB Migration Tool, made for developers',
    description: 'MongoDB Migration Tool, made for developers. No mongodump, no mongorestore. Secure, fast, and selective database migration.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": siteUrl,
      "description": siteDescription,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <Script id="json-ld" type="application/ld+json">{JSON.stringify(jsonLd)}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}