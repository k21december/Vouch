"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/auth/useRole";
import { clsx } from "clsx";
import { VouchWordmark } from "@/components/ui/VouchWordmark";


// Removed APP_NAME const, using hardcoded component

function NavLink({ href, label, className }: { href: string; label: string; className?: string }) {
  const pathname = usePathname();
  // Simple equality check, could require exact match or startsWith depending on needs
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={clsx("nav-item mp-reset", active && "active", className)}
    >
      {label}
    </Link>
  );
}

// "Pill" repurposed to just be a standard nav item for consistency,
// but we keep the logical separation in case we want to add back distinct styles later.
// User requested "Apply across the entire top navigation bar consistently".
function UtilityLink({
  children,
  onClick,
  href,
  disabled,
  title,
  isActiveOverride
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  title?: string;
  isActiveOverride?: boolean;
}) {
  const pathname = usePathname();
  const active = isActiveOverride || (href ? pathname === href : false);

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={clsx("nav-item", active && "active")}
        title={title}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={clsx("nav-item", active && "active")}
      title={title}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </button>
  );
}

export default function TopBar() {
  const { role } = useRole();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 pointer-events-none" // pointer-events-none lets clicks pass through empty space, we'll re-enable on children
      style={{
        background: "transparent",
        boxShadow: "none"
      }}
    >
      {/* Ambient Gradient Overlay - Improves readability */}
      <div
        className="absolute inset-0 h-32 w-full pointer-events-auto" // Re-enable pointer events for interaction area
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)", // Extra softness
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
        }}
      />

      {/* Wider container + more padding => pushes groups further indicate “app chrome” */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 pointer-events-auto">
        {/* LEFT */}
        <div className="flex items-center gap-1">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pr-2 transition-transform hover:scale-[1.02] active:scale-95"
            style={{ textDecoration: 'none' }}
          >
            <VouchWordmark
              size="md"
              className="text-2xl font-black tracking-tighter leading-none"
              style={{ color: "rgb(var(--accent))" }}
            />

          </Link>

          <nav className="flex items-center gap-1 ml-4 block border-l border-black/5 pl-4">
            {role === "referrer" ? (
              <>
                <NavLink href="/requests" label="Requests" />
                <NavLink href="/chats" label="Chats" />
              </>
            ) : (
              <>
                <NavLink href="/discover" label="Discover" />
                <NavLink href="/matches" label="Matches" />
              </>
            )}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1">
          {role === "candidate" && (
            <UtilityLink href="/portfolio">Portfolio</UtilityLink>
          )}

          {role === "referrer" && (
            <UtilityLink
              href="/post-job"
              title="Post a new job"
            >
              Post job
            </UtilityLink>
          )}

          <UtilityLink href="/settings">Settings</UtilityLink>
        </div>
      </div>
    </header>
  );
}
