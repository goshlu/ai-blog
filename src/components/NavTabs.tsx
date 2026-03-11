"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBox } from "@/components/SearchBox";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/posts", label: "Posts" },
  { href: "/notes", label: "Notes" },
  { href: "/timeline", label: "Timeline" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/more", label: "More" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center justify-center">
      <div className="flex items-center gap-4 rounded-full border border-pink-100 bg-white/95 px-6 py-2 text-sm text-neutral-600 shadow-sm">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-1 transition-colors",
                isActive ? "text-pink-500" : "text-neutral-600 hover:text-pink-400",
              )}
            >
              {isActive && (
                <span className="mr-1 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-pink-400" />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="h-4 w-px bg-zinc-200" />
        <SearchBox />
      </div>
    </div>
  );
}
