"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/auth/useRole";
import { clsx } from "clsx";
import { VouchWordmark } from "@/components/ui/VouchWordmark";

function NavLink({ href, label, exact, className }: { href: string; label: string; exact?: boolean; className?: string }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={clsx("nav-item mp-reset", active && "active", className)}
    >
      {label}
    </Link>
  );
}

function UtilityLink({
  children,
  onClick,
  href,
  disabled,
  title,
  exact,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  title?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = href
    ? exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/")
    : false;

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
      className="fixed top-0 left-0 w-full z-50 pointer-events-none"
      style={{
        background: "transparent",
        boxShadow: "none"
      }}
    >
      <div
        className="absolute inset-0 h-32 w-full pointer-events-auto"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 pointer-events-auto">
        {/* LEFT */}
        <div className="flex items-center gap-1">
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
                <NavLink href="/referrer" label="Home" exact />
                <NavLink href="/referrer/dashboard" label="Dashboard" />
              </>
            ) : (
              <>
                <NavLink href="/candidate" label="Home" exact />
                <NavLink href="/candidate/discover" label="Discover" />
                <NavLink href="/candidate/matches" label="Matches" />
              </>
            )}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1">
          {role === "candidate" && (
            <UtilityLink href="/candidate/profile">Profile</UtilityLink>
          )}

          {role === "referrer" && (
            <UtilityLink
              href="/referrer/post-job"
              title="Post a new job"
            >
              Post job
            </UtilityLink>
          )}

          <UtilityLink href="/settings" exact>Settings</UtilityLink>
        </div>
      </div>
    </header>
  );
}
