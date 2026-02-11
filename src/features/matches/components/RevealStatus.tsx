export default function RevealStatus({
    status,
}: {
    status: "pending" | "accepted" | "rejected";
}) {
    if (status === "accepted") {
        return (
            <div className="flex items-center gap-2 rounded-full bg-[var(--success)]/10 px-3 py-1 text-xs font-semibold text-[var(--success)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                Contact info revealed
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
            Contact info hidden
        </div>
    );
}
