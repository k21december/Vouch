"use client";

import { useRole } from "@/lib/auth/useRole";
import MatchList from "./components/MatchList";
import RequestCard from "./components/RequestCard";
import { StorageService } from "@/lib/storage";
import { Match, Candidate } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MatchesScreen() {
  const { role } = useRole();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // Initial fetch
    const loadData = () => {
      const ms = StorageService.getMatchesList(role as "referrer" | "candidate");
      const cs = StorageService.getCandidates();
      setMatches(ms);
      setCandidates(cs);
    };

    loadData();

    // Listen for updates
    const handleUpdate = () => loadData();
    window.addEventListener("vouch:matches-changed", handleUpdate);
    return () => window.removeEventListener("vouch:matches-changed", handleUpdate);
  }, [role]);

  // Derived state
  const requests = matches.filter(m => m.connectionState === "matched");
  const active = matches.filter(m => m.connectionState === "vouched" || m.connectionState === "details_requested");

  if (role === "referrer") {
    return (
      <div className="min-h-[calc(100dvh-96px)] w-full px-6 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-6">Inbox</h1>

        <div className="space-y-8">
          {/* New Requests */}
          {requests.length > 0 && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2" style={{ color: "var(--fg)" }}>
                New Requests ({requests.length})
              </div>
              <div className="space-y-3">
                {requests.map(match => {
                  const candidate = candidates.find(c => c.id === match.candidateId);
                  if (!candidate) return null;
                  return (
                    <RequestCard
                      key={match.id}
                      match={match}
                      candidate={candidate}
                      onPress={() => router.push(`/matches/${match.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Network */}
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2" style={{ color: "var(--fg)" }}>
              Your Network
            </div>
            {active.length === 0 ? (
              <div className="p-8 rounded-[var(--radius-lg)] border border-white/5 bg-white/5 text-center text-white/40 text-sm">
                No active connections yet.
              </div>
            ) : (
              <MatchList filterState={["vouched", "details_requested"]} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Candidate View (Unchanged mostly, just using MatchList)
  return (
    <div className="min-h-[calc(100dvh-96px)] w-full px-6 flex flex-col">
      {/* Header */}
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">Matches</h1>

      {/* Matches List */}
      <div className="space-y-4">
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2" style={{ color: "var(--fg)" }}>
          Recent Matches
        </div>
        <MatchList />
      </div>
    </div>
  );
}
