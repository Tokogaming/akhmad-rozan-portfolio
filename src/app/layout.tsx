import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://akhmad-rozan-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Akhmad Rozan | Content Creator & Digital Asset Enthusiast",
    template: "%s | Akhmad Rozan",
  },

  description:
    "Portfolio website Akhmad Rozan, content creator, crypto enthusiast, and digital asset investor focused on content, crypto, market insight, and long-term digital growth.",

  keywords: [
    "Akhmad Rozan",
    "Content Creator",
    "Crypto Enthusiast",
    "Digital Asset",
    "Investor",
    "Portfolio",
    "Bitcoin",
    "Ethereum",
    "Solana",
    "YouTube Creator",
    "HERANOLOGI",
  ],

  authors: [{ name: "Akhmad Rozan", url: siteUrl }],
  creator: "Akhmad Rozan",
  publisher: "Akhmad Rozan",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Akhmad Rozan Portfolio",
    title: "Akhmad Rozan | Content Creator & Digital Asset Enthusiast",
    description:
      "Personal portfolio for content creation, crypto education, digital asset strategy, and long-term investment mindset.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Akhmad Rozan Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Akhmad Rozan | Content Creator & Digital Asset Enthusiast",
    description:
      "Personal portfolio for content creation, crypto education, digital asset strategy, and long-term investment mindset.",
    images: ["/opengraph-image"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden bg-[#05070d] text-white antialiased`}
      >
        <div className="pointer-events-none fixed left-[-120px] top-[18%] z-0 h-[360px] w-[360px] rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="pointer-events-none fixed bottom-[8%] right-[-120px] z-0 h-[360px] w-[360px] rounded-full bg-yellow-400/20 blur-[110px]" />

        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}