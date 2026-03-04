import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-[#0d0e11]/75 border-b border-black/5 dark:border-white/5 transition-colors duration-500">
            <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                博客首页
              </Link>
              <div className="flex items-center gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          文章
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          关于
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          管理
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <ThemeSwitch />
              </div>
            </nav>
          </header>
          <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 min-h-[calc(100vh-200px)]">
            {children}
          </main>
          <footer className="mt-auto border-t border-black/5 dark:border-white/5 bg-transparent">
            <div className="max-w-4xl mx-auto px-6 py-6 text-center text-muted-foreground text-sm">
              © 2026 我的博客. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
