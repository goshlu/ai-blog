"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文稿" },
  { href: "/notes", label: "手记" },
  { href: "/timeline", label: "时光" },
  { href: "/thoughts", label: "思考" },
  { href: "/more", label: "更多" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center justify-center">
      <div className="flex items-center gap-6 rounded-full bg-white/95 shadow-sm border border-pink-100 px-6 py-2 text-sm text-neutral-600">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-1 transition-colors",
                isActive
                  ? "text-pink-500"
                  : "text-neutral-600 hover:text-pink-400"
              )}
            >
              {isActive && (
                <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-pink-400 mr-1" />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

