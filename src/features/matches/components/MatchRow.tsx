import Link from "next/link";

interface MatchRowProps {
    id: string;
    name: string;
    lastMessage?: string;
    timestamp: string;
    isUnread?: boolean;
}

export default function MatchRow({
    id,
    name,
    lastMessage,
    timestamp,
    isUnread,
}: MatchRowProps) {
    const initial = name.charAt(0).toUpperCase();

    return (
        <Link
            href={`/matches/${id}`}
            className="flex items-center gap-4 py-4 transition-opacity hover:opacity-80 active:opacity-60"
        >
            <div className="relative">
                <div
                    className="h-14 w-14 overflow-hidden rounded-full flex items-center justify-center font-bold text-xl"
                    style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                >
                    {initial}
                </div>
                {isUnread && (
                    <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-[var(--bg)]" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h3
                        className={`text-lg transition-colors ${isUnread ? "font-bold text-white" : "font-medium text-white/90"
                            }`}
                    >
                        {name}
                    </h3>
                    <span className="text-xs text-[var(--muted)]">{timestamp}</span>
                </div>
                <p
                    className={`truncate text-sm ${isUnread ? "text-white font-medium" : "text-[var(--muted)]"
                        }`}
                >
                    {lastMessage || "It's a match! Say hello."}
                </p>
            </div>
        </Link>
    );
}
