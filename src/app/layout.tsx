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
  title: "我的博客",
  description: "分享技术，记录生活",
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
                <Link href="/" className="text-base md:text-lg font-semibold tracking-tight">
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
