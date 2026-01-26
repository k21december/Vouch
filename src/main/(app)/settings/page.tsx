import Surface from "@/components/common/Surface";

export default function SettingsPage() {
  return (
    <Surface className="mx-auto max-w-3xl p-6">
      <div className="text-xs text-muted-foreground">Settings</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">Privacy first.</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Keep identity hidden until both agree.
      </p>

      <div className="mt-8 grid gap-3">
        {[
          { title: "Anonymous by default", desc: "Hide name + company until reveal." },
          { title: "Reveal requests", desc: "Mutual consent required." },
          { title: "Verification", desc: "Add proof-of-employment later." },
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-border/40 bg-background/30 p-5">
            <div className="text-sm font-semibold">{x.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{x.desc}</div>
          </div>
        ))}
      </div>
    </Surface>
  );
}
