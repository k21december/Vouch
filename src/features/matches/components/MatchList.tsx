import MatchRow from "./MatchRow";
import { StorageService } from "@/lib/storage";
import { useMatches } from "@/hooks/useMatches";
import { useRole } from "@/lib/auth/useRole";
import { useEffect, useState } from "react";
import { Candidate } from "@/types";

interface MatchListProps {
    filterState?: string[];
}

export default function MatchList({ filterState }: MatchListProps) {
    const { matches: allMatches } = useMatches();
    const { role } = useRole();
    const [candidates, setCandidates] = useState<Record<string, Candidate>>({});

    const matches = filterState
        ? allMatches.filter(m => filterState.includes(m.connectionState))
        : allMatches;

    // Load candidates on mount to join
    useEffect(() => {
        const all = StorageService.getCandidates();
        const map = all.reduce((acc, c) => {
            acc[c.id] = c;
            return acc;
        }, {} as Record<string, Candidate>);
        setCandidates(map);
    }, []);

    if (matches.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-4 text-4xl">👀</div>
                <h3 className="text-lg font-medium text-white">No matches yet</h3>
                <p className="text-sm text-[var(--muted)]">
                    Keep swiping to find your next opportunity.
                </p>
            </div>
        );
    }

    // Helper to format time relative
    const formatTime = (ts: number) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        return "1d";
    };

    return (
        <div className="flex flex-col divide-y divide-white/5">
            {matches.map((match) => {
                // Determine other party ID
                // If I am referrer, I want candidate info.
                // If I am candidate, I want referrer info? 
                // Wait, Candidate interface has 'firstName'. 
                // Referrer interface is separate. 
                // For now, simpler: matches always link to candidateId. 
                // If role is candidate, we might want to show Referrer Name? 
                // But local storage 'candidates' only stores Candidates. 
                // We'll stick to showing Candidate name for Referrer view.
                // For Candidate view, we show Referrer? 
                // 'jobs' mock has Referrer info. 
                // For this Refactor, let's just show the Candidate object if available (Referrer View).
                // If Candidate View? 
                // The prompt focuses on Referrer Discover CTA.

                const otherPartyId = role === "referrer" ? match.candidateId : match.referrerId;
                const candidate = candidates[match.candidateId];

                // If I am candidate, I want to see Referrer Name.
                // We don't have Referrers in 'candidates' storage.
                // We have 'jobs' mock in Discover screen, but that's local to Discover.
                // We might default to "Referrer" or "Company" if data missing.

                let displayName = "Unknown";
                if (role === "referrer") {
                    displayName = candidate ? candidate.firstName : "Candidate";
                } else {
                    // As candidate, we matched with a Referrer (posting a Job).
                    // We don't have Referrer Storage yet.
                    displayName = "Recruiter";
                }

                return (
                    <MatchRow
                        key={match.id}
                        id={match.candidateId} // Legacy: click navigates to chat w/ candidateId
                        name={displayName}
                        timestamp={formatTime(match.updatedAt)}
                        isUnread={match.connectionState === "matched" || match.connectionState === "details_requested"}
                    />
                );
            })}
        </div>
    );
}
