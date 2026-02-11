"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



import { useRole } from "@/lib/auth/useRole";

export default function BottomNav() {
  const pathname = usePathname();
  const { role } = useRole();

  const items = role === "referrer"
    ? [
      { href: "/requests", label: "Requests" },
      { href: "/chats", label: "Chats" },
      { href: "/post-job", label: "Post" },
      { href: "/settings", label: "Settings" },
    ]
    : [
      { href: "/discover", label: "Discover" },
      { href: "/matches", label: "Matches" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/settings", label: "Settings" },
    ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 pb-safe"
      style={{ background: "#ffffff", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex w-full max-w-md justify-between px-6 py-4">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex flex-col items-center gap-1 transition-opacity ${active ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
            >
              {/* Icon placeholder or just text depending on design. Using text for now as per system summary "clean hierarchy" */}
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
