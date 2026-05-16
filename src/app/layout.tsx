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

export const metadata: Metadata = {
  title: "Akhmad Rozan | Content Creator & Digital Asset Enthusiast",
  description:
    "Portfolio website for Akhmad Rozan, content creator, crypto enthusiast, and digital asset investor.",
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