"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StorageService } from "@/lib/storage";
import { Match, Candidate } from "@/types";
import { ChevronRight, MessageSquare } from "lucide-react";

export function ChatList() {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [candidates, setCandidates] = useState<Record<string, Candidate>>({});

    useEffect(() => {
        loadChats();

        // Listen for updates - reusing existing event
        const handleUpdate = () => loadChats();
        window.addEventListener("vouch:matches-changed", handleUpdate);
        return () => window.removeEventListener("vouch:matches-changed", handleUpdate);
    }, []);

    const loadChats = () => {
        // 1. Get Matches
        const allMatches = StorageService.getMatchesList("referrer");

        // 2. Filter for Active Chats (vouched)
        // "vouched" means the Referrer accepted the request.
        const activeMatches = allMatches.filter(
            (m) => m.connectionState === "vouched"
        );

        // 3. Get Candidates
        const allCandidates = StorageService.getCandidates();
        const candidateMap = allCandidates.reduce((acc, c) => {
            acc[c.id] = c;
            return acc;
        }, {} as Record<string, Candidate>);

        setMatches(activeMatches.sort((a, b) => b.updatedAt - a.updatedAt));
        setCandidates(candidateMap);
    };

    const formatTime = (ts: number) => {
        const date = new Date(ts);
        const now = new Date();
        const diff = now.getTime() - ts;

        // If today, show time
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        }
        // If this week, show day
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="mb-4 rounded-full bg-white/5 p-4">
                    <MessageSquare className="h-8 w-8 text-white/40" />
                </div>
                <p className="text-sm font-medium text-white/50">No active chats</p>
                <p className="text-xs text-white/30">Accept requests to start chatting.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {matches.map((match) => {
                const candidate = candidates[match.candidateId];
                if (!candidate) return null;

                return (
                    <div
                        key={match.id}
                        onClick={() => router.push(`/matches/${match.id}`)}
                        className="group relative flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 shadow-sm backdrop-blur-md transition-all hover:scale-[1.01] hover:bg-white/10 hover:shadow-lg cursor-pointer"
                    >
                        <div className="h-12 w-12 rounded-full border border-white/5 bg-white/10 flex items-center justify-center font-bold text-white/80">
                            {candidate.firstName[0]}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <h3 className="font-semibold text-sm truncate text-white">{candidate.firstName}</h3>
                                <span className="text-[10px] text-white/30 font-medium">
                                    {formatTime(match.updatedAt)}
                                </span>
                            </div>
                            <p className="text-xs text-white/60 truncate">
                                {candidate.currentRole}
                            </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                    </div>
                );
            })}
        </div>
    );
}
