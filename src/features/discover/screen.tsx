"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Surface from "@/components/common/Surface";
import { StorageService, EVENTS } from "@/lib/storage";
import { Candidate, ConnectionState } from "@/types";
import {
  initializePortfolioItems,
  getPortfolioItems,
} from "@/lib/contextStorage";
import { SEED_PORTFOLIO_ITEMS } from "@/lib/seedPortfolio";
import { useRole } from "@/lib/auth/useRole";
import JobCard from "./components/JobCard";

/* ---------- Mock Jobs ---------- */
const jobs = [
  {
    id: "j1",
    title: "Senior SolIdity Engineer",
    company: "Kraken",
    salary: "$180k - $240k",
    location: "Remote",
    description: "Join our core blockchain team to build the future of localized finance. We are looking for deep expertise in EVM and Rust.",
    referrer: { name: "Sarah", role: "Eng Manager at Kraken" }
  },
  {
    id: "j2",
    title: "Staff AI Researcher",
    company: "Anthropic",
    salary: "$300k - $500k",
    location: "SF",
    description: "Work on alignment and safety for our next generation foundation models.",
    referrer: { name: "David", role: "Researcher at Anthropic" }
  }
];

export default function Screen() {
  const router = useRouter();
  const { role } = useRole();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState<"left" | "right" | "up" | null>(null);
  const [matchNotification, setMatchNotification] = useState<Candidate | null>(null);

  // Strict typed ConnectionState
  const [connectionState, setConnectionState] = useState<ConnectionState | undefined>(undefined);

  // Initialize data on mount
  useEffect(() => {
    StorageService.seed();
    setCandidates(StorageService.getFeed());

    // Listen for storage changes to refresh feed if needed
    const handleUpdate = () => {
      // Refresh feed if matches change (e.g. might remove item from feed)
      // But careful not to disrupt current animation or index.
      // For now we just update connectionState of current Item.
    };
    window.addEventListener(EVENTS.MATCH_UPDATED, handleUpdate);

    // Initialize portfolio items if not already done
    const existing = getPortfolioItems();
    if (existing.length === 0) {
      initializePortfolioItems(SEED_PORTFOLIO_ITEMS);
    }

    return () => window.removeEventListener(EVENTS.MATCH_UPDATED, handleUpdate);
  }, []);

  // Determine data based on role
  const isCandidate = role === "candidate";
  const data = isCandidate ? jobs : candidates;
  const currentItem = data[currentIndex];

  // Update connection state when current item changes
  useEffect(() => {
    if (!currentItem || isCandidate) return;
    const candidate = currentItem as Candidate;
    const session = StorageService.getSession();

    // Get Match object
    const match = StorageService.getMatch(candidate.id, session.userId);
    // If match exists, use its state. If not, undef
    setConnectionState(match ? match.connectionState : undefined);

  }, [currentIndex, role, currentItem]);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (!currentItem) return;
    setIsLeaving(direction);

    if (!isCandidate) {
      const candidateId = (currentItem as Candidate).id;
      let action: "LIKE" | "NOPE" | "DEMO" = "LIKE";

      if (direction === "left") {
        action = "NOPE";
      }

      // Perform Swipe
      // Note: "Request Details" CTA handling is separate below. 
      // This is for generic swipe actions (if gestures enabled) or Pass button.
      StorageService.swipe(candidateId, action);
    }

    setTimeout(() => {
      // ALWAYS advance
      setCurrentIndex((prev) => prev + 1);
      setIsLeaving(null);
    }, 400);
  };

  const handleRequestDetailsCTA = () => {
    if (!currentItem) return;
    const candidateId = (currentItem as Candidate).id;

    // Logic:
    // 1. Swipe Like (Create Match 'matched')
    // 2. Request Details (Update Match 'details_requested')

    const { isMatch } = StorageService.swipe(candidateId, "LIKE");

    // If it was a match (or demo match), we request details
    if (isMatch) {
      StorageService.requestDetails(candidateId);
    }

    // Animate away
    setIsLeaving("right");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsLeaving(null);
    }, 400);
  };

  if (!currentItem) {
    return (
      <div className="min-h-[calc(100dvh-96px)] w-full px-6 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-white mb-4">No more profiles</h2>
        <p className="text-gray-400 text-center max-w-md">
          You've viewed all available candidates. Check back later for new matches!
        </p>
        <button
          onClick={() => {
            StorageService.reset();
            setCandidates(StorageService.getFeed());
            setCurrentIndex(0);
            setMatchNotification(null);
          }}
          className="mt-8 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors"
        >
          [Debug] Reset Demo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-96px)] w-full px-6 relative">
      {/* Match Modal (Polished) */}
      {matchNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-modal-overlay"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMatchNotification(null);
            } else if (e.key === "Enter") {
              setMatchNotification(null);
            }
          }}
          tabIndex={-1}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setMatchNotification(null)} />

          {/* Card */}
          <div
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-[#18181b]/90 p-8 text-center shadow-2xl animate-modal-card"
            style={{
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)"
            }}
          >
            {/* Icon: Sync/Bidirectional Arrows */}
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-90">
                <path d="M20 7h-9" />
                <path d="M14 17H5" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
            </div>

            <h3 className="text-2xl font-semibold tracking-tight text-white mb-2">It's a Match</h3>
            <p className="text-sm text-white/70 mb-8 leading-relaxed">
              You and <span className="text-white font-medium">{matchNotification.firstName}</span> are interested in each other.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setMatchNotification(null)}
                className="btn-base btn-primary w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide"
              >
                Keep Swiping
              </button>
              <button
                onClick={() => {
                  setMatchNotification(null);
                  router.push("/matches");
                }}
                className="btn-base btn-secondary w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide"
              >
                Go to Matches
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="mx-auto max-w-3xl">
        <h1
          className="text-4xl font-bold tracking-tight text-white mb-2"
        >
          {isCandidate ? "Opportunities" : "Top Talent"}
        </h1>
        <p className="text-sm text-gray-400">
          {isCandidate
            ? "Curated roles from verified insiders."
            : "Curated professionals from verified sources."
          }
        </p>
      </div>

      {/* Card stage */}
      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="h-[70vh] min-h-[520px] max-h-[680px]">
            {isCandidate ? (
              <JobCard
                key={currentItem.id}
                job={currentItem as any}
                onSwipe={handleSwipe}
                isLeaving={isLeaving}
              />
            ) : (
              <SwipeableCard
                key={currentItem.id}
                candidate={currentItem as any}
                onSwipe={handleSwipe}
                onRequestDetails={handleRequestDetailsCTA}
                isLeaving={isLeaving}
                connectionState={connectionState}
              />
            )}

          </div>
        </div>
      </div>

    </div>
  );
}

