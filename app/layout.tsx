import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
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
  title: {
    default: site.pageTitle,
    template: "%s | Manish Pamnani",
  },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.pageTitle,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: site.image,
        alt: site.pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: site.pageTitle,
    description: site.description,
    creator: "@imanishpamnani",
    images: [site.image],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="/"
          className="mx-auto block w-full max-w-3xl px-6 pt-8 text-sm font-medium text-zinc-950 dark:text-zinc-50 sm:px-8"
        >
          {site.name}
        </a>
        {children}
      </body>
    </html>
  );
}
