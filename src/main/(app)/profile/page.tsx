import Link from "next/link";
import Surface from "@/components/common/Surface";

export default function ProfilePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <Surface className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Profile</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">K21</div>
            <div className="mt-1 text-sm text-muted-foreground">NYC • Remote OK</div>
          </div>
          <Link
            href="/profile/edit"
            className="rounded-2xl bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition"
          >
            Edit
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-border/40 bg-background/30 p-6">
          <div className="text-sm font-semibold">Skills</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["TypeScript", "React", "Python", "SQL"].map((s) => (
              <span key={s} className="rounded-full border border-border/40 bg-secondary/50 px-3 py-1 text-xs">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6 text-sm font-semibold">About</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Building a referral-first matching platform. Minimal UI, high-signal matches.
          </p>

          <div className="mt-6 text-sm font-semibold">Previous companies applied at</div>
          <p className="mt-2 text-sm text-muted-foreground">Hidden by default.</p>
        </div>
      </Surface>

      <Surface className="p-6">
        <div className="text-xs text-muted-foreground">Account</div>
        <div className="mt-2 text-lg font-semibold tracking-tight">Controls</div>
        <div className="mt-4 space-y-2">
          <Link
            href="/settings"
            className="block rounded-2xl bg-secondary/70 px-4 py-3 text-sm hover:bg-secondary transition"
          >
            Settings
          </Link>
          <button className="w-full rounded-2xl bg-secondary/70 px-4 py-3 text-sm hover:bg-secondary transition">
            Start verification
          </button>
        </div>
      </Surface>
    </div>
  );
}
