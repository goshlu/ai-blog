import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavTabs } from "@/components/NavTabs";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "YSKM - Full Stack Developer",
    template: "%s | YSKM",
  },
  description: "分享技术，记录生活。A Full Stack Developer 的技术博客",
  keywords: ["Next.js", "React", "TypeScript", "Full Stack", "技术博客"],
  authors: [{ name: "YSKM" }],
  creator: "YSKM",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-blog-five-sigma.vercel.app",
  ),
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh-CN",
    url: "https://ai-blog-five-sigma.vercel.app",
    siteName: "YSKM Blog",
    title: "YSKM - Full Stack Developer",
    description: "分享技术，记录生活",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YSKM Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YSKM - Full Stack Developer",
    description: "分享技术，记录生活",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafbfc] dark:bg-[#0d0e11] selection:bg-blue-500/20`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-transparent">
            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
              <nav className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 dark:bg-[#11121a]/80 border border-black/5 dark:border-white/5 px-4 py-3 shadow-sm">
                <Link
                  href="/"
                  className="text-base md:text-lg font-semibold tracking-tight"
                >
                  YSKM
                </Link>
                <NavTabs />
                <MobileNav />
              </nav>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 min-h-[calc(100vh-200px)]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
