"use client";

import Link from "next/link";

import ChatInterface from "./components/ChatInterface";
import { StorageService } from "@/lib/storage";
import { useRole } from "@/lib/auth/useRole";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import PortfolioCard from "./components/PortfolioCard";

export default function MatchDetailScreen({ matchId }: { matchId: string }) {
    const { role } = useRole();
    const router = useRouter();
    // Force re-render on vouch
    const [isVouched, setIsVouched] = useState(false);
    const [isRequest, setIsRequest] = useState(false);

    // In a real app, fetch match details by ID
    // We need to fetch the candidate name based on matchId
    // Since we don't have a direct "getById" handy that is sync, we can assume matchId is correct
    // But let's just use a placeholder name or fetch from storage if possible.
    const [candidateName, setCandidateName] = useState("Candidate");

    useEffect(() => {
        // Load initial state
        if (typeof window !== "undefined") {
            const allMatches = StorageService.getMatchesMap();
            const foundMatch = Object.values(allMatches).find(m => m.id === matchId);

            if (foundMatch) {
                setIsVouched(foundMatch.connectionState === "vouched");
                if (foundMatch.connectionState === "matched") {
                    setIsRequest(true);
                }
            }
        }

        // Get candidate name
        if (typeof window !== "undefined") {
            const candidates = StorageService.getCandidates();
            // In the current mock, matchId is sometimes used as candidateId in earlier code, 
            // but in StorageService.swipe, match.id is UUID. 
            // We need to find the match object to get candidateId.
            const allMatches = StorageService.getMatchesMap();
            const foundMatch = Object.values(allMatches).find(m => m.id === matchId);

            if (foundMatch) {
                const c = candidates.find(cand => cand.id === foundMatch.candidateId);
                if (c) setCandidateName(c.firstName);
            }
        }
    }, [matchId]);

    const handleVouch = () => {
        StorageService.acceptRequest(matchId);
        setIsVouched(true);
        setIsRequest(false);
    };

    return (
        <div className="flex h-[calc(100dvh-96px)] w-full flex-col px-6">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4 py-4">
                    <Link
                        href={role === "referrer" && isRequest ? "/requests" : "/matches"}
                        className="nav-item !h-10 !w-10 !p-0 rounded-full border border-white/10 hover:bg-white/5"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-white">{candidateName}</h1>
                        <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                            {isVouched ? "Vouched Connection" : "Match Pending Vouch"}
                        </span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto lg:overflow-visible">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:h-full">

                        {/* LEFT COLUMN: Decision / Vouch / Chat Lock */}
                        <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
                            {role === "referrer" ? (
                                <>
                                    {/* Action Area */}
                                    {isVouched ? (
                                        <div className="flex-1 rounded-[var(--radius-lg)] bg-[var(--surface-base)] border border-white/5 overflow-hidden flex flex-col">
                                            <ChatInterface matchId={matchId} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {isRequest ? (
                                                // Request Actions
                                                <div className="rounded-[var(--radius-lg)] bg-[var(--surface-base)] border border-white/5 p-6 flex flex-col gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">Review Request</h3>
                                                        <p className="text-sm text-[var(--muted)] mt-1">
                                                            Pass or Vouch to unlock messaging.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <button
                                                            onClick={handleVouch}
                                                            className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-strong)] transition-colors shadow-lg shadow-[var(--accent)]/20"
                                                        >
                                                            Vouch & Open Chat
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                StorageService.declineRequest(matchId);
                                                                router.back();
                                                            }}
                                                            className="w-full py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-colors"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Waiting for Vouch (Locked)
                                                <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] bg-white/5 border border-white/5 p-8 text-center min-h-[300px]">
                                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                            <path d="M8 10h.01"></path>
                                                            <path d="M12 10h.01"></path>
                                                            <path d="M16 10h.01"></path>
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2">Unlock Messaging</h3>
                                                    <p className="text-[var(--muted)] max-w-xs mb-8">
                                                        Messaging is disabled until you vouch for this candidate.
                                                    </p>
                                                    <button
                                                        onClick={handleVouch}
                                                        className="btn-base btn-primary px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide"
                                                    >
                                                        Vouch & Open Chat
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Candidate View (Simplified for now)
                                <div className="flex text-[var(--muted)]">
                                    Candidate view coming soon.
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Portfolio / Evidence */}
                        <div className="lg:col-span-7 xl:col-span-8 lg:h-full lg:overflow-y-auto pb-10">
                            <PortfolioCard />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
