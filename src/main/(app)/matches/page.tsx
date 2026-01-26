import Link from "next/link";
import Surface from "@/components/common/Surface";

const demoMatches = [
  { id: "m1", name: "AnonSWE", role: "Backend / Fullstack", last: "What roles are you targeting?", time: "2h" },
  { id: "m2", name: "AnonFin", role: "IB Analyst", last: "NYC or remote?", time: "1d" },
];

export default function MatchesPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <Surface className="p-6">
        <div className="text-xs text-muted-foreground">Matches</div>
        <div className="mt-2 text-xl font-semibold tracking-tight">Inbox</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Anonymous chat. Share contact only after mutual consent.
        </p>

        <div className="mt-6 space-y-2">
          {demoMatches.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="block rounded-2xl border border-border/40 bg-background/30 p-4 hover:bg-background/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.time}</div>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{m.role}</div>
              <div className="mt-2 text-xs text-muted-foreground truncate">{m.last}</div>
            </Link>
          ))}
        </div>
      </Surface>

      <Surface className="p-10">
        <div className="text-sm text-muted-foreground">
          Select a match on the left to chat.
        </div>
      </Surface>
    </div>
  );
}
