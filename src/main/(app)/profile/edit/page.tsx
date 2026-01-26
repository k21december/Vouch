import Link from "next/link";
import Surface from "@/components/common/Surface";

export default function ProfileEditPage() {
  return (
    <Surface className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Edit</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">Profile</div>
          <div className="mt-1 text-sm text-muted-foreground">Keep it clean. No essays.</div>
        </div>
        <Link
          href="/profile"
          className="rounded-2xl bg-secondary/70 px-4 py-2 text-sm hover:bg-secondary transition"
        >
          Cancel
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {[
          { label: "Skills", placeholder: "TypeScript, React, SQL..." },
          { label: "Location", placeholder: "NYC / Remote..." },
          { label: "Previous companies applied at", placeholder: "Optional / hidden..." },
        ].map((f) => (
          <label key={f.label} className="grid gap-2">
            <span className="text-sm text-muted-foreground">{f.label}</span>
            <input
              className="h-11 rounded-2xl border border-border/40 bg-background/30 px-4 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              placeholder={f.placeholder}
            />
          </label>
        ))}

        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">About</span>
          <textarea
            className="min-h-28 rounded-2xl border border-border/40 bg-background/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            placeholder="2–4 sentences."
          />
        </label>

        <div className="mt-2 flex gap-2">
          <button className="h-11 rounded-2xl bg-foreground px-5 text-sm text-background hover:opacity-90 transition">
            Save
          </button>
          <Link
            href="/profile"
            className="h-11 rounded-2xl bg-secondary/70 px-5 text-sm grid place-items-center hover:bg-secondary transition"
          >
            Done
          </Link>
        </div>
      </div>
    </Surface>
  );
}
