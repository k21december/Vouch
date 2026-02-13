"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/auth/useRole";

export default function BottomNav() {
  const pathname = usePathname();
  const { role } = useRole();

  const items = role === "referrer"
    ? [
      { href: "/referrer", label: "Home", exact: true },
      { href: "/referrer/dashboard", label: "Dashboard", exact: false },
      { href: "/referrer/post-job", label: "Post", exact: false },
      { href: "/settings", label: "Settings", exact: true },
    ]
    : [
      { href: "/candidate", label: "Home", exact: true },
      { href: "/candidate/discover", label: "Discover", exact: false },
      { href: "/candidate/matches", label: "Matches", exact: false },
      { href: "/candidate/profile", label: "Profile", exact: false },
    ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 pb-safe"
      style={{ background: "#ffffff", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex w-full max-w-md justify-between px-6 py-4">
        {items.map((i) => {
          const active = i.exact
            ? pathname === i.href
            : pathname === i.href || pathname.startsWith(i.href + "/");
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex flex-col items-center gap-1 transition-opacity ${active ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: active ? "rgb(var(--accent))" : "rgba(0,0,0,0.4)",
                  opacity: active ? 1 : undefined
                }}
              >
                {i.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