/* ---------- Components ---------- */

interface SwipeableCardProps {
  candidate: Candidate;
  onSwipe: (direction: "left" | "right" | "up") => void;
  onRequestDetails?: () => void;
  isLeaving: "left" | "right" | "up" | null;
  connectionState: ConnectionState | undefined;
}

function SwipeableCard({
  candidate,
  onSwipe,
  onRequestDetails,
  isLeaving,
  connectionState
}: SwipeableCardProps) {
  const getAnimationClass = () => {
    if (isLeaving === "right") return "animate-swipe-right";
    if (isLeaving === "left") return "animate-swipe-left";
    if (isLeaving === "up") return "animate-swipe-up";
    return "";
  };

  // Render CTA buttons based on state
  const renderActions = () => {
    // 1. Details Requested OR Vouched
    if (connectionState === "details_requested" || connectionState === "vouched") {
      return (
        <div className="col-span-2 flex justify-center py-4">
          <span className="text-sm font-bold uppercase tracking-widest text-[#B4F9C3]" style={{ opacity: 0.8 }}>
            Details Requested
          </span>
        </div>
      );
    }

    // 2. Passed
    if (connectionState === "passed") {
      return (
        <div className="col-span-2 flex justify-center py-4">
          <span className="text-sm font-bold uppercase tracking-widest text-white/50">
            Passed
          </span>
        </div>
      );
    }

    // 3. Initial OR Matched (Pre-Request) -> Show Request Details
    return (
      <>
        <button
          onClick={() => onSwipe("left")}
          className="btn-base btn-neutral w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wide"
        >
          Pass
        </button>
        <button
          onClick={onRequestDetails}
          className="btn-base btn-primary w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wide"
        >
          Request Details
        </button>
      </>
    );
  };

  return (
    <div
      className={`h-full w-full cursor-grab select-none active:cursor-grabbing ${getAnimationClass()}`}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 40px -10px rgba(var(--accent), 0.15)"
      }}
    >
      <Surface>
        <div className="relative flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-white leading-none">
                {candidate.firstName}, {candidate.age}
              </h2>
              <div
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                style={{
                  color: "rgb(var(--accent))",
                  background: "rgba(var(--accent), 0.1)",
                  border: "1px solid rgba(var(--accent), 0.2)"
                }}
              >
                Candidate
              </div>
            </div>

            <h3 className="text-xl font-medium mt-1" style={{ color: "rgb(var(--accent))" }}>
              {candidate.headline}
            </h3>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[var(--fg)]">
                Experience
              </div>
              <div className="text-xl font-medium text-white">
                {candidate.experience}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[var(--fg)]">
                Location
              </div>
              <div className="text-lg font-medium text-white">
                {candidate.location}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 text-[var(--fg)]">
                Education
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                  {(candidate.education || "?").charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{candidate.education || "Unknown Education"}</div>
                  <div className="text-xs text-[var(--muted)]">{candidate.skills[0]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 mt-8 text-sm leading-relaxed text-[var(--muted)] line-clamp-4">
            {candidate.bio}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {renderActions()}
          </div>

        </div>
      </Surface>
    </div>
  );
}
