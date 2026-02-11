"use client";

import { Permission } from "@/lib/auth/role";
import { useRole } from "@/lib/auth/useRole";
import Link from "next/link";

export default function RequirePermission({
  perm,
  children,
}: {
  perm: Permission;
  children: React.ReactNode;
}) {
  const { role, can } = useRole();

  if (can(perm)) return <>{children}</>;

  return (
    <div className="rounded-2xl border p-4"
      style={{ borderColor: "rgb(var(--border))", background: "rgb(var(--card))" }}
    >
      <div className="text-sm font-semibold">Restricted</div>
      <div className="mt-1 text-sm" style={{ color: "rgb(var(--muted))" }}>
        Your current role (<span className="font-semibold">{role}</span>) can’t access this.
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href="/settings"
          className="rounded-xl border px-3 py-2 text-sm"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}
