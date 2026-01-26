import Surface from "@/components/common/Surface";
import SwipeDeck from "@/components/discover/SwipeDeck";

export default function DiscoverPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <Surface className="p-6">
        <div className="text-xs text-muted-foreground">Filters</div>
        <div className="mt-2 text-lg font-semibold tracking-tight">Target</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Start broad. Tighten later.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {["Finance", "SWE", "Engineering", "NYC", "Intern + FT"].map((x) => (
            <span
              key={x}
              className="rounded-full border border-border/40 bg-secondary/50 px-3 py-1 text-xs text-foreground"
            >
              {x}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-background/40 p-4 text-xs text-muted-foreground">
          Arrow keys: ← pass, → like
        </div>
      </Surface>

      <Surface className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Discover</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">
              Make one decision.
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Private profiles. Reveal only after mutual consent.
            </div>
          </div>
          <span className="rounded-full border border-border/40 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
            v1
          </span>
        </div>

        <div className="mt-8">
          <SwipeDeck />
        </div>
      </Surface>
    </div>
  );
}
