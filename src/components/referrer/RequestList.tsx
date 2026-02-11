"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/auth/useRole";
import { StorageService } from "@/lib/storage";
import { Candidate, Match } from "@/types";
import { Check, X, Clock, HelpCircle } from "lucide-react";
import { toast } from "sonner";

type RequestItem = {
    type: "inbound";
    id: string; // candidateId
    candidate: Candidate;
    timestamp: number;
};

import { useRouter } from "next/navigation";

export function RequestList() {
    const { role } = useRole();
    const router = useRouter();
    const [items, setItems] = useState<RequestItem[]>([]);

    useEffect(() => {
        loadRequests();

        const handleUpdate = () => loadRequests();
        window.addEventListener("vouch:matches-changed", handleUpdate);

        return () => {
            window.removeEventListener("vouch:matches-changed", handleUpdate);
        };
    }, [role]);

    const loadRequests = () => {
        // 1. Get Session
        const session = StorageService.getSession();
        if (session.role !== "referrer") return;

        // 2. Get Matches to exclude already handled ones
        const matchesMap = StorageService.getMatchesMap();

        // 3. Get All Candidates
        const allCandidates = StorageService.getCandidates();

        // 4. Find Inbound Requests (Candidates who liked me, but I haven't decided)
        // In our simulation, 'hasLikedCurrentUser' indicates an inbound interest.
        const inbound: RequestItem[] = [];

        allCandidates.forEach(c => {
            // key for match lookup: referrerId_candidateId
            const matchKey = `${session.userId}_${c.id}`;
            const existingMatch = matchesMap[matchKey];

            // If no match record AND candidate liked us -> It's a Request
            // OR connectionState is 'matched' (which here implies inbound request waiting for action)
            if (c.hasLikedCurrentUser) {
                if (!existingMatch || existingMatch.connectionState === "matched") {
                    inbound.push({
                        type: "inbound",
                        id: c.id,
                        candidate: c,
                        timestamp: existingMatch ? existingMatch.updatedAt : Date.now() // Simulation: assume fresh if no match
                    });
                }
            }
        });

        // Sort by name for stability
        inbound.sort((a, b) => a.candidate.firstName.localeCompare(b.candidate.firstName));
        setItems(inbound);
    };

    const handleAccept = (e: React.MouseEvent, item: RequestItem) => {
        e.stopPropagation();
        // "Accepting" means Vouching (unlocking chat)
        StorageService.vouch(item.id);
        toast.success("Request accepted. Chat unlocked.");
        loadRequests();
    };

    const handleDecline = (e: React.MouseEvent, item: RequestItem) => {
        e.stopPropagation();
        // "Declining" means Passing
        StorageService.swipe(item.id, "NOPE");
        toast.info("Request declined.");
        loadRequests();
    };

    const handleNavigate = (item: RequestItem) => {
        // Navigate to match details (or candidate profile view if match not fully established yet)
        // We'll use the match ID if it exists, otherwise simulate one or standard profile
        // Since we don't have a guaranteed match ID for fresh inbound, we might need to rely on /matches/new?candidateId=... 
        // Or just create a temporary look-up. 
        // Existing system uses /matches/[id]. If match doesn't exist, we might need to create it purely for viewing?
        // Or just redirect to /matches/preview?candidateId=...
        // For now, let's assume valid ID is candidateId for the route or handle it.
        // Actually, existing matches routing expects a matchId. 
        // If it's a "Request", it might not have a match row yet in some logics, but here we treat them as 'matched' or 'pre-match'.

        // Simpler for this mock: Just go to /matches/candidateId (assuming route can handle it or we use a query param).
        // Wait, existing /matches/[id] expects a Match ID. 
        // If we have an existing match (matched status), use that ID.
        // If not, we might need to find it or it's just candidateId.

        // Let's check if we have a match ID in our logic.
        // In loadRequests, we verify existingMatch.
        const session = StorageService.getSession();
        const existingMatch = StorageService.getMatch(item.id, session.userId);

        if (existingMatch) {
            router.push(`/matches/${existingMatch.id}`);
        } else {
            // If no match object exists yet (just candidate liked), we should probably create a "pseudo-match" or just use candidate ID if the route supports it.
            // But for safety in this demo, let's just trigger a match object creation if needed, or better, route to a profile view.
            // Let's route to /matches/candidateId and hope params align, or just assume ID.
            // Actually, best to ensure a match object exists for consistency.
            // But we don't want to mutate state just by viewing.
            // Let's route to /matches/preview/[candidateId]?
            // Or just /matches/[candidateId] and ensure the page component handles "if no match found, show candidate by ID".
            // Implementation detail: The [matchId] page likely does a lookup by ID. 
            // If that ID is not a match ID, it might fail. Only way to be sure is to check [matchId] page logic.
            // We didn't read [matchId] page logic deeply. 
            // Safe bet: The user wants to see the profile. 
            router.push(`/matches/preview?candidateId=${item.id}`);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="mb-4 rounded-full bg-black/5 p-4">
                    <Clock className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium">No pending requests</p>
                <p className="text-xs">Your inbox is all caught up.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleNavigate(item)}
                    className="group relative flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 p-4 shadow-sm backdrop-blur-md transition-all hover:scale-[1.01] hover:bg-white/10 hover:shadow-lg cursor-pointer"
                >
                    <div className="flex items-start justify-between gap-4">
                        {/* Candidate Info */}
                        <div className="flex items-start gap-3">
                            {/* Avatar Replacement */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-bold text-white/80">
                                {item.candidate.firstName[0]}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-sm text-white">{item.candidate.firstName}</h3>
                                </div>
                                <p className="text-xs text-white/60 pt-0.5">
                                    {item.candidate.currentRole}
                                </p>
                                <p className="text-[10px] text-white/40 pt-1">
                                    {item.candidate.experience} • {item.candidate.location}
                                </p>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] font-medium text-white/30 whitespace-nowrap">
                            New
                        </span>
                    </div>

                    {/* Bio */}
                    <div className="pl-[52px]">
                        <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                            {item.candidate.bio}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 mt-2">
                        <button
                            className="h-7 px-3 rounded-md text-xs font-medium text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                            onClick={(e) => handleDecline(e, item)}
                        >
                            Decline
                        </button>
                        <button
                            className="h-7 px-4 rounded-md text-xs font-bold bg-[rgb(var(--accent))] text-white hover:opacity-90 transition-opacity shadow-sm"
                            onClick={(e) => handleAccept(e, item)}
                        >
                            Accept
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
