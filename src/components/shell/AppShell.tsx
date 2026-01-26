"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/discover", label: "Discover" },
  { href: "/matches", label: "Matches" },
  { href: "/profile", label: "Profile" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/discover" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-foreground/10" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Refer</div>
              <div className="text-xs text-muted-foreground">Private matching</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-secondary/50 p-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm transition",
                    active ? "bg-card/70 shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/settings"
            className="rounded-2xl bg-secondary/60 px-4 py-2 text-sm hover:bg-secondary/80 transition"
          >
            Settings
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
