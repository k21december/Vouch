import { Candidate, Match } from "@/types";

interface RequestCardProps {
    candidate: Candidate;
    match: Match;
    onPress: () => void;
}

function formatTimeAgo(timestamp: number) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    return "just now";
}

export default function RequestCard({ candidate, match, onPress }: RequestCardProps) {
    if (!candidate || !match) return null;

    const timeAgo = formatTimeAgo(match.createdAt);

    return (
        <div
            onClick={onPress}
            className="group relative flex w-full cursor-pointer flex-col gap-3 rounded-[var(--radius-lg)] border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 active:scale-[0.99]"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[var(--accent-weak)] flex items-center justify-center text-[var(--accent)] font-bold text-lg">
                        {candidate.firstName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white leading-tight">{candidate.firstName}</h3>
                        <p className="text-sm text-white/60 leading-tight">{candidate.jobFocus}</p>
                    </div>
                </div>
                <span className="text-xs font-medium text-[var(--muted)]">{timeAgo}</span>
            </div>

            {candidate.bio && (
                <p className="text-sm text-white/80 line-clamp-2">
                    "{candidate.bio}"
                </p>
            )}

            {/* Signal Indicators - Mocked for now */}
            <div className="flex items-center gap-2 mt-1">
                {candidate.verified && (
                    <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-white/60">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                        Verified
                    </div>
                )}
                <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                    Top Match
                </div>
            </div>
        </div>
    );
}
