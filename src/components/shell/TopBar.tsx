"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/discover", label: "Discover" },
  { href: "/matches", label: "Matches" },
  { href: "/profile", label: "Profile" },
];

export default function TopBar({
  title = "Refer",
  rightSlot,
}: {
  title?: string;
  rightSlot?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/discover" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-foreground/10" />
            <span className="text-sm font-semibold tracking-tight">{title}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm transition",
                    active
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {rightSlot ?? (
            <Button variant="secondary" size="sm" className="rounded-2xl">
              Filters
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
