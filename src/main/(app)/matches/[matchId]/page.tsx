import Link from "next/link";
import Surface from "@/components/common/Surface";

export default async function MatchChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Surface className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Chat</div>
            <div className="mt-2 text-xl font-semibold tracking-tight">
              Match {matchId}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Anonymous until mutual reveal.
            </div>
          </div>

          <Link
            href="/matches"
            className="rounded-2xl bg-secondary/70 px-4 py-2 text-sm hover:bg-secondary transition"
          >
            Back
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <div className="max-w-[70%] rounded-2xl bg-background/30 p-3 text-sm text-muted-foreground">
            Hey — what roles are you targeting?
          </div>
          <div className="ml-auto max-w-[70%] rounded-2xl bg-foreground/10 p-3 text-sm">
            SWE internships + early-stage roles.
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <input
            className="h-11 flex-1 rounded-2xl border border-border/40 bg-background/30 px-4 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            placeholder="Message..."
          />
          <button className="h-11 rounded-2xl bg-foreground px-4 text-sm text-background hover:opacity-90 transition">
            Send
          </button>
        </div>
      </Surface>

      <Surface className="p-6">
        <div className="text-xs text-muted-foreground">Privacy</div>
        <div className="mt-2 text-lg font-semibold tracking-tight">Reveal</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Request contact details. Reveal only if both accept.
        </p>

        <button className="mt-6 h-11 w-full rounded-2xl bg-secondary/70 text-sm hover:bg-secondary transition">
          Request LinkedIn / Phone
        </button>

        <div className="mt-3 text-xs text-muted-foreground">
          No names or companies required until verification exists.
        </div>
      </Surface>
    </div>
  );
}
